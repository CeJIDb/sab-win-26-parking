---
description: Чеклист готовности к PR/push (git-workflow + ci-gates, SAB)
---

Действуй по `.cursor/rules/git-workflow-master.mdc` (раздел «Репозиторий SAB: готовность к PR / push») и **канонично** по `.cursor/rules/ci-gates.mdc`.

**Вход:** текущая ветка и список изменённых файлов (или попроси пользователя дать `git status` / описание PR).

**Выход:** по пунктам — выполнено / риск / что сделать:

- `npm run check:branch`, `npm run ci:check`;
- `CHANGELOG.md` при значимых путях;
- `docs/process/traceability-matrix-log.md` при изменениях в зонах из `scripts/check-traceability-matrix-update.mjs`;
- при необходимости `CI_MERGE_RANGE` и `npm run check:changelog`.

Не заменяй выполнение команд — только чеклист и риски.
