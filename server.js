const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// 📡 API que devuelve tu JSON
app.get("/api/data", (req, res) => {
  try {
    const data = fs.readFileSync("instagram_data.json", "utf-8");
    res.json(JSON.parse(data));
  } catch (error) {
    res.status(500).json({ error: "Error leyendo JSON" });
  }
});

// 🌐 Servir frontend
app.use(express.static(path.join(__dirname, "public")));

// ▶️ Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});