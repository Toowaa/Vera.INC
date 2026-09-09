import React, { createContext, useContext, useState } from "react";
import { useCollection, loadValue, saveValue } from "../data/storage.js";

const DataCtx = createContext(null);

const DEFAULT_CONFIG = {
  nombreNegocio: "Cor.al Studio",
  moneda: "S/",
  margenDeseado: 40,
};

// Adding a new module (e.g. "clientes") later is just one more
// useCollection(...) line here, then reading it from useData()
// in the new page component.
export function DataProvider({ children }) {
  const productos = useCollection("coral_productos");
  const insumos = useCollection("coral_insumos");
  const recetas = useCollection("coral_recetas");
  const categoriasProductos = useCollection("coral_categorias_productos");
  const coleccionesProductos = useCollection("coral_colecciones_productos");
  const categoriasInsumos = useCollection("coral_categorias_insumos");

  const [config, setConfigState] = useState(() => loadValue("coral_config", DEFAULT_CONFIG));
  const setConfig = (next) => {
    setConfigState(next);
    saveValue("coral_config", next);
  };

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
      }}
    >
      {children}
    </DataCtx.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataCtx);
  if (!ctx) throw new Error("useData debe usarse dentro de <DataProvider>");
  return ctx;
}
