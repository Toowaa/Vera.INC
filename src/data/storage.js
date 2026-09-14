import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient.js";

// Las tablas en Supabase usan snake_case (coleccion_id, categoria_id...)
// y el resto de la app usa camelCase (coleccionId, categoriaId...).
// Estas dos funciones hacen la conversión en un solo lugar, así
// ninguna página necesita saber cómo se llaman las columnas en SQL.
const camelToSnake = (str) => str.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase());
const snakeToCamel = (str) => str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

function toDbRow(obj) {
  const row = {};
  Object.entries(obj).forEach(([k, v]) => {
    if (k === "id") return; // el id lo genera Supabase (gen_random_uuid())
    if (k === "codigo") return; // el código lo genera un trigger en la base de datos
    row[camelToSnake(k)] = v === "" ? null : v;
  });
  return row;
}

function fromDbRow(row) {
  const obj = {};
  Object.entries(row).forEach(([k, v]) => {
    obj[snakeToCamel(k)] = v === null ? "" : v;
  });
  return obj;
}

// Hook genérico de CRUD contra una tabla de Supabase. Devuelve la
// misma forma que antes devolvía localStorage ({items, add, update,
// remove}), más "loading" y "error" — así las páginas casi no cambian.
// Agregar un módulo nuevo es solo llamar useCollection("nombre_tabla").
export function useCollection(table, { orderBy = "created_at", ascending = true } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table).select("*").order(orderBy, { ascending });
    if (error) setError(error);
    else {
      setItems(data.map(fromDbRow));
      setError(null);
    }
    setLoading(false);
  }, [table, orderBy, ascending]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = useCallback(
    async (item) => {
      const { data, error } = await supabase.from(table).insert(toDbRow(item)).select().single();
      if (error) {
        setError(error);
        return null;
      }
      const created = fromDbRow(data);
      setItems((prev) => [...prev, created]);
      return created;
    },
    [table]
  );

  const update = useCallback(
    async (id, patch) => {
      const { data, error } = await supabase.from(table).update(toDbRow(patch)).eq("id", id).select().single();
      if (error) {
        setError(error);
        return null;
      }
      const updated = fromDbRow(data);
      setItems((prev) => prev.map((it) => (it.id === id ? updated : it)));
      return updated;
    },
    [table]
  );

  const remove = useCallback(
    async (id) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) {
        setError(error);
        return false;
      }
      setItems((prev) => prev.filter((it) => it.id !== id));
      return true;
    },
    [table]
  );

  return { items, add, update, remove, refresh, loading, error };
}

// La configuración vive en una sola fila fija (id = true) en la tabla
// "configuracion" — ver supabase/schema.sql.
export function useConfig() {
  const [config, setConfigState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.from("configuracion").select("*").eq("id", true).single();
      if (!error) setConfigState(fromDbRow(data));
      setLoading(false);
    })();
  }, []);

  const setConfig = useCallback(async (next) => {
    const { data, error } = await supabase.from("configuracion").update(toDbRow(next)).eq("id", true).select().single();
    if (!error) setConfigState(fromDbRow(data));
    return !error;
  }, []);

  const fallback = { nombreNegocio: "Cor.al Studio", moneda: "S/", margenDeseado: 40 };
  return { config: config || fallback, setConfig, loading };
}
