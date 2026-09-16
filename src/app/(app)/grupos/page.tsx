import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { agregarAuxiliar, asignarEncargado, quitarAuxiliar } from "./actions";

export default async function PaginaGrupos() {
  const supabase = await createClient();

  const [{ data: grupos }, { data: miembros }, { data: auxiliares }] =
    await Promise.all([
      supabase
        .from("grupos")
        .select(
          "id, nombre, edad_inicial, edad_final, iglesia_id, iglesias(nombre), encargado_miembro_id, encargado:miembros!grupos_encargado_miembro_id_fkey(id, personas(nombres, apellido_paterno))",
        )
        .order("nombre"),
      supabase
        .from("miembros")
        .select("id, iglesia_id, personas(nombres, apellido_paterno)")
        .order("iglesia_id"),
      supabase
        .from("grupo_auxiliares")
        .select("grupo_id, miembro_id, miembros(personas(nombres, apellido_paterno))"),
    ]);

  const miembrosPorIglesia = new Map<string, typeof miembros>();
  for (const m of miembros ?? []) {
    const lista = miembrosPorIglesia.get(m.iglesia_id) ?? [];
    lista.push(m);
    miembrosPorIglesia.set(m.iglesia_id, lista);
  }

  const auxiliaresPorGrupo = new Map<string, typeof auxiliares>();
  for (const a of auxiliares ?? []) {
    const lista = auxiliaresPorGrupo.get(a.grupo_id) ?? [];
    lista.push(a);
    auxiliaresPorGrupo.set(a.grupo_id, lista);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Grupos</h1>
        <Link
          href="/grupos/nuevo"
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Nuevo grupo
        </Link>
      </div>

      <ul className="space-y-4">
        {grupos?.map((g) => {
          const miembrosIglesia = miembrosPorIglesia.get(g.iglesia_id) ?? [];
          const auxiliaresGrupo = auxiliaresPorGrupo.get(g.id) ?? [];
          const idsOcupados = new Set([
            g.encargado_miembro_id,
            ...auxiliaresGrupo.map((a) => a.miembro_id),
          ]);
          const disponibles = miembrosIglesia.filter((m) => !idsOcupados.has(m.id));

          return (
            <li key={g.id} className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-900">
                  {g.nombre}{" "}
                  <span className="font-normal text-slate-500">
                    ({g.edad_inicial}-{g.edad_final} años) — {g.iglesias?.nombre}
                  </span>
                </p>
                <Link
                  href={`/grupos/${g.id}/asistencia`}
                  className="shrink-0 rounded-lg bg-slate-700 px-3 py-1 text-sm text-white"
                >
                  Tomar asistencia
                </Link>
              </div>

              <div className="mt-3 space-y-1">
                <p className="text-sm text-slate-700">
                  Encargado:{" "}
                  {g.encargado ? (
                    <span className="font-medium">
                      {g.encargado.personas?.nombres} {g.encargado.personas?.apellido_paterno}
                    </span>
                  ) : (
                    <span className="text-slate-400">sin asignar</span>
                  )}
                </p>
                <form action={asignarEncargado} className="flex flex-wrap gap-2">
                  <input type="hidden" name="grupo_id" value={g.id} />
                  <select
                    name="miembro_id"
                    className="rounded-lg border border-slate-300 px-2 py-1 text-sm"
                  >
                    <option value="">Sin encargado</option>
                    {miembrosIglesia.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.personas?.nombres} {m.personas?.apellido_paterno}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-lg bg-slate-700 px-3 py-1 text-sm text-white"
                  >
                    Asignar
                  </button>
                </form>
              </div>

              <div className="mt-3 space-y-1">
                <p className="text-sm text-slate-700">
                  Auxiliares ({auxiliaresGrupo.length}/2):
                </p>
                <ul className="space-y-1">
                  {auxiliaresGrupo.map((a) => (
                    <li key={a.miembro_id} className="flex items-center gap-2 text-sm">
                      {a.miembros?.personas?.nombres} {a.miembros?.personas?.apellido_paterno}
                      <form action={quitarAuxiliar}>
                        <input type="hidden" name="grupo_id" value={g.id} />
                        <input type="hidden" name="miembro_id" value={a.miembro_id} />
                        <button
                          type="submit"
                          className="text-red-600 underline"
                        >
                          Quitar
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
                {auxiliaresGrupo.length < 2 ? (
                  <form action={agregarAuxiliar} className="flex flex-wrap gap-2">
                    <input type="hidden" name="grupo_id" value={g.id} />
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
                      className="rounded-lg bg-slate-700 px-3 py-1 text-sm text-white"
                    >
                      Agregar auxiliar
                    </button>
                  </form>
                ) : null}
              </div>
            </li>
          );
        })}
        {!grupos?.length ? (
          <li className="rounded-lg bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
            Aún no hay grupos.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
