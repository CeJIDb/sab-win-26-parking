#!/usr/bin/env node
/**
 * Claude Code PostToolUse hook.
 *
 * После Write / Edit по файлам plans/YYYY-MM-DD-*.md запускает
 * validate-plans.mjs и показывает ошибки форматирования прямо в ответе агента.
 * Exit code 2 вынуждает агента обратить внимание и исправить план до следующего шага.
 *
 * Пропускает:
 *   - plans/README.md
 *   - plans/user-actions/** (другой формат, своя схема)
 *   - всё, что не подходит под YYYY-MM-DD-slug.md
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import {
  getHookFilePaths,
  getProjectDir,
  readHookPayload,
  resolveHookPath,
} from "./hook-input.mjs";

const payload = readHookPayload();
const projectDir = getProjectDir(payload);
const planPaths = getHookFilePaths(payload)
  .map((filePath) => resolveHookPath(projectDir, filePath))
  .filter((filePath) => existsSync(filePath))
  .filter((filePath) => {
    const rel = path.relative(projectDir, filePath).split(path.sep).join("/");
    return (
      rel.startsWith("plans/") &&
      !rel.startsWith("plans/user-actions/") &&
      path.basename(rel) !== "README.md" &&
      /^plans\/\d{4}-\d{2}-\d{2}-[a-z0-9][a-z0-9-]*\.md$/.test(rel)
    );
  });

if (planPaths.length === 0) process.exit(0);

const scriptPath = path.join(projectDir, "scripts", "plans", "validate-plans.mjs");

try {
  for (const planPath of planPaths) {
    execFileSync("node", [scriptPath, planPath], { stdio: "inherit" });
  }
} catch {
  console.error(
    "\nvalidate-plan-on-write: план содержит ошибки — исправь их перед продолжением.\n",
  );
  process.exit(2);
}

process.exit(0);
