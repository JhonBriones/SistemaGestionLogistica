"use client"

import { useState, useEffect } from "react"
import GraficosDash from '../componentes/charts/GraficosDash'
import TarjetasDash from '../componentes/cards/TarjetasDash';

export const Dashboard = () => {
  const [nombreUsuario, setNombreUsuario] = useState("")

  useEffect(() => {
    // Obtener el nombre de usuario del localStorage
    const usuario = localStorage.getItem("usuario")
    setNombreUsuario(usuario || "")
  }, [])
  
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">🚚 Panel de Control - Flota de Camiones</h1>
        {nombreUsuario && (
          <p className="text-blue-600 mt-2">
            Bienvenido, <span className="font-semibold">{nombreUsuario}</span>
          </p>
        )}
      </div>
      {/* KPIs principales */}
      <TarjetasDash/>

      {/* Gráficos */}
      <GraficosDash/>
    
    </div>
  );
};

export default Dashboard;
