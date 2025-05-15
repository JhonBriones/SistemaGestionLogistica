import { Routes, Route } from "react-router-dom";
import { PermisosProvider } from "../context/PermisosContext";
import AuthMiddleware from "../Autenticacion/AuthMiddleware";
import Views from "../componentes/layout/Views";
import Dashboard from "../pages/Dashboard";
import Login from "../Autenticacion/Login";
import Rol from "../pages/Rol";
import Usuario from "../pages/Usuario";
import Operaciones from '../pages/Operaciones';
import Conductores from '../pages/conductores';
import RutaViaje from '../pages/RutaViaje';
import Tareas from '../pages/Tareas';
import Entregas from '../pages/Entregas'
import Perfil from "../pages/Perfil"
import Configuracion from "../pages/Configuracion"

export const Rutas = () => (
  <Routes>
    <Route path="/" element={<Login />} />

    <Route
      path="/pages/*"
      element={
        <PermisosProvider>
          <AuthMiddleware>
            <Views />
          </AuthMiddleware>
        </PermisosProvider>
      }
    >
      <Route index element={<Dashboard />} />
      <Route path="Rol" element={<Rol />} />
      <Route path="Operaciones"element={<Operaciones/>}/>
      <Route path="Usuario" element={<Usuario />} />
      <Route path="Conductores" element={<Conductores/>}/>
      <Route path="RutaViaje" element={<RutaViaje/>}/>
      <Route path="Tareas" element={<Tareas/>}/>
      <Route path="Entregas" element={<Entregas/>}/>
      <Route path="perfil" element={<Perfil />} />
      <Route path="configuracion" element={<Configuracion />} />
      
    </Route>
  </Routes>
);

export default Rutas;
