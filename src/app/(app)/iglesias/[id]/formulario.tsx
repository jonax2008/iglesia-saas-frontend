"use client";

import { useActionState } from "react";
import { SelectorGeografico } from "../selector-geografico";
import { actualizarIglesia } from "./actions";

type Opcion = { id: string; nombre: string };
type Distrito = { id: string; numero: number; nombre: string };
type Ministro = {
  id: string;
  personas: { nombres: string; apellido_paterno: string } | null;
};

export function FormularioEditarIglesia({
  iglesia,
  paises,
  distritos,
  ministros,
}: {
  iglesia: {
    id: string;
    nombre: string;
    calle_numero: string;
    codigo_postal: string;
    google_maps_link: string | null;
    telefono_casa_pastoral: string | null;
    distrito_id: string;
    ministro_actual_id: string | null;
    colonia_id: string;
    pais_id: string;
    estado_id: string;
    ciudad_id: string;
  };
  paises: Opcion[];
  distritos: Distrito[];
  ministros: Ministro[];
}) {
  const [estado, accion, enProceso] = useActionState(actualizarIglesia, {
    error: "",
  });

  return (
    <form action={accion} className="max-w-xl space-y-4">
      <input type="hidden" name="id" value={iglesia.id} />

      <div className="space-y-1">
        <label htmlFor="nombre" className="text-sm font-medium text-slate-700">
          Nombre de la iglesia
        </label>
        <input
          id="nombre"
          name="nombre"
          required
          defaultValue={iglesia.nombre}
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
          defaultValue={iglesia.distrito_id}
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

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Ministro a cargo</label>
        <select
          name="ministro_actual_id"
          defaultValue={iglesia.ministro_actual_id ?? ""}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
        >
          <option value="">Sin asignar</option>
          {ministros.map((m) => (
            <option key={m.id} value={m.id}>
              {m.personas?.nombres} {m.personas?.apellido_paterno}
            </option>
          ))}
        </select>
      </div>

      <SelectorGeografico
        paises={paises}
        valorInicial={{
          paisId: iglesia.pais_id,
          estadoId: iglesia.estado_id,
          ciudadId: iglesia.ciudad_id,
          coloniaId: iglesia.colonia_id,
          codigoPostal: iglesia.codigo_postal,
        }}
      />

      <div className="space-y-1">
        <label htmlFor="calle_numero" className="text-sm font-medium text-slate-700">
          Calle y número
        </label>
        <input
          id="calle_numero"
          name="calle_numero"
          required
          defaultValue={iglesia.calle_numero}
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
          defaultValue={iglesia.google_maps_link ?? ""}
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
          defaultValue={iglesia.telefono_casa_pastoral ?? ""}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
        />
      </div>

      {estado?.error ? <p className="text-sm text-red-600">{estado.error}</p> : null}
      {estado?.exito ? (
        <p className="text-sm text-green-700">Cambios guardados.</p>
      ) : null}

      <button
        type="submit"
        disabled={enProceso}
        className="w-full rounded-lg bg-slate-900 px-4 py-2 text-base font-medium text-white disabled:opacity-50 sm:w-auto"
      >
        {enProceso ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}
