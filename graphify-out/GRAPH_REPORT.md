# Graph Report - . (2026-05-14)

## Corpus Check

- 235 files · ~507,938 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary

- 911 nodes · 1368 edges · 72 communities (43 shown, 29 thin omitted)
- Extraction: 91% EXTRACTED · 9% INFERRED · 0% AMBIGUOUS · INFERRED: 123 edges (avg confidence: 0.88)
- Token cost: 15,800 input · 4,200 output

## Community Hubs (Navigation)

- [[_COMMUNITY_Business Processes & Access Flow|Business Processes & Access Flow]]
- [[_COMMUNITY_C4 L3 Architecture & Adapters|C4 L3 Architecture & Adapters]]
- [[_COMMUNITY_Demo-4 Architecture Presentation|Demo-4 Architecture Presentation]]
- [[_COMMUNITY_ACS  LPR Integration|ACS / LPR Integration]]
- [[_COMMUNITY_Normalized ERD (Auth & Booking)|Normalized ERD (Auth & Booking)]]
- [[_COMMUNITY_Normalized ERD (Public Schema)|Normalized ERD (Public Schema)]]
- [[_COMMUNITY_Domain Entities & Integrations|Domain Entities & Integrations]]
- [[_COMMUNITY_Architectural Decisions (ADR)|Architectural Decisions (ADR)]]
- [[_COMMUNITY_Actors & Use Cases|Actors & Use Cases]]
- [[_COMMUNITY_C4 L3 Microservices|C4 L3 Microservices]]
- [[_COMMUNITY_DB Schemas & UI Screens|DB Schemas & UI Screens]]
- [[_COMMUNITY_SQL DDL Tables|SQL DDL Tables]]
- [[_COMMUNITY_NFR & Security Analysis|NFR & Security Analysis]]
- [[_COMMUNITY_ER Data Model|ER Data Model]]
- [[_COMMUNITY_C4 L2 Container Diagram|C4 L2 Container Diagram]]
- [[_COMMUNITY_Admin UI Wireframes|Admin UI Wireframes]]
- [[_COMMUNITY_C4 L1 System Context|C4 L1 System Context]]
- [[_COMMUNITY_Demo-5 Presentation Artifacts|Demo-5 Presentation Artifacts]]
- [[_COMMUNITY_Constraints & Dev Tasks|Constraints & Dev Tasks]]
- [[_COMMUNITY_Interview Plans & Process|Interview Plans & Process]]
- [[_COMMUNITY_Process Governance & DoD|Process Governance & DoD]]
- [[_COMMUNITY_Notification Service (KafkaEmail)|Notification Service (Kafka/Email)]]
- [[_COMMUNITY_Product Discovery Artifacts|Product Discovery Artifacts]]
- [[_COMMUNITY_Context & As-Is Processes|Context & As-Is Processes]]
- [[_COMMUNITY_As-Is Parking Operations|As-Is Parking Operations]]
- [[_COMMUNITY_Context Diagram & DFD|Context Diagram & DFD]]
- [[_COMMUNITY_Payment Algorithm & Navigation|Payment Algorithm & Navigation]]
- [[_COMMUNITY_Project Charter & Glossary|Project Charter & Glossary]]
- [[_COMMUNITY_Client UI Wireframes|Client UI Wireframes]]
- [[_COMMUNITY_Conceptual Data Model|Conceptual Data Model]]
- [[_COMMUNITY_Payment Integration Schema|Payment Integration Schema]]
- [[_COMMUNITY_OpenAPI Access Check UC12|OpenAPI: Access Check UC12]]
- [[_COMMUNITY_Messaging Architecture (KafkaRabbitMQ)|Messaging Architecture (Kafka/RabbitMQ)]]
- [[_COMMUNITY_Requirements Traceability IDs|Requirements Traceability IDs]]
- [[_COMMUNITY_Business Goals & Impact Map|Business Goals & Impact Map]]
- [[_COMMUNITY_UC-8.2 Contract Creation|UC-8.2 Contract Creation]]
- [[_COMMUNITY_UC-10.2 Online Payment|UC-10.2 Online Payment]]
- [[_COMMUNITY_Dev Tooling (Claude & Git)|Dev Tooling (Claude & Git)]]
- [[_COMMUNITY_Demo-5 & Reports|Demo-5 & Reports]]
- [[_COMMUNITY_Sequence UC10.2 Payment Flow|Sequence: UC10.2 Payment Flow]]
- [[_COMMUNITY_YooKassa Payment Integration|YooKassa Payment Integration]]
- [[_COMMUNITY_Broker Architecture L1|Broker Architecture L1]]
- [[_COMMUNITY_UC10.6 Receipt API|UC10.6 Receipt API]]
- [[_COMMUNITY_Demo Day 1-2 Records|Demo Day 1-2 Records]]
- [[_COMMUNITY_ERD Tooling (ChartDB)|ERD Tooling (ChartDB)]]
- [[_COMMUNITY_Kafka DFD Diagrams|Kafka DFD Diagrams]]
- [[_COMMUNITY_Kafka Notification Adapter|Kafka Notification Adapter]]
- [[_COMMUNITY_OpenAPI UC12 Swagger Spec|OpenAPI UC12 Swagger Spec]]
- [[_COMMUNITY_RabbitMQ DFD Diagrams|RabbitMQ DFD Diagrams]]
- [[_COMMUNITY_Assets README|Assets README]]
- [[_COMMUNITY_PR Description Template|PR Description Template]]
- [[_COMMUNITY_Use Case Diagram README|Use Case Diagram README]]
- [[_COMMUNITY_Use Case Registry README|Use Case Registry README]]
- [[_COMMUNITY_CRUDL Matrix README|CRUDL Matrix README]]
- [[_COMMUNITY_InfoSec Analysis README|InfoSec Analysis README]]
- [[_COMMUNITY_Bow-Tie Analysis README|Bow-Tie Analysis README]]
- [[_COMMUNITY_Payment System Actor|Payment System Actor]]
- [[_COMMUNITY_Notification Service Actor|Notification Service Actor]]
- [[_COMMUNITY_Use Case Diagram|Use Case Diagram]]
- [[_COMMUNITY_FR Template|FR Template]]
- [[_COMMUNITY_System Actor|System Actor]]
- [[_COMMUNITY_Guard Profile UI|Guard Profile UI]]
- [[_COMMUNITY_Social Preview Image|Social Preview Image]]
- [[_COMMUNITY_Social Preview Platform Name|Social Preview Platform Name]]
- [[_COMMUNITY_Social Preview Portfolio|Social Preview Portfolio]]
- [[_COMMUNITY_Social Preview Components|Social Preview Components]]
- [[_COMMUNITY_Social Preview Artifacts|Social Preview Artifacts]]
- [[_COMMUNITY_OpenAPI UC10.6 Receipt 200|OpenAPI UC10.6 Receipt 200]]
- [[_COMMUNITY_OpenAPI UC10.6 Error API|OpenAPI UC10.6 Error API]]
- [[_COMMUNITY_RabbitMQ Postgres DB|RabbitMQ Postgres DB]]
- [[_COMMUNITY_Notification History Table|Notification History Table]]
- [[_COMMUNITY_ER Notifications Table|ER Notifications Table]]

