# План: упрощение scripts/ и package.json

**Дата**: 2026-05-12
**Задача**: Убрать дубликаты (`scripts/atomic-commit.sh` и npm-скрипты `commit:atomic:sh*`), сгруппировать `scripts/` по подкаталогам, слить два markdownlint-конфига в один, переименовать обманчивый npm-скрипт `lint:md:legacy` → `lint:md:custom`, удалить пустой `.agents/` и устаревший `docs/repo-context-compressed.md`. Подплан 8 из roadmap `plans/2026-05-12-portfolio-roadmap.md`.

## Стартовое состояние и предусловия

- Ветка `docs/portfolio-roadmap`. На момент старта в `git status` присутствует `M plans/2026-05-12-portfolio-roadmap.md` — это правки из общей roadmap-сессии, не относящиеся к подплану 8. **До начала фазы 1** этот файл должен быть либо закоммичен пользователем отдельным коммитом, либо `git stash`-нут. Иначе фаза 12 (обновление roadmap-таблицы + ретро) случайно зацепит чужие правки в один коммит.
- Перед стартом убедиться: `git diff --name-only` показывает либо чистое дерево, либо только тот файл, который пользователь намеренно оставил для этой работы.
- Если в ходе работы появится дополнительный modified-файл из параллельного чата — пауза, разбор, и только потом продолжение.

## Зачем именно так

`scripts/` к моменту начала портфолио-roadmap разрослась до 14 файлов на верхнем уровне + 2 подкаталога. На один и тот же atomic-commit лежат и `.mjs`, и `.sh` (`.sh`-версия — исторический бэкап, никем не вызывается, но добавляет 3 npm-скрипта `commit:atomic:sh*` и шум в `package.json`). Имя `lint:md:legacy` вводит в заблуждение — это не legacy, а кастомный линтер с уникальными проверками (длина строк ≤500 для журнала трассировки, H2 в process-docs, trailing whitespace, merge-маркеры, завершающий newline). Markdownlint-cli2 этого не делает. Кроме того, в репо два markdownlint-конфига — `.markdownlint-cli2.jsonc` (точка входа cli2) и `.markdownlint.jsonc` (extend-база); cli2 умеет работать с одним файлом, и держать два — лишний шум для нового читателя.

Альтернатива «оставить scripts/ плоскими» отброшена: 14 файлов без группировки усложняют чтение и навигацию по PR, а в портфолио нужна аккуратная оснастка. Альтернатива «переписать сами скрипты» отброшена — это другой скоуп, здесь только перестановка и упрощение конфигурации.

`scripts/check-markdown.mjs` **сохраняется** — это решение зафиксировано в roadmap и явно подтверждается уникальным составом проверок (см. выше).

`.markdownlint-cli2.jsonc` остается как имя итогового файла — это явная точка входа для текущего инструмента и в дефолтном порядке поиска markdownlint-cli2 cli2-файлы идут раньше `.markdownlint.jsonc`. Содержимое `.markdownlint.jsonc` инлайнится в `config` итогового файла, поле `ignores` сохраняется.

## Цель

1. `scripts/atomic-commit.sh` физически удален; npm-скрипты `commit:atomic:sh`, `commit:atomic:sh:yes`, `commit:atomic:sh:dry-run` удалены из `package.json`.
2. Файлы в `scripts/` сгруппированы по подкаталогам: `lint/`, `plans/`, `build/`, `git/`, `integrations/` (плюс уже существующие `claude-hooks/` и `docs/` — без изменений). Все ссылки в `package.json`, `.husky/pre-commit`, `.husky/pre-push`, `.github/workflows/ci.yml` обновлены и работают.
3. `.markdownlint.jsonc` слит в `.markdownlint-cli2.jsonc`, отдельный файл удален. `npm run lint:md` и `npm run lint:md:fix` отрабатывают как раньше.
4. npm-скрипт `lint:md:legacy` переименован в `lint:md:custom`. Вызов в `ci:check` обновлен. Упоминания (если есть) в `CLAUDE.md`, `CONTRIBUTING.md`, `docs/process/*` тоже обновлены.
5. Пустой каталог `.agents/` удален.
6. `docs/repo-context-compressed.md` удален, путь добавлен в `.gitignore`.
7. `npm run ci:check` — зеленый локально.
8. После push ветки `docs/portfolio-roadmap` (push делает пользователь): GitHub Actions `policy-checks`, `quality-gates`, `commitlint` — зеленые. Это критично **до старта подплана 1** (README-витрина), потому что подплан 1 будет полагаться на стабильную оснастку.

### Файлы и пути для правок (зафиксированный список)

Удаляются:

- `scripts/atomic-commit.sh`
- `.agents/` (пустой каталог)
- `docs/repo-context-compressed.md`
- `.markdownlint.jsonc`

Создаются (как подкаталоги внутри `scripts/`):

- `scripts/lint/`
- `scripts/plans/`
- `scripts/build/`
- `scripts/git/`
- `scripts/integrations/`

Перемещаются (с сохранением имен файлов; пути даны как «было → стало»):

- `scripts/check-markdown.mjs` → `scripts/lint/check-markdown.mjs`
- `scripts/check-markdown-links.mjs` → `scripts/lint/check-markdown-links.mjs`
- `scripts/check-file-names.mjs` → `scripts/lint/check-file-names.mjs`
- `scripts/lint-mermaid.mjs` → `scripts/lint/lint-mermaid.mjs`
- `scripts/check-traceability-matrix-update.mjs` → `scripts/lint/check-traceability-matrix-update.mjs`
- `scripts/validate-plans.mjs` → `scripts/plans/validate-plans.mjs`
- `scripts/build-templates.mjs` → `scripts/build/build-templates.mjs`
- `scripts/atomic-commit.mjs` → `scripts/git/atomic-commit.mjs`
- `scripts/check-branch-name.mjs` → `scripts/git/check-branch-name.mjs`
- `scripts/git-workflow-agent-reminder.mjs` → `scripts/git/git-workflow-agent-reminder.mjs`
- `scripts/buildin-auth.py` → `scripts/integrations/buildin-auth.py`
- `scripts/buildin-explore.py` → `scripts/integrations/buildin-explore.py`
- `scripts/google-auth.py` → `scripts/integrations/google-auth.py`

