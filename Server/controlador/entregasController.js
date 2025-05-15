const db = require("../database")

// Obtener todas las entregas
const getEntregas = (req, res) => {
  db.query("SELECT * FROM entrega", (err, results) => {
    if (err) {
      console.error("❌ Error al obtener entregas:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    res.status(200).json({ entregas: results })
  })
}

// Obtener una entrega por ID
const getEntregaById = (req, res) => {
  const id = req.params.id
  db.query("SELECT * FROM entrega WHERE id_entrega = ?", [id], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener entrega:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Entrega no encontrada" })
    }

    res.status(200).json({ entrega: results[0] })
  })
}

// Crear una nueva entrega
const createEntrega = (req, res) => {
  const { id_ruta, id_conductor, fecha, direccion, estado } = req.body

  if (!id_ruta || !id_conductor || !fecha || !direccion) {
    return res.status(400).json({ message: "Ruta, conductor y fecha son obligatorios" })
  }

  db.query(
    "INSERT INTO entrega (id_ruta, id_conductor, fecha, direccion, estado) VALUES (?, ?, ?, ?, ?)",
    [id_ruta, id_conductor, fecha, direccion, estado],
    (err, result) => {
      if (err) {
        console.error("❌ Error al crear entrega:", err)
        return res.status(500).json({ error: "Error del servidor" })
      }

      res.status(201).json({ message: "Entrega creada exitosamente", id: result.insertId })
    },
  )
}

// Actualizar una entrega
const updateEntrega = (req, res) => {
  const id = req.params.id
  const { id_ruta, id_conductor, fecha, direccion, estado } = req.body

  if (!id_ruta || !id_conductor || !direccion || !fecha) {
    return res.status(400).json({ message: "Ruta, conductor y fecha son obligatorios" })
  }

  db.query(
    "UPDATE entrega SET id_ruta = ?, id_conductor = ?, fecha = ?, direccion = ?,  estado = ? WHERE id_entrega = ?",
    [id_ruta, id_conductor, fecha,direccion, estado, id],
    (err, result) => {
      if (err) {
        console.error("❌ Error al actualizar entrega:", err)
        return res.status(500).json({ error: "Error del servidor" })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Entrega no encontrada" })
      }

      res.status(200).json({ message: "Entrega actualizada exitosamente" })
    },
  )
}

// Eliminar una entrega
const deleteEntrega = (req, res) => {
  const id = req.params.id

  db.query("DELETE FROM entrega WHERE id_entrega = ?", [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar entrega:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Entrega no encontrada" })
    }

    res.status(200).json({ message: "Entrega eliminada exitosamente" })
  })
}

module.exports = {
  getEntregas,
  getEntregaById,
  createEntrega,
  updateEntrega,
  deleteEntrega,
}
