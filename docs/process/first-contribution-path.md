# First Contribution Path

## Оглавление

1. [Goal](#goal)
2. [Steps](#steps)
3. [Done Criteria](#done-criteria)

## Goal

## Связанные документы

- [PR DoR/DoD](pr-dor-dod.md) — задает критерии готовности и завершения pull request.
- [Матрица трассировки](traceability-matrix.md) — описывает, как связывать первое изменение с источниками требований.

Help a new contributor make a safe and traceable first change.

## Steps

1. Read `CONTRIBUTING.md`.
2. Identify the source of truth for your change (`docs/artifacts/*`, `docs/interviews/*`, `docs/specs/*`, `docs/architecture/*`).
3. Create a branch using policy: `feature/*`, `docs/*`, `chore/*`, `hotfix/*`.
4. Implement a minimal and focused change.
5. Update traceability records in `docs/process/traceability-matrix.md`.
6. Run:
   ```bash
   npm ci
   npm run ci:check
   ```
7. Open a PR and complete DoR/DoD from `docs/process/pr-dor-dod.md`.

## Done Criteria

The change is verifiable, linked to requirements, and ready for review.
