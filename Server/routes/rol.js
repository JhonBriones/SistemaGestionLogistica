const express = require('express');
const Router = express.Router();
const {getRol, postRol, putRol} = require('../controlador/Rol');


Router.get('/', getRol);
Router.post('/', postRol)
Router.put('/:id', putRol)
module.exports = Router;