## God Nodes (most connected - your core abstractions)

1. `Traceability Matrix Log` - 29 edges
2. `Demo 5: Автоматизация частного паркинга — финальная презентация` - 26 edges
3. `DDD Bounded Contexts ИС парковки` - 23 edges
4. `PostgreSQL DDL — нормализованная схема БД (все схемы)` - 21 edges
5. `Маппинг обмена данными с ЮKassa` - 20 edges
6. `C4 Level 3 Component Diagram` - 20 edges
7. `Web Application Container (Backend)` - 19 edges
8. `Use Case Registry` - 18 edges
9. `Цифровая платформа парковки (Software System) — управление парковкой, бронирование, тарифы, контроль доступа` - 17 edges
10. `Demo 5 — Сценарий выступления` - 16 edges

## Surprising Connections (you probably didn't know these)

- `Guard client card — access status, contracts, vehicles, manual payment` --shares_data_with--> `clients table — identity, type (FL/UL), status` [INFERRED]
  ui/guard/client-summary.html → sql/database/chartdb-postgresql-erd-normalized-public.sql
- `Guard entry-exit log — filterable KPP event journal with manual entry` --shares_data_with--> `access_logs table — append-only KPP event log` [INFERRED]
  ui/guard/log.html → sql/database/chartdb-postgresql-erd-normalized-public.sql
- `Guard KPP panel — live events, plate/client search, parking map` --shares_data_with--> `access_logs table — append-only KPP event log` [INFERRED]
  ui/guard/index.html → sql/database/chartdb-postgresql-erd-normalized-public.sql
- `Admin client card — access status, blacklist, manual payment` --shares_data_with--> `contracts table — client contracts with template` [INFERRED]
  ui/admin/client-summary.html → sql/database/chartdb-postgresql-erd-normalized-public.sql
- `Site tariffs page — hourly and contract tariff info for public` --shares_data_with--> `tariffs table — billing step, grace period, benefit category` [INFERRED]
  ui/site/tariffs.html → sql/database/chartdb-postgresql-erd-normalized-public.sql

