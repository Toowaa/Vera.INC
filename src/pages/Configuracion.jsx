import React, { useState } from "react";
import { useData } from "../context/DataContext.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import FormField from "../components/ui/FormField.jsx";
import { PrimaryButton } from "../components/ui/Button.jsx";

export default function Configuracion() {
  const { config, setConfig } = useData();
  const [form, setForm] = useState(config);
  const [saved, setSaved] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setConfig({ ...form, margenDeseado: Number(form.margenDeseado) || 0 });
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  return (
    <div>
      <PageHeader title="Configuración" subtitle="Datos generales de tu negocio" />
      <div className="card" style={{ padding: 24, maxWidth: 420 }}>
        <form onSubmit={submit}>
          <FormField label="Nombre del negocio">
            <input className="input" value={form.nombreNegocio} onChange={(e) => setForm({ ...form, nombreNegocio: e.target.value })} />
          </FormField>
          <FormField label="Símbolo de moneda">
            <input className="input" value={form.moneda} onChange={(e) => setForm({ ...form, moneda: e.target.value })} placeholder="S/" />
          </FormField>
          <FormField label="Margen deseado (%)">
            <input
              type="number"
              className="input"
              value={form.margenDeseado}
              onChange={(e) => setForm({ ...form, margenDeseado: e.target.value })}
              placeholder="40"
            />
          </FormField>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 8 }}>
            <PrimaryButton type="submit">Guardar cambios</PrimaryButton>
            {saved && <span style={{ color: "var(--success)", fontSize: 13.5, fontWeight: 500 }}>Guardado</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
