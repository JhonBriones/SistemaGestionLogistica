const express = require("express")
const router = express.Router()
const {
  getConductores,
  getConductorById,
  createConductor,
  updateConductor,
  deleteConductor,
} = require("../controlador/conductoresController")

// Rutas para conductores
router.get("/conductores", getConductores)
router.get("/conductores/:id", getConductorById)
router.post("/conductores", createConductor)
router.put("/conductores/:id", updateConductor)
router.delete("/conductores/:id", deleteConductor)

module.exports = router
