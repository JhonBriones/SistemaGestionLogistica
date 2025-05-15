const db = require('../database');
const bcrypt = require('bcrypt');
// Obtener todos los usuarios
const getUsuarios = (req, res) => {
  db.query('SELECT * FROM vista_usuario', (err, results) => {
    if (err) {
      console.error('❌ Error al obtener usuarios:', err);
      return res.status(500).json({ error: 'Error del servidor' });
    }

    res.status(200).json({ usuarios: results });
  });
};

// Obtener un usuario por ID
const getUsuarioById = (req, res) => {
  const id = req.params.id

  db.query("SELECT * FROM vista_usuario WHERE id_usuario = ?", [id], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener usuario:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    // No devolver la contraseña
    const usuario = results[0]
    delete usuario.password

    res.status(200).json({ usuario })
  })
}

const putUsuario = async (req, res) => {
  let { id_usuario } = req.params;
  id_usuario = id_usuario.trim();

  let { usuario, password, imagen, idRol } = req.body;

  try {
    if (password) {
      password = await bcrypt.hash(password, 10);
    }
    db.query(`UPDATE usuario SET usuario = ?, password = ?, imagen = IF(? = '', imagen, ?), idRol = ? WHERE id_usuario = ?`,
      [usuario, password, imagen, imagen, idRol, id_usuario],
      (err, result) => {
        if (err) {
          console.error('❌ Error al actualizar usuario:', err);
          return res.status(500).json({ error: 'Error al servidor' });
        }

        res.status(200).json({ mensaje: 'Usuario actualizado correctamente' });
      }
    );
  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error inesperado en el servidor' });
  }
};

// Cambiar contraseña
const cambiarPassword = async (req, res) => {
  const { id_usuario } = req.params
  const { passwordActual, passwordNueva } = req.body

  if (!passwordActual || !passwordNueva) {
    return res.status(400).json({ mensaje: "Se requieren ambas contraseñas" })
  }

  try {
    // Verificar la contraseña actual
    db.query("SELECT password FROM usuario WHERE id_usuario = ?", [id_usuario], async (err, results) => {
      if (err) {
        console.error("❌ Error al verificar contraseña:", err)
        return res.status(500).json({ error: "Error del servidor" })
      }

      if (results.length === 0) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" })
      }

      const usuario = results[0]
      const passwordValida = await bcrypt.compare(passwordActual, usuario.password)

      if (!passwordValida) {
        return res.status(401).json({ mensaje: "Contraseña actual incorrecta" })
      }

      // Hashear la nueva contraseña
      const hashedPassword = await bcrypt.hash(passwordNueva, 10)

      // Actualizar la contraseña
      db.query("UPDATE usuario SET password = ? WHERE id_usuario = ?", [hashedPassword, id_usuario], (err, result) => {
        if (err) {
          console.error("❌ Error al actualizar contraseña:", err)
          return res.status(500).json({ error: "Error del servidor" })
        }

        res.status(200).json({ mensaje: "Contraseña actualizada correctamente" })
      })
    })
  } catch (error) {
    console.error("❌ Error al cambiar contraseña:", error)
    res.status(500).json({ error: "Error inesperado en el servidor" })
  }
}

module.exports = { getUsuarios,getUsuarioById, putUsuario, cambiarPassword };
