import assert from "node:assert/strict";
import { test } from "node:test";
import { renderBarcode } from "../src/features/inventory/components/render-barcode.ts";

// Use JsBarcode's object renderer to exercise its real encoders without a browser.
function target() {
  return {
    encodings: [],
    attributes: new Map([
      ["width", "200"],
      ["height", "100"],
      ["viewBox", "0 0 200 100"],
    ]),
    replaceChildren() {
      this.encodings = [];
    },
    removeAttribute(name) {
      this.attributes.delete(name);
    },
  };
}

test("unsupported scan values do not throw or leave an old barcode", () => {
  for (const value of [
    "]C10128034013782604240AG5300N19*7* tkR´",
    "’028607}]×}108",
    "",
  ]) {
    const element = target();
    assert.equal(renderBarcode(element, "ABC123", {}), true);
    assert.ok(element.encodings.length);
    assert.equal(renderBarcode(element, value, {}), false);
    assert.deepEqual(element.encodings, []);
    assert.equal(element.attributes.size, 0);
    assert.equal(renderBarcode(element, "ABC123", {}), true);
  }
});

test("EAN13 and CODE128 values retain their original content", () => {
  for (const [value, format] of [
    ["5901234123457", "EAN13"],
    ["5901234123458", "CODE128"],
    ["ABC-123", "CODE128"],
  ]) {
    const element = target();
    assert.equal(renderBarcode(element, value, {}), true);
    assert.equal(
      element.encodings.map((encoding) => encoding.text).join(""),
      value,
    );
    assert.ok(
      element.encodings.every((encoding) => encoding.options.format === format),
    );
  }
});
