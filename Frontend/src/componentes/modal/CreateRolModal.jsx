import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { RutesConfig } from "../../routes/RutesConfig";

const CreateRolModal = ({ Close, RolEditar }) => {
    const [nombreRol, setNombreRol] = useState("");
    const [seleccionados, setSeleccionados] = useState([]);

    const rutas = Object.entries(RutesConfig);

    // Cargar datos si se edita un rol
    useEffect(() => {
        const cargarDatosRol = async () => {
            if (RolEditar && RolEditar.idRol) {
                try {
                    // Cargar nombre del rol directamente desde RolEditar
                    setNombreRol(RolEditar.tipo || "");

                    // Cargar permisos desde API
                    const { data } = await axios.get("http://localhost:3001/api/permisos");

                    // Filtrar permisos por id del rol a editar
                    const permisosDelRol = data.permiso
                        .filter(p => p.role_id === RolEditar.idRol)
                        .map(p => p.permisos);

                    setSeleccionados(permisosDelRol);
                } catch (error) {
                    console.error("Error al cargar datos del rol:", error);
                }
            }
        };

        cargarDatosRol();
    }, [RolEditar]);

    const handleCheckboxChange = (ruta) => {
        if (seleccionados.includes(ruta)) {
            setSeleccionados(seleccionados.filter((r) => r !== ruta));
        } else {
            setSeleccionados([...seleccionados, ruta]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { rol: nombreRol, permisos: seleccionados };

            console.log(payload);
            

            if (RolEditar) {
               
                await axios.put(`http://localhost:3001/api/rol/${RolEditar.idRol}`, payload);
            } else {
                // Crear nuevo rol
                await axios.post("http://localhost:3001/api/rol", payload);
            }
            Close();
        } catch (error) {
            console.error("Error al guardar rol:", error.response?.data || error);
        }
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center z-50 backdrop-blur-sm bg-black/30">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative animate-fade-in-down">
                {/* Botón cerrar */}
                <button
                    onClick={Close}
                    className="absolute top-4 right-4 text-gray-700 hover:text-red-500"
                >
                    <IoMdClose size={24} />
                </button>
    
                <h2 className="text-xl font-semibold text-black mb-4">
                    {RolEditar ? "Editar rol" : "Agregar rol"}
                </h2>
    
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre del Rol */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-1">
                            Nombre del Rol
                        </label>
                        <input
                            type="text"
                            value={nombreRol}
                            onChange={(e) => setNombreRol(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-black outline-none"
                            required
                        />
                    </div>
    
                    {/* Módulos con permisos */}
                    <div>
                        <label className="block text-sm font-medium text-black mb-2">
                            Asignar permisos
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                            {rutas.map(([path, label]) => (
                                <label
                                    key={path}
                                    className="flex items-center space-x-2 text-black"
                                >
                                    <input
                                        type="checkbox"
                                        value={path}
                                        checked={seleccionados.includes(path)}
                                        onChange={() => handleCheckboxChange(path)}
                                        className="form-checkbox text-blue-600"
                                    />
                                    <span>{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
    
                    {/* Botón Guardar */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition"
                        >
                            {RolEditar ? "Actualizar rol" : "Guardar rol"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
    
};

export default CreateRolModal;