Не трогаются (остаются на текущих путях):

- `scripts/claude-hooks/` целиком (10 файлов — все пути уже подключены через `.claude/settings.json`)
- `scripts/docs/` целиком (`extract-docx.py`, `split-image.py`, `readme.md`)

Правятся (пути и имена скриптов):

- `package.json` — все `node ./scripts/*` и `bash ./scripts/*`, плюс блок `scripts` (удаление 3 `commit:atomic:sh*`, переименование `lint:md:legacy` → `lint:md:custom`, обновление `ci:check`).
- `.husky/pre-commit` — путь к `git-workflow-agent-reminder.mjs`.
- `.husky/pre-push` — путь к `git-workflow-agent-reminder.mjs`.
- `.github/workflows/ci.yml` — пути к `check-branch-name.mjs` и `check-traceability-matrix-update.mjs`.
- `.gitignore` — добавить `docs/repo-context-compressed.md`.
- `.markdownlint-cli2.jsonc` — инлайнить `config` из `.markdownlint.jsonc` (вместо `extends`), сохранить `ignores`.

Проверяются на скрытые ссылки (фаза 1):

- `CLAUDE.md`, `CONTRIBUTING.md`, `SKILLS.md`, `README.md`, `docs/process/readme.md`, `docs/process/pr-dor-dod.md`, `docs/process/retro/README.md`, `scripts/docs/readme.md`, `.claude/rules/*.md`. Если найдены ссылки на старые пути или старое имя `lint:md:legacy` — починить в той же фазе, где меняется источник.

## Scope

**Входит:**

- Удаление 4 артефактов (`scripts/atomic-commit.sh`, `.agents/`, `docs/repo-context-compressed.md`, `.markdownlint.jsonc`).
- Создание 5 новых подкаталогов в `scripts/` и перенос 13 файлов (10 `.mjs` + 3 `.py`).
- Обновление путей в `package.json` (все `node ./scripts/*` и `bash ./scripts/*` строки), `.husky/pre-commit`, `.husky/pre-push`, `.github/workflows/ci.yml`.
- Удаление 3 npm-скриптов `commit:atomic:sh*` из `package.json`.
- Переименование `lint:md:legacy` → `lint:md:custom` в `package.json` (с обновлением `ci:check`) и в текстах `CLAUDE.md`/`CONTRIBUTING.md`/`docs/process/*`, если упоминания найдены.
- Слияние `.markdownlint.jsonc` в `.markdownlint-cli2.jsonc` с сохранением правил и `ignores`.
- Добавление `docs/repo-context-compressed.md` в `.gitignore`.
- Smoke-проверки после правок: `npm run ci:check`, `npm run lint:md-links`, `node scripts/git/git-workflow-agent-reminder.mjs`, `npm run commit:atomic:dry-run` (что atomic-commit жив после перемещения).
- Прогон GitHub Actions после push (push делает пользователь).

**Не входит:**

- Изменение содержимого самих скриптов (только перемещение и правки имен в обращениях).
- Переименование файлов `.mjs`/`.py` (имена файлов сохраняются — только пути).
- Переписывание `scripts/docs/readme.md` целиком (точечная правка путей — да, если упоминания есть).
- Журнал трассировки `docs/process/traceability-matrix-log.md` — этот подплан не меняет требования и не затрагивает артефакты системного анализа, журнал не обновляется. Это явно фиксируется в «Итоге».
- Реструктуризация `scripts/claude-hooks/` и `scripts/docs/` — они уже структурно сгруппированы и подключены, трогать их в этом подплане — лишний риск (`.claude/settings.json` ссылается на 10 файлов в `claude-hooks/`).
- Любые правки в `.cursor/` — каталог удален в подплане 7.
- README-витрина, TL;DR-карточки, превью-картинки — это подпланы 1/3/2.

## Каскадные ссылки для починки

После перемещения скриптов поломаются прямые ссылки в следующих местах (фиксирую сейчас, чтобы не искать потом):

- **`package.json`** — 11 npm-скриптов содержат пути `./scripts/*.mjs` или `./scripts/*.sh`:
  - `lint:md:legacy` → `node ./scripts/check-markdown.mjs` (после правки: `node ./scripts/lint/check-markdown.mjs` + переименование самого ключа в `lint:md:custom`).
  - `lint:md-links` → `node ./scripts/check-markdown-links.mjs` → `node ./scripts/lint/check-markdown-links.mjs`.
  - `lint:file-names` → `node ./scripts/check-file-names.mjs` → `node ./scripts/lint/check-file-names.mjs`.
  - `lint:mermaid` → `node scripts/lint-mermaid.mjs` → `node scripts/lint/lint-mermaid.mjs`.
  - `check:branch` → `node ./scripts/check-branch-name.mjs` → `node ./scripts/git/check-branch-name.mjs`.
  - `check:plans` и `check:plans:staged` → `node ./scripts/validate-plans.mjs` → `node ./scripts/plans/validate-plans.mjs`.
  - `build:templates` → `node ./scripts/build-templates.mjs` → `node ./scripts/build/build-templates.mjs`.
  - `commit:atomic`, `commit:atomic:yes`, `commit:atomic:dry-run`, `commit:atomic:staged` → `node ./scripts/atomic-commit.mjs` → `node ./scripts/git/atomic-commit.mjs`.
  - `ci:check` — обновить ссылку на `lint:md:legacy` → `lint:md:custom`.
  - **Удалить целиком:** `commit:atomic:sh`, `commit:atomic:sh:yes`, `commit:atomic:sh:dry-run`.
