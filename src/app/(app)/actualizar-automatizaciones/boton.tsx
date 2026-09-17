"use client";

import { useActionState } from "react";
import { ejecutarAutomatizaciones } from "./actions";

export function BotonActualizarAutomatizaciones() {
  const [estado, accion, enProceso] = useActionState(
    () => ejecutarAutomatizaciones(),
    { error: "" },
  );

  return (
    <form action={accion} className="space-y-2 rounded-lg border border-slate-200 bg-white p-4">
      <p className="text-sm text-slate-600">
        Las categorías de miembros y los avisos de cambio de grupo se actualizan solos
        todos los días. Si quieres forzar la actualización ahora mismo:
      </p>
      <button
        type="submit"
        disabled={enProceso}
        className="rounded-lg bg-slate-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {enProceso ? "Actualizando…" : "Actualizar automatizaciones ahora"}
      </button>
      {estado?.error ? <p className="text-sm text-red-600">{estado.error}</p> : null}
      {estado?.exito ? (
        <p className="text-sm text-green-700">
          {estado.actualizados} categoría(s) actualizadas, {estado.avisos} aviso(s) de
          cambio de grupo generados.
        </p>
      ) : null}
    </form>
  );
}
