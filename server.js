const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const partidaRoutes = require("./routes/partidaRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/auth", authRoutes); // Unifica /register y /login bajo /auth
app.use("/api/partidas", partidaRoutes); // Coherente con tu index.js

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