## Hyperedges (group relationships)

- **Core billing flow: booking → parking_session → invoice → payment** — sql_chartdb_bookings_table, sql_chartdb_parking_sessions_table, sql_chartdb_invoices_table, sql_chartdb_payments_table [EXTRACTED 1.00]
- **Kafka → Notification Service → RabbitMQ: двухуровневый конвейер уведомлений** — concept_kafka, concept_notification_service, concept_rabbitmq, concept_notification_direct_exchange [INFERRED]
- **Kafka + Outbox + CDC: цепочка доставки событий без dual-write** — concept_outbox_pattern, concept_cdc, concept_kafka, concept_dual_write [INFERRED]
- **ADR-005 и ADR-006: consumer-owned view паттерн для горячего пути** — adr_005_access_control_db_read, adr_006_facility_availability, concept_consumer_owned_view [INFERRED]
- **Интервью 5, 6, 7: итерационное согласование TO-BE, навигации и экранных форм с заказчиком** — protocols_interview_protocol_5_2026_02_18_v01, protocols_interview_protocol_6_2026_02_25_v01, protocols_interview_protocol_7_2026_03_04_v01 [EXTRACTED 1.00]
- **MVP DoD: Excel не нужен, единый источник правды — концепция готовности MVP** — demo_5_dod_excel_not_needed, process_dod_mvp_criterion, process_mvp_definition_of_done [INFERRED 0.95]
- **Booking Management UCs (list, cancel, create in admin)** — use_case_uc_7_4_cancel_booking, use_case_uc_7_5_list_bookings, use_case_uc_7_6_create_booking_admin [INFERRED 0.85]
- **Parking Session Lifecycle: create → complete via СКУД** — use_case_uc_12_2_create_booking_auto_entry, use_case_uc_12_4_create_parking_session, use_case_uc_12_8_complete_parking_session [EXTRACTED 0.95]
- **Платеж, интеграция с провайдером, журналирование финансовых операций** — functional_requirements_fr_payment, integration_integration_requirements, nonfunctional_requirements_nfr_logging [INFERRED 0.85]
- **Ограничения системы, NFR UI и NFR Logging задают требования к платформе** — constraints_constr_system, nonfunctional_requirements_nfr_ui_quality, nonfunctional_requirements_nfr_logging [INFERRED 0.75]
- **Основной поток: СКУД → ПарковочнаяСессия → Платеж → Чек** — functional_requirements_fr_event_skud, functional_requirements_fr_parking_session, functional_requirements_fr_payment, functional_requirements_fr_check [EXTRACTED 1.00]
- **Event Storming TO-BE → DDD-декомпозиция → C4-диаграммы: единая цепочка архитектурного проектирования** — demo_5_event_storming_to_be, demo_5_ddd_domain_decomposition, demo_5_c4_diagrams [EXTRACTED 1.00]
- **Demo Days Project Progression (1→2→3→4)** — demo_1_demo_1_presentation_deck, demo_2_demo_2_presentation_deck, demo_3_demo_3_presentation_deck, demo_4_demo_4_presentation_deck [INFERRED 0.85]
- **Guard KPP interface: panel, log, client card, notifications, profile** — ui_guard_index_kpp_panel, ui_guard_log_entry_exit_log, ui_guard_client_summary_guard_card, ui_guard_notifications_system_notifications, ui_guard_profile_guard_profile [EXTRACTED 1.00]
- **Public site wireframe pages: tariffs, rules, contacts** — ui_site_tariffs_tariffs_page, ui_site_rules_parking_rules, ui_site_contacts_contacts_page [EXTRACTED 1.00]
- **Core-домены совместно реализуют расчет стоимости парковки** — slides_demo5_entity_booking, slides_demo5_entity_tariff, slides_demo5_entity_parking_session, slides_demo5_domain_core [EXTRACTED 1.00]
- **Сценарий въезда: СКУД ГРЗ → идентификация → бронирование → доступ → сессия** — slides_demo5_skud_lpr, slides_demo5_uc_auto_identification, slides_demo5_entity_booking, slides_demo5_entity_parking_session [EXTRACTED 1.00]
- **Поток онлайн-оплаты: ЛК → система → Платежная система → ОФД → уведомления** — slides_demo5_uc_online_payment, slides_demo5_payment_gateway, slides_demo5_uml_sequence, slides_demo5_notification_service [EXTRACTED 1.00]

## Communities (72 total, 29 thin omitted)

### Community 0 - "Business Processes & Access Flow"

