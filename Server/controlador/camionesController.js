const db = require("../database")

// Obtener todos los camiones
const getCamiones = (req, res) => {
  db.query("SELECT * FROM camiones", (err, results) => {
    if (err) {
      console.error("❌ Error al obtener camiones:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    res.status(200).json({ camiones: results })
  })
}

// Obtener un camión por ID
const getCamionById = (req, res) => {
  const id = req.params.id
  db.query("SELECT * FROM camiones WHERE id_camion = ?", [id], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener camión:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Camión no encontrado" })
    }

    res.status(200).json({ camion: results[0] })
  })
}

// Crear un nuevo camión
const createCamion = (req, res) => {
  const { placa, modelo, estado } = req.body

  if (!placa || !modelo) {
    return res.status(400).json({ message: "Placa y modelo son obligatorios" })
  }

  db.query("INSERT INTO camiones (placa, modelo, estado) VALUES (?, ?, ?)", [placa, modelo, estado], (err, result) => {
    if (err) {
      console.error("❌ Error al crear camión:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    res.status(201).json({ message: "Camión creado exitosamente", id: result.insertId })
  })
}

// Actualizar un camión
const updateCamion = (req, res) => {
  const id = req.params.id
  const { placa, modelo, estado } = req.body

  if (!placa || !modelo) {
    return res.status(400).json({ message: "Placa y modelo son obligatorios" })
  }

  db.query(
    "UPDATE camiones SET placa = ?, modelo = ?, estado = ? WHERE id_camion = ?",
    [placa, modelo, estado, id],
    (err, result) => {
      if (err) {
        console.error("❌ Error al actualizar camión:", err)
        return res.status(500).json({ error: "Error del servidor" })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Camión no encontrado" })
      }

      res.status(200).json({ message: "Camión actualizado exitosamente" })
    },
  )
}

// Eliminar un camión
const deleteCamion = (req, res) => {
  const id = req.params.id

  db.query("DELETE FROM camiones WHERE id_camion = ?", [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar camión:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Camión no encontrado" })
    }

    res.status(200).json({ message: "Camión eliminado exitosamente" })
  })
}

module.exports = {getCamiones,getCamionById, createCamion,updateCamion,deleteCamion}
