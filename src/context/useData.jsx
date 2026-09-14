import { useContext } from "react";
import { DataCtx } from "./DataContext.jsx";

export function useData() {
  const ctx = useContext(DataCtx);
  if (!ctx) throw new Error("useData debe usarse dentro de <DataProvider>");
  return ctx;
}