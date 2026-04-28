#!/usr/bin/env bash
# scripts/update-rag-index.sh — обновить индекс mcp__markdown_rag по docs/.
#
# Использование:
#   bash scripts/update-rag-index.sh           # инкрементально (по changed files)
#   bash scripts/update-rag-index.sh --force   # полная переиндексация
#
# По умолчанию ищет MCP-сервер по пути $HOME/.local/share/mcp-servers/MCP-Markdown-RAG.
# Переопределить можно через переменную окружения MCP_MARKDOWN_RAG_DIR.
#
# Скрипт обходит запуск MCP-инструмента из Claude (он медленный): подключается
# к той же Milvus-БД и индексирует docs/ напрямую. После успешной индексации
# обновляет .claude/cache/markdown-rag-timestamp.json, чтобы SessionStart-хук
# не показывал предупреждение об устаревании.

set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
MCP_DIR="${MCP_MARKDOWN_RAG_DIR:-$HOME/.local/share/mcp-servers/MCP-Markdown-RAG}"
DOCS_DIR="$PROJECT_DIR/docs"

if [ ! -d "$MCP_DIR" ]; then
  echo "[markdown_rag] MCP-Markdown-RAG не найден: $MCP_DIR" >&2
  echo "[markdown_rag] Установи MCP-сервер или укажи MCP_MARKDOWN_RAG_DIR=/путь" >&2
  exit 1
fi

if [ ! -d "$DOCS_DIR" ]; then
  echo "[markdown_rag] docs/ не найден: $DOCS_DIR" >&2
  exit 1
fi

if ! command -v uv >/dev/null 2>&1; then
  echo "[markdown_rag] не найден uv (нужен для запуска MCP-окружения)" >&2
  exit 1
fi

force_flag=""
case "${1:-}" in
  --force) force_flag="--force" ;;
  "") ;;
  *)
    echo "Usage: $0 [--force]" >&2
    exit 2
    ;;
esac

cd "$MCP_DIR"

# shellcheck disable=SC2086
uv run python "$PROJECT_DIR/scripts/update-rag-index.py" \
  --target "$DOCS_DIR" $force_flag

# Обновляем timestamp кеша, чтобы SessionStart-хук не считал индекс устаревшим.
CACHE_DIR="$PROJECT_DIR/.claude/cache"
CACHE_FILE="$CACHE_DIR/markdown-rag-timestamp.json"
mkdir -p "$CACHE_DIR"
node -e '
  const fs = require("node:fs");
  const target = process.argv[1];
  fs.writeFileSync(
    target,
    JSON.stringify({ indexedAt: Date.now(), indexedAtIso: new Date().toISOString() }, null, 2) + "\n",
  );
' "$CACHE_FILE"

echo "[markdown_rag] Кеш timestamp обновлен: $CACHE_FILE"
