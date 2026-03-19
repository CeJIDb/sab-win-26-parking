import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const TARGETS = [
  "README.md",
  "CONTRIBUTING.md",
  "CHANGELOG.md",
  "docs/specs",
  "docs/architecture",
  "docs/artifacts"
];
const EXCLUDE_DIRS = new Set(["node_modules", ".git", ".cursor", ".venv", ".venv-markitdown"]);

async function collectMarkdownFiles(targetPath, acc) {
  const absPath = path.join(ROOT, targetPath);
  const stat = await fs.stat(absPath);

  if (stat.isFile()) {
    if (absPath.endsWith(".md")) acc.push(absPath);
    return;
  }

  const entries = await fs.readdir(absPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && EXCLUDE_DIRS.has(entry.name)) continue;
    const entryPath = path.join(targetPath, entry.name);
    if (entry.isDirectory()) {
      await collectMarkdownFiles(entryPath, acc);
    } else if (entry.isFile() && entry.name.endsWith(".md")) {
      acc.push(path.join(ROOT, entryPath));
    }
  }
}

function lintContent(filePath, content) {
  const errors = [];
  if (content.trim().length === 0) {
    errors.push("file is empty");
  }
  return errors;
}

async function main() {
  const files = [];
  for (const target of TARGETS) {
    await collectMarkdownFiles(target, files);
  }

  let hasErrors = false;
  for (const filePath of files) {
    const content = await fs.readFile(filePath, "utf-8");
    const errors = lintContent(filePath, content);
    if (errors.length > 0) {
      hasErrors = true;
      const rel = path.relative(ROOT, filePath);
      for (const error of errors) {
        console.error(`${rel}: ${error}`);
      }
    }
  }

  if (hasErrors) process.exit(1);
  console.log(`Markdown checks passed: ${files.length} file(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
