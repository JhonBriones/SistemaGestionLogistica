"use client"

import { HiOutlineMenuAlt2 } from "react-icons/hi"
import { CiSearch } from "react-icons/ci"
import NotificacionesTareas from "../notifications/NotificacionesTareas"
import UserMenu from "../user/UserMenu"

export const Header = ({ setShowSidebar }) => {
  const toggle = () => setShowSidebar((prev) => !prev)

  return (
    <header className="bg-teal-700 shadow-md w-full">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Lado izquierdo: Botón de menú y barra de búsqueda */}
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* Botón de menú (hamburguesa) */}
          <button
            type="button"
            onClick={toggle}
            className="p-2 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <HiOutlineMenuAlt2 className="w-6 h-6" />
          </button>

          {/* Barra de búsqueda */}
          <form className="w-full sm:max-w-md relative">
            <div className="relative">
              {/* Icono de búsqueda */}
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <CiSearch className="w-5 h-5 text-gray-400" />
              </div>

              {/* Campo de búsqueda */}
              <input
                type="search"
                id="default-search"
                className="block w-[20rem] p-2.5 pl-10 pr-24 text-sm text-gray-900 border-2 border-teal-800 rounded-lg bg-white outline-none focus:border-teal-500"
                placeholder="Buscar..."
              />

              {/* Botón de búsqueda embebido */}
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-teal-900 hover:bg-teal-800 text-white font-medium rounded-md text-sm px-3 py-1.5"
              >
                Buscar
              </button>
            </div>
          </form>
        </div>

        {/* Lado derecho: Notificaciones, Usuario y avatar */}
        <div className="flex items-center gap-3">
          <NotificacionesTareas />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}

export default Header
