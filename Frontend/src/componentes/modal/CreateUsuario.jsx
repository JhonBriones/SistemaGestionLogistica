import { IoMdClose } from "react-icons/io";
import { FaUser, FaLock, FaUserShield, FaImage } from "react-icons/fa";
import axios from "axios";
import { useEffect, useState } from "react";

export const CreateUsuario = ({ Close, usuarioEdit = null }) => {
    const [rol, setRol] = useState([]);
    const [formData, setFormData] = useState({
        imagen: "",
        usuario: "",
        password: "",
        idRol: "",
    });

    useEffect(() => {
        if (usuarioEdit) {
            setFormData({
                imagen: "",
                usuario: usuarioEdit.usuario, 
                password: "", 
                idRol: usuarioEdit.idRol, 
            });
        }
    }, [usuarioEdit]);

    useEffect(() => {
        const fetchRol = async () => {
            const response = await axios.get("http://localhost:3001/api/rol");
            setRol(response.data.rol);
        };
        fetchRol();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (usuarioEdit) {
                await axios.put(`http://localhost:3001/api/usuarios/${usuarioEdit.id_usuario}`, formData);
            } else {
                await axios.post("http://localhost:3001/api/register", formData);
            }
            Close();
        } catch (error) {
            console.error("Error al registrar:", error.response?.data);
        }
    };

    return (
        <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-lg mx-4 p-6 animate-fade-in-down">
                {/* Header */}
                <div className="flex justify-between items-center border-b pb-3 mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {usuarioEdit ? "Editar Usuario" : "Agregar Nuevo Usuario"}
                    </h3>
                    <button onClick={Close} className="text-gray-600 dark:text-gray-300 hover:text-red-500">
                        <IoMdClose className="text-2xl" />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Imagen */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
                            Imagen de Perfil
                        </label>
                        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                            <FaImage className="text-gray-400" />
                            <input
                                type="file"
                                id="imagen"
                                name="imagen"
                                value={formData.imagen}
                                onChange={handleChange}
                                className="w-full text-sm bg-transparent text-gray-800 dark:text-white"
                            />
                        </div>
                    </div>

                    {/* Usuario */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Usuario</label>
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                            <FaUser className="text-gray-400" />
                            <input
                                type="text"
                                id="usuario"
                                name="usuario"
                                value={formData.usuario}
                                onChange={handleChange}
                                className="w-full bg-transparent outline-none text-gray-800 dark:text-white"
                                placeholder="DNI o nombre de usuario"
                            />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">Contraseña</label>
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 p-2 rounded-md">
                            <FaLock className="text-gray-400" />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full bg-transparent outline-none text-gray-800 dark:text-white"
                                placeholder="********"
                            />
                        </div>
                    </div>

                    {/* Rol */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                        <div className="flex items-center gap-2 dark:bg-gray-700 p-2 rounded-md">
                            <FaUserShield className="text-gray-400" />
                            <select
                                id="idRol"
                                name="idRol"
                                value={formData.idRol}
                                onChange={handleChange}
                                className="w-full bg-transparent outline-none text-gray-800"
                            >
                                <option value="">Selecciona un rol</option>
                                {rol.map((ro) => (
                                    <option key={ro.idRol} value={ro.idRol}>
                                        {ro.tipo}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Botón */}
                    <div className="pt-3">
                        <button
                            type="submit"
                            className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-all"
                        >
                            {usuarioEdit ? "Actualizar Usuario" : "Agregar Usuario"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUsuario;
