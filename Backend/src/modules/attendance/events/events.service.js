import crypto from "node:crypto";
import { HikvisionClient } from "../hikvision/hikvision.client.js";
import { eventsModel as m } from "./events.model.js";
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
          const from = input.from
              ? `${input.from}T00:00:00Z`
              : new Date(Date.now() - 86400000).toISOString(),
            to = input.to ? `${input.to}T23:59:59Z` : new Date().toISOString(),
            api = new HikvisionClient(d),
            searchID = crypto.randomUUID().replaceAll("-", ""),
            people = new Map(
              (await m.people(d.id)).map((person) => [
                person.employeeNo,
                person,
              ]),
            );
          let position = 0;
          for (let page = 0; page < 100; page++) {
            const info =
                (await api.events(from, to, position, searchID)).AcsEvent ?? {},
              list = info.InfoList ?? [];
            await Promise.all(
              list.map(async (event) => {
                const employeeNo = String(
                    event.employeeNoString ?? event.employeeNo ?? "",
                  ).trim(),
                  occurredAt = new Date(event.time);
                if (
                  !employeeNo ||
                  Number.isNaN(occurredAt.getTime()) ||
                  (d.eventsClearedAt && occurredAt <= d.eventsClearedAt)
                )
                  return;
                const p = people.get(employeeNo),
                  serial = event.serialNo ?? event.serialNumber,
                  deviceEventId =
                    serial != null
                      ? String(serial)
                      : `${employeeNo}:${occurredAt.toISOString()}:${event.major ?? 0}:${event.minor ?? 0}`;
                await m.upsert(d.id, deviceEventId, {
                  personId: p?.id,
                  employeeNo,
                  personName: event.name ?? p?.name,
                  eventType: d.eventType ?? "check_in",
                  occurredAt,
                  verification: event.currentVerifyMode,
                });
                synced++;
              }),
            );
            position += list.length;
            if (
              !list.length ||
              position >=
                Number(info.totalMatches ?? info.numOfMatches ?? position)
            )
              break;
          }
          await m.status(d.id, { status: "online", lastSeenAt: new Date() });
          return { synced };
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
      errors: results.flatMap((result) => (result.error ? [result.error] : [])),
    };
  },
};
