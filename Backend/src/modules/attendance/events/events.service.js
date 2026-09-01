import crypto from "node:crypto";
import { HikvisionClient } from "../hikvision/hikvision.client.js";
import { eventsModel as m } from "./events.model.js";
import { verifiedAttendanceEvent } from "./events.verification.js";

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
    const devices = await m.devices(input.deviceId);
    const results = await Promise.all(
      devices.map(async (d) => {
        let synced = 0;
        try {
          // A terminal purge is allowed only after its complete history has
          // been imported through a fixed cutoff. Date filters cannot be used
          // here because they could leave older terminal events uncopied.
          // This terminal firmware rejects the Unix epoch as an event-search
          // boundary. Year 2000 predates the device's supported event data.
          const from = "2000-01-01T00:00:00Z",
            to = new Date(),
            api = new HikvisionClient(d),
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
            if (
              !list.length ||
              position >=
                Number(info.totalMatches ?? info.numOfMatches ?? position)
            ) {
              complete = true;
              break;
            }
          }
          if (!complete)
            throw new Error(
              "The terminal event history exceeded the safe sync limit; device events were not deleted.",
            );
          await api.deleteEventsThrough(to);
          await m.status(d.id, { status: "online", lastSeenAt: new Date() });
          return { deviceId: d.id, synced, deviceEventsDeletedThrough: to };
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
      deviceEventsDeletedThrough: results.flatMap((result) =>
        result.deviceEventsDeletedThrough
          ? [
              {
                deviceId: result.deviceId,
                through: result.deviceEventsDeletedThrough,
              },
            ]
          : [],
      ),
      errors: results.flatMap((result) => (result.error ? [result.error] : [])),
    };
  },
};
