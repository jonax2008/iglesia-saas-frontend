"use client";

import { useActionState, useState } from "react";
import { crearFamilia } from "./actions";

type Opcion = { id: string; nombre: string };
type Miembro = {
  id: string;
  iglesia_id: string;
  personas: { nombres: string; apellido_paterno: string } | null;
};

export function FormularioNuevaFamilia({
  iglesias,
  miembros,
}: {
  iglesias: Opcion[];
  miembros: Miembro[];
}) {
  const [estado, accion, enProceso] = useActionState(crearFamilia, { error: "" });
  const [iglesiaId, setIglesiaId] = useState("");

  const miembrosIglesia = miembros.filter((m) => m.iglesia_id === iglesiaId);

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
          value={iglesiaId}
          onChange={(e) => setIglesiaId(e.target.value)}
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
          Nombre de la familia
        </label>
        <input
          id="nombre"
          name="nombre"
          required
          placeholder="Ej. Familia García Pérez"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Papá</label>
        <select
          name="padre_miembro_id"
          disabled={!iglesiaId}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base disabled:bg-slate-100"
        >
          <option value="">Selecciona…</option>
          {miembrosIglesia.map((m) => (
            <option key={m.id} value={m.id}>
              {m.personas?.nombres} {m.personas?.apellido_paterno}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">Mamá</label>
        <select
          name="madre_miembro_id"
          disabled={!iglesiaId}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base disabled:bg-slate-100"
        >
          <option value="">Selecciona…</option>
          {miembrosIglesia.map((m) => (
            <option key={m.id} value={m.id}>
              {m.personas?.nombres} {m.personas?.apellido_paterno}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-slate-500">
        Los hijos se agregan después, desde la lista de familias.
      </p>

      {estado?.error ? <p className="text-sm text-red-600">{estado.error}</p> : null}

      <button
        type="submit"
        disabled={enProceso}
        className="w-full rounded-lg bg-slate-900 px-4 py-2 text-base font-medium text-white disabled:opacity-50 sm:w-auto"
      >
        {enProceso ? "Guardando…" : "Guardar familia"}
      </button>
    </form>
  );
}
