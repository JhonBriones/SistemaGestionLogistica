const express = require("express")
const router = express.Router()
const { getTareasPendientes } = require("../controlador/notificacionesController")

// Ruta para obtener tareas pendientes para notificaciones
router.get("/notificaciones/tareas-pendientes", getTareasPendientes)

module.exports = router
