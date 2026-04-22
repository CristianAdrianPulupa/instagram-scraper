const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: false
  });

  const context = await browser.newContext({
    storageState: 'cookies.json'
  });

  const page = await context.newPage();

  const username = "marvel"; // cambia aquí

  console.log("🌐 Entrando a Instagram...");

  await page.goto('https://www.instagram.com/', {
    waitUntil: 'networkidle'
  });

  await page.waitForTimeout(5000);

  console.log("📡 Haciendo request interna...");

  // 🔥 FORZAR REQUEST (clave)
  const data = await page.evaluate(async (username) => {
    const res = await fetch(
      `https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`,
      {
        method: "GET",
        credentials: "include", // 👈 usa cookies
        headers: {
          "x-ig-app-id": "936619743392459"
        }
      }
    );

    const json = await res.json();
    return json.data.user;
  }, username);

  if (!data) {
    console.log("❌ No se pudieron obtener datos");
    return;
  }

  // =========================
  // 📊 PERFIL
  // =========================
console.log("📊 PERFIL:");
console.log({
  username: data.username,
  nombre: data.full_name,
  publicaciones: data.edge_owner_to_timeline_media?.count,
  seguidores: data.edge_followed_by?.count,
  seguidos: data.edge_follow?.count,
  bio: data.biography
});

const posts = (data.edge_owner_to_timeline_media?.edges || [])
  .slice(0, 5)
  .map(p => ({
    url: `https://www.instagram.com/p/${p.node.shortcode}/`,
    likes: p.node.edge_liked_by?.count || 0,
    comentarios: p.node.edge_media_to_comment?.count || 0,
    caption: p.node.edge_media_to_caption?.edges[0]?.node.text || ""
  }));

console.log("📸 POSTS:");
console.log(posts);

// =========================
// 📸 POSTS DESDE PERFIL (con fallback)
// =========================
let edges = data.edge_owner_to_timeline_media?.edges || [];

if (edges.length === 0) {
  console.log("⚠️ No vinieron posts en la primera respuesta, intentando paginación...");

  const moreData = await page.evaluate(async (username) => {
    const res = await fetch(
      `https://www.instagram.com/api/v1/feed/user/${username}/username/?count=5`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "x-ig-app-id": "936619743392459"
        }
      }
    );

    try {
      return await res.json();
    } catch {
      return null;
    }
  }, data.username);

  if (moreData && moreData.items) {
    const posts = moreData.items.slice(0, 5).map(p => ({
      url: `https://www.instagram.com/p/${p.code}/`,
      likes: p.like_count,
      comentarios: p.comment_count,
      caption: p.caption?.text || ""
    }));

    console.log("📸 POSTS (fallback API):");
    console.log(posts);
  } else {
    console.log("❌ Tampoco se pudieron obtener posts");
  }

} else {
  const posts = edges.slice(0, 5).map(p => ({
    url: `https://www.instagram.com/p/${p.node.shortcode}/`,
    likes: p.node.edge_liked_by?.count || 0,
    comentarios: p.node.edge_media_to_comment?.count || 0,
    caption: p.node.edge_media_to_caption?.edges[0]?.node.text || ""
  }));

  console.log("📸 POSTS:");
  console.log(posts);
}
  await browser.close();
})();