- **`.husky/pre-commit`** — `node ./scripts/git-workflow-agent-reminder.mjs --staged` → `node ./scripts/git/git-workflow-agent-reminder.mjs --staged`.
- **`.husky/pre-push`** — `node ./scripts/git-workflow-agent-reminder.mjs --worktree` → `node ./scripts/git/git-workflow-agent-reminder.mjs --worktree`.
- **`.github/workflows/ci.yml`** — `node ./scripts/check-branch-name.mjs` → `node ./scripts/git/check-branch-name.mjs`; `node ./scripts/check-traceability-matrix-update.mjs` → `node ./scripts/lint/check-traceability-matrix-update.mjs`.
- **`CLAUDE.md`** — есть упоминания `npm run lint:md:legacy`? — проверить и обновить на `lint:md:custom`. Прямых упоминаний путей `scripts/*.mjs` в навигационной карте нет (только общая ссылка на `scripts/`), но финальная проверка через `grep -n 'scripts/' CLAUDE.md` обязательна. **Дополнительно** — в CLAUDE.md есть инструкции про `.venv/bin/python scripts/buildin-auth.py` и `scripts/buildin-explore.py` — обновить на `scripts/integrations/buildin-auth.py` и `scripts/integrations/buildin-explore.py`.
- **`CONTRIBUTING.md`** — аналогично, `grep -n 'scripts/\|lint:md:legacy'`.
- **`scripts/docs/readme.md`** — `grep -n 'scripts/'` (если ссылается на старые пути — поправить).
- **`.claude/settings.json`** — **не трогается**: все ссылки идут на `scripts/claude-hooks/*`, эти пути не меняются.
- **`scripts/claude-hooks/*.mjs`** — фаза 1 шаг 1.2 проверяет, нет ли в них хардкод-вызовов вида `spawn('node', ['./scripts/check-markdown.mjs'])`. **Подтверждено фазой 1 — критичные находки:**
  - `scripts/claude-hooks/validate-staged-plans.mjs:28` — `execFileSync("node", [path.join(projectDir, "scripts", "validate-plans.mjs"), "--staged"])` — поломается при переносе validate-plans.mjs в `scripts/plans/`. Исправить в фазе 7 шаг 7.5: заменить `"scripts", "validate-plans.mjs"` на `"scripts", "plans", "validate-plans.mjs"`.
  - `scripts/claude-hooks/validate-plan-on-write.mjs:44` — аналогично, тот же path.join к validate-plans.mjs. Та же правка.
  - `scripts/claude-hooks/remind-atomic-commit.sh:14` — `node "${REPO_ROOT}/scripts/git-workflow-agent-reminder.mjs" --worktree` — поломается. Исправить в фазе 7 шаг 7.5: `scripts/git-workflow-agent-reminder.mjs` → `scripts/git/git-workflow-agent-reminder.mjs`.
- **`scripts/atomic-commit.mjs`, `scripts/git-workflow-agent-reminder.mjs`, `scripts/check-markdown.mjs`** — фаза 1 шаг 1.4 проверяет хардкод собственного пути в help-выводе/usage-строках/path.resolve. Правки идут в фазе 7 шаг 7.5 в составе того же атомарного коммита. **Подтверждено фазой 1:**
  - `scripts/atomic-commit.mjs:9-13` — help-текст содержит 5 строк с `node scripts/atomic-commit.mjs`. Тип (a) — показывается пользователю. Обновить на `node scripts/git/atomic-commit.mjs` в фазе 7 шаг 7.5.
  - BUCKET-правила в atomic-commit.mjs (строки ~208, ~354) — используют `f.startsWith("scripts/")` — безопасны, не ломаются: новые пути `scripts/git/*` и `scripts/lint/*` все равно начинаются с `scripts/`.
  - `scripts/git-workflow-agent-reminder.mjs` — самоссылок на `scripts/` нет. `check-markdown.mjs` — тоже чисто.
- **`.github/CODEOWNERS`** — фаза 1 шаг 1.3 проверяет, нет ли path-based правил на `scripts/*`. **Файл существует.** Правило: `/scripts/ @CeJIDb @team-ops`. Паттерн `/scripts/` в GitHub CODEOWNERS покрывает ВСЕ вложенные пути, включая `scripts/git/`, `scripts/lint/` и т.д. — ownership после реструктуризации не меняется. **Решение принято: CODEOWNERS не правится, опциональный коммит 8 из раздела «Правила коммитов» не нужен.**
- **`.claude/settings.json:9`** — `"Bash(npm run lint:md:legacy)"` — allowlist Claude Code. После фазы 6 (переименование ключа) эта запись перестанет матчить. **Добавляется к фазе 6:** вместе с правкой ключа в `package.json` поправить `.claude/settings.json`: `lint:md:legacy` → `lint:md:custom`.
- **`docs/process/readme.md`**, **`docs/process/pr-dor-dod.md`** — проверить упоминания npm-скриптов и путей.

## Правила коммитов и веток

- **Работаем на единой ветке `docs/portfolio-roadmap`** — она создана в начале roadmap-сессии. Отдельная ветка под подплан **не создается**.
- **Все коммиты и push делает пользователь.** План перечисляет рекомендуемые логические группы изменений (что должно быть в одном коммите), но не выполняет команды коммита. Агент после каждой фазы сообщает о накопившемся диффе и предлагает группировку.
- Без `git add -A`. Поштучно.

**Рекомендуемая группировка коммитов (порядок важен):**

