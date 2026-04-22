async function cargarDatos() {

  // 🔌 Llamar al backend
  const res = await fetch("/api/data");
  const data = await res.json();

  // ======================
  // PERFIL
  // ======================
  const perfilDiv = document.getElementById("perfil");

perfilDiv.innerHTML = `
  <div style="display:flex; align-items:center; gap:20px;">

    <div>

      <h2 style="margin:0;">${data.perfil.nombre}</h2>
      <p style="margin:2px 0;color:gray;">@${data.perfil.username}</p>

      <div style="display:flex; gap:15px; margin:8px 0;">
        <span><b>${data.perfil.publicaciones}</b> posts</span>
        <span><b>${data.perfil.seguidores}</b> seguidores</span>
        <span><b>${data.perfil.seguidos}</b> seguidos</span>
      </div>

      <p style="margin:0; font-size:14px;">${data.perfil.bio}</p>

    </div>

  </div>
`;

  // ======================
  // POSTS
  // ======================
  const postsDiv = document.getElementById("posts");

  data.posts.forEach(post => {
    const div = document.createElement("div");

    div.innerHTML = `
      <hr>
      <a href="${post.url}" target="_blank">Ver Post</a>
      <p>❤️ ${post.likes} | 💬 ${post.comentarios}</p>
      <p>${post.caption}</p>
    `;

    postsDiv.appendChild(div);
  });
}

// ▶️ Ejecutar
cargarDatos();