import React, { useState } from "react";
import { Plus, Check, X } from "lucide-react";
import FormField from "./FormField.jsx";

// A <select> plus a "+" toggle that reveals an inline "create new"
// mini-form. Used so Productos can create a Categoría or Colección
// without leaving the page, and Insumos can create a Categoría the
// same way — pass any {id, nombre}[] collection and its add() call.
export default function CreatableSelect({ label, items, value, onChange, onCreateNew, placeholder, required }) {
  const [creating, setCreating] = useState(false);
  const [nombre, setNombre] = useState("");

  const confirm = () => {
    const trimmed = nombre.trim();
    if (!trimmed) return;
    onCreateNew(trimmed);
    setNombre("");
    setCreating(false);
  };

  return (
    <FormField label={label}>
      <div className="creatable-row">
        <select className="input" value={value} onChange={(e) => onChange(e.target.value)} required={required}>
          <option value="">{placeholder || "Selecciona…"}</option>
          {items.map((it) => (
            <option key={it.id} value={it.id}>
              {it.nombre}
            </option>
          ))}
        </select>
        <button type="button" className="btn btn-ghost" style={{ padding: "10px 12px" }} onClick={() => setCreating((c) => !c)}>
          <Plus size={14} />
        </button>
      </div>
      {creating && (
        <div className="creatable-new">
          <input
            className="input"
            autoFocus
            placeholder="Nuevo nombre…"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                confirm();
              }
            }}
          />
          <button type="button" className="icon-btn" onClick={confirm}>
            <Check size={14} />
          </button>
          <button
            type="button"
            className="icon-btn danger"
            onClick={() => {
              setCreating(false);
              setNombre("");
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}
    </FormField>
  );
}
