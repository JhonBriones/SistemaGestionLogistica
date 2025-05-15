"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { ClipboardList, Edit, Trash2, Plus } from "lucide-react"

export const Tareas = () => {
  const [tareas, setTareas] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [conductores, setConductores] = useState([])
  const[camiones,setcamiones]= useState([])
  const [ rutas,setRutas]= useState([])
  const [entrega, setEntrega] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState("add") 


  const [currentTarea, setCurrentTarea] = useState({
    descripcion: "",
    id_usuario: "",
    id_conductor: "",
    id_camion: "",
    id_ruta: "",
    fecha_inicio: "",
    fecha_fin: "",
    id_entrega: "",
    estado: 1,
  })

  
  // Cargar datos
  useEffect(() => {
    fetchTareas();
    fetchUsuarios();
    fetchConductores();
    fetchEntrega();
    fetchCamiones();
    fetchRuta();
  }, [])

  const fetchTareas = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:3001/api/tareas")
      setTareas(response.data.tareas || [])
    } catch (error) {
      console.error("Error al cargar tareas:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsuarios = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/usuarios")
      setUsuarios(response.data.usuarios || [])
    } catch (error) {
      console.error("Error al cargar usuarios:", error)
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

  const fetchEntrega = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/entregas")
      setEntrega(response.data.entregas)
    } catch (error) {
      console.error("Error al cargar conductores:", error)
    }
  }

  const fetchCamiones = async() =>{
    try {
      const response = await axios.get("http://localhost:3001/api/camiones")
      setcamiones(response.data.camiones || [])
    } catch (error) {
      console.error("Error al cargar camiones:", error)
    }
  }

  const fetchRuta = async() =>{
    try {
      const response = await axios.get("http://localhost:3001/api/rutas")
      setRutas(response.data.rutas || [])
    } catch (error) {
      console.error("Error al cargar rutas:", error)
    }
  }


  

  const handleOpenModal = (mode, tarea = null) => {
    setModalMode(mode)
    if (mode === "edit" && tarea) {
      const formattedTarea = {
        ...tarea,
        fecha_inicio: tarea.fecha_inicio ? new Date(tarea.fecha_inicio).toISOString().split("T")[0] : "",
        fecha_fin: tarea.fecha_fin ? new Date(tarea.fecha_fin).toISOString().split("T")[0] : "",
      }
      setCurrentTarea(formattedTarea)
    } else {
      const today = new Date().toISOString().split("T")[0]
      setCurrentTarea({    
        descripcion: "",
        id_entrega:"", 
        id_camion: "",
        id_ruta: "",
        id_usuario: "",
        id_conductor: "",
        fecha_inicio: today,
        fecha_fin: today,
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
    setCurrentTarea({
      ...currentTarea,
      [name]: name === "estado" ? Number.parseInt(value) : value,
    })
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (modalMode === "add") {
        await axios.post("http://localhost:3001/api/tareas", currentTarea)
      } else {    
        // console.log(currentTarea);

        
            
        await axios.put(`http://localhost:3001/api/tareas/${currentTarea.ID}`, currentTarea)
      }
      fetchTareas()
      handleCloseModal()
    } catch (error) {
      console.error("Error al guardar tarea:", error)
    }
  }
  

  const handleDelete = async (id) => {
    if (window.confirm("¿Está seguro de eliminar esta tarea?")) {
      try {
        await axios.delete(`http://localhost:3001/api/tareas/${id}`)
        fetchTareas()
      } catch (error) {
        console.error("Error al eliminar tarea:", error)
      }
    }
  }

  // Función para obtener el nombre del usuario según su ID
  const getUsuarioName = (usuarioId) => {
    const usuario = usuarios.find((u) => u.id_usuario === usuarioId)
    return usuario ? usuario.usuario : "Usuario no encontrado"
  }

  // Función para obtener el nombre del conductor según su ID
  const getConductorName = (conductorId) => {
    const conductor = conductores.find((c) => c.id_conductor === conductorId)
    return conductor ? conductor.nombre : "Conductor no encontrado"
  }


  const getEntregaName = (entregaId) => {
    const entregaItem = entrega.find((c) => c.id_entrega === entregaId)
    return entregaItem ? entregaItem.direccion : "Entrega no encontrada"
  }
  
  const getCamionName = (camionId) => {
    const camionItem = camiones.find((c) => c.id_camion === camionId)
    return camionItem ? camionItem.modelo : "Entrega no encontrada"
  }

  const getRutasName = (rutaId) => {
    const rutaItem = rutas.find((c) => c.id_ruta === rutaId);
    return rutaItem ? `${rutaItem.origin} -> ${rutaItem.destino}` : "Entrega no encontrada";
  }
  


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-teal-800 p-4 rounded-t-lg flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <ClipboardList className="inline-block mr-2" /> Gestión de Tareas
        </h1>
        <button
          onClick={() => handleOpenModal("add")}
          className="bg-white text-teal-800 font-semibold px-4 py-2 rounded-lg ml-auto flex items-center"
        >
          <Plus size={20} className="mr-1" /> Nueva Tarea
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-3 text-gray-600">Cargando tareas...</p>
        </div>
      ) : (
        <div className="bg-white rounded-b-lg shadow overflow-hidden border border-gray-300">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead className="bg-teal-700 text-white"> 
                <tr>
                  <th className="border border-black px-4 py-2 text-sm">ID</th>
                  <th className="border border-black px-4 py-2 text-sm">
                    Descripción
                  </th>
                  <th className="border border-black px-4 py-2 text-sm">Entrega</th>
                  <th className="border border-black px-4 py-2 text-sm">
                    Asignado por
                  </th>
                  <th className="border border-black px-4 py-2 text-sm">
                    Conductor
                  </th>
                  <th className="border border-black px-4 py-2 text-sm">Carro</th>
                  <th className="border border-black px-4 py-2 text-sm">Rutas</th>
                  <th className="border border-black px-4 py-2 text-sm">
                    Fecha Inicio
                  </th>
                  <th className="border border-black px-4 py-2 text-sm">
                    Fecha Fin
                  </th>
                  <th className="border border-black px-4 py-2 text-sm">
                    Estado
                  </th>
                  <th className="border border-black px-4 py-2 text-sm">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tareas.length > 0 ? (
                  tareas.map((tarea) => (
                    <tr key={tarea.ID} className="hover:bg-gray-50">
                      <td className="border border-black px-4 py-2 text-center">
                        {tarea.ID}
                      </td>
                      <td className="border border-black px-4 py-2 text-center">{tarea.descripcion}</td>
                      <td className="border border-black px-4 py-2 text-center">{tarea.entrega}</td>
                      <td className="border border-black px-4 py-2 text-center">
                        {tarea.usuario}
                      </td>
                      <td className="border border-black px-4 py-2 text-center">
                        {tarea.conductor}
                      </td>
                      <td className="border border-black px-4 py-2 text-center">{tarea.modelo}</td>
                      <td className="border border-black px-4 py-2 text-center">{tarea.ruta}</td>
                      <td className="border border-black px-4 py-2 text-center">
                        {new Date(tarea.fecha_inicio).toLocaleDateString()}
                      </td>
                      <td className="border border-black px-4 py-2 text-center">
                        {new Date(tarea.fecha_fin).toLocaleDateString()}
                      </td>
                      <td className="border border-black px-4 py-2 text-center">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            tarea.estado === 1 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {tarea.estado === 1 ? "Pendiente" : "Completada"}
                        </span>
                      </td>
                      <td className="border border-black px-4 py-2 text-center">
                        <button
                          onClick={() => handleOpenModal("edit", tarea)}
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
                      No hay tareas registradas
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

      {/* Modal para agregar/editar tarea */}
      {showModal && (
  <div className="fixed inset-0  flex items-center justify-center z-50 backdrop-blur-sm bg-black/30">
    <div className="bg-white  rounded-lg shadow-lg w-full max-w-3xl mx-4">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">
          {modalMode === "add" ? "Agregar Nueva Tarea" : "Editar Tarea"}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Columna 1 */}
           

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Entrega</label>
              <select
                name="id_entrega"
                value={currentTarea.id_entrega}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccione un usuario</option>
                {entrega.map((entrega) => (
                  <option key={entrega.id_entrega} value={entrega.id_entrega}>
                    {entrega.direccion}
                  </option>
                ))}
              </select>
            </div>

            {/* Columna 2 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Asignado por</label>
              <select
                name="id_usuario"
                value={currentTarea.id_usuario}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccione un usuario</option>
                {usuarios.map((usuario) => (
                  <option key={usuario.id_usuario} value={usuario.id_usuario}>
                    {usuario.usuario}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Conductor</label>
              <select
                name="id_conductor"
                value={currentTarea.id_conductor}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccione un conductor</option>
                {conductores.map((conductor) => (
                  <option key={conductor.id_conductor} value={conductor.id_conductor}>
                    {conductor.nombre}
                  </option>
                ))}
              </select>
            </div>

            {/* Columna 1 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Carro</label>
              <select
                name="id_camion"
                value={currentTarea.id_camion}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccione un Camion</option>
                {camiones.map((camion) => (
                  <option key={camion.id_camion} value={camion.id_camion}>
                    {camion.modelo}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rutas</label>
              <select
                name="id_ruta"
                value={currentTarea.id_ruta}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Seleccione una ruta</option>
                {rutas.map((ruta) => (
                  <option key={ruta.id_ruta} value={ruta.id_ruta}>
                    {`${ruta.origin} -> ${ruta.destino}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Columna 2 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
              <input
                type="date"
                name="fecha_inicio"
                value={currentTarea.fecha_inicio}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
              <input
                type="date"
                name="fecha_fin"
                value={currentTarea.fecha_fin}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={currentTarea.descripcion}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                maxLength="200"
                rows="3"
              ></textarea>
            </div>

            {/* Estado */}
            <div className="mb-4 col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <select
                name="estado"
                value={currentTarea.estado}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value={1}>Pendiente</option>
                <option value={0}>Completada</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
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

export default Tareas