Cohesion: 0.05
Nodes (73): BPMN AS-IS идентификации клиента, BPMN AS-IS поиска парковочного места, UML StateChart договора с физлицом AS-IS, Двухфакторная аутентификация TOTP (2FA), Сквозной сценарий допуска и парковки TO-BE (концепция), Бронирование и договор TO-BE (концепция), Идентификация клиента (концепция), Управление профилем клиента и ТС TO-BE (концепция) (+65 more)

### Community 1 - "C4 L3 Architecture & Adapters"

Cohesion: 0.07
Nodes (62): C4 L3 — Component: 16 доменных сервисов + 4 адаптера внутри Backend, Display Adapter — адаптер интеграции с информационными табло, Notification Adapter — адаптер интеграции с сервисом уведомлений (SMS/push/email), Payment Adapter — адаптер интеграции с Платежной системой (ЮKassa), СКУД/LPR Adapter — адаптер интеграции со шлагбаумом и LPR-камерами, Kafka Topic: Topic_BookingConfirmed (parking.booking.confirmed.v1), Kafka Topic: Topic_BookingCreated (parking.booking.created.v1), Kafka Topic: Topic_PaymentCompleted (parking.payment.completed.v1) (+54 more)

### Community 2 - "Demo-4 Architecture Presentation"

Cohesion: 0.05
Nodes (58): Сравнение архитектур: монолит vs микросервисы vs Event-Driven — выбор монолита, C4 L3: компоненты аутентификации (Client Profile Service, Identity/Auth Service, Worker Profile Service, SSO VK/Яндекс), C4 L2: контейнеры — PWA клиента, Web сотрудника, API Gateway (JWT), Backend (Java/Spring Boot), PostgreSQL, C4 L3: компонент интеграции с оборудованием (Session Service, Access Control Service, Booking Service, Integration Adapter), C4 L1: системный контекст — 5 акторов (Владелец, Клиент ФЛ, Клиент ЮЛ, Охранник, Управляющий) + 11 внешних систем, ER-диаграмма домена Бронирование: clients, vehicles, bookings, parking_slots, sectors, parkings, parking_sessions, ER-диаграмма домена Клиент: clients, passport_data, agreements, vehicles, organizations, client_accounts, notification_settings, ES To-Be с выделенными доменными контекстами (15 контекстов: 5 Core, 8 Supporting, 2 Generic) (+50 more)

### Community 3 - "ACS / LPR Integration"

Cohesion: 0.06
Nodes (55): Актор: СКУД (система контроля и управления доступом), AccessCheckResponse (GRANTED/DENIED/MANUAL_REVIEW), Компонент: ACS — служба контроля доступа, INT-001: событие от АдаптераСКУД на ПроверкуДоступа (licensePlate, checkpointId, direction, capturedAt), INT-006: результат фискализации чека (fiscalNumber, fiscalizationStatus, receiptDateTime от ОФД), Компонент: LPR-адаптер (СКУД) — распознавание ГРЗ на КПП, Сущность: Платеж (статусы: INITIALIZED / SUCCESS / CANCELLED / ERROR), Сущность: Чек (fiscalizationStatus: PENDING / FISCALIZED / ERROR) (+47 more)

### Community 4 - "Normalized ERD (Auth & Booking)"

Cohesion: 0.07
Nodes (47): auth.client_accounts, auth.employee_accounts, booking.booking_status_history, booking.bookings, client.agreement_types, client.agreements, client.clients, client.notification_settings (+39 more)

### Community 5 - "Normalized ERD (Public Schema)"

Cohesion: 0.1
Nodes (47): access_logs, access_points, agreement_types, agreements, appeals, benefit_categories, benefit_documents, booking_status_history (+39 more)

### Community 6 - "Domain Entities & Integrations"

Cohesion: 0.07
Nodes (45): Автоматическое распознавание госномеров (ANPR), Интеграция с ЭДО (электронный документооборот), Сущность: Бронирование, Сущность: Договор, Сущность: Уведомление, Сущность: Парковочная сессия (ПС), Сущность: Платеж, Сущность: Сектор и парковочное место (ПМ) (+37 more)

### Community 7 - "Architectural Decisions (ADR)"

Cohesion: 0.08
Nodes (43): ADR-001: Онлайн-проверка права доступа в платформе, ADR-002: Бронирование vs Парковочная сессия, ADR-003: Модульный монолит, ADR-004: Интеграция с DADATA (Отменен), ADR-005: Стратегия чтения данных Access Control, ADR-006: Расчет доступности ПМ при бронировании, ADR-007: Kafka как шина событий (учебный TO-BE), ADR-008: RabbitMQ для рассылки уведомлений (учебный TO-BE) (+35 more)

### Community 8 - "Actors & Use Cases"

