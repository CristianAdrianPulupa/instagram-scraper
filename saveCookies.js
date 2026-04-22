const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  // 🚀 Abrir navegador
  const browser = await chromium.launch({
    headless: false,
    args: ["--start-maximized"]
  });

  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("🌐 Abriendo Instagram...");
  await page.goto('https://www.instagram.com/');

  // =============================
  // 🔐 LOGIN MANUAL (CONTROL TOTAL)
  // =============================
  console.log("👉 Inicia sesión manualmente en Instagram");
  console.log("👉 Cuando termines, presiona ENTER aquí en la consola");

  await new Promise(resolve => {
    process.stdin.once('data', resolve);
  });

  console.log("✅ Continuando... guardando cookies");

  // =============================
  // 🍪 GUARDAR COOKIES + STORAGE
  // =============================
  const storage = await context.storageState();

  fs.writeFileSync(
    'cookies.json',
    JSON.stringify(storage, null, 2)
  );

  console.log("🍪 Cookies completas guardadas en cookies_completas.json");

  // =============================
  // 🔍 VERIFICACIÓN (opcional)
  // =============================
  const cookies = storage.cookies.map(c => c.name);

  if (cookies.includes('sessionid')) {
    console.log("✅ Login exitoso: sessionid encontrada");
  } else {
    console.log("⚠️ No se encontró sessionid (puede que no estés logueado)");
  }

  // =============================
  // ❌ CERRAR
  // =============================
  await browser.close();
})();