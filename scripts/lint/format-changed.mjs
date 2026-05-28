#!/usr/bin/env node
/**
 * Запускает prettier только на измененных (git diff + untracked) файлах.
 *
 * Флаги:
 *   --check   режим проверки (без записи, как в ci:check)
 *
 * Используется в: npm run format:changed, npm run format:changed:check
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { getChangedRelPaths, ROOT } from "./_lib-changed-files.mjs";

const PRETTIER_EXTS = new Set([
  ".md",
  ".json",
  ".jsonc",
  ".yml",
  ".yaml",
  ".js",
  ".mjs",
  ".cjs",
  ".jsx",
  ".ts",
  ".tsx",
  ".css",
  ".html",
]);

const changedFiles = getChangedRelPaths().filter((f) => {
  const ext = path.extname(f);
  if (!PRETTIER_EXTS.has(ext)) return false;
  const parts = f.split("/");
  return !parts.includes("raw") && !parts.includes("external");
});

if (changedFiles.length === 0) {
  console.log("format: нет измененных файлов для форматирования.");
  process.exit(0);
}

const isCheck = process.argv.includes("--check");
const prettierArgs = [
  isCheck ? "--check" : "--write",
  "--no-error-on-unmatched-pattern",
  ...changedFiles,
];

const result = spawnSync("npx", ["prettier", ...prettierArgs], {
  stdio: "inherit",
  cwd: ROOT,
});

process.exit(result.status ?? 0);
