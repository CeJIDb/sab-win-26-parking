# Индекс AS-IS артефактов

Артефакты, описывающие текущее состояние бизнеса, процессов и моделей предметной области до проектирования целевого решения.

## Оглавление

- [Назначение](#назначение)
- [Ключевые документы](#ключевые-документы)
- [Правила ведения](#правила-ведения)
- [Связанные документы](#связанные-документы)

## Назначение

Раздел предназначен для материалов этапа моделирования бизнеса.

Сюда имеет смысл переносить AS-IS артефакты, даже если изначально они были оформлены вне репозитория в виде изображений или экспортов из внешних инструментов.

## Ключевые документы

- [parking-as-is-diagram.md](parking-as-is-diagram.md) — схема текущей парковки и распределения зон.
- [event-storming-as-is.md](event-storming-as-is.md) — событийная модель текущего состояния.
- [uml-class-domain-as-is.md](uml-class-domain-as-is.md) — UML-диаграмма классов предметной области в AS-IS.
- [uml-state-contract-with-individual.md](uml-state-contract-with-individual.md) — жизненный цикл договора с физлицом.
- [bpmn-client-identification.md](bpmn-client-identification.md)
- [bpmn-payment-individual-and-legal-clients.md](bpmn-payment-individual-and-legal-clients.md)
- [bpmn-provide-parking-space.md](bpmn-provide-parking-space.md)
- [bpmn-search-parking-space.md](bpmn-search-parking-space.md)
- [bpmn-parking-exit.md](bpmn-parking-exit.md)
- [bpmn-contract-signing.md](bpmn-contract-signing.md)
- [assets/](assets/readme.md) — изображения AS-IS артефактов

## Правила ведения

- Каноничным документом должен быть `md`, а изображение считается приложением.
- Для каждого нового артефакта добавляйте краткое текстовое описание, а не только картинку.
- Если артефакт становится источником решений для следующих этапов, дайте ссылки на связанные TO-BE, use case, требования или архитектурные документы.

## Связанные документы

- [../readme.md](../readme.md)
- [../../process/artifact-placement-guide.md](../../process/artifact-placement-guide.md)
- [../../process/templates/artifact-from-image-template.md](../../process/templates/artifact-from-image-template.md)
- [../es-to-be/](../es-to-be/)
