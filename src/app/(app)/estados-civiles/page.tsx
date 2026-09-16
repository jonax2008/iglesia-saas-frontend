import { createClient } from "@/lib/supabase/server";
import { eliminarEstadoCivil } from "./actions";
import { FormularioNuevoEstadoCivil } from "./formulario-nuevo";

export default async function PaginaEstadosCiviles() {
  const supabase = await createClient();
  const { data: estadosCiviles } = await supabase
    .from("estados_civiles")
    .select("id, nombre")
    .order("nombre");

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Estado civil</h1>

      <FormularioNuevoEstadoCivil />

      <ul className="divide-y divide-slate-200 rounded-lg bg-white shadow-sm">
        {estadosCiviles?.map((e) => (
          <li key={e.id} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-slate-900">{e.nombre}</span>
            <form action={eliminarEstadoCivil}>
              <input type="hidden" name="id" value={e.id} />
              <button
                type="submit"
                className="text-sm font-medium text-red-600 underline"
              >
                Eliminar
              </button>
            </form>
          </li>
        ))}
        {!estadosCiviles?.length ? (
          <li className="px-4 py-3 text-sm text-slate-500">
            Aún no hay estados civiles.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