1. `chore(scripts): удалить дубликат atomic-commit.sh и npm-скрипты commit:atomic:sh*`
2. `chore(repo): удалить пустой каталог .agents/` (только если фаза 3 нашла что коммитить)
3. `chore(repo): удалить docs/repo-context-compressed.md и добавить путь в .gitignore`
4. `chore(lint): слить .markdownlint.jsonc в .markdownlint-cli2.jsonc`
5. `chore(scripts): переименовать npm-скрипт lint:md:legacy → lint:md:custom`
6. `refactor(scripts): сгруппировать scripts/ по подкаталогам и обновить husky+CI` — **атомарный коммит** (бывшие фазы 6 и 7 из старой версии плана объединены): `git mv` 13 файлов + правки путей в `package.json` (10 npm-скриптов) + `.husky/pre-commit` + `.husky/pre-push` + `.github/workflows/ci.yml` + точечные правки внутренних хардкод-путей в `scripts/atomic-commit.mjs` и `scripts/git-workflow-agent-reminder.mjs` (если фаза 1 шаг 1.4 их нашла).
7. (опционально) `docs: обновить упоминания путей и lint:md:legacy в .md` — если grep фазы 1 нашел упоминания, не покрытые правками в фазах 2–6. Сюда же — правки CLAUDE.md про `scripts/integrations/buildin-*.py`.
8. (опционально) `chore(ci): обновить CODEOWNERS под новые пути scripts/` — только если фаза 1 шаг 1.3 нашла path-based правила и решение «обновить» зафиксировано.

**Почему именно такой порядок:**

- Удаление дубликатов (1–3) идет первым — они независимы от перестановок и не ломают ничего.
- Слияние markdownlint-конфигов (4) — независимая правка конфигурации, без побочных эффектов на пути.
- Переименование `lint:md:legacy → lint:md:custom` (5) идет **до** перемещения файла, чтобы в одном коммите менялось только имя ключа и его вызов в `ci:check`, без пути.
- Самое крупное изменение (6) — единый атомарный коммит. Если разделить «перемещение файлов» и «обновление husky» на два — `pre-commit` хук между ними физически указывает на несуществующий путь, и коммит-разделитель упадет с `ENOENT`. Атомарность обязательна.
- Текстовые правки (7) и CODEOWNERS (8) — последние штрихи, по результатам инвентаризации.

**Антипаттерны (что не делать):**

- Не разделять фазу 7 на два коммита (отдельный `git mv` и отдельный «обновить husky/CI») — это и был ключевой риск старой версии плана.
- Не запускать `npm run *` между шагами 7.2 и 7.5 — `package.json` уже видит новые пути в Edit-буфере, но на диске состояние перемешано.
- Не использовать `git commit --amend` после push'а ветки в фазе 11 — только новые fix-коммиты.

## Определение «готово»

- [ ] `scripts/atomic-commit.sh` физически не существует.
- [ ] `.agents/` физически не существует.
- [ ] `docs/repo-context-compressed.md` физически не существует, путь добавлен в `.gitignore`.
- [ ] `.markdownlint.jsonc` физически не существует; `.markdownlint-cli2.jsonc` содержит инлайн-правила (без `extends`) и сохраненный блок `ignores`.
- [ ] В `scripts/` на верхнем уровне нет `.mjs`/`.py` файлов (кроме того, что внутри подкаталогов `lint/`, `plans/`, `build/`, `git/`, `integrations/`, `claude-hooks/`, `docs/`).
- [ ] `package.json` не содержит ключей `commit:atomic:sh`, `commit:atomic:sh:yes`, `commit:atomic:sh:dry-run`, `lint:md:legacy`.
- [ ] `package.json` содержит ключ `lint:md:custom`, вызывающий `node ./scripts/lint/check-markdown.mjs`.
- [ ] `ci:check` ссылается на `lint:md:custom` (не на `lint:md:legacy`).
- [ ] Все npm-скрипты в `package.json` указывают на актуальные пути (нет ни одного `./scripts/*.mjs` или `bash ./scripts/*.sh` на верхнем уровне `scripts/`, кроме claude-hooks).
- [ ] `.husky/pre-commit` и `.husky/pre-push` указывают на `./scripts/git/git-workflow-agent-reminder.mjs`.
- [ ] `.github/workflows/ci.yml` указывает на `./scripts/git/check-branch-name.mjs` и `./scripts/lint/check-traceability-matrix-update.mjs`.
- [ ] `grep -n 'scripts/[a-z-]*\.mjs' CLAUDE.md CONTRIBUTING.md SKILLS.md README.md docs/process/readme.md docs/process/pr-dor-dod.md scripts/docs/readme.md` не возвращает ссылок на старые (плоские) пути.
- [ ] `grep -n 'lint:md:legacy' .` (исключая `node_modules`, `.git`, `plans/`, `docs/process/retro/`) — 0 совпадений.
- [ ] `npm run ci:check` — зеленый локально.
- [ ] `npm run lint:md-links` — зеленый локально.
- [ ] `npm run commit:atomic:dry-run` — отрабатывает без ошибок (atomic-commit жив после перемещения), и в выводе видно корректную классификацию файлов из новых подкаталогов `scripts/lint/`, `scripts/git/` и т.д.
- [ ] `node scripts/git/git-workflow-agent-reminder.mjs` — выводит напоминание без ошибок и без упоминания старого пути `scripts/git-workflow-agent-reminder.mjs` в тексте.
- [ ] `bash .husky/pre-push` — отрабатывает локально без ошибок (CI это не покрывает).
- [ ] Если фаза 1 шаг 1.3 нашла path-based правила в `.github/CODEOWNERS` — они либо обновлены под новые пути, либо смена ownership явно принята и зафиксирована в «Итоге».
- [ ] `M plans/2026-05-12-portfolio-roadmap.md` из стартового состояния либо закоммичен отдельно до фазы 1, либо включен в коммит фазы 12 (ретро + roadmap) **намеренно**, не случайно.
- [ ] После push ветки `docs/portfolio-roadmap` (push делает пользователь): GitHub Actions `policy-checks`, `quality-gates`, `commitlint` — зеленые. Это критическое условие до старта подплана 1.
- [ ] Ретро написано в `docs/process/retro/2026-05-12-simplify-scripts-package-json.md`.

## Фазы и статус

