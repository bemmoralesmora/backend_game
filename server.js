const express = require("express");
const cors = require("cors");
const authRoutes = require("./routers/authRoutes"); // Antes: "./routes/authRoutes"
const partidaRoutes = require("./routers/partidaRoutes");
const cartaRoutes = require("./routers/cartaRoutes");
const codigoRoutes = require("./routers/codigoRoutes");
const userRoutes = require("./routers/userRoutes");

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
