# Скрипты подготовки документации

Вспомогательные скрипты для подготовки материалов проектной документации.

## Доступные скрипты

- `extract-docx.py` — извлекает текст из файлов `.docx` в `.txt` (по умолчанию целевой каталог: `docs/transcripts/`).
- `split-image.py` — нарезает крупные изображения артефактов на тайлы в `docs/artifacts/*_tiles/`.

## Запуск

```bash
python scripts/docs/extract-docx.py
python scripts/docs/split-image.py "Контекстная диаграмма.jpg"
```

Подробнее о контексте использования — в [индексе документации](../../docs/readme.md) и в [readme транскрибаций](../../docs/transcripts/readme.md).
