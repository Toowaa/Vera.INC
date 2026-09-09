import React from "react";

export default function StatusBadge({ estado }) {
  const active = estado === "Activo";
  return <span className={`badge ${active ? "badge-success" : "badge-muted"}`}>{estado}</span>;
}
