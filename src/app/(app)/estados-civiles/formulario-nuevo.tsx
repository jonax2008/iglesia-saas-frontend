"use client";

import { useActionState } from "react";
import { crearEstadoCivil } from "./actions";

export function FormularioNuevoEstadoCivil() {
  const [estado, accion, enProceso] = useActionState(crearEstadoCivil, { error: "" });

  return (
    <form action={accion} className="flex flex-wrap items-end gap-2">
      <div className="flex-1 space-y-1">
        <label htmlFor="nombre" className="text-sm font-medium text-slate-700">
          Nuevo estado civil
        </label>
        <input
          id="nombre"
          name="nombre"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          placeholder="Ej. Soltero(a), Casado(a)…"
        />
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
