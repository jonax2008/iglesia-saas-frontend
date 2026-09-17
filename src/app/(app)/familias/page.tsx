import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { registrarErrorFatal } from "@/lib/log-error";
import { agregarHijo, quitarHijo } from "./actions";

export default async function PaginaFamilias() {
  const supabase = await createClient();

  const [{ data: familias, error }, { data: miembros }, { data: hijos }] = await Promise.all([
    supabase
      .from("familias")
      .select(
        "id, nombre, iglesia_id, iglesias(nombre), padre:miembros!familias_padre_miembro_id_fkey(personas(nombres, apellido_paterno)), madre:miembros!familias_madre_miembro_id_fkey(personas(nombres, apellido_paterno))",
      )
      .order("nombre"),
    supabase
      .from("miembros")
      .select("id, iglesia_id, personas(nombres, apellido_paterno)")
      .order("id"),
    supabase
      .from("familia_hijos")
      .select("familia_id, miembro_id, miembros(personas(nombres, apellido_paterno))"),
  ]);
  if (error) await registrarErrorFatal(error, { ruta: "/familias", operacion: "listar familias" });

  const miembrosPorIglesia = new Map<string, typeof miembros>();
  for (const m of miembros ?? []) {
    const lista = miembrosPorIglesia.get(m.iglesia_id) ?? [];
    lista.push(m);
    miembrosPorIglesia.set(m.iglesia_id, lista);
  }

  const hijosPorFamilia = new Map<string, typeof hijos>();
  for (const h of hijos ?? []) {
    const lista = hijosPorFamilia.get(h.familia_id) ?? [];
    lista.push(h);
    hijosPorFamilia.set(h.familia_id, lista);
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Familias</h1>
        <Link
          href="/familias/nueva"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
        >
          Nueva familia
        </Link>
      </div>

      <ul className="space-y-4">
        {familias?.map((f) => {
          const hijosFamilia = hijosPorFamilia.get(f.id) ?? [];
          const idsOcupados = new Set(hijosFamilia.map((h) => h.miembro_id));
          const disponibles = (miembrosPorIglesia.get(f.iglesia_id) ?? []).filter(
            (m) => !idsOcupados.has(m.id),
          );

          return (
            <li key={f.id} className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-sm font-medium text-slate-900">
                {f.nombre}{" "}
                <span className="font-normal text-slate-500">({f.iglesias?.nombre})</span>
              </p>
              <p className="text-sm text-slate-600">
                Papá: {f.padre?.personas?.nombres ?? "—"} {f.padre?.personas?.apellido_paterno ?? ""}
                {" · "}
                Mamá: {f.madre?.personas?.nombres ?? "—"} {f.madre?.personas?.apellido_paterno ?? ""}
              </p>

              <div className="mt-3 space-y-1">
                <p className="text-sm text-slate-700">Hijos:</p>
                <ul className="space-y-1">
                  {hijosFamilia.map((h) => (
                    <li key={h.miembro_id} className="flex items-center gap-2 text-sm">
                      {h.miembros?.personas?.nombres} {h.miembros?.personas?.apellido_paterno}
                      <form action={quitarHijo}>
                        <input type="hidden" name="familia_id" value={f.id} />
                        <input type="hidden" name="miembro_id" value={h.miembro_id} />
                        <button type="submit" className="text-red-600 underline">
                          Quitar
                        </button>
                      </form>
                    </li>
                  ))}
                  {!hijosFamilia.length ? (
                    <li className="text-sm text-slate-400">Sin hijos registrados.</li>
                  ) : null}
                </ul>
                <form action={agregarHijo} className="flex flex-wrap gap-2">
                  <input type="hidden" name="familia_id" value={f.id} />
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
                    Agregar hijo
                  </button>
                </form>
              </div>
            </li>
          );
        })}
        {!familias?.length ? (
          <li className="rounded-lg bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
            Aún no hay familias.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
