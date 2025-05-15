const express = require('express');
const router = express.Router();
const { login } = require('../controlador/authController');
const { registerUsuario } = require('../controlador/registerController');

router.post('/login', login);
router.post('/register', registerUsuario);

module.exports = router;
