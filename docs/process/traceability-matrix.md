# Traceability Matrix Process

## Purpose

Ensure each meaningful change is linked from source evidence to requirement and validation.

## Required Fields

- Change ID
- Source (artifact/protocol/transcript)
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
