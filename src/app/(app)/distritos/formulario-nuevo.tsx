"use client";

import { useActionState } from "react";
import { crearDistrito } from "./actions";

type Jurisdiccion = { id: string; nombre: string };

export function FormularioNuevoDistrito({
  jurisdicciones,
}: {
  jurisdicciones: Jurisdiccion[];
}) {
  const [estado, accion, enProceso] = useActionState(crearDistrito, {
    error: "",
  });

  return (
    <form action={accion} className="flex flex-wrap items-end gap-2">
      <div className="w-20 space-y-1">
        <label htmlFor="numero" className="text-sm font-medium text-slate-700">
          No.
        </label>
        <input
          id="numero"
          name="numero"
          type="number"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
        />
      </div>

      <div className="flex-1 space-y-1">
        <label htmlFor="nombre" className="text-sm font-medium text-slate-700">
          Nombre del distrito
        </label>
        <input
          id="nombre"
          name="nombre"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
        />
      </div>

      <div className="flex-1 space-y-1">
        <label
          htmlFor="jurisdiccion_id"
          className="text-sm font-medium text-slate-700"
        >
          Jurisdicción
        </label>
        <select
          id="jurisdiccion_id"
          name="jurisdiccion_id"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
        >
          <option value="">Selecciona…</option>
          {jurisdicciones.map((j) => (
            <option key={j.id} value={j.id}>
              {j.nombre}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={enProceso}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        Agregar
      </button>
      {estado?.error ? (
        <p className="w-full text-sm text-red-600">{estado.error}</p>
      ) : null}
    </form>
  );
}
