# План: превью-картинки highlights

**Дата**: 2026-05-13
**Задача**: Подключить превью-картинки к 7 highlight-блокам корневого README **внутри существующего `<details>`**, обернув их в ссылку на артефакт. У highlight 4 (FR Бронирование) — снять TODO-метку без вставки. Дополнительно: пожать 2 самых тяжёлых JPG (>2 МБ) и привести имя `sequence`-картинки в соответствие с именем артефакта.

## Зачем именно так

В корневом README после подпланов 1 и 3 у 8 highlight-блоков стоит TL;DR + спойлер `<details>Подробнее</details>` + ссылка на артефакт, но каждый блок содержит TODO-метку `<!-- TODO: cover 1200×630 — подплан 2 -->`. Витрина читается, но без визуального якоря.

В то же время в `docs/.../assets/` уже лежат полноценные исходники диаграмм (JPG/PNG), выгруженные ранее из draw.io / Miro / buildin.ai. Из 8 highlights 7 имеют прямое соответствие в существующих ассетах.

**Размещаем картинки внутри `<details>`, не inline.** Это решает несколько проблем сразу:

- суммарный вес исходников ~15 МБ — inline-вставка делала бы первую загрузку README медленной; внутри неоткрытого `<details>` GitHub не подгружает картинки до клика;
- `opportunity-canvas.jpg` весит **5.3 МБ**, что на границе лимита GitHub image proxy для inline-рендера, — внутри `<details>` ограничение не релевантно;
- через `<details>` картинка естественно оборачивается в ссылку `[![alt](path)](артефакт.md)`: клик по превью ведёт на артефакт, а не на голый JPG;
- README не содержит inline-картинок → GitHub не выберет автоматически первую как `og:image` для соцпревью; OG-обложка чисто переходит в подплан 4.

**Альтернативы отброшены:**

- _Inline-превью (картинки между TL;DR и `<details>`)._ Радикально увеличивает первичный вес страницы, делает картинку некликабельной как ссылку на артефакт (или ведёт на голый JPG), создаёт «окно дурного og:image» между подпланом 2 и подпланом 4.
- _Сделать копии 1200×630 в `docs/assets/highlights/`._ Требует ручной обрезки/масштабирования каждой диаграммы; часть мелких надписей (компоненты C4, контексты ES) после ресайза станет нечитаемой.
- _Генерировать OG-карточки 1200×630 для соц-превью._ Это задача брендинга (подплан 4); туда же — единый репо-cover для `<meta property="og:image">`.
- _Сгенерировать декоративную карточку для FR Бронирование._ Создание нового ассета без живого исходника = декоративная заглушка. Пользователь предпочёл оставить highlight 4 без cover, чем добавлять полу-фейковую картинку.

## Цель

1. В корневом README у 7 highlights появляется внутри `<details>` строка `[![alt](image)](artifact.md)` — картинка-ссылка на артефакт.
2. У highlight 4 (FR Бронирование) TODO-метка удалена без замены; блок остаётся текстовым.
3. У всех 8 highlights TODO-метка `<!-- TODO: cover 1200×630 — подплан 2 -->` снята.
4. Два самых тяжёлых ассета пожаты:
   - `docs/artifacts/assets/opportunity-canvas.jpg`: 5.3 МБ → <2 МБ;
   - `docs/artifacts/es-to-be/assets/es-tobe-sd-contexts.jpg`: 3.7 МБ → <2 МБ.
     Формат остаётся JPG, длинная сторона ≤ 2400 px, квалити ~80.
5. Имя ассета Sequence UC-10.2 приведено к имени артефакта:
   - `docs/architecture/integration/assets/sequence-uc-10-2-payment.png` → `…/sequence-uc-10-2-pay-online-short-term-rental.png`;
   - ссылка в `docs/architecture/integration/sequence-uc-10-2-pay-online-short-term-rental.md:9` обновлена.
