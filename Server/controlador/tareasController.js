const db = require("../database")

// Obtener todas las tareas
const getTareas = (req, res) => {
  db.query("SELECT * FROM vista_tarea", (err, results) => {
    if (err) {
      console.error("❌ Error al obtener tareas:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    res.status(200).json({ tareas: results })
  })
}

// Obtener una tarea por ID
const getTareaById = (req, res) => {
  const id = req.params.id
  db.query("SELECT * FROM tareas_asignadas WHERE id_tarea = ?", [id], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener tarea:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" })
    }

    res.status(200).json({ tarea: results[0] })
  })
}

// Obtener tareas pendientes por usuario
const getTareasPendientesByUsuario = (req, res) => {
  const idUsuario = req.params.idUsuario

  if (!idUsuario) {
    return res.status(400).json({ message: "ID de usuario requerido" })
  }

  const query = `
    SELECT * FROM vista_tarea 
    WHERE id_usuario = ? AND estado = 1 
    ORDER BY 
      CASE 
        WHEN fecha_fin < CURDATE() THEN 0 
        ELSE 1 
      END, 
      fecha_fin ASC 
    LIMIT 10
  `

  db.query(query, [idUsuario], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener tareas pendientes:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    res.status(200).json({ tareas: results })
  })
}

const createTarea = (req, res) => {
  const { descripcion, id_usuario, id_conductor, fecha_inicio, fecha_fin, estado, id_entrega, id_camion, id_ruta } = req.body;

  // Validar campos realmente obligatorios
  if (!descripcion || !id_usuario || !id_conductor || !fecha_inicio || !fecha_fin || !estado || !id_camion) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }

  db.query(
    "INSERT INTO tareas_asignadas (descripcion, id_usuario, id_conductor, fecha_inicio, fecha_fin, id_entrega, id_ruta, id_camion, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [
      descripcion,
      id_usuario,
      id_conductor,
      fecha_inicio,
      fecha_fin,
      id_entrega || null,  // puede ser null
      id_ruta || null,     // puede ser null
      id_camion,           // obligatorio
      estado
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Error al crear tarea:", err);
        return res.status(500).json({ error: "Error del servidor" });
      }

      res.status(201).json({ message: "Tarea creada exitosamente", id: result.insertId });
    }
  );
}


// Actualizar una tarea
const updateTarea = (req, res) => {
  const id = req.params.id
  const { descripcion, id_usuario, id_conductor, fecha_inicio, fecha_fin, estado, id_entrega, id_ruta, id_camion } = req.body

  if (!descripcion || !id_usuario || !id_conductor || !fecha_inicio || !fecha_fin || !id_entrega || !id_ruta || !id_camion) {
    return res.status(400).json({ message: "Todos los campos son obligatorios" })
  }

  db.query(
    "UPDATE tareas_asignadas SET descripcion = ?, id_usuario = ?, id_conductor = ?, fecha_inicio = ?, fecha_fin = ?, estado = ?,id_entrega = ?, id_ruta = ?, id_camion = ?  WHERE id_tarea = ?",
    [descripcion, id_usuario, id_conductor, fecha_inicio, fecha_fin, estado,  id_entrega, id_ruta, id_camion,  id],
    (err, result) => {
      if (err) {
        console.error("❌ Error al actualizar tarea:", err)
        return res.status(500).json({ error: "Error del servidor" })
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Tarea no encontrada" })
      }

      res.status(200).json({ message: "Tarea actualizada exitosamente" })
    },
  )
}

// Eliminar una tarea
const deleteTarea = (req, res) => {
  const id = req.params.id

  db.query("DELETE FROM tareas_asignadas WHERE id_tarea = ?", [id], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar tarea:", err)
      return res.status(500).json({ error: "Error del servidor" })
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Tarea no encontrada" })
    }

    res.status(200).json({ message: "Tarea eliminada exitosamente" })
  })
}

module.exports = {
  getTareas,
  getTareaById,
  getTareasPendientesByUsuario,
  createTarea,
  updateTarea,
  deleteTarea,
}
