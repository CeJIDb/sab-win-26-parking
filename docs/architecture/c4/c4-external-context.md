# C4 Model: внешний контекст и материалы

Сводка по сохранённым в репозитории материалам для работы с **C4 model** (уровни контекста, контейнеров, компонентов, кода) и смежными темами (PlantUML, Attribute-Driven Design). Проектные диаграммы и ADR остаются в [`../adr/`](../adr/) и в [`../readme.md`](../readme.md); этот файл — **индекс внешних/учебных** текстов и **канонических ссылок**.

## Оглавление

- [Назначение](#назначение)
- [Канонические источники по C4](#канонические-источники-по-c4)
- [Состав набора](#состав-набора)
- [Связь с артефактами проекта](#связь-с-артефактами-проекта)
- [Настройки Cursor и контекст агента](#настройки-cursor-и-контекст-агента)
- [Первоисточники и атрибуция](#первоисточники-и-атрибуция)

## Назначение

Этот набор нужен, чтобы:

- держать под рукой **согласованную терминологию** C4 (контекст, контейнер, компонент, код) и не путать её с UML «как попало»;
- иметь **локальные копии** выбранных статей (в т.ч. при недоступности внешних сайтов);
- связать **ADD** (Attribute-Driven Design) с этапом формирования архитектурной концепции — как смежную тему к диаграммам;
- не смешивать **учебный/внешний** контент с **проектными** артефактами: ADR — в [`../adr/`](../adr/), DDD-материалы — в [`../ddd/`](../ddd/), C4-индекс — в этом каталоге (`c4/`).

Файлы в [`reference-readings/`](reference-readings/) именуются в стиле репозитория: **латиница**, **kebab-case**, без пробелов в путях.

## Канонические источники по C4

| Ресурс | URL | Зачем держать в контексте |
| --- | --- | --- |
| Официальный сайт C4 model | [https://c4model.com/](https://c4model.com/) | Определения уровней, нотация, рекомендации по диаграммам |
| C4-PlantUML (stdlib) | [https://github.com/plantuml-stdlib/C4-PlantUML](https://github.com/plantuml-stdlib/C4-PlantUML) | Подключаемые `.puml` для PlantUML (упоминается в статье с Хабра) |

## Состав набора

| Тема | Файл в репозитории | Оригинал |
| --- | --- | --- |
| C4 и PlantUML: практика, уровни, подключение C4-PlantUML | [reference-readings/c4-plantuml-visualization-habr.md](reference-readings/c4-plantuml-visualization-habr.md) | [Хабр, Usetech](https://habr.com/ru/companies/usetech/news/676196/) |
| Краткая связка ADD + C4 + ссылки на материалы | [reference-readings/c4-model-overview-buildin.md](reference-readings/c4-model-overview-buildin.md) | [buildin.ai (share)](https://buildin.ai/se24/share/7536756b-7814-4955-bc5f-c2ddebe1234a) |
| Attribute-Driven Design: архитектурная концепция по атрибутам качества | [reference-readings/attribute-driven-design-simbirsoft.md](reference-readings/attribute-driven-design-simbirsoft.md) | [SimbirSoft](https://www.simbirsoft.com/blog/kak-prorabotat-arkhitekturnuyu-kontseptsiyu-it-proekta-s-pomoshchyu-attribute-driven-design/) |

Рекомендуемый порядок для **быстрого старта по C4**: официальный сайт [c4model.com](https://c4model.com/) → **статья PlantUML + C4** → при необходимости заметка buildin.ai. Статью про **ADD** имеет смысл читать параллельно с обсуждением качеств и границ системы (см. NFR и ADR).

## Связь с артефактами проекта

- Модульный монолит и уровни описания: [`../adr/adr-003-modular-monolith.md`](../adr/adr-003-modular-monolith.md) (в т.ч. упоминание компонентной диаграммы C4 level 2).
- Контексты предметной области и карта: [`../ddd/ddd-bounded-contexts.md`](../ddd/ddd-bounded-contexts.md).
- Индекс раздела архитектуры: [`../readme.md`](../readme.md).

Внешние материалы **не** заменяют ADR и не задают границы системы без явного согласования в репозитории.

## Настройки Cursor и контекст агента

Чтобы ассистент в Cursor опирался на ту же терминологию, что и команда:

1. В настройках проекта Cursor добавьте в **документацию / индексацию** (или в список URL для `@`-контекста) канонический сайт **[https://c4model.com/](https://c4model.com/)** — это основной источник определений C4 model.
2. Дополнительно можно подключать **этот каталог** [`docs/architecture/c4/`](.) как локальный контекст: индекс [`c4-external-context.md`](c4-external-context.md) и файлы в [`reference-readings/`](reference-readings/).

Точные названия пунктов меню Cursor зависят от версии редактора; смысл — **канонический URL + локальный индекс репозитория**.

## Первоисточники и атрибуция

Тексты в `reference-readings/` — сохранённые копии публикаций; авторы, источники и даты указаны в YAML front matter каждого файла (`author`, `source`, `url`, `date_published` где есть). При цитировании в документах проекта ссылайтесь на **оригинальный URL** и при необходимости на путь к копии в этом репозитории.

## Связанные документы

- [`../readme.md`](../readme.md) — индекс архитектуры (ADR, DDD, C4).
- [`../ddd/event-storming-external-context.md`](../ddd/event-storming-external-context.md) — внешний контент по DDD и Event Storming.
