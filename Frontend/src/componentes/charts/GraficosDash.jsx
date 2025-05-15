"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

// Datos de respaldo en caso de error
const dataMesRespaldo = [
  { name: "Ene", valor: 120 },
  { name: "Feb", valor: 90 },
  { name: "Mar", valor: 160 },
  { name: "Abr", valor: 80 },
  { name: "May", valor: 110 },
  { name: "Jun", valor: 140 },
]

const pieDataRespaldo = [
  { name: "Ocupados", value: 60 },
  { name: "Disponibles", value: 40 },
]

const COLORS = ["#3b82f6", "#10b981"]

export const GraficosDash = () => {
  const [dataMes, setDataMes] = useState(dataMesRespaldo)
  const [pieData, setPieData] = useState(pieDataRespaldo)
  const [actividadRutas, setActividadRutas] = useState(dataMesRespaldo)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/dashboard/stats")
        const { stats } = response.data

        // Actualizar datos de gráficos si existen
        if (stats.entregasPorMes && stats.entregasPorMes.length > 0) {
          setDataMes(stats.entregasPorMes)
        }

        if (stats.estadoCamiones && stats.estadoCamiones.length > 0) {
          setPieData(stats.estadoCamiones)
        }

        if (stats.actividadRutas && stats.actividadRutas.length > 0) {
          setActividadRutas(stats.actividadRutas)
        }
      } catch (error) {
        console.error("Error al cargar datos de gráficos:", error)
        // Mantener datos de respaldo en caso de error
      } finally {
        setLoading(false)
      }
    }

    fetchChartData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl shadow p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-[250px] bg-gray-100 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Entregas por Mes</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={dataMes}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="valor" name="Entregas" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Estado de los Camiones</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}`, "Cantidad"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl shadow p-4 col-span-1 md:col-span-2">
        <h2 className="text-lg font-semibold mb-2">Actividad de Rutas</h2>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={actividadRutas}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="valor" name="Entregas" stroke="#0ea5e9" fill="#bae6fd" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
export default GraficosDash
