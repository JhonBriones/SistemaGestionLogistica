const express = require('express');
const router = express.Router();
const { getUsuarios,getUsuarioById, putUsuario, cambiarPassword } = require('../controlador/getUsuariosController');


router.get('/usuarios', getUsuarios);
router.get("/usuarios/:id", getUsuarioById)
router.put('/usuarios/:id_usuario', putUsuario)
router.post("/usuarios/:id_usuario/cambiar-password", cambiarPassword)

module.exports = router;
