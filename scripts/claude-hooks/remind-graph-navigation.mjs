#!/usr/bin/env node
import { existsSync } from "node:fs";
import path from "node:path";
import { getProjectDir, readHookPayload } from "./hook-input.mjs";

const payload = readHookPayload();
const command = payload.tool_input?.command || "";
const projectDir = getProjectDir(payload);
const reportPath = path.join(projectDir, "graphify-out", "GRAPH_REPORT.md");
const searchCommand = /(?:^|[;&|]\s*|\s)(?:grep|rg|ripgrep|find|fd|ack|ag)(?:\s|$)/;

if (!existsSync(reportPath) || !searchCommand.test(command)) process.exit(0);

console.log(
  JSON.stringify({
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      additionalContext:
        "graphify: Knowledge graph exists. Read graphify-out/GRAPH_REPORT.md before searching raw files.",
    },
  }),
);
