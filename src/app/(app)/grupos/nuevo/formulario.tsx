"use client";

import { useActionState } from "react";
import { crearGrupo } from "./actions";

type Opcion = { id: string; nombre: string };

export function FormularioNuevoGrupo({ iglesias }: { iglesias: Opcion[] }) {
  const [estado, accion, enProceso] = useActionState(crearGrupo, { error: "" });

  return (
    <form action={accion} className="max-w-md space-y-4">
      <div className="space-y-1">
        <label htmlFor="iglesia_id" className="text-sm font-medium text-slate-700">
          Iglesia
        </label>
        <select
          id="iglesia_id"
          name="iglesia_id"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
        >
          <option value="">Selecciona…</option>
          {iglesias.map((i) => (
            <option key={i.id} value={i.id}>
              {i.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label htmlFor="nombre" className="text-sm font-medium text-slate-700">
          Nombre del grupo
        </label>
        <input
          id="nombre"
          name="nombre"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
        />
      </div>

      <div className="flex gap-3">
        <div className="flex-1 space-y-1">
          <label htmlFor="edad_inicial" className="text-sm font-medium text-slate-700">
            Edad inicial
          </label>
          <input
            id="edad_inicial"
            name="edad_inicial"
            type="number"
            min={0}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          />
        </div>
        <div className="flex-1 space-y-1">
          <label htmlFor="edad_final" className="text-sm font-medium text-slate-700">
            Edad final
          </label>
          <input
            id="edad_final"
            name="edad_final"
            type="number"
            min={0}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          />
        </div>
      </div>

      <p className="text-sm text-slate-500">
        El encargado y los auxiliares se asignan después, una vez que el grupo tenga
        miembros disponibles para elegir.
      </p>

      {estado?.error ? <p className="text-sm text-red-600">{estado.error}</p> : null}

      <button
        type="submit"
        disabled={enProceso}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-base font-medium text-white disabled:opacity-50 sm:w-auto"
      >
        {enProceso ? "Guardando…" : "Guardar grupo"}
      </button>
    </form>
  );
}
