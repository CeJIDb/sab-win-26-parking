# Traceability Matrix Process

## Оглавление

1. [Purpose](#purpose)
2. [Required Fields](#required-fields)
3. [Rules](#rules)
4. [Current Matrix](#current-matrix)

## Purpose

## Связанные документы

- [Шаблон матрицы трассировки](templates/traceability-matrix-template.md) — задает каркас для ведения трассировки.
- [Журнал изменений матрицы трассировки](traceability-matrix-log.md) — фиксирует обновления связей между артефактами и требованиями.

Ensure each meaningful change is linked from source evidence to requirement and validation.

## Required Fields

- Change ID
- Source (artifact/protocol/source note)
- Requirement ID (`FR-*`, `NFR-*`, `CONSTR-*`, `ADR-*`)
- Changed files
- Validation method
- Evidence link (PR/commit/check output)

## Rules

- Every meaningful change must have a traceability entry.
- Entries without Source or Validation are incomplete.
- Traceability update is mandatory before merge.

## Current Matrix

Update the live matrix in:

- `docs/process/traceability-matrix-log.md`

Use template for new rows:

- `docs/process/templates/traceability-matrix-template.md`
