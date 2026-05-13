# Ретро: превью-картинки highlights

**Дата:** 2026-05-13
**Длительность:** ~20 мин. активной работы агентов + синтез orchestrator
**Связанный план:** [plans/2026-05-12-highlights-preview-images.md](../../../plans/2026-05-12-highlights-preview-images.md)
**Агент:** Claude Code (3 параллельных подагента + orchestrator)

## 1. Задача

Подключить превью-картинки к 7 из 8 highlight-блоков корневого README внутри
существующих `<details>`, убрать 8 TODO-меток, пожать 2 тяжёлых JPG (>2 МБ),
привести имя sequence-ассета к имени артефакта, актуализировать roadmap.

## 2. Как решал

Orchestrator разбил работу на 3 трека по непересекающимся файлам и запустил
агентов параллельно:

- **Агент A** (фаза 1): сжатие двух JPG — jpegoptim и magick отсутствовали,
  агент использовал Python Pillow. Оба файла: resize до 2400 px по длинной
  стороне, quality=80, strip metadata, in-place.
- **Агент B** (фазы 0, 2, 3): sanity-check 7 исходников → `git mv`
  sequence-ассета → 15 Edit в README (8 снятий TODO + 7 вставок картинок
  по якорной стратегии). Локально прошли `lint:md` и `format:check`.
- **Агент C** (фаза 5): 4 правки в `plans/2026-05-12-portfolio-roadmap.md` —
  таблица highlights (6 → 8 строк), описание подплана 2, фаза 6 `[x]`,
  риск #7 закрыт. `check:plans` и `lint:md` — зелёные.

После синтеза orchestrator прогнал `ci:check` — 5 pre-existing ошибок:
`MD025` в `data-dictionary.md` (файл переименован из `data-dictionary-buildin-import.md`,
но exclusion в конфиге не обновился), и 4 синтаксических ошибки MD038/MD046 в
самом плане (trailing space в code span, indented code blocks вместо fenced).
Оба блока исправлены; повторный `ci:check` — 0 ошибок.

## 3. Решил ли

Да. Все DoD-пункты выполнены:

- 8 TODO-меток удалены (`grep -c "TODO: cover 1200" README.md` → 0).
- 7 highlights получили кликабельное превью внутри `<details>`: картинка обёрнута в ссылку на артефакт (синтаксис image-as-link).
- `opportunity-canvas.jpg`: 5.1 МБ → 356 КБ. `es-tobe-sd-contexts.jpg`: 3.6 МБ → 228 КБ.
- `sequence-uc-10-2-payment.png` → `sequence-uc-10-2-pay-online-short-term-rental.png` (git mv + правка ссылки в .md).
- Roadmap актуализирован, фаза 6 `[x]`.
- `npm run ci:check` — зелёный.
- Журнал трассировки не обновлялся: rename ассета и правки README — технические
  операции, не семантические правки артефактов или требований.

## 4. Эффективность

**Хорошо:** Параллельный запуск 3 агентов по непересекающимся файлам дал
выигрыш по времени. Якорная стратегия Edit (TODO + уникальный TL;DR) сработала
без единого конфликта с `replace_all`. MD012 не сработал ни разу — якорь с
примыкающей пустой строкой отработал корректно.

**Где потеряли время:** pre-existing lint в плане и устаревший exclusion в
`.markdownlint-cli2.jsonc` потребовали отдельного прохода orchestrator. В
следующий раз стоит прогонять `npm run lint:md` перед стартом агентов, чтобы
видеть baseline и не тратить итерацию на pre-existing шум.

**Для повторения:** схема «один агент — один набор файлов» с отчётом
DONE/CHANGED/CHECKS/BLOCKED хорошо масштабируется на задачи с чётко
разграниченными зонами правок.

## 5. Как было и как стало

**До:** README содержал 8 строк `<!-- TODO: cover 1200x630 — подплан 2 -->`,
`<details>` у highlights были только текстовыми, `opportunity-canvas.jpg`
весил 5.1 МБ, sequence-ассет назывался `sequence-uc-10-2-payment.png`.

**После:** все 8 TODO сняты; 7 highlights открываются с кликабельной
картинкой-ссылкой на артефакт; два тяжёлых JPG пожаты до 356 КБ и 228 КБ;
sequence-ассет переименован в соответствии с именем артефакта; roadmap
приведён к фактическому составу README (8 highlights). `ci:check` — зелёный.
