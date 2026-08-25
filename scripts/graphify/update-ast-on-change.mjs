#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const CODE_EXTENSIONS = new Set([
  ".astro",
  ".c",
  ".cc",
  ".cpp",
  ".cs",
  ".cxx",
  ".dart",
  ".dfm",
  ".dpk",
  ".dpr",
  ".ejs",
  ".ex",
  ".exs",
  ".f",
  ".f03",
  ".f08",
  ".f90",
  ".f95",
  ".go",
  ".gradle",
  ".groovy",
  ".h",
  ".hpp",
  ".inc",
  ".java",
  ".jl",
  ".js",
  ".jsx",
  ".kt",
  ".kts",
  ".lfm",
  ".lpk",
  ".lpr",
  ".lua",
  ".luau",
  ".m",
  ".mjs",
  ".mm",
  ".pas",
  ".php",
  ".pp",
  ".ps1",
  ".py",
  ".r",
  ".rb",
  ".rs",
  ".scala",
  ".sql",
  ".sv",
  ".svelte",
  ".swift",
  ".toc",
  ".ts",
  ".tsx",
  ".v",
  ".vue",
  ".zig",
]);

function normalizePath(filePath) {
  return filePath.replaceAll("\\", "/");
}

export function isGraphifyCodeFile(filePath) {
  const normalized = normalizePath(filePath);

  if (!normalized || normalized.startsWith("graphify-out/")) {
    return false;
  }

  return CODE_EXTENSIONS.has(extname(normalized).toLowerCase());
}

export function selectGraphifyCodeFiles(filePaths) {
  return [...new Set(filePaths.map(normalizePath).filter(isGraphifyCodeFile))].sort();
}

function runGit(repoRoot, args) {
  const result = spawnSync("git", args, {
    cwd: repoRoot,
    encoding: "buffer",
  });

  if (result.status !== 0) {
    const details = result.stderr?.toString("utf8").trim();
    throw new Error(details || `git ${args.join(" ")} failed`);
  }

  return result.stdout;
}

function splitNullDelimited(buffer) {
  return buffer.toString("utf8").split("\0").filter(Boolean);
}

function findRepoRoot() {
  const result = spawnSync("git", ["rev-parse", "--show-toplevel"], {
    encoding: "utf8",
  });

  if (result.status !== 0) {
    throw new Error("Graphify AST hook must run inside a Git repository.");
  }

  return result.stdout.trim();
}

function worktreeChanges(repoRoot) {
  const tracked = splitNullDelimited(
    runGit(repoRoot, ["diff", "--name-only", "--diff-filter=ACMRD", "-z", "HEAD", "--"]),
  );
  const untracked = splitNullDelimited(
    runGit(repoRoot, ["ls-files", "--others", "--exclude-standard", "-z"]),
  );

  return [...tracked, ...untracked];
}

function lastCommitChanges(repoRoot) {
  return splitNullDelimited(
    runGit(repoRoot, [
      "diff-tree",
      "--root",
      "--no-commit-id",
      "--name-only",
      "--diff-filter=ACMRD",
      "-r",
      "-z",
      "HEAD",
      "--",
    ]),
  );
}

function checkoutChanges(repoRoot, oldRevision, newRevision, branchCheckout) {
  if (branchCheckout !== "1") {
    return [];
  }

  return splitNullDelimited(
    runGit(repoRoot, [
      "diff",
      "--name-only",
      "--diff-filter=ACMRD",
      "-z",
      oldRevision,
      newRevision,
      "--",
    ]),
  );
}

function worktreeFingerprint(repoRoot, filePaths) {
  const hash = createHash("sha256");

  for (const filePath of filePaths) {
    const absolutePath = resolve(repoRoot, filePath);
    hash.update(filePath);
    hash.update("\0");
    hash.update(existsSync(absolutePath) ? readFileSync(absolutePath) : "<deleted>");
    hash.update("\0");
  }

  return hash.digest("hex");
}

function stampPath(repoRoot) {
  const gitPath = runGit(repoRoot, ["rev-parse", "--git-path", "graphify-ast-worktree-state"])
    .toString("utf8")
    .trim();

  return resolve(repoRoot, gitPath);
}

