# WSDL-контракт SOAP-сервиса — UC-10.6 Получение платежного чека

Документ фиксирует SOAP-контракт сервиса фискализации `ReceiptService` для операции `GetReceipt` сценария UC-10.6 «Получить чек». В одном артефакте собраны WSDL-описание, конверт SOAP-запроса, XSD-схема запроса, конверт SOAP-ответа и XSD-схема ответа.

WSDL описывает SOAP 1.1 binding по стилю `document/literal` и адрес конечной точки `https://api.parking.example.com/soap/v1/receipt`. Контракт является SOAP-аналогом [REST-контракта `GET /payments/{paymentId}/receipt`](openapi-uc-10-6-receipt.md).

## Оглавление

- [Назначение](#назначение)
- [Контекст применения](#контекст-применения)
- [WSDL-контракт](#wsdl-контракт)
- [SOAP-запрос](#soap-запрос)
- [XSD-схема запроса](#xsd-схема-запроса)
- [SOAP-ответ](#soap-ответ)
- [XSD-схема ответа](#xsd-схема-ответа)
- [Связанные документы](#связанные-документы)

## Назначение

Документ нужен, чтобы:

- зафиксировать формальный SOAP-контракт операции `GetReceipt` для процесса UC-10.6;
- описать конверты и XSD-схемы запроса и ответа, достаточные для генерации SOAP-клиентов и серверной обвязки;
- дать опору для контрактного тестирования SOAP-канала и взаимодействия с внешними SOAP-клиентами фискализации.

## Контекст применения

Операция `GetReceipt` возвращает фискальный чек по идентификатору платежа. Клиент ФЛ может запросить чек только для своих платежей. Чек доступен только для платежей со статусом `SUCCESS`. Передача чека внешним системам происходит после успешной фискализации в ОФД (см. `INT-006`, `INT-007`).

WSDL импортирует [XSD-схему ответа — UC-10.6](schema-uc-10-6-receipt-xml.md) через `xs:import` пространства имен `http://parking.example.com/schemas/receipt`. Полезная нагрузка тела ответа описана отдельно как XML-пример: [XML-пример ответа — UC-10.6](payload-uc-10-6-receipt-xml.md).

REST-аналог контракта зафиксирован в [OpenAPI-контракте REST-метода — UC-10.6](openapi-uc-10-6-receipt.md); JSON-вариант полезной нагрузки и схемы — в [JSON-примере](payload-uc-10-6-receipt.md) и [JSON-схеме](schema-uc-10-6-receipt.md).

## WSDL-контракт

```xml
<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://schemas.xmlsoap.org/wsdl/"
             xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
             xmlns:tns="http://parking.example.com/services/receipt"
             xmlns:rcpt="http://parking.example.com/schemas/receipt"
             xmlns:xs="http://www.w3.org/2001/XMLSchema"
             name="ReceiptService"
             targetNamespace="http://parking.example.com/services/receipt">

    <types>
        <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
                   xmlns:tns="http://parking.example.com/services/receipt"
                   xmlns:rcpt="http://parking.example.com/schemas/receipt"
                   targetNamespace="http://parking.example.com/services/receipt"
                   elementFormDefault="qualified">

            <xs:import namespace="http://parking.example.com/schemas/receipt"
                       schemaLocation="UC-10.6_receipt_schema.xsd"/>

            <!-- Запрос -->
            <xs:element name="GetReceiptRequest">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element name="paymentId" type="xs:positiveInteger">
                            <xs:annotation>
                                <xs:documentation>
                                    Идентификатор платежа (FK -> Платеж.идПлатеж),
                                    для которого запрашивается фискальный чек.
                                </xs:documentation>
                            </xs:annotation>
                        </xs:element>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>

            <!-- Успешный ответ -->
            <xs:element name="GetReceiptResponse">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element ref="rcpt:receipt">
                            <xs:annotation>
                                <xs:documentation>
                                    Фискальный чек с вложенными данными платежа.
                                    Структура определена в schema-uc-10-6-receipt-xml.md.
                                </xs:documentation>
                            </xs:annotation>
                        </xs:element>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>

            <!-- Ошибка -->
            <xs:element name="ReceiptFault">
                <xs:complexType>
                    <xs:sequence>
                        <xs:element name="errorCode" type="tns:ErrorCodeEnum"/>
                        <xs:element name="message"   type="xs:string"/>
                        <xs:element name="timestamp" type="xs:dateTime"/>
                    </xs:sequence>
                </xs:complexType>
            </xs:element>

            <!-- Коды ошибок -->
            <xs:simpleType name="ErrorCodeEnum">
                <xs:restriction base="xs:string">
                    <xs:enumeration value="RECEIPT_NOT_FOUND"/>
                    <xs:enumeration value="PAYMENT_NOT_FOUND"/>
                    <xs:enumeration value="UNAUTHORIZED"/>
                    <xs:enumeration value="FORBIDDEN"/>
                    <xs:enumeration value="OFD_UNAVAILABLE"/>
                </xs:restriction>
            </xs:simpleType>

        </xs:schema>
    </types>

    <!-- Сообщения -->

    <message name="GetReceiptInput">
        <part name="parameters" element="tns:GetReceiptRequest"/>
    </message>

    <message name="GetReceiptOutput">
        <part name="parameters" element="tns:GetReceiptResponse"/>
    </message>

    <message name="GetReceiptFault">
        <part name="fault" element="tns:ReceiptFault"/>
    </message>

    <!-- Интерфейс сервиса -->

    <portType name="ReceiptPortType">
        <operation name="GetReceipt">
            <documentation>
                Получить фискальный чек по идентификатору платежа. Клиент ФЛ может
                запросить чек только для своих платежей. Чек доступен только для
                платежей со статусом SUCCESS.
            </documentation>
            <input  message="tns:GetReceiptInput"/>
            <output message="tns:GetReceiptOutput"/>
            <fault  name="ReceiptFault" message="tns:GetReceiptFault"/>
        </operation>
    </portType>

    <!-- Привязка интерфейса к протоколу SOAP 1.1 -->

    <binding name="ReceiptSoapBinding" type="tns:ReceiptPortType">
        <soap:binding style="document"
                      transport="http://schemas.xmlsoap.org/soap/http"/>
        <operation name="GetReceipt">
            <soap:operation soapAction="http://parking.example.com/services/receipt/GetReceipt"/>
            <input>
                <soap:body use="literal"/>
            </input>
            <output>
                <soap:body use="literal"/>
            </output>
            <fault name="ReceiptFault">
                <soap:fault name="ReceiptFault" use="literal"/>
            </fault>
        </operation>
    </binding>

    <!-- Адрес сервиса -->

    <service name="ReceiptService">
        <documentation>
            Сервис получения фискальных чеков. Часть платформы управления парковкой.
            Интеграция с ОФД для фискализации.
        </documentation>
        <port name="ReceiptPort" binding="tns:ReceiptSoapBinding">
            <soap:address location="https://api.parking.example.com/soap/v1/receipt"/>
        </port>
    </service>

</definitions>
```

## SOAP-запрос

Конверт запроса по стилю `document/literal`. SOAP Action: `http://parking.example.com/services/receipt/GetReceipt`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:svc="http://parking.example.com/services/receipt">
    <soap:Header/>
    <soap:Body>
        <svc:GetReceiptRequest>
            <svc:paymentId>7823</svc:paymentId>
        </svc:GetReceiptRequest>
    </soap:Body>
</soap:Envelope>
```

## XSD-схема запроса

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
           xmlns:tns="http://parking.example.com/services/receipt"
           targetNamespace="http://parking.example.com/services/receipt"
           elementFormDefault="qualified">

    <xs:element name="GetReceiptRequest">
        <xs:complexType>
            <xs:sequence>
                <xs:element name="paymentId" type="xs:positiveInteger">
                    <xs:annotation>
                        <xs:documentation>
                            Идентификатор платежа (Платеж.идПлатеж),
                            для которого запрашивается фискальный чек.
                        </xs:documentation>
                    </xs:annotation>
                </xs:element>
            </xs:sequence>
        </xs:complexType>
    </xs:element>

</xs:schema>
```

## SOAP-ответ

Конверт успешного ответа `GetReceiptResponse` с вложенным элементом `receipt` пространства имен `http://parking.example.com/schemas/receipt`.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
               xmlns:svc="http://parking.example.com/services/receipt"
               xmlns:rcpt="http://parking.example.com/schemas/receipt">
    <soap:Header/>
    <soap:Body>
        <svc:GetReceiptResponse>
            <rcpt:receipt>
                <rcpt:receiptId>4501</rcpt:receiptId>
                <rcpt:paymentId>7823</rcpt:paymentId>
                <rcpt:fiscalNumber>0001-1234-5678-9123</rcpt:fiscalNumber>
                <rcpt:receiptDateTime>2026-05-20T12:02:00+03:00</rcpt:receiptDateTime>
                <rcpt:fiscalizationStatus>FISCALIZED</rcpt:fiscalizationStatus>
                <rcpt:amount>350.00</rcpt:amount>
                <rcpt:payment>
                    <rcpt:paymentId>7823</rcpt:paymentId>
                    <rcpt:amount>350.00</rcpt:amount>
                    <rcpt:currency>RUB</rcpt:currency>
                    <rcpt:paymentMethod>ONLINE_PERSONAL_ACCOUNT</rcpt:paymentMethod>
                    <rcpt:status>SUCCESS</rcpt:status>
                    <rcpt:initiatedAt>2026-05-20T12:00:00+03:00</rcpt:initiatedAt>
                    <rcpt:completedAt>2026-05-20T12:00:15+03:00</rcpt:completedAt>
                    <rcpt:paymentPurpose>PARKING</rcpt:paymentPurpose>
                </rcpt:payment>
            </rcpt:receipt>
        </svc:GetReceiptResponse>
    </soap:Body>
</soap:Envelope>
```

## XSD-схема ответа

Схема `GetReceiptResponse` импортирует receipt-схему (`xs:import`) — формальное описание receipt-структуры см. в [XSD-схеме ответа — UC-10.6](schema-uc-10-6-receipt-xml.md).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema"
           xmlns:tns="http://parking.example.com/services/receipt"
           xmlns:rcpt="http://parking.example.com/schemas/receipt"
           targetNamespace="http://parking.example.com/services/receipt"
           elementFormDefault="qualified">

    <xs:import namespace="http://parking.example.com/schemas/receipt"
               schemaLocation="UC-10.6_receipt_schema.xsd"/>

    <xs:element name="GetReceiptResponse">
        <xs:complexType>
            <xs:sequence>
                <xs:element ref="rcpt:receipt">
                    <xs:annotation>
                        <xs:documentation>
                            Фискальный чек с вложенными данными платежа.
                            Структура определена в schema-uc-10-6-receipt-xml.md.
                        </xs:documentation>
                    </xs:annotation>
                </xs:element>
            </xs:sequence>
        </xs:complexType>
    </xs:element>

</xs:schema>
```

## Связанные документы

- [XML-пример ответа — UC-10.6](payload-uc-10-6-receipt-xml.md) — каноничный пример полезной нагрузки `receipt` (без SOAP-обертки).
- [XSD-схема ответа — UC-10.6](schema-uc-10-6-receipt-xml.md) — формальная XSD-схема receipt-структуры, импортируемая через `xs:import`.
- [OpenAPI-контракт REST-метода — UC-10.6](openapi-uc-10-6-receipt.md) — REST-аналог контракта `GET /payments/{paymentId}/receipt`.
- [JSON-пример ответа — UC-10.6](payload-uc-10-6-receipt.md) — REST-аналог полезной нагрузки в формате JSON.
- [JSON-схема ответа — UC-10.6](schema-uc-10-6-receipt.md) — формальная JSON Schema REST-ответа.
- [UML Sequence Diagram — UC-10.6 Получить чек](sequence-uc-10-6-receipt.md) — последовательность взаимодействия клиента и сервиса фискализации, на которую опирается SOAP-контракт.
- [Регламент взаимодействия ИС](is-interaction-regulation.md) — направления обмена, в которых участвует данный контракт.
- [Индекс интеграционной архитектуры](readme.md) — общий каталог раздела.
