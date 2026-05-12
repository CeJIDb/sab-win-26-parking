# Цифровая платформа парковки

Учебный проект курса [Systems Analyst Bootcamp](https://systems.education/systems-analyst-bootcamp).
Портфолио системного аналитика — от исследования бизнеса AS-IS до интеграций и архитектурных решений.

**Репозиторий:** [CeJIDb/sab-win-26-mine-parking](https://github.com/CeJIDb/sab-win-26-mine-parking)

## Проблема — Решение — Цель

**Проблема:** очереди на КПП при пропускной способности 40–70 машин/час, ручная обработка въезда и выезда, фрагментированные данные в Excel-журналах, нет онлайн-пути для клиента — около 30% мест простаивает, зависимость от персонала для каждой операции.

**Решение:** цифровая платформа с онлайн-кабинетом клиента, автоматизированным КПП (СКУД + LPR), административным контуром и интеграциями с внешними системами.

**Цель:** **Увеличить долю клиентов, использующих парковку через онлайн-ресурсы, с 0% до 80%** от общего количества клиентов на дату запуска решения — в течение **6 месяцев** после ввода системы в эксплуатацию.

## 6 ключевых артефактов

### 1. AS-IS Event Storming

<!-- TODO: cover 1200×630 — подплан 2 -->

TL;DR: ключевые события, роли и болевые точки текущего процесса; ручная обработка на КПП и зависимость от сотрудника при каждой операции.

→ [Открыть артефакт](docs/artifacts/as-is/event-storming-as-is.md)

### 2. Контекстная диаграмма

<!-- TODO: cover 1200×630 — подплан 2 -->

TL;DR: границы системы, внешние участники (клиенты, персонал, СКУД, платежная система, сервис уведомлений) и потоки данных на уровне DFD L0.

→ [Открыть артефакт](docs/artifacts/context-diagram.md)

### 3. DDD bounded contexts

<!-- TODO: cover 1200×630 — подплан 2 -->

TL;DR: 15 изолированных контекстов из ADR-003 (Доступ, Бронирование, Сессия, Тариф, Платеж и др.) — модульная декомпозиция системы в терминах DDD.

→ [Открыть артефакт](docs/architecture/ddd/ddd-bounded-contexts.md)

### 4. C4 — Context и Container

<!-- TODO: cover 1200×630 — подплан 2 -->

TL;DR: архитектура на трех уровнях детализации — L1 граница системы, L2 контейнеры и интеграции, L3 20 внутренних компонентов Backend и 11 внешних систем.

→ [Открыть артефакт](docs/architecture/c4/c4-diagrams.md)

### 5. DFD L1

<!-- TODO: cover 1200×630 — подплан 2 -->

TL;DR: 20 компонентов, единое хранилище PostgreSQL и 10 внешних систем — полный контур потоков данных для интеграционных артефактов.

→ [Открыть артефакт](docs/artifacts/dfd-l1.md)

### 6. Sequence UC-10.2 — онлайн-оплата

<!-- TODO: cover 1200×630 — подплан 2 -->

TL;DR: интеграционная последовательность оплаты краткосрочной аренды — взаимодействие компонентов платформы с ЮKassa, статусы платежа, квитанция, уведомление клиенту.

→ [Открыть артефакт](docs/architecture/integration/sequence-uc-10-2-pay-online-short-term-rental.md)

## Команда

Проект выполнен в команде системных аналитиков из 5 человек:

- [Denis333admin](https://github.com/Denis333admin)
- [malinkaemail-blip](https://github.com/malinkaemail-blip)
- [mrneatly](https://github.com/mrneatly)
- [skifup](https://github.com/skifup)
- [CeJIDb](https://github.com/CeJIDb)

## Навигация

- [Обзор проекта](docs/project-overview.md) — предметные области и технологии репозитория
- [Wireframe — демо](https://boisterous-heliotrope-94df12.netlify.app/) — задеплоенный интерфейсный макет
- [Артефакты системного анализа](docs/artifacts/readme.md) — use case, BPMN, ES, контекстная диаграмма
- [Архитектура](docs/architecture/readme.md) — DDD, C4, ADR, интеграции
- [Спецификации](docs/specs/readme.md) — функциональные и нефункциональные требования

Маршрут знакомства с документацией — [docs/readme.md](docs/readme.md#с-чего-начать)

Проект прошел 5 этапов: от исследования AS-IS бизнеса до архитектуры, модели данных и интеграций. [Подробная история →](docs/process/project-journey.md)

## Стек

- Markdown — основной формат проектной документации
- Node.js + Nunjucks + Sass — сборка wireframe-макета
- Python — вспомогательные скрипты
- SQL (PostgreSQL) — практика и проверка модели данных

Подробнее — [Обзор проекта](docs/project-overview.md)

## Wireframe-макет

Для визуализации пользовательских сценариев в репозитории есть статический wireframe.

Задеплоенная версия UI доступна по ссылке: [boisterous-heliotrope-94df12.netlify.app](https://boisterous-heliotrope-94df12.netlify.app/).

Чтобы пересобрать его локально:

```bash
npm ci
npm run build
```

После этого можно открыть `ui/index.html` и перейти в нужный контур.

---

## English Summary

**Parking Platform** is a systems analyst portfolio project from the Systems Analyst Bootcamp course. The subject is a private 600-space parking facility in Saint Petersburg, Russia.

The project covers the full SA lifecycle:

- AS-IS research: Event Storming, BPMN, interviews with the customer
- Conceptual design: Impact Map, context diagram, use cases, wireframe
- Software requirements: functional and non-functional requirements, constraints
- Technical design: DDD bounded contexts, C4 model, ADR, ERD (PostgreSQL)
- Integrations: DFD L1, UML Sequence (UC-10.2 online payment, UC-12.1 LPR access), Kafka/RabbitMQ requirements, YooKassa mapping

Main entry points: [docs/readme.md](docs/readme.md) · [docs/specs/](docs/specs/) · [docs/architecture/](docs/architecture/)
