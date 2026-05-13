# JSON-схема ответа — UC-10.6 Получение платежного чека

Документ фиксирует формальную JSON Schema ответа сервиса фискализации в сценарии получения платежного чека с данными связанного платежа (UC-10.6).

Схема соответствует спецификации JSON Schema draft 2020-12 и описывает структуру ответа, в котором корневые поля содержат реквизиты чека, а вложенный объект `payment` — краткие сведения о связанном платеже.

## Оглавление

- [Назначение](#назначение)
- [Контекст применения](#контекст-применения)
- [JSON Schema](#json-schema)
- [Инварианты и ограничения](#инварианты-и-ограничения)
- [Связанные документы](#связанные-документы)

## Назначение

Документ нужен, чтобы:

- задать формальный контракт ответа для процесса UC-10.6;
- служить опорой для автоматической валидации ответов в тестах и в рантайме;
- фиксировать допустимые значения статусов, способов оплаты и назначений платежа, а также обязательные поля.

## Контекст применения

Схема описывает ответ по итогам формирования платежного чека, возвращаемый сервисом фискализации после успешного завершения платежа. Каноничный пример полезной нагрузки приведен в артефакте [JSON-пример ответа — UC-10.6](payload-uc-10-6-receipt.md). Полный REST-контракт метода `GET /payments/{paymentId}/receipt` (HTTP-обвязка, security, коды ответа `200/401/403/404/502`) описан в [OpenAPI-контракте REST-метода — UC-10.6](openapi-uc-10-6-receipt.md); этот документ остается фрагментом — формальной JSON Schema успешного ответа `200`.

## JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://example.com/schemas/receipt-response.json",
  "title": "ReceiptResponse",
  "description": "Схема ответа для получения чека. Возвращает данные фискального чека с вложенной информацией о связанном платеже.",
  "type": "object",
  "required": ["receiptId", "paymentId", "fiscalNumber", "receiptDateTime", "fiscalizationStatus", "amount", "payment"],
  "properties": {
    "receiptId": {
      "type": "integer",
      "minimum": 1,
      "description": "Уникальный идентификатор чека"
    },
    "paymentId": {
      "type": "integer",
      "minimum": 1,
      "description": "Идентификатор связанного платежа"
    },
    "fiscalNumber": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "description": "Фискальный номер чека (присваивается ОФД)"
    },
    "receiptDateTime": {
      "type": "string",
      "format": "date-time",
      "description": "Дата и время формирования чека (ISO 8601, +03:00)"
    },
    "fiscalizationStatus": {
      "type": "string",
      "enum": ["PENDING", "FISCALIZED", "ERROR"],
      "description": "Статус фискализации чека (маппинг: ОЖИДАНИЕ / ФИСКАЛИЗАЦИЯ / ОШИБКА)"
    },
    "amount": {
      "type": "number",
      "exclusiveMinimum": 0,
      "multipleOf": 0.01,
      "description": "Сумма чека (> 0, 2 знака после запятой)"
    },
    "payment": {
      "$ref": "#/$defs/PaymentSummary",
      "description": "Краткая информация о связанном платеже"
    }
  },
  "additionalProperties": false,
  "$defs": {
    "PaymentSummary": {
      "type": "object",
      "description": "Вложенный объект с данными платежа, к которому привязан чек",
      "required": ["paymentId", "amount", "currency", "paymentMethod", "status", "initiatedAt", "paymentPurpose"],
      "properties": {
        "paymentId": {
          "type": "integer",
          "minimum": 1,
          "description": "Идентификатор платежа"
        },
        "amount": {
          "type": "number",
          "exclusiveMinimum": 0,
          "multipleOf": 0.01,
          "description": "Сумма платежа"
        },
        "currency": {
          "type": "string",
          "pattern": "^[A-Z]{3}$",
          "description": "Код валюты ISO 4217"
        },
        "paymentMethod": {
          "type": "string",
          "enum": ["CARD_AT_TERMINAL", "CARD_AT_GUARD", "ONLINE_PERSONAL_ACCOUNT", "AUTO_DEBIT"],
          "description": "Способ оплаты (маппинг: КАРТА У СТОЙКИ / КАРТА У ОХРАНЫ / ОНЛАЙН ЛК / АВТОСПИСАНИЕ)"
        },
        "status": {
          "type": "string",
          "enum": ["INITIALIZED", "SUCCESS", "CANCELLED", "ERROR"],
          "description": "Статус платежа (маппинг: ИНИЦИАЛИЗИРОВАН / УСПЕШЕН / ОТМЕНЕН / ОШИБКА)"
        },
        "initiatedAt": {
          "type": "string",
          "format": "date-time",
          "description": "Время инициализации платежа"
        },
        "completedAt": {
          "type": ["string", "null"],
          "format": "date-time",
          "description": "Время завершения платежа (null, если еще не завершен)"
        },
        "paymentPurpose": {
          "type": "string",
          "enum": ["PARKING", "PENALTY", "SUBSCRIPTION", "OTHER"],
          "description": "Назначение платежа (маппинг: ПАРКОВКА / ШТРАФ / АБОНЕМЕНТ / ПРОЧЕЕ)"
        }
      },
      "additionalProperties": false
    }
  }
}
```

## Инварианты и ограничения

- Все корневые поля чека (`receiptId`, `paymentId`, `fiscalNumber`, `receiptDateTime`, `fiscalizationStatus`, `amount`, `payment`) обязательны; дополнительные поля на верхнем уровне запрещены (`additionalProperties: false`).
- `receiptId` и `paymentId` — положительные целые числа (минимум 1).
- `fiscalNumber` — непустая строка длиной до 100 символов, присваивается ОФД.
- `receiptDateTime` и `payment.initiatedAt` — обязательные строки в формате ISO 8601; рабочий часовой пояс ответа — `+03:00` (Europe/Moscow).
- `fiscalizationStatus` ограничен значениями `PENDING`, `FISCALIZED`, `ERROR`.
- `amount` (на верхнем уровне и в `payment.amount`) — число строго больше нуля, кратное `0.01` (два знака после запятой).
- `payment.currency` — трехбуквенный код ISO 4217 заглавными латинскими буквами (например, `RUB`).
- `payment.paymentMethod` ограничен перечислением `CARD_AT_TERMINAL`, `CARD_AT_GUARD`, `ONLINE_PERSONAL_ACCOUNT`, `AUTO_DEBIT`.
- `payment.status` ограничен значениями `INITIALIZED`, `SUCCESS`, `CANCELLED`, `ERROR`.
- `payment.paymentPurpose` ограничен значениями `PARKING`, `PENALTY`, `SUBSCRIPTION`, `OTHER`.
- `payment.completedAt` допускает `null` — если платеж еще не завершен; при завершенном платеже это строка в формате ISO 8601.
- Поле `payment.completedAt` единственное необязательное во вложенном объекте; остальные поля `payment` обязательны. Дополнительные поля внутри `payment` запрещены.

## Связанные документы

- [OpenAPI-контракт REST-метода — UC-10.6](openapi-uc-10-6-receipt.md) — полный REST-контракт метода `GET /payments/{paymentId}/receipt` с HTTP-обвязкой, security и кодами ответа.
- [JSON-пример ответа — UC-10.6](payload-uc-10-6-receipt.md) — каноничный пример полезной нагрузки.
- [JSON-схема ответа — UC-10.2-1](schema-uc-10-2-payment.md) — родственная схема ответа платежного сервиса по оплате парковочной сессии.
- [Маппинг обмена данными с ЮKassa](yookassa-data-mapping.md) — соответствие полей ответа внутренней модели `payment.*`.
- [Регламент взаимодействия ИС](is-interaction-regulation.md) — направления обмена, в которых участвует данный ответ.
- [Индекс интеграционной архитектуры](readme.md) — общий каталог раздела.
