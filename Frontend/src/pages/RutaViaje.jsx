// "use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { MapPin, Edit, Trash2, Plus } from "lucide-react"

import React from 'react'


export const RutaViaje = () => {

  const [rutas, setRutas] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("add") // "add" o "edit"
  const [currentRuta, setCurrentRuta] = useState({
    origin: "",
    destino: "",
    estado: 1,
  })

  // Cargar datos
  useEffect(() => {
    fetchRutas()
  }, [])

  const fetchRutas = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:3001/api/rutas")
      setRutas(response.data.rutas || [])
    } catch (error) {
      console.error("Error al cargar rutas:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (mode, ruta = null) => {
    setModalMode(mode)
    if (mode === "edit" && ruta) {
      setCurrentRuta(ruta)
    } else {
      setCurrentRuta({
        origin: "",
        destino: "",
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
    setCurrentRuta({
      ...currentRuta,
      [name]: name === "estado" ? Number.parseInt(value) : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (modalMode === "add") {
        await axios.post("http://localhost:3001/api/rutas", currentRuta)
      } else {
        await axios.put(`http://localhost:3001/api/rutas/${currentRuta.id_ruta}`, currentRuta)
      }
      fetchRutas()
      handleCloseModal()
    } catch (error) {
      console.error("Error al guardar ruta:", error)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar esta ruta?")) {
      try {
        await axios.delete(`http://localhost:3001/api/rutas/${id}`)
        fetchRutas()
      } catch (error) {
        console.error("Error al eliminar ruta:", error)
      }
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-teal-800 p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <MapPin className="inline-block mr-2" /> Gestión de Rutas
        </h1>
        <button
          onClick={() => handleOpenModal("add")}
          className="bg-white text-teal-800 font-semibold px-4 py-2 rounded-lg ml-auto flex items-center"
        >
          <Plus size={20} className="mr-1" /> Nueva Ruta
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-3 text-gray-600">Cargando rutas...</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-teal-700 text-white">
              <tr>
                  <th className="border border-black px-4 py-2 text-sm">ID</th>
                  <th className="border border-black px-4 py-2 text-sm">Origen</th>
                  <th className="border border-black px-4 py-2 text-sm">Destino</th>
                  <th className="border border-black px-4 py-2 text-sm">Estado</th>
                  <th className="border border-black px-4 py-2 text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rutas.length > 0 ? (
                  rutas.map((ruta) => (
                    <tr key={ruta.id_ruta} className="hover:bg-gray-50">
                      <td className="border border-black px-4 py-2 text-center">{ruta.id_ruta}</td>
                      <td className="border border-black px-4 py-2 text-center">{ruta.origin}</td>
                      <td className="border border-black px-4 py-2 text-center">{ruta.destino}</td>
                      <td className="border border-black px-4 py-2 text-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            ruta.estado === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {ruta.estado === 1 ? "Activa" : "Inactiva"}
                        </span>
                      </td>
                      <td className="border border-black px-4 py-2 text-center">
                        <button
                          onClick={() => handleOpenModal("edit", ruta)}
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
                      No hay rutas registradas
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

      {/* Modal para agregar/editar ruta */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {modalMode === "add" ? "Agregar Nueva Ruta" : "Editar Ruta"}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
                  <input
                    type="text"
                    name="origin"
                    value={currentRuta.origin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    maxLength="70"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
                  <input
                    type="text"
                    name="destino"
                    value={currentRuta.destino}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                    maxLength="70"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select
                    name="estado"
                    value={currentRuta.estado}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={1}>Activa</option>
                    <option value={0}>Inactiva</option>
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

export default RutaViaje
