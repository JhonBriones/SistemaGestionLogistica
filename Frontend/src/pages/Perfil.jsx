"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { User, Mail, Phone, Shield, Edit, Save, X } from "lucide-react"

export const Perfil = () => {
  const [usuario, setUsuario] = useState({
    id_usuario: "",
    usuario: "",
    correo: "",
    telefono: "",
    rol: "",
  })
  const [modoEdicion, setModoEdicion] = useState(false)
  const [datosEditados, setDatosEditados] = useState({})
  const [cargando, setCargando] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" })

  useEffect(() => {
    const cargarDatosUsuario = async () => {
      try {
        const idUsuario = localStorage.getItem("idUsuario")
        if (!idUsuario) {
          setError("No se encontró información del usuario")
          setCargando(false)
          return
        }

        const response = await axios.get(`http://localhost:3001/api/usuarios/${idUsuario}`)
        setUsuario(response.data.usuario)
        setDatosEditados(response.data.usuario)
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error)
        setError("Error al cargar datos del usuario")
      } finally {
        setCargando(false)
      }
    }

    cargarDatosUsuario()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setDatosEditados({ ...datosEditados, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setMensaje({ tipo: "", texto: "" })

    try {
      const idUsuario = localStorage.getItem("idUsuario")
      if (!idUsuario) {
        setError("No se encontró información del usuario")
        return
      }

      // Actualizar datos del usuario
      await axios.put(`http://localhost:3001/api/usuarios/${idUsuario}`, {
        usuario: datosEditados.usuario,
        correo: datosEditados.correo,
        telefono: datosEditados.telefono,
      })

      // Actualizar estado local
      setUsuario(datosEditados)
      setModoEdicion(false)
      setMensaje({ tipo: "success", texto: "Perfil actualizado correctamente" })

      // Actualizar nombre de usuario en localStorage si cambió
      if (datosEditados.usuario !== localStorage.getItem("usuario")) {
        localStorage.setItem("usuario", datosEditados.usuario)
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      setMensaje({ tipo: "error", texto: "Error al actualizar el perfil" })
    } finally {
      setGuardando(false)
    }
  }

  const cancelarEdicion = () => {
    setDatosEditados(usuario)
    setModoEdicion(false)
  }

  if (cargando) {
    return (
      <div className="p-6 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Mi Perfil</h1>

      {mensaje.texto && (
        <div
          className={`mb-6 p-4 rounded-md ${
            mensaje.tipo === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          {mensaje.texto}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-teal-900 from-blue-500 to-indigo-600 text-white">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-32 h-32 rounded-full bg-white/20 flex items-center justify-center">
              <User size={64} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{usuario.usuario}</h2>
              <p className="text-blue-100">{usuario.rol}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex justify-end mb-4">
            {!modoEdicion ? (
              <button
                onClick={() => setModoEdicion(true)}
                className="flex items-center gap-2 px-4 py-2 bg-teal-900 text-white rounded hover:bg-teal-700 transition"
              >
                <Edit size={16} />
                Editar Perfil
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={cancelarEdicion}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                >
                  <X size={16} />
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={guardando}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-900 text-white rounded hover:bg-green-700 transition disabled:bg-teal-700"
                >
                  <Save size={16} />
                  {guardando ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Información Personal</h3>

                <div className="flex items-center gap-3">
                  <User className="text-gray-400" />
                  <div className="w-full">
                    <p className="text-sm text-gray-500">Nombre de Usuario</p>
                    {modoEdicion ? (
                      <input
                        type="text"
                        name="usuario"
                        value={datosEditados.usuario || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    ) : (
                      <p className="font-medium">{usuario.usuario || "No especificado"}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="text-gray-400" />
                  <div className="w-full">
                    <p className="text-sm text-gray-500">Correo Electrónico</p>
                    {modoEdicion ? (
                      <input
                        type="email"
                        name="correo"
                        value={datosEditados.correo || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="font-medium">{usuario.correo || "No especificado"}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="text-gray-400" />
                  <div className="w-full">
                    <p className="text-sm text-gray-500">Teléfono</p>
                    {modoEdicion ? (
                      <input
                        type="tel"
                        name="telefono"
                        value={datosEditados.telefono || ""}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <p className="font-medium">{usuario.telefono || "No especificado"}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Información de Cuenta</h3>

                <div className="flex items-center gap-3">
                  <Shield className="text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Rol</p>
                    <p className="font-medium">{usuario.rol}</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Perfil
