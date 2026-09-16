import { createClient } from "@/lib/supabase/server";
import { eliminarDistrito } from "./actions";
import { FormularioNuevoDistrito } from "./formulario-nuevo";

export default async function PaginaDistritos() {
  const supabase = await createClient();
  const [{ data: distritos }, { data: jurisdicciones }] = await Promise.all([
    supabase
      .from("distritos")
      .select("id, numero, nombre, jurisdicciones(nombre)")
      .order("numero"),
    supabase.from("jurisdicciones").select("id, nombre").order("nombre"),
  ]);

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Distritos</h1>

      <FormularioNuevoDistrito jurisdicciones={jurisdicciones ?? []} />

      <ul className="divide-y divide-slate-200 rounded-lg bg-white shadow-sm">
        {distritos?.map((d) => (
          <li key={d.id} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-slate-900">
              #{d.numero} — {d.nombre}{" "}
              <span className="text-slate-500">({d.jurisdicciones?.nombre})</span>
            </span>
            <form action={eliminarDistrito}>
              <input type="hidden" name="id" value={d.id} />
              <button
                type="submit"
                className="text-sm font-medium text-red-600 underline"
              >
                Eliminar
              </button>
            </form>
          </li>
        ))}
        {!distritos?.length ? (
          <li className="px-4 py-3 text-sm text-slate-500">Aún no hay distritos.</li>
        ) : null}
      </ul>
    </div>
  );
}
