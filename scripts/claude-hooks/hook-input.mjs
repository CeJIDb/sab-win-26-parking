import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

export function readHookPayload() {
  try {
    return JSON.parse(readFileSync(0, "utf-8") || "{}");
  } catch {
    return {};
  }
}

export function getProjectDir(payload) {
  if (process.env.CLAUDE_PROJECT_DIR) return process.env.CLAUDE_PROJECT_DIR;

  const cwd = payload.cwd || process.cwd();
  try {
    return execFileSync("git", ["rev-parse", "--show-toplevel"], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch {
    return cwd;
  }
}

export function getHookFilePaths(payload) {
  const input =
    payload.tool_input && typeof payload.tool_input === "object" ? payload.tool_input : {};
  const paths = [];

  if (typeof input.file_path === "string") paths.push(input.file_path);

  if (Array.isArray(input.edits)) {
    for (const edit of input.edits) {
      if (edit && typeof edit.file_path === "string") paths.push(edit.file_path);
    }
  }

  if (typeof input.command === "string") {
    const fileHeader = /^\*\*\* (?:Add|Update|Delete) File:\s*(.+?)\s*$/gm;
    const moveHeader = /^\*\*\* Move to:\s*(.+?)\s*$/gm;

    for (const matcher of [fileHeader, moveHeader]) {
      for (const match of input.command.matchAll(matcher)) paths.push(match[1]);
    }
  }

  return [...new Set(paths.filter(Boolean))];
}

export function resolveHookPath(projectDir, filePath) {
  return path.isAbsolute(filePath) ? path.normalize(filePath) : path.resolve(projectDir, filePath);
}
