"use client";

import { useActionState, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  categoriasDelDia,
  etiquetaCategoria,
  hoyISO,
  type CategoriaAsistencia,
} from "@/lib/asistencia";
import { guardarAsistencia } from "./actions";

type Miembro = {
  id: string;
  personas: { nombres: string; apellido_paterno: string } | null;
};

type Existente = { id: string; miembro_id: string; valor: string };

export function PanelAsistencia({
  grupoId,
  miembros,
}: {
  grupoId: string;
  miembros: Miembro[];
}) {
  const supabase = createClient();
  const [fecha, setFecha] = useState(hoyISO());
  const categorias = categoriasDelDia(fecha);
  const [categoria, setCategoria] = useState(categorias[0]);
  const [existentes, setExistentes] = useState<Existente[]>([]);
  const [valores, setValores] = useState<Record<string, string>>({});

  const [estado, accion, enProceso] = useActionState(guardarAsistencia, {
    error: "",
  });

  function cambiarFecha(nuevaFecha: string) {
    setFecha(nuevaFecha);
    const disponibles = categoriasDelDia(nuevaFecha);
    if (!disponibles.includes(categoria)) setCategoria(disponibles[0]);
  }

  useEffect(() => {
    supabase
      .from("asistencias")
      .select("id, miembro_id, valor")
      .in(
        "miembro_id",
        miembros.map((m) => m.id),
      )
      .eq("fecha", fecha)
      .eq("categoria", categoria)
      .then(({ data }) => {
        setExistentes(data ?? []);
        const iniciales: Record<string, string> = {};
        for (const a of data ?? []) iniciales[a.miembro_id] = a.valor;
        setValores(iniciales);
      });
  }, [fecha, categoria, miembros, supabase]);

  const hayCambiosSobreExistente = existentes.some(
    (a) => valores[a.miembro_id] && valores[a.miembro_id] !== a.valor,
  );

  return (
    <form action={accion} className="max-w-2xl space-y-4">
      <input type="hidden" name="grupo_id" value={grupoId} />
      <input type="hidden" name="fecha" value={fecha} />
      <input type="hidden" name="categoria" value={categoria} />
      <input type="hidden" name="miembro_ids" value={miembros.map((m) => m.id).join(",")} />

      <div className="flex flex-wrap gap-3">
        <div className="space-y-1">
          <label htmlFor="fecha_input" className="text-sm font-medium text-slate-700">
            Fecha
          </label>
          <input
            id="fecha_input"
            type="date"
            value={fecha}
            onChange={(e) => cambiarFecha(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Categoría</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value as CategoriaAsistencia)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base"
          >
            {categorias.map((c) => (
              <option key={c} value={c}>
                {etiquetaCategoria(c)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ul className="divide-y divide-slate-200 rounded-lg bg-white shadow-sm">
        {miembros.map((m) => (
          <li key={m.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="text-sm text-slate-900">
              {m.personas?.nombres} {m.personas?.apellido_paterno}
            </span>
            <div className="flex gap-3 text-sm">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`valor_${m.id}`}
                  value="asistencia"
                  checked={valores[m.id] === "asistencia"}
                  onChange={() => setValores((prev) => ({ ...prev, [m.id]: "asistencia" }))}
                />
                Asistencia
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name={`valor_${m.id}`}
                  value="falta"
                  checked={valores[m.id] === "falta"}
                  onChange={() => setValores((prev) => ({ ...prev, [m.id]: "falta" }))}
                />
                Falta
              </label>
            </div>
          </li>
        ))}
        {!miembros.length ? (
          <li className="px-4 py-3 text-sm text-slate-500">Este grupo aún no tiene miembros.</li>
        ) : null}
      </ul>

      {hayCambiosSobreExistente ? (
        <div className="space-y-1">
          <label htmlFor="observaciones" className="text-sm font-medium text-slate-700">
            Observaciones (obligatorio: estás corrigiendo asistencia ya registrada)
          </label>
          <textarea
            id="observaciones"
            name="observaciones"
            required
            rows={2}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          />
        </div>
      ) : null}

      {estado?.error ? <p className="text-sm text-red-600">{estado.error}</p> : null}
      {estado?.exito ? (
        <p className="text-sm text-green-700">Asistencia guardada.</p>
      ) : null}

      <button
        type="submit"
        disabled={enProceso}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-base font-medium text-white disabled:opacity-50 sm:w-auto"
      >
        {enProceso ? "Guardando…" : "Guardar asistencia"}
      </button>
    </form>
  );
}
