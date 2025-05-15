"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { PackageCheck, Edit, Trash2, Plus } from "lucide-react"

export const Entregas = () => {
  const [entregas, setEntregas] = useState([])
  const [rutas, setRutas] = useState([])
  const [conductores, setConductores] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("add")
  const [currentEntrega, setCurrentEntrega] = useState({
    id_ruta: "",
    id_conductor: "",
    fecha: "",
    direccion: "",
    estado: 1,
  })

  // Cargar datos
  useEffect(() => {
    fetchEntregas()
    fetchRutas()
    fetchConductores()
  }, [])

  const fetchEntregas = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:3001/api/entregas")
      setEntregas(response.data.entregas || [])
    } catch (error) {
      console.error("Error al cargar entregas:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRutas = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/rutas")
      setRutas(response.data.rutas || [])
    } catch (error) {
      console.error("Error al cargar rutas:", error)
    }
  }

  const fetchConductores = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/conductores")
      setConductores(response.data.conductores || [])
    } catch (error) {
      console.error("Error al cargar conductores:", error)
    }
  }

  const handleOpenModal = (mode, entrega = null) => {
    setModalMode(mode)
    if (mode === "edit" && entrega) {
      // Formatear la fecha para el input date
      const formattedEntrega = {
        ...entrega,
        fecha: entrega.fecha ? new Date(entrega.fecha).toISOString().split("T")[0] : "",
      }
      setCurrentEntrega(formattedEntrega)
    } else {
      setCurrentEntrega({
        id_ruta: "",
        id_conductor: "",
        fecha: new Date().toISOString().split("T")[0], // Fecha actual por defecto
        estado: 1,
      })
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setCurrentEntrega({
      ...currentEntrega,
      [name]: name === "estado" ? Number.parseInt(value) : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (modalMode === "add") {
        await axios.post("http://localhost:3001/api/entregas", currentEntrega)
      } else {
        await axios.put(`http://localhost:3001/api/entregas/${currentEntrega.id_entrega}`, currentEntrega)
      }
      fetchEntregas()
      handleCloseModal()
    } catch (error) {
      console.error("Error al guardar entrega:", error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar esta entrega?")) {
      try {
        await axios.delete(`http://localhost:3001/api/entregas/${id}`)
        fetchEntregas()
      } catch (error) {
        console.error("Error al eliminar entrega:", error)
      }
    }
  }

  // Función para obtener el nombre de la ruta según su ID
  const getRutaName = (rutaId) => {
    const ruta = rutas.find((r) => r.id_ruta === rutaId)
    return ruta ? `${ruta.origin} → ${ruta.destino}` : "Ruta no encontrada"
  }

  // Función para obtener el nombre del conductor según su ID
  const getConductorName = (conductorId) => {
    const conductor = conductores.find((c) => c.id_conductor === conductorId)
    return conductor ? conductor.nombre : "Conductor no encontrado"
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-teal-800 p-4 rounded-t-lg flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <PackageCheck className="inline-block mr-2" /> Gestión de Entregas
        </h1>
        <button
          onClick={() => handleOpenModal("add")}
          className="bg-white text-teal-800 font-semibold px-4 py-2 rounded-lg ml-auto flex items-center"
        >
          <Plus size={20} className="mr-1" /> Nueva Entrega
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-3 text-gray-600">Cargando entregas...</p>
        </div>
      ) : (
        <div className="bg-white rounded-b-lg shadow overflow-hidden border border-gray-300">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                <th className="border border-black px-4 py-2 text-sm">ID</th>
                  <th className="border border-black px-4 py-2 text-sm">Dirección</th>
                  <th className="border border-black px-4 py-2 text-sm">Ruta</th>
                  <th className="border border-black px-4 py-2 text-sm">Conductor</th>
                  <th className="border border-black px-4 py-2 text-sm">Fecha</th>
                  <th className="border border-black px-4 py-2 text-sm">Estado</th>
                  <th className="border border-black px-4 py-2 text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entregas.length > 0 ? (
                  entregas.map((entrega) => (
                    <tr key={entrega.id_entrega} className="hover:bg-gray-50">
                      <td className="border border-black px-4 py-2 text-center">
                        {entrega.id_entrega}
                      </td>
                      <td className="border border-black px-4 py-2 text-center">
                        {entrega.direccion}
                      </td>
                      <td className="border border-black px-4 py-2 text-center">
                        {getRutaName(entrega.id_ruta)}
                      </td>
                      <td className="border border-black px-4 py-2 text-center">
                        {getConductorName(entrega.id_conductor)}
                      </td>
                      <td className="border border-black px-4 py-2 text-center">
                        {new Date(entrega.fecha).toLocaleDateString()}
                      </td>
                      <td className="border border-black px-4 py-2 text-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            entrega.estado === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {entrega.estado === 1 ? "En curso" : "Completada"}
                        </span>
                      </td>
                      <td className="border border-black px-4 py-2 text-center">
                        <button
                          onClick={() => handleOpenModal("edit", entrega)}
                          className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-1 px-2 rounded"
                        >
                          ✏️
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="border border-black px-4 py-4 text-center text-gray-500">
                      No hay entregas registradas
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center py-4">
            <button className="border border-black px-4 py-2 mr-2">Anterior</button>
            <button className="border border-black px-4 py-2">Siguiente</button>
          </div>
        </div>
      )}

      {/* Modal para agregar/editar entrega */}
      {showModal && (
        <div className="fixed inset-0  flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {modalMode === "add" ? "Agregar Nueva Entrega" : "Editar Entrega"}
              </h3>
              <form onSubmit={handleSubmit}>
              <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirreción</label>
              <input
                type="text"
                name="direccion"
                value={currentEntrega.direccion}
                onChange={handleInputChange}
                placeholder="Ej: Lima → Arequipa"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>



                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ruta</label>
                  <select
                    name="id_ruta"
                    value={currentEntrega.id_ruta}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Seleccione una ruta</option>
                    {rutas.map((ruta) => (
                      <option key={ruta.id_ruta} value={ruta.id_ruta}>
                        {ruta.origin} → {ruta.destino}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Conductor</label>
                  <select
                    name="id_conductor"
                    value={currentEntrega.id_conductor}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Seleccione un conductor</option>
                    {conductores.map((conductor) => (
                      <option key={conductor.id_conductor} value={conductor.id_conductor}>
                        {conductor.nombre} - {conductor.licencia}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    name="fecha"
                    value={currentEntrega.fecha}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    name="estado"
                    value={currentEntrega.estado}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={1}>En curso</option>
                    <option value={0}>Completada</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2 mt-6">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                    {modalMode === "add" ? "Agregar" : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Entregas
