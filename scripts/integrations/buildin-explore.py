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
        viewport={"width": 1920, "height": 8000},
        ignore_https_errors=True,
    )
    page = ctx.new_page()
    print(f"Открываю {URL}")
    page.goto(URL, wait_until="networkidle")
    page.wait_for_timeout(4000)

    # buildin: H1/H2/H3 toggle-блоки сворачивают вложенный контент. Программный
    # element.click() на span.animate-hover не срабатывает — нужен реальный
    # page.mouse.click() по bounding box стрелки. Раскрываем рекурсивно, пока
    # появляются новые стрелки.
    seen_toggles = 0
    for _ in range(8):
        arrows = page.query_selector_all("span.animate-hover")
        if len(arrows) <= seen_toggles:
            break
        for arrow in arrows[seen_toggles:]:
            box = arrow.bounding_box()
            if not box:
                continue
            page.mouse.click(box["x"] + box["width"] / 2, box["y"] + box["height"] / 2)
            page.wait_for_timeout(300)
        seen_toggles = len(arrows)
        page.wait_for_timeout(800)
    print(f"toggles expanded: {seen_toggles}")

    # buildin использует внутренний scroll-контейнер (Notion-like). Скроллим все
    # scrollable элементы + window, чтобы lazy-блоки и виртуализированные строки
    # таблиц отрендерились.
    scroll_js = """
    () => {
        const scrollables = [document.scrollingElement, document.body, document.documentElement];
        for (const el of document.querySelectorAll('*')) {
            const style = getComputedStyle(el);
            const oy = style.overflowY;
            if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 4) {
                scrollables.push(el);
            }
        }
        const results = [];
        for (const el of scrollables) {
            if (!el) continue;
            try {
                const before = el.scrollTop;
                el.scrollTop = el.scrollHeight;
                results.push({
                    tag: el.tagName,
                    cls: (el.className || '').toString().slice(0, 60),
                    sh: el.scrollHeight,
                    ch: el.clientHeight,
                    before, after: el.scrollTop,
                });
            } catch (e) {}
        }
        return results;
    }
    """
    for i in range(30):
        info = page.evaluate(scroll_js)
        page.wait_for_timeout(500)
        # дополнительно жмем End на странице, чтобы триггерить keyboard-скролл
        page.keyboard.press("End")
        page.wait_for_timeout(400)
        if i == 0:
            print(f"scroll containers found: {len(info)}")
    page.wait_for_timeout(1500)
    # Возвращаем все наверх перед скриншотом
    page.evaluate(
        "() => { for (const el of document.querySelectorAll('*')) { try { el.scrollTop = 0; } catch(e) {} } window.scrollTo(0,0); }"
    )
    page.wait_for_timeout(800)

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
