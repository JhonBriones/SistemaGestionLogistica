const express = require('express');
const Router = express.Router();
const {getPermiso} = require('../controlador/Permisos');

Router.get('/permisos', getPermiso)
module.exports = Router;