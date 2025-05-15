import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const PermisosContext = createContext();

export const PermisosProvider = ({ children }) => {
    
    const [allowedPaths, setAllowedPaths] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get("http://localhost:3001/api/permisos");
                const idRol = Number(localStorage.getItem("idRol"));
                const rutas = data.permiso.filter((p) => p.role_id === idRol).map((p) => p.permisos);
                setAllowedPaths(rutas);
            } catch {
                setAllowedPaths([]); 
            }
            })();
    }, []);
    return (
        <PermisosContext.Provider value={{ allowedPaths }}>
            {children}
        </PermisosContext.Provider>
    );
};

export const usePermisos = () => {
    const ctx = useContext(PermisosContext);
        if (!ctx) throw new Error("usePermisos debe usarse dentro de PermisosProvider");
    return ctx;
};
