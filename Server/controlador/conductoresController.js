const db = require("../database")

// Obtener todos los conductores
const getConductores = (req, res) => {
  db.query("SELECT * FROM conductores", (err, results) => {
    if (err) {
      console.error("❌ Error al obtener conductores:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    res.status(200).json({ conductores: results })
  })
}

// Obtener un conductor por ID
const getConductorById = (req, res) => {
  const id = req.params.id
  db.query("SELECT * FROM conductores WHERE id_conductor = ?", [id], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener conductor:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Conductor no encontrado" })
    }

    res.status(200).json({ conductor: results[0] })
  })
}

// Crear un nuevo conductor
const createConductor = (req, res) => {
  const { nombre, dni, correo, destino, licencia, estado } = req.body

  if (!nombre || !dni || !correo || !licencia) {
    return res.status(400).json({ message: "Nombre, DNI, correo y licencia son obligatorios" })
  }

  db.query(
    "INSERT INTO conductores (nombre, dni, correo, destino, licencia, estado) VALUES (?, ?, ?, ?, ?, ?)",
    [nombre, dni, correo, destino, licencia, estado],
    (err, result) => {
      if (err) {
        console.error("❌ Error al crear conductor:", err)
        return res.status(500).json({ error: "Error del servidor" })
      }

      res.status(201).json({ message: "Conductor creado exitosamente", id: result.insertId })
    },
  )
}

// Actualizar un conductor
const updateConductor = (req, res) => {
  const id = req.params.id
  const { nombre, dni, correo, destino, licencia, estado } = req.body

  if (!nombre || !dni || !correo || !licencia) {
    return res.status(400).json({ message: "Nombre, DNI, correo y licencia son obligatorios" })
  }

  db.query(
    "UPDATE conductores SET nombre = ?, dni = ?, correo = ?, destino = ?, licencia = ?, estado = ? WHERE id_conductor = ?",
    [nombre, dni, correo, destino, licencia, estado, id],
    (err, result) => {
      if (err) {
        console.error("❌ Error al actualizar conductor:", err)
        return res.status(500).json({ error: "Error del servidor" })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Conductor no encontrado" })
      }

      res.status(200).json({ message: "Conductor actualizado exitosamente" })
    },
  )
}

// Eliminar un conductor
const deleteConductor = (req, res) => {
  const id = req.params.id

  db.query("DELETE FROM conductores WHERE id_conductor = ?", [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar conductor:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Conductor no encontrado" })
    }

    res.status(200).json({ message: "Conductor eliminado exitosamente" })
  })
}

module.exports = {
  getConductores,
  getConductorById,
  createConductor,
  updateConductor,
  deleteConductor,
}
