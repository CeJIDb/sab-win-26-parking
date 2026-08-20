# OpenAPI-контракт REST-метода — UC-8.2 Создание договора с ЮЛ

Документ фиксирует формальный контракт REST-метода `POST /api/v1/contracts` в сценарии создания договора долгосрочной аренды с юридическим лицом через ЭДО (UC-8.2).

Контракт описан в нотации OpenAPI 3.0.3 и задает тело запроса, успешные ответы `200` и `201`, ветки ошибок (`400`, `401`, `403`, `422`, `502`) и общие схемы данных. Используется как опора для реализации ЛК клиента ЮЛ, `Сервиса Договоров`, моков и автоматических контрактных проверок.

## Оглавление

- [Назначение](#назначение)
- [Контекст применения](#контекст-применения)
- [OpenAPI 3.0.3 — YAML](#openapi-303--yaml)
- [Параметры и ответы](#параметры-и-ответы)
- [Сценарии успешного ответа](#сценарии-успешного-ответа)
- [Превью в Swagger Editor](#превью-в-swagger-editor)
- [Связь с интеграционными требованиями](#связь-с-интеграционными-требованиями)
- [Связанные документы](#связанные-документы)

## Назначение

Документ нужен, чтобы:

- задать единый REST-контракт метода `POST /api/v1/contracts` для UC-8.2;
- зафиксировать набор полей запроса, успешных ответов и ошибок;
- показать различие между созданием договора (`201`) и возвратом существующего договора по бизнес-ключу (`200`);
- служить опорой для генерации клиентов, моков и контрактных тестов.

## Контекст применения

Метод вызывается из ЛК клиента ЮЛ после подтверждения параметров долгосрочной аренды. `Сервис Договоров` проверяет запрос, создает черновик, формирует документ, передает его в ЭДО и возвращает договор после получения идентификатора документа ЭДО.

- Базовые URL: `https://api.parking.example.com/api/v1` (production), `https://api-staging.parking.example.com/api/v1` (staging).
- Идентификатор клиента определяется из авторизованной сессии и не передается в URL или теле запроса.
- Конкретный механизм аутентификации не зафиксирован в исходном описании и остается за границами контракта.
- Тег OpenAPI: `Contracts`.
- Бизнес-даты `startDate` и `endDate` передаются без времени; `createdAt` возвращается в UTC.
- Исходное описание: [REST API UC-8.2 в BuildIn](https://buildin.ai/se24/5b2e21e1-5b88-42d0-911e-f440aa80de80).

Технические статусы `AWAITING_PARKING_SIGNATURE` и `REJECTED_BY_PARKING` синхронизированы с бизнес-статусами «на подписании парковкой» и «отклонен парковкой» из UC-8.2 и с `contract_status_enum` ER-модели.

## OpenAPI 3.0.3 — YAML

```yaml
openapi: 3.0.3
info:
  title: Parking Management API — Создание договора с ЮЛ
  description: >-
    REST-контракт создания договора долгосрочной аренды машиномест для
    юридического лица в рамках UC-8.2. Метод проверяет параметры, создает
    черновик, формирует документ и передает его в ЭДО для подписания.
  version: 1.0.0
  contact:
    name: Команда "Five Whys"
    url: https://github.com/CeJIDb/sab-win-26-parking

externalDocs:
  description: Исходное описание REST API метода в BuildIn
  url: https://buildin.ai/se24/5b2e21e1-5b88-42d0-911e-f440aa80de80

servers:
  - url: https://api.parking.example.com/api/v1
    description: Production
  - url: https://api-staging.parking.example.com/api/v1
    description: Staging

tags:
  - name: Contracts
    description: Договоры долгосрочной аренды с юридическими лицами

paths:
  /contracts:
    post:
      tags:
        - Contracts
      summary: Создать договор с ЮЛ
      description: >-
        Создает договор долгосрочной аренды машиномест для юридического лица.
        Идентификатор клиента определяется из авторизованной сессии и не
        передается в URL или теле запроса. Конкретный механизм аутентификации
        находится за границами этого контракта.
      operationId: createLegalEntityContract
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ContractCreateRequest"
            example:
              startDate: "2026-06-10"
              endDate: "2027-06-10"
              tariffId: 5
              vehicleIds: [1, 2, 3]
              parkingPlaceIds: [15, 16, 17]
      responses:
        "201":
          description: >-
            Договор создан, передан в ЭДО и ожидает подписи клиента.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ContractResponse"
              example:
                contractId: 1024
                contractNumber: DA-2026-0042
                status: AWAITING_CLIENT_SIGNATURE
                startDate: "2026-06-10"
                endDate: "2027-06-10"
                tariffId: 5
                amount: 180000.0
                currency: RUB
                vehicleIds: [1, 2, 3]
                parkingPlaceIds: [15, 16, 17]
                edoDocumentId: edo-sbis-7f3a9c12
                createdAt: "2026-06-10T11:30:00Z"
        "200":
          description: >-
            По бизнес-ключу найден существующий договор в нефинальном статусе.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ExistingContractResponse"
              example:
                contractId: 880
                contractNumber: DA-2026-0007
                status: ACTIVE
                startDate: "2026-01-01"
                endDate: "2026-12-31"
                tariffId: 5
                amount: 180000.0
                currency: RUB
                vehicleIds: [1, 2]
                parkingPlaceIds: [15, 16]
                edoDocumentId: edo-sbis-1a2b3c4d
                createdAt: "2025-12-20T09:15:00Z"
                alreadyExists: true
        "400":
          description: Невалидный JSON или нарушение типов и форматов
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ProblemResponse"
              example:
                error_id: 400
                text_error: Поле startDate не соответствует формату даты YYYY-MM-DD.
                details:
                  field: startDate
        "401":
          description: >-
            Учетные данные клиента отсутствуют, просрочены или невалидны.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ProblemResponse"
        "403":
          description: >-
            Клиент аутентифицирован, но не имеет роли «Клиент ЮЛ».
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ProblemResponse"
        "422":
          description: >-
            Запрос структурно корректен, но не выполнены предусловия UC-8.2.
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ProblemResponse"
              example:
                error_id: 422
                text_error: >-
                  У клиента не заполнены банковские реквизиты организации.
                details:
                  field: client.organization.bankRequisites
        "502":
          description: ЭДО не подтвердил прием документа в течение таймаута
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ProblemResponse"
              example:
                error_id: 502
                text_error: >-
                  ЭДО не подтвердил прием документа в течение настроенного
                  таймаута.
                details:
                  field: edo.timeout

components:
  schemas:
    ContractCreateRequest:
      type: object
      description: Параметры договора из формы клиента ЮЛ
      required:
        - startDate
        - endDate
        - tariffId
        - vehicleIds
        - parkingPlaceIds
      additionalProperties: false
      properties:
        startDate:
          type: string
          format: date
          description: Дата начала действия договора
        endDate:
          type: string
          format: date
          description: Дата окончания действия договора
        tariffId:
          type: integer
          minimum: 1
          description: Идентификатор тарифа долгосрочной аренды
        vehicleIds:
          type: array
          minItems: 1
          uniqueItems: true
          description: Идентификаторы ТС клиента
          items:
            type: integer
            minimum: 1
        parkingPlaceIds:
          type: array
          minItems: 1
          uniqueItems: true
          description: Идентификаторы машиномест
          items:
            type: integer
            minimum: 1

    ContractResponse:
      type: object
      description: Данные созданного или ранее существовавшего договора
      required:
        - contractId
        - contractNumber
        - status
        - startDate
        - endDate
        - tariffId
        - amount
        - currency
        - vehicleIds
        - parkingPlaceIds
        - edoDocumentId
        - createdAt
      additionalProperties: false
      properties:
        contractId:
          type: integer
          minimum: 1
          description: Идентификатор договора
        contractNumber:
          type: string
          minLength: 1
          description: Номер договора по правилу нумерации
        status:
          type: string
          description: Статус договора из contract_status_enum
          enum:
            - DRAFT
            - UNDER_REVIEW
            - AWAITING_CLIENT_SIGNATURE
            - AWAITING_PARKING_SIGNATURE
            - ACTIVE
            - SUSPENDED
            - REJECTED_BY_CLIENT
            - REJECTED_BY_PARKING
            - EXPIRED
            - TERMINATED
            - ARCHIVED
        startDate:
          type: string
          format: date
          description: Дата начала действия договора
        endDate:
          type: string
          format: date
          description: Дата окончания действия договора
        tariffId:
          type: integer
          minimum: 1
          description: Идентификатор примененного тарифа
        amount:
          type: number
          minimum: 0
          multipleOf: 0.01
          description: Стоимость по договору
        currency:
          type: string
          pattern: "^[A-Z]{3}$"
          description: Код валюты ISO 4217
        vehicleIds:
          type: array
          minItems: 1
          uniqueItems: true
          description: Идентификаторы ТС по договору
          items:
            type: integer
            minimum: 1
        parkingPlaceIds:
          type: array
          minItems: 1
          uniqueItems: true
          description: Идентификаторы машиномест по договору
          items:
            type: integer
            minimum: 1
        edoDocumentId:
          type: string
          minLength: 1
          description: Идентификатор документа в ЭДО
        createdAt:
          type: string
          format: date-time
          description: Момент создания договора в UTC
        alreadyExists:
          type: boolean
          description: >-
            Признак найденного договора. Передается со значением true только в
            ответе 200 на расширение 3а.

    ExistingContractResponse:
      allOf:
        - $ref: "#/components/schemas/ContractResponse"
        - type: object
          required:
            - alreadyExists
          properties:
            alreadyExists:
              type: boolean
              enum:
                - true

    ProblemResponse:
      type: object
      description: Унифицированное тело ошибки
      required:
        - error_id
        - text_error
      additionalProperties: false
      properties:
        error_id:
          type: integer
          description: HTTP-код или внутренний числовой код ошибки
        text_error:
          type: string
          minLength: 1
          description: Человекочитаемое сообщение об ошибке
        details:
          $ref: "#/components/schemas/ProblemDetails"

    ProblemDetails:
      type: object
      description: Дополнительные сведения об ошибке
      additionalProperties: true
      properties:
        field:
          type: string
          description: Указатель на нарушенное поле или предусловие
```

## Параметры и ответы

Параметры запроса:

| Параметр          | Где  | Обязателен | Тип              | Ограничения                   | Назначение                             |
| ----------------- | ---- | ---------- | ---------------- | ----------------------------- | -------------------------------------- |
| `startDate`       | body | да         | string (`date`)  | ISO 8601, `YYYY-MM-DD`        | Дата начала действия договора          |
| `endDate`         | body | да         | string (`date`)  | ISO 8601, `YYYY-MM-DD`        | Дата окончания действия договора       |
| `tariffId`        | body | да         | integer          | `>= 1`                        | Идентификатор тарифа                   |
| `vehicleIds`      | body | да         | array of integer | непустой, уникальные значения | Идентификаторы ТС клиента              |
| `parkingPlaceIds` | body | да         | array of integer | непустой, уникальные значения | Идентификаторы закрепляемых машиномест |

Коды ответа:

| Код   | Когда возвращается                                                | Тело ответа                |
| ----- | ----------------------------------------------------------------- | -------------------------- |
| `201` | Договор создан, передан в ЭДО и ожидает подписи клиента           | `ContractResponse`         |
| `200` | Найден существующий договор в нефинальном статусе                 | `ExistingContractResponse` |
| `400` | JSON, тип или формат поля не соответствует контракту              | `ProblemResponse`          |
| `401` | Учетные данные отсутствуют, просрочены или невалидны              | `ProblemResponse`          |
| `403` | Клиент аутентифицирован, но не имеет роли «Клиент ЮЛ»             | `ProblemResponse`          |
| `422` | Не выполнено бизнес-предусловие UC-8.2                            | `ProblemResponse`          |
| `502` | ЭДО не подтвердил прием документа в течение настроенного таймаута | `ProblemResponse`          |

## Сценарии успешного ответа

Оба успешных ответа используют общую структуру договора. Различие фиксируется HTTP-кодом и полем `alreadyExists`.

| Код   | `status` на примере                 | `alreadyExists` | Семантика                                                 |
| ----- | ----------------------------------- | --------------- | --------------------------------------------------------- |
| `201` | `AWAITING_CLIENT_SIGNATURE`         | отсутствует     | Создан новый договор, документ принят ЭДО                 |
| `200` | любой допустимый нефинальный статус | `true`          | Возвращен ранее созданный договор по тому же бизнес-ключу |

Ответ `201` не означает, что договор уже заключен: он подтверждает передачу документа в ЭДО и переход к ожиданию подписи клиента.

## Превью в Swagger Editor

В исходной странице BuildIn блоки Swagger Hub и YAML не были заполнены. Встроенный YAML сформирован из таблиц и примеров страницы и проверен локальными валидаторами Swagger и OpenAPI без структурных ошибок.

Скриншоты Swagger Editor для UC-8.2 пока не добавлены. После ручной проверки их можно сохранить в `assets/` по образцу контрактов UC-10.6 и UC-12.1.

## Связь с интеграционными требованиями

| Требование | Что закрывает контракт                                                                                                                                       |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `INT-014`  | Успешный ответ содержит `edoDocumentId` и статус ожидания подписи; ответ `502` фиксирует отсутствие подтверждения приема документа от ЭДО                    |
| `INT-015`  | Успешная передача договора и ошибка ЭДО выступают триггерами уведомлений; сам REST-метод задает входной синхронный контракт, а не канал доставки уведомлений |

## Связанные документы

- [JSON-примеры — UC-8.2](payload-uc-8-2-create-contract.md) — каноничные тела запроса и ответов.
- [JSON Schema — UC-8.2](schema-uc-8-2-create-contract.md) — формальные схемы запроса и ответов.
- [UC-8.2 Создать договор с ЮЛ](../../artifacts/use-case/uc-8-2-create-contract-legal-entity.md) — пользовательский сценарий, для которого построен контракт.
- [UML Sequence Diagram — UC-8.2](sequence-uc-8-2-create-contract.md) — последовательность создания и подписания договора через ЭДО.
- [Регламент взаимодействия ИС](is-interaction-regulation.md) — направления обмена блока «Документооборот через ЭДО».
- [Интеграционные требования](../../specs/integration/integration-requirements.md) — требования `INT-014` и `INT-015`, связанные с документооборотом и уведомлениями.
- [Нормализованная ER-модель](../database/erd/erd-normalized-er-model.md) — текущий источник статусов договора и типов идентификаторов.
- [Индекс интеграционной архитектуры](readme.md) — общий каталог раздела.
