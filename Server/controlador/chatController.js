const db = require("../database")

// Función para obtener respuestas dinámicas de la base de datos
const obtenerRespuestaDinamica = async (mensaje) => {
  const mensajeLower = mensaje.toLowerCase()

  // Verificar si el mensaje contiene palabras clave
  if (mensajeLower.includes("camiones") || mensajeLower.includes("vehículos") || mensajeLower.includes("flota")) {
    try {
      const [activos, total] = await Promise.all([
        new Promise((resolve, reject) => {
          db.query("SELECT COUNT(*) as total FROM camiones WHERE estado = 1", (err, results) => {
            if (err) reject(err)
            else resolve(results[0].total)
          })
        }),
        new Promise((resolve, reject) => {
          db.query("SELECT COUNT(*) as total FROM camiones", (err, results) => {
            if (err) reject(err)
            else resolve(results[0].total)
          })
        }),
      ])

      return `Actualmente tenemos ${total} camiones en nuestra flota, de los cuales ${activos} están activos y disponibles para asignación. 🚚`
    } catch (error) {
      console.error("Error al consultar camiones:", error)
      return "Lo siento, no pude obtener información sobre los camiones en este momento."
    }
  }

  if (mensajeLower.includes("conductor") || mensajeLower.includes("choferes")) {
    try {
      const [total, activos] = await Promise.all([
        new Promise((resolve, reject) => {
          db.query("SELECT COUNT(*) as total FROM conductores", (err, results) => {
            if (err) reject(err)
            else resolve(results[0].total)
          })
        }),
        new Promise((resolve, reject) => {
          db.query("SELECT COUNT(*) as total FROM conductores WHERE estado = 1", (err, results) => {
            if (err) reject(err)
            else resolve(results[0].total)
          })
        }),
      ])

      return `Contamos con ${total} conductores registrados, ${activos} están activos actualmente. 👨‍✈️`
    } catch (error) {
      console.error("Error al consultar conductores:", error)
      return "Lo siento, no pude obtener información sobre los conductores en este momento."
    }
  }

  if (mensajeLower.includes("ruta") || mensajeLower.includes("viaje") || mensajeLower.includes("destino")) {
    try {
      const [totalRutas, rutasActivas] = await Promise.all([
        new Promise((resolve, reject) => {
          db.query("SELECT COUNT(*) as total FROM ruta", (err, results) => {
            if (err) reject(err)
            else resolve(results[0].total)
          })
        }),
        new Promise((resolve, reject) => {
          db.query("SELECT COUNT(*) as total FROM ruta WHERE estado = 1", (err, results) => {
            if (err) reject(err)
            else resolve(results[0].total)
          })
        }),
      ])

      // Obtener las rutas más populares
      const rutasPopulares = await new Promise((resolve, reject) => {
        db.query(
          `SELECT r.origin, r.destino, COUNT(e.id_entrega) as total 
           FROM ruta r 
           LEFT JOIN entrega e ON r.id_ruta = e.id_ruta 
           GROUP BY r.id_ruta 
           ORDER BY total DESC 
           LIMIT 3`,
          (err, results) => {
            if (err) reject(err)
            else resolve(results)
          },
        )
      })

      let rutasInfo = ""
      if (rutasPopulares.length > 0) {
        rutasInfo = " Las rutas más frecuentes son: "
        rutasPopulares.forEach((ruta, index) => {
          rutasInfo += `${ruta.origin} → ${ruta.destino}`
          if (index < rutasPopulares.length - 1) rutasInfo += ", "
        })
      }

      return `Tenemos ${totalRutas} rutas configuradas, de las cuales ${rutasActivas} están activas.${rutasInfo} 🗺️`
    } catch (error) {
      console.error("Error al consultar rutas:", error)
      return "Lo siento, no pude obtener información sobre las rutas en este momento."
    }
  }

  if (mensajeLower.includes("entrega") || mensajeLower.includes("pedido") || mensajeLower.includes("envío")) {
    try {
      const [totalEntregas, entregasPendientes] = await Promise.all([
        new Promise((resolve, reject) => {
          db.query("SELECT COUNT(*) as total FROM entrega", (err, results) => {
            if (err) reject(err)
            else resolve(results[0].total)
          })
        }),
        new Promise((resolve, reject) => {
          db.query("SELECT COUNT(*) as total FROM entrega WHERE estado = 1", (err, results) => {
            if (err) reject(err)
            else resolve(results[0].total)
          })
        }),
      ])

      // Obtener entregas recientes
      const entregasRecientes = await new Promise((resolve, reject) => {
        db.query(
          `SELECT e.direccion, e.fecha, c.nombre as conductor
           FROM entrega e
           JOIN conductores c ON e.id_conductor = c.id_conductor
           ORDER BY e.fecha DESC
           LIMIT 2`,
          (err, results) => {
            if (err) reject(err)
            else resolve(results)
          },
        )
      })

      let entregasInfo = ""
      if (entregasRecientes.length > 0) {
        entregasInfo = " Las entregas más recientes son: "
        entregasRecientes.forEach((entrega, index) => {
          const fecha = new Date(entrega.fecha).toLocaleDateString()
          entregasInfo += `${entrega.direccion} (${fecha})`
          if (index < entregasRecientes.length - 1) entregasInfo += ", "
        })
      }

      return `Hay un total de ${totalEntregas} entregas registradas, con ${entregasPendientes} pendientes de completar.${entregasInfo} 📦`
    } catch (error) {
      console.error("Error al consultar entregas:", error)
      return "Lo siento, no pude obtener información sobre las entregas en este momento."
    }
  }

  if (mensajeLower.includes("tarea") || mensajeLower.includes("asignación") || mensajeLower.includes("trabajo")) {
    try {
      const [totalTareas, tareasPendientes] = await Promise.all([
        new Promise((resolve, reject) => {
          db.query("SELECT COUNT(*) as total FROM tareas_asignadas", (err, results) => {
            if (err) reject(err)
            else resolve(results[0].total)
          })
        }),
        new Promise((resolve, reject) => {
          db.query("SELECT COUNT(*) as total FROM tareas_asignadas WHERE estado = 1", (err, results) => {
            if (err) reject(err)
            else resolve(results[0].total)
          })
        }),
      ])

      // Obtener tareas para hoy
      const hoy = new Date().toISOString().split("T")[0]
      const tareasHoy = await new Promise((resolve, reject) => {
        db.query(`SELECT COUNT(*) as total FROM tareas_asignadas WHERE fecha_fin = ?`, [hoy], (err, results) => {
          if (err) reject(err)
          else resolve(results[0].total)
        })
      })

      return `Hay ${totalTareas} tareas registradas en el sistema, ${tareasPendientes} están pendientes. Para hoy hay ${tareasHoy} tareas programadas. ✅`
    } catch (error) {
      console.error("Error al consultar tareas:", error)
      return "Lo siento, no pude obtener información sobre las tareas en este momento."
    }
  }

  // Si no hay coincidencia con palabras clave, usar respuestas estáticas
  return null
}

