const { chromium } = require('playwright');

(async () => {
  const userDataDir = "C:\\Users\\pulup\\AppData\\Local\\Google\\Chrome\\User Data";

  const browser = await chromium.launchPersistentContext(userDataDir, {
    headless: false,
    channel: 'chrome', // usa tu Chrome real
    args: ["--start-maximized"]
  });

  const page = await browser.newPage();

  console.log("🌐 Abriendo Instagram...");

  await page.goto('https://www.instagram.com/');

  // 👉 Espera a que cargue TU sesión real
  await page.waitForTimeout(5000);

  // 👉 ahora navega al perfil
  const username = "marvel";

  await page.goto(`https://www.instagram.com/${username}/`, {
    waitUntil: 'networkidle'
  });

  await page.waitForTimeout(5000);

  // =============================
  // 📊 EXTRAER DATOS REALES
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
    } catch (e) {
      return null;
    }
  });

  console.log("📊 DATOS:");
  console.log(data);

  // =============================
  // 📸 POSTS
  // =============================
  const posts = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('article a'))
      .slice(0, 10)
      .map(a => a.href);
  });

  console.log("📸 POSTS:");
  console.log(posts);

})();