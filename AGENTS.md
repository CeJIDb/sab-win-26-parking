# sab-win-26-parking — навигация для Codex

Карта репозитория для LLM-агента. Читай в начале каждой сессии.

Для людей — [README.md](README.md) и [CONTRIBUTING.md](CONTRIBUTING.md).

## Что это за проект

Учебный проект курса Systems Analyst Bootcamp — цифровая платформа для частного паркинга на 600 машиномест в Санкт-Петербурге. Основной результат — артефакты анализа и проектирования в [docs/](docs/), а не код. В [ui/](ui/) — статический wireframe, прод-деплоя нет.

## Структура репозитория

```text
sab-win-26-parking/
├── AGENTS.md                ← этот файл, навигация для агента
├── README.md                ← вход для людей (русский)
├── README.en.md             ← вход для людей (английский)
├── CONTRIBUTING.md          ← регламент участников: ветки, коммиты, DoR/DoD, CI
├── SKILLS.md                ← baseline глобальных skills
├── docs/                    ← вся документация проекта
│   ├── readme.md            ← индекс документации
│   ├── project-overview.md  ← обзор проекта для новых участников
│   ├── styleguide.md        ← стиль текстов в документации
│   ├── specs/               ← требования (FR/NFR), глоссарий
│   ├── architecture/        ← архитектурные решения, ADR, C4
│   ├── artifacts/           ← use-case, BPMN, user flows
│   ├── interviews/          ← стенограммы интервью и разборы
│   ├── process/             ← регламенты: DoR/DoD, трассировка, релиз, ретро
│   ├── demo-days/           ← материалы Demo Days
│   └── assets/              ← бинарные ассеты витрины (OG-image, баннеры)
├── ui/                      ← статический wireframe (SCSS + Nunjucks → HTML)
├── plans/                   ← технические планы (один план = одна задача)
├── scripts/                 ← скрипты сборки, линтов, atomic-commit, Claude-hooks
│   ├── build/               ← сборка ui/ (build-templates.mjs)
│   ├── claude-hooks/        ← хуки Claude/Codex (см. ниже)
│   ├── docs/                ← подготовка документации (extract-docx, split-image)
│   ├── git/                 ← atomic-commit, check-branch-name, reminder
│   ├── graphify/            ← инкрементальное AST-обновление графа и тесты хуков
│   ├── integrations/        ← интеграции (buildin-auth, buildin-explore)
│   ├── lint/                ← кастомные линтеры markdown / file-names / mermaid
│   ├── plans/               ← validate-plans.mjs
│   └── sql-practice/        ← проверка CSV-результатов SQL-заданий
├── .codex/                  ← настройки Codex: config.toml, hooks.json
├── .husky/                  ← git-хуки: commit-msg, pre-commit, pre-push
├── .github/                 ← CI workflows, PR/Issue templates, CODEOWNERS
└── sql/                     ← SQL-заготовки для учебной части
```

### Где что искать

| Что нужно                      | Куда смотреть                                                                      |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| О проекте, границы системы     | [README.md](README.md)                                                             |
| Требования (FR/NFR), глоссарий | [docs/specs/](docs/specs/)                                                         |
| Архитектура, ADR, C4           | [docs/architecture/](docs/architecture/)                                           |
| Use-case, BPMN, user flows     | [docs/artifacts/](docs/artifacts/)                                                 |
| Интервью                       | [docs/interviews/](docs/interviews/)                                               |
| Регламенты процесса            | [docs/process/readme.md](docs/process/readme.md)                                   |
| Матрица трассировки (правила)  | [docs/process/traceability-matrix.md](docs/process/traceability-matrix.md)         |
| Матрица трассировки (журнал)   | [docs/process/traceability-matrix-log.md](docs/process/traceability-matrix-log.md) |
| Wireframe                      | [ui/templates/pages/](ui/templates/pages/), сборка `npm run build`                 |
| Технические планы              | [plans/](plans/), [plans/README.md](plans/README.md)                               |
| Скрипты (прочие)               | [scripts/](scripts/)                                                               |

## Правила для агента

1. **Не коммить и не пушить без явной просьбы.** Коммит делает пользователь. При накопившемся диффе — напомни про `npm run commit:atomic` (или `:dry-run` для предпросмотра). Если пользователь явно попросил коммит — добавляй файлы поштучно по имени, никогда `git add -A` или `git add .` (в параллельных чатах могут быть чужие правки).

