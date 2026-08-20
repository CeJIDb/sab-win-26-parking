#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { extname } from "node:path";
import {
  getHookFilePaths,
  getProjectDir,
  readHookPayload,
  resolveHookPath,
} from "./hook-input.mjs";

const SUPPORTED = new Set([
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
  ".scss",
  ".html",
]);

const payload = readHookPayload();
const projectDir = getProjectDir(payload);
const filePaths = getHookFilePaths(payload)
  .map((filePath) => resolveHookPath(projectDir, filePath))
  .filter((filePath) => existsSync(filePath) && SUPPORTED.has(extname(filePath)));

if (filePaths.length === 0) process.exit(0);

try {
  execFileSync("npx", ["prettier", "--write", ...filePaths], {
    cwd: projectDir,
    stdio: "inherit",
  });
} catch {
  // prettier failure should not block the agent
}
