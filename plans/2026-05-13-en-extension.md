# План: EN-расширение портфолио

**Дата**: 2026-05-13
**Задача**: Создать в корне репозитория полноценный `README.en.md` (одна страница, ~2 экрана: hero, problem/solution/goal, 8 highlights в формате one-liner + link, таблица 5 demo, команда, навигация, стек, wireframe), добавить языковой переключатель в шапку RU `README.md` и в шапку нового `README.en.md`, удалить устаревший inline-блок «English Summary» из RU README. Подплан 6 из roadmap [plans/2026-05-12-portfolio-roadmap.md](2026-05-12-portfolio-roadmap.md).

## Зачем именно так

Сейчас в корневом RU `README.md` в самом низу лежит блок `## English Summary` — около 12 строк bullet-перевода lifecycle проекта (под разделителем `---` после `## Wireframe-макет`-секции). Этого достаточно, чтобы иностранец понял «что за репо», но недостаточно как витрина: нет hero, нет проблема→решение→цель, нет 8 highlights, нет таблицы demo, нет команды и навигации. Подплан 6 в roadmap фиксирует обе альтернативы и оставляет выбор на момент исполнения: «либо вынести EN-блок в `README.en.md` (полноценная версия), либо расширить inline до 2–3 экранов».

Выбор зафиксирован в начале сессии — **отдельный `README.en.md`**:

- RU `README.md` остаётся витриной для основной аудитории (RU HR + RU SA-интервьюер из roadmap-позиционирования) и не разрастается английским хвостом, который RU-читателю не нужен.
- GitHub по умолчанию рендерит `README.md` — RU-читатель сразу видит русский, EN-читатель переходит по переключателю. Это стандартный паттерн для open-source с многоязычным README.
- Drift-риск (расхождение между RU и EN) реален, но управляем: 8 highlights уже стабилизированы в roadmap, набор demo заморожен (5 этапов, 5 demo), team — это GitHub usernames (не переводятся). Единственный живой раздел — Problem/Solution/Goal и lead-параграф, и они меняются реже всего.
- Альтернатива «расширенный inline-блок до 2–3 экранов» отброшена: RU-читателю английский хвост — балласт, скроллинг растягивается, при просмотре с телефона раздел «Стек» уезжает за середину файла.

Альтернатива «выделить переключатель отдельным sub-репо или GitHub Pages с языком в URL» отброшена сразу: для портфолио из ~10 KB-размера это overkill, добавляет инфраструктурный слой ради двух языков.

Альтернатива «продублировать в EN-версии полные `<details>`-карточки highlights с превью-картинками» отброшена: double overhead на drift, картинки и так уже в RU-версии (иностранец легко переходит на artifact-страницу или RU README через переключатель). EN-версия — one-liner + link, без `<details>`.

Альтернатива «перевести также все 8 артефактов и 5 demo readmes» — отброшена явно: это не «расширение EN-блока», это полноценная локализация документации, выходит за scope подплана и не оправдана аудиторией (см. roadmap: главный язык — русский).

## Цель

1. В корне репозитория создан новый файл `README.en.md` — полноценная EN-витрина. Структура и содержание зафиксированы в разделе «Структура README.en.md» ниже (даны как канонический mock-up, в момент исполнения он переносится в файл без свободной переработки).
2. В корневом `README.md` сразу после H1 (между строкой `# Цифровая платформа парковки` и блоком shields.io-бейджей) добавлен языковой переключатель формата `**Languages:** **Русский** · [English](README.en.md)`.
3. В корневом `README.en.md` сразу после H1 — симметричный переключатель `**Languages:** [Русский](README.md) · **English**`.
4. Из корневого `README.md` удалён устаревший блок «English Summary»: убраны строки `---`, `## English Summary`, абзац-описание, bullet-список из 5 пунктов lifecycle, абзац «Main entry points». На месте удаления — конец файла без хвоста (после раздела `## Wireframe-макет`).
5. В новом `README.en.md` сохранён тот же набор бейджей, что и в RU-версии, в том же порядке (status → CI → last-commit → license → demo). Все 5 URL копируются побайтово — в RU README бейдж статуса уже на английском (`learning%20project`), локализованной пары нет (см. раздел «Бейджи в EN README»).
6. Все ссылки на RU-документы (artifacts, demo readmes, navigation) явно помечены маркером `(RU)` в первый раз, когда читатель сталкивается с ними в каждом разделе — иностранец сразу понимает, что переход уведёт его на русскоязычный материал. Маркер ставится в формате `[Artifact](path) (RU)`, не повторяется в одном и том же bullet несколько раз.
7. В шапке `README.en.md` после lead-параграфа — явный blockquote-warning о том, что вся документация и артефакты на русском, диаграммы (Event Storming, C4, DFD, Sequence) визуально самообъясняющие. Канонический текст — в разделе «Структура README.en.md».
8. Прогон локальных проверок: `npm run lint:md`, `npm run lint:md:custom`, `npm run lint:md-links`, `npm run lint:file-names`, `npm run ci:check` (последнее включает также `check:plans`, `build`, `lint:mermaid`) — все зелёные.
9. Ретро написано в `docs/process/retro/2026-05-13-en-extension.md` по формату [docs/process/retro/README.md](../docs/process/retro/README.md). Статус подплана 6 в таблице roadmap [plans/2026-05-12-portfolio-roadmap.md](2026-05-12-portfolio-roadmap.md) обновлён на `[x]` со ссылкой на ретро, Фаза 9 в roadmap отмечена `[x]`.