Cohesion: 0.06
Nodes (39): Актор: КлиентФЛ (физическое лицо), Актор: КлиентЮЛ (юридическое лицо), Актор: Охранник / Оператор, Актор: Управляющий, Актор: Владелец, Бронирование (доменная сущность), Сущность: Договор (статусы: черновик / на подписании / активен / отклонен / просрочен), Внешняя система: ЭДО (электронный документооборот) для договоров с ЮЛ (+31 more)

### Community 9 - "C4 L3 Microservices"

Cohesion: 0.15
Nodes (30): Analytics Service, Billing Service, Booking Service, Client Profile Service, Contract Service, Корпоративный клиент, CRM System (External), C4 Level 3 Component Diagram (+22 more)

### Community 10 - "DB Schemas & UI Screens"

Cohesion: 0.11
Nodes (30): DB Schema: auth — аккаунты клиентов и сотрудников, DB Schema: client — клиенты, ТС, организации, соглашения, DB Schema: facility — парковки, сектора, места, КПП, DB Schema: payment — счета, платежи, чеки, возвраты, долги, UI: Главная страница сайта-визитки (site/index.html), UI: Вход в личный кабинет клиента (site/login.html), UI: Карта свободных мест — схема парковки (site/parking-map.html), UI: Регистрация нового клиента (site/register.html) (+22 more)

### Community 11 - "SQL DDL Tables"

Cohesion: 0.1
Nodes (28): access_logs table — append-only KPP event log, appeals table — complaints, requests from clients, bookings table — booking lifecycle, tariff snapshot, status, clients table — identity, type (FL/UL), status, contracts table — client contracts with template, debts table — overdue tracking linked to invoice and client, employees table — role, status, invoices table — links to booking or contract (+20 more)

### Community 12 - "NFR & Security Analysis"

Cohesion: 0.08
Nodes (26): ADR-004: DADATA Organization Lookup (Rejected 2026-05-02), ADR-005: Direct Read via SQL View, C4 Diagrams (L1+L2+L3), FR-PARKSESSION-001..017 (Parking Session FRs), NFR-R01 Bow-Tie Security Barriers (P1..P6, M1..M2, R1..R5), NFR-EXT-SEC-001..004 (Security NFRs), NFR-LOG-\* (10 logging non-functional requirements), UC-12.1: Auto Identification Entry / Access Check (+18 more)

### Community 13 - "ER Data Model"

Cohesion: 0.09
Nodes (25): Table: bookings — parking spot reservations/bookings, Table: clients — stores parking client records, Table: contracts — long-term rental contracts, Table: parking spots / spaces — individual spot definitions, Table: payments — payment records for sessions and bookings, Table: sessions — active parking sessions, Table: vehicles — registered vehicles linked to clients, 1C [Software System] — бухгалтерия external accounting system (+17 more)

### Community 14 - "C4 L2 Container Diagram"

Cohesion: 0.11
Nodes (22): Актор: КлиентФЛ (Person) — клиент физическое лицо, Актор: КлиентЮЛ (Person) — клиент юридическое лицо, Актор: Охранник (Person) — сотрудник КПП, Актор: Управляющий (Person) — оператор платформы, Актор: Владелец (Person) — владелец паркинга, API Gateway (Container) — единая точка входа, JWT-авторизация, Backend-приложение (Container: Node.js) — бизнес-логика, Приложение клиента (Container: PWA) — бронирование, оплата, профиль (+14 more)

### Community 15 - "Admin UI Wireframes"

Cohesion: 0.16
Nodes (18): Admin Staff Profiles (Профили сотрудников), Admin External Analytics (Аналитика), Admin Bookings (Управление бронированиями), Admin Client Sessions (Сессии клиента), Admin Client Profiles (Профили клиентов), Admin Create Contract (Создание договора), Admin Contracts (Управление договорами), Admin Debts (Задолженности) (+10 more)

### Community 16 - "C4 L1 System Context"

Cohesion: 0.11
Nodes (18): Клиент ФЛ (Person) — физическое лицо, Клиент ЮЛ (Person) — юридическое лицо, Управляющий (Person) — операционное управление, Владелец (Person) — стратегическое управление, Охрана (Person) — сотрудник КПП, Цифровая платформа парковки (Software System) — управление парковкой, бронирование, тарифы, контроль доступа, 1С (Software System) — бухгалтерия, ЭДО (Software System) — электронный документооборот (+10 more)

### Community 17 - "Demo-5 Presentation Artifacts"

Cohesion: 0.16
Nodes (16): C4-диаграммы (Context, Container, Component), Концептуальная модель (Бронирование и Парковочная сессия), Доменная декомпозиция (DDD): Core / Supporting / Generic, Demo 5 — Сценарий выступления, Data Flow Diagram L1, Event Storming AS-IS, Event Storming TO-BE, Impact Map (+8 more)

