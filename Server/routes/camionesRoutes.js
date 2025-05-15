const express = require("express")
const router = express.Router()
const {
  getCamiones,
  getCamionById,
  createCamion,
  updateCamion,
  deleteCamion,
} = require("../controlador/camionesController")

// Rutas para camiones
router.get("/camiones", getCamiones)
router.get("/camiones/:id", getCamionById)
router.post("/camiones", createCamion)
router.put("/camiones/:id", updateCamion)
router.delete("/camiones/:id", deleteCamion)

module.exports = router
