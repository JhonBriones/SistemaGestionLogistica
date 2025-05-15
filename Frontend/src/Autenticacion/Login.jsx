"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const [mensaje, setMensaje] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post("http://localhost:3001/api/login", { usuario, password })
      const { message, user } = res.data
      // Si el mensaje es "Login exitoso", navega a "/pages"
      if (message === "Login exitoso") {
        localStorage.setItem("idUsuario", user.id)
        localStorage.setItem("usuario", user.usuario)
        localStorage.setItem("rol", user.rol)
        localStorage.setItem("idRol", user.idRol)
        navigate("/pages")
      } else {
        setMensaje(res.data.message)
      }
    } catch (error) {
      setMensaje(error.response?.data?.message || "Error de login")
    }
  }

  return (
    <section className="bg-teal-50 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen">
        <div className="w-full bg-white rounded-lg shadow-lg border border-teal-700 md:mt-0 sm:max-w-md">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-teal-700 p-4 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 17a2 2 0 11-4 0 2 2 0 014 0zm10 0a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-teal-900 md:text-2xl">
              Sistema de Gestión Logística
            </h1>
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="usuario" className="block mb-2 text-sm font-medium text-teal-900">
                  Usuario
                </label>
                <input
                  type="text"
                  name="usuario"
                  id="usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                  className="bg-gray-50 border border-teal-700 text-teal-900 rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5"
                  placeholder="usuario"
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium text-teal-900">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-teal-700 text-teal-900 rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5"
                  required
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="w-72 text-white bg-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Iniciar Sesión
                </button>
              </div>
            </form>

            <p className="text-center text-sm text-red-500">{mensaje}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
