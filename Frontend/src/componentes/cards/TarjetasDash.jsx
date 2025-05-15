"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Truck, MapPin, Users, Activity } from "lucide-react"

export const TarjetasDash = () => {
  const [stats, setStats] = useState({
    camionesActivos: 0,
    rutasEnCurso: 0,
    conductores: 0,
    alertas: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/dashboard/stats")
        const { stats } = response.data

        setStats({
          camionesActivos: stats.camionesActivos || 0,
          rutasEnCurso: stats.rutasEnCurso || 0,
          conductores: stats.conductores || 0,
          alertas: stats.alertas || 0,
        })
      } catch (error) {
        console.error("Error al cargar estadísticas:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow p-4 flex items-center gap-4 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-gray-200"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
        <Truck className="text-blue-500" />
        <div>
          <p className="text-sm text-gray-500">Camiones Activos</p>
          <p className="text-xl font-bold">{stats.camionesActivos}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
        <MapPin className="text-green-500" />
        <div>
          <p className="text-sm text-gray-500">Rutas en Curso</p>
          <p className="text-xl font-bold">{stats.rutasEnCurso}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
        <Users className="text-yellow-500" />
        <div>
          <p className="text-sm text-gray-500">Conductores</p>
          <p className="text-xl font-bold">{stats.conductores}</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
        <Activity className="text-red-500" />
        <div>
          <p className="text-sm text-gray-500">Alertas del Día</p>
          <p className="text-xl font-bold">{stats.alertas}</p>
        </div>
      </div>
    </div>
  )
}
export default TarjetasDash
