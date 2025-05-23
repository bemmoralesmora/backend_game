const express = require("express");
const router = express.Router();
const { getCartas } = require("../controllers/cartaController");

router.get("/", getCartas);

module.exports = router;
