const express = require("express");
const cors = require("cors");
const authRoutes = require("./routers/authRoutes");
const userRoutes = require("./routers/userRoutes");
const partidaRoutes = require("./routers/partidaRoutes");
const cartaRoutes = require("./routers/cartaRoutes");
const codigoRoutes = require("./routers/codigoRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/register", authRoutes);
app.use("/login", authRoutes);
app.use("/usuarios", userRoutes);
app.use("/estadisticas", userRoutes);
app.use("/partidas", partidaRoutes);
app.use("/cartas", cartaRoutes);
app.use("/codigos", codigoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
