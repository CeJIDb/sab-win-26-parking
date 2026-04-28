#!/usr/bin/env node
/**
 * Проверяет имена файлов на латиницу + kebab-case (правило 5 CLAUDE.md).
 *
 * Разрешено в имени файла:
 *   - латинские буквы a-z A-Z
 *   - цифры 0-9
 *   - дефис `-`, точка `.`, подчеркивание `_`, собака `@`
 *
 * Запрещено: кириллица, пробелы, спецсимволы, скобки и т.п.
 *
 * Сканируем директории, где живет проектный контент (docs, ui, sql, evals, plans, scripts).
 * Корневые dot-файлы и служебные каталоги не трогаем.
 */
import path from "node:path";
import { promises as fs } from "node:fs";

const ROOT = process.cwd();
const SCAN_ROOTS = ["docs", "ui", "sql", "evals", "plans", "scripts"];
const EXCLUDE_DIRS = new Set([
  ".git",
  "node_modules",
  ".venv",
  "__pycache__",
  ".cache",
]);

function hasSafeFilename(name) {
  if (!name || name.includes(" ")) return false;
  return /^[A-Za-z0-9._@-]+$/.test(name);
}

async function walkFiles(dirRel, acc) {
  const abs = path.join(ROOT, dirRel);
  let entries;
  try {
    entries = await fs.readdir(abs, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.name.startsWith(".") && entry.name !== ".gitkeep") continue;
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.has(entry.name)) continue;
      await walkFiles(path.join(dirRel, entry.name), acc);
    } else if (entry.isFile()) {
      acc.push(path.join(dirRel, entry.name));
    }
  }
}

async function main() {
  const errors = [];
  const files = [];

  for (const root of SCAN_ROOTS) {
    await walkFiles(root, files);
  }

  files.sort();

  for (const rel of files) {
    const base = path.basename(rel);
    if (!hasSafeFilename(base)) {
      errors.push(`${rel}: имя файла содержит недопустимые символы (правило 5 CLAUDE.md)`);
    }
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error);
    }
    process.exit(1);
  }

  console.log(`Проверка имен файлов прошла (${files.length} файл(ов) под ${SCAN_ROOTS.join(", ")}).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
