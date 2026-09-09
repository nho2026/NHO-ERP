import crypto from "node:crypto";
import { HikvisionClient } from "../hikvision/hikvision.client.js";
import { eventsModel as m } from "./events.model.js";
import { verifiedAttendanceEvent } from "./events.verification.js";
import { peopleService } from "../people/people.service.js";

export const eventsService = {
  list(q) {
    const to = q.to ? String(q.to) : "";
    return m.list({
      ...(q.deviceId && { deviceId: String(q.deviceId) }),
      ...(q.employeeNo && { employeeNo: { contains: String(q.employeeNo) } }),
      ...(q.eventType && { eventType: String(q.eventType) }),
      ...((q.from || q.to) && {
        occurredAt: {
          ...(q.from && { gte: new Date(String(q.from)) }),
          ...(to && {
            lte: new Date(to.length === 10 ? `${to}T23:59:59.999Z` : to),
          }),
        },
      }),
    });
  },
  async sync(input) {
    // Use the attendance site's Baghdad calendar month, independent of the
    // server timezone. Keep one cutoff for every device in this sync.
    const to = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Baghdad",
      year: "numeric",
      month: "2-digit",
    }).formatToParts(to);
    const year = parts.find((part) => part.type === "year").value;
    const month = parts.find((part) => part.type === "month").value;
    const from = new Date(`${year}-${month}-01T00:00:00+03:00`);
    const peopleResult = await peopleService.sync(input.deviceId);
    const devices = await m.devices(input.deviceId);
    const results = await Promise.all(
      devices.map(async (d) => {
        let synced = 0;
        try {
          // Import this month's events without modifying the terminal.
          const api = new HikvisionClient(d),
            searchID = crypto.randomUUID().replaceAll("-", ""),
            people = new Map(
              (await m.people(d.id)).map((person) => [
                person.employeeNo,
                person,
              ]),
            );
          let position = 0;
          let complete = false;
          for (let page = 0; page < 5000; page++) {
            const info =
                (await api.events(from, to, position, searchID)).AcsEvent ?? {},
              list = info.InfoList ?? [];
            for (const event of list.sort(
              (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime(),
            )) {
              const employeeNo = String(
                  event.employeeNoString ?? event.employeeNo ?? "",
                ).trim(),
                occurredAt = new Date(event.time),
                attendance = verifiedAttendanceEvent(event);
              if (
                !employeeNo ||
                Number.isNaN(occurredAt.getTime()) ||
                occurredAt < from ||
                occurredAt > to ||
                !attendance ||
                (d.eventsClearedAt && occurredAt <= d.eventsClearedAt)
              )
                continue;
              const p = people.get(employeeNo),
                serial = event.serialNo ?? event.serialNumber,
                deviceEventId =
                  serial != null
                    ? String(serial)
                    : `${employeeNo}:${occurredAt.toISOString()}:${event.major ?? 0}:${event.minor ?? 0}`;
              const result = await m.saveUnique(d.id, deviceEventId, {
                personId: p?.id,
                employeeNo,
                personName: event.name ?? p?.name,
                eventType: attendance.eventType,
                occurredAt,
                verification: attendance.verification,
              });
              if (result.created) synced++;
            }
            position += list.length;
            const more =
              info.responseStatusStrg === "MORE" ||
              position < Number(info.totalMatches ?? position);
            if (!more) {
              complete = true;
              break;
            }
            if (!list.length)
              throw new Error(
                "The terminal returned incomplete event search data.",
              );
          }
          if (!complete)
            throw new Error(
              "The terminal event history exceeded the sync limit; some events may not have been imported.",
            );
          await m.status(d.id, { status: "online", lastSeenAt: new Date() });
          return { deviceId: d.id, synced };
        } catch (error) {
          await m.status(d.id, { status: "offline" }).catch(() => {});
          return {
            synced,
            error: {
              deviceId: d.id,
              deviceName: d.name,
              message: error.message,
            },
          };
        }
      }),
    );
    return {
      synced: results.reduce((total, result) => total + result.synced, 0),
      usersSynced: peopleResult.synced,
      errors: [
        ...peopleResult.errors,
        ...results.flatMap((result) => (result.error ? [result.error] : [])),
      ],
    };
  },
};
