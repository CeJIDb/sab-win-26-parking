# Contributing Guide

This repository follows a doc-first workflow: most changes are requirement and architecture artifacts, plus wireframe build scripts.

## Branch Naming

Use one of these patterns:

- `feature/<short-topic>`
- `docs/<short-topic>`
- `chore/<short-topic>`
- `hotfix/<short-topic>`

Examples: `docs/nfr-auth`, `feature/use-case-registry`, `chore/ci-quality-gates`.

## Commit Convention

Use Conventional Commit style:

- `docs(scope): ...`
- `feat(scope): ...`
- `fix(scope): ...`
- `chore(scope): ...`

Examples:

- `docs(specs): add NFR for external quality`
- `chore(ci): add markdown and build quality gates`

## Pull Request Definition Of Done

Before opening PR, ensure all checks below are complete:

- [ ] `npm ci`
- [ ] `npm run ci:check` passes locally
- [ ] changes are linked to relevant artifacts/specs
- [ ] requirements are testable and use explicit wording ("system shall ...")
- [ ] docs in `docs/specs/` keep existing structure; replaced requirements are marked as outdated/replaced instead of silently removed
- [ ] PR description includes scope, risks, and validation steps

## Quality Gates

A PR is ready for merge only when:

- CI is green (`lint:md`, `build`)
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
