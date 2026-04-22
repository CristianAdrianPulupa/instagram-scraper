const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const userDataDir = "C:\\Users\\pulup\\AppData\\Local\\Google\\Chrome\\User Data";

  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    channel: 'chrome',
    args: ["--start-maximized"]
  });

  const page = await browser.newPage();

  console.log("🌐 Abriendo Instagram...");

  await page.goto('https://www.instagram.com/');
  await page.waitForTimeout(5000);

  const username = "marvel";

  await page.goto(`https://www.instagram.com/${username}/`, {
    waitUntil: 'networkidle'
  });

  await page.waitForTimeout(5000);

  // =============================
  // 📊 DATOS PERFIL (DOM - simple)
  // =============================
  const data = await page.evaluate(() => {
    try {
      const header = document.querySelector('header');
      const username = header.querySelector('h2')?.innerText;
      const spans = header.querySelectorAll('ul li span');

      return {
        username,
        publicaciones: spans[0]?.innerText,
        seguidores: spans[1]?.innerText,
        seguidos: spans[2]?.innerText
      };
    } catch {
      return null;
    }
  });

  console.log("📊 DATOS:");
  console.log(data);

  // =============================
  // 📸 POSTS (DOM - links)
  // =============================
  const posts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('article a'))
      .slice(0, 10)
      .map(a => a.href);
  });

  console.log("📸 POSTS:");
  console.log(posts);

  // =============================
  // 💾 GUARDAR JSON (CLAVE)
  // =============================
  try {
    const resultado = {
      perfil: data,
      posts: posts
    };

    fs.writeFileSync(
      'datos_instagram.json',
      JSON.stringify(resultado, null, 2)
    );

    console.log("💾 Archivo creado: datos_instagram.json");

  } catch (err) {
    console.log("❌ Error guardando archivo:", err);
  }

  await browser.close();
})();