import http from "node:http";
// Hikvision ISAPI client used by the attendance services.
import crypto from "node:crypto";

const md5 = (value) => crypto.createHash("md5").update(value).digest("hex");
const parseChallenge = (value) =>
  Object.fromEntries(
    [...value.matchAll(/(\w+)=(?:"([^"]*)"|([^,\s]+))/g)].map((m) => [
      m[1],
      m[2] ?? m[3],
    ]),
  );
const wait = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export class HikvisionClient {
  constructor({ ipAddress, port, username, password }) {
    Object.assign(this, { ipAddress, port, username, password });
  }
  request(
    method,
    path,
    body,
    contentType = "application/json",
    timeout = 12000,
  ) {
    const send = (authorization) =>
      new Promise((resolve, reject) => {
        const payload =
          body == null
            ? null
            : typeof body === "string" || Buffer.isBuffer(body)
              ? body
              : JSON.stringify(body);
        const req = http.request(
          {
            host: this.ipAddress,
            port: this.port,
            path,
            method,
            timeout,
            headers: {
              Accept: contentType.includes("xml")
                ? "application/xml"
                : contentType.startsWith("image/")
                  ? contentType
                  : "application/json",
              ...(payload
                ? {
                    "Content-Type": contentType,
                    "Content-Length": Buffer.byteLength(payload),
                  }
                : {}),
              ...(authorization ? { Authorization: authorization } : {}),
            },
          },
          (res) => {
            const chunks = [];
            res.on("data", (c) => chunks.push(c));
            res.on("end", () => {
              const buffer = Buffer.concat(chunks);
              resolve({
                status: res.statusCode,
                headers: res.headers,
                buffer,
                text: buffer.toString(),
              });
            });
          },
        );
        req.on("timeout", () => {
          const error = new Error("Device connection timed out.");
          error.code = "ETIMEDOUT";
          error.status = 504;
          req.destroy(error);
        });
        req.on("error", (error) => {
          if (!error.status)
            error.status = error.code === "ETIMEDOUT" ? 504 : 502;
          reject(error);
        });
        if (payload) req.write(payload);
        req.end();
      });
    return send().then(async (first) => {
      if (
        first.status !== 401 ||
        !first.headers["www-authenticate"]?.startsWith("Digest")
      )
        return this.finish(first);
      const c = parseChallenge(first.headers["www-authenticate"]);
      const nc = "00000001";
      const cnonce = crypto.randomBytes(8).toString("hex");
      const qop = c.qop?.split(",")[0] ?? "auth";
      const response = md5(
        `${md5(`${this.username}:${c.realm}:${this.password}`)}:${c.nonce}:${nc}:${cnonce}:${qop}:${md5(`${method}:${path}`)}`,
      );
      const auth = `Digest username="${this.username}", realm="${c.realm}", nonce="${c.nonce}", uri="${path}", response="${response}", qop=${qop}, nc=${nc}, cnonce="${cnonce}"${c.opaque ? `, opaque="${c.opaque}"` : ""}`;
      return this.finish(await send(auth));
    });
  }
  alertStream(onData, signal) {
    const path = "/ISAPI/Event/notification/alertStream";
    let activeRequest;
    const abort = () => activeRequest?.destroy();
    const open = (authorization) =>
      new Promise((resolve, reject) => {
        const req = http.request(
          {
            host: this.ipAddress,
            port: this.port,
            path,
            method: "GET",
            headers: {
              Accept: "application/json, multipart/mixed, application/xml",
              Connection: "keep-alive",
              ...(authorization ? { Authorization: authorization } : {}),
            },
          },
          (res) => resolve({ req, res }),
        );
        req.on("error", reject);
        req.end();
      });
    const authorization = (challenge) => {
      const c = parseChallenge(challenge),
        nc = "00000001",
        cnonce = crypto.randomBytes(8).toString("hex"),
        qop = c.qop?.split(",")[0] ?? "auth",
        response = md5(
          `${md5(`${this.username}:${c.realm}:${this.password}`)}:${c.nonce}:${nc}:${cnonce}:${qop}:${md5(`GET:${path}`)}`,
        );
      return `Digest username="${this.username}", realm="${c.realm}", nonce="${c.nonce}", uri="${path}", response="${response}", qop=${qop}, nc=${nc}, cnonce="${cnonce}"${c.opaque ? `, opaque="${c.opaque}"` : ""}`;
    };
    signal?.addEventListener("abort", abort, { once: true });
    return new Promise((resolve, reject) => {
      const connect = async () => {
        try {
          let result = await open();
          activeRequest = result.req;
          if (
            result.res.statusCode === 401 &&
            result.res.headers["www-authenticate"]?.startsWith("Digest")
          ) {
            result.res.resume();
            result = await open(
              authorization(result.res.headers["www-authenticate"]),
            );
            activeRequest = result.req;
          }
          if (result.res.statusCode < 200 || result.res.statusCode >= 300) {
            result.res.resume();
            throw new Error(
              `Hikvision alert stream rejected the request (${result.res.statusCode}).`,
            );
          }
          result.res.on("data", onData);
          result.res.on("end", resolve);
          result.res.on("error", reject);
        } catch (error) {
          reject(error);
        }
      };
      void connect();
    }).finally(() => signal?.removeEventListener("abort", abort));
  }
  async readRequest(
    method,
    path,
    body,
    contentType = "application/json",
    timeout = 12000,
  ) {
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await this.request(method, path, body, contentType, timeout);
      } catch (error) {
        const transient =
          [
            "ECONNRESET",
            "ETIMEDOUT",
            "EHOSTUNREACH",
            "ECONNREFUSED",
            "EPIPE",
          ].includes(error.code) ||
          /timed out|socket hang up/i.test(error.message);
        if (!transient || attempt === 2) throw error;
        lastError = error;
        await wait(750 * (attempt + 1));
      }
    }
    throw lastError;
  }
  finish(result) {
    let payload;
    try {
      payload = JSON.parse(result.text);
    } catch {}
    const responseStatus = payload?.ResponseStatus ?? payload;
    const deviceRejectedSuccess =
      result.status >= 200 &&
      result.status < 300 &&
      responseStatus?.statusCode !== undefined &&
      Number(responseStatus.statusCode) !== 1;
    if (result.status < 200 || result.status >= 300 || deviceRejectedSuccess) {
      const detail =
        responseStatus?.subStatusCode ??
        responseStatus?.statusString ??
        responseStatus?.errorMsg ??
        result.text.match(/<(?:subStatusCode|statusString)>([^<]+)</)?.[1] ??
        result.text.slice(0, 240) ??
        "Unknown device error";
      const error = new Error(
        `Hikvision device rejected the request (${result.status}): ${detail}`,
      );
      error.status = 502;
      error.deviceStatus = responseStatus?.subStatusCode;
      error.deviceErrorCode = responseStatus?.errorCode;
      throw error;
    }
    if (String(result.headers["content-type"] ?? "").startsWith("image/"))
      return result.buffer;
    try {
      return JSON.parse(result.text);
    } catch {
      return result.text;
    }
  }
  info() {
    return this.readRequest("GET", "/ISAPI/System/deviceInfo?format=json");
  }
  addUser(person) {
    return this.request(
      "POST",
      "/ISAPI/AccessControl/UserInfo/Record?format=json",
      {
        UserInfo: {
          employeeNo: person.employeeNo,
          name: person.name,
          userType: "normal",
          Valid: {
            enable: true,
            beginTime: "2020-01-01T00:00:00",
            endTime: "2037-12-31T23:59:59",
          },
          doorRight: "1",
          RightPlan: [{ doorNo: 1, planTemplateNo: "1" }],
        },
      },
    );
  }
  updateUser(person) {
    return this.request(
      "PUT",
      "/ISAPI/AccessControl/UserInfo/Modify?format=json",
      { UserInfo: { employeeNo: person.employeeNo, name: person.name } },
    );
  }
  setUserPassword(person, password) {
    return this.request(
      "PUT",
      "/ISAPI/AccessControl/UserInfo/Modify?format=json",
      {
        UserInfo: {
          employeeNo: person.employeeNo,
          name: person.name,
          userType: "normal",
          password,
          userVerifyMode: "faceOrFpOrCardOrPw",
        },
      },
    );
  }
  deleteUser(employeeNo) {
    return this.request(
      "PUT",
      "/ISAPI/AccessControl/UserInfo/Delete?format=json",
      { UserInfoDelCond: { EmployeeNoList: [{ employeeNo }] } },
    );
  }
  async allUsers() {
    const searchID = crypto.randomUUID().replaceAll("-", "");
    const users = [];
    let position = 0;
    while (true) {
      const result = await this.readRequest(
        "POST",
        "/ISAPI/AccessControl/UserInfo/Search?format=json",
        {
          UserInfoSearchCond: {
            searchID,
            searchResultPosition: position,
            maxResults: 100,
          },
        },
      );
      const page = result.UserInfoSearch?.UserInfo ?? [];
      users.push(...page);
      position += page.length;
      const total = Number(result.UserInfoSearch?.totalMatches ?? users.length);
      if (!page.length || position >= total) break;
    }
    return users;
  }
  addCard(employeeNo, cardNo) {
    return this.request(
      "POST",
      "/ISAPI/AccessControl/CardInfo/Record?format=json",
      { CardInfo: { employeeNo, cardNo, cardType: "normalCard" } },
    );
  }
  deleteCards(employeeNo) {
    return this.request(
      "PUT",
      "/ISAPI/AccessControl/CardInfo/Delete?format=json",
      { CardInfoDelCond: { EmployeeNoList: [{ employeeNo }] } },
    );
  }
  async deleteFingerprint(employeeNo) {
    await this.request(
      "PUT",
      "/ISAPI/AccessControl/FingerPrint/Delete?format=json",
      {
        FingerPrintDelete: {
          mode: "byEmployeeNo",
          EmployeeNoDetail: {
            employeeNo,
            enableCardReader: [1],
            fingerPrintID: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          },
        },
      },
      "application/json",
      30000,
    );
    for (let attempt = 0; attempt < 20; attempt++) {
      await wait(750);
      const result = await this.readRequest(
        "GET",
        "/ISAPI/AccessControl/FingerPrint/DeleteProcess?format=json",
      );
      const status = String(
        result.FingerPrintDeleteProcess?.status ??
          result.FingerPrintDeleteProcessResult?.status ??
          "",
      ).toLowerCase();
      if (status === "success") return result;
      if (status === "failed") {
        const error = new Error(
          "The Hikvision terminal failed to delete the fingerprint.",
        );
        error.status = 502;
        throw error;
      }
    }
    const error = new Error(
      "Timed out while waiting for fingerprint deletion to finish.",
    );
    error.status = 504;
    throw error;
  }
  deleteFace(employeeNo) {
    return this.request(
      "PUT",
      "/ISAPI/Intelligent/FDLib/FDSetUp?format=json",
      {
        faceLibType: "blackFD",
        FDID: "1",
        FPID: employeeNo,
        deleteFP: true,
      },
      "application/json",
      30000,
    );
  }
  clearUserPassword(person) {
    return this.request(
      "PUT",
      "/ISAPI/AccessControl/UserInfo/Modify?format=json",
      {
        UserInfo: {
          employeeNo: person.employeeNo,
          name: person.name,
          password: "",
        },
      },
    );
  }
  async captureFingerprint(employeeNo) {
    const xml =
      '<?xml version="1.0" encoding="UTF-8"?><CaptureFingerPrintCond xmlns="http://www.isapi.org/ver20/XMLSchema" version="2.0"><fingerNo>1</fingerNo></CaptureFingerPrintCond>';
    let data;
    for (let attempt = 0; attempt < 6 && !data; attempt++) {
      const captured = await this.request(
        "POST",
        "/ISAPI/AccessControl/CaptureFingerPrint",
        xml,
        "application/xml",
        35000,
      );
      data =
        typeof captured === "string"
          ? captured.match(/<fingerData>\s*([^<]+?)\s*<\/fingerData>/)?.[1]
          : (captured.CaptureFingerPrintCfg?.fingerData ??
            captured.FingerPrintInfo?.fingerData);
      if (!data) await wait(1500);
    }
    if (!data) {
      const error = new Error(
        "No fingerprint was captured after waiting for the terminal.",
      );
      error.status = 504;
      throw error;
    }
    return this.request(
      "POST",
      "/ISAPI/AccessControl/FingerPrint/SetUp?format=json",
      {
        FingerPrintCfg: {
          employeeNo,
          enableCardReader: [1],
          fingerPrintID: 1,
          fingerType: "normalFP",
          fingerData: data,
          checkEmployeeNo: true,
        },
      },
      "application/json",
      30000,
    );
  }
  async captureFace(employeeNo, name) {
    const xml =
      '<?xml version="1.0" encoding="UTF-8"?><CaptureFaceDataCond xmlns="http://www.isapi.org/ver20/XMLSchema" version="2.0"><captureInfrared>false</captureInfrared><dataType>url</dataType></CaptureFaceDataCond>';
    let image;
    let lastTransientError;
    for (let attempt = 0; attempt < 10 && !image; attempt++) {
      let captured;
      try {
        captured = await this.request(
          "POST",
          "/ISAPI/AccessControl/CaptureFaceData",
          xml,
          "application/xml",
          35000,
        );
      } catch (error) {
        const busy =
          /device\s*busy/i.test(error.message) ||
          /busy/i.test(error.deviceStatus ?? "");
        const disconnected =
          ["ECONNRESET", "ETIMEDOUT", "EPIPE"].includes(error.code) ||
          /timed out/i.test(error.message);
        if (busy || disconnected) {
          lastTransientError = error;
          await wait(busy ? 5000 : 2000);
          continue;
        }
        error.message = `Face capture failed: ${error.message}`;
        throw error;
      }
      if (Buffer.isBuffer(captured)) image = captured;
      else {
        const faceUrl =
          typeof captured === "string"
            ? captured.match(/<faceDataUrl>\s*([^<]+?)\s*<\/faceDataUrl>/i)?.[1]
            : (captured.CaptureFaceData?.faceDataUrl ??
              captured.CaptureFaceDataResult?.faceDataUrl);
        if (faceUrl) {
          const decodedUrl = faceUrl.replaceAll("&amp;", "&");
          const imagePath = decodedUrl.startsWith("http")
            ? `${new URL(decodedUrl).pathname}${new URL(decodedUrl).search}`
            : decodedUrl;
          image = await this.request(
            "GET",
            imagePath,
            null,
            "image/jpeg",
            30000,
          );
        }
        const faceData =
          typeof captured === "string"
            ? captured.match(
                /<(?:faceData|facePic|pictureData)>\s*([^<]+?)\s*<\/(?:faceData|facePic|pictureData)>/,
              )?.[1]
            : (captured.CaptureFaceDataResult?.faceData ??
              captured.CaptureFaceDataResult?.facePic ??
              captured.FaceData?.faceData);
        if (!image && faceData)
          image = Buffer.from(faceData.replace(/\s/g, ""), "base64");
      }
      if (!image) await wait(2000);
    }
    if (!image?.length) {
      const error = new Error(
        lastTransientError
          ? `The terminal stayed busy or disconnected during face capture: ${lastTransientError.message}`
          : "Face capture completed, but the terminal returned no image data.",
      );
      error.status = 504;
      throw error;
    }
    const boundary = `nho-${crypto.randomBytes(12).toString("hex")}`;
    const metadata = JSON.stringify({
      faceLibType: "blackFD",
      FDID: "1",
      FPID: employeeNo,
      name,
    });
    const head = Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="FaceDataRecord"\r\nContent-Type: application/json\r\n\r\n${metadata}\r\n--${boundary}\r\nContent-Disposition: form-data; name="FaceImage"; filename="face.jpg"\r\nContent-Type: image/jpeg\r\n\r\n`,
    );
    const tail = Buffer.from(`\r\n--${boundary}--\r\n`);
    try {
      return await this.request(
        "POST",
        "/ISAPI/Intelligent/FDLib/FaceDataRecord?format=json",
        Buffer.concat([head, image, tail]),
        `multipart/form-data; boundary=${boundary}`,
        30000,
      );
    } catch (error) {
      error.message = `Face was captured but could not be saved: ${error.message}`;
      throw error;
    }
  }
  events(
    startTime,
    endTime,
    position = 0,
    searchID = crypto.randomUUID().replaceAll("-", ""),
  ) {
    const deviceTime = (value) => {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) {
        const error = new Error("Invalid attendance date filter.");
        error.status = 400;
        throw error;
      }
      return date.toISOString().replace(/\.\d{3}Z$/, "Z");
    };
    return this.readRequest(
      "POST",
      "/ISAPI/AccessControl/AcsEvent?format=json",
      {
        AcsEventCond: {
          searchID,
          searchResultPosition: position,
          maxResults: 30,
          major: 0,
          minor: 0,
          startTime: deviceTime(startTime),
          endTime: deviceTime(endTime),
        },
      },
    );
  }
  async deleteEventsThrough(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      const error = new Error("Invalid attendance cleanup cutoff.");
      error.status = 400;
      throw error;
    }
    const path = "/ISAPI/AccessControl/AcsEvent/StorageCfg?format=json";
    const previous = await this.readRequest("GET", path),
      deviceTime = String(
        await this.readRequest("GET", "/ISAPI/System/time"),
      ).match(/<localTime>([^<]+)<\/localTime>/)?.[1],
      offset = deviceTime?.match(/([+-])(\d{2}):(\d{2})$/);
    if (!offset) {
      const error = new Error("Unable to determine the terminal timezone.");
      error.status = 502;
      throw error;
    }
    const offsetMinutes =
        (offset[1] === "-" ? -1 : 1) *
        (Number(offset[2]) * 60 + Number(offset[3])),
      checkTime = new Date(date.getTime() + offsetMinutes * 60 * 1000)
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    try {
      return await this.readRequest("PUT", path, {
        EventStorageCfg: {
          mode: "time",
          checkTime,
        },
      });
    } finally {
      const config = previous.EventStorageCfg ?? previous;
      await this.readRequest("PUT", path, { EventStorageCfg: config });
    }
  }
}
