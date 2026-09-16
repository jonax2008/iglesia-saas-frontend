/**
 * Extrae fecha de nacimiento y sexo de un CURP mexicano válido (18
 * caracteres). Es solo una ayuda para autocompletar el formulario; los
 * campos siguen siendo editables por si el CURP no aplica (miembros
 * nacidos fuera de México) o tiene un error de captura.
 */
export function datosDesdeCurp(
  curp: string,
): { fechaNacimiento: string; sexo: "M" | "F" } | null {
  const valor = curp.trim().toUpperCase();
  if (!/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(valor)) return null;

  const yy = valor.slice(4, 6);
  const mm = valor.slice(6, 8);
  const dd = valor.slice(8, 10);
  const sexoCurp = valor[10];

  const anioActual2d = new Date().getFullYear() % 100;
  const siglo = Number(yy) > anioActual2d ? "19" : "20";

  return {
    fechaNacimiento: `${siglo}${yy}-${mm}-${dd}`,
    sexo: sexoCurp === "H" ? "M" : "F",
  };
}
