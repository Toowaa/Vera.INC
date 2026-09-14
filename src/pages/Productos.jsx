import { useState } from "react";
import { Plus, Pencil, Trash2, Package, Search } from "lucide-react";
import { useData } from "../context/useData.jsx";
import PageHeader from "../components/layout/PageHeader.jsx";
import Modal from "../components/ui/Modal.jsx";
import FormField from "../components/ui/FormField.jsx";
import { PrimaryButton, GhostButton, IconButton } from "../components/ui/Button.jsx";
import EmptyState from "../components/ui/EmptyState.jsx";
import CreatableSelect from "../components/ui/CreatableSelect.jsx";
import StatusBadge from "../components/ui/StatusBadge.jsx";

const ESTADOS = ["Activo", "Inactivo"];

function emptyForm() {
  return { nombre: "", coleccionId: "", categoriaId: "", estado: "Activo" };
}

export default function Productos() {
  // Una colección agrupa productos de distintas categorías (1 producto -> 1 colección).
  // Una categoría es 1:1 con el producto (cada producto pertenece a una sola categoría).
  const { productos, categoriasProductos, coleccionesProductos } = useData();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState(emptyForm());

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm());
    setModalOpen(true);
  };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ nombre: p.nombre, coleccionId: p.coleccionId || "", categoriaId: p.categoriaId || "", estado: p.estado });
    setModalOpen(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.categoriaId) return;
    // El código PRO001, PRO002... lo genera un trigger en Supabase.
    if (editing) {
      await productos.update(editing.id, form);
    } else {
      await productos.add(form);
    }
    setModalOpen(false);
  };

  const nombreCategoria = (id) => categoriasProductos.items.find((c) => c.id === id)?.nombre || "—";
  const nombreColeccion = (id) => coleccionesProductos.items.find((c) => c.id === id)?.nombre || "—";

  const filtered = productos.items.filter(
    (p) => p.nombre.toLowerCase().includes(search.toLowerCase()) || p.codigo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Productos"
        subtitle="Los artículos que vendes"
        action={
          <PrimaryButton onClick={openNew}>
            <Plus size={16} /> Nuevo producto
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

      {productos.loading ? (
        <p style={{ color: "var(--taupe)", fontSize: 14 }}>Cargando productos…</p>
      ) : filtered.length === 0 ? (
        <EmptyState icon={<Package size={26} />} title="Aún no hay productos" subtitle="Crea tu primer producto para empezar a armar recetas." />
      ) : (
        <div className="card" style={{ overflow: "auto" }}>
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Colección</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td style={{ color: "var(--taupe)", fontFamily: "monospace" }}>{p.codigo}</td>
                  <td style={{ fontWeight: 600 }}>{p.nombre}</td>
                  <td>{nombreColeccion(p.coleccionId)}</td>
                  <td>{nombreCategoria(p.categoriaId)}</td>
                  <td>
                    <StatusBadge estado={p.estado} />
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                      <IconButton onClick={() => openEdit(p)}>
                        <Pencil size={14} />
                      </IconButton>
                      <IconButton danger onClick={() => productos.remove(p.id)}>
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
        <Modal title={editing ? "Editar producto" : "Nuevo producto"} onClose={() => setModalOpen(false)}>
          <form onSubmit={submit}>
            <FormField label="Nombre">
              <input
                className="input"
                autoFocus
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                placeholder="Ej. Mousepad Taylor"
              />
            </FormField>

            <CreatableSelect
              label="Colección"
              items={coleccionesProductos.items}
              value={form.coleccionId}
              onChange={(id) => setForm({ ...form, coleccionId: id })}
              onCreateNew={async (nombre) => {
                const created = await coleccionesProductos.add({ nombre });
                if (created) setForm((f) => ({ ...f, coleccionId: created.id }));
              }}
              placeholder="Sin colección"
            />

            <CreatableSelect
              label="Categoría"
              required
              items={categoriasProductos.items}
              value={form.categoriaId}
              onChange={(id) => setForm({ ...form, categoriaId: id })}
              onCreateNew={async (nombre) => {
                const created = await categoriasProductos.add({ nombre });
                if (created) setForm((f) => ({ ...f, categoriaId: created.id }));
              }}
              placeholder="Selecciona categoría"
            />

            <FormField label="Estado">
              <select className="input" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })}>
                {ESTADOS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </FormField>

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
