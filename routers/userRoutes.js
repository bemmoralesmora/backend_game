const express = require("express");
const router = express.Router();
const {
  getUsuario,
  getEstadisticas,
} = require("../controllers/userController");

router.get("/:id", getUsuario);
router.get("/estadisticas/:id_usuario", getEstadisticas);

module.exports = router;
