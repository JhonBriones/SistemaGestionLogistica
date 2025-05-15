const db = require('../database');
const bcrypt = require('bcrypt');
const {getUsuarios} = require('./getUsuariosController');

const registerUsuario = async (req, res) => {

      const { usuario, password, imagen, idRol } = req.body;
      

      if (!usuario || !password) {            
            return res.status(400).json({ message: 'Usuario y contraseña son obligatorios' });
      }

      try {
      // Verifica si el usuario ya existe
      db.query('SELECT * FROM usuario WHERE usuario = ?', [usuario], async (err, results) => {
            if (err) return res.status(500).json({ error: 'Error al verificar usuario' });

            if (results.length > 0) {
                  return res.status(409).json({ message: 'El usuario ya existe' });
            }

            // Encriptar contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insertar nuevo usuario
            db.query(  'INSERT INTO usuario (usuario, password, imagen, idRol) VALUES (?, ?, ?, ?)',

                  [usuario, hashedPassword, imagen || null, idRol || null],
                  (err, result) => {
                        if (err) {
                              console.error('❌ Error al registrar usuario:', err);
                              return res.status(500).json({ error: 'Error del servidor' });
                        }

                        // res.status(201).json({ message: 'Usuario registrado exitosamente', id_usuario: result.insertId });
                        return getUsuarios(req, res);
                  }
            );
      });
      } catch (error) {
            res.status(500).json({ error: 'Error inesperado en el servidor' });
      }
};

module.exports = { registerUsuario };
