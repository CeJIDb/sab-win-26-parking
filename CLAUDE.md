# sab-win-26-parking — навигация для Claude Code

Карта репозитория для LLM-агента. Читай в начале каждой сессии. Люди — [README.md](README.md), [CONTRIBUTING.md](CONTRIBUTING.md).

## Что это за проект

Учебный проект курса Systems Analyst Bootcamp. Цифровая платформа частного паркинга на 600 машиномест, Санкт-Петербург. Главный результат — артефакты анализа/проектирования в [docs/](docs/), не код. [ui/](ui/) — статический wireframe, прод-деплоя нет.

## Структура и где что искать

```text
sab-win-26-parking/
├── docs/          ← вся документация (specs/, architecture/, artifacts/, interviews/, process/, demo-days/, assets/)
├── ui/            ← статический wireframe (admin/, client/, guard/, site/, templates/) — SCSS + Nunjucks → HTML
├── plans/         ← технические планы (один план = одна задача)
├── scripts/       ← build/, claude-hooks/, docs/, git/, integrations/, lint/, plans/
├── .claude/       ← настройки Claude Code: commands/, rules/, skills/, hooks
├── .agents/, .codex/, .husky/, .github/   ← конфиги других агентов и CI
├── graphify-out/  ← граф знаний (авто-генерация)
├── sql/           ← SQL-заготовки для учебной части
└── external/      ← симлинки на внешние репозитории (в .gitignore)
```

| Что нужно                       | Куда смотреть                                                                      |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| О проекте, границы системы      | [README.md](README.md)                                                             |
| Требования (FR/NFR), глоссарий  | [docs/specs/](docs/specs/)                                                         |
| Архитектура, ADR, C4            | [docs/architecture/](docs/architecture/)                                           |
| Use-case, BPMN, user flows      | [docs/artifacts/](docs/artifacts/)                                                 |
| Интервью                        | [docs/interviews/](docs/interviews/)                                               |
| Регламенты процесса             | [docs/process/readme.md](docs/process/readme.md)                                   |
| Матрица трассировки (правила)   | [docs/process/traceability-matrix.md](docs/process/traceability-matrix.md)         |
| Матрица трассировки (журнал)    | [docs/process/traceability-matrix-log.md](docs/process/traceability-matrix-log.md) |
| Wireframe                       | [ui/](ui/) — сборка `npm run build`                                                |
| Технические планы               | [plans/](plans/), [plans/README.md](plans/README.md)                               |
| Правила Claude (опц. ast-index) | [.claude/rules/ast-index.md](.claude/rules/ast-index.md)                           |
| Теория системного анализа       | [external/systems-analyst-db/](external/systems-analyst-db/) (локальный симлинк)   |

## Правила для агента

1. **Не коммить и не пушить без явной просьбы.** Коммитит пользователь. Накопился дифф — напомни про `npm run commit:atomic` (`:dry-run` — предпросмотр). Попросили коммит — добавляй файлы поштучно по имени, никогда `git add -A` / `git add .` (в параллельных чатах чужие правки).

2. **Сложная/неоднозначная задача — спрашивай до начала.** Вопрос дешевле переделки.

3. **Не меняй [docs/specs/](docs/specs/) без разрешения.** Источник истины. Нужна правка — спроси с обоснованием. После разрешения — правь и обнови [журнал трассировки](docs/process/traceability-matrix-log.md). Устаревшие требования помечай, не удаляй.

4. **Сверяйся с трассировкой.** Правишь артефакт/требование/архитектуру — проверь связь `Источник → Требование → Изменения → Проверка → Доказательство`. Регламент — [docs/process/traceability-matrix.md](docs/process/traceability-matrix.md). Журнал — в том же PR. Строки журнала ≤500 символов (`check-markdown.mjs`). Поле Source — кратко, детали в PR-описание.

5. **Имена файлов/папок — латиница, kebab-case.** Даже при русском содержимом. Без пробелов, кириллицы, camelCase, PascalCase. Проверка — `npm run lint:file-names`.

6. **После плана — пиши ретро.** План из [plans/](plans/) завершен: (a) все фазы `[x]`, секция `## Итог` заполнена; (b) создан `docs/process/retro/YYYY-MM-DD-название.md` (имя как у плана) по формату [docs/process/retro/README.md](docs/process/retro/README.md). Обязательно.

## MCP-серверы

- **github** — issues, PR, коммиты через MCP вместо `gh` CLI. Не пушь и не создавай PR без просьбы.
- **playwright** — проверка wireframe в браузере при правках [ui/](ui/).
- **miro** — C4-диаграммы и схемы процессов из [docs/architecture/](docs/architecture/).
- **buildin.ai** — внешний knowledge-base команды. Страницы закрыты (`Sharing is off`), `WebFetch` и MCP Playwright видят только заглушку. Воркфлоу: `.venv/bin/python scripts/integrations/buildin-auth.py` (авторизация, cookies в `.playwright-session.json`), затем `.venv/bin/python scripts/integrations/buildin-explore.py "<url>"` (headless-чтение в `.playwright-mcp/`). Сессия истекла — повтори auth. Не использовать `playwright__browser_navigate` напрямую (не авторизован). Креды в `.env` (`BUILDIN_EMAIL`, `BUILDIN_PASSWORD`).

