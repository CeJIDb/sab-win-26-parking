# DDD, Event Storming и Event Sourcing: внешний контекст

Сводка по сохранённым в репозитории материалам (обзорные статьи и заметки) для работы с предметной областью, штурмом событий и связкой DDD + ES. Каноничные описания границ контекстов проекта остаются в [`ddd-bounded-contexts.md`](ddd-bounded-contexts.md) и учебной версии [`ddd-bounded-contexts-study.md`](ddd-bounded-contexts-study.md).

## Оглавление

- [Назначение](#назначение)
- [Состав набора](#состав-набора)
- [Связь с артефактами проекта](#связь-с-артефактами-проекта)
- [Первоисточники и атрибуция](#первоисточники-и-атрибуция)

## Назначение

Этот набор нужен, чтобы:

- быстро сориентироваться в терминах **DDD**, **bounded context**, **Event Storming**;
- иметь под рукой **локальные копии** выбранных текстов (в т.ч. при недоступности внешних сайтов);
- не смешивать **учебный/внешний** контент с **проектными** артефактами: ADR — в [`../adr/`](../adr/), DDD-артефакты — в этом каталоге (`ddd/`), прочие артефакты анализа — в [`../../artifacts/`](../../artifacts/).

Файлы в [`reference-readings/`](reference-readings/) именуются в стиле репозитория: **латиница**, **kebab-case**, без пробелов в путях.

## Состав набора

| Тема | Файл в репозитории | Оригинал |
| --- | --- | --- |
| Практика Event Storming, роли, этапы, ограничения метода | [reference-readings/event-storming-workshop-habr.md](reference-readings/event-storming-workshop-habr.md) | [Хабр, REG.RU / runity](https://habr.com/ru/companies/runity/articles/689620/) |
| Краткий обзор DDD: ubiquitous language, bounded context, когда внедрять | [reference-readings/ddd-quick-intro-habr.md](reference-readings/ddd-quick-intro-habr.md) | [Хабр, Dodo Dev](https://habr.com/ru/companies/dododev/articles/489352/) |
| Связка DDD + Event Sourcing и выделение сервисов (краткая заметка + ссылки) | [reference-readings/software-services-ddd-event-sourcing-buildin.md](reference-readings/software-services-ddd-event-sourcing-buildin.md) | [buildin.ai (share)](https://buildin.ai/se24/share/63be3be1-90b0-443d-8ff3-83d689f57d75) |

Рекомендуемый порядок чтения для знакомства с воркшопом: **краткий DDD** → **Event Storming** → при необходимости **DDD + ES**.

## Связь с артефактами проекта

- Контексты и контекстная карта парковочной системы: [`ddd-bounded-contexts.md`](ddd-bounded-contexts.md).
- Сжатое объяснение для онбординга: [`ddd-bounded-contexts-study.md`](ddd-bounded-contexts-study.md).
- Псевдокод сценариев: [`ddd-pseudocode-study.md`](ddd-pseudocode-study.md).
- Архитектурные решения: индекс [`../readme.md`](../readme.md).

Внешние материалы **не** заменяют ADR и не задают границы контекстов проекта без явного согласования в репозитории.

## Первоисточники и атрибуция

Тексты в `reference-readings/` — сохранённые копии публикаций; авторы и даты указаны в YAML front matter каждого файла (`author`, `source`, `url`, `date_published` где есть). При цитировании в документах проекта ссылайтесь на **оригинальный URL** и при необходимости на путь к копии в этом репозитории.
