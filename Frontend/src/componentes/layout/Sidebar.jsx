import { useState } from "react";
import { AiFillDashboard } from "react-icons/ai";
import { IoSettingsSharp } from "react-icons/io5";
import { FaShieldAlt, FaUser, FaUserShield, FaTasks } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { CgOptions } from "react-icons/cg";
import { TbBus, TbTruckDelivery  } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import { usePermisos } from "../../context/PermisosContext";
import { FaPersonCircleCheck,FaRoute } from "react-icons/fa6";
import logo from "../../assets/imagen.png";

const Sidebar = ({ showSidebar }) => {
  // Estado para controlar qué submenú está abierto
  const [openSubmenus, setOpenSubmenus] = useState({});
  const { allowedPaths } = usePermisos();
  const location = useLocation();

  // Función genérica para alternar la visibilidad del submenú
  const toggleSubmenu = (label) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const menu = [
    { label: "Dashboard", icon: <AiFillDashboard />, path: "/pages" },
    { label: "Tareas", path: "/pages/Tareas", icon: <FaTasks /> },
    {
      label: "Operacione",
      icon: <CgOptions />,
      children: [
        { label: "Camiones", path: "/pages/Operaciones", icon: <TbBus />},
        { label: "Conductores", path: "/pages/Conductores", icon: <FaPersonCircleCheck/> },
        { label: "Rutas", path: "/pages/RutaViaje", icon: <FaRoute />},
        { label: "Entregas", path: "/pages/Entregas", icon: <TbTruckDelivery/>  },
      ],
    },
    {
      label: "Configuración",
      icon: <IoSettingsSharp />,
      children: [
        { label: "Roles", path: "/pages/Rol", icon: <FaUserShield /> },
        { label: "Seguridad", path: "/pages/chatboot/seguridad", icon: <FaShieldAlt /> },
      ],
    },
    { label: "Usuario", path: "/pages/Usuario", icon: <FaUser /> },
  ];
  
  // Filtrar rutas permitidas según permisos
  const filtrado = menu
    .map((item) => {
      if (item.children) {
        const hijos = item.children.filter((c) => allowedPaths.includes(c.path));
        return hijos.length ? { ...item, children: hijos } : null;
      }
      return allowedPaths.includes(item.path) ? item : null;
    })
    .filter(Boolean);

  return (
    <aside className={`h-full transition-all duration-300 ${showSidebar ? "lg:w-72" : "lg:w-[5.5em]"}`}>
      <div className="h-full px-5 py-4 overflow-y-auto bg-teal-800">
        {/* Logo */}
        <Link to="/pages" className="flex items-center justify-center py-4">
          <div
            className={`transition-all duration-300 bg-white/10 p-2 rounded-full shadow-md ${
              showSidebar ? "w-24 h-24" : "w-10 h-10"
            } flex items-center justify-center`}
          >
            <img
              src={logo}
              alt="Logo"
              className={`object-contain transition-all duration-300 ${
                showSidebar ? "w-20 h-20" : "w-8 h-8"
              } rounded-full`}
            />
          </div>
        </Link>

        <ul className="space-y-2 font-medium">
          {filtrado.map((item) => (
            <li key={item.label}>
              {!item.children ? (
                <Link
                to={item.path}
                className={`flex items-center p-2 text-white rounded-lg hover:bg-teal-700 ${
                  location.pathname === item.path ? "bg-teal-900" : ""
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                {showSidebar && <span className="ms-3">{item.label}</span>}
              </Link>
            ) : (
              <>
                <button
                  onClick={() => toggleSubmenu(item.label)}
                  className="flex items-center justify-between w-full p-2 text-white rounded-lg hover:bg-teal-700"
                >
                  <div className="flex items-center">
                    <span className="text-2xl">{item.icon}</span>
                    {showSidebar && <span className="ms-3">{item.label}</span>}
                  </div>
                  <FiChevronDown
                    className={`transition-transform ${
                      openSubmenus[item.label] ? "rotate-180" : ""
                    } ${!showSidebar ? "ml-auto" : ""}`}
                  />
                </button>

                  {/* Submenú accesible incluso con sidebar colapsado */}
                  {openSubmenus[item.label] && (
                    <ul
                    className={`mt-1 space-y-1 transition-all duration-300 ${
                      showSidebar ? "ml-8" : "ml-4"
                    }`}
                  >
                    {item.children.map((c) => (
                      <li key={c.path}>
                        <Link
                          to={c.path}
                          className={`flex items-center p-2 text-white rounded hover:bg-teal-700 ${
                            location.pathname === c.path ? "bg-teal-900" : ""
                          }`}
                        >
                          <span className="text-2xl">{c.icon}</span>
                          {showSidebar && <span className="ms-3">{c.label}</span>}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
