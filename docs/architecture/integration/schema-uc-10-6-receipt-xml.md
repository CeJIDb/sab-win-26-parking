# XSD-схема ответа — UC-10.6 Получение платежного чека

Документ фиксирует формальную XSD-схему ответа SOAP-сервиса фискализации в сценарии получения платежного чека с данными связанного платежа (UC-10.6).

Схема описывает структуру элемента `receipt` — корня XML-ответа, в котором верхние поля содержат реквизиты чека, а вложенный элемент `payment` — краткие сведения о связанном платеже.

## Оглавление

- [Назначение](#назначение)
- [Контекст применения](#контекст-применения)
- [XSD Schema](#xsd-schema)
- [Инварианты и ограничения](#инварианты-и-ограничения)
- [Связанные документы](#связанные-документы)

## Назначение

Документ нужен, чтобы:

- задать формальный XML-контракт ответа для процесса UC-10.6 на SOAP-канале;
- служить опорой для автоматической валидации XML-ответов в тестах и в рантайме;
- зафиксировать допустимые значения статусов, способов оплаты и назначений платежа, а также обязательные поля.

## Контекст применения

Схема описывает структуру `receipt`, возвращаемую SOAP-операцией `GetReceipt` сервиса фискализации. Каноничный пример полезной нагрузки приведен в [XML-примере ответа — UC-10.6](payload-uc-10-6-receipt-xml.md). Полный SOAP-контракт (WSDL, конверт запроса, конверт ответа, fault) описан в [WSDL-контракте SOAP-сервиса — UC-10.6](wsdl-uc-10-6-receipt.md); схема `GetReceiptResponse` импортирует данную receipt-схему через `xs:import`. JSON-аналог зафиксирован в [JSON-схеме ответа — UC-10.6](schema-uc-10-6-receipt.md).

Целевое пространство имен схемы — `http://parking.example.com/schemas/receipt`.

## XSD Schema

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
           xmlns:tns="http://parking.example.com/schemas/receipt"
           targetNamespace="http://parking.example.com/schemas/receipt"
           elementFormDefault="qualified">

    <xs:element name="receipt" type="tns:ReceiptType"/>

    <xs:complexType name="ReceiptType">
        <xs:sequence>
            <xs:element name="receiptId" type="tns:PositiveId"/>
            <xs:element name="paymentId" type="tns:PositiveId"/>
            <xs:element name="fiscalNumber" type="tns:FiscalNumberType"/>
            <xs:element name="receiptDateTime" type="xs:dateTime"/>
            <xs:element name="fiscalizationStatus" type="tns:FiscalizationStatusEnum"/>
            <xs:element name="amount" type="tns:MoneyType"/>
            <xs:element name="payment" type="tns:PaymentType"/>
        </xs:sequence>
    </xs:complexType>

    <xs:complexType name="PaymentType">
        <xs:sequence>
            <xs:element name="paymentId" type="tns:PositiveId"/>
            <xs:element name="amount" type="tns:MoneyType"/>
            <xs:element name="currency" type="tns:CurrencyType"/>
            <xs:element name="paymentMethod" type="tns:PaymentMethodEnum"/>
            <xs:element name="status" type="tns:PaymentStatusEnum"/>
            <xs:element name="initiatedAt" type="xs:dateTime"/>
            <xs:element name="completedAt" type="xs:dateTime" minOccurs="0"/>
            <xs:element name="paymentPurpose" type="tns:PaymentPurposeEnum"/>
        </xs:sequence>
    </xs:complexType>

    <!-- Переиспользуемые типы -->

    <xs:simpleType name="PositiveId">
        <xs:restriction base="xs:positiveInteger"/>
    </xs:simpleType>

    <xs:simpleType name="MoneyType">
        <xs:restriction base="xs:decimal">
            <xs:minExclusive value="0"/>
            <xs:fractionDigits value="2"/>
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="CurrencyType">
        <xs:restriction base="xs:string">
            <xs:pattern value="[A-Z]{3}"/>
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="FiscalNumberType">
        <xs:restriction base="xs:string">
            <xs:minLength value="1"/>
            <xs:maxLength value="100"/>
        </xs:restriction>
    </xs:simpleType>

    <!-- Перечисления (enum) -->

    <xs:simpleType name="FiscalizationStatusEnum">
        <xs:restriction base="xs:string">
            <xs:enumeration value="PENDING"/>
            <xs:enumeration value="FISCALIZED"/>
            <xs:enumeration value="ERROR"/>
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="PaymentMethodEnum">
        <xs:restriction base="xs:string">
            <xs:enumeration value="CARD_AT_TERMINAL"/>
            <xs:enumeration value="CARD_AT_GUARD"/>
            <xs:enumeration value="ONLINE_PERSONAL_ACCOUNT"/>
            <xs:enumeration value="AUTO_DEBIT"/>
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="PaymentStatusEnum">
        <xs:restriction base="xs:string">
            <xs:enumeration value="INITIALIZED"/>
            <xs:enumeration value="SUCCESS"/>
            <xs:enumeration value="CANCELLED"/>
            <xs:enumeration value="ERROR"/>
        </xs:restriction>
    </xs:simpleType>

    <xs:simpleType name="PaymentPurposeEnum">
        <xs:restriction base="xs:string">
            <xs:enumeration value="PARKING"/>
            <xs:enumeration value="PENALTY"/>
            <xs:enumeration value="SUBSCRIPTION"/>
            <xs:enumeration value="OTHER"/>
        </xs:restriction>
    </xs:simpleType>

</xs:schema>
```

## Инварианты и ограничения

- Все корневые элементы чека (`receiptId`, `paymentId`, `fiscalNumber`, `receiptDateTime`, `fiscalizationStatus`, `amount`, `payment`) обязательны и идут в фиксированном порядке (`xs:sequence`).
- `receiptId` и `paymentId` — положительные целые числа (минимум 1, тип `xs:positiveInteger`).
- `fiscalNumber` — непустая строка длиной до 100 символов, присваивается ОФД.
- `receiptDateTime` и `payment/initiatedAt` — обязательные элементы типа `xs:dateTime`; рабочий часовой пояс ответа — `+03:00` (Europe/Moscow).
- `fiscalizationStatus` ограничен значениями `PENDING`, `FISCALIZED`, `ERROR`.
- `amount` (на верхнем уровне и в `payment/amount`) — число строго больше нуля (`minExclusive=0`), кратное `0.01` (`fractionDigits=2`).
- `payment/currency` — трехбуквенный код ISO 4217 заглавными латинскими буквами (паттерн `[A-Z]{3}`, например, `RUB`).
- `payment/paymentMethod` ограничен перечислением `CARD_AT_TERMINAL`, `CARD_AT_GUARD`, `ONLINE_PERSONAL_ACCOUNT`, `AUTO_DEBIT`.
- `payment/status` ограничен значениями `INITIALIZED`, `SUCCESS`, `CANCELLED`, `ERROR`.
- `payment/paymentPurpose` ограничен значениями `PARKING`, `PENALTY`, `SUBSCRIPTION`, `OTHER`.
- `payment/completedAt` — единственный необязательный элемент во вложенной `PaymentType` (`minOccurs=0`); при завершенном платеже это `xs:dateTime`. Остальные элементы `payment` обязательны.

## Связанные документы

- [XML-пример ответа — UC-10.6](payload-uc-10-6-receipt-xml.md) — каноничный пример полезной нагрузки.
- [WSDL-контракт SOAP-сервиса — UC-10.6](wsdl-uc-10-6-receipt.md) — полный SOAP-контракт операции `GetReceipt`; импортирует данную receipt-схему через `xs:import`.
- [JSON-схема ответа — UC-10.6](schema-uc-10-6-receipt.md) — REST-аналог в формате JSON Schema.
- [JSON-пример ответа — UC-10.6](payload-uc-10-6-receipt.md) — REST-аналог полезной нагрузки.
- [OpenAPI-контракт REST-метода — UC-10.6](openapi-uc-10-6-receipt.md) — REST-контракт `GET /payments/{paymentId}/receipt`.
- [UML Sequence Diagram — UC-10.6 Получить чек](sequence-uc-10-6-receipt.md) — последовательность взаимодействия клиента и сервиса фискализации.
- [Регламент взаимодействия ИС](is-interaction-regulation.md) — направления обмена, в которых участвует данный ответ.
- [Индекс интеграционной архитектуры](readme.md) — общий каталог раздела.
