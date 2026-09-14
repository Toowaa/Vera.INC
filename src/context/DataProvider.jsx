import { useCollection, useConfig } from "../data/storage.js";
import { DataCtx } from "./DataContext.jsx";

// Agregar un módulo nuevo (ej. "clientes") más adelante es una línea
// más aquí: const clientes = useCollection("clientes"); y sumarlo
// al value del provider. La tabla debe existir en Supabase primero
// (ver supabase/schema.sql).
export function DataProvider({ children }) {
  const productos = useCollection("productos", { orderBy: "codigo" });
  const insumos = useCollection("insumos", { orderBy: "codigo" });
  const recetas = useCollection("recetas", { orderBy: "codigo" });
  const categoriasProductos = useCollection("categorias_productos", { orderBy: "nombre" });
  const coleccionesProductos = useCollection("colecciones_productos", { orderBy: "nombre" });
  const categoriasInsumos = useCollection("categorias_insumos", { orderBy: "nombre" });
  const { config, setConfig, loading: configLoading } = useConfig();

  return (
    <DataCtx.Provider
      value={{
        productos,
        insumos,
        recetas,
        categoriasProductos,
        coleccionesProductos,
        categoriasInsumos,
        config,
        setConfig,
        configLoading,
      }}
    >
      {children}
    </DataCtx.Provider>
  );
}