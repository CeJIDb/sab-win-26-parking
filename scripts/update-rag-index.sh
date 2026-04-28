#!/usr/bin/env bash
# scripts/update-rag-index.sh — обновить индекс mcp__markdown_rag по docs/.
#
# Использование:
#   bash scripts/update-rag-index.sh                    # инкрементально (по changed files)
#   bash scripts/update-rag-index.sh --force            # полная переиндексация
#   bash scripts/update-rag-index.sh --stop-mcp         # остановить MCP перед индексацией
#   bash scripts/update-rag-index.sh --force --stop-mcp # сочетание (порядок не важен)
#
# По умолчанию ищет MCP-сервер по пути $HOME/.local/share/mcp-servers/MCP-Markdown-RAG.
# Переопределить можно через переменную окружения MCP_MARKDOWN_RAG_DIR.
#
# Скрипт обходит запуск MCP-инструмента из Claude (он медленный): подключается
# к той же Milvus-БД и индексирует docs/ напрямую. После успешной индексации
# обновляет .claude/cache/markdown-rag-timestamp.json, чтобы SessionStart-хук
# не показывал предупреждение об устаревании.
#
# Milvus Lite — однопроцессная БД: пока MCP-сервер markdown_rag работает в
# текущей сессии Claude Code, он держит лок на файле БД, и индексация
# обрывается. Скрипт детектит занятый MCP и:
#   - без --stop-mcp: печатает понятное сообщение и завершается с кодом 1;
#   - с --stop-mcp:    останавливает процессы MCP-сервера перед индексацией
#                       (после этого markdown_rag в текущей сессии Claude Code
#                       больше недоступен — нужен рестарт).

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
stop_mcp_flag=""
while [ $# -gt 0 ]; do
  case "$1" in
    --force) force_flag="--force" ;;
    --stop-mcp) stop_mcp_flag="1" ;;
    -h|--help)
      cat <<'EOF'
Usage: update-rag-index.sh [--force] [--stop-mcp]
  --force      полная переиндексация (drop коллекции и build с нуля)
  --stop-mcp   остановить запущенный MCP-сервер markdown_rag перед индексацией
               (он держит лок на Milvus-БД; после остановки markdown_rag в
               текущей сессии Claude Code будет недоступен — нужен рестарт)
EOF
      exit 0
      ;;
    *)
      echo "Usage: $0 [--force] [--stop-mcp]" >&2
      exit 2
      ;;
  esac
  shift
done

# Поиск процессов MCP-сервера markdown_rag.
detect_mcp_pids() {
  pgrep -f "MCP-Markdown-RAG.*server\.py" 2>/dev/null || true
}

mcp_pids="$(detect_mcp_pids)"
mcp_was_stopped=""
if [ -n "$mcp_pids" ]; then
  if [ "$stop_mcp_flag" = "1" ]; then
    echo "[markdown_rag] Останавливаю MCP-сервер markdown_rag (PIDs: $(echo $mcp_pids | tr '\n' ' '))..." >&2
    # shellcheck disable=SC2086
    kill $mcp_pids 2>/dev/null || true
    for _ in 1 2 3 4 5; do
      sleep 1
      [ -z "$(detect_mcp_pids)" ] && break
    done
    remaining="$(detect_mcp_pids)"
    if [ -n "$remaining" ]; then
      echo "[markdown_rag] SIGTERM не помог, отправляю SIGKILL (PIDs: $(echo $remaining | tr '\n' ' '))..." >&2
      # shellcheck disable=SC2086
      kill -9 $remaining 2>/dev/null || true
      sleep 1
    fi
    if [ -n "$(detect_mcp_pids)" ]; then
      echo "[markdown_rag] Не удалось остановить MCP-сервер. Останови процессы вручную и повтори." >&2
      exit 1
    fi
    mcp_was_stopped="1"
  else
    cat >&2 <<EOF
[markdown_rag] БД индекса занята: запущен MCP-сервер markdown_rag (PIDs: $(echo $mcp_pids | tr '\n' ' ')).
[markdown_rag] Milvus Lite не поддерживает мульти-процессный доступ к одному .db-файлу.
[markdown_rag] Варианты:
[markdown_rag]   1) bash scripts/update-rag-index.sh --stop-mcp
[markdown_rag]      (остановит MCP-сервер; после индексации перезапусти Claude Code,
[markdown_rag]      чтобы markdown_rag поднялся обратно)
[markdown_rag]   2) закрыть Claude Code и выполнить эту команду из обычного шелла,
[markdown_rag]      затем открыть Claude Code снова.
EOF
    exit 1
  fi
fi

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

if [ "$mcp_was_stopped" = "1" ]; then
  cat >&2 <<'EOF'
[markdown_rag] ВНИМАНИЕ: MCP-сервер markdown_rag был остановлен.
[markdown_rag] В текущей сессии Claude Code инструменты mcp__markdown_rag__*
[markdown_rag] недоступны. Перезапусти Claude Code, чтобы он поднял MCP заново.
EOF
fi
