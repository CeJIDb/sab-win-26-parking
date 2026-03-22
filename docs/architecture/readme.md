# Индекс архитектуры

Архитектурные решения (ADR) и сопутствующие артефакты (DDD, внешние материалы).

## ADR — архитектурные решения

Все файлы ADR вынесены в каталог [`adr/`](adr/):

- [adr/readme.md](adr/readme.md) — оглавление ADR-001 … ADR-003 и краткие описания.

## Архитектурные артефакты


- [ddd/ddd-bounded-contexts.md](ddd/ddd-bounded-contexts.md) — DDD bounded contexts и контекстная карта
- [ddd/ddd-bounded-contexts-study.md](ddd/ddd-bounded-contexts-study.md) — краткая учебная версия DDD bounded contexts
- [ddd/ddd-pseudocode-study.md](ddd/ddd-pseudocode-study.md) — учебная версия псевдокода по DDD bounded contexts
- [ddd/event-storming-external-context.md](ddd/event-storming-external-context.md) — внешний контекст: DDD, Event Storming, ES (индекс и ссылки на [`ddd/reference-readings/`](ddd/reference-readings/))

## Правила использования

- Новые архитектурные решения оформляйте отдельными ADR.
- Существующие ADR не переписывайте задним числом; при необходимости добавьте новый ADR, отменяющий или заменяющий предыдущий.
