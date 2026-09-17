"use client";

import { useActionState } from "react";
import { agregarAuxiliar } from "./actions";

type Miembro = {
  id: string;
  personas: { nombres: string; apellido_paterno: string } | null;
};

export function AgregarAuxiliarForm({
  grupoId,
  disponibles,
}: {
  grupoId: string;
  disponibles: Miembro[];
}) {
  const [estado, accion, enProceso] = useActionState(agregarAuxiliar, { error: "" });

  return (
    <form action={accion} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="grupo_id" value={grupoId} />
      <select
        name="miembro_id"
        required
        className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
      >
        <option value="">Selecciona…</option>
        {disponibles.map((m) => (
          <option key={m.id} value={m.id}>
            {m.personas?.nombres} {m.personas?.apellido_paterno}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={enProceso}
        className="rounded-lg bg-slate-700 px-3 py-1 text-sm text-white disabled:opacity-50"
      >
        Agregar auxiliar
      </button>
      {estado?.error ? <p className="w-full text-sm text-red-600">{estado.error}</p> : null}
    </form>
  );
}