- [x] Фаза 1. Инвентаризация скрытых ссылок. Три отдельных grep-прохода, потому что один include-фильтр не покрывает все типы потребителей:
  1. **По текстовым/конфиг-файлам:** `grep -rn 'scripts/[a-z-]*\.mjs\|scripts/[a-z-]*\.py\|scripts/atomic-commit\.sh\|lint:md:legacy\|repo-context-compressed' --include='*.md' --include='*.json' --include='*.jsonc' --include='*.yml' --include='*.yaml' --include='*.sh' --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=plans --exclude-dir='docs/process/retro'`.
  2. **По исходникам скриптов** (исполняемый код может вызывать друг друга через `spawn`/`exec`/`import`): `grep -rn 'scripts/[a-z-]*\.mjs\|scripts/[a-z-]*\.py\|scripts/atomic-commit\.sh\|lint:md:legacy\|repo-context-compressed' --include='*.mjs' --include='*.js' --include='*.cjs' --include='*.ts' --include='*.py' --exclude-dir=node_modules --exclude-dir=.git`. Особый фокус — `scripts/claude-hooks/*.mjs` (если какой-то хук зовёт `node ./scripts/check-markdown.mjs` через child_process — это критично).
  3. **По husky-хукам без расширения и CODEOWNERS:** `grep -rn 'scripts/[a-z-]*\.mjs\|scripts/atomic-commit\.sh\|lint:md:legacy' .husky/ .github/CODEOWNERS 2>/dev/null` (CODEOWNERS может вовсе отсутствовать — это ОК, важно явно проверить). Если в CODEOWNERS найдены path-based правила на `scripts/*` — фиксируем в плане как дополнительный риск review-flow.
  4. **Внутри двух «самоссылающихся» скриптов** проверить хардкод собственного пути: `grep -n "scripts/" scripts/atomic-commit.mjs scripts/git-workflow-agent-reminder.mjs scripts/check-markdown.mjs`. Любая строка с `scripts/atomic-commit.mjs` или `scripts/git-workflow-agent-reminder.mjs` внутри их самих (часто это help-вывод, usage-строка, или path.resolve) — кандидат на правку в фазе 7.

  Все находки фиксируются в этом плане как дополнение к секции «Каскадные ссылки» до начала фазы 2. Если найдены неучтенные потребители — план обновляется.

- [x] Фаза 2. Удаление дубликатов: `git rm scripts/atomic-commit.sh` (именно `git rm`, не `rm` — файл tracked, чтобы удаление сразу попало в индекс; правило проекта запрещает `git add -A`, и `git add -u` тоже под `block-unsafe-git-add.mjs`). В `package.json` через Edit удалить ключи `commit:atomic:sh`, `commit:atomic:sh:yes`, `commit:atomic:sh:dry-run`. Пользователь коммитит (`chore(scripts): удалить дубликат atomic-commit.sh ...`). **Факт:** `scripts/atomic-commit.sh` удален из рабочего дерева и индекса (`D` в `git status`); ключи `commit:atomic:sh*` отсутствуют в `package.json`. Коммит — пользователем.
- [x] Фаза 3. Удаление `.agents/`: предварительно `ls -la .agents/ 2>/dev/null && git ls-files .agents/`. Если каталог tracked (хотя бы через `.gitkeep`) — `git rm -r .agents/`. Если в индексе пусто и в каталоге нет файлов — `rmdir .agents` (просто очистка рабочего дерева, git ничего не заметит). Пользователь коммитит (`chore(repo): удалить пустой каталог .agents/`) — **только** если есть staged-изменения; иначе фаза закрывается без коммита.
- [x] Фаза 4. Удаление `docs/repo-context-compressed.md`: `git rm docs/repo-context-compressed.md` (файл tracked, нужно явное удаление в индекс — `rm` оставит его в индексе и потребует ручного `git add` на deleted-файл, что усложняет поштучную добавку). Через Edit добавить путь в `.gitignore`. Пользователь коммитит (`chore(repo): удалить docs/repo-context-compressed.md ...`).
- [x] Фаза 5. Слияние markdownlint-конфигов:
  - 5.1 **Прочитать `.markdownlint.jsonc` целиком** и проверить: есть ли в нём собственное поле `extends`. Если есть (например, наследование от `markdownlint/style/all` или другого пресета) — **остановиться и обсудить с пользователем**: наивная замена `extends` в `.markdownlint-cli2.jsonc` на `config: { ...содержимое... }` потеряет вложенную цепочку наследования, и правила перестанут применяться без явных ошибок. Решение фиксируется в плане до 5.2.
  - 5.2 Если собственного `extends` нет — перенести правила в поле `config` файла `.markdownlint-cli2.jsonc` (заменив текущий `extends`-указатель), сохранить блок `ignores`. `git rm .markdownlint.jsonc`.
  - 5.3 Smoke: `npm run lint:md` (должен дать тот же результат, что до слияния) и `npm run lint:md:fix` (не должен ничего менять, потому что репо уже в норме). Если хотя бы один файл поменялся после `lint:md:fix` — поведение различается, чинить.
  - Пользователь коммитит (`chore(lint): слить .markdownlint.jsonc в .markdownlint-cli2.jsonc`).
