export type CategoriaAsistencia =
  | "oracion_5am"
  | "oracion_9am"
  | "oracion_7pm"
  | "dominical"
  | "servicio";

const ETIQUETAS: Record<CategoriaAsistencia, string> = {
  oracion_5am: "Oración de 5 am",
  oracion_9am: "Oración de 9 am",
  oracion_7pm: "Oración de 7 pm",
  dominical: "Dominical",
  servicio: "Servicio",
};

/**
 * Regla de negocio 8: lunes/martes/miércoles/viernes/sábado -> oraciones
 * (5am, 9am, 7pm); jueves -> 5am, 9am, servicio; domingo -> 5am, dominical,
 * servicio. La primera de la lista es el default sugerido.
 */
export function categoriasDelDia(fechaISO: string): CategoriaAsistencia[] {
  const dia = new Date(`${fechaISO}T00:00:00`).getDay();
  if (dia === 0) return ["oracion_5am", "dominical", "servicio"];
  if (dia === 4) return ["oracion_5am", "oracion_9am", "servicio"];
  return ["oracion_5am", "oracion_9am", "oracion_7pm"];
}

export function etiquetaCategoria(categoria: string): string {
  return ETIQUETAS[categoria as CategoriaAsistencia] ?? categoria;
}

export function hoyISO(): string {
  return new Date().toISOString().slice(0, 10);
}
