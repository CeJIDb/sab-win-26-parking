"""
Разведка страницы buildin.ai для последующей выгрузки артефактов.

Запуск:
    .venv/bin/python scripts/buildin-explore.py <url>

Использует .playwright-session.json. Если сессия истекла — запусти
scripts/buildin-auth.py, потом повтори.

Сохраняет:
    .playwright-mcp/buildin-explore-full.png  — полный скриншот
    .playwright-mcp/buildin-explore-text.txt  — текст всех блоков
    .playwright-mcp/buildin-explore-links.txt — все ссылки
    .playwright-mcp/buildin-explore-images.txt — все картинки
"""

from playwright.sync_api import sync_playwright
import os
import sys
import pathlib

URL = sys.argv[1] if len(sys.argv) > 1 else None
if not URL:
    print("usage: python scripts/buildin-explore.py <url>")
    sys.exit(1)

SESSION_FILE = ".playwright-session.json"
OUT_DIR = pathlib.Path(".playwright-mcp")
OUT_DIR.mkdir(exist_ok=True)

if not os.path.exists(SESSION_FILE):
    print(f"Нет {SESSION_FILE}. Запусти scripts/buildin-auth.py.")
    sys.exit(1)

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=["--ignore-certificate-errors"])
    ctx = browser.new_context(
        storage_state=SESSION_FILE,
        viewport={"width": 1600, "height": 1000},
        ignore_https_errors=True,
    )
    page = ctx.new_page()
    print(f"Открываю {URL}")
    page.goto(URL, wait_until="networkidle")
    page.wait_for_timeout(4000)

    # Скроллим до конца, чтобы lazy-блоки отрендерились
    last = 0
    for _ in range(40):
        page.evaluate("window.scrollBy(0, 800)")
        page.wait_for_timeout(400)
        h = page.evaluate("document.body.scrollHeight")
        if h == last:
            break
        last = h
    page.evaluate("window.scrollTo(0, 0)")
    page.wait_for_timeout(500)

    # Полный скриншот
    page.screenshot(path=str(OUT_DIR / "buildin-explore-full.png"), full_page=True)

    # Дамп текста, ссылок, картинок
    text = page.evaluate("() => document.body.innerText")
    (OUT_DIR / "buildin-explore-text.txt").write_text(text, encoding="utf-8")

    links = page.evaluate(
        "() => Array.from(document.querySelectorAll('a')).map(a => ({href: a.href, text: a.innerText.trim()}))"
    )
    (OUT_DIR / "buildin-explore-links.txt").write_text(
        "\n".join(f"{l['href']}\t{l['text']}" for l in links), encoding="utf-8"
    )

    images = page.evaluate(
        "() => Array.from(document.querySelectorAll('img')).map(i => ({src: i.src, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight}))"
    )
    (OUT_DIR / "buildin-explore-images.txt").write_text(
        "\n".join(f"{i['w']}x{i['h']}\t{i['alt']}\t{i['src']}" for i in images),
        encoding="utf-8",
    )

    # Заголовок страницы и итоговая высота
    title = page.title()
    height = page.evaluate("document.body.scrollHeight")
    print(f"title={title}")
    print(f"page_height={height}")
    print(f"links={len(links)}, images={len(images)}")

    browser.close()
print("done")
