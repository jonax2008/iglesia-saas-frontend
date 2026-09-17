import { obtenerUsuarioActual } from "@/lib/auth";
import { BotonActualizarAutomatizaciones } from "./actualizar-automatizaciones/boton";

export default async function PaginaInicio() {
  const usuario = await obtenerUsuarioActual();
  const esAdmin = ["super_admin", "ministro_en_turno", "encargado_estadistica"].includes(
    usuario?.rol ?? "",
  );

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-xl font-semibold text-slate-900">Inicio</h1>
      <p className="text-sm text-slate-600">
        Sesión: {usuario?.correo} — Rol: {usuario?.rol}
      </p>
      {esAdmin ? <BotonActualizarAutomatizaciones /> : null}
    </div>
  );
}
