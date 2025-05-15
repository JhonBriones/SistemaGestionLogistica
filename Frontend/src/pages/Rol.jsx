import { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa";
import CreateRolModal from "../componentes/modal/CreateRolModal";

export const Rol = () => {

    const [roles, setRoles] = useState([]);
    const [open, setOpen] = useState(false);
    const [rolEditar, setRolEditar] = useState(null);

    const fetchRoles = async () => {
        try {
            const res = await axios.get("http://localhost:3001/api/rol");
            setRoles(res.data.rol);
        } catch (error) {
            console.error("Error al obtener los roles:", error);
        }
    };
    

    useEffect(() => {
        fetchRoles();
    }, []);

    const handleCrearRol = () => {
        setRolEditar(null); // Asegura que no esté en modo edición
        setOpen(true);
    };

    const handleEditarRol = (rl) => {
        setRolEditar(rl);
        setOpen(true);
    };

    const handleCerrarModal = () => {
        setOpen(false);
        setRolEditar(null);
    };

    

    return (
        <div className="p-6">
            {/* Encabezado con botón */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gestión de Roles</h2>
                <button
                    name="btn-rol"
                    onClick={handleCrearRol}
                    className="flex items-center gap-2 bg-teal-900 hover:bg-teal-700 text-white px-4 py-2 rounded-md shadow-md transition-all"
                >
                    <FaPlus />
                    <span>Agregar Rol</span>
                </button>
            </div>

            {/* Modal */}
            {open && (
                <CreateRolModal
                    Close={handleCerrarModal}                    
                    RolEditar={rolEditar}
                />
            )}

            {/* Tarjetas de roles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {roles.map((rl) => (                                       
                    <div
                        key={rl.idRol}
                        className="p-6 bg-teal-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex flex-col items-center justify-between h-full">
                        <span className="text-lg font-medium text-white dark:text-white mb-4">
                                {rl.tipo.toUpperCase()}
                            </span>
                            <button
                                className="bg-teal-700 hover:bg-teal-600 text-white px-4 py-1 rounded-md shadow-md transition-all text-sm"
                                onClick={() => handleEditarRol(rl)}
                            >
                                Editar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rol;
