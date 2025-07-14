const express = require("express");
const router = express.Router();
const {
  getUsuario,
  getEstadisticas,
  getLogros,
  getPartidas,
} = require("../controllers/userController");

router.get("/:id", getUsuario);
router.get("/estadisticas/:id_usuario", getEstadisticas);
router.get("/logros/:id", getLogros);
router.get("/partidas/:id", getPartidas);

module.exports = router;
