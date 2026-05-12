# План: чистка следов Cursor из репозитория

**Дата**: 2026-05-12
**Задача**: Удалить артефакты Cursor (`.cursor/`, `docs/process/cursor-agent-commands.md`, `evals/`) и упоминания в .md и скриптах. Отвязать husky-хуки, atomic-commit и `.claude/settings.json` от Cursor. Сохранить инфраструктуру Claude Code и Codex.

## Зачем именно так

Репозиторий готовится к виду портфолио. Cursor больше не используется в работе, но его следы создают впечатление «технологического зоопарка»: каталог `.cursor/` на 29 файлов, отдельный публичный документ `docs/process/cursor-agent-commands.md`, папка `evals/` с тестами для одного-единственного cursor-правила, упоминания в README, CLAUDE.md, CONTRIBUTING.md, SKILLS.md, в `docs/process/readme.md` и в трёх скриптах. Вдобавок husky-хуки и `.claude/settings.json` напрямую ссылаются на cursor-агентов и cursor-файлы.

Файлы Claude Code (`.claude/`, `CLAUDE.md`) и Codex (`.codex`) остаются — это активные инструменты пользователя.

Альтернатива «оставить как есть» отброшена: следы AI-инструмента, который не используется, сигнализируют рекрутеру о беспорядке, затрудняют чтение README и увеличивают объём «нерабочего» контента в репозитории.

## Цель

1. Cursor физически отсутствует: каталога `.cursor/` нет, `docs/process/cursor-agent-commands.md` нет, `evals/` нет.
2. В **зафиксированном списке файлов** (см. ниже секцию «Файлы для чистки») упоминаний `cursor` не осталось — кроме имени самого плана, имени ретро и пути рабочей директории, которые физически вычистить нельзя.
3. Husky-хуки (`commit-msg`, `pre-commit`, `pre-push`) и CI работают и не ссылаются на Cursor.
4. `.claude/settings.json` не содержит cursor-специфичных permission-правил.
5. `npm run ci:check` и `npm run lint:md-links` зелёные локально; GitHub Actions (`policy-checks`, `quality-gates`, `commitlint`) зелёные после push (push делает пользователь).
6. `.gitignore` сохраняет правила про `.cursor/mcp.json*` как страховку от случайной утечки API-ключей (см. секцию ниже).

### Файлы для чистки (зафиксированный список)

