"use client";

import { useActionState } from "react";
import { crearIglesia } from "./actions";
import { SelectorGeografico } from "../selector-geografico";

type Opcion = { id: string; nombre: string };
type Distrito = { id: string; numero: number; nombre: string };

export function FormularioNuevaIglesia({
  paises,
  distritos,
}: {
  paises: Opcion[];
  distritos: Distrito[];
}) {
  const [estado, accion, enProceso] = useActionState(crearIglesia, { error: "" });

  return (
    <form action={accion} className="max-w-xl space-y-4">
      <div className="space-y-1">
        <label htmlFor="nombre" className="text-sm font-medium text-slate-700">
          Nombre de la iglesia
        </label>
        <input
          id="nombre"
          name="nombre"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="distrito_id" className="text-sm font-medium text-slate-700">
          Distrito
        </label>
        <select
          id="distrito_id"
          name="distrito_id"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
        >
          <option value="">Selecciona…</option>
          {distritos.map((d) => (
            <option key={d.id} value={d.id}>
              #{d.numero} — {d.nombre}
            </option>
          ))}
        </select>
      </div>

      <SelectorGeografico paises={paises} />

      <div className="space-y-1">
        <label htmlFor="calle_numero" className="text-sm font-medium text-slate-700">
          Calle y número
        </label>
        <input
          id="calle_numero"
          name="calle_numero"
          required
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="google_maps_link"
          className="text-sm font-medium text-slate-700"
        >
          Liga de Google Maps
        </label>
        <input
          id="google_maps_link"
          name="google_maps_link"
          type="url"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="telefono_casa_pastoral"
          className="text-sm font-medium text-slate-700"
        >
          Teléfono de la casa pastoral
        </label>
        <input
          id="telefono_casa_pastoral"
          name="telefono_casa_pastoral"
          type="tel"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
        />
      </div>

      {estado?.error ? <p className="text-sm text-red-600">{estado.error}</p> : null}

      <button
        type="submit"
        disabled={enProceso}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-base font-medium text-white disabled:opacity-50 sm:w-auto"
      >
        {enProceso ? "Guardando…" : "Guardar iglesia"}
      </button>
    </form>
  );
}
