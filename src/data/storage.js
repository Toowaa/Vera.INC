import { useState, useCallback } from "react";

export function loadCollection(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function saveCollection(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("No se pudo guardar", key, e);
  }
}

export function loadValue(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

export function saveValue(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("No se pudo guardar", key, e);
  }
}

// Generic hook that gives any page CRUD access to a named collection,
// persisted automatically. Add a new module by calling useCollection
// with a new storage key — no other file needs to change.
export function useCollection(key) {
  const [items, setItems] = useState(() => loadCollection(key));

  const add = useCallback(
    (item) => {
      setItems((prev) => {
        const next = [...prev, item];
        saveCollection(key, next);
        return next;
      });
    },
    [key]
  );

  const update = useCallback(
    (id, patch) => {
      setItems((prev) => {
        const next = prev.map((it) => (it.id === id ? { ...it, ...patch } : it));
        saveCollection(key, next);
        return next;
      });
    },
    [key]
  );

  const remove = useCallback(
    (id) => {
      setItems((prev) => {
        const next = prev.filter((it) => it.id !== id);
        saveCollection(key, next);
        return next;
      });
    },
    [key]
  );

  const setAll = useCallback(
    (next) => {
      setItems(next);
      saveCollection(key, next);
    },
    [key]
  );

  return { items, add, update, remove, setAll };
}