Корневые `.md`: `README.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `SKILLS.md`.
В `docs/`: `docs/process/readme.md`, `docs/process/project-journey.md`.
В `scripts/`: `scripts/check-markdown.mjs`, `scripts/atomic-commit.mjs`, `scripts/git-workflow-agent-reminder.mjs`, `scripts/check-file-names.mjs`.
Конфиги: `.claude/settings.json`.

**Не входит в проверку:** `docs/process/traceability-matrix-log.md` (история), `docs/process/retro/` (существующие ретро), `docs/process/retro/README.md` (Cursor как enum в шаблоне), `.gitignore` (правила `.cursor/mcp.json*` оставляем намеренно), `plans/2026-05-12-cleanup-cursor-traces.md` (имя плана), `docs/process/retro/2026-05-12-cleanup-cursor-traces.md` (имя ретро), `CLAUDE.md` (упоминание `.cursor/` в навигации — снимается, но путь рабочей директории `~/cursor/...` в hooks-выводе физически не контролируется планом).

## Scope

**Входит:**

- Удаление каталога `.cursor/` целиком (31 файл: 5 commands, 5 agents, 15 rules, плюс `subagents.md`, `installed-skills.md` и игнорируемые `mcp.json*`).
- Удаление `docs/process/cursor-agent-commands.md`.
- Удаление папки `evals/` целиком (`evals.json` явно содержит `"skill_name": "create-fr"` — это evals только для удаляемого правила `.cursor/rules/create-fr.mdc`).
- Правки в 4 корневых .md: `README.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `SKILLS.md` — убрать упоминания Cursor и evals.
- Правки в `docs/process/readme.md` и `docs/process/project-journey.md` — убрать упоминания Cursor. **В `project-journey.md:138`** фраза «с помощью Cursor был собран прототип ui/» переписывается как «с помощью AI-агента был собран прототип ui/» (зафиксированное решение, см. риск #11 в roadmap).
- Отвязка скриптов от Cursor:
  - `scripts/check-markdown.mjs:17` — убрать `.cursor` из `EXCLUDE_DIRS`.
  - `scripts/atomic-commit.mjs` — удалить cursor-bucket (строки 206-207, 379-381, 462) **после** удаления `.cursor/`.
  - `scripts/git-workflow-agent-reminder.mjs` — убрать ссылки на `.cursor/agents/git-workflow-master.md` и `.cursor/commands/review-pr-readiness.md` в `printReminder` (строки 4, 74, 76); сохранить функционал напоминания про atomic-commit.
  - `scripts/check-file-names.mjs:12,19` — убрать `evals` из `SCAN_ROOTS`.
- Правка `.claude/settings.json` через скилл `update-config` — убрать `Read(.cursor/mcp.json)` и `Read(.cursor/mcp.json.example)` из `deny`.

**Не входит:**

- Журнал трассировки `docs/process/traceability-matrix-log.md` **не трогаем**: исторические CHG-записи 61, 62, 93, 94, 95, 99, 100 содержат `.cursor/...` как факт истории — переписывать историю нельзя.
- Шаблон `docs/process/retro/README.md:33` **не трогаем**: «Cursor» там — валидное значение enum в шаблоне ретро (`Claude Code / Cursor / человек / смешанная сессия`), это не «упоминание для чистки».
- Существующие ретро в `docs/process/retro/` — не трогаем, даже если содержат `Агент: Cursor`.
- Каталог `temp_context/` — не в основном scope (черновики), но стоит проверить и при необходимости отметить как устарелое.
- `.gitignore` правила `.cursor/mcp.json` и `.cursor/mcp.json.example` — **оставляем** как страховку: правило стоит копейки, защищает от случайного коммита API-ключей, если каталог `.cursor/` будет пересоздан локально (другой инструмент, форк, ошибочный `mkdir`).
- Структурные правки в `scripts/` или `package.json` (это другой план).
- README как витрина (отдельный план).
- Файлы Claude Code и Codex.

## Каскадные ссылки для починки

После удаления файлов поломаются ссылки в:

- `docs/process/readme.md:8` → `cursor-agent-commands.md` (удалить ссылку и строку).
- `README.md:117` → описание `evals` (удалить).
- `README.md:123` → описание `.cursor/` (удалить).
- `CLAUDE.md:30,52` → структура и таблица «Где что искать» (удалить строки про `.cursor/`).
- `SKILLS.md:12,22-27,68,75` → пункты про `.cursor/rules`, `.cursor/commands`, `.cursor/agents` (удалить или переписать только под Claude).
- `CONTRIBUTING.md:24,48,50` → ссылки на `.cursor/agents/git-workflow-master.md` и упоминание Cursor-bucket в atomic-commit (переписать без Cursor).
- `docs/process/project-journey.md:138` → «с помощью Cursor был собран прототип ui/» — **переписать на «с помощью AI-агента был собран прототип ui/»** (фиксированное решение, не «на усмотрение»; см. риск #11 в roadmap).

## Правила коммитов и веток

- **Работаем на единой ветке `docs/portfolio-roadmap`** — создана в начале roadmap-сессии. Отдельная ветка под подплан **не создаётся**.
- **Все коммиты и push делает пользователь.** План перечисляет рекомендуемые логические группы изменений (что должно быть в одном коммите), но не выполняет команды коммита. Агент после каждой фазы сообщает о накопившемся диффе и предлагает группировку.
- Без `git add -A`. Поштучно.

**Рекомендуемая группировка коммитов (порядок важен):**

1. `chore(repo): удалить каталог .cursor/, docs/process/cursor-agent-commands.md и папку evals/`
2. `docs(repo): убрать упоминания cursor из 4 корневых .md`
3. `docs(process): убрать упоминания cursor из docs/process/readme.md и project-journey.md`
4. `chore(scripts): отвязать atomic-commit, check-markdown, git-workflow-reminder, check-file-names от cursor и evals`
5. `chore(claude): убрать cursor-deny-правила из .claude/settings.json`

**Почему именно такой порядок:** удаление файлов идёт **первым**, пока `scripts/atomic-commit.mjs` ещё знает про cursor-bucket — он сможет корректно сгруппировать 31 файл `.cursor/*` в один коммит, если пользователь захочет использовать atomic-commit. Только после этого, в шаге 4, вырезается cursor-bucket из самого скрипта. Если поменять местами — atomic-commit либо упадёт, либо тихо смешает cursor-файлы в default-bucket.

## Определение «готово»

- [x] Каталог `.cursor/` физически не существует
- [x] Файл `docs/process/cursor-agent-commands.md` физически не существует
- [x] Папка `evals/` физически не существует
- [x] В каждом из файлов **зафиксированного списка** (см. секцию «Файлы для чистки» в «Цель») `grep -i cursor` возвращает 0 совпадений. Список: `README.md`, `CLAUDE.md`, `CONTRIBUTING.md`, `SKILLS.md`, `docs/process/readme.md`, `docs/process/project-journey.md`, `scripts/check-markdown.mjs`, `scripts/atomic-commit.mjs`, `scripts/git-workflow-agent-reminder.mjs`, `scripts/check-file-names.mjs`, `.claude/settings.json`. Файлы из «Не входит в проверку» **не проверяются**.
- [x] `.claude/`, `CLAUDE.md`, `.codex`, `SKILLS.md`, `.mcp.json` — на месте, по существу не изменены (кроме точечного снятия cursor-упоминаний в `.claude/settings.json` и `SKILLS.md`)
- [x] `.gitignore` сохраняет правила `.cursor/mcp.json` и `.cursor/mcp.json.example` (страховка)
- [x] `docs/process/traceability-matrix-log.md` **не изменён** (`git diff` по этому файлу — пустой)
- [x] `docs/process/retro/README.md` **не изменён** (Cursor остаётся как enum-значение)
- [x] `git-workflow-agent-reminder` выводит напоминание про atomic-commit без cursor-ссылок (smoke через `node scripts/git-workflow-agent-reminder.mjs`)
- [x] `npm run ci:check` зелёный локально
- [x] `npm run lint:md-links` зелёный локально
- [ ] После push ветки `docs/portfolio-roadmap` (push делает пользователь): GitHub Actions `policy-checks`, `quality-gates`, `commitlint` — зелёные. Это покрывает реальный прогон `pre-push`-логики (husky `pre-push` локально через `git push --dry-run` не триггерится).
- [x] Ретро написано в `docs/process/retro/2026-05-12-cleanup-cursor-traces.md`

## Фазы и статус

- [x] Фаза 1. Подплан выполняется на ветке `docs/portfolio-roadmap` (создана в начале roadmap-сессии — отдельную не заводим). Финальная инвентаризация cursor-следов через `grep -ril cursor` с исключением `.git`, `node_modules`, `.venv*`, журнала трассировки и `docs/process/retro/` — сверка с «Файлы для чистки» из секции «Цель».
- [x] Фаза 2. Физическое удаление: `rm -r .cursor/`, `rm docs/process/cursor-agent-commands.md`, `rm -r evals/`. Пользователь коммитит (cursor-bucket в `atomic-commit.mjs` пока работает и корректно сгруппирует `.cursor/*`).
- [x] Фаза 3. Чистка корневых .md (README, CLAUDE, CONTRIBUTING, SKILLS) от упоминаний Cursor и evals. Пользователь коммитит.
- [x] Фаза 4. Чистка `docs/process/readme.md` и `docs/process/project-journey.md` (фраза про прототип ui/ → «с помощью AI-агента»). Журнал трассировки и retro/README.md **не трогаем**. Пользователь коммитит.
- [x] Фаза 5. Отвязка скриптов: `check-markdown.mjs` (убрать `.cursor` из `EXCLUDE_DIRS` — файл остаётся, это кастомный линтер, не legacy), `atomic-commit.mjs` (cursor-bucket), `git-workflow-agent-reminder.mjs` (cursor-ссылки в `printReminder`), `check-file-names.mjs` (`evals` в `SCAN_ROOTS`). После каждой правки — `node` smoke-тест. Пользователь коммитит.
- [x] Фаза 6. Правка `.claude/settings.json` через скилл `update-config` — убрать `Read(.cursor/mcp.json)` и `Read(.cursor/mcp.json.example)` из `deny`. Пользователь коммитит.
- [x] Фаза 7. Прогон `npm run ci:check` и `npm run lint:md-links` локально. Фикс каскадных ссылок (см. секцию выше). Если есть правки — пользователь коммитит отдельным fix-коммитом.
- [ ] Фаза 8. **Прогон CI/CD:** пользователь делает `git push` ветки `docs/portfolio-roadmap` — на GitHub Actions проходят `policy-checks`, `quality-gates` (включая `ci:check`), `commitlint`, проверка семантического заголовка PR. Это реальная проверка `pre-push`-логики (husky `pre-push` локально через `--dry-run` не срабатывает — это технический факт git/husky). Дополнительно локально: `node scripts/git-workflow-agent-reminder.mjs` выводит напоминание без cursor-ссылок.
- [x] Фаза 9. Ретро в `docs/process/retro/2026-05-12-cleanup-cursor-traces.md` и закрытие плана.

## Итог

Все 34 файла Cursor удалены, 11 целевых файлов очищены от упоминаний, инфраструктура Claude Code и скрипты работают штатно. `npm run ci:check` и `npm run lint:md-links` — зеленые. Ожидается только push и прогон GitHub Actions (фаза 8).
