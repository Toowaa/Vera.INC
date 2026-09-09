// Generates the next sequential code for a collection, e.g.
// nextCode("PRO", productos.items, 3) -> "PRO001", "PRO002", ...
// nextCode("REC", recetas.items, 4)   -> "REC0001", "REC0002", ...
export function nextCode(prefix, items, digits) {
  let max = 0;
  items.forEach((it) => {
    if (it.codigo && it.codigo.startsWith(prefix)) {
      const n = parseInt(it.codigo.slice(prefix.length), 10);
      if (!isNaN(n) && n > max) max = n;
    }
  });
  return prefix + String(max + 1).padStart(digits, "0");
}

export const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
