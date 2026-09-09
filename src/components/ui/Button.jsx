import React from "react";

export function PrimaryButton({ children, onClick, type = "button", style }) {
  return (
    <button type={type} onClick={onClick} className="btn btn-primary" style={style}>
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, type = "button", style }) {
  return (
    <button type={type} onClick={onClick} className="btn btn-ghost" style={style}>
      {children}
    </button>
  );
}

export function IconButton({ children, onClick, danger }) {
  return (
    <button type="button" onClick={onClick} className={`icon-btn ${danger ? "danger" : ""}`}>
      {children}
    </button>
  );
}