- [x] Фаза 6. Переименование `lint:md:legacy` → `lint:md:custom` в `package.json` (и обновить вызов в `ci:check`). Smoke: `npm run lint:md:custom` (должен отработать как раньше). Пользователь коммитит (`chore(scripts): переименовать npm-скрипт lint:md:legacy → lint:md:custom`).
- [x] Фаза 7. **Атомарная группировка `scripts/` + обновление всех потребителей одним коммитом.** Это объединенная фаза (раньше была 7+8) — иначе между ними husky-хуки указывают на несуществующие пути и коммит фазы 7 в одиночку упадет с `ENOENT` в `pre-commit`. Шаги внутри фазы выполняются последовательно, без промежуточных коммитов и **без запуска npm-скриптов** между шагами 7.2 и 7.5:
  - 7.1 Создать пустые каталоги: `mkdir -p scripts/lint scripts/plans scripts/build scripts/git scripts/integrations`.
  - 7.2 `git mv` 13 файлов согласно таблице из «Файлы для правок» (через Bash; `git mv` сохраняет историю и mode). Не запускать никакие `npm run *` после этого шага — package.json еще указывает на старые пути, любой запуск упадет с ENOENT.
  - 7.3 Обновить все пути в `package.json` (10 npm-скриптов). При первой правке через Edit сработает `format-on-write` (prettier) — это может переупорядочить ключи. **Принимаем это в один коммит фазы 7**, потому что разделить уже не получится. Если prettier перетасовал ключи — это разовая нормализация, отражается в дифф.
  - 7.4 Обновить `.husky/pre-commit` и `.husky/pre-push` → `./scripts/git/git-workflow-agent-reminder.mjs`. Обновить `.github/workflows/ci.yml` → `./scripts/git/check-branch-name.mjs` и `./scripts/lint/check-traceability-matrix-update.mjs`. Это **обязательная часть того же коммита** — без этого pre-commit упадет.
  - 7.5 Если фаза 1 (шаг 1.4) нашла хардкод собственных путей внутри `scripts/atomic-commit.mjs` или `scripts/git-workflow-agent-reminder.mjs` (например, в help-выводе или path.resolve) — поправить эти константы здесь же. Без отдельного коммита.
  - 7.6 Проверить mode исполняемых файлов: `ls -l .husky/pre-commit .husky/pre-push` — должны иметь `x`-бит. В WSL `git mv` обычно сохраняет mode, но если бит потерян — `chmod +x .husky/pre-commit .husky/pre-push` (husky-файлы не перемещались, но `format-on-write` или другой хук теоретически мог их затронуть).
  - 7.7 Smoke до коммита (все `npm run *` уже видят новые пути):
    - `npm run check:plans` — путь к `validate-plans.mjs` рабочий.
    - `npm run lint:file-names` — путь к `check-file-names.mjs` рабочий, новые подкаталоги (kebab-case ASCII) проходят валидацию.
    - `npm run lint:md:custom` — путь к `check-markdown.mjs` рабочий и переименование живо.
    - `npm run lint:mermaid` — путь к `lint-mermaid.mjs` рабочий.
    - `npm run build` — путь к `build-templates.mjs` рабочий.
    - `npm run commit:atomic:dry-run` — atomic-commit запускается из нового пути. Этого **недостаточно** для проверки внутренней логики (см. ниже), но если падает — путь не починен.
    - **Глубокая проверка `atomic-commit.mjs`**: после dry-run прочитать вывод и убедиться, что классификация файлов по бакетам не сломалась (новые пути `scripts/lint/*` / `scripts/git/*` могут попасть в другие бакеты, чем раньше — это может быть OK, но проверить визуально, не «прочее ли это»).
    - `node ./scripts/git/git-workflow-agent-reminder.mjs` — отрабатывает без ENOENT, и в выводе нет ссылок на старые пути (риск из пункта 6 «Известных рисков»).
  - 7.8 Пользователь коммитит **одним коммитом**: `refactor(scripts): сгруппировать scripts/ по подкаталогам и обновить husky+CI`. На этом коммите pre-commit-хук уже использует новые пути (потому что и husky-файлы, и сами скрипты в индексе) — хук «сам себя проверяет».
- [x] Фаза 8. Локальная проверка husky-хуков (полная, не только pre-commit, который уже сработал в фазе 7):
  - `bash .husky/pre-push` напрямую — pre-push в `commit:atomic:dry-run` не триггерится, его поведение проверяется только так либо реальным push'ем. Если падает — починить в той же фазе, без отдельного коммита (если потребовалась правка — приклеить к коммиту фазы 7 через `git commit --amend`, **только если** коммит фазы 7 еще не запушен; иначе — новый коммит `fix(ci): ...`).
  - `node ./scripts/git/git-workflow-agent-reminder.mjs --worktree` и `node ./scripts/git/git-workflow-agent-reminder.mjs --staged` — оба режима без ошибок и без ссылок на старые пути в выводе.
  - Фаза не порождает коммита, если все прошло — это «зеленая проверка», результат фиксируется в «Итог». **Факт:** `bash .husky/pre-push` отработал зеленый локально; оба режима `git-workflow-agent-reminder` выдают корректный текст без ссылок на старые пути.
- [x] Фаза 9. Текстовые правки в `.md` по итогам grep из фазы 1 (если осталось). Пользователь коммитит (`docs: обновить упоминания путей и lint:md:legacy в .md`) — этот коммит может оказаться пустым, если grep ничего не нашел; тогда фаза просто закрывается без коммита. **Факт:** обновлены пути в `CLAUDE.md` (buildin-auth/explore.py), `CONTRIBUTING.md` (atomic-commit.mjs, git-workflow-agent-reminder.mjs), `docs/styleguide.md` (check-markdown-links.mjs), `.claude/rules/ast-index.md` (atomic-commit.mjs, validate-plans.mjs), `.claude/skills/plan-validator/SKILL.md` (validate-plans.mjs, check-branch-name.mjs), `docs/specs/functional-requirements/_template-fr.md` и `fr-parking-session.md` (check-markdown-links.mjs). В FR-шаблоне также убрана мертвая ссылка на удаленный `docs/repo-context-compressed.md`. `.claude/settings.json` обновлен (`lint:md:custom` в allowlist). Коммит — пользователем.
- [x] Фаза 10. Финальный прогон: `npm run ci:check` + `npm run lint:md-links` локально. Если что-то падает — починить точечным fix-коммитом. **Факт:** `npm run ci:check` зеленый (markdownlint-cli2 + check-markdown.mjs + check-markdown-links + check-file-names + check:plans + build + lint:mermaid — все прошли). `npm run commit:atomic:dry-run` корректно классифицирует файлы из новых подкаталогов в бакет `scripts/`.
- [ ] Фаза 11. **Прогон CI/CD на GitHub:** пользователь делает `git push` ветки `docs/portfolio-roadmap`. На GitHub Actions проходят `policy-checks`, `quality-gates` (включая `ci:check`), `commitlint`, проверка семантического заголовка PR. Это закрывающее условие — **до зеленого CI подплан 8 не считается выполненным** и подплан 1 (README) не стартует.
- [ ] Фаза 12. Ретро в `docs/process/retro/2026-05-12-simplify-scripts-package-json.md`, отметка `[x]` в таблице roadmap и в фазах roadmap (`plans/2026-05-12-portfolio-roadmap.md`).

