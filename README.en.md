# Parking Platform

**Languages:** [Русский](README.md) · **English**

![Status: learning project](https://img.shields.io/badge/status-learning%20project-blue)
[![CI](https://github.com/CeJIDb/sab-win-26-parking/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/CeJIDb/sab-win-26-parking/actions/workflows/ci.yml)
![Last commit](https://img.shields.io/github/last-commit/CeJIDb/sab-win-26-parking)
[![License: ISC](https://img.shields.io/badge/license-ISC-green)](LICENSE)
[![Demo](https://img.shields.io/badge/demo-Netlify-success)](https://sab-win-26-parking.netlify.app/)

A systems analyst portfolio project from the [Systems Analyst Bootcamp](https://systems.education/systems-analyst-bootcamp) course. The subject is a private 600-space parking facility in Saint Petersburg, Russia — covered end to end, from AS-IS business research to integration sequences and architectural decisions.

**Repository:** [CeJIDb/sab-win-26-parking](https://github.com/CeJIDb/sab-win-26-parking)

> **Note:** all documentation, artifacts, and architectural decision records are in Russian. This README is a high-level English entry point. Diagrams (Event Storming, C4, DFD, UML Sequence) are language-agnostic and readable as-is.

## Problem — Solution — Goal

**Problem:** queues at the entry gates with a throughput of 40–70 cars/hour, manual entry and exit handling, fragmented data in Excel logs, no online customer journey — about 30% of spaces sit idle and every operation depends on on-site staff.

**Solution:** a digital platform with an online customer cabinet, automated entry gate (access control + license plate recognition), an administrative back-office, and integrations with external systems.

**Goal:** increase the share of customers using the parking through online channels from 0% to 80% of total customers as of the system launch date — within 6 months after going live.

## 8 key artifacts

1. **AS-IS Event Storming** — key events, roles, and pain points of the current process; manual handling and operator dependency at every step. → [Artifact](docs/artifacts/as-is/event-storming-as-is.md) (RU)
2. **Opportunity Canvas** — formalised problem space and platform value: AS-IS pain points, value propositions per user group, measurable MVP success criteria. → [Artifact](docs/artifacts/opportunity-canvas.md) (RU)
3. **Context diagram (DFD L0)** — system boundary, external actors (customers, staff, access control, payment provider, notifications), and data flows. → [Artifact](docs/artifacts/context-diagram.md) (RU)
4. **Booking functional requirements** — hierarchical FR registry (Role.Object.Action) across 6 actors, traced to UC-7.x (booking), UC-8.x (contract), UC-10.x (payment), UC-12.x (gate automation). → [Artifact](docs/specs/functional-requirements/fr-booking.md) (RU)
5. **Event Storming TO-BE: bounded contexts** — decomposition of TO-BE scenarios into 15 domain contexts (5 Core, 8 Supporting, 2 Generic) via Event Storming Software Design — the methodological bridge from ES to DDD and C4. → [Artifact](docs/architecture/ddd/es-tobe-sd-contexts.md) (RU)
6. **C4 — Context and Container** — architecture at three levels of detail: L1 system boundary, L2 containers and integrations, L3 — 20 internal Backend components and 11 external systems. → [Artifact](docs/architecture/c4/c4-diagrams.md) (RU)
7. **DFD L1** — 20 components, a single PostgreSQL store, and 10 external systems — the full data-flow contour feeding integration artifacts. → [Artifact](docs/artifacts/dfd-l1.md) (RU)
8. **Sequence UC-10.2 — online payment** — integration sequence for short-term rental payment: platform components interacting with YooKassa, payment statuses, receipt, customer notification. → [Artifact](docs/architecture/integration/sequence-uc-10-2-pay-online-short-term-rental.md) (RU)

## 5 stages / 5 demo days

The five demo days mirror the five stages of systems design. Each demo was a checkpoint where stage outputs were presented to stakeholders.

| Stage                      | Demo                                      | What was shown                                            |
| -------------------------- | ----------------------------------------- | --------------------------------------------------------- |
| 1. AS-IS business research | [Demo 1](docs/demo-days/demo-1/readme.md) | Event Storming AS-IS, BPMN, UML Class, StateChart         |
| 2. Conceptual design       | [Demo 2](docs/demo-days/demo-2/readme.md) | Opportunity Canvas, Impact Map, User Story Map            |
| 3. Functional design       | [Demo 3](docs/demo-days/demo-3/readme.md) | ES TO-BE, Context diagram, Use Case, FR/NFR               |
| 4. Architecture            | [Demo 4](docs/demo-days/demo-4/readme.md) | Threat analysis (bowtie), ES TO-BE with contexts, C4, ERD |
| 5. Integration design      | [Demo 5](docs/demo-days/demo-5/readme.md) | DFD, Sequence, JSON/XML, message broker requirements      |

Demo readmes are in Russian; the table itself works as a navigation map.

## Team

Delivered by a team of five systems analysts:

- [Denis333admin](https://github.com/Denis333admin)
- [malinkaemail-blip](https://github.com/malinkaemail-blip)
- [mrneatly](https://github.com/mrneatly)
- [skifup](https://github.com/skifup)
- [CeJIDb](https://github.com/CeJIDb)

Day-to-day team work was done on a shared [Miro board](https://miro.com/app/live-embed/uXjVHUcg6W8=/?embedMode=view_only_without_ui&moveToViewport=-28200%2C-14096%2C41087%2C20436&embedId=685005867404) (Event Storming, context diagrams, process maps) and in a buildin.ai knowledge base; this repository was maintained by [@CeJIDb](https://github.com/CeJIDb).

## Navigation

- [Project overview](docs/project-overview.md) (RU) — subject domains and repository tech.
- [Wireframe demo](https://sab-win-26-parking.netlify.app/) — deployed UI mockup.
- [Team Miro board](https://miro.com/app/live-embed/uXjVHUcg6W8=/?embedMode=view_only_without_ui&moveToViewport=-28200%2C-14096%2C41087%2C20436&embedId=685005867404) — shared team workspace (view-only).
- [Analysis artifacts](docs/artifacts/readme.md) (RU) — use cases, BPMN, Event Storming, context diagram.
- [Architecture](docs/architecture/readme.md) (RU) — DDD, C4, ADR, integrations.
- [Specifications](docs/specs/readme.md) (RU) — functional and non-functional requirements.

Reading route — [docs/readme.md](docs/readme.md#с-чего-начать) (RU).

## Stack

- Markdown — primary format for project documentation
- Node.js + Nunjucks + Sass — wireframe mockup build
- Python — utility scripts
- SQL (PostgreSQL) — data model practice

## Wireframe

A static wireframe is available to visualise user scenarios. The deployed version lives at [sab-win-26-parking.netlify.app](https://sab-win-26-parking.netlify.app/).

To rebuild locally:

```bash
npm ci
npm run build
```

Then open `ui/index.html` and follow the relevant flow.
