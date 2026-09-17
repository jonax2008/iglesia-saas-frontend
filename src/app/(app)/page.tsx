import { obtenerUsuarioActual } from "@/lib/auth";
import { BotonActualizarAutomatizaciones } from "./actualizar-automatizaciones/boton";
import { DashboardCategorias } from "./dashboard-categorias";

export default async function PaginaInicio() {
  const usuario = await obtenerUsuarioActual();
  const esAdmin = ["super_admin", "ministro_en_turno", "encargado_estadistica"].includes(
    usuario?.rol ?? "",
  );
  const muestraDashboard = [
    "super_admin",
    "ministro_en_turno",
    "encargado_estadistica",
    "encargado_grupo",
    "auxiliar_grupo",
  ].includes(usuario?.rol ?? "");

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Inicio</h1>
      <p className="text-sm text-slate-600">
        Sesión: {usuario?.correo} — Rol: {usuario?.rol}
      </p>
      {muestraDashboard ? <DashboardCategorias /> : null}
      {esAdmin ? <BotonActualizarAutomatizaciones /> : null}
    </div>
  );
}