6. В roadmap-файле `plans/2026-05-12-portfolio-roadmap.md`:
   - таблица highlights переписана под фактический состав README (6 → 8 строк, включая Opportunity Canvas и FR Бронирование с пометкой «без cover»);
   - формулировка подплана 2 актуализирована: исходники как есть, без жёсткого 1200×630;
   - подплан 2 в таблице прогресса и фаза 6 отмечены `[x]`, добавлена ссылка на ретро.
7. `npm run ci:check` зелёный локально.
8. Ретро написано в `docs/process/retro/2026-05-12-highlights-preview-images.md`.

## Scope

**Входит:**

- Удаление 8 TODO-меток в `README.md` (включая highlight 4).
- Вставка картинки-ссылки `[![alt](image)](artifact.md)` внутрь `<details>` у 7 highlights (1, 2, 3, 5, 6, 7, 8) — первой строкой после `<summary>Подробнее</summary>`, перед `**Контекст:**`.
- Оптимизация двух JPG: `opportunity-canvas.jpg`, `es-tobe-sd-contexts.jpg` (in-place).
- Переименование `sequence-uc-10-2-payment.png` → `sequence-uc-10-2-pay-online-short-term-rental.png` через `git mv` + правка ссылки в `.md` артефакта.
- Обновление таблицы highlights в `plans/2026-05-12-portfolio-roadmap.md` (6 → 8 строк), формулировки подплана 2, отметка `[x]` фазы 6.
- Ретро в `docs/process/retro/`.

**Не входит:**

- Создание новых cover-изображений в формате 1200×630 — перенесено в подплан 4 (OG-image для соц-превью).
- Правки самих файлов артефактов в `docs/artifacts/`, `docs/architecture/` (кроме одной строки в `sequence-uc-10-2-pay-online-short-term-rental.md`, где обновляется ссылка на переименованную картинку).
- Правки `docs/specs/` (не трогаются согласно правилу 3 из CLAUDE.md).
- Правки `docs/readme.md` и `docs/project-overview.md`.
- Сжатие остальных JPG (context-diagram 3.0 МБ, event-storming-as-is 2.8 МБ — на грани, риск принят).
- Обложки для других визуальных артефактов в `docs/` (BPMN, ERD, drakon, demo-days slides).

## Маппинг highlight → исходник

| #   | Highlight (название в README)    | Файл исходника                                                                                                  | Артефакт-ссылка                                                                  | Действие                                            |
| --- | -------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | --------------------------------------------------- |
| 1   | AS-IS Event Storming             | `docs/artifacts/as-is/assets/event-storming-as-is.jpg`                                                          | `docs/artifacts/as-is/event-storming-as-is.md`                                   | Картинка-ссылка в `<details>`                       |
| 2   | Opportunity Canvas               | `docs/artifacts/assets/opportunity-canvas.jpg` (пожать)                                                         | `docs/artifacts/opportunity-canvas.md`                                           | Картинка-ссылка в `<details>`                       |
| 3   | Контекстная диаграмма            | `docs/artifacts/assets/context-diagram.jpg`                                                                     | `docs/artifacts/context-diagram.md`                                              | Картинка-ссылка в `<details>`                       |
| 4   | FR Бронирование                  | —                                                                                                               | —                                                                                | Удалить TODO без замены                             |
| 5   | Event Storming TO-BE: контексты  | `docs/artifacts/es-to-be/assets/es-tobe-sd-contexts.jpg` (пожать)                                               | `docs/architecture/ddd/es-tobe-sd-contexts.md`                                   | Картинка-ссылка в `<details>`                       |
| 6   | C4 — Context и Container         | `docs/architecture/c4/assets/c4-l1-system-context.png`                                                          | `docs/architecture/c4/c4-diagrams.md`                                            | Картинка-ссылка в `<details>`                       |
| 7   | DFD L1                           | `docs/artifacts/assets/dfd-l1.jpg`                                                                              | `docs/artifacts/dfd-l1.md`                                                       | Картинка-ссылка в `<details>`                       |
| 8   | Sequence UC-10.2 — онлайн-оплата | `docs/architecture/integration/assets/sequence-uc-10-2-pay-online-short-term-rental.png` (после переименования) | `docs/architecture/integration/sequence-uc-10-2-pay-online-short-term-rental.md` | Переименовать ассет + картинка-ссылка в `<details>` |

