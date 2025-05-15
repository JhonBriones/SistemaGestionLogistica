"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Truck, Edit, Trash2, Plus } from "lucide-react"

export const Operaciones = () => {
  const [camiones, setCamiones] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("add") // "add" o "edit"
  const [currentCamion, setCurrentCamion] = useState({
    placa: "",
    modelo: "",
    estado: 1,
  })

  // Cargar datos
  useEffect(() => {
    fetchCamiones()
  }, [])

  const fetchCamiones = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:3001/api/camiones")
      setCamiones(response.data.camiones || [])
      console.log({response});
      
    } catch (error) {
      console.error("Error al cargar camiones:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (mode, camion = null) => {
    setModalMode(mode)
    if (mode === "edit" && camion) {
      setCurrentCamion(camion)
    } else {
      setCurrentCamion({
        placa: "",
        modelo: "",
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
    setCurrentCamion({
      ...currentCamion,
      [name]: name === "estado" ? Number.parseInt(value) : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (modalMode === "add") {
        await axios.post("http://localhost:3001/api/camiones", currentCamion)
      } else {
        await axios.put(`http://localhost:3001/api/camiones/${currentCamion.id_camion}`, currentCamion)
      }
      console.log(currentCamion.id_camion);
      
      fetchCamiones()
      handleCloseModal()
    } catch (error) {
      console.error("Error al guardar camión:", error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este camión?")) {
      try {
        await axios.delete(`http://localhost:3001/api/camiones/${id}`)
        fetchCamiones()
      } catch (error) {
        console.error("Error al eliminar camión:", error)
      }
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-teal-800 p-4 rounded-t-lg flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white flex items-center gap-2">
        <Truck size={28} /> Gestion de Camiones
      </h1>
      <button
        onClick={() => handleOpenModal("add")}
        className="bg-white text-teal-800 font-semibold px-4 py-2 rounded-lg ml-auto flex items-center"
      >
        <Plus size={20} className="mr-1" /> Nuevo Camion
      </button>
    </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-3 text-gray-600">Cargando camiones...</p>
        </div>
      ) : (
        <div className="bg-white rounded-b-lg shadow overflow-hidden border border-gray-300">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-teal-700 text-white">
              <tr>
                  <th className="border border-black px-4 py-2 text-sm">ID</th>
                  <th className="border border-black px-4 py-2 text-sm">Placa</th>
                  <th className="border border-black px-4 py-2 text-sm">Modelo</th>
                  <th className="border border-black px-4 py-2 text-sm">Estado</th>
                  <th className="border border-black px-4 py-2 text-sm">Acción</th>
                </tr>
              </thead>
              <tbody>
                {camiones.length > 0 ? (
                  camiones.map((camion) => (
                    <tr key={camion.id_camion}>
                      <td className="border border-black px-4 py-2 text-center">
                        {camion.id_camion}
                      </td>
                      <td className="border border-black px-4 py-2 text-center">{camion.placa}</td>
                      <td className="border border-black px-4 py-2 text-center">{camion.modelo}</td>
                      <td className="border border-black px-4 py-2 text-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            camion.estado === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {camion.estado === 1 ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="border border-black px-4 py-2 text-center">
                        <button
                          onClick={() => handleOpenModal("edit", camion)}
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
                      No hay camiones registrados
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

      {/* Modal para agregar/editar camión */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {modalMode === "add" ? "Agregar Nuevo Camión" : "Editar Camión"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Placa</label>
                  <input
                    type="text"
                    name="placa"
                    value={currentCamion.placa}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    maxLength="9"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Modelo</label>
                  <input
                    type="text"
                    name="modelo"
                    value={currentCamion.modelo}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    maxLength="30"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    name="estado"
                    value={currentCamion.estado}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={1}>Activo</option>
                    <option value={0}>Inactivo</option>
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

export default Operaciones
