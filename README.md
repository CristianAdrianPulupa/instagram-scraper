# 📸 Instagram Scraper con Playwright

Proyecto que realiza scraping de un perfil público de Instagram utilizando Playwright y cookies de sesión.

## 🎯 Objetivo
Obtener información básica de un perfil y extraer 5 publicaciones (posts) con:
- URL
- Likes
- Comentarios
- Caption

## 🛠 Tecnologías
- Node.js
- Playwright

## 🔐 Autenticación
Se utilizan cookies de sesión (`cookies.json`) para evitar bloqueos y acceder a los datos.

## ⚠️ Nota técnica
Debido a mecanismos anti-scraping de Instagram, el DOM no contiene los datos completos.  
Por ello se utilizan endpoints internos autenticados:

- `/api/v1/users/web_profile_info/` → datos del perfil  
- `/api/v1/feed/user/` → publicaciones (fallback)

## ▶️ Ejecución

```bash
node scraper.js