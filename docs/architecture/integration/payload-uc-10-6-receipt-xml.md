# XML-пример ответа — UC-10.6 Получение платежного чека

Документ фиксирует каноничный XML-пример полезной нагрузки ответа в сценарии получения платежного чека с данными связанного платежа для use case UC-10.6, оформленный по протоколу SOAP.

Пример используется как опора для реализации серверной части SOAP-сервиса фискализации, интеграционного тестирования контракта и генерации мок-ответов в тестовых окружениях.

## Оглавление

- [Назначение](#назначение)
- [Контекст применения](#контекст-применения)
- [Пример SOAP-ответа](#пример-soap-ответа)
- [Семантика полей](#семантика-полей)
- [Связанные документы](#связанные-документы)

## Назначение

Документ нужен, чтобы:

- зафиксировать согласованный XML-формат ответа для процесса UC-10.6 на SOAP-канале;
- дать разработчику и QA каноничный пример для реализации и контрактных проверок;
- служить опорой для генерации мок-ответов в тестовых окружениях SOAP-клиентов.

## Контекст применения

Ответ относится к процессу `UC-10.6 — Получить чек`. Он возвращается SOAP-операцией `GetReceipt` сервиса фискализации после формирования платежного чека по завершенному платежу. В корневом элементе `receipt` расположены реквизиты чека, а вложенный элемент `payment` содержит краткие сведения о связанном платеже. Дочерние элементы относятся к пространству имен `http://parking.example.com/schemas/receipt` (префикс `rcpt:`).

Формально структура описана в [XSD-схеме ответа — UC-10.6](schema-uc-10-6-receipt-xml.md), а полный SOAP-контракт (WSDL, конверты запроса и ответа) — в [WSDL-контракте SOAP-сервиса — UC-10.6](wsdl-uc-10-6-receipt.md). REST-аналог контракта зафиксирован в [OpenAPI-контракте REST-метода — UC-10.6](openapi-uc-10-6-receipt.md), а JSON-вариант полезной нагрузки — в [JSON-примере ответа — UC-10.6](payload-uc-10-6-receipt.md).

## Пример SOAP-ответа

```xml
<?xml version="1.0" encoding="UTF-8"?>
<receipt xmlns="http://parking.example.com/schemas/receipt"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://parking.example.com/schemas/receipt UC-10.6_receipt_schema.xsd">

    <receiptId>4501</receiptId>
    <paymentId>7823</paymentId>
    <fiscalNumber>0001-1234-5678-9876</fiscalNumber>
    <receiptDateTime>2026-05-19T20:02:00+03:00</receiptDateTime>
    <fiscalizationStatus>FISCALIZED</fiscalizationStatus>
    <amount>350.00</amount>

    <payment>
        <paymentId>7823</paymentId>
        <amount>350.00</amount>
        <currency>RUB</currency>
        <paymentMethod>ONLINE_PERSONAL_ACCOUNT</paymentMethod>
        <status>SUCCESS</status>
        <initiatedAt>2026-05-19T20:00:00+03:00</initiatedAt>
        <completedAt>2026-05-19T20:01:00+03:00</completedAt>
        <paymentPurpose>PARKING</paymentPurpose>
    </payment>

</receipt>
```

## Семантика полей

| Элемент                  | Тип                         | Описание                                                                                                               |
| ------------------------ | --------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `receiptId`              | positiveInteger             | Уникальный идентификатор чека во внутренней модели платформы парковки                                                  |
| `paymentId`              | positiveInteger             | Идентификатор связанного платежа (совпадает с `payment/paymentId`)                                                     |
| `fiscalNumber`           | string                      | Фискальный номер чека, присвоенный ОФД                                                                                 |
| `receiptDateTime`        | dateTime (ISO 8601)         | Момент формирования чека в часовом поясе `+03:00` (Europe/Moscow)                                                      |
| `fiscalizationStatus`    | string (enum)               | Статус фискализации: `PENDING`, `FISCALIZED`, `ERROR` (маппинг: ОЖИДАНИЕ / ФИСКАЛИЗАЦИЯ / ОШИБКА)                      |
| `amount`                 | decimal                     | Сумма чека в валюте платежа, два знака после запятой, строго больше нуля                                               |
| `payment/paymentId`      | positiveInteger             | Идентификатор платежа во внутренней модели платформы парковки                                                          |
| `payment/amount`         | decimal                     | Сумма платежа, два знака после запятой, строго больше нуля                                                             |
| `payment/currency`       | string (pattern `[A-Z]{3}`) | Код валюты в формате ISO 4217 (например, `RUB`)                                                                        |
| `payment/paymentMethod`  | string (enum)               | Способ оплаты: `CARD_AT_TERMINAL`, `CARD_AT_GUARD`, `ONLINE_PERSONAL_ACCOUNT`, `AUTO_DEBIT`                            |
| `payment/status`         | string (enum)               | Статус платежа: `INITIALIZED`, `SUCCESS`, `CANCELLED`, `ERROR` (маппинг: ИНИЦИАЛИЗИРОВАН / УСПЕШЕН / ОТМЕНЕН / ОШИБКА) |
| `payment/initiatedAt`    | dateTime                    | Момент инициализации платежа                                                                                           |
| `payment/completedAt`    | dateTime (необязательный)   | Момент завершения платежа; элемент отсутствует, если платеж еще не завершен                                            |
| `payment/paymentPurpose` | string (enum)               | Назначение платежа: `PARKING`, `PENALTY`, `SUBSCRIPTION`, `OTHER` (маппинг: ПАРКОВКА / ШТРАФ / АБОНЕМЕНТ / ПРОЧЕЕ)     |

## Связанные документы

- [XSD-схема ответа — UC-10.6](schema-uc-10-6-receipt-xml.md) — формальная XSD-схема ответа SOAP-сервиса.
- [WSDL-контракт SOAP-сервиса — UC-10.6](wsdl-uc-10-6-receipt.md) — полный SOAP-контракт операции `GetReceipt` с конвертами запроса и ответа, fault и привязкой к SOAP 1.1.
- [JSON-пример ответа — UC-10.6](payload-uc-10-6-receipt.md) — REST-аналог полезной нагрузки в формате JSON.
- [JSON-схема ответа — UC-10.6](schema-uc-10-6-receipt.md) — формальная JSON Schema REST-ответа.
- [OpenAPI-контракт REST-метода — UC-10.6](openapi-uc-10-6-receipt.md) — REST-контракт `GET /payments/{paymentId}/receipt`.
- [UML Sequence Diagram — UC-10.6 Получить чек](sequence-uc-10-6-receipt.md) — последовательность взаимодействия клиента и сервиса фискализации.
- [Регламент взаимодействия ИС](is-interaction-regulation.md) — направления обмена, в которых участвует данный ответ.
- [Индекс интеграционной архитектуры](readme.md) — общий каталог раздела.
