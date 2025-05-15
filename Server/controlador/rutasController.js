const db = require("../database")

// Obtener todas las rutas
const getRutas = (req, res) => {
  db.query("SELECT * FROM ruta", (err, results) => {
    if (err) {
      console.error("❌ Error al obtener rutas:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    res.status(200).json({ rutas: results })
  })
}

// Obtener una ruta por ID
const getRutaById = (req, res) => {
  const id = req.params.id
  db.query("SELECT * FROM ruta WHERE id_ruta = ?", [id], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener ruta:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Ruta no encontrada" })
    }

    res.status(200).json({ ruta: results[0] })
  })
}

// Crear una nueva ruta
const createRuta = (req, res) => {
  const { origin, destino, estado } = req.body

  if (!origin || !destino) {
    return res.status(400).json({ message: "Origen y destino son obligatorios" })
  }

  db.query("INSERT INTO ruta (origin, destino, estado) VALUES (?, ?, ?)", [origin, destino, estado], (err, result) => {
    if (err) {
      console.error("❌ Error al crear ruta:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    res.status(201).json({ message: "Ruta creada exitosamente", id: result.insertId })
  })
}

// Actualizar una ruta
const updateRuta = (req, res) => {
  const id = req.params.id
  const { origin, destino, estado } = req.body

  if (!origin || !destino) {
    return res.status(400).json({ message: "Origen y destino son obligatorios" })
  }

  db.query(
    "UPDATE ruta SET origin = ?, destino = ?, estado = ? WHERE id_ruta = ?",
    [origin, destino, estado, id],
    (err, result) => {
      if (err) {
        console.error("❌ Error al actualizar ruta:", err)
        return res.status(500).json({ error: "Error del servidor" })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Ruta no encontrada" })
      }

      res.status(200).json({ message: "Ruta actualizada exitosamente" })
    },
  )
}

// Eliminar una ruta
const deleteRuta = (req, res) => {
  const id = req.params.id

  db.query("DELETE FROM ruta WHERE id_ruta = ?", [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar ruta:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Ruta no encontrada" })
    }

    res.status(200).json({ message: "Ruta eliminada exitosamente" })
  })
}

module.exports = {
  getRutas,
  getRutaById,
  createRuta,
  updateRuta,
  deleteRuta,
}
