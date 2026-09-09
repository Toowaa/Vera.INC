import React from "react";
import { Link } from "react-router-dom";
import { Package, Boxes, ChefHat, Calculator, LayoutDashboard, Settings2 } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";

export default function Inicio() {
  const { productos, insumos, recetas, config } = useData();

  const modules = [
    { to: "/productos", label: "Productos", icon: Package, desc: `${productos.items.length} registrados` },
    { to: "/insumos", label: "Insumos", icon: Boxes, desc: `${insumos.items.length} registrados` },
    { to: "/recetas", label: "Recetas", icon: ChefHat, desc: `${recetas.items.length} vínculos` },
    { to: "/costeo", label: "Costeo", icon: Calculator, desc: "Composición de productos" },
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, desc: "Resumen del negocio" },
    { to: "/configuracion", label: "Configuración", icon: Settings2, desc: "Datos del negocio" },
  ];

  return (
    <div>
      <PageHeader title={config.nombreNegocio} subtitle="Sistema de gestión creativa" />
      <div style={{ height: 2, background: "linear-gradient(90deg,#F0997B,#FF6F47 40%,#F6D9CB)", marginBottom: 26 }} />
      <div className="module-grid">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.to} to={m.to} className="module-card">
              <div className="module-icon">
                <Icon size={19} />
              </div>
              <div>
                <p style={{ margin: 0, fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 15.5 }}>{m.label}</p>
                <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--taupe)" }}>{m.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
