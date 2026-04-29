# 📸 Instagram Web Scraping con Playwright

## 📌 Descripción

Este proyecto implementa un proceso de **web scraping sobre una página pública de Instagram**, utilizando la librería **Playwright** para automatizar el navegador y simular el comportamiento de un usuario real.

El sistema permite:

* Extraer información de perfiles públicos
* Obtener publicaciones recientes
* Guardar los datos en formato JSON
* Visualizar los datos mediante una interfaz web

---

## 🎯 Objetivo del proyecto

Desarrollar un script capaz de extraer información de Instagram sin utilizar herramientas tradicionales como Selenium o BeautifulSoup, analizando el funcionamiento de las solicitudes web y aplicando estrategias para evitar bloqueos.

---

## ⚙️ Tecnologías utilizadas

* Node.js
* Playwright
* Express
* JavaScript (Frontend + Backend)
* chromiun

---

## 🧠 Lógica del scraping

El scraping se divide en dos etapas principales:

---

### 🔐 1. Autenticación (saveCookies.js)

Se abre un navegador automatizado donde el usuario inicia sesión manualmente en Instagram.
Una vez autenticado, se guardan las cookies en un archivo `cookies.json`.

Esto permite:

* Mantener una sesión activa
* Evitar bloqueos por parte de Instagram
* Realizar solicitudes autenticadas

---

### 📊 2. Extracción de datos (scraper.js)

Se reutilizan las cookies guardadas para simular una sesión real y acceder a los datos.

#### 📌 Datos del perfil obtenidos:

* Username
* Nombre
* Número de seguidores
* Número de seguidos
* Número de publicaciones
* Biografía

#### 📌 Datos de publicaciones:

* URL del post
* Número de likes
* Número de comentarios
* Texto (caption)

---

## 🌐 Funcionamiento técnico

Aunque se utiliza Playwright, los datos se obtienen mediante **solicitudes internas de Instagram ejecutadas dentro del navegador**, lo que permite replicar el comportamiento real del usuario.

Esto se logra usando:

* `page.evaluate()` para ejecutar código dentro del navegador
* `fetch()` para consumir endpoints internos de Instagram
* Cookies para autenticación (`credentials: "include"`)

---

## 🛡️ Estrategias para evitar bloqueos

Para minimizar restricciones de Instagram, se implementaron las siguientes estrategias:

* Uso de cookies reales (login manual)
* Simulación de navegador real (no headless)
* Retrasos entre solicitudes (`waitForTimeout`)
* Límite de resultados (`LIMIT`)
* Control de paginación (`max_id`)
* Prevención de bucles infinitos (`safety counter`)

---

## 🚀 Cómo ejecutar el proyecto

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/CristianAdrianPulupa/instagram-scraper.git
cd instagram-scraper
```

---

### 2️⃣ Instalar dependencias

```bash
npm install
```

---

### 3️⃣ Obtener cookies (LOGIN)

```bash
node saveCookies.js
```

👉 Se abrirá un navegador
👉 Inicia sesión manualmente
👉 Presiona ENTER en la consola

Esto generará el archivo `cookies.json`

---

### 4️⃣ Ejecutar scraping

```bash
node scraper.js
```

Se generará el archivo:

```
instagram_data.json
```

---

### 5️⃣ Ejecutar servidor

```bash
node server.js
```

Abrir en navegador:

```
http://localhost:3000
```

---

## 📁 Estructura del proyecto

```
📦 proyecto
 ┣ 📂 public          → Frontend (HTML + JS)
 ┣ 📄 scraper.js      → Script principal de scraping
 ┣ 📄 saveCookies.js  → Script de autenticación
 ┣ 📄 server.js       → Backend con Express
 ┣ 📄 instagram_data.json → Datos extraídos
 ┣ 📄 cookies.json    → Sesión guardada
 ┣ 📄 package.json
 ┗ 📄 README.md
```

---

## ⚠️ Limitaciones

* Instagram puede cambiar sus endpoints internos en cualquier momento
* Requiere autenticación manual
* No está diseñado para scraping masivo
* Dependencia de cookies válidas

---

## 🧪 Resultados

El sistema logra extraer correctamente:

* Información de perfiles públicos
* Publicaciones recientes con métricas básicas
* Datos estructurados en JSON

---

## 👨‍💻 Autor

**Cristian Adrian Pulupa**

---

## 📌 Notas finales

Este proyecto demuestra el uso de Playwright para automatización web y scraping, combinando navegación real con análisis de solicitudes internas para obtener datos de forma eficiente y controlada.
