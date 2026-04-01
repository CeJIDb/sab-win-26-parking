# ERD — разделение на диаграммы DrawSQL

**Дата:** 2026-03-31
**Полный ERD:** [`docs/artifacts/erd-work/temp-normalized-er-model.md`](temp-normalized-er-model.md)
**Ограничение DrawSQL:** не более 15 таблиц на диаграмму (бесплатный тариф)

## Table of Contents

- [Принцип разбиения](#принцип-разбиения)
- [Диаграмма 1 — Парковочный продукт](#диаграмма-1--парковочный-продукт)
- [Диаграмма 2 — Кто пользуется](#диаграмма-2--кто-пользуется)
- [Диаграмма 3 — Вспомогательные сервисы](#диаграмма-3--вспомогательные-сервисы)
- [Связанные документы](#связанные-документы)

---

## Принцип разбиения

Разбиение основано на DDD bounded contexts (`docs/architecture/ddd/ddd-bounded-contexts.md`).

Core-контексты (`Бронирование`, `Сессия`, `Тариф`) содержат всего 4 таблицы — они несут доменную логику, а не данные. Размещать их отдельно нет смысла. Вместо деления по типу Core/Supporting используется деление по **семантической цепочке ответственности**:

| # | Название | Вопрос | Таблиц |
| - | -------- | ------ | ------ |
| 1 | Парковочный продукт | Что продаем и как это работает | 13 |
| 2 | Кто пользуется | Кто покупает | 13 |
| 3 | Вспомогательные сервисы | Как обслуживаем | 11 |

**Кросс-контекстные ссылки** (FK без `REFERENCES` в физической схеме) обозначены в каждом разделе. В DrawSQL они **не рисуются стрелками** — документируются в **Table Notes** целевой таблицы.

---

## Диаграмма 1 — Парковочный продукт

Физическая инфраструктура + тарифы + ядро операций (бронирование и сессия).
Цепочка: `Площадка → Тариф → Бронирование → Сессия`.

**Состав (13 таблиц)**

| Схема | Таблица | DDD-контекст | Тип |
| ----- | ------- | ----------- | --- |
| `facility` | `PARKING` | Площадка | Supporting |
| `facility` | `PARKING_SCHEDULE` | Площадка | Supporting |
| `facility` | `SECTOR` | Площадка | Supporting |
| `facility` | `ZONE_TYPE` | Площадка | Supporting |
| `facility` | `VEHICLE_TYPE` | Площадка | Supporting |
| `facility` | `ZONE_TYPE_VEHICLE_TYPE` | Площадка | Supporting |
| `facility` | `ZONE_TYPE_TARIFF` | Площадка | Supporting |
| `facility` | `PARKING_PLACE` | Площадка | Supporting |
| `facility` | `KPP` | Площадка | Supporting |
| `tariff` | `TARIFF` | Тариф | Core |
| `tariff` | `TARIFF_RATE` | Тариф | Core |
| `booking` | `BOOKING` | Бронирование | Core |
| `session` | `PARKING_SESSION` | Сессия | Core |

**Mermaid-диаграмма**

```mermaid
erDiagram
    PARKING ||--o{ PARKING_SCHEDULE : has
    PARKING ||--o{ SECTOR : contains
    PARKING ||--o{ KPP : has

    ZONE_TYPE ||--o{ SECTOR : classifies
    ZONE_TYPE ||--o{ ZONE_TYPE_VEHICLE_TYPE : allows
    VEHICLE_TYPE ||--o{ ZONE_TYPE_VEHICLE_TYPE : allowed_for
    ZONE_TYPE ||--o{ ZONE_TYPE_TARIFF : supports
    TARIFF ||--o{ ZONE_TYPE_TARIFF : applies_to
    TARIFF ||--o{ TARIFF_RATE : has_rates

    SECTOR ||--o{ PARKING_PLACE : contains
    TARIFF ||--o{ PARKING_PLACE : overrides

    PARKING_PLACE ||--o{ BOOKING : reserved_as
    TARIFF ||--o{ BOOKING : priced_by

    BOOKING ||--o{ PARKING_SESSION : results_in
    KPP ||--o{ PARKING_SESSION : entry_exit_for

    PARKING {
        int id PK
        varchar name
        varchar address
        varchar type
        varchar description
        varchar operational_status
        datetime created_at
        datetime updated_at
    }

    PARKING_SCHEDULE {
        int id PK
        int parking_id FK
        smallint day_of_week
        time open_time
        time close_time
        bool is_closed
        date effective_from
        date effective_to
        datetime created_at
        datetime updated_at
    }

    SECTOR {
        int id PK
        int parking_id FK
        int zone_type_id FK
        varchar name
        varchar operational_status
        datetime created_at
        datetime updated_at
    }

    ZONE_TYPE {
        int id PK
        varchar code
        varchar name
        varchar description
        datetime created_at
        datetime updated_at
    }

    VEHICLE_TYPE {
        int id PK
        varchar code
        varchar name
        varchar description
        datetime created_at
        datetime updated_at
    }

    ZONE_TYPE_VEHICLE_TYPE {
        int zone_type_id PK
        int vehicle_type_id PK
    }

    ZONE_TYPE_TARIFF {
        int zone_type_id PK
        int tariff_id PK
    }

    PARKING_PLACE {
        int id PK
        int sector_id FK
        int override_tariff_id
        varchar place_number
        varchar operational_status
        datetime created_at
        datetime updated_at
    }

    KPP {
        int id PK
        int parking_id FK
        varchar name
        varchar type
        varchar direction
        varchar status
        datetime created_at
        datetime updated_at
    }

    TARIFF {
        int id PK
        varchar name
        varchar type
        varchar benefit_category
        varchar billing_step_unit
        int billing_step_value
        decimal max_amount
        int grace_period_minutes
        date effective_from
        date effective_to
        datetime created_at
        datetime updated_at
    }

    TARIFF_RATE {
        int id PK
        int tariff_id FK
        decimal rate
        smallint day_of_week
        time time_from
        time time_to
        int priority
        datetime created_at
        datetime updated_at
    }

    BOOKING {
        bigint id PK
        varchar booking_number
        int vehicle_id
        int parking_place_id FK
        int contract_id
        int tariff_id FK
        datetime start_at
        datetime end_at
        int duration_minutes
        varchar license_plate_snapshot
        varchar type
        varchar status
        decimal amount_due
        datetime created_at
        datetime updated_at
    }

    PARKING_SESSION {
        bigint id PK
        bigint booking_id FK
        int entry_kpp_id FK
        int exit_kpp_id
        int employee_id
        datetime entry_time
        datetime exit_time
        int duration_minutes
        varchar license_plate_snapshot
        varchar access_method
        varchar access_comment
        varchar status
        datetime created_at
        datetime updated_at
    }
```

**Логические FK за пределами диаграммы**

| Поле | Ссылается на | Диаграмма |
| ---- | ----------- | --------- |
| `BOOKING.vehicle_id` | `client.VEHICLE.id` | Диаграмма 2 |
| `BOOKING.contract_id` | `contract.CONTRACT.id` | Диаграмма 3 |
| `PARKING_SESSION.employee_id` | `employee.EMPLOYEE.id` | Диаграмма 3 |

**Table Notes для DrawSQL**

| Таблица | Заметка |
| ------- | ------- |
| `PARKING_SCHEDULE` | `UNIQUE(parking_id, day_of_week, effective_from)` |
| `ZONE_TYPE_VEHICLE_TYPE` | Составной PK: `(zone_type_id, vehicle_type_id)` |
| `ZONE_TYPE_TARIFF` | Составной PK: `(zone_type_id, tariff_id)` |
| `KPP` | `direction CHECK('ENTRY','EXIT','BIDIRECTIONAL')` |
| `TARIFF` | `billing_step_unit CHECK('MINUTE','HOUR','DAY')` |
| `PARKING_PLACE` | `override_tariff_id` — nullable логический FK на `TARIFF` (cross-schema, без REFERENCES) |
| `BOOKING` | `booking_number UNIQUE`; `duration_minutes` nullable (NULL пока бронь открыта); `vehicle_id` и `contract_id` — логические FK (cross-context, без REFERENCES) |
| `PARKING_SESSION` | `duration_minutes GENERATED ALWAYS AS ((EXTRACT(EPOCH FROM exit_time - entry_time)/60)::INTEGER) STORED`; `exit_kpp_id` nullable; `employee_id` — логический FK (cross-context, без REFERENCES) |

---

## Диаграмма 2 — Кто пользуется

Мастер-данные клиента, организации, ТС, PII (персональные данные) и учетные данные (инфраструктурный слой).

**Состав (13 таблиц)**

| Схема | Таблица | DDD-контекст | Тип |
| ----- | ------- | ----------- | --- |
| `client` | `CLIENT` | Клиент | Supporting |
| `client` | `CLIENT_PROFILE` | Клиент | Supporting |
| `client` | `ORGANIZATION` | Клиент | Supporting |
| `client` | `ORGANIZATION_BANK_ACCOUNT` | Клиент | Supporting |
| `client` | `NOTIFICATION_SETTINGS` | Клиент | Supporting |
| `client` | `NOTIFICATION_SETTINGS_CHANNEL` | Клиент | Supporting |
| `client` | `PAYMENT_SETTINGS` | Клиент | Supporting |
| `client` | `VEHICLE` | Клиент | Supporting |
| `client` | `CONSENT` | Клиент | Supporting |
| `auth` | `CLIENT_ACCOUNT` | Инфраструктура | — |
| `auth` | `EMPLOYEE_CREDENTIAL` | Инфраструктура | — |
| `pii` | `PASSPORT_DATA` | Клиент / PII | Supporting |
| `pii` | `BENEFIT_DOCUMENT` | Клиент / PII | Supporting |

**Mermaid-диаграмма**

```mermaid
erDiagram
    CLIENT ||--o| CLIENT_PROFILE : has
    CLIENT |o--o| ORGANIZATION : belongs_to
    CLIENT ||--|| NOTIFICATION_SETTINGS : has
    NOTIFICATION_SETTINGS ||--o{ NOTIFICATION_SETTINGS_CHANNEL : has
    CLIENT ||--|| PAYMENT_SETTINGS : has
    CLIENT ||--o{ CLIENT_ACCOUNT : authenticates
    CLIENT ||--o{ VEHICLE : owns
    CLIENT ||--o{ CONSENT : gives

    ORGANIZATION ||--o{ ORGANIZATION_BANK_ACCOUNT : has

    CLIENT_PROFILE o|--|| PASSPORT_DATA : uses
    CLIENT_PROFILE o|--o| BENEFIT_DOCUMENT : has

    CLIENT {
        int id PK
        varchar type
        varchar phone
        varchar email
        varchar status
        varchar status_reason
        int organization_id
        datetime created_at
        datetime updated_at
    }

    CLIENT_PROFILE {
        int client_id PK
        varchar last_name
        varchar first_name
        varchar middle_name
        int passport_data_id
        int benefit_document_id
        datetime created_at
        datetime updated_at
    }

    ORGANIZATION {
        int id PK
        varchar name
        varchar legal_form
        varchar legal_address
        varchar actual_address
        varchar inn
        varchar kpp
        varchar ogrn
        varchar email
        varchar phone
        varchar status
        datetime created_at
        datetime updated_at
    }

    ORGANIZATION_BANK_ACCOUNT {
        int id PK
        int organization_id FK
        varchar bank_name
        varchar bik
        varchar account_number
        varchar correspondent_account
        bool is_primary
        datetime created_at
        datetime updated_at
    }

    NOTIFICATION_SETTINGS {
        int id PK
        int client_id
        bool parking_session_enabled
        bool booking_enabled
        bool contract_enabled
        bool payment_enabled
        bool marketing_enabled
        datetime created_at
        datetime updated_at
    }

    NOTIFICATION_SETTINGS_CHANNEL {
        int settings_id PK
        varchar channel PK
    }

    PAYMENT_SETTINGS {
        int id PK
        int client_id
        varchar external_payer_id
        bool auto_debit_contract
        bool auto_debit_parking_session
        decimal monthly_limit
        datetime created_at
        datetime updated_at
    }

    VEHICLE {
        int id PK
        int client_id FK
        int vehicle_type_id
        varchar license_plate
        varchar brand
        varchar model
        varchar color
        datetime created_at
        datetime updated_at
    }

    CONSENT {
        bigint id PK
        int client_id FK
        varchar consent_type
        bool consent_given
        datetime given_at
        datetime revoked_at
        datetime created_at
    }

    CLIENT_ACCOUNT {
        bigint id PK
        int client_id FK
        varchar auth_provider
        varchar login
        varchar password_hash
        varchar provider_subject_id
        varchar account_status
        datetime created_at
        datetime last_login_at
    }

    EMPLOYEE_CREDENTIAL {
        int employee_id PK
        varchar login
        varchar password_hash
        varchar totp_secret_encrypted
        varchar account_status
        datetime created_at
        datetime updated_at
    }

    PASSPORT_DATA {
        int id PK
        varchar document_type
        bytea series_and_number
        date issue_date
        varchar issued_by
        varchar department_code
        datetime created_at
        datetime updated_at
    }

    BENEFIT_DOCUMENT {
        int id PK
        varchar benefit_category
        varchar document_type
        varchar document_number
        date issue_date
        date expiry_date
        varchar document_image_ref
        varchar verification_status
        datetime created_at
        datetime updated_at
    }
```

**Логические FK за пределами диаграммы**

| Поле | Ссылается на | Диаграмма |
| ---- | ----------- | --------- |
| `VEHICLE.vehicle_type_id` | `facility.VEHICLE_TYPE.id` | Диаграмма 1 |
| `EMPLOYEE_CREDENTIAL.employee_id` | `employee.EMPLOYEE.id` | Диаграмма 3 |

**Table Notes для DrawSQL**

| Таблица | Заметка |
| ------- | ------- |
| `CLIENT` | `type CHECK('FL','UL')`; `status CHECK('ACTIVE','BLOCKED','PENDING')`; инвариант: при `type='FL'` → `organization_id IS NULL`, при `type='UL'` → `organization_id NOT NULL`; контролируется BEFORE INSERT/UPDATE триггером |
| `CLIENT_PROFILE` | Только для FL; `client_id` = PK и FK на `CLIENT`; `passport_data_id`/`benefit_document_id` — логические FK в схему `pii` (без REFERENCES) |
| `NOTIFICATION_SETTINGS` | `client_id NOT NULL UNIQUE` (FK инвертирован: настройки → клиент) |
| `NOTIFICATION_SETTINGS_CHANNEL` | Составной PK: `(settings_id, channel)`; `channel CHECK('SMS','EMAIL','PUSH')` |
| `PAYMENT_SETTINGS` | `client_id NOT NULL UNIQUE` (FK инвертирован аналогично NOTIFICATION_SETTINGS) |
| `ORGANIZATION` | `inn VARCHAR(12) UNIQUE`; `ogrn VARCHAR(13) UNIQUE` |
| `ORGANIZATION_BANK_ACCOUNT` | `partial UNIQUE(organization_id) WHERE is_primary=true` |
| `VEHICLE` | `license_plate NOT NULL UNIQUE`; `vehicle_type_id` — логический FK (cross-schema, без REFERENCES) |
| `EMPLOYEE_CREDENTIAL` | `employee_id` = PK и логический FK на `employee.EMPLOYEE` (cross-schema, без REFERENCES) |
| `PASSPORT_DATA` | `series_and_number` — тип `BYTEA`, зашифровано (152-ФЗ) |

---

## Диаграмма 3 — Вспомогательные сервисы

Финансы, договоры, персонал, уведомления и поддержка. Первые кандидаты на вынос в отдельные модули.

**Состав (11 таблиц)**

| Схема | Таблица | DDD-контекст | Тип |
| ----- | ------- | ----------- | --- |
| `payment` | `INVOICE` | Платеж | Supporting |
| `payment` | `PAYMENT` | Платеж | Supporting |
| `payment` | `RECEIPT` | Платеж | Supporting |
| `payment` | `REFUND` | Платеж | Supporting |
| `payment` | `DEBT` | Платеж | Supporting |
| `contract` | `CONTRACT_TEMPLATE` | Договор | Supporting |
| `contract` | `CONTRACT` | Договор | Supporting |
| `employee` | `EMPLOYEE` | Сотрудник | Supporting |
| `notification` | `NOTIFICATION_TEMPLATE` | Уведомление | Generic |
| `notification` | `NOTIFICATION` | Уведомление | Generic |
| `support` | `APPEAL` | Обращение | Supporting |

**Mermaid-диаграмма**

```mermaid
erDiagram
    CONTRACT_TEMPLATE ||--o{ CONTRACT : generates

    INVOICE ||--o{ PAYMENT : paid_by
    PAYMENT ||--o| RECEIPT : fiscalized_as
    PAYMENT ||--o{ REFUND : has_refunds
    INVOICE ||--o| DEBT : generates

    NOTIFICATION_TEMPLATE ||--o{ NOTIFICATION : generates
    EMPLOYEE ||--o{ NOTIFICATION : initiates
    EMPLOYEE ||--o{ APPEAL : handles

    CONTRACT_TEMPLATE {
        int id PK
        varchar code
        varchar name
        varchar version
        varchar type
        text body
        date effective_from
        date effective_to
        datetime created_at
        datetime updated_at
    }

    CONTRACT {
        int id PK
        int client_id
        int contract_template_id FK
        varchar contract_number
        date start_date
        date end_date
        varchar status
        varchar document_file_ref
        datetime created_at
        datetime updated_at
    }

    EMPLOYEE {
        int id PK
        varchar role
        varchar last_name
        varchar first_name
        varchar middle_name
        varchar phone
        varchar email
        varchar status
        datetime created_at
        datetime updated_at
    }

    INVOICE {
        bigint id PK
        bigint booking_id
        int contract_id
        varchar invoice_number
        varchar type
        varchar status
        decimal amount_due
        date billing_period_from
        date billing_period_to
        date issued_at
        date due_at
        datetime paid_at
        datetime created_at
        datetime updated_at
    }

    PAYMENT {
        bigint id PK
        bigint invoice_id FK
        decimal amount
        varchar currency
        varchar payment_method
        varchar status
        datetime initiated_at
        datetime completed_at
        varchar provider_id
        datetime created_at
        datetime updated_at
    }

    RECEIPT {
        bigint id PK
        bigint payment_id FK
        varchar fiscal_number
        datetime receipt_at
        varchar fiscal_status
        decimal amount
        datetime created_at
        datetime updated_at
    }

    REFUND {
        bigint id PK
        bigint payment_id FK
        decimal amount
        varchar reason
        varchar refund_provider_id
        varchar status
        datetime initiated_at
        datetime completed_at
        datetime created_at
        datetime updated_at
    }

    DEBT {
        bigint id PK
        bigint invoice_id FK
        int client_id
        decimal amount
        date overdue_since
        varchar status
        datetime created_at
        datetime updated_at
    }

    NOTIFICATION_TEMPLATE {
        int id PK
        varchar code
        varchar name
        varchar type
        varchar subject
        text body
        datetime created_at
        datetime updated_at
    }

    NOTIFICATION {
        bigint id PK
        int notification_template_id FK
        int client_id
        int initiator_employee_id FK
        varchar channel
        varchar delivery_address
        varchar delivery_status
        datetime created_at
        datetime updated_at
    }

    APPEAL {
        bigint id PK
        int client_id
        int employee_id FK
        varchar subject_type
        bigint subject_id
        varchar type
        varchar channel
        varchar subject
        text description
        varchar status
        datetime created_at
        datetime updated_at
    }
```

**Логические FK за пределами диаграммы**

| Поле | Ссылается на | Диаграмма |
| ---- | ----------- | --------- |
| `CONTRACT.client_id` | `client.CLIENT.id` | Диаграмма 2 |
| `INVOICE.booking_id` | `booking.BOOKING.id` | Диаграмма 1 |
| `INVOICE.contract_id` | `contract.CONTRACT.id` | та же диаграмма, cross-schema (без REFERENCES) |
| `DEBT.client_id` | `client.CLIENT.id` | Диаграмма 2 |
| `NOTIFICATION.client_id` | `client.CLIENT.id` | Диаграмма 2 |
| `APPEAL.client_id` | `client.CLIENT.id` | Диаграмма 2 |

**Table Notes для DrawSQL**

| Таблица | Заметка |
| ------- | ------- |
| `CONTRACT` | `contract_number UNIQUE`; `client_id` — логический FK (cross-schema, без REFERENCES) |
| `INVOICE` | `invoice_number UNIQUE`; `type CHECK('SINGLE','PERIODIC')`; при `SINGLE`: `booking_id NOT NULL`, `contract_id IS NULL`; при `PERIODIC`: `contract_id NOT NULL`, `booking_id IS NULL`; `amount_paid` не хранить — вычислять: `SELECT SUM(amount) FROM payment WHERE invoice_id=? AND status='COMPLETED'`; `booking_id` и `contract_id` — логические FK (cross-context, без REFERENCES) |
| `PAYMENT` | `partial UNIQUE(provider_id) WHERE provider_id IS NOT NULL` (идемпотентность) |
| `REFUND` | `status CHECK('INITIATED','COMPLETED','FAILED')`; `partial UNIQUE(refund_provider_id) WHERE refund_provider_id IS NOT NULL` |
| `DEBT` | `status CHECK('ACTIVE','PAID','WRITTEN_OFF')`; создается scheduled job при просрочке `INVOICE`; `client_id` — логический FK (cross-schema, без REFERENCES) |
| `NOTIFICATION` | `delivery_address NOT NULL` — адрес сохраняется на момент создания задачи, не JOIN к CLIENT; `client_id` — логический FK (cross-schema, без REFERENCES) |
| `APPEAL` | `subject_type CHECK('BOOKING','SESSION','PAYMENT','RECEIPT','CONTRACT')`; `CHECK((subject_type IS NULL) = (subject_id IS NULL))` — оба NULL или оба NOT NULL |

---

## Связанные документы

- **[Полная ERD (temp-normalized-er-model)](temp-normalized-er-model.md)** — источник истины, полные типы PostgreSQL
- **[DDD Bounded Contexts](../../architecture/ddd/ddd-bounded-contexts.md)** — основание разбиения
- **[ADR-003](../../architecture/adr/adr-003-modular-monolith.md)** — схемная изоляция bounded contexts
- **[Контекст чата (сессия 4)](chat-context-er-model-review-3-2026-03-31.md)** — последний принятый контекст ERD
