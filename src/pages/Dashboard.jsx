import React from "react";
import { Package, Boxes, Layers, AlertTriangle } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";

export default function Dashboard() {
  const { productos, insumos, recetas, coleccionesProductos } = useData();

  const activos = productos.items.filter((p) => p.estado === "Activo").length;
  const inactivos = productos.items.length - activos;
  const productosConReceta = new Set(recetas.items.map((r) => r.productoId));
  const sinReceta = productos.items.filter((p) => !productosConReceta.has(p.id)).length;

  const cards = [
    { label: "Productos activos", value: activos, icon: Package },
    { label: "Productos inactivos", value: inactivos, icon: Package },
    { label: "Insumos registrados", value: insumos.items.length, icon: Boxes },
    { label: "Colecciones", value: coleccionesProductos.items.length, icon: Layers },
  ];

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="Un vistazo rápido a tu negocio" />
      <div className="stat-grid">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.label} className="stat-card">
              <div className="module-icon" style={{ marginBottom: 12 }}>
                <Icon size={16} />
              </div>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 700, fontFamily: "'Sora',sans-serif" }}>{c.value}</p>
              <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--taupe)" }}>{c.label}</p>
            </div>
          );
        })}
      </div>
      {sinReceta > 0 && (
        <div
          className="card"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 16px",
            background: "#FDF2E7",
            borderColor: "#F3D9AE",
            color: "#8A5A15",
            fontSize: 13.5,
          }}
        >
          <AlertTriangle size={17} />
          {sinReceta} producto{sinReceta > 1 ? "s no tienen" : " no tiene"} receta configurada.
        </div>
      )}
    </div>
  );
}
