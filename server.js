const express = require("express");
const cors = require("cors");
const corsConfig = require("./corsConfig");

const authRoutes = require("./routers/authRoutes");
const partidaRoutes = require("./routers/partidaRoutes");
const cartaRoutes = require("./routers/cartaRoutes");
const codigoRoutes = require("./routers/codigoRoutes");
const userRoutes = require("./routers/userRoutes");

const app = express();

app.use(cors(corsConfig));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api/partidas", partidaRoutes);
app.use("/api/cartas", cartaRoutes);
app.use("/api/codigos", codigoRoutes);
app.use("/api/usuarios", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en http://localhost:${PORT}`);
});
