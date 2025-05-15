const express = require("express")
const router = express.Router()
const {
  getEntregas,
  getEntregaById,
  createEntrega,
  updateEntrega,
  deleteEntrega,
} = require("../controlador/entregasController")

// Rutas para entregas
router.get("/entregas", getEntregas)
router.get("/entregas/:id", getEntregaById)
router.post("/entregas", createEntrega)
router.put("/entregas/:id", updateEntrega)
router.delete("/entregas/:id", deleteEntrega)

module.exports = router