## Шаблон вставки

Внутри существующего `<details>` каждого из 7 highlights — первой строкой после `<summary>Подробнее</summary>` и пустой строки:

```markdown
[![<alt: 3–6 слов>](<путь к картинке>)](<путь к .md артефакта>)
```

Пример для highlight 1:

```markdown
<details>
<summary>Подробнее</summary>

[![Event Storming AS-IS](docs/artifacts/as-is/assets/event-storming-as-is.jpg)](docs/artifacts/as-is/event-storming-as-is.md)

**Контекст:** ...
```

Alt-текст — короткая фраза, дублирующая суть highlight (для скринридеров и fallback-рендера). Подписей под картинкой не добавляем — TL;DR стоит снаружи `<details>`.

## Стратегия Edit (якоря, не номера строк)

Номера строк в TODO-метках (20, 39, 58, 77, 96, 115, 134, 153 на 2026-05-13) **не используются** как контракт правок — они могут сдвинуться. Все Edit-правки матчатся по уникальным якорям.

**Якорь для снятия TODO у каждого highlight** — TODO-комментарий + следующая пустая строка + начало уникального TL;DR:

```text
old_string:
<!-- TODO: cover 1200×630 — подплан 2 -->

TL;DR: <первые 4–6 слов уникального TL;DR этого highlight>

new_string:
TL;DR: <первые 4–6 слов уникального TL;DR этого highlight>
```

Так каждая из 8 правок уникальна за счёт TL;DR (TODO-комментарий сам по себе идентичен во всех 8 местах — `replace_all` использовать **запрещено**).

**Якорь для вставки картинки** — фраза `<summary>Подробнее</summary>` + пустая строка + `**Контекст:**` + уникальное начало контекста (контекст у каждого highlight свой):

```text
old_string:
<summary>Подробнее</summary>

**Контекст:** <уникальное начало контекста>

new_string:
<summary>Подробнее</summary>

[![<alt>](<image>)](<artifact-md>)

**Контекст:** <то же уникальное начало контекста>
```

## Правила коммитов и веток

- Ветка `docs/portfolio-roadmap` (общая для всего roadmap).
- Все коммиты и push делает пользователь через `npm run commit:atomic` (или `:dry-run` для предпросмотра).
- Без `git add -A` / `git add .` (правило 1 CLAUDE.md и хук `block-unsafe-git-add.mjs`).
- Переименование `sequence`-картинки — через `git mv` (одной операцией, чтобы git видел rename, а не delete+add).
- Оптимизация JPG — in-place (тот же путь, изменённый бинарный контент).

## Определение «готово»

- [x] Из `README.md` исчезли все 8 вхождений `<!-- TODO: cover 1200×630 — подплан 2 -->` (проверка: `grep -c "TODO: cover 1200" README.md` → 0).
- [x] У 7 highlights (1, 2, 3, 5, 6, 7, 8) внутри `<details>` добавлена строка `[![alt](image)](artifact.md)` первой после `<summary>`. У highlight 4 картинка не добавлена.
- [x] markdownlint MD012 (multiple consecutive blank lines) не срабатывает — между `### N.` и TL;DR ровно одна пустая строка (TODO-строка снята **вместе** с одной из примыкающих blank — см. якорь Edit выше).
- [x] Каждая картинка-ссылка существует физически (sanity-check скриптом — фаза 4):

  ```bash
  grep -oE '\[!\[[^]]*\]\(([^)]+)\)\]\(([^)]+)\)' README.md \
    | sed -E 's/.*\]\(([^)]+)\)\)/\1/' \
    | while read -r p; do test -f "$p" || echo "MISSING: $p"; done
  ```

  → пустой вывод.

