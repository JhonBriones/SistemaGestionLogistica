"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { User, Settings, LogOut } from "lucide-react"

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [userData, setUserData] = useState({
    usuario: "",
    rol: "",
  })
  const menuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Cargar datos del usuario desde localStorage
    const usuario = localStorage.getItem("usuario") || ""
    const rol = localStorage.getItem("rol") || ""
    setUserData({ usuario, rol })

    // Cerrar el menú al hacer clic fuera de él
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    // Eliminar datos de sesión
    localStorage.removeItem("idUsuario")
    localStorage.removeItem("usuario")
    localStorage.removeItem("rol")
    localStorage.removeItem("idRol")

    // Redirigir al login
    navigate("/")
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-gray-800 font-semibold hidden sm:inline">{userData.usuario}</span>
        <img
          src="https://definicion.com/wp-content/uploads/2022/09/imagen.jpg"
          alt="Avatar"
          className="w-12 h-12 rounded-full border-2 border-gray-500 hover:scale-105 transition-transform duration-300"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-teal-800 rounded-lg shadow-lg z-50 overflow-hidden border border-gray-200">
          <div className="p-3 border-b border-teal-800">
            <p className="font-medium text-white">{userData.usuario}</p>
            <p className="text-sm text-white  ">{userData.rol}</p>
          </div>

          <ul className="py-1">
            <li>
              <a href="/pages/perfil" className="flex items-center gap-2 px-4 py-2 text-white hover:bg-teal-700">
                <User size={16} />
                <span>Mi Perfil</span>
              </a>
            </li>
            <li>
              <a
                href="/pages/configuracion"
                className="flex items-center gap-2 px-4 py-2 text-white hover:bg-teal-700"
              >
                <Settings size={16} />
                <span>Configuración</span>
              </a>
            </li>
            <li className="border-t border-gray-100">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left font-bold px-4 py-2 text-red-500 hover:bg-teal-700"
              >
                <LogOut size={16} />
                <span>Cerrar Sesión</span>
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default UserMenu