## Scope

**Входит:**

- Создание файла `README.en.md` в корне репо. Содержание — канонический mock-up из раздела «Структура README.en.md» ниже.
- Языковой переключатель в шапке RU `README.md` (новая строка).
- Языковой переключатель в шапке `README.en.md` (часть mock-up'а).
- Удаление inline-блока «English Summary» из RU `README.md` — от горизонтального разделителя `---` перед `## English Summary` до конца файла, включая сам разделитель. Удаление идёт **по контенту, не по номерам строк**: после фазы 2 (вставка switcher) номера сдвинутся на 2–3 строки, и любые «жёсткие» диапазоны устарели.
- Перенос в EN-версию ссылок на 8 артефактов, 5 demo, команду, навигацию, стек и wireframe — все через путь к существующим RU-документам (без создания новых файлов).
- Маркеры `(RU)` рядом со ссылками на русскоязычные документы в EN-версии (см. правила в разделе «Маркер (RU) в ссылках» ниже).
- Локальные прогоны `npm run lint:md`, `npm run lint:md:custom`, `npm run lint:md-links`, `npm run lint:file-names`, `npm run ci:check` (последнее включает также `check:plans`, `build`, `lint:mermaid`).
- Обновление ячейки подплана 6 в таблице roadmap [plans/2026-05-12-portfolio-roadmap.md](2026-05-12-portfolio-roadmap.md) и Фазы 9 — после написания ретро.
- Ретро `docs/process/retro/2026-05-13-en-extension.md`.

**Не входит:**

- Перевод 8 артефактов на английский. Артефакты остаются на русском, EN README — single-page entry для иностранной аудитории, не локализация документации.
- Перевод 5 demo readmes (`docs/demo-days/demo-N/readme.md`). EN-таблица demo ссылается на RU-readme как есть.
- Перевод `docs/readme.md`, `docs/specs/`, `docs/architecture/`, `docs/artifacts/`, `docs/process/`. Эти разделы остаются RU.
- Перевод `CONTRIBUTING.md`, `CLAUDE.md`, `SKILLS.md`. Это служебные документы для контрибьюторов и агентов — у них своя аудитория.
- Создание EN-варианта `docs/project-overview.md` или других навигационных RU-файлов.
- Переключатель языка в самих RU-документах (например, `docs/readme.md`). Переключатель — только в корневых README.md и README.en.md.
- Превью-картинки в EN-версии. EN-highlights — one-liner + link, без `<details>` и без `<img>`.
- Добавление alt-текста к каждой ссылке на артефакт. Достаточно `[Artifact name](path) (RU)`.
- Создание/правка журнала трассировки: подплан затрагивает только корневые README-витрины, требования/артефакты/архитектурные решения не меняются. Журнал не трогаем, факт зафиксируется в `## Итог`.
- Перевод OG-image (`docs/assets/social-preview.png`) на английский или создание EN-варианта. OG-image — один файл, нейтральный к языку (показывается одинаково при шеринге обоих README).
- Поддержка третьего языка (китайский, испанский и т.п.). Только RU + EN.
- Правка/перенос HTML-комментария про OG-image (`<!-- OG-image для Social Preview этого репозитория — docs/assets/social-preview.png. … -->`) в RU `README.md`. Комментарий остаётся **на своём месте** — между блоком бейджей и lead-параграфом — это якорь для процедуры из `docs/process/branding-checklist.md`. В EN-версии этого комментария **нет** (asymmetry by design: в RU README он нужен как процедурное напоминание, для EN-витрины это шум).

## Правила коммитов и веток

- Ветка — общая `docs/portfolio-roadmap` (как для всего roadmap).
- Коммитит и пушит пользователь через `npm run commit:atomic` (или `:dry-run` для предпросмотра). План группировку коммитов не диктует.
- Без `git add -A` и `git add .` — добавлять файлы поштучно по имени.
- В сообщениях коммитов и в RU-документации (в том числе в шапке-переключателе RU README) не использовать букву «е с точками» — проектная конвенция. В `README.en.md` буква неприменима.

## Структура README.en.md

Это канонический mock-up. В фазе 1 он переносится в файл `README.en.md` дословно (с поправкой на актуальный Netlify-сабдомен на момент исполнения — берётся из RU `README.md` шапки, не зашиваем фиксированную ссылку в плане, чтобы не плодить расхождение с подпланом 4).

```markdown
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

## Navigation

- [Project overview](docs/project-overview.md) (RU) — subject domains and repository tech.
- [Wireframe demo](https://sab-win-26-parking.netlify.app/) — deployed UI mockup.
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

​`bash
npm ci
npm run build
​`

Then open `ui/index.html` and follow the relevant flow.
```

Замечания к mock-up:

- Тройные кавычки внутри блока mock-up'а выше намеренно экранированы zero-width-символом (`​`), чтобы Markdown не сломал внешний кодоблок. В реальный файл переносится **обычный** fenced code block с тройными кавычками — без zero-width-символа. При копировании из плана это нужно учесть.
- Netlify-сабдомен в bаджах и в разделе Wireframe — `sab-win-26-parking.netlify.app` (текущий, после переименования в подплане 4). Если на момент исполнения подплана 6 сабдомен снова изменится — берём актуальную ссылку из RU `README.md` шапки, не зашиваем фиксированную ссылку из плана.
- Имена этапов на английском взяты из контекста проекта; правки по терминологии (например, «Conceptual design» vs «Conceptual modelling») допустимы в фазе 1 и фиксируются в `## Итог`.

## Маркер (RU) в ссылках

Правило: для каждой ссылки в EN-README, ведущей на RU-документ, ставится `(RU)` после ссылки в формате `[Anchor text](path) (RU)`. Цель — иностранец видит сразу, что переход уведёт его на русскоязычный материал; не возникает ситуации «я кликнул и попал в незнакомый язык, наверное это ошибка».

Где **обязательно**:

- 8 highlights — каждая ссылка `→ [Artifact](...) (RU)`.
- Раздел Navigation — каждая bullet-ссылка на `docs/*/readme.md`.
- Reading route внизу Navigation — `[docs/readme.md](docs/readme.md#с-чего-начать) (RU)`.

Где **не нужно**:

- Ссылка на `LICENSE` — это короткий файл, текст на английском (ISC).
- Ссылка на репозиторий GitHub (`CeJIDb/sab-win-26-parking`) — это сам репо, не документ.
- Ссылки на Netlify wireframe — UI, не текстовый документ.
- Ссылки на GitHub-аккаунты команды — это профили, не документы.
- Ссылка на `Systems Analyst Bootcamp` — внешний сайт, кладёт ответственность за язык на принимающую сторону.
- Ссылки в таблице 5 demo — там есть строка-предупреждение под таблицей «Demo readmes are in Russian», не дублируем по каждой ячейке.

Цель — единообразие, но без шума. Если читатель один раз увидел `(RU)` в highlights и Navigation — он понял правило, дальше можно не дублировать в каждом bullet.

## Языковой переключатель в RU README

Место вставки в `README.md` — между H1 `# Цифровая платформа парковки` и первым shields.io-бейджем (`![Status: learning project]…`). Ориентир — контент, не номера строк. Каноническая строка:

```markdown
**Languages:** **Русский** · [English](README.en.md)
```

Правила:

- Текущий язык (`Русский`) — жирный без ссылки. Альтернативный (`English`) — обычный жирный? Нет, **только текущий жирный**, второй — обычный текст с ссылкой. Жирность маркирует «вы здесь».
- Разделитель — `·` (U+00B7, middle dot), не вертикальная черта `|` и не дефис. Это согласовано с типографикой остального README (нет других подобных строк, но middle dot — стандарт для language switcher'ов в open-source).
- После строки переключателя — одна пустая строка перед блоком бейджей. До — одна пустая строка после H1.
- `**Languages:**` — латиница на английском намеренно: для RU-читателя слово «Languages» интуитивно (это короткое слово, входит в школьную лексику), и для иностранца, попавшего на RU-страницу через прямую ссылку, маркер сразу понятен. Альтернатива «Языки: **Русский** · [English](README.en.md)» отброшена — обмен 1 русского слова не стоит дополнительной асимметрии с EN-версией.
- В файле сохраняется текущий стиль (без `<div align="right">` и других HTML-обёрток) — ссылка идёт обычным абзацем сверху.

## Языковой переключатель в EN README

В шапке `README.en.md` сразу после H1 (`# Parking Platform`):

```markdown
**Languages:** [Русский](README.md) · **English**
```

Зеркальная симметрия. `English` — жирный без ссылки (текущий язык), `Русский` — обычный текст с ссылкой на RU README. Middle dot. Структурно идентично RU-переключателю.

## Удаление inline-блока «English Summary» из RU README

Удаляем по контенту, не по номерам строк. Якоря для редактора: горизонтальный разделитель `---` сразу после абзаца «После этого можно открыть `ui/index.html` …» и заголовок `## English Summary` ниже. Всё, что между этим разделителем и концом файла (включая сам `---`), вырезается. Номера строк после фазы 2 (вставка switcher) сдвигаются — на них не опираемся.

Финальное состояние после удаления:

- Последний раздел RU README — `## Wireframe-макет`, заканчивающийся абзацем «После этого можно открыть `ui/index.html` и перейти в нужный контур.».
- После этого абзаца — `\n` (перевод строки) и конец файла. Никакого `---` и никакого `## English Summary` ниже.
- Trailing newline в конце файла сохраняется (Prettier поставит сам).
- Никаких других правок в RU README в рамках этого подплана не делается — только переключатель сверху и удаление EN-блока снизу.

Проверка после правки: `tail -3 README.md` — должны быть последние 3 строки `## Wireframe-макет`-секции, без признаков English Summary.

## Drift-стратегия

Подплан не вводит в репо автоматического линтера на синхронизацию RU/EN. Контроль drift — ручной, основывается на следующих правилах:

- 8 highlights и 5 demo заморожены в roadmap — изменения в этих списках идут через roadmap, и автор изменения обязан синхронизировать оба README. Это правило не вводится отдельным документом, оно вытекает из roadmap-позиционирования «8 highlights — единый витринный список».
- Команда (5 GitHub-handles) — не переводится, дрейф невозможен.
- Стек, Wireframe-блок — короткие и стабильные, дрейф маловероятен.
- Бейджи — single source URL в shields.io, все 5 байт-в-байт совпадают между RU и EN (см. раздел «Бейджи в EN README»). Единственное место расхождения теоретически возможно — если кто-то добавит новый бейдж только в один файл; ловится визуально на следующем PR-ревью.
- **Problem / Solution / Goal — единственный «живой» раздел, требующий явной защиты.** Метрика «80% за 6 месяцев» зафиксирована в обоих README дословно. Любая правка целевой метрики (80%, 6 месяцев, состав «онлайн-каналов») в RU README **обязана** синхронизироваться в EN README в том же коммите. Без автоматического линтера это держится на дисциплине автора; явно прописываем правило в ретро подплана 6, чтобы оно было доступно при следующих правках roadmap или discovery.
- **Navigation-якоря — отдельный риск.** EN README ссылается на `docs/readme.md#с-чего-начать`. Кириллический slug валиден (GitHub и `check-markdown-links.mjs` его резолвят), но при переименовании заголовка `## С чего начать` упадут **оба** README одновременно. Это поймает `lint:md-links` на pre-push — не катастрофа, но автор переименования должен быть готов править два файла. Других кириллических якорей в EN README нет, поэтому риск ограничен одной точкой.
- Если в будущем будут массовые правки RU README, и они не отражаются в EN — это нормальная цена за то, что главный язык репо — русский. Поломанные ссылки ловит `npm run lint:md-links` на обоих файлах сразу.

В ретро по подплану 6 явно фиксируется: drift между RU и EN — известный риск, принят, дополнительной автоматизации не вводим. Отдельно в ретро выносится правило про метрику 80%/6 месяцев и про навигационный якорь `#с-чего-начать` — чтобы будущие PR-ы могли свериться.

## Бейджи в EN README

В EN README копируется полный набор бейджей из RU README **побайтово, в том же порядке**: status → CI → last-commit → license → demo. Все 5 — нейтральны к языку.

Сверка с фактом на 2026-05-13: в текущем RU `README.md` бейдж статуса — `https://img.shields.io/badge/status-learning%20project-blue` (alt `Status: learning project`), он уже на английском. Локализованной русской пары бейджа в репо нет — это следствие подплана 4, который зафиксировал шильду на латинице. Поэтому при переносе в `README.en.md` никакой подмены URL или alt-текста делать не нужно: все 5 строк копируются как есть.

Проверка после вставки в EN README — визуальная (превью VSCode/GitHub): блок бейджей рендерится 1:1 как в RU. Отдельный `curl` по тем же URL не нужен — это те же самые ссылки, которые `lint:md-links` и так гоняет через RU.

## Определение «готово»

- [ ] Файл `README.en.md` создан в корне репозитория. Содержание соответствует канональному mock-up из раздела «Структура README.en.md».
- [ ] В `README.en.md` сразу после H1 — language switcher формата `**Languages:** [Русский](README.md) · **English**`.
- [ ] В `README.en.md` после блока бейджей и lead-параграфа — blockquote-warning с каноническим текстом про русскоязычность документации и language-agnostic диаграммы.
- [ ] В `README.en.md` 8 highlights — формат one-liner + `→ [Artifact](path) (RU)`. Картинки и `<details>`-блоки не используются.
- [ ] В `README.en.md` таблица «5 stages / 5 demo days» — 5 строк (Demo 1 … Demo 5) с ссылками на `docs/demo-days/demo-N/readme.md`, под таблицей — пояснение «Demo readmes are in Russian».
- [ ] В `README.en.md` присутствуют разделы Team (5 GitHub-handles), Navigation (5 bullet-ссылок с маркерами `(RU)`), Stack, Wireframe.
- [ ] В `README.en.md` все 5 бейджей побайтово идентичны RU README (URL копируются как есть; локализованной RU-пары бейджа статуса в репо нет).
- [ ] В корневом `README.md` между H1 и блоком бейджей — language switcher формата `**Languages:** **Русский** · [English](README.en.md)` с одной пустой строкой до и после.
- [ ] Из корневого `README.md` удалён блок «English Summary» (горизонтальный разделитель `---`, H2 заголовок, lead-абзац, bullet-список из 5 пунктов, «Main entry points»). Файл заканчивается секцией `## Wireframe-макет`.
- [ ] Маркеры `(RU)` поставлены в 8 highlights и в Navigation. В таблице demo маркеры не дублируются (есть строка-предупреждение под таблицей).
- [ ] Внешние ссылки `README.en.md` визуально открываются: Netlify-демо и GitHub-репо отвечают `HTTP 200`. Бейджи отдельно `curl`-ом не дёргаем — это те же URL, что и в RU README.
- [ ] `npm run lint:md` — зелёный.
- [ ] `npm run lint:md:custom` — зелёный (кастомный `check-markdown.mjs` зацепит и новый `README.en.md`).
- [ ] `npm run lint:md-links` — зелёный (все RU-ссылки в EN README резолвятся, EN-ссылка в RU README ведёт на `README.en.md`).
- [ ] `npm run lint:file-names` — зелёный (`README.en.md` лежит в корне; `check-file-names.mjs` сканирует только `docs/ui/sql/plans/scripts`, корневой файл вне scope).
- [ ] `npm run ci:check` — зелёный (включает также `check:plans`, `build`, `lint:mermaid`).
- [ ] В `README.en.md` нет невидимых символов из mock-up'а: `node -e "const t=require('fs').readFileSync('README.en.md','utf8');const m=t.match(/[​‌‍⁠﻿]/g);if(m){console.error('ZWSP',m.length);process.exit(1)}"` — без вывода и с кодом 0.
- [ ] Журнал трассировки не трогался — в `## Итог` зафиксировано, почему (правки только корневые витринные, требования/артефакты/архитектура не затронуты).
- [ ] Ретро написано в `docs/process/retro/2026-05-13-en-extension.md` по формату `docs/process/retro/README.md`.
- [ ] Статус подплана 6 в таблице roadmap [plans/2026-05-12-portfolio-roadmap.md](2026-05-12-portfolio-roadmap.md) обновлён на `[x]` со ссылкой на ретро; Фаза 9 в roadmap отмечена `[x]`.
- [ ] В `## Итог` зафиксирован факт: drift-стратегия — ручная, дополнительной автоматизации не вводим, синхронизация RU/EN — обязанность автора правки.

## Фазы и статус

Помечай каждую фазу `[x]` сразу по завершении и добавляй 1–2 строки в `## Итог` — не накапливай до конца.

- [x] Фаза 0. Сверка перед стартом: подтвердить, что (а) ветка `docs/portfolio-roadmap` чекаутнута; (б) корневой `README.en.md` не существует (`ls README.en.md` возвращает ошибку); (в) в корневом `README.md` существует блок `## English Summary` на ожидаемых строках (диапазон может сдвинуться, ориентируемся по заголовку, не по номеру строки); (г) Netlify-ссылка в RU README — `sab-win-26-parking.netlify.app` (актуальная после подплана 4); (д) GitHub-handles команды совпадают со списком в RU README (5 человек). Любое расхождение — остановиться и спросить пользователя.
- [x] Фаза 1. Создание `README.en.md` в корне репо. Содержание — канонический mock-up из раздела «Структура README.en.md». При переносе:
  - Заменить zero-width-символ в fenced code block раздела Wireframe на обычный fenced block (тройные кавычки). После сохранения — обязательная проверка `grep -P '[\x{200B}\x{200C}\x{200D}\x{FEFF}\x{2060}]' README.en.md` (через `node -e` или `python -c` если у grep нет PCRE) должна вернуть **пустой результат**. Если что-то найдено — пересоздать блок руками, не копипастой из плана.
  - Сверить Netlify-сабдомен с актуальным в RU README шапке.
  - Убедиться, что переключатель языка стоит сразу после H1, перед бейджами.
  - Убедиться, что все 5 бейджей побайтово идентичны RU README (в RU бейдж статуса уже на английском `learning%20project`, локализованной пары нет).
  - Не использовать букву «е с точками» (правило проектное; в английском тексте неприменимо, но в самой строке language switcher слово «Русский» этой буквы не содержит — проверяется автоматически).
  - После сохранения сработает `format-on-write.mjs` (Prettier) — визуально подтвердить, что блок бейджей и таблица 5 demo не разъехались.
- [x] Фаза 2. Вставка language switcher в корневой `README.md` между H1 и блоком бейджей. Каноническая строка — из раздела «Языковой переключатель в RU README». Switcher вставляется **строго перед** первым бейджем (`![Status: learning project]…`). HTML-комментарий про OG-image (`<!-- OG-image для Social Preview … -->`) находится **ниже** бейджей и **не трогается** — он остаётся между бейджами и lead-параграфом как процедурный якорь branding-checklist. Проверка: открыть RU README в превью VSCode — переключатель рендерится, ссылка на `README.en.md` кликабельна (после фазы 1 файл уже существует), HTML-комментарий остался на месте.
- [x] Фаза 3. Удаление inline-блока «English Summary» из RU `README.md`. Ориентир — **контент, не номера строк** (после фазы 2 строки сдвинулись). Удаляются: горизонтальный разделитель `---` после `## Wireframe-макет`-секции, H2 `## English Summary`, lead-абзац, bullet-список, абзац «Main entry points». Финал — секция `## Wireframe-макет` становится последней. Проверка: `tail -10 README.md` — нет ни `English Summary`, ни упоминаний `docs/specs/`/`docs/architecture/` в формате pipe-separated list.
- [x] Фаза 4. Прогон локальных проверок. Цепочка `ci:check` в `package.json` сейчас: `lint:md && lint:md:custom && lint:md-links && lint:file-names && check:plans && build && lint:mermaid`. Запускаем разом через `npm run ci:check` — это и есть «всё локально». Если хочется по отдельности (например, при отладке падения) — порядок такой же:
  - `npm run lint:md` — markdownlint-cli2 по конфигу.
  - `npm run lint:md:custom` — кастомный `scripts/lint/check-markdown.mjs`: следит за длиной строк журнала трассировки (≤500), H2 в process-docs, trailing whitespace, merge-маркерами, завершающим newline. Новый `README.en.md` он тоже зацепит — заранее закладываемся, что в нём не будет коротких H2 «Описание» без контента и обрезанных строк.
  - `npm run lint:md-links` — зелёный. Если падает — диагностировать (обычно: опечатка в относительном пути, например `docs/architecture/dd/...` вместо `docs/architecture/ddd/...`, либо несуществующий якорь после переименования заголовка).
  - `npm run lint:file-names` — зелёный. `README.en.md` лежит в корне, скрипт сканирует только `docs/ui/sql/plans/scripts` (см. `scripts/lint/check-file-names.mjs`), корневой файл по определению не задевается.
  - `npm run ci:check` — финальный прогон, включает также `check:plans`, `build` (Nunjucks → HTML для `ui/`) и `lint:mermaid`. Падение `build` или `lint:mermaid` от правок только в корневых README маловероятно, но если случилось — фиксим до закрытия фазы.
  - Если что-то падает — поправить до закрытия фазы.
- [x] Фаза 5. Визуальная проверка блока бейджей в EN README — превью VSCode или GitHub: 5 бейджей рендерятся в том же порядке и виде, что и в RU README. `curl` по URL не нужен — это побайтово те же ссылки, которые уже работают в RU и проходят `lint:md-links`.
- [x] Фаза 6. Ретро в `docs/process/retro/2026-05-13-en-extension.md` по формату `docs/process/retro/README.md`. Обновление статуса подплана 6 в roadmap [plans/2026-05-12-portfolio-roadmap.md](2026-05-12-portfolio-roadmap.md):
  - Ячейка таблицы (строка с `#=6, Подплан = "EN-расширение"`): значение колонки «Статус» меняется с `[ ] план создан 2026-05-13, фазы 0–7 не запущены` на формат **«`[x] выполнен 2026-05-13, ретро: docs/process/retro/2026-05-13-en-extension.md`»** — копируется один-в-один со стилем уже закрытых подпланов 5 (Demo Days) и 4 (брендинг) в той же таблице, чтобы вид колонки оставался консистентным.
  - В списке «Фазы и статус»: строка `- [ ] Фаза 9. Создан и выполнен подплан 6 (EN-расширение), ретро написано` меняется на `- [x] Фаза 9. Создан и выполнен подплан 6 (EN-расширение), ретро написано — docs/process/retro/2026-05-13-en-extension.md` (стиль с явной ссылкой на ретро — как у Фазы 6 в том же списке).
  - Фаза 10 («Финальная сверка») в roadmap **не закрывается** этим подпланом — она про общую сверку портфолио и закрывается отдельно.
- [x] Фаза 7. Напоминание пользователю про `npm run commit:atomic` — дифф готов к коммитам и push.

## Принятые решения

Фиксация на входе сессии — чтобы не возвращаться к ним по ходу.

1. **Отдельный `README.en.md`, не inline-блок.** Развилка roadmap решена в пользу отдельного файла. Аргументы — в разделе «Зачем именно так». RU README не разрастается, GitHub по умолчанию показывает RU, иностранец переходит через переключатель.
2. **Маркер `(RU)` ставится точечно, не везде.** Цель — единообразие без шума. После 8 highlights и Navigation читатель усваивает правило. В таблице demo маркеры заменены одной строкой-предупреждением под таблицей.
3. **Бейджи в EN — те же URL побайтово.** Все 5 бейджей (status, CI, last-commit, license, demo) нейтральны к языку: в RU README бейдж статуса уже на английском (`learning project`) — это результат подплана 4. Локализованной RU-версии бейджа в репо нет, поэтому переноса с подменой URL/alt не делаем.
4. **EN-версия не использует `<details>`-карточки.** В RU `<details>` нужны, потому что там есть полные TL;DR + контекст + связанные артефакты + превью-картинка. В EN — формат one-liner + link достаточен; полная история — на странице артефакта (RU). Двойной overhead на drift не оправдан.
5. **Перевод demo readmes — out of scope.** EN-таблица demo ссылается на RU-readme как есть; строка-предупреждение под таблицей делает это явным. Перевод 5 demo и 8 артефактов — это другая задача (полноценная локализация), и она не оправдана аудиторией.
6. **Language switcher — `**Languages:**`, не флаги и не эмодзи.** Эмодзи проектная конвенция запрещает без явного запроса; флаги для пары RU/EN могут читаться как национальный маркер, что необязательно для языка (швейцарский немец, индийский англофон). Текстовая метка `Русский / English` — самый нейтральный вариант.
7. **Middle dot `·` как разделитель.** Стандарт open-source language switcher'ов. Вертикальная черта `|` визуально тяжелее, дефис `-` сливается с текстом. Middle dot не путается с другими символами в RU/EN-тексте.
   **7a. Размещение switcher: текстовая строка между H1 и блоком бейджей, а не shields.io-бейдж.**
   - Рассмотренная альтернатива: добавить `[![EN](https://img.shields.io/badge/lang-EN-lightgrey)](README.en.md)` шестым бейджем — switcher оказывается визуально в одной линейке с CI/license/demo, заметнее на первом экране.
   - Отбрасываем по двум причинам: (а) бейджи в репо несут смысл «статус/факт о репо» (status, CI, license, demo) — language switcher не из этого ряда, и подмешивание ломает семантику блока; (б) badge-стиль работает только в одну сторону — EN-баджик в RU-README ведёт на EN; на EN-стороне нужен зеркальный RU-баджик, и текст «RU» / «Русский» в png-бейдже shields.io уже плохо читается на мелком kегле.
   - Цена выбранного решения: на ширине меньше ~70 cимволов строка `**Languages:** **Русский** · [English](README.en.md)` визуально теряется между крупным H1 и плотным цветным блоком бейджей. Это **известный UX-компромисс**, не баг. Если позже выяснится, что иностранцы массово пропускают switcher, отдельный подплан меняет формат на badge — но без данных от роадмапа этого не делаем.
8. **`README.en.md` лежит в корне, не в `docs/`.** Стандарт GitHub: альтернативные README остаются на одном уровне с основным `README.md`. Это даёт корректный URL `github.com/CeJIDb/sab-win-26-parking/blob/main/README.en.md`, который можно использовать как deep link при шеринге.
9. **Drift-стратегия — ручная.** Автоматический линтер на синхронизацию RU/EN не вводим. Это пара витринных файлов, не основной контент репо; ручной контроль через roadmap-правило «8 highlights — single source» достаточен. Если в будущем дрейф окажется проблемой — введём отдельный подплан.
10. **Удаление inline-блока «English Summary» — не дублируем.** Раз есть полноценный `README.en.md`, оставлять inline-блок внизу RU README — это лишний дубль (хуже синхронизировать, RU-читателю балласт). Удаление — часть подплана 6, а не отдельная фаза.
11. **Журнал трассировки не трогаем.** Все правки — корневые витринные; требования, артефакты, архитектурные решения не меняются.
12. **Netlify-сабдомен не зашиваем в плане жёстко.** В mock-up'е стоит `sab-win-26-parking.netlify.app` (актуальный после подплана 4). Если на момент исполнения сабдомен снова изменится — берём из RU README шапки. Это согласовано с решением 6 подплана 4 («не дублировать ссылку, brand-checklist — single source»).

## Итог

- **README.en.md создан**, 88 строк. Содержание соответствует каноническому mock-up'у плана 1:1. Отклонений от mock-up'а нет (выравнивание таблицы незначительно уже — содержание идентично). ZWSP-проверка: `ZWSP-clean`.
- **Inline-блок «English Summary» удалён полностью** из RU README. Файл заканчивается последним абзацем секции `## Wireframe-макет`. Tail: нет `---`, нет `English Summary`, нет `Main entry points`.
- **Все локальные проверки зелёные**: `lint:md`, `lint:md:custom`, `lint:md-links`, `lint:file-names`, `check:plans`, `build`, `lint:mermaid` — все OK (`npm run ci:check` 2026-05-13).
- **Бейджи**: 5 строк в `README.md` и `README.en.md` побайтово идентичны (diff пустой). Визуальная проверка в превью отложена до пользовательского ревью на GitHub.
- **Drift-стратегия — ручная**: автоматического линтера на синхронизацию RU/EN не вводим. Правило: при правке метрики «80% за 6 месяцев» в Problem/Solution/Goal обязательно синхронизировать EN в том же коммите. Зафиксировано в ретро.
- **Журнал трассировки не трогался**: правки затронули только корневые витринные README, требования/артефакты/архитектурные решения не изменялись.
- **Roadmap**: подплан 6 закрыт `[x]` в таблице; Фаза 9 отмечена `[x]`.
- **Ретро**: [docs/process/retro/2026-05-13-en-extension.md](../docs/process/retro/2026-05-13-en-extension.md)
