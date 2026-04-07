# Слайд: Контексты ES TO-BE по группам

## Назначение

Этот файл показывает контексты ES TO-BE не одной перегруженной схемой, а несколькими отдельными диаграммами по группам: `Core`, `Supporting` и `Generic`. Такой формат удобнее для Google Slides и для пошагового объяснения архитектурной декомпозиции.

## Рекомендуемый заголовок

`Контексты ES TO-BE по группам ответственности`

## Как использовать в презентации

- Вариант 1: собрать один слайд с тремя отдельными блоками `Core`, `Supporting`, `Generic`.
- Вариант 2: сделать 2 слайда:
- слайд 1: `Core`
- слайд 2: `Supporting + Generic`
- Вариант 3: показать сначала `Core`, а затем отдельным кадром supporting и generic-контуры.

## Диаграмма 1. Core

```mermaid
flowchart TB
    accTitle: ES TO-BE Core Contexts
    accDescr: Диаграмма показывает core-контексты платформы парковки, в которых сосредоточена основная предметная логика.

    title["Core-контексты"]

    subgraph core[" "]
        direction LR
        booking["1. Управление бронированием<br/>Бронирование"]
        access["2. Управление допуском"]
        session["3. Управление парковочной сессией<br/>ПС + ПМ"]
        tariff["4. Управление тарифами<br/>Тариф"]
    end

    booking -. основание доступа .-> access
    access -. факт въезда и выезда .-> session
    tariff -. правила расчета .-> session

    classDef title fill:#ffffff,stroke:#ffffff,color:#8b5e34,font-size:26px,font-weight:bold
    classDef core fill:#e8f1ff,stroke:#2563eb,stroke-width:2px,color:#0f172a
    classDef group fill:#ffffff,stroke:#ffffff,color:#ffffff

    class title title
    class booking,access,session,tariff core
    class core group
```

## Диаграмма 2. Supporting

```mermaid
flowchart TB
    accTitle: ES TO-BE Supporting Contexts
    accDescr: Диаграмма показывает supporting-контексты, которые обеспечивают ядро платформы данными, документами, оплатой, инфраструктурой и интеграциями.

    title["Supporting-контексты"]

    subgraph supporting[" "]
        direction LR
        contracts["5. Управление договорами<br/>Договор"]
        client["6. Управление профилем клиента<br/>Клиент + ТС + Организация"]
        employee["7. Управление профилем сотрудника<br/>Сотрудник"]
        payment["8. Оплата<br/>Платеж + Чек"]
        infra["9. Управление инфраструктурой парковки<br/>Парковка + Сектор + ПМ + КПП"]
        appeals["10. Управление обращениями<br/>Обращение"]
        skud["13. Адаптер СКУД"]
        displays["14. Адаптер дисплеев и табло"]
    end

    client -. данные клиента и ТС .-> contracts
    contracts -. договорное основание .-> payment
    infra -. ресурсы парковки .-> payment
    appeals -. обращения и эскалации .-> employee
    skud -. команды и события КПП .-> infra
    displays -. статусы и сообщения .-> infra

    classDef title fill:#ffffff,stroke:#ffffff,color:#8b5e34,font-size:26px,font-weight:bold
    classDef supporting fill:#fff7ed,stroke:#ea580c,stroke-width:1.5px,color:#431407
    classDef adapter fill:#ecfccb,stroke:#65a30d,stroke-width:1.5px,color:#1f2937
    classDef group fill:#ffffff,stroke:#ffffff,color:#ffffff

    class title title
    class contracts,client,employee,payment,infra,appeals supporting
    class skud,displays adapter
    class supporting group
```

## Диаграмма 3. Generic

```mermaid
flowchart TB
    accTitle: ES TO-BE Generic Contexts
    accDescr: Диаграмма показывает generic-контексты, которые обслуживают разные части платформы как сквозные сервисы.

    title["Generic-контексты"]

    subgraph generic[" "]
        direction LR
        notify["11. Управление уведомлениями<br/>Уведомление"]
        analytics["12. Аналитика<br/>Отчет"]
    end

    notify -. уведомляет другие контуры .-> analytics

    classDef title fill:#ffffff,stroke:#ffffff,color:#8b5e34,font-size:26px,font-weight:bold
    classDef generic fill:#f5f3ff,stroke:#7c3aed,stroke-width:1.5px,color:#2e1065
    classDef group fill:#ffffff,stroke:#ffffff,color:#ffffff

    class title title
    class notify,analytics generic
    class generic group
```

## Как лучше собрать в Google Slides

- Если нужен один слайд, разместить 3 диаграммы вертикально: `Core` сверху, `Supporting` по центру, `Generic` снизу.
- Если нужен более читаемый формат, вынести `Core` на отдельный слайд, а `Supporting` и `Generic` показать следующим слайдом.
- Самым насыщенным по цвету сделать `Core`, supporting оставить спокойнее, generic показать как сервисный нижний слой.

## Что проговаривать устно

- `Core` содержит основную бизнес-логику парковочной платформы.
- `Supporting` обеспечивает ядро документами, профилями, инфраструктурой, оплатой и интеграционными адаптерами.
- `Generic` дает сквозные сервисы, которые используются разными контекстами.
