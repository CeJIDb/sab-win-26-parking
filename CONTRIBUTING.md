# Contributing Guide

This repository follows a doc-first workflow: most changes are requirement and architecture artifacts, plus wireframe build scripts.

## Branch Naming

Use one of these patterns:

- `feature/<short-topic>`
- `docs/<short-topic>`
- `chore/<short-topic>`
- `hotfix/<short-topic>`

Examples: `docs/nfr-auth`, `feature/use-case-registry`, `chore/ci-quality-gates`.
Validation regex: `^(feature|docs|chore|hotfix)\/[a-z0-9._-]+$`.

## Commit Convention

Use Conventional Commit style:

- `docs(scope): ...`
- `feat(scope): ...`
- `fix(scope): ...`
- `chore(scope): ...`

Examples:

- `docs(specs): add NFR for external quality`
- `chore(ci): add markdown and build quality gates`

Local enforcement:

- commit messages are checked by Husky + Commitlint (`.husky/commit-msg`)
- PR title is checked in CI (`.github/workflows/pr-title.yml`)

## Pull Request Definition Of Ready (DoR)

PR can be opened only if:

- [ ] goal is stated in 1-2 sentences
- [ ] source of truth is identified (`docs/artifacts/*`, `docs/specs/*`, `docs/architecture/*`, `docs/protocols/*`)
- [ ] scope and out-of-scope are explicit
- [ ] risks/dependencies are listed
- [ ] validation method is defined

## Pull Request Definition Of Done

Before opening PR, ensure all checks below are complete:

- [ ] `npm ci`
- [ ] `npm run ci:check` passes locally
- [ ] branch name passes policy (`npm run check:branch`)
- [ ] changes are linked to relevant artifacts/specs
- [ ] requirements are testable and use explicit wording ("system shall ...")
- [ ] docs in `docs/specs/` keep existing structure; replaced requirements are marked as outdated/replaced instead of silently removed
- [ ] traceability matrix is updated (`docs/process/traceability-matrix-log.md`)
- [ ] `CHANGELOG.md` is updated in `Unreleased` (or explicitly marked as not required)
- [ ] PR description includes scope, risks, and validation steps

## Quality Gates

A PR is ready for merge only when:

- CI is green (`lint:md`, `build`)
- CI policy checks are green (`check:branch`, `check:changelog`, commitlint, PR title)
- required reviewers approve the changes
- no unresolved review comments remain
- scope is limited and traceable to source requirements/protocols

## Review Checklist

Reviewers verify:

- requirement wording is unambiguous and measurable
- no accidental deletion of critical artifacts
- branch/commit naming follows policy
- impact on `README`, specs, and architecture docs is covered

## Release Notes and Changelog

Every meaningful change must update `CHANGELOG.md` under `Unreleased`.
At release time, move entries to a versioned section and tag the release.

`CHANGELOG.md` update can be skipped only for:

- typo/format-only changes with no semantic impact
- CI/workflow-only changes under `.github/` and `.husky/`
- process/meta documentation updates under `docs/process/`

## Traceability Matrix Process

For each meaningful change maintain relation:
`Source -> Requirement -> Changed files -> Validation -> Evidence`.

Use:

- process: `docs/process/traceability-matrix.md`
- log: `docs/process/traceability-matrix-log.md`
- template: `docs/process/templates/traceability-matrix-template.md`

## Release Checklist

Before tag-based release, complete:

- `docs/process/release-checklist.md`
