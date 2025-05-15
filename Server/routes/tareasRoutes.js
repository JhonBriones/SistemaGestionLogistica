const express = require("express")
const router = express.Router()
const { getTareas, getTareaById,getTareasPendientesByUsuario, createTarea, updateTarea, deleteTarea } = require("../controlador/tareasController")

// Rutas para tareas
router.get("/tareas", getTareas)
router.get("/tareas/:id", getTareaById)
router.get("/tareas/pendientes/:idUsuario", getTareasPendientesByUsuario)
router.post("/tareas", createTarea)
router.put("/tareas/:id", updateTarea)
router.delete("/tareas/:id", deleteTarea)

module.exports = router
