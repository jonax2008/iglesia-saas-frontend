"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Miembro = {
  id: string;
  personas: { nombres: string; apellido_paterno: string } | null;
};

function hace4Semanas(): string {
  const d = new Date();
  d.setDate(d.getDate() - 27);
  return d.toISOString().slice(0, 10);
}

function hoy(): string {
  return new Date().toISOString().slice(0, 10);
}

function inicioSemanaISO(fecha: string): string {
  const d = new Date(`${fecha}T00:00:00`);
  const dia = d.getDay(); // 0=domingo
  d.setDate(d.getDate() - dia);
  return d.toISOString().slice(0, 10);
}

export function PanelEstadisticasGrupo({ miembros }: { miembros: Miembro[] }) {
  const supabase = createClient();
  const [desde, setDesde] = useState(hace4Semanas());
  const [hasta, setHasta] = useState(hoy());
  const [asistencias, setAsistencias] = useState<{ miembro_id: string; fecha: string }[]>([]);

  useEffect(() => {
    if (!miembros.length) return;
    supabase
      .from("asistencias")
      .select("miembro_id, fecha")
      .in(
        "miembro_id",
        miembros.map((m) => m.id),
      )
      .eq("valor", "asistencia")
      .gte("fecha", desde)
      .lte("fecha", hasta)
      .then(({ data }) => setAsistencias(data ?? []));
  }, [desde, hasta, miembros, supabase]);

  const porMiembro = useMemo(() => {
    const conteo = new Map<string, number>();
    for (const m of miembros) conteo.set(m.id, 0);
    for (const a of asistencias) conteo.set(a.miembro_id, (conteo.get(a.miembro_id) ?? 0) + 1);
    return conteo;
  }, [asistencias, miembros]);

  const porSemana = useMemo(() => {
    const conteo = new Map<string, number>();
    for (const a of asistencias) {
      const semana = inicioSemanaISO(a.fecha);
      conteo.set(semana, (conteo.get(semana) ?? 0) + 1);
    }
    return [...conteo.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [asistencias]);

  const nombreDe = (id: string) => {
    const m = miembros.find((x) => x.id === id);
    return m ? `${m.personas?.nombres} ${m.personas?.apellido_paterno}` : "";
  };

  let idMax = "";
  let idMin = "";
  for (const [id, total] of porMiembro) {
    if (!idMax || total > (porMiembro.get(idMax) ?? -1)) idMax = id;
    if (!idMin || total < (porMiembro.get(idMin) ?? Infinity)) idMin = id;
  }

  const dias = Math.max(
    1,
    Math.round(
      (new Date(hasta).getTime() - new Date(desde).getTime()) / (1000 * 60 * 60 * 24),
    ) + 1,
  );
  const semanas = dias / 7;
  const totalAsistencias = asistencias.length;
  const maximoPosible = miembros.length * 21 * semanas;
  const porcentajePromedio = maximoPosible > 0 ? (totalAsistencias / maximoPosible) * 100 : 0;

  const maxSemana = Math.max(1, ...porSemana.map(([, total]) => total));

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex flex-wrap gap-3">
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Desde</label>
          <input
            type="date"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base"
          />
        </div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Hasta</label>
          <input
            type="date"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">Mayor asistencia</p>
          <p className="text-base font-semibold text-slate-900">
            {miembros.length ? nombreDe(idMax) : "—"}
          </p>
          <p className="text-sm text-slate-500">{porMiembro.get(idMax) ?? 0} asistencias</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">Menor asistencia</p>
          <p className="text-base font-semibold text-slate-900">
            {miembros.length ? nombreDe(idMin) : "—"}
          </p>
          <p className="text-sm text-slate-500">{porMiembro.get(idMin) ?? 0} asistencias</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-sm text-slate-600">% promedio del grupo</p>
          <p className="text-base font-semibold text-slate-900">
            {porcentajePromedio.toFixed(1)}%
          </p>
          <p className="text-sm text-slate-500">máx. 21 asistencias/semana por miembro</p>
        </div>
      </div>

      <div className="space-y-2 rounded-lg bg-white p-4 shadow-sm">
        <p className="text-sm font-medium text-slate-700">Asistencias por semana</p>
        {porSemana.length ? (
          <ul className="space-y-1">
            {porSemana.map(([semana, total]) => (
              <li key={semana} className="flex items-center gap-2">
                <span className="w-24 shrink-0 text-xs text-slate-500">{semana}</span>
                <div className="h-4 flex-1 rounded bg-slate-100">
                  <div
                    className="h-4 rounded bg-slate-700"
                    style={{ width: `${(total / maxSemana) * 100}%` }}
                  />
                </div>
                <span className="w-8 shrink-0 text-right text-xs text-slate-600">{total}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">Sin asistencias registradas en este periodo.</p>
        )}
      </div>
    </div>
  );
}