2. **При сложной или плохо сформулированной задаче — спрашивай.** Если задача неоднозначна, есть скрытые предположения, или непонятен скоуп — задай уточняющие вопросы в режиме диалога **до** начала работы. Лучше потратить ход на вопрос, чем переделывать.

3. **Не меняй [docs/specs/](docs/specs/) без разрешения.** Это источник истины по требованиям. Если считаешь что правка нужна — сначала спроси у пользователя с обоснованием (что меняешь и почему). После разрешения — правь, обнови [журнал трассировки](docs/process/traceability-matrix-log.md). Устаревшие требования помечай, не удаляй.

4. **Сверяйся с трассировкой.** При правке артефакта, требования или архитектурного решения — проверь связь `Источник → Требование → Изменения → Проверка → Доказательство`. Регламент — [docs/process/traceability-matrix.md](docs/process/traceability-matrix.md). Журнал обновляется в том же PR. Каждая строка журнала — не длиннее 500 символов (`check-markdown.mjs` проверяет это как часть `npm run ci:check`). Поле Source пиши кратко — детали идут в PR-описание.

5. **Имена файлов и папок — латиница, kebab-case.** Даже если содержимое на русском. Без пробелов, кириллицы, camelCase, PascalCase. Проверка — `npm run lint:file-names`.

6. **После выполнения плана — пиши ретро.** Когда работа по плану из [plans/](plans/) завершена: (a) все фазы отмечены `[x]`, секция `## Итог` заполнена; (b) создан `docs/process/retro/YYYY-MM-DD-название.md` (то же имя, что у плана) по формату из [docs/process/retro/README.md](docs/process/retro/README.md). Обязательный шаг.

## MCP-серверы и поиск

**markdown_rag** — локальный RAG по markdown через Milvus. **Первичный инструмент семантического поиска по [docs/](docs/)**:

- `mcp__markdown_rag__search_documents` — поиск по смыслу. Запускай первым делом, когда ищешь концепцию или формулировку в документации.
- `mcp__markdown_rag__index_documents` — индексация docs/. Запускай **только с явного разрешения пользователя** — операция медленная.
- `mcp__markdown_rag__clear_index` — сброс индекса (нужен очень редко, только с разрешения пользователя).
- Grep по docs/ — fallback, когда `search_documents` вернул пустой результат или нужен точный токен/строка.

**github** — issues, PR, коммиты через MCP вместо `gh` CLI. Не пушь и не создавай PR без явной просьбы.

**playwright** — проверка wireframe в браузере при правках [ui/](ui/).

**miro** — C4-диаграммы и схемы процессов из [docs/architecture/](docs/architecture/).

**buildin.ai** — внешний knowledge-base команды (use case, ER-модели, заметки). Страницы закрыты от анонимного доступа («Sharing is off») — `WebFetch` и MCP Playwright читают только заглушку. Воркфлоу:

1. **Авторизация (один раз / при истечении сессии).** Креды лежат в `.env` (`BUILDIN_EMAIL`, `BUILDIN_PASSWORD`) — не в контексте Codex. Запуск:

   ```bash
   .venv/bin/python scripts/integrations/buildin-auth.py
   ```

   Скрипт открывает Chromium (`headless=False`), логинится и сохраняет cookies в `.playwright-session.json`. Файл в `.gitignore`.

   Если `.venv` сломан (например, переезжал каталог проекта) — пересоздать: `python3 -m venv --clear .venv && .venv/bin/pip install playwright python-dotenv`. Повторно ставить браузер через `playwright install chromium` нужно только если Chromium еще не установлен в кеше.

2. **Чтение страницы.** При наличии `.playwright-session.json`:

   ```bash
   .venv/bin/python scripts/integrations/buildin-explore.py "<url>"
   ```

   Скрипт ходит headless с сохраненной сессией, скроллит лениво подгружаемые блоки и складывает в `.playwright-mcp/`:
   - `buildin-explore-text.txt` — `body.innerText` (основной источник для извлечения текста UC и т.п.)
   - `buildin-explore-full.png` — полный скриншот
   - `buildin-explore-links.txt`, `buildin-explore-images.txt` — ссылки и картинки

3. **Если сессия истекла** (страница-заглушка / редирект на `/login`) — повторить шаг 1.

