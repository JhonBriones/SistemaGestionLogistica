import { useLocation, Navigate } from "react-router-dom";
import { usePermisos } from "../context/PermisosContext";

const AuthMiddleware = ({ children }) => {

  const { allowedPaths } = usePermisos();
  const location = useLocation();

  // Mientras carga permisos
  if (allowedPaths === null) return null;   
  // Si no está autorizado, redirigir
  if (!allowedPaths.includes(location.pathname)) {
    return <Navigate to="/pages" replace />;
  }
  return children;
};

export default AuthMiddleware;
