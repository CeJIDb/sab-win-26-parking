/**
 * Собирает docs/architecture/c4/c4-parking-platform-preview.html
 * из блоков ```mermaid в c4-parking-platform.md (единый источник диаграмм).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const mdPath = path.join(root, "docs/architecture/c4/c4-parking-platform.md");
const outPath = path.join(root, "docs/architecture/c4/c4-parking-platform-preview.html");

const md = fs.readFileSync(mdPath, "utf8");
const blocks = [];
const parts = md.split("```mermaid\n");
parts.shift();
for (const part of parts) {
  const lines = part.split(/\r?\n/);
  const out = [];
  for (const line of lines) {
    if (line.trim() === "```") break;
    out.push(line);
  }
  const code = out.join("\n").trimEnd();
  if (code) blocks.push(code);
}

const titles = [
  "Level 1 — System Context",
  "Level 2 — Container",
  "Level 3 — Component (основной процесс)",
];

if (blocks.length !== titles.length) {
  console.error(
    `Ожидалось ${titles.length} блоков mermaid, найдено ${blocks.length}. Проверьте ${path.relative(root, mdPath)}.`,
  );
  process.exit(1);
}

const sectionsHtml = titles
  .map(
    (title, i) => `
    <section class="diagram-block" id="sec-${i}">
      <h2>${escapeHtml(title)}</h2>
      <div class="mermaid-host" id="mmd-${i}"></div>
    </section>`,
  )
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>C4 — платформа парковки (preview)</title>
  <style>
    :root { color-scheme: light dark; }
    body { font-family: system-ui, sans-serif; margin: 1rem 1.5rem 3rem; max-width: 1280px; line-height: 1.45; }
    h1 { font-size: 1.35rem; }
    .lead { color: #555; max-width: 72ch; }
    @media (prefers-color-scheme: dark) { .lead { color: #aaa; } }
    .diagram-block { margin-top: 2.25rem; }
    .diagram-block h2 { font-size: 1.05rem; border-bottom: 1px solid #ccc; padding-bottom: 0.35rem; }
    .mermaid-host { overflow-x: auto; margin-top: 0.75rem; }
  </style>
</head>
<body>
  <h1>C4 — предпросмотр (SAB)</h1>
  <p class="lead">
    Файл собирается скриптом <code>scripts/build-c4-preview-html.mjs</code> из fenced-блоков Mermaid в
    <a href="c4-parking-platform.md">c4-parking-platform.md</a>.
    После правок диаграмм выполните: <code>npm run docs:c4-preview</code>
  </p>
  ${sectionsHtml}
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <script>
    (async function () {
      const MERMAID_BLOCKS = ${JSON.stringify(blocks)};
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme: "neutral",
      });
      const nodes = [];
      for (var i = 0; i < MERMAID_BLOCKS.length; i++) {
        var el = document.createElement("div");
        el.className = "mermaid";
        el.textContent = MERMAID_BLOCKS[i];
        document.getElementById("mmd-" + i).appendChild(el);
        nodes.push(el);
      }
      await mermaid.run({ nodes: nodes });
    })();
  </script>
</body>
</html>
`;

fs.writeFileSync(outPath, html, "utf8");
console.log("Written:", path.relative(root, outPath));

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