## Известные риски и принятые решения

1. **Имя итогового markdownlint-файла.** Решение: оставить `.markdownlint-cli2.jsonc` (точка входа для текущего инструмента и идет раньше в дефолтном порядке поиска). Альтернативу `.markdownlint.jsonc` отбросили — она бы потребовала ровно те же правки путей, но без подсказки в имени про используемый CLI.
2. **`scripts/check-markdown.mjs` остается; имя файла не меняется.** Меняем только npm-скрипт `lint:md:legacy` → `lint:md:custom`. Имя файла `check-markdown.mjs` обманчиво не выглядит (название говорит, что это check), переименование файла — это лишний риск ломки путей в каскаде. Зафиксировано как осознанный компромисс.
3. **Husky `pre-push` локально не прогоняется через `--dry-run`.** Это известный факт git/husky из подплана 7: pre-push хук не триггерится на dry-run. Реальная локальная проверка `pre-push`-логики — через прямой `bash .husky/pre-push` в фазе 8. CI на GitHub этого тоже не покрывает — `pre-push` это локальный хук, не часть GitHub Actions.
4. **Возможны скрытые потребители `docs/repo-context-compressed.md`.** Фаза 1 (расширенный grep по всему репо, включая `.mjs`/`.py`/`.ts` и `.husky/*`) увидит явные ссылки. Если grep найдет что-то неучтенное — фиксируем в плане до фазы 4.
5. **`scripts/atomic-commit.mjs` после перемещения в `scripts/git/`.** Внутри `atomic-commit.mjs` могут быть встроенные относительные пути, константы вида `scripts/...`, или регулярки классификации файлов по бакетам, привязанные к плоской структуре `scripts/`. Митигация — двойная: (a) фаза 1 шаг 1.4 ищет хардкод собственного пути через grep; (b) фаза 7 шаг 7.7 включает не только `commit:atomic:dry-run`, но и визуальную проверку вывода dry-run на корректность классификации новых путей `scripts/lint/*` / `scripts/git/*`. Если падает или классифицирует криво — правка в фазе 7 шаг 7.5, без отдельного коммита.
6. **`scripts/git-workflow-agent-reminder.mjs` после перемещения.** Скрипт может выводить путь к самому себе в тексте напоминания. Митигация — grep в фазе 1 шаг 1.4 + smoke в фазе 7 шаг 7.7 (проверка вывода на отсутствие старых путей) + фаза 8 (`--worktree` и `--staged` режимы).
7. **`prettier`-нормализация `package.json`.** Хук `format-on-write.mjs` после правок может перестроить порядок ключей или отступы. Это разово отражается в коммите фазы 7 (атомарный коммит уже включает крупный рефакторинг — нормализация ключей сливается с ним и не порождает отдельного шумного коммита). В коммитах фаз 2/5/6 правки package.json точечные, и переупорядочивание ключей может породить более широкий дифф, чем ожидалось — это допустимо, но в PR-описании стоит явно отметить.
8. **Перенос `.py`-скриптов в `integrations/`.** В `CLAUDE.md` есть инструкция про `.venv/bin/python scripts/buildin-auth.py` — нужно обновить на `scripts/integrations/buildin-auth.py`. Аналогично для `buildin-explore.py`. Покрывается фазой 1 (расширенный grep по `*.md`) и фазой 9.
9. **Журнал трассировки не обновляется.** Подплан 8 не меняет требования, артефакты или архитектуру — только оснастку. Это допустимо по регламенту трассировки. В «Итоге» явно фиксируется, что журнал не тронут (`git diff docs/process/traceability-matrix-log.md` — пустой).
10. **Коммит фазы 9 может оказаться пустым.** Если grep из фазы 1 не нашел текстовых ссылок и фазы 6–8 не оставили работы — фаза 9 закрывается без коммита. Это нормально, не запускаем `git commit --allow-empty`.
11. **`.github/CODEOWNERS` с path-based правилами на `scripts/*`.** Если CODEOWNERS существует и содержит такие правила, перемещение 13 файлов в подкаталоги поменяет ownership: PR подплана 8 может неожиданно потребовать ревью от других людей, либо скрипты в новых путях окажутся «бесхозными». Митигация: фаза 1 шаг 1.3 явно проверяет CODEOWNERS. Решение (обновить или принять смену) фиксируется до фазы 2. Если CODEOWNERS отсутствует — риск нулевой.
12. **Зеленый GitHub Actions ≠ полное покрытие.** CI проверяет только `policy-checks`, `quality-gates` (`ci:check`), `commitlint`, семантический заголовок PR. Husky `pre-push` локальные хуки в CI **не запускаются**. Поэтому фаза 8 (локальный `bash .husky/pre-push`) — обязательное закрывающее условие наравне с фазой 11 (CI на GitHub). Если фаза 8 не сделана — фаза 11 даст ложно-зеленый результат.
13. **Стартовое состояние ветки.** `M plans/2026-05-12-portfolio-roadmap.md` присутствует в `git status` до начала подплана 8. Это не правки подплана 8 — это незакоммиченное состояние roadmap-сессии. До фазы 1 пользователь должен либо закоммитить этот файл отдельно, либо `git stash`-нуть. Иначе коммит фазы 12 (ретро + отметки в roadmap) случайно зацепит чужие правки. См. раздел «Стартовое состояние и предусловия» в начале плана.
14. **Внутреннее наследование в `.markdownlint.jsonc`.** Если в исходном `.markdownlint.jsonc` есть собственное поле `extends` (наследование от пресета вроде `markdownlint/style/all`), наивная инлайн-вставка в `config` итогового файла потеряет цепочку правил без явных ошибок. Митигация: фаза 5 шаг 5.1 явно читает файл и принимает решение **до** правки. Если многоуровневое наследование обнаружено — обсуждаем варианты с пользователем (сохранить `extends` в новом файле через `extends`-поле `.markdownlint-cli2.jsonc`, либо инлайнить с полным резолвом цепочки).