- [x] Пути в `[…](artifact.md)`-части каждой картинки-ссылки реально открываются (проверяются тем же sanity-check скриптом, см. выше — он выдёргивает обе скобки).
- [x] `opportunity-canvas.jpg` весит < 2 МБ. `es-tobe-sd-contexts.jpg` весит < 2 МБ. Проверка: `du -h docs/artifacts/assets/opportunity-canvas.jpg docs/artifacts/es-to-be/assets/es-tobe-sd-contexts.jpg`.
- [x] Картинки после сжатия открываются (визуальная проверка — открыть в просмотрщике, убедиться, что диаграмма читается).
- [x] Файл `docs/architecture/integration/assets/sequence-uc-10-2-payment.png` отсутствует, на его месте — `sequence-uc-10-2-pay-online-short-term-rental.png` (с тем же содержимым, через `git mv`). Ссылка в `docs/architecture/integration/sequence-uc-10-2-pay-online-short-term-rental.md` (была строка 9) обновлена на новое имя.
- [x] `npm run format:check` — зелёный (prettier-хук `format-on-write.mjs` мог переформатировать строки картинок при Edit; если форму prettier изменил — она принимается как валидная, повторный прогон должен быть идемпотентным).
- [x] `npm run ci:check` — зелёный локально (markdownlint, file-names, plans, link-check).
- [x] Таблица highlights в `plans/2026-05-12-portfolio-roadmap.md` (раздел «Список 6 highlights портфолио»):
  - заголовок переименован в «Список 8 highlights портфолио»;
  - 8 строк в порядке README (AS-IS ES, Opportunity Canvas, Контекстная диаграмма, FR Бронирование, ES TO-BE контексты, C4, DFD L1, Sequence UC-10.2);
  - у FR Бронирование явная пометка «без cover».
- [x] В roadmap в разделе «Состав каждого подплана» текст подплана 2 актуализирован: убрана отсылка к жёсткому формату 1200×630 для inline-превью; формат OG-image вынесен в подплан 4; зафиксировано размещение в `<details>`.
- [x] В таблице прогресса roadmap подплан 2 отмечен `[x]` со ссылкой на ретро.
- [x] Фаза 6 в разделе «Фазы и статус» roadmap отмечена `[x]`.
- [x] Ретро в `docs/process/retro/2026-05-13-highlights-preview-images.md` написано по формату из `docs/process/retro/README.md` (5 пунктов: Задача / Как решал / Решил ли / Эффективность / Как было и как стало).
- [x] Журнал трассировки (`docs/process/traceability-matrix-log.md`) — **не обновляется**: требования, артефакты и архитектура не затрагиваются (один technical rename ассета + одна ссылка в `.md` артефакта = техническая операция, не семантическая правка артефакта). Это фиксируется в «Итоге» явно.
- [x] Пользователю напомнено про `npm run commit:atomic`.

## Фазы и статус

- [x] Фаза 0. **Sanity-check исходников.** Прогнать `test -f` по 7 файлам маппинга и убедиться, что они существуют. Если какого-то файла нет — стоп, синхронизация с пользователем перед редактированием README.
- [x] Фаза 1. **Оптимизация 2 тяжёлых JPG.** In-place через `jpegoptim` (если установлен) или `magick`:

  ```bash
  jpegoptim --max=80 --strip-all --all-progressive \
    docs/artifacts/assets/opportunity-canvas.jpg \
    docs/artifacts/es-to-be/assets/es-tobe-sd-contexts.jpg
  ```

  Альтернатива (если `jpegoptim` нет):

  ```bash
  magick mogrify -quality 80 -resize '2400x2400>' -strip \
    docs/artifacts/assets/opportunity-canvas.jpg \
    docs/artifacts/es-to-be/assets/es-tobe-sd-contexts.jpg
  ```

  Проверить итоговый размер < 2 МБ и визуально открыть оба файла.

