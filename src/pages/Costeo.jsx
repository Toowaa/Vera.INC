import React from "react";
import { Calculator, AlertTriangle } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

export default function Costeo() {
  const { productos, insumos, recetas } = useData();

  const insumoMap = {};
  insumos.items.forEach((i) => {
    insumoMap[i.id] = i;
  });

  const rowsByProducto = {};
  recetas.items.forEach((r) => {
    if (!rowsByProducto[r.productoId]) rowsByProducto[r.productoId] = [];
    rowsByProducto[r.productoId].push(r);
  });

  return (
    <div>
      <PageHeader title="Costeo" subtitle="Composición de insumos por producto" />
      {productos.items.length === 0 ? (
        <EmptyState icon={<Calculator size={26} />} title="Aún no hay productos" subtitle="Crea productos y sus recetas para ver aquí su composición." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {productos.items.map((p) => {
            const rows = rowsByProducto[p.id] || [];
            return (
              <div key={p.id} className="card" style={{ padding: 18 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: rows.length ? 12 : 0 }}>
                  <div>
                    <p style={{ margin: 0, fontFamily: "'Sora',sans-serif", fontWeight: 600 }}>{p.nombre}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--taupe)", fontFamily: "monospace" }}>{p.codigo}</p>
                  </div>
                  {rows.length === 0 && (
                    <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "var(--warning)" }}>
                      <AlertTriangle size={14} /> Sin receta
                    </span>
                  )}
                </div>
                {rows.length > 0 && (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Insumo</th>
                        <th>Proceso</th>
                        <th>Cantidad</th>
                        <th>Unidad</th>
                        <th>Merma</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((r) => {
                        const ins = insumoMap[r.insumoId];
                        return (
                          <tr key={r.id}>
                            <td>
                              {ins ? ins.nombre : "—"} <span style={{ color: "var(--taupe)", fontSize: 12 }}>({ins ? ins.codigo : "—"})</span>
                            </td>
                            <td>{r.proceso || "—"}</td>
                            <td>{r.cantidad}</td>
                            <td>{r.unidad}</td>
                            <td>{r.merma || 0}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            );
          })}
        </div>
      )}
      <p style={{ fontSize: 12.5, color: "var(--taupe)", marginTop: 18 }}>
        Nota: para calcular costos y márgenes en soles, agrega un costo unitario a tus insumos (dile a Claude que lo conecte cuando quieras).
      </p>
    </div>
  );
}
