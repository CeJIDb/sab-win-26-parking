#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const NULL_TOKEN = String.raw`\N`;

function usage() {
  return `Использование:
  node scripts/sql-practice/verify-query-result.mjs describe --result <result.csv>
  node scripts/sql-practice/verify-query-result.mjs verify --manifest <expected-results.json> --task <ID> --result <result.csv>`;
}

function parseArgs(argv) {
  const [command, ...rest] = argv;
  const options = {};

  for (let index = 0; index < rest.length; index += 1) {
    const argument = rest[index];
    if (!argument.startsWith("--")) {
      throw new Error(`Неизвестный аргумент: ${argument}`);
    }

    const name = argument.slice(2);
    const value = rest[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Для --${name} не указано значение`);
    }

    options[name] = value;
    index += 1;
  }

  return { command, options };
}

function normalizeNewlines(value) {
  return value.replace(/\r\n?/g, "\n");
}

export function parseCsv(input) {
  const source = normalizeNewlines(input.replace(/^\uFEFF/, ""));
  if (source.length === 0) {
    throw new Error("CSV не содержит заголовок");
  }

  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;
  let inQuotes = false;
  let quoteClosed = false;

  function finishCell() {
    row.push({ value, quoted });
    value = "";
    quoted = false;
    quoteClosed = false;
  }

  function finishRow() {
    finishCell();
    rows.push(row);
    row = [];
  }

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];

    if (inQuotes) {
      if (character === '"') {
        if (source[index + 1] === '"') {
          value += '"';
          index += 1;
        } else {
          inQuotes = false;
          quoteClosed = true;
        }
      } else {
        value += character;
      }
      continue;
    }

    if (quoteClosed && character !== "," && character !== "\n") {
      throw new Error(
        "После закрывающей кавычки CSV допустимы только разделитель или конец строки",
      );
    }

    if (character === '"') {
      if (value.length > 0 || quoted) {
        throw new Error("Кавычка внутри некавыченного поля CSV");
      }
      quoted = true;
      inQuotes = true;
    } else if (character === ",") {
      finishCell();
    } else if (character === "\n") {
      finishRow();
    } else {
      value += character;
    }
  }

  if (inQuotes) {
    throw new Error("Незакрытая кавычка в CSV");
  }

  if (!source.endsWith("\n") || value.length > 0 || quoted || row.length > 0) {
    finishRow();
  }

  if (rows.length === 0) {
    throw new Error("CSV не содержит заголовок");
  }

  const columnCount = rows[0].length;
  for (let index = 1; index < rows.length; index += 1) {
    if (rows[index].length !== columnCount) {
      throw new Error(
        `Строка ${index + 1} содержит ${rows[index].length} полей вместо ${columnCount}`,
      );
    }
  }

  return rows;
}

function serializeCell(cell) {
  const requiresQuotes =
    cell.quoted && cell.value === NULL_TOKEN ? true : /[",\n]/.test(cell.value);
  const escaped = cell.value.replaceAll('"', '""');
  return requiresQuotes ? `"${escaped}"` : escaped;
}

export function canonicalizeCsv(input) {
  const rows = parseCsv(input);
  return `${rows.map((row) => row.map((cell) => serializeCell(cell)).join(",")).join("\n")}\n`;
}

export function describeResult(input) {
  const rows = parseCsv(input);
  const columns = rows[0].map((cell) => cell.value);

  if (columns.some((column) => column.trim().length === 0)) {
    throw new Error("Заголовок CSV содержит пустое имя колонки");
  }
  if (new Set(columns).size !== columns.length) {
    throw new Error("Заголовок CSV содержит повторяющиеся имена колонок");
  }

  const canonicalCsv = canonicalizeCsv(input);

  return {
    columns,
    rowCount: rows.length - 1,
    sha256: createHash("sha256").update(canonicalCsv, "utf8").digest("hex"),
  };
}

function assertExpectedDescriptor(descriptor, taskId) {
  if (!descriptor || typeof descriptor !== "object") {
    throw new Error(`Для задания ${taskId} отсутствует описание результата`);
  }
  if (
    !Array.isArray(descriptor.columns) ||
    descriptor.columns.some((column) => typeof column !== "string")
  ) {
    throw new Error(`У задания ${taskId} поле columns должно быть массивом строк`);
  }
  if (descriptor.columns.some((column) => column.trim().length === 0)) {
    throw new Error(`У задания ${taskId} поле columns содержит пустое имя`);
  }
  if (new Set(descriptor.columns).size !== descriptor.columns.length) {
    throw new Error(`У задания ${taskId} поле columns содержит повторяющиеся имена`);
  }
  if (!Number.isInteger(descriptor.rowCount) || descriptor.rowCount < 0) {
    throw new Error(`У задания ${taskId} поле rowCount должно быть неотрицательным целым числом`);
  }
  if (!/^[a-f0-9]{64}$/.test(descriptor.sha256 ?? "")) {
    throw new Error(`У задания ${taskId} поле sha256 должно содержать 64 строчных hex-символа`);
  }
}

export function verifyResult(input, manifest, taskId) {
  if (manifest?.version !== 1 || !manifest.tasks || typeof manifest.tasks !== "object") {
    throw new Error("Манифест должен иметь version=1 и объект tasks");
  }

  const expected = manifest.tasks[taskId];
  assertExpectedDescriptor(expected, taskId);
  const actual = describeResult(input);
  const errors = [];

  if (JSON.stringify(actual.columns) !== JSON.stringify(expected.columns)) {
    errors.push(
      `колонки: ожидалось ${JSON.stringify(expected.columns)}, получено ${JSON.stringify(actual.columns)}`,
    );
  }
  if (actual.rowCount !== expected.rowCount) {
    errors.push(`строки: ожидалось ${expected.rowCount}, получено ${actual.rowCount}`);
  }
  if (actual.sha256 !== expected.sha256) {
    errors.push(`SHA-256: ожидалось ${expected.sha256}, получено ${actual.sha256}`);
  }

  if (errors.length > 0) {
    throw new Error(`Результат задания ${taskId} не совпал:\n- ${errors.join("\n- ")}`);
  }

  return actual;
}

function readUtf8(path) {
  return readFileSync(path, "utf8");
}

function main() {
  const { command, options } = parseArgs(process.argv.slice(2));

  if (command === "describe") {
    if (!options.result) {
      throw new Error(`Не указан --result\n\n${usage()}`);
    }
    const descriptor = describeResult(readUtf8(options.result));
    process.stdout.write(`${JSON.stringify(descriptor, null, 2)}\n`);
    return;
  }

  if (command === "verify") {
    if (!options.result || !options.manifest || !options.task) {
      throw new Error(`Для verify нужны --manifest, --task и --result\n\n${usage()}`);
    }
    const manifest = JSON.parse(readUtf8(options.manifest));
    const descriptor = verifyResult(readUtf8(options.result), manifest, options.task);
    process.stdout.write(
      `ok ${options.task}: ${descriptor.rowCount} строк, SHA-256 ${descriptor.sha256}\n`,
    );
    return;
  }

  throw new Error(usage());
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`Ошибка: ${error.message}\n`);
    process.exitCode = 1;
  }
}
