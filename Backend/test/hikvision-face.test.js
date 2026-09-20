import { test } from "node:test";
import assert from "node:assert/strict";
import { HikvisionClient } from "../src/modules/attendance/hikvision/hikvision.client.js";

const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 0x80, 0xff, 0xd9]);
const client = () => new HikvisionClient({});

for (const contentType of ["image/jpeg", "application/octet-stream"]) {
  test(`capture preserves binary response bytes (${contentType})`, () => {
    assert.deepEqual(client().finish({status: 200, headers: {"content-type": contentType}, buffer: jpeg, text: jpeg.toString()}), jpeg);
  });
}

test("multipart capture extracts the image without XML or boundary bytes", () => {
  const buffer = Buffer.concat([
    Buffer.from('--capture\r\nContent-Type: application/xml\r\n\r\n<CaptureFaceData/>\r\n--capture\r\nContent-Type: image/jpeg\r\nContent-Disposition: form-data; name="faceData"\r\n\r\n'),
    jpeg,
    Buffer.from('\r\n--capture--\r\n'),
  ]);
  assert.deepEqual(client().finish({status: 200, headers: {"content-type": 'multipart/mixed; boundary="capture"'}, buffer, text: buffer.toString()}), jpeg);
});

test("face enrollment requests binary capture and uploads those bytes for the selected employee", async t => {
  const api = client();
  const request = t.mock.method(api, "request", async (method, path, body, contentType) => {
    if (path === "/ISAPI/AccessControl/CaptureFaceData") {
      assert.equal(method, "POST");
      assert.equal(contentType, "application/xml");
      assert.match(body, /<dataType>binary<\/dataType>/);
      return jpeg;
    }
    assert.equal(method, "PUT");
    assert.equal(path, "/ISAPI/Intelligent/FDLib/FDSetUp?format=json");
    assert.match(contentType, /^multipart\/form-data; boundary=/);
    assert.ok(body.includes(jpeg));
    assert.match(body.toString(), /"FPID":"123"/);
    return {statusCode: 1};
  });
  assert.deepEqual(await api.captureFace("123", "Test Person"), {statusCode: 1});
  assert.equal(request.mock.callCount(), 2);
});

test("re-enrollment replaces only the selected employee face without deleting it first", async t => {
  const api = client();
  const faces = new Map([["123", Buffer.from("old face")], ["456", Buffer.from("other face")]]);
  t.mock.method(api, "request", async (method, path, body) => {
    if (path === "/ISAPI/AccessControl/CaptureFaceData") return jpeg;
    assert.equal(method, "PUT");
    assert.equal(path, "/ISAPI/Intelligent/FDLib/FDSetUp?format=json");
    assert.ok(!body.toString().includes('"deleteFP"'));
    const employeeNo = body.toString().match(/"FPID":"([^"]+)"/)[1];
    faces.set(employeeNo, jpeg);
    return {statusCode: 1};
  });
  await api.captureFace("123", "Test Person");
  assert.deepEqual(faces.get("123"), jpeg);
  assert.deepEqual(faces.get("456"), Buffer.from("other face"));
  assert.equal(faces.size, 2);
});