- [x] Фаза 2. **Переименование Sequence-картинки.**
  - `git mv docs/architecture/integration/assets/sequence-uc-10-2-payment.png docs/architecture/integration/assets/sequence-uc-10-2-pay-online-short-term-rental.png`.
  - В `docs/architecture/integration/sequence-uc-10-2-pay-online-short-term-rental.md` обновить ссылку `assets/sequence-uc-10-2-payment.png` → `assets/sequence-uc-10-2-pay-online-short-term-rental.png` (одна строка, искать по `sequence-uc-10-2-payment`).
- [x] Фаза 3. **Правки `README.md`.** Через Edit по якорям из раздела «Стратегия Edit»:
  - 8 правок «снятие TODO» — для каждого highlight `old_string` включает TODO + начало TL;DR этого highlight, `new_string` начинается с TL;DR (без TODO);
  - 7 правок «вставка картинки в details» — для каждого из highlights 1, 2, 3, 5, 6, 7, 8 `old_string` = `<summary>Подробнее</summary>\n\n**Контекст:** <уникальное начало>`, `new_string` = тот же блок с добавленной строкой картинки-ссылки.
  - После каждой Edit ничего не дочитывать — переходим к следующей. После завершения всех 15 правок — переходим к Фазе 4.
- [x] Фаза 4. **Локальные проверки.**
  - `grep -c "TODO: cover 1200" README.md` → 0.
  - bash-скрипт sanity-check (см. DoD) → пустой вывод.
  - `npm run format:check` — зелёный. Если prettier хочет переформатировать README после правок — `npm run format`, повторный `format:check` должен быть зелёным.
  - `npm run ci:check` — зелёный.
- [x] Фаза 5. **Правки `plans/2026-05-12-portfolio-roadmap.md`.**
  - Раздел «Список 6 highlights портфолио» → переписать как «Список 8 highlights портфолио» под фактический состав README, с пометкой «без cover» у FR Бронирование.
  - Раздел «Состав каждого подплана», блок «Подплан 2» → актуализировать: убрать `*-cover.png` 1200×630, добавить «картинки размещаются внутри `<details>` каждого highlight как ссылка-обёртка `[![alt](image)](artifact.md)`», OG-формат → подплан 4.
  - Таблица прогресса → `[x]` для подплана 2 со ссылкой `docs/process/retro/2026-05-12-highlights-preview-images.md`.
  - «Фазы и статус» → `[x]` для фазы 6.
  - Risk #7 в roadmap (про превью-картинки) → актуализировать в свете фактического решения (details + lazy).
- [x] Фаза 6. **Ретро.** `docs/process/retro/2026-05-13-highlights-preview-images.md` по формату из `docs/process/retro/README.md`.
- [x] Фаза 7. **Финальный прогон `npm run ci:check` + напоминание про `npm run commit:atomic`.**

## Известные риски и принятые решения

