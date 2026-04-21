from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=False)
    context = browser.new_context()
    page = context.new_page()

    page.goto("https://www.instagram.com/")

    print("👉 Inicia sesión manualmente en Instagram")
    input("👉 Cuando ya estés dentro, presiona ENTER aquí")

    context.storage_state(path="cookies.json")

    print("✅ Cookies guardadas correctamente")

    browser.close()