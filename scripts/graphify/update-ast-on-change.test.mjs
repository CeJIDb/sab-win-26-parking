import assert from "node:assert/strict";
import test from "node:test";

import { isGraphifyCodeFile, selectGraphifyCodeFiles } from "./update-ast-on-change.mjs";

test("recognizes extensions supported by the Graphify AST extractor", () => {
  assert.equal(isGraphifyCodeFile("scripts/example.mjs"), true);
  assert.equal(isGraphifyCodeFile("ui/example.tsx"), true);
  assert.equal(isGraphifyCodeFile("sql/example.sql"), true);
  assert.equal(isGraphifyCodeFile("docs/example.md"), false);
});

test("does not treat generated Graphify files as source code", () => {
  assert.equal(isGraphifyCodeFile("graphify-out/generated.ts"), false);
});

test("normalizes, filters, sorts, and deduplicates changed paths", () => {
  assert.deepEqual(
    selectGraphifyCodeFiles([
      "ui\\example.tsx",
      "docs/example.md",
      "scripts/example.mjs",
      "ui/example.tsx",
    ]),
    ["scripts/example.mjs", "ui/example.tsx"],
  );
});
