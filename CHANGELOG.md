# Changelog

All notable changes to this project are documented in this file.

The format is based on Keep a Changelog.

## [Unreleased]

### Added

- `scripts/atomic-commit.mjs` и npm-скрипты `commit:atomic` / `commit:atomic:yes` — группировка изменений в атомарные conventional-коммиты по зонам репозитория; описание в `CONTRIBUTING.md`
- `docs/architecture/c4/c4-external-context.md` и каталог `docs/architecture/c4/reference-readings/`: индекс C4 model (каноническая ссылка на [c4model.com](https://c4model.com/)), локальные копии материалов по C4+PlantUML, ADD и краткая заметка buildin.ai; файлы в kebab-case; запись в `docs/architecture/readme.md`
- `docs/architecture/ddd/event-storming-external-context.md` и каталог `docs/architecture/ddd/reference-readings/`: индекс и переименованные в kebab-case локальные копии материалов по DDD, Event Storming и DDD+ES (Хабр, buildin.ai); запись в индексе `docs/architecture/readme.md`
- Cursor: правила ревью с `globs` для systems-analyst, glossary-terms-maintainer, software-architect, security-engineer, ux/accessibility (`ui/`), reality-checker (`docs/`), git-workflow-master; слэш-команды `review-requirements`, `review-architecture`, `review-security`, `review-wireframe`, `review-reality`, `review-pr-readiness`, `review-sources-sync`, `review-glossary`; сводка в `docs/process/cursor-agent-commands.md`
- Cursor: правило `technical-writer` привязано к `docs/**/*.md` и корневым `README.md` / `CONTRIBUTING.md` через `globs`; слэш-команда Review Doc (`.cursor/commands/review-doc.md`) для явного ревью документации
- repository governance baseline: CONTRIBUTING, LICENSE, CODEOWNERS, CI workflow, issue/PR templates
- git consistency files: `.editorconfig` and `.gitattributes`
- markdown quality checks and smoke test scripts for CI
- process docs for contributors in `docs/process/*` (first contribution path, DoR/DoD, traceability, release checklist)
- commit governance files: `commitlint.config.cjs`, Husky hooks, branch/changelog policy scripts
- additional CI workflows for commitlint, PR title, and release tags
- live traceability matrix file `docs/process/traceability-matrix-log.md`
- documentation IA files: `docs/readme.md`, `docs/styleguide.md`, and section indexes for `artifacts`, `specs`, `architecture`, `demo-days`
- infosec artifacts: `docs/artifacts/infosec/*` (контекст угроз, анализ уязвимостей и контрмер)
- `docs/architecture`: ADR в `adr/` (`adr/adr-003-modular-monolith.md` и др.), DDD bounded contexts (`ddd/ddd-bounded-contexts.md`, учебные `ddd/ddd-bounded-contexts-study.md`, `ddd/ddd-pseudocode-study.md`); обновлён индекс `readme.md`

### Changed

- Husky: `pre-commit` и `pre-push` вызывают `scripts/git-workflow-agent-reminder.mjs` (напоминание о git-workflow-master при крупном диффе; субагент Cursor из хуков не запускается); обновлены `git-workflow-master`, `CONTRIBUTING.md`
- `CONTRIBUTING.md`, `scripts/atomic-commit.mjs`: сообщения атомарных коммитов на русском (после `:`); уточнено, что стиль совпадает с `git-workflow-master`, а скрипт агента не вызывает
- ADR (`adr-001` … `adr-003`): каталог `docs/architecture/adr/`, индекс `adr/readme.md`; обновлены ссылки в `docs/readme.md`, `ddd/*`, `specs/nonfunctional-requirements/nfr-external-quality.md`, `repo-context-compressed.md`, `artifacts/es-to-be/es-tobe-sd-parking-main.md`, `CHANGELOG.md`, `traceability-matrix-log.md`
- ADR-003: единый файл `docs/architecture/adr/adr-003-modular-monolith.md` (переименован из `adr-003-modular-monolith-c.md`); удалены `adr-003-modular-monolith-c-study.md` и `adr-003-modular-monolith-vs-microservices-g.md`; обновлены `readme.md`, `ddd/ddd-bounded-contexts*.md`, `traceability-matrix-log.md`
- `docs/architecture/ddd-bounded-contexts*.md`, `ddd-pseudocode-study.md`: файлы перенесены в `docs/architecture/ddd/`; обновлены ссылки в `readme.md`, `event-storming-external-context.md` и внутри перенесённых документов (ADR и `docs/artifacts/`)
- `docs/architecture/ddd/ddd-bounded-contexts-study.md`: добавлены TOC, ссылки на pseudocode-файл и ADR-003
- `docs/architecture/ddd/ddd-pseudocode-study.md`: добавлены TOC, убраны числовые префиксы из `##`-заголовков, добавлено пояснение про английские имена контекстов и комментарии для упрощённых мест (plate=null, deny без дисплея)
- `docs/architecture/adr-003-modular-monolith-c-study.md`: порядок TOC приведён в соответствие с реальным порядком разделов;
  имена атрибутов (`тариф.ставка` вместо `тариф.ставкаЗаЧас`, `Клиент.льготныйДокументИд`, `сессия.статус = завершена`), навигация ТС→Клиент в `Доступ.оценить()`;
  привязка `Платёж` к `Бронированию` (не к `Сессии`); проверка BLACKLISTED, ветка «ГРЗ не распознан» в LPR, журнал въезда-выезда, `Бронирование.завершить()` при выезде; адаптер `Платёжный Терминал КПП`

- `docs/artifacts/infosec/infosec-analyze-parking.md`: выравнивание строк таблицы «Уязвимости» с разделами «Аутентификация» и «Чувствительные данные» (брутфорс, сессии/TLS как риск несоответствия реализации); добавлен подраздел «Соответствие карточке проекта» (63/54/149-ФЗ, реестр ПО, идентификация клиентов)
- корневой `README.md`, `CONTRIBUTING.md`, индексы `docs/*/readme.md` и `scripts/docs/readme.md`: перевод на русский, выравнивание ссылок с GitHub и CI (`check:branch`), актуализация состава (в т.ч. ссылка на `infosec-analyze-parking-study.md`)
- `readme.md` with contribution, quality-gates, and release policy sections
- `CONTRIBUTING.md` with DoR/DoD, traceability, and policy checks
- `.github/workflows/ci.yml` with policy checks (branch naming and changelog guard)
- `.github/CODEOWNERS` with multi-owner mapping placeholders for key domains
- markdown quality checks hardened for contributor/process docs (`scripts/check-markdown.mjs`)
- changelog exception policy clarified for CI/process-only updates
- traceability matrix workflow and related docs updated (`docs/process/traceability-matrix-*`, `docs/process/templates/*`)
- added/updated traceability guard scripts for CI (`scripts/check-traceability-matrix-update.mjs` and linked checks)
- updated repository requirements documentation structure (constraints + NFR docs) and contributor-facing protocol/transcript/readme files
- infosec analysis artifact formalized: `docs/artifacts/infosec/infosec-analyze-parking.md` expanded (threats, vulnerabilities, risks, glossary)
- consolidated links after infosec artifact merge and removed duplicated auth/data docs references
- regenerated client wireframe pages in `ui/client/*` after template build
- обновлён артефакт `docs/artifacts/infosec/infosec-analyze-parking-study.md` (анализ парковочного исследования)
- wireframe HTML: явные правила LF в `.gitattributes` (`ui/**/*.html`, `*.njk`) и запись с нормализацией LF в `scripts/build-templates.mjs`, чтобы не было ложных `git diff` после сборки на Windows/WSL
