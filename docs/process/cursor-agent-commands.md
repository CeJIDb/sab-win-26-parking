# Команды Cursor для ревью с агентами (SAB)

Сводный перечень **пользовательских слэш-команд** репозитория: файлы лежат в `.cursor/commands/`. В чате Cursor выберите команду из палитры или вставьте содержимое файла как промпт.

Автоматическое подключение **правил** (`.cursor/rules/*.mdc`) к контексту задаётся полем `globs` во frontmatter — при открытии/редактировании подходящих файлов соответствующие инструкции ревью подмешиваются без отдельного вызова команды.

## Оглавление

- [Сводная таблица команд](#сводная-таблица-команд)
- [Правила с автоподключением (globs)](#правила-с-автоподключением-globs)
- [Каноничные ссылки](#каноничные-ссылки)

## Сводная таблица команд

| Команда (файл)                                                               | Назначение                                                                            | Основное правило / агент                                                                                              |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [Команда review-doc](../../.cursor/commands/review-doc.md)                   | Ревью markdown-документации (стиль, структура, ссылки, спеки)                         | `.cursor/rules/technical-writer.mdc`                                                                                  |
| [Команда review-requirements](../../.cursor/commands/review-requirements.md) | Требования, артефакты, трассируемость                                                 | `.cursor/rules/systems-analyst.mdc`, `.cursor/agents/systems-analyst.md`                                              |
| [Команда review-architecture](../../.cursor/commands/review-architecture.md) | ADR, DDD, согласованность архитектуры; схемы БД и бэкенд-интеграции при необходимости | `.cursor/rules/software-architect.mdc`, `.cursor/rules/database-optimizer.mdc`, `.cursor/rules/backend-architect.mdc` |
| [Команда review-security](../../.cursor/commands/review-security.md)         | ИБ, NFR безопасности, соответствие артефактам infosec                                 | `.cursor/rules/security-engineer.mdc`                                                                                 |
| [Команда review-wireframe](../../.cursor/commands/review-wireframe.md)       | Wireframe `ui/` vs спеки + доступность                                                | `.cursor/rules/ux-architect.mdc`, `.cursor/rules/accessibility-auditor.mdc`                                           |
| [Команда review-reality](../../.cursor/commands/review-reality.md)           | Документы vs факты репозитория                                                        | `.cursor/rules/reality-checker.mdc`                                                                                   |
| [Команда review-pr-readiness](../../.cursor/commands/review-pr-readiness.md) | Готовность к PR/push (ветка, трассировка, CI)                                         | `.cursor/rules/git-workflow-master.mdc`, `.cursor/rules/ci-gates.mdc`                                                 |
| [Команда review-sources-sync](../../.cursor/commands/review-sources-sync.md) | Протоколы/источники ↔ спеки                                                           | `.cursor/rules/systems-analyst.mdc`                                                                                   |
| [Команда review-glossary](../../.cursor/commands/review-glossary.md)         | Терминология, дрейф от глоссария                                                      | `.cursor/rules/glossary-terms-maintainer.mdc`, `.cursor/agents/glossary-terms-maintainer.md`                          |

## Правила с автоподключением (globs)

| Правило                         | Пути (кратко)                                                                                                                               |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `technical-writer.mdc`          | `docs/**/*.md`, `README.md`, `CONTRIBUTING.md`                                                                                              |
| `systems-analyst.mdc`           | `docs/specs/`, `docs/artifacts/`, `docs/interviews/`, `docs/process/traceability-matrix*.md`                                                |
| `glossary-terms-maintainer.mdc` | `docs/artifacts/project-glossary.md`, `docs/specs/`, `docs/architecture/`, `docs/artifacts/conceptual-model*.md`                            |
| `software-architect.mdc`        | `docs/architecture/**/*.md`                                                                                                                 |
| `database-optimizer.mdc`        | `docs/architecture/**/*.md`, `docs/artifacts/conceptual-model*.md`, `docs/artifacts/**/*entity*.md`, `docs/artifacts/**/*normalization*.md` |
| `backend-architect.mdc`         | `docs/architecture/**/*.md`, `docs/interviews/**/*.md`                                                                                      |
| `security-engineer.mdc`         | `docs/artifacts/infosec/`, `docs/specs/nonfunctional-requirements/`                                                                         |
| `ux-architect.mdc`              | `ui/**/*.njk`, `ui/**/*.scss`, `ui/**/*.html`                                                                                               |
| `accessibility-auditor.mdc`     | то же для `ui/`                                                                                                                             |
| `reality-checker.mdc`           | `docs/**/*.md`                                                                                                                              |
| `git-workflow-master.mdc`       | `CONTRIBUTING.md`, `package.json`, `docs/process/traceability-matrix-log.md`, `.github/workflows/**/*.yml`                                  |

Правило `ci-gates.mdc` остаётся с `alwaysApply: true` — общие требования к проверкам перед push.

## Каноничные ссылки

- Список субагентов: [Конфигурация субагентов Cursor](../../.cursor/subagents.md)
- Контекст репозитория: [Сжатый контекст репозитория](../repo-context-compressed.md)
- Формальные спеки: [Правило Cursor для документации](../../.cursor/rules/docs.mdc)
