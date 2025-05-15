const express = require("express")
const router = express.Router()
const { getRutas, getRutaById, createRuta, updateRuta, deleteRuta } = require("../controlador/rutasController")

// Rutas para rutas
router.get("/rutas", getRutas)
router.get("/rutas/:id", getRutaById)
router.post("/rutas", createRuta)
router.put("/rutas/:id", updateRuta)
router.delete("/rutas/:id", deleteRuta)

module.exports = router
