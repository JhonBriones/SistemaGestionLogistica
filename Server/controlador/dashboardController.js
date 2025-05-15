const db = require("../database")

// Obtener estadísticas para el dashboard
const getEstadisticas = (req, res) => {
  try {
    // Objeto para almacenar todas las estadísticas
    const stats = {}

    // Promesa para obtener camiones activos
    const getCamionesActivos = new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) as total FROM camiones WHERE estado = 1", (err, results) => {
        if (err) reject(err)
        else resolve(results[0].total)
      })
    })

    // Promesa para obtener rutas en curso
    const getRutasEnCurso = new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) as total FROM entrega WHERE estado = 1", (err, results) => {
        if (err) reject(err)
        else resolve(results[0].total)
      })
    })

    // Promesa para obtener total de conductores
    const getConductores = new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) as total FROM conductores WHERE estado = 1", (err, results) => {
        if (err) reject(err)
        else resolve(results[0].total)
      })
    })

    // Promesa para obtener alertas (tareas pendientes del día actual)
    const getAlertas = new Promise((resolve, reject) => {
      const hoy = new Date().toISOString().split("T")[0]
      db.query(
        "SELECT COUNT(*) as total FROM tareas_asignadas WHERE fecha_fin = ? AND estado = 1",
        [hoy],
        (err, results) => {
          if (err) reject(err)
          else resolve(results[0].total)
        },
      )
    })

    // Promesa para obtener entregas por mes
    const getEntregasPorMes = new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          MONTH(fecha) as mes, 
          COUNT(*) as total 
        FROM entrega 
        WHERE fecha >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) 
        GROUP BY MONTH(fecha) 
        ORDER BY MONTH(fecha)`,
        (err, results) => {
          if (err) reject(err)
          else {
            // Convertir números de mes a nombres
            const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
            const data = results.map((item) => ({
              name: meses[item.mes - 1],
              valor: item.total,
            }))
            resolve(data)
          }
        },
      )
    })

    // Promesa para obtener estado de camiones
    const getEstadoCamiones = new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          estado, 
          COUNT(*) as total 
        FROM camiones 
        GROUP BY estado`,
        (err, results) => {
          if (err) reject(err)
          else {
            const ocupados = results.find((r) => r.estado === 0)?.total || 0
            const disponibles = results.find((r) => r.estado === 1)?.total || 0

            resolve([
              { name: "Ocupados", value: ocupados },
              { name: "Disponibles", value: disponibles },
            ])
          }
        },
      )
    })

    // Promesa para obtener actividad de rutas (entregas por ruta)
    const getActividadRutas = new Promise((resolve, reject) => {
      db.query(
        `SELECT 
          r.origin as origen,
          COUNT(e.id_entrega) as total
        FROM ruta r
        LEFT JOIN entrega e ON r.id_ruta = e.id_ruta
        GROUP BY r.id_ruta
        ORDER BY total DESC
        LIMIT 6`,
        (err, results) => {
          if (err) reject(err)
          else {
            const data = results.map((item) => ({
              name: item.origen,
              valor: item.total,
            }))
            resolve(data)
          }
        },
      )
    })

    // Resolver todas las promesas
    Promise.all([
      getCamionesActivos,
      getRutasEnCurso,
      getConductores,
      getAlertas,
      getEntregasPorMes,
      getEstadoCamiones,
      getActividadRutas,
    ])
      .then(([camionesActivos, rutasEnCurso, conductores, alertas, entregasPorMes, estadoCamiones, actividadRutas]) => {
        stats.camionesActivos = camionesActivos
        stats.rutasEnCurso = rutasEnCurso
        stats.conductores = conductores
        stats.alertas = alertas
        stats.entregasPorMes = entregasPorMes
        stats.estadoCamiones = estadoCamiones
        stats.actividadRutas = actividadRutas

        res.status(200).json({ stats })
      })
      .catch((error) => {
        console.error("Error al obtener estadísticas:", error)
        res.status(500).json({ error: "Error al obtener estadísticas" })
      })
  } catch (error) {
    console.error("Error en getEstadisticas:", error)
    res.status(500).json({ error: "Error interno del servidor" })
  }
}

module.exports = { getEstadisticas }
