# План: RabbitMQ-конвейер для рассылки уведомлений (учебный TO-BE)

**Дата**: 2026-05-01
**Задача**: подготовить ДЗ по теме брокеров сообщений для RabbitMQ — DFD конвейера потоков данных RMQ и описание требований к RMQ. Скоуп — work queue команд на отправку уведомлений (SMS/email/push) внутри Notification bounded context, как продолжение Kafka-конвейера из [ADR-007](../docs/architecture/adr/adr-007-kafka-event-bus-online-booking.md).
**Время**: ~3 ч

## Зачем именно так

ДЗ курса включает два артефакта по RabbitMQ: «Конвейер потоков данных RMQ DFD» и «Описание требований к RMQ» — симметрично уже сданному Kafka-блоку ([план 2026-04-30](2026-04-30-kafka-pipeline-online-booking.md), [ADR-007](../docs/architecture/adr/adr-007-kafka-event-bus-online-booking.md), [DFD K-L1/K-L2](../docs/architecture/integration/message-flow-kafka-online-booking.md), [требования](../docs/architecture/integration/kafka-requirements.md)). В [ADR-007 Next steps](../docs/architecture/adr/adr-007-kafka-event-bus-online-booking.md#next-steps) обещан ADR-008 после практического опыта с Kafka — этот план его реализует.

**Архитектурный принцип** — единый для обоих ADR (формулировка переносится в Context ADR-008 из временного `notes-rabbitmq-candidates.md`, который удаляется в Фазе 5):

> **Kafka** — события между ограниченными контекстами (bounded contexts).
> **RabbitMQ** — рабочая очередь команд внутри одного контекста.

Из этого вытекает скоуп: RMQ оформляем как **work queue команд внутри Notification контекста**. Точка входа в RMQ — `Notification Service`, который слушает Kafka-топики `Topic_BookingCreated` и `Topic_BookingConfirmed` (из ADR-007) и публикует команды на отправку в RMQ. Внутренние воркеры (SMS/Email/Push) — единственные consumer'ы. Это **Кандидат 1** (приоритет высокий) из временного `notes-rabbitmq-candidates.md` — содержимое переносится в Context ADR-008 в Фазе 1, сам файл удаляется в Фазе 5.

**Альтернативы, отброшенные при проработке:**

- **Полная замена Kafka на RMQ на той же сквозной цепочке (как в [телемед-референсе L1](rbq/telemed-dfd-rbq-l1.jpg)).** Дублирует ADR-007 на той же бизнес-цепочке, не дает нового материала, ломает архитектурный принцип «брокеры по типу процесса». Отброшен пользователем.
- **RMQ для ЭДО/1С dispatch (Кандидат 2).** Узкий внешний канал, бедная топология (одна очередь на одного consumer'а), не показывает ни fan-out, ни DLX. Не педагогичен.
- **RMQ для СКУД/барьер CMD (Кандидат 4).** Конфликтует с горячим путем allow/deny из [ADR-001](../docs/architecture/adr/adr-001-online-access-rights-evaluation.md) и [ADR-005](../docs/architecture/adr/adr-005-access-control-direct-db-read.md), требует latency-budget анализа. Лишнее усложнение.

**Структура exchanges/queues** — обоснована рекомендацией курса (rabbitmq-часть-2 из [systems-analyst-db](../../systems-analyst-db/content/16-message-brokers/rabbitmq.md)): «если конечное множество ключей маршрутизации — Direct или Fanout 1:1; количество exchange и очередей минимально». У нас 3 канала и 2 типа триггерных событий — конечное малое множество, Topic с шаблонами `*`/`#` избыточен.

## Цель за 3 часа

На выходе три новых документа в архитектурном слое + правки двух индексов + удаление одного временного файла + запись в журнале трассировки:

1. **`docs/architecture/adr/adr-008-rabbitmq-notification-dispatch.md`** — ADR с обоснованием выбора RabbitMQ как work queue для рассылки уведомлений в учебном TO-BE. В Decision явно фиксируется:
   - **единственный publisher в RMQ — `Notification Service`**, выступающий Kafka-consumer'ом (закрывает антипаттерн «прямая публикация в RMQ из Booking/Payment»);
   - **топология exchanges/queues** — Direct Exchange `notification.direct` (3 routing keys по каналам) + Fanout Exchange `notification.dlx` (DLX для сбойных сообщений);
   - **отдельная очередь на канал** — `notification.sms`, `notification.email`, `notification.push` (закрывает антипаттерн «один queue на все каналы»);
   - **обязательный DLX** на каждой основной очереди через `x-dead-letter-exchange` (закрывает антипаттерн «очередь без DLX»);
   - **manual ack** на воркерах — `ack` после успешной отправки, `nack` (requeue=false) → DLX (закрывает антипаттерн «auto-ack без ручной обработки»);
   - **RMQ — не event log** — replay только через Kafka-топик из ADR-007 (закрывает антипаттерн «RMQ как event log»);
   - **Push — P1 (через БД)** — Push Worker пишет в `notification.push_inbox`, PWA забирает через существующий REST API; никаких новых realtime-компонентов.

2. **`docs/architecture/integration/message-flow-rabbitmq-notification.md`** — DFD конвейера потоков данных RMQ в **Mermaid** (а не JPG draw.io как в Kafka-документе — пользователь будет рисовать draw.io по Mermaid отдельно), на двух уровнях:
   - **R-L1** — обзорная диаграмма с RabbitMQ одним оранжевым блоком в центре. Видны Kafka-источник (`Topic_BookingCreated`, `Topic_BookingConfirmed`), `Notification Service` как единственный publisher в RMQ, три воркера (SMS/Email/Push), БД Уведомлений (схема `notification_*` с таблицами `notification_templates`, `notification_history`, `push_inbox`), внешние провайдеры (SMS-сервис, почтовый сервис) и адаптер `Notification Adapter` между воркерами и внешними системами.
   - **R-L2** — детализация: вместо одного блока RabbitMQ — конкретные exchanges и queues (`notification.direct` с тремя routing keys, `notification.dlx` с одной DLQ). На обоих уровнях DLX и DLQ показаны явно.
   - Префикс `R-` намеренно симметричен `K-` из Kafka-документа.
   - **Палитра и стиль — по образцу [K-L1.jpg](../docs/architecture/integration/assets/k-l1.jpg) и [K-L2.jpg](../docs/architecture/integration/assets/k-l2.jpg)**: C4-стилизованные боксы (`[Component]`, `[Software System]`, описания), легенда сверху, синий — Component, фиолетовый — Adapter, темно-серый — External System, серый dashed — БД, оранжевый — RMQ Exchange, светло-оранжевый — Queue, темно-оранжевый/красный — DLX/DLQ. CDC в R-документе нет (его не было в Kafka-консьюминге у Notification Service). В Mermaid палитра задается через `classDef`, чтобы пользователь мог 1:1 перерисовать в draw.io.

3. **`docs/architecture/integration/rabbitmq-requirements.md`** — таблица требований по формату [requirements-template.jpg](rbq/requirements-template.jpg): **Обменник | Тип | Назначение | Очередь** (Название | Назначение | Параметры | Привязка). По одной строке на каждое сочетание exchange × queue: 3 строки для `notification.direct` (sms/email/push) + 1 строка для `notification.dlx`. В столбце «Параметры» — `durable`, `x-dead-letter-exchange`, `x-message-ttl`, `x-max-length`. В столбце «Привязка» — routing key и тип binding'а.

4. Обновить **`docs/architecture/integration/readme.md`** (раздел «Текущие материалы» — добавить ссылки на новые DFD и требования RMQ) и **`docs/architecture/adr/readme.md`** (добавить ссылку на ADR-008). Индекс `docs/specs/integration/readme.md` **не трогаем** — учебный TO-BE живет только в архитектурном слое (правило 3 из CLAUDE.md).

5. **Удалить `docs/architecture/integration/notes-rabbitmq-candidates.md`** — содержимое перенести в ADR-008 (Context + Options + альтернативы из «Кандидатов»). Это явно запланировано в шапке самого notes-файла: «При оформлении ADR-008 — перенести содержимое туда, этот файл удалить».

6. Запись **`CHG-20260501-NNN`** в [docs/process/traceability-matrix-log.md](../docs/process/traceability-matrix-log.md) (на момент написания плана последний занятый — `CHG-20260401-010`, на 2026-05-01 записей пока нет, ожидаемо `001` — но перед коммитом сверить с актуальным журналом, могла зайти параллельная сессия).

> **Принцип ссылок:** новые артефакты в `docs/architecture/...` **не ссылаются на `plans/`** — `plans/` это рабочие черновики, могут быть удалены или реорганизованы, и `docs/` поедет битыми ссылками. JPG-референсы курса остаются в `plans/rbq/` — на них ссылается только этот план. Папку `plans/rbq/` **не переименовываем**.

## Scope

**Входит:**

- Сквозной поток рассылки уведомлений: Kafka-топик (`Topic_BookingCreated` или `Topic_BookingConfirmed`) → `Notification Service` (Kafka-consumer) → публикация команды в `notification.direct` с routing key по каналу → одна из трех очередей → воркер канала → доставка.
- **Источник триггеров** — два Kafka-топика из ADR-007: `Topic_BookingCreated` («бронь принята к оплате») и `Topic_BookingConfirmed` («бронь подтверждена»). `Topic_PaymentCompleted` Notification напрямую не слушает — оно не идет клиенту как уведомление в текущем учебном scope (Booking сам пошлет `BookingConfirmed` после оплаты).
- **Три канала доставки**:
  - **SMS** — внешний провайдер (через `Notification Adapter`).
  - **Email** — внешний почтовый провайдер (через тот же `Notification Adapter`).
  - **Push** — **внутренний канал (P1)**: Push Worker пишет в таблицу `notification.push_inbox` (новая таблица в существующей schema `notification_*`), PWA забирает через существующий backend REST API. Никакого realtime-gateway / WebSocket / FCM / APNs в текущем учебном scope.
- **Топология RMQ:**
  - **`notification.direct`** (Direct Exchange) — единственный обменник для команд на доставку. Три binding'а: routing key `sms` → `notification.sms`, `email` → `notification.email`, `push` → `notification.push`.
  - **`notification.dlx`** (Fanout Exchange) — Dead Letter Exchange. Один binding на одну `notification.dlq` — broadcast всех `nack`'нутых сообщений в DLQ для ручного разбора.
  - **Параметры основных очередей** (`notification.sms`, `notification.email`, `notification.push`): `durable: true`, `x-dead-letter-exchange: notification.dlx`, `x-message-ttl: 300000` (5 мин — защита от застревания), `x-max-length: 10000` (защита от переполнения). `x-max-priority` **не используется** — priority queue в RMQ требует publisher'а, выставляющего `priority` в свойствах сообщения; учебный scope не моделирует «два класса нотификаций», заявить параметр без работающей логики — путаница. Если бизнес потребует приоритетов — отдельный ADR-009.
  - **Параметры DLQ** (`notification.dlq`): `durable: true`, без TTL и без обратного DLX (терминальная очередь).
- Антипаттерны, явно отсеченные в Decision ADR-008 (5 штук): RMQ как event log, очередь без DLX, один queue на все каналы, прямая публикация в RMQ из Booking/Payment, auto-ack без ручной обработки.
- Учебный TO-BE с **явным списком расхождений с [ADR-003](../docs/architecture/adr/adr-003-modular-monolith.md)** в Status ADR-008 — расхождение **одно**: схема `notification_*` обогащается новой таблицей `push_inbox`. Outbox для RMQ **не вводим** (см. пункт G решений ниже): Notification Service публикует в RMQ напрямую после успешной обработки Kafka-сообщения, потому что dual-write риски в этом узле допустимы — Kafka-consumer commit'ит offset только после публикации в RMQ, при сбое Kafka переиграет сообщение, на воркере ловится дедупликация по `notificationId`.
- Декомпозиция DFD на два уровня — **R-L1** (RMQ одним блоком) и **R-L2** (exchanges + queues) с префиксом `R-`, симметричным `K-` из Kafka-документа.
- Балансировочная таблица «события Kafka → команды RMQ → каналы доставки», основанная на разделе «Матрица каналов» этого плана и аналогичная балансировке UC-12.2/UC-10.2 в Kafka-DFD.

**Не входит:**

- Реализация realtime-канала Push (WebSocket / SSE / FCM / APNs) — out of scope, P1 через БД достаточно для учебного TO-BE; при появлении реальной потребности — отдельный ADR-009.
- ЭДО/1С dispatch (Кандидат 2 из notes), СКУД CMD-канал (Кандидат 4), background jobs (Кандидат 5) — упоминаются в ADR-008 Options как отброшенные альтернативы, но в DFD и требования не входят.
- Admin command queue (Кандидат 3) — out of scope.
- Replay через RMQ — заведомо невозможен (после ack сообщение удалено), это часть антипаттерна #1; replay возможен только через Kafka-топик из ADR-007.
- Outbox-таблица в `notification_*` для RMQ-публикаций — не вводим (см. пункт G).
- Конкретный инструмент realtime-уведомлений — упоминается как пример (FCM/APNs), не проектируется.
- Правка [ADR-003](../docs/architecture/adr/adr-003-modular-monolith.md) — не нужна (единственное расхождение — новая таблица `push_inbox`, что не нарушает ни одного инварианта).
- Правка [ADR-007](../docs/architecture/adr/adr-007-kafka-event-bus-online-booking.md) — не нужна, ADR-008 на него ссылается, но не меняет Kafka-цепочку.
- Правка FR/NFR/INT-\* в [docs/specs/](../docs/specs/) — источники истины не меняем.
- HA-кластер RMQ, schema validation сообщений, мониторинг очередей — упоминаются в Next steps ADR-008, не проектируются.

## Решения по открытым вопросам

> Подтверждено пользователем 2026-05-01 (по результатам диалога 2026-05-01 в текущей сессии).

A. **Архитектурная позиция RMQ — Кандидат 1** (содержимое временного `notes-rabbitmq-candidates.md` переносится в Context ADR-008, сам файл удаляется в Фазе 5): work queue команд внутри Notification bounded context, как продолжение Kafka-конвейера из [ADR-007](../docs/architecture/adr/adr-007-kafka-event-bus-online-booking.md). Не делаем полную альтернативу Kafka на той же сквозной цепочке — это дублировало бы ADR-007 без новой педагогической ценности.

B. **Каналы доставки** — три: SMS (внешний провайдер), Email (внешний почтовый провайдер), Push (внутренний, P1). Имена очередей — `notification.sms`, `notification.email`, `notification.push`, `notification.dlq`. Имена exchanges — `notification.direct`, `notification.dlx`. Routing keys — `sms`, `email`, `push`.

C. **Push — P1 (через БД).** Push Worker делает INSERT в `notification.push_inbox` (новая таблица в существующей schema `notification_*`). PWA забирает push через существующий backend REST API. На R-L1/R-L2 Push Worker → БД Уведомлений (dashed сине-фиолетовая стрелка по легенде K-L1), PWA не рисуется (out of scope DFD конвейера). Альтернативы P2 (realtime-gateway / WebSocket) и P3 (FCM/APNs) отброшены — расширяют scope DFD на отдельный архитектурный блок без выгоды для темы RMQ.

D. **Структура exchanges/queues — 3c (Direct + DLX Fanout).**

- Основной обменник `notification.direct` (Direct Exchange) с тремя binding'ами по routing key каналов. Маршрутизация на стороне брокера — каждый воркер получает только свое.
- DLX `notification.dlx` (Fanout Exchange) с одной `notification.dlq`. Fanout выбран намеренно: педагогически на одной диаграмме показываем оба распространенных типа exchange (Direct + Fanout).
- **Topic Exchange намеренно не используется** — у нас 3 канала и 2 типа событий, конечное малое множество routing keys. По прямой рекомендации курса (rabbitmq-часть-2): «если конечное множество — Direct или Fanout 1:1; Topic — когда стремится к бесконечности». Topic в нашем случае — сложность ради сложности.
- **Headers Exchange** — не используется, в материалах курса упомянут как опциональный, для учебного scope избыточен.

E. **Антипаттерны в Decision ADR-008 (5 штук):**

1. **«RMQ как event log»** — нет, replay только через Kafka-топик. Источник: курс выделяет различия Kafka (log) vs RMQ (work queue) как фундаментальные.
2. **«Очередь без DLX»** — нет, обязателен `x-dead-letter-exchange` на каждой основной очереди. Источник: rabbitmq-часть-3, прямо описан параметр.
3. **«Один queue на все каналы»** — нет, отдельная очередь на канал (иначе сериализация: медленный SMS-провайдер тормозит Push, разные prefetch и retry-стратегии невозможны).
4. **«Прямая публикация в RMQ из Booking/Payment»** — нет, единственный publisher в RMQ — `Notification Service` (Kafka-consumer). Закрывает архитектурный инвариант «Kafka между контекстами, RMQ внутри» и связку с ADR-007.
5. **«Auto-ack без ручной обработки»** — нет, manual ack: `ack` после успешной отправки провайдеру, `nack` (requeue=false) → DLX при ошибке. Auto-ack теряет сообщение при сбое воркера. Источник: курс выделяет Acknowledgements в отдельный понятийный блок.

F. **Формат диаграмм — Mermaid** (не JPG draw.io, как в Kafka-документе). Пользователь будет рисовать draw.io по Mermaid отдельно. Палитра, легенда, типы боксов и стрелок — **по образцу [K-L1.jpg](../docs/architecture/integration/assets/k-l1.jpg) и [K-L2.jpg](../docs/architecture/integration/assets/k-l2.jpg)**, чтобы draw.io получился в едином стиле с Kafka-диаграммами. C4-стилизованные боксы (`[Component]`, `[Software System]`, краткое описание под именем), палитра задается через Mermaid `classDef`. CDC в R-документе **отсутствует** — `Notification Service` потребляет Kafka напрямую, без outbox/CDC у себя.

G. **Outbox для RMQ-публикаций — не вводим. Замена — детерминированный `notificationId` + двухэтапная дедупликация.**

`Notification Service` публикует в RMQ **напрямую** после успешной обработки Kafka-сообщения. Дисциплина — Kafka offset commit'ится **только после успешного `basic.publish` в RMQ** (publisher confirms: `confirm.select` + ожидание `confirm.deliver`).

**`notificationId` — детерминированный**: `uuid_v5(eventId, channel)`, где `eventId` — id Kafka-сообщения, `channel ∈ {sms,email,push}`. Любой ретрай Kafka дает **тот же** `notificationId` для той же пары «событие × канал». UUID v7 не годится — он не детерминирован, при ретрае получится другой id, и дедупликация не сработает.

**Этап 1, дедупликация на входе Notification Service** (Kafka-consumer, до публикации в RMQ): `INSERT INTO notification.notification_history (notification_id, channel, status, …) VALUES (…, 'queued', …) ON CONFLICT (notification_id) DO NOTHING`. Если `0 rows` — это ретрай Kafka, **не публикуем в RMQ**, сразу commit offset. Уникальный индекс — по `notification_id`.

**Этап 2, дедупликация на воркере** (перед `provider.send`): `UPDATE notification_history SET status='sent', sent_at=now() WHERE notification_id=$1 AND status IN ('queued','failed') RETURNING id`. Если `0 rows` — дубль из RMQ (например, повторная доставка после потерянного `ack`), `ack` без отправки. Если строка есть — отправляем; ошибка → `status='failed'` + `nack(requeue=false)` → DLX.

**Почему без outbox ок.** В Kafka-цепочке ADR-007 outbox был обязателен, потому что producer'ом был бизнес-модуль с собственными бизнес-данными — dual-write «бизнес-данные + outbox-событие» закрывался одной локальной транзакцией. Здесь у `Notification Service` нет бизнес-данных, кроме записи об отправке уведомления; at-least-once Kafka + детерминированный id + двухэтапная дедупликация дают **at-least-once на брокерах + exactly-once-effect на провайдере** — эквивалент гарантии outbox+inbox для этого узла. Этот выбор фиксируется в Decision ADR-008 явно — иначе ADR не отвечает на «а почему здесь без outbox, если в ADR-007 был».

## Матрица каналов

Рабочая матрица «Kafka-событие → канал доставки → routing key» для учебного TO-BE. Используется в DFD R-L1 (стрелки от `Notification Service` к `notification.direct`) и в балансировочной таблице DFD.

| Kafka-событие            | Канал | Routing key | Что отправляем                                                |
| ------------------------ | ----- | ----------- | ------------------------------------------------------------- |
| `Topic_BookingCreated`   | SMS   | `sms`       | OTP подтверждения телефона + напоминание оплатить бронь       |
| `Topic_BookingCreated`   | Email | `email`     | детали брони + ссылка на оплату                               |
| `Topic_BookingConfirmed` | SMS   | `sms`       | короткое подтверждение «бронь подтверждена»                   |
| `Topic_BookingConfirmed` | Email | `email`     | квитанция и детали оплаченной брони                           |
| `Topic_BookingConfirmed` | Push  | `push`      | in-app уведомление в PWA (запись в `notification.push_inbox`) |

Итого **5 публикаций в `notification.direct` на бизнес-цикл бронирования**: 2 на `BookingCreated` (без Push — пользователь может еще не быть в PWA до подтверждения оплаты) и 3 на `BookingConfirmed`.

`notificationId = uuid_v5(eventId, channel)` — детерминированный, по одному id на каждую строку матрицы для конкретного события (см. Решения, пункт G).

Матрица — рабочее предположение учебного TO-BE. Если в `docs/specs/` существуют FR-формулировки про каналы оповещения — Фаза 1 ссылается на них в Context ADR-008; если нет — оставляем матрицу здесь как договоренность и отмечаем в Open questions ADR-008.

## Тайминг

| Минуты  | Блок                                        | Что делаем                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0–10    | Подготовка                                  | Заготовки трех новых файлов с frontmatter и оглавлениями. Сверка свободного `CHG-20260501-NNN` с актуальным журналом трассировки.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 10–55   | ADR-008                                     | Status (с пометкой «учебный TO-BE» + расхождение с ADR-003 — одна новая таблица `push_inbox`), Context (UC-12.2 + UC-10.2 + ADR-003 + ADR-007 + перенос содержимого notes-rabbitmq-candidates.md), Options (синхронные in-process вызовы / Kafka-only / RMQ внутри Notification контекста), Decision (фиксация всех 5 антипаттернов + выбор топологии 3c + Push P1 + отсутствие outbox с обоснованием), Rationale, Trade-offs, Consequences, Next steps.                                                                                                                                                                |
| 55–120  | DFD `message-flow-rabbitmq-notification.md` | Mermaid **R-L1** (RMQ одним оранжевым блоком, Kafka-источник, Notification Service, три воркера, БД, внешние провайдеры) + Mermaid **R-L2** (Direct Exchange `notification.direct` с тремя routing keys + Fanout DLX `notification.dlx` с DLQ). `classDef` по палитре K-L1/K-L2. Легенда (Mermaid subgraph «Легенда» в правом верхнем углу). Словарь потоков для каждого уровня. Текстовое описание сценария (по шагам). Балансировочная таблица «событие Kafka → команда RMQ → канал → доставка» — заполняется по разделу «Матрица каналов» этого плана. Примечание про схему `notification_*` и таблицу `push_inbox`. |
| 120–155 | `rabbitmq-requirements.md`                  | Таблица по формату [requirements-template.jpg](rbq/requirements-template.jpg) — **в самом файле ссылок на `plans/` нет**, JPG используется только как образец формата при написании. 4 строки: 3 для `notification.direct` × {sms, email, push} + 1 для `notification.dlx` → `notification.dlq`. Перед таблицей — раздел «Как читать» (пояснение про Direct vs Fanout DLX, manual ack, x-dead-letter-exchange, x-message-ttl). После таблицы — раздел «Параметры детально» (расшифровка каждого `x-*` аргумента с примерами значений + дедупликация на consumer'е по `notificationId`).                                 |
| 155–170 | Индексы и журнал                            | Обновить `docs/architecture/integration/readme.md` (раздел «Текущие материалы», убрать `notes-rabbitmq-candidates.md` если он там был, добавить три новые ссылки). Обновить `docs/architecture/adr/readme.md` (добавить ADR-008). Удалить `docs/architecture/integration/notes-rabbitmq-candidates.md` (содержимое уже перенесено в ADR-008). Добавить запись `CHG-20260501-NNN` в `docs/process/traceability-matrix-log.md`.                                                                                                                                                                                           |
| 170–180 | CI и ретро                                  | `npm run ci:check` (особое внимание `lint:mermaid` для двух Mermaid-диаграмм; `lint:md-links` после удаления notes-файла — все markdown-ссылки на него уже зачищены в Фазах 1/5). Фикс линтеров. Ретро в `docs/process/retro/2026-05-01-rabbitmq-pipeline-notification.md`. Уведомить пользователя о готовности к коммиту через `npm run commit:atomic`.                                                                                                                                                                                                                                                                |

## Правила коммитов и веток

- **Ветка** — `docs/dfd-rmq` (уже создана пользователем, на ней работаем).
- **Не коммитим без явной просьбы пользователя.**
- При коммите — `npm run commit:atomic` (атомарные коммиты по смысловым группам файлов; для предпросмотра — `npm run commit:atomic:dry-run`).
- Conventional Commits: `docs(architecture): ...` для ADR-008 и DFD, `docs(architecture): ...` для требований RMQ, `docs(process): ...` для журнала трассировки и ретро.

## Определение «готово»

- [ ] `adr-008-rabbitmq-notification-dispatch.md` создан, структура аналогична ADR-005/006/007 (Status, Context, Options, Decision, Rationale, Trade-offs, Consequences, Next steps). В Status — пометка «учебный TO-BE» и явное расхождение с ADR-003 (одна новая таблица `push_inbox` в существующей schema `notification_*`).
- [ ] В разделе Decision ADR-008 явно зафиксированы все 5 антипаттерн-решений: (1) RMQ не event log, replay через Kafka; (2) DLX обязателен на каждой основной очереди; (3) отдельная очередь на канал; (4) единственный publisher в RMQ — Notification Service; (5) manual ack, не auto-ack.
- [ ] В Decision ADR-008 явно зафиксирован выбор Push P1 (через БД, без realtime-gateway) с обоснованием почему не P2/P3.
- [ ] В Decision ADR-008 явно зафиксировано **отсутствие outbox** для RMQ-публикаций с обоснованием через at-least-once Kafka + дедупликация на consumer'е (пункт G решений) — иначе ADR не отвечает на «почему здесь без outbox, если в ADR-007 был».
- [ ] `message-flow-rabbitmq-notification.md` содержит DFD двух уровней: **R-L1** (RMQ одним оранжевым блоком) и **R-L2** (`notification.direct` с тремя routing keys + `notification.dlx` с DLQ), валидные Mermaid-диаграммы (`lint:mermaid` зеленый), словарь потоков для каждого уровня, балансировочная таблица «Kafka-событие → RMQ-команда → канал». Префикс `R-` обязателен — симметрия с `K-` из Kafka-документа.
- [ ] Mermaid-палитра R-L1/R-L2 воспроизводит палитру [K-L1.jpg](../docs/architecture/integration/assets/k-l1.jpg) и [K-L2.jpg](../docs/architecture/integration/assets/k-l2.jpg): синий — Component, фиолетовый — Adapter, темно-серый — External System, серый dashed — БД, оранжевый — RMQ Exchange, светло-оранжевый — Queue, темно-оранжевый/красный — DLX/DLQ. Mermaid `classDef` оформлен так, чтобы пользователь мог 1:1 перерисовать в draw.io.
- [ ] Легенда в Mermaid (subgraph) содержит все 5 типов боксов (Компонент / Адаптер / Внешняя система / RMQ Exchange / RMQ Queue) + типы стрелок. **CDC в легенде нет** — его нет в RMQ-цепочке.
- [ ] `rabbitmq-requirements.md` содержит таблицу по формату [requirements-template.jpg](rbq/requirements-template.jpg) — 4 строки (3 для `notification.direct` + 1 для `notification.dlx`). В столбце «Параметры» расписаны все используемые `x-*` аргументы (`durable`, `x-dead-letter-exchange`, `x-message-ttl`, `x-max-length`) с конкретными значениями. `x-max-priority` **не указан** (см. Scope). В столбце «Привязка» — routing key и тип binding'а.
- [ ] `docs/architecture/integration/notes-rabbitmq-candidates.md` удален, содержимое перенесено в ADR-008 (Context + Options + перечисление отброшенных кандидатов). **Markdown-ссылки на этот файл из самого плана и из других .md зачищены до удаления** — иначе `lint:md-links` упадет.
- [ ] В новых артефактах (`adr-008-...md`, `message-flow-rabbitmq-notification.md`, `rabbitmq-requirements.md`) **нет ссылок на `plans/`** — JPG-референсы курса остаются только в этом плане.
- [ ] Индекс [docs/architecture/integration/readme.md](../docs/architecture/integration/readme.md) обновлен (3 новых ссылки + удалена ссылка на notes-файл, если была). Индекс [docs/architecture/adr/readme.md](../docs/architecture/adr/readme.md) обновлен (добавлен ADR-008). Индекс `docs/specs/integration/readme.md` **не трогаем**.
- [ ] В `docs/process/traceability-matrix-log.md` добавлена запись `CHG-20260501-NNN` (NNN определяется на Фазе 0 сверкой с актуальным журналом — параллельные сессии могли занять `001`).
- [ ] `npm run ci:check` проходит зеленым (markdownlint, lint:md-links, lint:file-names, lint:mermaid, prettier, check:plans, build).
- [ ] Все имена файлов — латиница kebab-case.
- [ ] В тексте не используется буква «е с двумя точками» (договоренность проекта).
- [ ] Ретро в `docs/process/retro/2026-05-01-rabbitmq-pipeline-notification.md` написано (правило 6 CLAUDE.md).
- [ ] Пользователь уведомлен о готовности к коммиту через `npm run commit:atomic`.
- [ ] Перед коммитом — предложить пользователю запустить `mcp__markdown_rag__index_documents` (хук SessionStart предупреждает об устаревшем индексе на 29 файлов).

## Фазы и статус

- [x] Фаза 0. Заготовки трех новых файлов с frontmatter и оглавлениями. Сверка свободного `CHG-20260501-NNN` с актуальным журналом трассировки.
- [x] Фаза 1. ADR-008 — Status (учебный TO-BE + одно расхождение с ADR-003), Context (склейка с ADR-007 + перенос содержимого notes-rabbitmq-candidates.md), Options (in-process / Kafka-only / RMQ внутри Notification), Decision с 5 антипаттернами + Push P1 + отсутствие outbox по пункту G.
- [x] Фаза 2. ADR-008 — Rationale, Trade-offs, Consequences, Next steps.
- [x] Фаза 3. DFD конвейера: Mermaid **R-L1** (RMQ одним блоком) + Mermaid **R-L2** (Direct + DLX Fanout) + легенда + словарь потоков для каждого уровня + текстовое описание сценария + балансировочная таблица.
- [x] Фаза 4. Требования к RMQ: таблица по формату телемед-референса (4 строки) + раздел «Как читать» + раздел «Параметры детально».
- [x] Фаза 5. Обновление [docs/architecture/integration/readme.md](../docs/architecture/integration/readme.md) и [docs/architecture/adr/readme.md](../docs/architecture/adr/readme.md). Удаление `notes-rabbitmq-candidates.md`.
- [x] Фаза 6. Запись `CHG-20260501-001` в журнал трассировки.
- [x] Фаза 7. `npm run ci:check` зеленый (включая `lint:mermaid` для двух Mermaid-диаграмм).
- [x] Фаза 8. Ретроспектива в [docs/process/retro/2026-05-01-rabbitmq-pipeline-notification.md](../docs/process/retro/2026-05-01-rabbitmq-pipeline-notification.md). Уведомление пользователя про `npm run commit:atomic` — после ретро.

## Открытые вопросы

- **Дедупликация — закрыт пунктом G.** `notificationId = uuid_v5(eventId, channel)` (детерминированный), уникальный индекс в `notification.notification_history`, двухэтапная дедупликация (на входе Notification Service + на воркере перед `provider.send`). В требованиях RMQ это упоминается в разделе «Параметры детально» как «дедупликация на consumer'е», полная логика — в Decision ADR-008.
- **TTL основных очередей** — 5 мин (`x-message-ttl: 300000`). Обоснование: если воркер не успел отправить уведомление за 5 мин, провайдер скорее всего недоступен, дальше держать сообщение бессмысленно — пусть уходит в DLX для разбора. Можно поднять до 15 мин для email (где провайдеры стабильнее), но в учебном scope унифицируем на 5 мин для всех каналов.

## Связанные документы

- [ADR-007: Kafka event bus для онлайн-бронирования](../docs/architecture/adr/adr-007-kafka-event-bus-online-booking.md) — каноничный архитектурный TO-BE по Kafka, на который опирается ADR-008. В [Next steps ADR-007](../docs/architecture/adr/adr-007-kafka-event-bus-online-booking.md#next-steps) обещан ADR-008 после практического опыта с Kafka — этот план реализует обещание.
- [DFD K-L1 / K-L2 — Kafka-конвейер онлайн-бронирования](../docs/architecture/integration/message-flow-kafka-online-booking.md) — формат, палитра и стиль легенды, по которому делаются R-L1 / R-L2.
- [Требования к Kafka](../docs/architecture/integration/kafka-requirements.md) — структурный аналог `rabbitmq-requirements.md` (таблица + пояснения).
- Заметки кандидатов RabbitMQ — временный документ `docs/architecture/integration/notes-rabbitmq-candidates.md`. Фаза 1 переносит содержимое в Context ADR-008, Фаза 5 удаляет файл. Markdown-ссылка на него убрана преднамеренно — после Фазы 5 ссылка стала бы битой и `lint:md-links` упал.
- [ADR-003: Модульный монолит](../docs/architecture/adr/adr-003-modular-monolith.md) — каноничное решение по единой PostgreSQL и schema-изоляции, относительно которого фиксируется единственное расхождение (новая таблица `push_inbox`).
- [Курс — раздел 16 «Брокеры сообщений»](../../systems-analyst-db/content/16-message-brokers/) — источник теории. В частности [rabbitmq.md](../../systems-analyst-db/content/16-message-brokers/rabbitmq.md), [rabbitmq-часть-2-разбираемся-с-exchanges.md](../../systems-analyst-db/references/rabbitmq-часть-2-разбираемся-с-exchanges.md), [rabbitmq-часть-3-разбираемся-с-queues-и-bindings.md](../../systems-analyst-db/references/rabbitmq-часть-3-разбираемся-с-queues-и-bindings.md). Прямая рекомендация курса по выбору Direct (а не Topic) для конечного множества routing keys взята из rabbitmq-часть-2 (раздел «Заключение»).
- [Референсы телемед-примера для RMQ](rbq/) — JPG-скриншоты DFD (уровень 1 + уровень 2) и формата таблицы требований из материалов курса. Используются как образец формата только в этом плане; в новых артефактах ссылок на них нет.
- [Регламент трассировки](../docs/process/traceability-matrix.md) — правила обновления журнала.
- [Регламент ретроспектив](../docs/process/retro/README.md) — формат ретро по плану (правило 6 CLAUDE.md).

## Итог

Все 8 фаз закрыты, `npm run ci:check` зеленый. Создано три артефакта в `docs/architecture/`:

- [adr-008-rabbitmq-notification-dispatch.md](../docs/architecture/adr/adr-008-rabbitmq-notification-dispatch.md) — Status «Accepted (учебный TO-BE)» с одним расхождением с ADR-003 (новая таблица `push_inbox`); Decision с восемью инвариантами, явно отброшенными пятью антипаттернами и обоснованием отсутствия outbox через детерминированный `notificationId = uuid_v5(eventId, channel)` и двухэтапную дедупликацию.
- [message-flow-rabbitmq-notification.md](../docs/architecture/integration/message-flow-rabbitmq-notification.md) — два Mermaid-блока (R-L1 одним блоком RMQ + R-L2 с `notification.direct` Direct и `notification.dlx` Fanout), словари потоков, балансировочная таблица из 5 строк по матрице каналов, classDef воспроизводит палитру K-L1/K-L2.
- [rabbitmq-requirements.md](../docs/architecture/integration/rabbitmq-requirements.md) — таблица 4 строки × 7 колонок (3 для `notification.direct` × {sms, email, push} + 1 для `notification.dlx` → `notification.dlq`), раздел «Параметры детально» с расшифровкой `durable`, `x-dead-letter-exchange`, `x-message-ttl`, `x-max-length`, дедупликации и обоснованием отсутствия `x-max-priority`.

Обновлены индексы [docs/architecture/integration/readme.md](../docs/architecture/integration/readme.md), [docs/architecture/adr/readme.md](../docs/architecture/adr/readme.md), запись о RabbitMQ-черновиках в [docs/process/project-journey.md](../docs/process/project-journey.md). Удален временный документ `notes-rabbitmq-candidates.md`. В [docs/process/traceability-matrix-log.md](../docs/process/traceability-matrix-log.md) добавлена запись `CHG-20260501-001`. Ретроспектива — в [docs/process/retro/2026-05-01-rabbitmq-pipeline-notification.md](../docs/process/retro/2026-05-01-rabbitmq-pipeline-notification.md).

Все решения по открытым вопросам (A-G) попали в Decision ADR-008 без изменений. Открытых вопросов не осталось. Приоритеты сообщений (`x-max-priority`) и реальный realtime Push (P2/P3) явно вынесены в Next steps как потенциальный ADR-009.

Оркестрация — три параллельных подагента на Фазах 1-2 / 3 / 4 поверх единого блока «Контракт» с зашитыми именами exchanges/queues/routing keys, формулировками антипаттернов и SQL дедупликации. Третий подагент (требования RMQ) упал на ложном срабатывании политики использования API; файл написан вручную по образцу `kafka-requirements.md` без потери качества.