Не использовать MCP `playwright__browser_navigate` для buildin-страниц без сессии — он не авторизован и увидит «Sharing is off». Прямой `WebFetch` для buildin тоже бессмыслен — страница SPA и рендерится JS.

## Автоматические блокировки (Codex hooks)

В [.codex/hooks.json](.codex/hooks.json) подключены хуки из [scripts/claude-hooks/](scripts/claude-hooks/). Если действие заблокировано — это политика, не баг:

- `block-push-to-main.mjs` — запрет push в `main`.
- `block-unsafe-git-add.mjs` — запрет `git add -A` / `git add .`.
- `block-secret-write.mjs` — запрет записи в файлы, похожие на секреты.
- `validate-staged-plans.mjs`, `validate-plan-on-write.mjs` — валидация формата [plans/](plans/).
- `format-on-write.mjs` — авто-форматирование Prettier после записи.
- `remind-graph-navigation.mjs` — напоминание использовать граф перед сырым поиском.
- [scripts/graphify/update-ast-on-change.mjs](scripts/graphify/update-ast-on-change.mjs) — AST-only обновление Graphify после изменений кода.
- `play-sound.sh` — звуковые сигналы запроса разрешения и завершения хода.

## Git-хуки (husky) и CI

- `commit-msg` — commitlint, Conventional Commits (типы: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `build`, `perf`, `revert`).
- `pre-commit` — `git-workflow-agent-reminder` (напоминание про atomic-commit) + `check:plans:staged`.
- `pre-push` — `git-workflow-agent-reminder --worktree` + `check:branch` + `ci:check`.

Ветки: `feature/`, `docs/`, `chore/`, `hotfix/`. Прямой push в `main` запрещен.

CI на PR: `policy-checks`, `quality-gates` (`ci:check`), `commitlint`, семантический заголовок PR.

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
npm run test:sql-oracle         # тесты проверяющего оракула SQL-практики
npm run sql:oracle -- <команда> # описать или проверить CSV-результат задания
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

Перед тем как сказать «готово», пробеги по чеклисту:

- [ ] Если правил [docs/specs/](docs/specs/) — было явное разрешение пользователя.
- [ ] [Журнал трассировки](docs/process/traceability-matrix-log.md) обновлен (если затронуты требования/артефакты/архитектура).
- [ ] Имена новых файлов — латиница kebab-case (`npm run lint:file-names` зеленый).
- [ ] Локальные проверки прошли (`npm run ci:check`).
- [ ] Если работал по плану из [plans/](plans/) — фазы `[x]`, `## Итог` заполнен, ретро в [docs/process/retro/](docs/process/retro/) написано.
- [ ] AGENTS.md обновлен, если поменялась структура репозитория или появились новые правила.
- [ ] Пользователю напомнено про `npm run commit:atomic` (если накопился крупный дифф).

## Язык

Отвечай на русском. В документации и коммитах **не используется буква «ё»** — это договоренность проекта (см. [CONTRIBUTING.md](CONTRIBUTING.md#стиль-текстов-в-документации)). Пишем «все», «еще», «подъем», «перенести». Проверяй вывод перед сохранением.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, invoke the `skill` tool with `skill: "graphify"` before doing anything else.

Rules:

- ALWAYS read graphify-out/GRAPH_REPORT.md before reading any source files, running grep/glob searches, or answering codebase questions. The graph is your primary map of the codebase.
- IF graphify-out/wiki/index.md EXISTS, navigate it instead of reading raw files
- For cross-module "how does X relate to Y" questions, prefer `graphify query "<question>"`, `graphify path "<A>" "<B>"`, or `graphify explain "<concept>"` over grep — these traverse the graph's EXTRACTED + INFERRED edges instead of scanning files
- Codex Stop and Git post-commit/post-checkout hooks invoke [the AST wrapper](scripts/graphify/update-ast-on-change.mjs) after code changes. Run `npm run graph:update:ast` for the same update manually. It does not call an LLM.
- Run `npm run graph:check-update` to check whether semantic extraction is pending.
- Run `npm run graph:update:semantic` only after an explicit user request. It rebuilds the graph from AST plus semantic cache and sends only cache misses to the configured LLM.
- Keep `graphify-out/cache/ast/` and `graphify-out/cache/semantic/` in Git so unchanged files can reuse cache entries on other computers.
