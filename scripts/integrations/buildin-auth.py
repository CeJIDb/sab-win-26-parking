"""
Логин в buildin.ai и сохранение сессии в .playwright-session.json.
Credentials читаются из .env — в контекст Claude не передаются.

Запуск:
    python scripts/buildin-auth.py

Предварительно:
    pip install playwright python-dotenv
    playwright install chromium
"""

from playwright.sync_api import sync_playwright
from dotenv import load_dotenv
import os
import sys

load_dotenv()

email = os.environ.get("BUILDIN_EMAIL", "").strip()
password = os.environ.get("BUILDIN_PASSWORD", "").strip()

if not email or not password:
    print("Ошибка: заполни BUILDIN_EMAIL и BUILDIN_PASSWORD в файле .env")
    sys.exit(1)

SESSION_FILE = ".playwright-session.json"

with sync_playwright() as p:
    browser = p.chromium.launch(
        headless=False,
        args=["--ignore-certificate-errors"],
    )
    ctx = browser.new_context(ignore_https_errors=True)
    page = ctx.new_page()

    print("Открываю страницу логина...")
    page.goto("https://buildin.ai/login")
    page.wait_for_load_state("networkidle")

    page.fill('input[placeholder="Enter your email address"]', email)
    page.fill('input[placeholder="Enter your password"]', password)
    page.click('button:text("Login")')

    print("Жду завершения входа...")
    page.wait_for_url(lambda url: "/login" not in url, timeout=15000)

    ctx.storage_state(path=SESSION_FILE)
    print(f"Сессия сохранена в {SESSION_FILE}")

    browser.close()
