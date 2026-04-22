const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });

  const context = await browser.newContext({
    storageState: 'cookies.json'
  });

  const page = await context.newPage();

  await page.goto('https://www.instagram.com/', {
    waitUntil: 'domcontentloaded'
  });

  await page.waitForTimeout(5000);

  const isLogged = await page.evaluate(() => {
    return !!document.querySelector('nav');
  });

  console.log("¿Está logueado?:", isLogged);

})();