// Respuestas estáticas como fallback
const respuestas = [
  {
    claves: ["hola", "buenos días", "buenas tardes", "buenas noches"],
    respuesta: "¡Hola! ¿En qué puedo ayudarte hoy? 🚛",
  },
  {
    claves: ["ayuda", "cómo funciona", "qué puedes hacer"],
    respuesta: "Puedes preguntarme sobre camiones, entregas, rutas o tareas. Estoy aquí para ayudarte.",
  },
  {
    claves: ["gracias", "muchas gracias", "te agradezco"],
    respuesta: "¡De nada! 😊 Estoy para ayudarte cuando quieras.",
  },
]

const obtenerRespuestaEstatica = (mensajeUsuario) => {
  const mensaje = mensajeUsuario.toLowerCase()

  for (const r of respuestas) {
    if (r.claves.some((clave) => mensaje.includes(clave))) {
      return r.respuesta
    }
  }

  return "Lo siento, aún no entiendo esa pregunta. ¿Podrías escribirla de otra forma? Puedes preguntarme sobre camiones, conductores, rutas, entregas o tareas. 🤔"
}

const chatController = {
  responder: async (req, res) => {
    const { mensaje } = req.body

    if (!mensaje) {
      return res.status(400).json({ error: "Mensaje vacío" })
    }
    

    try {
      // Primero intentar obtener una respuesta dinámica
      const respuestaDinamica = await obtenerRespuestaDinamica(mensaje)

      // Si no hay respuesta dinámica, usar respuesta estática
      const respuesta = respuestaDinamica || obtenerRespuestaEstatica(mensaje)

      res.json({ respuesta })
    } catch (error) {
      console.error("Error en el chatbot:", error)
      res.status(500).json({
        respuesta: "Lo siento, estoy teniendo problemas para procesar tu consulta en este momento.",
      })
    }
  },
}

module.exports = { chatController }
