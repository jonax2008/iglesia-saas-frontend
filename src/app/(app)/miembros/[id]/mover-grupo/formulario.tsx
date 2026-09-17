"use client";

import { useActionState, useMemo, useState } from "react";
import { moverDeGrupo } from "./actions";

type Grupo = {
  id: string;
  nombre: string;
  edad_inicial: number;
  edad_final: number;
  iglesias: { nombre: string } | null;
};

function calcularEdad(fechaNacimiento: string): number {
  const nacimiento = new Date(fechaNacimiento);
  const hoy = new Date();
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const aunNoCumple =
    hoy.getMonth() < nacimiento.getMonth() ||
    (hoy.getMonth() === nacimiento.getMonth() && hoy.getDate() < nacimiento.getDate());
  if (aunNoCumple) edad -= 1;
  return edad;
}

export function FormularioMoverGrupo({
  miembroId,
  grupoActualId,
  fechaNacimiento,
  grupos,
}: {
  miembroId: string;
  grupoActualId: string;
  fechaNacimiento: string;
  grupos: Grupo[];
}) {
  const [estado, accion, enProceso] = useActionState(moverDeGrupo, { error: "" });
  const [grupoDestinoId, setGrupoDestinoId] = useState("");

  const edad = useMemo(() => calcularEdad(fechaNacimiento), [fechaNacimiento]);
  const grupoDestino = grupos.find((g) => g.id === grupoDestinoId);
  const noRespetaEdad =
    grupoDestino && (edad < grupoDestino.edad_inicial || edad > grupoDestino.edad_final);

  return (
    <form action={accion} className="space-y-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <input type="hidden" name="miembro_id" value={miembroId} />
      <p className="text-sm font-semibold text-slate-700">Mover a otro grupo</p>
      <p className="text-xs text-slate-600">Edad actual del miembro: {edad} años.</p>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Grupo destino</label>
        <select
          name="grupo_destino_id"
          required
          value={grupoDestinoId}
          onChange={(e) => setGrupoDestinoId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
        >
          <option value="">Selecciona…</option>
          {grupos
            .filter((g) => g.id !== grupoActualId)
            .map((g) => (
              <option key={g.id} value={g.id}>
                {g.iglesias?.nombre} — {g.nombre} ({g.edad_inicial}-{g.edad_final} años)
              </option>
            ))}
        </select>
      </div>

      {noRespetaEdad ? (
        <p className="text-sm font-medium text-amber-800">
          Advertencia: la edad del miembro ({edad}) no está dentro del rango de este grupo
          ({grupoDestino?.edad_inicial}-{grupoDestino?.edad_final} años). Se puede continuar,
          pero quedará marcado en la bitácora.
        </p>
      ) : null}

      <div className="space-y-1">
        <label htmlFor="observaciones_mover" className="text-sm font-medium text-slate-700">
          Observaciones (obligatorio)
        </label>
        <textarea
          id="observaciones_mover"
          name="observaciones"
          required
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
        />
      </div>

      {estado?.error ? <p className="text-sm text-red-600">{estado.error}</p> : null}
      {estado?.exito ? (
        <p className="text-sm text-green-700">
          Miembro movido de grupo{estado.respetaEdad === false ? " (fuera del rango de edad, registrado)" : ""}.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={enProceso}
        className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {enProceso ? "Moviendo…" : "Mover de grupo"}
      </button>
    </form>
  );
}