### Community 18 - "Constraints & Dev Tasks"

Cohesion: 0.15
Nodes (16): Ограничения к системе (CONSTR-\*), Индекс ограничений, Индекс постановок задач на разработку, Шаблон постановки задачи на разработку, Dev Task UC-3.1: Добавить ТС, Пример постановки задачи (свободные места), FR: Чек, FR: СобытиеСКУД (+8 more)

### Community 19 - "Interview Plans & Process"

Cohesion: 0.17
Nodes (16): TO-BE концепция: система доступа без участия сотрудников, План интервью №5, План интервью №6, План интервью №7, Планы интервью — индекс, Брендинг репозитория — чеклист, Постоплата: концепция согласования с заказчиком, Грейс-период (временной интервал для выезда после оплаты) (+8 more)

### Community 20 - "Process Governance & DoD"

Cohesion: 0.18
Nodes (14): DoD MVP: Excel больше не нужен, Artifact Placement Guide, Принцип: каноничный артефакт — Markdown, изображение — приложение, Общий критерий MVP DoD: система — единый источник правды вместо Excel, First Contribution Path, MVP Definition of Done, MVP Definition of Done, PR Definition of Ready / Definition of Done (+6 more)

### Community 21 - "Notification Service (Kafka/Email)"

Cohesion: 0.24
Nodes (11): Почтовый сервис [Software System] — external SMTP/API email service, Email Worker [Component] — отправка email, Kafka — source of BookingCreated/BookingConfirmed events for Notification Service, Notification Email Adapter [Component] — интеграция с почтовым сервисом, Notification Service [Component] — формирование и маршрутизация уведомлений, Notification SMS Adapter [Component] — интеграция с SMS-провайдером, Table: push_inbox — queued push notifications, Push Worker [Component] — записывает push в БД (+3 more)

### Community 22 - "Product Discovery Artifacts"

Cohesion: 0.24
Nodes (10): Impact Map — автоматизация парковки, Цель: увеличить долю онлайн-клиентов с 0% до 80% в течение 6 месяцев после запуска, Бюджет проекта: 10 млн руб. (макс. 15 млн), срок 4–6 мес., Opportunity Canvas — автоматизация парковки, Метрики: пропускная способность >200 машин/час, простой <10%, рейтинг >4.5, Идеи решений: публичный портал, ЛК, СКУД с LPR-камерами, ЭДО, модуль оплат, терминал, Пользователи системы: охранник, старший охранник, владелец, управляющий, бухгалтер, SMM-специалист, Impact Map (+2 more)

### Community 23 - "Context & As-Is Processes"

Cohesion: 0.24
Nodes (10): Типы зон парковки: краткосрочная, долгосрочная ФЛ+ЮЛ, ОВЗ, муниципальная/мотоциклы/резерв, Процесс выезда: автоматический и ручной сценарии, проверка задолженности, открытие шлагбаума, BPMN AS-IS выезда с парковки, Оплата AS-IS: ФЛ — проверка долга, оплата онлайн/офлайн; ЮЛ — счет, подтверждение, актуализация доступа, BPMN AS-IS оплаты для физлиц и юрлиц, Процесс предоставления ПМ: идентификация, договор, оплата, открытие шлагбаума, запись в журнал, BPMN AS-IS предоставления парковочного места, Схема парковки AS-IS (+2 more)

### Community 24 - "As-Is Parking Operations"

Cohesion: 0.24
Nodes (10): Opportunity Canvas проекта, Бизнес-процессы AS-IS парковки (600 мест, Санкт-Петербург), Проксимити-карта (СКУД AS-IS), План интервью №1.1 (21 января 2026), План интервью №1.2 (23 января 2026), План интервью №2 (27 января 2026), Протокол интервью №1.1 — оператор парковки (21 января 2026), Протокол интервью №1.2 — детализация бизнес-процессов (23 января 2026) (+2 more)

### Community 25 - "Context Diagram & DFD"

Cohesion: 0.22
Nodes (9): Внешние акторы: ЮЛ, ФЛ, охранник КПП, управляющий, владелец, Контекстная диаграмма (полная поставка проекта), Внешние системы: платежи, ОФД, СКУД/LPR, уведомления, SSO, ЭДО, биллинг, аналитика, Цифровая платформа парковки (Business Site, Consumer App, Admin Panel, Custom Internal Tool, КПП интерфейс), 20 компонентов Backend: доменные сервисы + адаптеры (Payment, СКУД/LPR, Display, Notification), DFD Level 1 — Декомпозиция платформы парковки, Единое хранилище PostgreSQL (клиенты, брони, сессии, договоры), Контекстная диаграмма (+1 more)

