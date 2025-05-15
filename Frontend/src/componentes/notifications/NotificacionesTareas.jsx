"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Bell } from "lucide-react"

const NotificacionesTareas = () => {
  const [tareasPendientes, setTareasPendientes] = useState([])
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false)
  const [contadorNotificaciones, setContadorNotificaciones] = useState(0)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const obtenerTareasPendientes = async () => {
      try {
        const idUsuario = localStorage.getItem("idUsuario")
        if (!idUsuario) return

        const response = await axios.get(`http://localhost:3001/api/tareas/pendientes/${idUsuario}`)
        setTareasPendientes(response.data.tareas || [])
        setContadorNotificaciones(response.data.tareas.length)
      } catch (error) {
        console.error("Error al obtener tareas pendientes:", error)
      } finally {
        setCargando(false)
      }
    }

    obtenerTareasPendientes()
    // Actualizar cada 5 minutos
    const intervalo = setInterval(obtenerTareasPendientes, 5 * 60 * 1000)
    return () => clearInterval(intervalo)
  }, [])

  const toggleNotificaciones = () => {
    setMostrarNotificaciones(!mostrarNotificaciones)
  }

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr)
    return fecha.toLocaleDateString()
  }

  return (
    <div className="relative">
      <button
        onClick={toggleNotificaciones}
        className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Notificaciones"
      >
        <Bell className="w-6 h-6" />
        {contadorNotificaciones > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {contadorNotificaciones}
          </span>
        )}
      </button>

      {mostrarNotificaciones && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden border border-gray-200">
          <div className="p-3 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700">Tareas Pendientes</h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {cargando ? (
              <div className="p-4 text-center text-gray-500">Cargando...</div>
            ) : tareasPendientes.length > 0 ? (
              <ul>
                {tareasPendientes.map((tarea) => (
                  <li key={tarea.ID} className="border-b border-gray-100 last:border-0">
                    <a href={`/pages/Tareas?id=${tarea.ID}`} className="block p-4 hover:bg-gray-50 transition-colors">
                      <p className="font-medium text-gray-800 mb-1">{tarea.descripcion}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Fecha límite: {formatearFecha(tarea.fecha_fin)}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            new Date(tarea.fecha_fin) < new Date()
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {new Date(tarea.fecha_fin) < new Date() ? "Atrasada" : "Pendiente"}
                        </span>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500">No hay tareas pendientes</div>
            )}
          </div>

          <div className="p-2 bg-gray-50 border-t border-gray-200 text-center">
            <a href="/pages/Tareas" className="text-sm text-blue-600 hover:text-blue-800">
              Ver todas las tareas
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificacionesTareas
