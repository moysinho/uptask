const { Router } = require("express");
const express = require("express");
const router = express.Router();

module.exports = function () {
  // ruta para el home
  router.get("/", (req, res) => {
    res.send("Index");
  });

  // ruta para nosotros
  router.get("/nosotros", (req, res) => {
    res.send("Nosotros");
  });

  return router;
};
