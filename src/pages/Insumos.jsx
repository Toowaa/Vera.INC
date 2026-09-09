import React, { useState } from "react";
import { Plus, Pencil, Trash2, Boxes, Search } from "lucide-react";
import { useData } from "../context/DataContext.jsx";
import { nextCode, uid } from "../data/codes.js";
import PageHeader from "../components/layout/PageHeader.jsx";
import Modal from "../components/ui/Modal.jsx";
import FormField from "../components/ui/FormField.jsx";
import { PrimaryButton, GhostButton, IconButton } from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import CreatableSelect from "../components/ui/CreatableSelect.jsx";

function emptyForm() {
  return { nombre: "", unidad: "", categoriaId: "" };
}

export default function Insumos() {
  // Cada insumo tiene una única categoría (relación 1:1 insumo-categoría).
  const { insumos, categoriasInsumos } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm());

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };
  const openEdit = (i) => {
    setEditing(i);
    setForm({ nombre: i.nombre, unidad: i.unidad, categoriaId: i.categoriaId || "" });
    setModalOpen(true);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.categoriaId) return;
    if (editing) {
      insumos.update(editing.id, form);
    } else {
      const codigo = nextCode("INS", insumos.items, 3);
      insumos.add({ id: uid(), codigo, ...form });
    }
    setModalOpen(false);
  };

  const nombreCategoria = (id) => categoriasInsumos.items.find((c) => c.id === id)?.nombre || "—";

  const filtered = insumos.items.filter(
    (i) => i.nombre.toLowerCase().includes(search.toLowerCase()) || i.codigo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Insumos"
        subtitle="Materiales con los que se hacen tus productos"
        action={
          <PrimaryButton onClick={openNew}>
            <Plus size={16} /> Nuevo insumo
          </PrimaryButton>
        }
      />

      <div className="toolbar">
        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input
            className="input"
            style={{ paddingLeft: 34 }}
            placeholder="Buscar por nombre o código…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Boxes size={26} />} title="Aún no hay insumos" subtitle="Registra los materiales que usas para poder armar recetas." />
      ) : (
        <div className="card" style={{ overflow: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Material</th>
                <th>Unidad</th>
                <th>Categoría</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => (
                <tr key={i.id}>
                  <td style={{ color: "var(--taupe)", fontFamily: "monospace" }}>{i.codigo}</td>
                  <td style={{ fontWeight: 600 }}>{i.nombre}</td>
                  <td>{i.unidad || "—"}</td>
                  <td>{nombreCategoria(i.categoriaId)}</td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      <IconButton onClick={() => openEdit(i)}>
                        <Pencil size={14} />
                      </IconButton>
                      <IconButton danger onClick={() => insumos.remove(i.id)}>
                        <Trash2 size={14} />
                      </IconButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? "Editar insumo" : "Nuevo insumo"} onClose={() => setModalOpen(false)}>
          <form onSubmit={submit}>
            <FormField label="Material (nombre del insumo)">
              <input
                className="input"
                autoFocus
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej. Papel rosa sublimar"
              />
            </FormField>

            <FormField label="Unidad de medida">
              <input
                className="input"
                list="unidades-sugeridas"
                value={form.unidad}
                onChange={(e) => setForm({ ...form, unidad: e.target.value })}
                placeholder="Ej. Hoja, Unidad, Kg"
              />
              <datalist id="unidades-sugeridas">
                <option value="Unidad" />
                <option value="Hoja" />
                <option value="Kg" />
                <option value="Litro" />
                <option value="Metro" />
              </datalist>
            </FormField>

            <CreatableSelect
              label="Categoría"
              required
              items={categoriasInsumos.items}
              value={form.categoriaId}
              onChange={(id) => setForm({ ...form, categoriaId: id })}
              onCreateNew={(nombre) => {
                const id = uid();
                categoriasInsumos.add({ id, nombre });
                setForm((f) => ({ ...f, categoriaId: id }));
              }}
              placeholder="Selecciona categoría"
            />

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
