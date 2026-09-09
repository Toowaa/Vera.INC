import React from "react";

export default function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="empty-state">
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 10, color: "#F0997B" }}>{icon}</div>
      <p style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, color: "var(--ink)", margin: "0 0 4px" }}>{title}</p>
      <p style={{ fontSize: 13.5, margin: 0 }}>{subtitle}</p>
    </div>
  );
}