### Community 26 - "Payment Algorithm & Navigation"

Cohesion: 0.22
Nodes (9): DRAKON-алгоритм оплаты парковки, DRAKON-примитив оплаты парковки (расчет стоимости, согласие, выбор способа, попытки оплаты, чек, разрешение выезда), DRAKON-силуэт оплаты парковки (подпрограммы: расчет, согласие, выбор, оплата, результат, завершение), Индекс алгоритмических артефактов, 4 контура UI: публичный сайт, ЛК клиента, административный интерфейс, рабочий контур охранника КПП, Карта навигации, Индекс артефактов, Карта навигации (4 контура UI) (+1 more)

### Community 27 - "Project Charter & Glossary"

Cohesion: 0.22
Nodes (9): Карточка проекта, Глоссарий терминов проекта, Термины: Клиент, ФЛ, ЮЛ, Организация, ПМ, ТС, ГРЗ, Парковочная сессия, Бронирование, Договор, Тариф, Карточка проекта (project-charter.md), User Story Map, User Story Map — автоматизация парковки, Согласованная терминология (протокол №4): тариф, бронирование, договор, Заключение договора AS-IS: разделение ФЛ/ЮЛ, заполнение, печать, подписание, внесение в базу (+1 more)

### Community 28 - "Client UI Wireframes"

Cohesion: 0.61
Nodes (9): Client Bookings (Управление бронированием), Client Contract Sign (Подписание договора), Client Create Contract (Создать договор), Client Contracts (Управление договорами — клиент), Client Dashboard (Парковка — ЛК клиента), Client Notifications (Уведомления клиента), Client Payments (Оплаты — ЛК клиента), Client Profile (Профиль клиента) (+1 more)

### Community 29 - "Conceptual Data Model"

Cohesion: 0.29
Nodes (7): Справочник: Тип бронирования (автоматическое, краткосрочное, долгосрочное), Концептуальная модель системы управления парковкой с атрибутами, Сущность: Клиент (тип ФЛ/ЮЛ), Enum: Статус эксплуатации (в эксплуатации, закрыт на обслуживание, выведен из эксплуатации, планируется к вводу), Концептуальная модель с атрибутами, UML Class Diagram предметной области AS-IS, AS-IS сущности: Клиент, ФЛ, ЮЛ, Договор, Карта доступа, Автомобиль, Тариф, Счет, Чек, ПМ, Журнал в/в, Шлагбаум

### Community 30 - "Payment Integration Schema"

Cohesion: 0.29
Nodes (7): Регламент взаимодействия ИС, JSON-пример ответа — UC-10.2-1, JSON-схема ответа — UC-10.2-1 Обработка оплаты парковочной сессии, Payment Response JSON Schema (draft 2019-09), Payment status enum: SUCCESS, FAILED, CANCELED, UML Sequence — UC-10.2 Онлайн-оплата краткосрочной аренды, Маппинг обмена данными с ЮKassa

### Community 31 - "OpenAPI: Access Check UC12"

Cohesion: 0.29
Nodes (7): Schema: BookingInfo — booking information component, Schema: ClientInfo — client information component, Schema: DisplayInfo — display information for barrier screen, POST /access/check — автоматическая идентификация ТС на въезде, Schema: AccessCheckRequest — licencePlate, checkpointId, direction, capturedAt, confidenceScore, Schema: AccessCheckResponse — accessDecision (GRANTED/DENIED), barrierCommand, admissionMethod, vehicleId, licencePlate, make, Schema: VehicleInfo — vehicle information component

### Community 32 - "Messaging Architecture (Kafka/RabbitMQ)"

Cohesion: 0.33
Nodes (6): ADR-007: Kafka Pipeline (online booking), ADR-008: RabbitMQ Notification Dispatch, DFD Level 1 (20 processes, 11 stores, 15 external entities), CHG-20260428-003: DFD Level 1 created (20 processes, 11 stores, 15 external), CHG-20260430-006: Kafka pipeline UC-12.2+UC-10.2 ADR-007, DFD K-L1/K-L2, CHG-20260501-001: RabbitMQ notification dispatch ADR-008, DFD R-L1/R-L2

### Community 33 - "Requirements Traceability IDs"

Cohesion: 0.33
Nodes (6): Architecture Decision Record ID (ADR-_), Constraint ID (CONSTR-_), Functional Requirement ID (FR-_), Non-Functional Requirement ID (NFR-_), Traceability Change ID (CHG-YYYYMMDD-NNN), Traceability Matrix Rules (traceability-matrix.md)