## Итог

**Состояние на 2026-05-12:** фазы 1–10 выполнены физически на диске, фазы 11–12 — открыты (push и ретро). Все правки накоплены в worktree и индексе ветки `docs/portfolio-roadmap`, коммиты разбивает пользователь.

**Что удалено:**

- `scripts/atomic-commit.sh` — `D` в индексе.
- `.markdownlint.jsonc` — `D` в индексе, правила инлайн-перенесены в `.markdownlint-cli2.jsonc`.
- `docs/repo-context-compressed.md` — `D` в индексе, путь добавлен в `.gitignore`.
- `.agents/` — на диске отсутствует (фаза 3 закрылась без коммита, как и предполагалось — каталог не был tracked).
- npm-скрипты `commit:atomic:sh`, `commit:atomic:sh:yes`, `commit:atomic:sh:dry-run` — удалены из `package.json`.

**Что перемещено (13 файлов через `git mv`, история сохранена):**

- 5 файлов в `scripts/lint/`: `check-markdown.mjs`, `check-markdown-links.mjs`, `check-file-names.mjs`, `lint-mermaid.mjs`, `check-traceability-matrix-update.mjs`.
- 1 файл в `scripts/plans/`: `validate-plans.mjs`.
- 1 файл в `scripts/build/`: `build-templates.mjs`.
- 3 файла в `scripts/git/`: `atomic-commit.mjs`, `check-branch-name.mjs`, `git-workflow-agent-reminder.mjs`.
- 3 файла в `scripts/integrations/`: `buildin-auth.py`, `buildin-explore.py`, `google-auth.py`.

**Что переименовано / обновлено:**

- npm-скрипт `lint:md:legacy` → `lint:md:custom` в `package.json` (и в `ci:check`).
- `.claude/settings.json:9` — allowlist обновлен на `lint:md:custom`.
- `.husky/pre-commit`, `.husky/pre-push` — ссылки на `scripts/git/git-workflow-agent-reminder.mjs`.
- `.github/workflows/ci.yml` — ссылки на `scripts/git/check-branch-name.mjs` и `scripts/lint/check-traceability-matrix-update.mjs`.
- `scripts/claude-hooks/validate-staged-plans.mjs:25` и `validate-plan-on-write.mjs:41` — путь к `validate-plans.mjs` обновлен на `scripts/plans/`.
- `scripts/claude-hooks/remind-atomic-commit.sh:14` — путь к `git-workflow-agent-reminder.mjs` обновлен на `scripts/git/`.
- `scripts/git/atomic-commit.mjs:9-13` — help-текст обновлен на `node scripts/git/atomic-commit.mjs`.
- Текстовые правки в `CLAUDE.md`, `CONTRIBUTING.md`, `docs/styleguide.md`, `.claude/rules/ast-index.md`, `.claude/skills/plan-validator/SKILL.md`, `docs/specs/functional-requirements/_template-fr.md`, `fr-parking-session.md`.

**Что обнаружила фаза 1 (скрытые ссылки, все включены в правки):**

- 3 хардкода в `scripts/claude-hooks/` (validate-staged-plans.mjs, validate-plan-on-write.mjs, remind-atomic-commit.sh).
- Help-текст в `scripts/atomic-commit.mjs` (5 строк).
- 2 строки в `.claude/rules/ast-index.md`, 2 ссылки в `.claude/skills/plan-validator/SKILL.md`.
- Инструкции про `.venv/bin/python scripts/buildin-*.py` в `CLAUDE.md`.
- BUCKET-правила в `atomic-commit.mjs` (`f.startsWith("scripts/")`) — проверены, не требуют правки (новые пути все равно начинаются с `scripts/`).
- `.github/CODEOWNERS` — правило `/scripts/ @CeJIDb @team-ops` покрывает все вложенные пути; ownership не меняется, опциональный коммит 8 не нужен.
- `.markdownlint.jsonc` — собственного `extends` не имел, инлайн-перенос в `config` итогового файла прошел без потери правил.

**Локальный результат:**

- `npm run ci:check` — зеленый (markdownlint-cli2 + custom check-markdown + check-markdown-links + check-file-names + check:plans + build + lint:mermaid).
- `npm run lint:md-links` — зеленый.
- `npm run commit:atomic:dry-run` — отрабатывает из нового пути, классификация по бакетам корректна (новые подкаталоги попадают в `scripts/`).
- `bash .husky/pre-push` — зеленый.
- `node ./scripts/git/git-workflow-agent-reminder.mjs --worktree` и `--staged` — оба режима без ошибок.

**Журнал трассировки не обновлялся** — подплан 8 не меняет требования, артефакты или архитектуру (это оснастка). Запись CHG-20260322-004 в `docs/process/traceability-matrix-log.md` оставила историческое упоминание `docs/repo-context-compressed.md` — это корректно, журнал не редактируется задним числом.

**Открытые шаги:** пользователь разбивает накопленный дифф на коммиты по группировке из раздела «Правила коммитов» (рекомендуется 6 атомарных коммитов + 1 опциональный для текстовых правок), пушит ветку `docs/portfolio-roadmap`, ждет зеленый GitHub Actions (`policy-checks`, `quality-gates`, `commitlint`) — после этого фаза 11 закрывается. Затем — ретро в `docs/process/retro/2026-05-12-simplify-scripts-package-json.md` (фаза 12).
