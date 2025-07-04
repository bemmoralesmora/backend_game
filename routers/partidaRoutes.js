const express = require("express");
const router = express.Router();
const {
  crearPartida,
  validarPartida,
} = require("../controllers/partidaController");

router.post("/", crearPartida);
router.get("/validar/:codigo", validarPartida); // Nueva ruta de validación

module.exports = router;