### Community 34 - "Business Goals & Impact Map"

Cohesion: 0.6
Nodes (5): Impact Map проекта, Цель: 80% клиентов в онлайне за 6 месяцев, Цель: снижение простоя мест с 30% до 10%, План интервью №3 (4 февраля 2026), Протокол интервью №3 — Impact Map и приоритеты (4 февраля 2026)

### Community 35 - "UC-8.2 Contract Creation"

Cohesion: 0.4
Nodes (5): INT-014/015: EDO and Notification integration requirements, Parallel Agent Execution Pattern (4 agents for UC-8.2 INT-\*), UC-8.2: Create Contract Legal Entity, Retro: UC-8.2 Integration Requirements Phase 2 (2026-05-02), CHG-20260502-004: UC-8.2 sync with buildin.ai

### Community 36 - "UC-10.2 Online Payment"

Cohesion: 0.4
Nodes (5): ADR-003: Modular Monolith, UC-10.2: Pay Online Short-Term Rental, CHG-20260411-001: UML Sequence Diagram UC-10.2 online payment, CHG-20260513-006: ADR-003 async transport Outbox selection for MVP, CHG-20260513-007: ADR-003 Status Proposed→Accepted; UC-10.2 ID filled

### Community 37 - "Dev Tooling (Claude & Git)"

Cohesion: 0.5
Nodes (4): atomic-commit.mjs (git workflow script), .claude/settings.json (Claude Code config with deny rules), Gym-App Tooling Adoption (Claude Code, atomic-commit, markdownlint), Retro: gym-app tooling adoption (2026-04-24)

### Community 38 - "Demo-5 & Reports"

Cohesion: 0.5
Nodes (4): Demo 5 Presentation Deck, Demo 5 — Финальное демо: итог всего проекта, Отчет по ДЗ — CeJIDb (команда Парковка), Экспорт слайдов Демо 5

### Community 39 - "Sequence: UC10.2 Payment Flow"

Cohesion: 0.5
Nodes (4): Actor: Клиент — initiates online payment in UC-10.2 sequence, Participant: Система управления — barrier/access control in UC-10.2, Participant: Парковочная система — core system in UC-10.2 sequence, Participant: Модуль управления — payment/management module in UC-10.2

### Community 40 - "YooKassa Payment Integration"

Cohesion: 0.67
Nodes (3): Integration Requirement ID (INT-\*), YooKassa Payment Integration, CHG-20260430-004: OFD YooKassa webhook payment.receipt.created

### Community 41 - "Broker Architecture L1"

Cohesion: 0.67
Nodes (3): Kafka — upstream event source (BookingCreated, BookingConfirmed), Notification Service [Component] — consumes Kafka events, routes to RabbitMQ, RabbitMQ broker — delivers push/sms/email via routing key

### Community 42 - "UC10.6 Receipt API"

Cohesion: 0.67
Nodes (3): OpenAPI UC-10.6 Receipt — Swagger OK view, successful 200 response example, ALT/OPT frames in UC-10.2 — multiple failure/retry paths for payment scenarios, Sequence Diagram UC-10.2 — Обработка оплаты краткосрочной аренды (online payment flow)

## Ambiguous Edges - Review These

- `Traceability Matrix Template` → `FR: Парковочная сессия` [AMBIGUOUS]
  docs/process/templates/traceability-matrix-template.md · relation: references

## Knowledge Gaps

- **326 isolated node(s):** `outbox_events`, `facility.vehicle_types`, `shared.outbox_events`, `auth.client_accounts`, `pii.passport_data` (+321 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **29 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Traceability Matrix Template` and `FR: Парковочная сессия`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **Why does `Traceability Matrix Log` connect `NFR & Security Analysis` to `Messaging Architecture (Kafka/RabbitMQ)`, `Requirements Traceability IDs`, `UC-8.2 Contract Creation`, `UC-10.2 Online Payment`, `YooKassa Payment Integration`, `Process Governance & DoD`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `ADR-002: Бронирование vs Парковочная сессия` connect `Architectural Decisions (ADR)` to `Actors & Use Cases`, `Business Processes & Access Flow`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `Маппинг обмена данными с ЮKassa` (e.g. with `Payment Adapter — адаптер интеграции с Платежной системой (ЮKassa)` and `Сущность: Платеж — атрибуты словаря данных (способ оплаты, статус, провайдер)`) actually correct?**
  _`Маппинг обмена данными с ЮKassa` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `outbox_events`, `facility.vehicle_types`, `shared.outbox_events` to the rest of the system?**
  _326 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Business Processes & Access Flow` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._
- **Should `C4 L3 Architecture & Adapters` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
