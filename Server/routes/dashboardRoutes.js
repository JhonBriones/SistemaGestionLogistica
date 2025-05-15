const express = require("express")
const router = express.Router()
const { getEstadisticas } = require("../controlador/dashboardController")

// Ruta para obtener estadísticas del dashboard
router.get("/dashboard/stats", getEstadisticas)

module.exports = router
