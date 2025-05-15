const db = require("../database")

// Obtener tareas pendientes para notificaciones
const getTareasPendientes = (req, res) => {
  try {
    const hoy = new Date().toISOString().split("T")[0]

    // Consulta para obtener tareas pendientes de hoy o atrasadas
    db.query(
      `SELECT * FROM vista_tarea 
       WHERE estado = 1 AND fecha_fin <= ? 
       ORDER BY fecha_fin ASC`,
      [hoy],
      (err, results) => {
        if (err) {
          console.error("Error al obtener tareas pendientes:", err)
          return res.status(500).json({ error: "Error al obtener tareas pendientes" })
        }

        res.status(200).json({ tareasPendientes: results })
      },
    )
  } catch (error) {
    console.error("Error en getTareasPendientes:", error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

module.exports = { getTareasPendientes }
