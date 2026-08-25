import assert from "node:assert/strict";
import test from "node:test";

import { canonicalizeCsv, describeResult, parseCsv, verifyResult } from "./verify-query-result.mjs";

const RESULT = 'sector,count\r\nA,2\r\n"B, C",1\r\n';

test("CSV parser handles quoted delimiters and CRLF", () => {
  const rows = parseCsv(RESULT);
  assert.deepEqual(
    rows.map((row) => row.map((cell) => cell.value)),
    [
      ["sector", "count"],
      ["A", "2"],
      ["B, C", "1"],
    ],
  );
  assert.equal(canonicalizeCsv(RESULT), 'sector,count\nA,2\n"B, C",1\n');
});

test("descriptor is stable and excludes the header from rowCount", () => {
  assert.deepEqual(describeResult(RESULT), {
    columns: ["sector", "count"],
    rowCount: 2,
    sha256: "6e250a45a3866342beccd832c2f4528d682abd7e78c955e21fde5410c6a62fb3",
  });
});

test("verification accepts an exact descriptor", () => {
  const descriptor = describeResult(RESULT);
  assert.deepEqual(
    verifyResult(RESULT, { version: 1, tasks: { "001": descriptor } }, "001"),
    descriptor,
  );
});

test("verification reports a changed result", () => {
  const descriptor = describeResult(RESULT);
  assert.throws(
    () => verifyResult("sector,count\nA,3\n", { version: 1, tasks: { "001": descriptor } }, "001"),
    /строки: ожидалось 2, получено 1.*SHA-256/s,
  );
});

test("quoted null token stays distinct from SQL NULL", () => {
  const nullValue = canonicalizeCsv(String.raw`value
\N
`);
  const literalValue = canonicalizeCsv(String.raw`value
"\N"
`);
  assert.notEqual(nullValue, literalValue);
});

test("descriptor rejects missing, empty, and duplicate headers", () => {
  assert.throws(() => describeResult(""), /не содержит заголовок/);
  assert.throws(() => describeResult(",count\nA,1\n"), /пустое имя/);
  assert.throws(() => describeResult("value,value\nA,1\n"), /повторяющиеся/);
});
