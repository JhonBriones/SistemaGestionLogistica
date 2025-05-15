"use client"

import { useState } from "react"
import axios from "axios"
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react"

export const Configuracion = () => {
  const [mostrarPassword, setMostrarPassword] = useState(false)
  const [password, setPassword] = useState({
    actual: "",
    nueva: "",
    confirmar: "",
  })
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" })
  const [guardando, setGuardando] = useState(false)

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPassword({ ...password, [name]: value })
  }

  const handleSubmitPassword = async (e) => {
    e.preventDefault()
    setGuardando(true)
    setMensaje({ tipo: "", texto: "" })

    // Validación simple
    if (password.nueva !== password.confirmar) {
      setMensaje({ tipo: "error", texto: "Las contraseñas no coinciden" })
      setGuardando(false)
      return
    }

    if (password.nueva.length < 6) {
      setMensaje({ tipo: "error", texto: "La contraseña debe tener al menos 6 caracteres" })
      setGuardando(false)
      return
    }

    try {
      const idUsuario = localStorage.getItem("idUsuario")
      if (!idUsuario) {
        setMensaje({ tipo: "error", texto: "No se encontró información del usuario" })
        return
      }

      await axios.post(`http://localhost:3001/api/usuarios/${idUsuario}/cambiar-password`, {
        passwordActual: password.actual,
        passwordNueva: password.nueva,
      })

      setMensaje({ tipo: "success", texto: "Contraseña actualizada correctamente" })
      setPassword({ actual: "", nueva: "", confirmar: "" })
    } catch (error) {
      console.error("Error al cambiar contraseña:", error)

      if (error.response && error.response.status === 401) {
        setMensaje({ tipo: "error", texto: "Contraseña actual incorrecta" })
      } else {
        setMensaje({ tipo: "error", texto: "Error al cambiar la contraseña" })
      }
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Configuración</h1>

      {mensaje.texto && (
        <div
          className={`mb-6 p-4 rounded-md flex items-start gap-3 ${
            mensaje.tipo === "error" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
          }`}
        >
          <AlertCircle className="mt-0.5" size={18} />
          <span>{mensaje.texto}</span>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Shield className="text-green-500" />
          Cambiar Contraseña
        </h2>

        <form onSubmit={handleSubmitPassword}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña Actual</label>
            <div className="relative">
              <input
                type={mostrarPassword ? "text" : "password"}
                name="actual"
                value={password.actual}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
                onClick={() => setMostrarPassword(!mostrarPassword)}
              >
                {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
            <div className="relative">
              <input
                type={mostrarPassword ? "text" : "password"}
                name="nueva"
                value={password.nueva}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
            <div className="relative">
              <input
                type={mostrarPassword ? "text" : "password"}
                name="confirmar"
                value={password.confirmar}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={guardando}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {guardando ? "Cambiando..." : "Cambiar Contraseña"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Configuracion
