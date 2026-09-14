import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Package, Boxes, ChefHat, Calculator, LayoutDashboard, Settings2, X } from "lucide-react";

// Add a page to the whole app by adding one entry here and one
// <Route> in App.jsx — nothing else needs to change.
const NAV = [
  { to: "/", label: "Inicio", icon: Home, end: true },
  { to: "/productos", label: "Productos", icon: Package },
  { to: "/insumos", label: "Insumos", icon: Boxes },
  { to: "/recetas", label: "Recetas", icon: ChefHat },
  { to: "/costeo", label: "Costeo", icon: Calculator },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/configuracion", label: "Configuración", icon: Settings2 },
];

// En pantallas angostas el sidebar es un cajón (drawer) que se
// desliza desde la izquierda: "open" controla si está visible y
// "onClose" se llama al tocar afuera, la X, o un ítem del menú.
export default function Sidebar({ open, onClose }) {
  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <button className="sidebar-close-btn" onClick={onClose} aria-label="Cerrar menú">
        <X size={16} />
      </button>
      <div className="logo-wrap">
        <span className="logo-text">Cor·al</span>
        <svg width="118" height="14" viewBox="0 0 118 14" style={{ position: "absolute", left: 18, bottom: 8 }}>
          <path
            d="M2 8c14-9 28-8 40-2 13 6 26 7 40-1 12-7 22-3 34 3"
            fill="none"
            stroke="#F0997B"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <nav className="nav">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={onClose} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
