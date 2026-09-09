import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar.jsx";
import Inicio from "./pages/Inicio.jsx";
import Productos from "./pages/Productos.jsx";
import Insumos from "./pages/Insumos.jsx";
import Recetas from "./pages/Recetas.jsx";
import Costeo from "./pages/Costeo.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Configuracion from "./pages/Configuracion.jsx";

// Para agregar un módulo nuevo (ej. "Clientes" o "Pedidos"):
// 1) crea src/pages/Clientes.jsx
// 2) agrégalo aquí como <Route path="/clientes" element={<Clientes/>} />
// 3) agrégalo a NAV en components/layout/Sidebar.jsx
export default function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/insumos" element={<Insumos />} />
          <Route path="/recetas" element={<Recetas />} />
          <Route path="/costeo" element={<Costeo />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/configuracion" element={<Configuracion />} />
        </Routes>
      </main>
    </div>
  );
}
