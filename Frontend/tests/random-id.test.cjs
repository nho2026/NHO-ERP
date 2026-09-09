const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const ts = require("typescript");
const { webcrypto } = require("node:crypto");
const source = fs.readFileSync(require("node:path").join(__dirname, "../src/shared/lib/random-id.ts"), "utf8");
const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
function load(crypto) {
  const context = { exports: {}, crypto };
  vm.runInNewContext(code, context);
  return context.exports.randomId;
}
test("HTTP fallback produces distinct valid UUIDs without randomUUID", () => {
  const randomId = load({ getRandomValues: webcrypto.getRandomValues.bind(webcrypto) });
  const ids = Array.from({ length: 100 }, () => randomId());
  assert.equal(new Set(ids).size, 100);
  for (const id of ids) assert.match(id, /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
});
test("uses native UUID generation when available", () => {
  assert.equal(load({ randomUUID: () => "native-id" })(), "native-id");
});
