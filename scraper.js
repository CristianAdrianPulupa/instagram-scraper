const { chromium } = require('playwright');
const fs = require("fs");

(async () => {
  const browser = await chromium.launch({
    headless: false
  });

  const context = await browser.newContext({
    storageState: 'cookies.json'
  });

  const page = await context.newPage();

  const username = "Marvel";
  const LIMIT = 10;

  console.log("🌐 Entrando a Instagram...");

  await page.goto('https://www.instagram.com/', {
    waitUntil: 'domcontentloaded'
  });

  await page.waitForTimeout(3000);

  // =========================
  // 📊 PERFIL (AGREGADO)
  // =========================
  console.log("📡 Obteniendo perfil...");

  const profile = await page.evaluate(async (username) => {

    const res = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "x-ig-app-id": "936619743392459"
        }
      }
    );

    const json = await res.json();
    return json?.data?.user || null;

  }, username);

  let profileData = null;

if (profile) {
  profileData = {
    username: profile.username,
    nombre: profile.full_name,
    seguidores: profile.edge_followed_by?.count,
    seguidos: profile.edge_follow?.count,
    publicaciones: profile.edge_owner_to_timeline_media?.count,
    bio: profile.biography
  };

  console.log("📊 PERFIL:");
  console.log(profileData);
}else {
    console.log("❌ No se pudo obtener el perfil");
  }

  console.log("📡 Obteniendo posts...");

  // =========================
  // SOLO PAGINACIÓN (PRO)
  // =========================
  let allPosts = [];
  let maxId = null;
  let hasMore = true;
  let safety = 0;
  const seen = new Set();

  while (hasMore && allPosts.length < LIMIT) {

    safety++;
    if (safety > 10) break;

    const result = await page.evaluate(async ({ username, maxId }) => {

      let url = `https://www.instagram.com/api/v1/feed/user/${username}/username/?count=20`;

      if (maxId) {
        url += `&max_id=${maxId}`;
      }

      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "x-ig-app-id": "936619743392459"
        }
      });

      const text = await res.text();

      try {
        return JSON.parse(text);
      } catch {
        return null;
      }

    }, { username, maxId });

    if (!result?.items) {
      console.log("❌ Error obteniendo posts");
      break;
    }

    for (const p of result.items) {

      if (allPosts.length >= LIMIT) break;
      if (seen.has(p.code)) continue;

      seen.add(p.code);

      allPosts.push({
        url: `https://www.instagram.com/p/${p.code}/`,
        likes: p.like_count || 0,
        comentarios: p.comment_count || 0,
        caption: p.caption?.text || ""
      });
    }

    console.log(`📥 Post Obtenidos: ${allPosts.length}`);

    maxId = result.next_max_id;

    if (!maxId) {
      hasMore = false;
    }

    await page.waitForTimeout(1000);
  }

  console.log("📸 TOTAL POSTS:");
  console.log("TOTAL:", allPosts.length);
  console.table(allPosts);

  // =========================
  // 💾 EXPORTACIÓN JSON (AGREGADO)
  // =========================
  const finalData = {
  perfil: profileData,
  posts: allPosts
};
  fs.writeFileSync(
  "instagram_data.json",
  JSON.stringify(finalData, null, 2)
);

  console.log("💾 Archivo posts.json creado correctamente");

  await browser.close();
})();