function parseArguments(args) {
  const options = {
    mode: "always",
    hook: false,
    dryRun: false,
    checkout: [],
  };

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === "--worktree") {
      options.mode = "worktree";
    } else if (argument === "--last-commit") {
      options.mode = "last-commit";
    } else if (argument === "--checkout") {
      options.mode = "checkout";
      options.checkout = args.slice(index + 1, index + 4);
      index += 3;
    } else if (argument === "--hook") {
      options.hook = true;
    } else if (argument === "--dry-run") {
      options.dryRun = true;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }

  return options;
}

function changedFiles(repoRoot, options) {
  if (options.mode === "worktree") {
    return worktreeChanges(repoRoot);
  }

  if (options.mode === "last-commit") {
    return lastCommitChanges(repoRoot);
  }

  if (options.mode === "checkout") {
    if (options.checkout.length !== 3) {
      throw new Error("--checkout requires old revision, new revision, and flag.");
    }

    return checkoutChanges(repoRoot, ...options.checkout);
  }

  return null;
}

function runGraphify(repoRoot, hookMode) {
  const command = process.env.GRAPHIFY_BIN || "graphify";
  const result = spawnSync(command, ["update", "."], {
    cwd: repoRoot,
    env: process.env,
    stdio: "inherit",
  });

  if (result.error?.code === "ENOENT") {
    const message = "Graphify is not installed or is not available in PATH; AST update skipped.";

    if (hookMode) {
      console.warn(`[graphify hook] ${message}`);
      return false;
    }

    throw new Error(message);
  }

  if (result.status !== 0) {
    const message = `graphify update . failed with exit code ${result.status}.`;

    if (hookMode) {
      console.warn(`[graphify hook] ${message}`);
      return false;
    }

    throw new Error(message);
  }

  const npxCommand = process.platform === "win32" ? "npx.cmd" : "npx";
  const formatResult = spawnSync(
    npxCommand,
    ["--no", "--", "prettier", "--write", "graphify-out/GRAPH_REPORT.md"],
    {
      cwd: repoRoot,
      env: process.env,
      stdio: "inherit",
    },
  );

  if (formatResult.status !== 0) {
    const message = `Prettier failed with exit code ${formatResult.status}.`;

    if (hookMode) {
      console.warn(`[graphify hook] ${message}`);
      return false;
    }

    throw new Error(message);
  }

  return true;
}

function main() {
  const options = parseArguments(process.argv.slice(2));
  const repoRoot = findRepoRoot();
  const candidates = changedFiles(repoRoot, options);
  const codeFiles = candidates === null ? null : selectGraphifyCodeFiles(candidates);

  if (codeFiles !== null && codeFiles.length === 0) {
    console.log("[graphify hook] AST update skipped: no code changes.");
    return;
  }

  let fingerprint;
  let stateFile;

  if (options.mode === "worktree") {
    fingerprint = worktreeFingerprint(repoRoot, codeFiles);
    stateFile = stampPath(repoRoot);

    if (existsSync(stateFile) && readFileSync(stateFile, "utf8").trim() === fingerprint) {
      console.log("[graphify hook] AST update skipped: worktree state is unchanged.");
      return;
    }
  }

  if (options.dryRun) {
    console.log(
      JSON.stringify(
        {
          mode: options.mode,
          codeFiles: codeFiles ?? "all",
        },
        null,
        2,
      ),
    );
    return;
  }

  const updated = runGraphify(repoRoot, options.hook);

  if (updated && stateFile && fingerprint) {
    mkdirSync(dirname(stateFile), { recursive: true });
    writeFileSync(stateFile, `${fingerprint}\n`, "utf8");
  }
}

const entryPoint = process.argv[1] ? resolve(process.argv[1]) : "";

if (entryPoint === fileURLToPath(import.meta.url)) {
  try {
    main();
  } catch (error) {
    console.error(`[graphify] ${error.message}`);
    process.exitCode = 1;
  }
}
