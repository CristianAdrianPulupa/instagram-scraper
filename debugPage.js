const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 80
  });

  const context = await browser.newContext({
    storageState: 'cookies.json',
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
    viewport: { width: 1280, height: 800 }
  });

  const page = await context.newPage();

  console.log("🌐 Entrando...");

  await page.goto('https://www.instagram.com/marvel/', {
    waitUntil: 'domcontentloaded'
  });

  // 👇 SIMULACIÓN HUMANA REAL
  await page.mouse.move(300, 300);
  await page.waitForTimeout(2000);

  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(3000);

  await page.mouse.wheel(0, 1500);
  await page.waitForTimeout(4000);

  // 👇 Intentar esperar posts
  try {
    await page.waitForSelector('article', { timeout: 10000 });
  } catch (e) {
    console.log("⚠️ No apareció article");
  }

  // 🔍 verificar otra vez
  const debug = await page.evaluate(() => {
    return {
      tienePosts: !!document.querySelector('article'),
      cantidadLinks: document.querySelectorAll('article a').length
    };
  });

  console.log("📊 RESULTADO:");
  console.log(debug);

})();