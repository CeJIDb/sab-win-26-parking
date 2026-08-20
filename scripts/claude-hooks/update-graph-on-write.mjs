#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import {
  getHookFilePaths,
  getProjectDir,
  readHookPayload,
  resolveHookPath,
} from "./hook-input.mjs";

const payload = readHookPayload();
const projectDir = getProjectDir(payload);
const filePaths = getHookFilePaths(payload).map((filePath) =>
  resolveHookPath(projectDir, filePath),
);

if (filePaths.length === 0) process.exit(0);

for (const filePath of filePaths) {
  try {
    execFileSync("graphify", ["update", filePath], {
      cwd: projectDir,
      stdio: "ignore",
    });
  } catch {
    // Graph refresh is advisory and must not block the agent.
  }
}

process.exit(0);
