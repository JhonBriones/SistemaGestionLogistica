import { useEffect, useState } from "react";
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import { RiShieldUserLine } from "react-icons/ri";
import axios from "axios";
import CreateUsuario from "../modal/CreateUsuario";

export const UsuarioTable = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [usuarioEdit, setUsuarioEdit] = useState(null);  
    const [showModal, setShowModal] = useState(false);  


    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/usuarios"); 
                setUsuarios(response.data.usuarios);
            } catch (error) {
                console.error("Error al obtener los usuarios:", error);
            }
        };

        fetchUsuarios();
    }, []);

     
    const handleEdit = (usuario) => {
        setUsuarioEdit(usuario); 
        setShowModal(true);
    };

   
    const closeModal = () => {
        setShowModal(false); 
        setUsuarioEdit(null); 
    };

    return (
        <div>
            <div className="overflow-x-auto rounded-xl bg-white shadow-lg ring-1 ring-black/5">
                <div className="inline-block min-w-full align-middle">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-teal-700 text-white">
                            <tr>
                                <th className="border border-black px-4 py-2 text-sm">Perfil</th>
                                <th className="border border-black px-4 py-2 text-sm">Usuario</th>
                                <th className="border border-black px-4 py-2 text-sm">Contraseña</th>
                                <th className="border border-black px-4 py-2 text-sm">Rol</th>
                                <th className="border border-black px-4 py-2 text-sm">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {usuarios.map((usuario) => (
                                <tr key={usuario.id_usuario}>
                                    <td className="border border-black px-4 py-2 text-center">
                                        <div className="flex items-center">
                                            <RiShieldUserLine className="h-8 w-8 text-sky-600" />
                                        </div>
                                    </td>
                                    <td className="border border-black px-4 py-2 text-center">
                                        <div className="text-sm font-medium text-gray-900">
                                            {usuario.usuario}
                                        </div>
                                    </td>
                                    <td className="border border-black px-4 py-2 text-center">
                                        <div className="flex items-center">
                                            <span className="text-sm text-gray-500">    {usuario.password}</span>
                                        </div>
                                    </td>
                                    <td className="border border-black px-4 py-2 text-center">
                                        <span className="flex justify-center rounded-full px-3 py-1 text-sm font-medium">
                                            {usuario.rol}
                                        </span>
                                    </td>
                                    <td className="border border-black px-4 py-2 text-center">
                                        <div className="flex justify-center space-x-3">
                                            <button
                                                className="text-blue-700 hover:text-blue-800 transition-colors"
                                                title="Editar usuario"
                                                onClick={() => handleEdit(usuario)} // Llama a la función para abrir el modal
                                            >
                                                <FaRegEdit className="h-5 w-5" />
                                            </button>
                                            <button className="text-red-600 hover:text-red-800 transition-colors" title="Eliminar usuario">
                                                <FaTrashAlt className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mostrar el modal solo si showModal es true */}
            {showModal && <CreateUsuario Close={closeModal} usuarioEdit={usuarioEdit} />}
        </div>
    );
};

export default UsuarioTable;