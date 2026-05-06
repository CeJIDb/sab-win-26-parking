"""
Открывает браузер для ручного входа в Google и сохраняет сессию.

Запуск:
    .venv/bin/python scripts/google-auth.py

После успешного входа сессия сохраняется в .google-session.json
"""

import sys
from playwright.sync_api import sync_playwright

SESSION_FILE = ".google-session.json"
TARGET_URL = "https://docs.google.com/presentation/d/1wuHLrEKdVcc8Pwp284Xvbqwfhg7XSS10IfiBU1-8vX0/edit"

print("Открываю браузер... ищи окно в панели задач Windows.")

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=False,
        args=["--disable-blink-features=AutomationControlled", "--start-maximized"],
    )
    ctx = browser.new_context(no_viewport=True)
    page = ctx.new_page()

    page.goto("https://accounts.google.com/signin")
    print("Войди в аккаунт Google. Скрипт ждёт до 5 минут.")

    # Ждём пока окажемся на myaccount.google.com или docs.google.com
    try:
        page.wait_for_url(
            lambda url: (
                "myaccount.google.com" in url
                or ("docs.google.com" in url and "presentation" in url)
                or "mail.google.com" in url
                or url.startswith("https://www.google.com")
            ),
            timeout=300_000,
        )
    except Exception:
        print("Время ожидания истекло.")
        browser.close()
        sys.exit(1)

    # После входа открываем презентацию, чтобы получить нужные куки
    print("Вход выполнен. Открываю презентацию для получения сессии...")
    page.goto(TARGET_URL)
    page.wait_for_timeout(5_000)  # Google Slides — SPA, networkidle не достигает

    ctx.storage_state(path=SESSION_FILE)
    print(f"Сессия сохранена в {SESSION_FILE}")

    browser.close()
