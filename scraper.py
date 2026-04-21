from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeoutError
import json
import time
from datetime import datetime, UTC

USERNAME = "instagram"        # <-- cambia
COOKIES_FILE = "cookies.json" # <-- asegúrate de tenerlo
MAX_SCROLLS = 8
MAX_POSTS = 8

# -----------------------------
# Utils
# -----------------------------
def safe_text(locator, default="No disponible"):
    try:
        txt = locator.inner_text(timeout=2000)
        if txt:
            return txt.strip()
    except:
        pass
    return default

def safe_attr(locator, attr, default="No disponible"):
    try:
        val = locator.get_attribute(attr, timeout=2000)
        if val:
            return val
    except:
        pass
    return default

def close_popups(page):
    for t in ["Ahora no", "Not Now", "Permitir", "Allow"]:
        try:
            page.locator(f"button:has-text('{t}')").first.click(timeout=1200)
        except:
            pass

def dedupe(seq):
    seen, out = set(), []
    for x in seq:
        if x not in seen:
            seen.add(x)
            out.append(x)
    return out

def scroll_profile(page, max_scrolls):
    prev = 0
    for _ in range(max_scrolls):
        page.mouse.wheel(0, 6000)
        page.wait_for_timeout(1500)
        count = page.locator("a[href*='/p/']").count()
        if count == prev:
            break
        prev = count

# -----------------------------
# Perfil
# -----------------------------
def extract_profile(page, username):
    profile = {
        "username": username,
        "nombre": "No disponible",
        "bio": "No disponible",
        "stats": {}
    }

    try:
        profile["nombre"] = safe_text(page.locator("header h1").first)
    except:
        pass

    # Bio con fallback
    for sel in ["header section div span", "header div span"]:
        txt = safe_text(page.locator(sel).first, default=None)
        if txt:
            profile["bio"] = txt
            break

    # Stats
    try:
        items = page.locator("header ul li").all()
        stats = {}
        for li in items:
            txt = safe_text(li)
            parts = txt.split(" ")
            if len(parts) >= 2:
                stats[parts[-1].lower()] = parts[0]
        profile["stats"] = stats
    except:
        pass

    return profile

# -----------------------------
# Post (modal abierto por click)
# -----------------------------
def extract_post_from_modal(page):
    post = {
        "caption": "No disponible",
        "media": [],
        "fecha": "No disponible",
        "likes": "No disponible"
    }

    # Caption (varios intentos)
    for sel in [
        "article h1",
        "article span",
        "article div[role='button'] span"
    ]:
        txt = safe_text(page.locator(sel).first, default=None)
        if txt and len(txt) > 10:
            post["caption"] = txt
            break

    # Media
    try:
        imgs = page.locator("article img").evaluate_all(
            "els => els.map(el => el.src)"
        )
        vids = page.locator("article video").evaluate_all(
            "els => els.map(el => el.src)"
        )
        media = dedupe([m for m in (imgs + vids) if m])
        post["media"] = media[:5]
    except:
        pass

    # Fecha
    try:
        dt = safe_attr(page.locator("time").first, "datetime", default=None)
        if dt:
            post["fecha"] = dt
    except:
        pass

    # Likes (aprox)
    try:
        post["likes"] = safe_text(page.locator("section span").first)
    except:
        pass

    return post

# -----------------------------
# Main
# -----------------------------
def main():
    data = {
        "meta": {
            "perfil": USERNAME,
            "fecha_extraccion": datetime.now(UTC).isoformat(),
            "total_posts": 0
        },
        "perfil": {},
        "posts": []
    }

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(storage_state=COOKIES_FILE)
        page = context.new_page()

        # Ir al perfil
        page.goto(f"https://www.instagram.com/{USERNAME}/", timeout=60000)
        page.wait_for_selector("header", timeout=20000)
        page.wait_for_timeout(3000)
        close_popups(page)

        # Perfil
        data["perfil"] = extract_profile(page, USERNAME)

        # Scroll para cargar posts
        scroll_profile(page, MAX_SCROLLS)

        # Tomar elementos (NO links para goto)
        post_elements = page.locator("a[href*='/p/']").all()
        print("Posts detectados:", len(post_elements))

        # Limitar
        post_elements = post_elements[:MAX_POSTS]

        for i, post_el in enumerate(post_elements, 1):
            print(f"[{i}/{len(post_elements)}] Abriendo post...")

            try:
                # Click humano
                post_el.click()
                page.wait_for_selector("article", timeout=10000)
                page.wait_for_timeout(2000)
                close_popups(page)

                post_data = extract_post_from_modal(page)
                data["posts"].append(post_data)

                # Cerrar modal (Escape es más estable)
                page.keyboard.press("Escape")
                page.wait_for_timeout(1500)

            except PlaywrightTimeoutError:
                print("⚠️ Timeout controlado (se continúa)")
                try:
                    page.keyboard.press("Escape")
                except:
                    pass
            except Exception as e:
                print("⚠️ Error leve:", e)
                try:
                    page.keyboard.press("Escape")
                except:
                    pass

        data["meta"]["total_posts"] = len(data["posts"])

        # Guardar JSON
        with open("datos_instagram.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

        print("✅ JSON generado correctamente")

        browser.close()

if __name__ == "__main__":
    main()