1. **Вес страницы и размер ассетов.** Закрыт структурно: картинки внутри `<details>`, GitHub не подгружает их до раскрытия. Дополнительно пожаты 2 самых тяжёлых JPG до <2 МБ.
2. **`opportunity-canvas.jpg` >5 МБ.** Закрыт фазой 1 (сжатие). Сценарий «inline-превью с 5+ МБ JPG, который camo проксирует через раз» в этой версии плана не существует.
3. **Разные пропорции диаграмм.** У исходников нет единого аспект-рейтио — сетка тумбочек не получается. Не релевантно: картинки внутри `<details>`, на скролле витрина выглядит однообразно текстовой.
4. **Highlight 4 без cover.** Не релевантно для UX внешнего вида (картинок в скролле и так нет). Сохранено как принцип: текстовый артефакт без живого визуала не превращаем в декоративную карточку.
5. **Расхождение «6 highlights в roadmap vs 8 в README».** База — 8 из README (фактическое состояние). Список из 6 в roadmap содержал «DDD bounded contexts» как отдельный пункт; в README его нет — он растворён в «Event Storming TO-BE: контексты» (`es-tobe-sd-contexts.md`). При перезаписи таблицы фиксируем: DDD — часть Event Storming TO-BE. Подпланы 1 и 3 уже закрыты по старому списку; их ретро остаются как историческое состояние и не пересматриваются.
6. **Формат 1200×630.** Изначальная формулировка roadmap относилась к OG-image-сценарию. Для размещения в `<details>` обрезка не нужна. OG-cover репозитория переносится в подплан 4. Фиксируется в roadmap правкой описания подплана 2.
7. **Edit по неуникальному TODO-комментарию.** Закрыт стратегией якорей: каждая правка матчит TODO + начало уникального TL;DR. `replace_all` не используется.
8. **markdownlint MD012 при удалении TODO у highlight 4.** Закрыт: при снятии TODO забирается **вместе с одной примыкающей пустой строкой** (см. якорь Edit). Между `### N.` и TL;DR остаётся ровно одна blank.
9. **Prettier-хук `format-on-write.mjs`.** После каждой Edit срабатывает Prettier. Принято: если Prettier переформатировал строку картинки-ссылки — его форма принимается как валидная (она будет идемпотентной). После всех правок — `npm run format:check` + при необходимости `npm run format`.
10. **`lint:md-links` не валидирует image-пути в `![](…)`.** Закрыт: в DoD добавлен явный bash-скрипт sanity-check, который выдёргивает обе скобки из `[![…](image)](artifact)` и проверяет существование файлов через `test -f`. Не полагаемся на `lint:md-links` как единственный gate для картинок.
11. **og:image окно между подпланом 2 и подпланом 4.** Закрыт структурно: в README нет inline-картинок → GitHub не выберет первую как `og:image`. Соцпревью репо остаётся без картинки до подплана 4 (приемлемо), а не с тяжёлой нечитаемой диаграммой Opportunity Canvas (неприемлемо).
12. **Имя `sequence`-ассета != имя артефакта.** Закрыт фазой 2: `git mv` + правка единственной ссылки в `.md` артефакта. Конвенция «имя ассета = имя артефакта» восстановлена.
13. **Сжатие может ухудшить читаемость диаграмм.** Принят: цель — q=80 и длинная сторона ≤ 2400 px, что для диаграмм Miro/draw.io обычно сохраняет читаемость. В Фазе 1 — визуальная проверка обоих файлов перед переходом дальше. Если читаемость пострадала — откат `git checkout` и переход к менее агрессивным параметрам (q=85).

## Итог

Все 7 фаз выполнены. `npm run ci:check` — зелёный.

**Что сделано:**

- README: 8 TODO-меток удалены; 7 highlights получили строку `[![alt](image)](artifact.md)`
  внутри `<details>` первой после `<summary>`; highlight 4 (FR Бронирование) остался
  текстовым без cover.
- JPG-оптимизация: `opportunity-canvas.jpg` 5.1 МБ → 356 КБ; `es-tobe-sd-contexts.jpg`
  3.6 МБ → 228 КБ. Инструмент — Python Pillow (jpegoptim/magick отсутствовали в PATH).
- `sequence-uc-10-2-payment.png` → `sequence-uc-10-2-pay-online-short-term-rental.png`
  через `git mv`; ссылка в `.md` артефакта обновлена.
- `plans/2026-05-12-portfolio-roadmap.md`: таблица highlights расширена до 8 строк,
  описание подплана 2 актуализировано, фаза 6 `[x]`, риск #7 закрыт.
- Ретро: `docs/process/retro/2026-05-13-highlights-preview-images.md`.
- Журнал трассировки **не обновлялся**: все операции технические (rename ассета,
  правка одной ссылки в `.md`, lint-fix в плане, exclusion в конфиге) — семантика
  требований и артефактов не изменилась.
- Дополнительно: обновлён exclusion в `.markdownlint-cli2.jsonc`
  (`data-dictionary-buildin-import.md` → `data-dictionary.md`, файл был переименован
  ранее); исправлены 4 pre-existing lint-ошибки (MD038/MD046) в тексте плана.
