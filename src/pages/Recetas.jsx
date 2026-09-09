import React, { useState } from "react";
import { Plus, Pencil, Trash2, ChefHat } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import { nextCode, uid } from "../data/codes.js";
import PageHeader from "../components/layout/PageHeader.jsx";
import Modal from "../components/ui/Modal.jsx";
import FormField from "../components/ui/FormField.jsx";
import { PrimaryButton, GhostButton, IconButton } from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";

function emptyForm() {
  return { productoId: "", insumoId: "", proceso: "", cantidad: "", unidad: "", merma: "0" };
}

export default function Recetas() {
  // Cada fila enlaza un producto con un insumo, el proceso donde se
  // usa, la cantidad, la unidad y el % de merma — igual que tu hoja
  // de cálculo (REC0001, REC0002, ...).
  const { recetas, productos, insumos } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm());

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };
  const openEdit = (r) => {
    setEditing(r);
    setForm({
      productoId: r.productoId,
      insumoId: r.insumoId,
      proceso: r.proceso,
      cantidad: r.cantidad,
      unidad: r.unidad,
      merma: r.merma,
    });
    setModalOpen(true);
  };

  const onInsumoChange = (insumoId) => {
    const ins = insumos.items.find((i) => i.id === insumoId);
    setForm((f) => ({ ...f, insumoId, unidad: f.unidad || (ins ? ins.unidad : "") }));
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.productoId || !form.insumoId || form.cantidad === "") return;
    if (editing) {
      recetas.update(editing.id, form);
    } else {
      const codigo = nextCode("REC", recetas.items, 4);
      recetas.add({ id: uid(), codigo, ...form });
    }
    setModalOpen(false);
  };

  const productoOf = (id) => productos.items.find((p) => p.id === id);
  const insumoOf = (id) => insumos.items.find((i) => i.id === id);

  return (
    <div>
      <PageHeader
        title="Recetas"
        subtitle="Enlaza cada producto con los insumos y procesos que lleva"
        action={
          <PrimaryButton onClick={openNew}>
            <Plus size={16} /> Nuevo vínculo
          </PrimaryButton>
        }
      />

      {productos.items.length === 0 || insumos.items.length === 0 ? (
        <EmptyState
          icon={<ChefHat size={26} />}
          title="Primero crea productos e insumos"
          subtitle="Las recetas enlazan productos ya registrados con insumos ya registrados."
        />
      ) : recetas.items.length === 0 ? (
        <EmptyState icon={<ChefHat size={26} />} title="Aún no hay recetas" subtitle="Crea el primer vínculo entre un producto y un insumo." />
      ) : (
        <div className="card" style={{ overflow: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Cód. receta</th>
                <th>Cód. producto</th>
                <th>Producto</th>
                <th>Cód. insumo</th>
                <th>Insumo</th>
                <th>Proceso</th>
                <th>Cantidad</th>
                <th>Unidad</th>
                <th>Merma</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recetas.items.map((r) => {
                const p = productoOf(r.productoId);
                const i = insumoOf(r.insumoId);
                return (
                  <tr key={r.id}>
                    <td style={{ fontFamily: "monospace", color: "var(--taupe)" }}>{r.codigo}</td>
                    <td style={{ fontFamily: "monospace", color: "var(--taupe)" }}>{p ? p.codigo : "—"}</td>
                    <td style={{ fontWeight: 600 }}>{p ? p.nombre : "—"}</td>
                    <td style={{ fontFamily: "monospace", color: "var(--taupe)" }}>{i ? i.codigo : "—"}</td>
                    <td>{i ? i.nombre : "—"}</td>
                    <td>{r.proceso || "—"}</td>
                    <td>{r.cantidad}</td>
                    <td>{r.unidad}</td>
                    <td>{r.merma || 0}%</td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <IconButton onClick={() => openEdit(r)}>
                          <Pencil size={14} />
                        </IconButton>
                        <IconButton danger onClick={() => recetas.remove(r.id)}>
                          <Trash2 size={14} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? "Editar vínculo de receta" : "Nuevo vínculo de receta"} onClose={() => setModalOpen(false)} wide>
          <form onSubmit={submit}>
            <FormField label="Producto">
              <select className="input" value={form.productoId} onChange={(e) => setForm({ ...form, productoId: e.target.value })} required>
                <option value="">Selecciona producto…</option>
                {productos.items.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.codigo} — {p.nombre}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Insumo">
              <select className="input" value={form.insumoId} onChange={(e) => onInsumoChange(e.target.value)} required>
                <option value="">Selecciona insumo…</option>
                {insumos.items.map((i) => (
                  <option key={i.id} value={i.id}>
                    {i.codigo} — {i.nombre}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Proceso">
              <input
                className="input"
                list="procesos-sugeridos"
                value={form.proceso}
                onChange={(e) => setForm({ ...form, proceso: e.target.value })}
                placeholder="Ej. Ensamblado, Impresión, Empaque"
              />
              <datalist id="procesos-sugeridos">
                <option value="Impresión" />
                <option value="Ensamblado" />
                <option value="Empaque" />
                <option value="Corte" />
                <option value="Sellado" />
                <option value="Laminado" />
              </datalist>
            </FormField>

            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <FormField label="Cantidad">
                  <input
                    type="number"
                    step="0.01"
                    className="input"
                    value={form.cantidad}
                    onChange={(e) => setForm({ ...form, cantidad: e.target.value })}
                    placeholder="1"
                  />
                </FormField>
              </div>
              <div style={{ flex: 1 }}>
                <FormField label="Unidad">
                  <input className="input" value={form.unidad} onChange={(e) => setForm({ ...form, unidad: e.target.value })} placeholder="Unidad, Hoja…" />
                </FormField>
              </div>
              <div style={{ flex: 1 }}>
                <FormField label="Merma (%)">
                  <input
                    type="number"
                    step="0.1"
                    className="input"
                    value={form.merma}
                    onChange={(e) => setForm({ ...form, merma: e.target.value })}
                    placeholder="0"
                  />
                </FormField>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <PrimaryButton type="submit">Guardar</PrimaryButton>
              <GhostButton onClick={() => setModalOpen(false)}>Cancelar</GhostButton>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
