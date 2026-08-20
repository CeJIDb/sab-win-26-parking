# JSON Schema — UC-8.2 POST /api/v1/contracts

Документ фиксирует формальные схемы запроса и ответов REST-метода создания договора долгосрочной аренды с юридическим лицом для [UC-8.2](../../artifacts/use-case/uc-8-2-create-contract-legal-entity.md).

## Оглавление

- [Назначение](#назначение)
- [Контекст применения](#контекст-применения)
- [JSON Schema](#json-schema)
- [Инварианты и ограничения](#инварианты-и-ограничения)
- [Связанные документы](#связанные-документы)

## Назначение

Документ нужен, чтобы:

- задать формальный контракт `ContractCreateRequest`, `ContractResponse` и `ProblemResponse`;
- служить опорой для автоматической валидации запросов, ответов и моков;
- зафиксировать обязательные поля, допустимые статусы и структурные ограничения.

## Контекст применения

Схема соответствует JSON Schema draft 2020-12 и охватывает request body, успешные ответы `201` и `200`, а также тела ошибок `400`, `422` и `502` метода `POST /api/v1/contracts`. Каноничные данные для проверки приведены в [JSON-примерах UC-8.2](payload-uc-8-2-create-contract.md).

Корневая схема служит контейнером. Конкретное тело валидируется через ссылку на соответствующее определение в `$defs`; корневой `oneOf` не используется, поскольку запрос и успешный ответ имеют пересекающиеся поля.

## JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://parking.example.com/schemas/uc-8-2-create-contract.json",
  "title": "UC-8.2 Create Contract",
  "description": "Контейнер схем запроса и ответов POST /api/v1/contracts.",
  "$defs": {
    "ContractCreateRequest": {
      "type": "object",
      "required": ["startDate", "endDate", "tariffId", "vehicleIds", "parkingPlaceIds"],
      "additionalProperties": false,
      "properties": {
        "startDate": {
          "type": "string",
          "format": "date",
          "description": "Дата начала действия договора."
        },
        "endDate": {
          "type": "string",
          "format": "date",
          "description": "Дата окончания действия договора."
        },
        "tariffId": {
          "type": "integer",
          "minimum": 1,
          "description": "Идентификатор тарифа долгосрочной аренды."
        },
        "vehicleIds": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "description": "Идентификаторы ТС клиента.",
          "items": {
            "type": "integer",
            "minimum": 1
          }
        },
        "parkingPlaceIds": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "description": "Идентификаторы машиномест.",
          "items": {
            "type": "integer",
            "minimum": 1
          }
        }
      }
    },
    "ContractResponse": {
      "type": "object",
      "required": [
        "contractId",
        "contractNumber",
        "status",
        "startDate",
        "endDate",
        "tariffId",
        "amount",
        "currency",
        "vehicleIds",
        "parkingPlaceIds",
        "edoDocumentId",
        "createdAt"
      ],
      "additionalProperties": false,
      "properties": {
        "contractId": {
          "type": "integer",
          "minimum": 1,
          "description": "Идентификатор договора."
        },
        "contractNumber": {
          "type": "string",
          "minLength": 1,
          "description": "Номер договора по правилу нумерации."
        },
        "status": {
          "type": "string",
          "description": "Статус договора из contract_status_enum.",
          "enum": [
            "DRAFT",
            "UNDER_REVIEW",
            "AWAITING_CLIENT_SIGNATURE",
            "AWAITING_PARKING_SIGNATURE",
            "ACTIVE",
            "SUSPENDED",
            "REJECTED_BY_CLIENT",
            "REJECTED_BY_PARKING",
            "EXPIRED",
            "TERMINATED",
            "ARCHIVED"
          ]
        },
        "startDate": {
          "type": "string",
          "format": "date",
          "description": "Дата начала действия договора."
        },
        "endDate": {
          "type": "string",
          "format": "date",
          "description": "Дата окончания действия договора."
        },
        "tariffId": {
          "type": "integer",
          "minimum": 1,
          "description": "Идентификатор примененного тарифа."
        },
        "amount": {
          "type": "number",
          "minimum": 0,
          "multipleOf": 0.01,
          "description": "Стоимость по договору."
        },
        "currency": {
          "type": "string",
          "pattern": "^[A-Z]{3}$",
          "description": "Код валюты ISO 4217."
        },
        "vehicleIds": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "description": "Идентификаторы ТС по договору.",
          "items": {
            "type": "integer",
            "minimum": 1
          }
        },
        "parkingPlaceIds": {
          "type": "array",
          "minItems": 1,
          "uniqueItems": true,
          "description": "Идентификаторы машиномест по договору.",
          "items": {
            "type": "integer",
            "minimum": 1
          }
        },
        "edoDocumentId": {
          "type": "string",
          "minLength": 1,
          "description": "Идентификатор документа в ЭДО."
        },
        "createdAt": {
          "type": "string",
          "format": "date-time",
          "description": "Момент создания договора в UTC."
        },
        "alreadyExists": {
          "type": "boolean",
          "description": "Признак существующего договора по расширению 3а."
        }
      }
    },
    "ProblemResponse": {
      "type": "object",
      "required": ["error_id", "text_error"],
      "additionalProperties": false,
      "properties": {
        "error_id": {
          "type": "integer",
          "description": "HTTP-код или внутренний числовой код ошибки."
        },
        "text_error": {
          "type": "string",
          "minLength": 1,
          "description": "Человекочитаемое сообщение об ошибке."
        },
        "details": {
          "type": "object",
          "description": "Дополнительные сведения об ошибке.",
          "additionalProperties": true,
          "properties": {
            "field": {
              "type": "string",
              "minLength": 1,
              "description": "Поле или предусловие, вызвавшее ошибку."
            }
          }
        }
      }
    }
  },
  "type": "object"
}
```

## Инварианты и ограничения

- `endDate` должна быть позже `startDate`; это межполевая проверка бизнес-логики `Сервиса Договоров`.
- `vehicleIds` и `parkingPlaceIds` должны быть непустыми и не содержать дубликатов.
- `status` принимает одно из 11 значений `contract_status_enum`. Значения `AWAITING_PARKING_SIGNATURE` и `REJECTED_BY_PARKING` соответствуют формулировкам «на подписании парковкой» и «отклонен парковкой» из UC-8.2.
- Для ответа `201` обязательны `status: AWAITING_CLIENT_SIGNATURE` и заполненный `edoDocumentId`.
- Для ответа `200` по расширению `3а` обязательно `alreadyExists: true`; договор должен находиться в нефинальном статусе. Эти зависимости от HTTP-кода проверяются на уровне OpenAPI и бизнес-логики.
- `alreadyExists` отсутствует в request и в `ProblemResponse`; дополнительные поля на верхнем уровне всех трех подсхем запрещены.
- `createdAt` передается как ISO 8601 `date-time` в UTC, бизнес-даты — как `YYYY-MM-DD` без времени.

## Связанные документы

- [JSON-примеры — UC-8.2](payload-uc-8-2-create-contract.md) — шесть каноничных примеров для проверки.
- [OpenAPI-контракт REST-метода — UC-8.2](openapi-uc-8-2-create-contract.md) — HTTP-обвязка и кодозависимые правила ответов.
- [UC-8.2 Создать договор с ЮЛ](../../artifacts/use-case/uc-8-2-create-contract-legal-entity.md) — источник сценария и бизнес-статусов.
- [UML Sequence Diagram — UC-8.2](sequence-uc-8-2-create-contract.md) — последовательность вызовов.
- [Интеграционные требования](../../specs/integration/integration-requirements.md) — требования `INT-014` и `INT-015`.
- [Нормализованная ER-модель](../database/erd/erd-normalized-er-model.md) — источник технического enum статусов.
- [Мастер-план UC-8.2](../../../plans/2026-05-02-uc-8-2-edo-integration.md) — состояние комплекта интеграционных артефактов.
- [Индекс интеграционной архитектуры](readme.md) — общий каталог раздела.