## Хуки и CI

**Claude hooks** ([.claude/settings.json](.claude/settings.json) → [scripts/claude-hooks/](scripts/claude-hooks/)). Действие заблокировано — это политика, не баг:

- `block-push-to-main.mjs`, `block-unsafe-git-add.mjs`, `block-secret-write.mjs` — запреты.
- `validate-staged-plans.mjs`, `validate-plan-on-write.mjs` — валидация формата [plans/](plans/).
- `format-on-write.mjs` — авто-форматирование Prettier.
- `play-sound.sh`, `remind-atomic-commit.sh` — уведомления.

**Husky:** `commit-msg` (commitlint, Conventional Commits: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `build`, `perf`, `revert`); `pre-commit` (reminder + `check:plans:staged`); `pre-push` (reminder + `check:branch` + `ci:check`).

**Ветки:** `feature/`, `docs/`, `chore/`, `hotfix/`. Прямой push в `main` запрещен.

**CI на PR:** `policy-checks`, `quality-gates` (`ci:check`), `commitlint`, семантический заголовок PR.

## Полезные команды

```bash
npm ci                          # установить зависимости
npm run ci:check                # все локальные проверки разом
npm run build                   # собрать ui/ (SCSS + Nunjucks → HTML)
npm run lint:md                 # markdownlint
npm run lint:md:fix             # markdownlint с автофиксом
npm run lint:md:custom          # check-markdown.mjs (лимит 500 симв. для журнала трассировки и др.)
npm run lint:md-links           # проверка ссылок в .md
npm run lint:file-names         # имена файлов на латиницу/kebab-case
npm run lint:mermaid            # линтер mermaid-диаграмм
npm run format                  # prettier --write
npm run format:check            # prettier --check
npm run check:branch            # имя текущей ветки
npm run check:plans             # валидация всех файлов в plans/
npm run check:plans:staged      # валидация только staged-планов
npm run commit                  # format + ci:check + commit:atomic одним конвейером
npm run commit:quiet            # то же, что commit, но без подробного вывода format/ci:check
npm run commit:atomic           # атомарные коммиты (запускает пользователь)
npm run commit:atomic:dry-run   # предпросмотр атомарных коммитов
npm run commit:atomic:yes       # атомарные коммиты без подтверждений
npm run commit:atomic:staged    # атомарные коммиты только из уже staged-файлов
```

## Definition of Done для агента

Перед «готово» пробеги чеклист:

- [ ] Если правил [docs/specs/](docs/specs/) — было явное разрешение пользователя.
- [ ] [Журнал трассировки](docs/process/traceability-matrix-log.md) обновлен (если затронуты требования/артефакты/архитектура).
- [ ] Имена новых файлов — латиница kebab-case (`npm run lint:file-names` зеленый).
- [ ] Локальные проверки прошли (`npm run ci:check`).
- [ ] Если работал по плану из [plans/](plans/) — фазы `[x]`, `## Итог` заполнен, ретро в [docs/process/retro/](docs/process/retro/) написано.
- [ ] CLAUDE.md обновлен, если поменялась структура репозитория или появились новые правила.
- [ ] Пользователю напомнено про `npm run commit:atomic` (если накопился крупный дифф).

## Язык

Отвечай на русском. В доках и коммитах **не используется буква «ё»** — договоренность проекта (см. [CONTRIBUTING.md](CONTRIBUTING.md#стиль-текстов-в-документации)). Пишем «все», «еще», «подъем», «перенести». Проверяй вывод перед сохранением.

## Внешние репозитории (external/)

Папка `external/` — локальные симлинки на внешние репозитории, в `.gitignore`.

- **external/systems-analyst-db** → `../systems-analyst-db` — теория системного анализа (глоссарий, методики, шаблоны, материалы SAB). Граф знаний: `external/systems-analyst-db/graphify-out/GRAPH_REPORT.md` — читай перед поиском по файлам. Когда: уточнение терминов, выбор подхода к артефактам, сверка с методологией курса.

## graphify

Граф знаний репозитория в `graphify-out/` (god nodes, communities, cross-file relationships).

- ALWAYS read `graphify-out/GRAPH_REPORT.md` before reading source files, running grep/glob, or answering codebase questions — твоя главная карта.
- IF `graphify-out/wiki/index.md` EXISTS — navigate it вместо чтения raw-файлов.
- Для cross-module вопросов «как X связан с Y» — `graphify query "<question>"`, `graphify path "<A>" "<B>"`, `graphify explain "<concept>"` (обходят EXTRACTED + INFERRED edges).
- После изменения кода — `graphify update .` (AST-only, без API).
