import { createClient } from "@/lib/supabase/server";
import { eliminarNivelEstudio } from "./actions";
import { FormularioNuevoNivelEstudio } from "./formulario-nuevo";

export default async function PaginaNivelesEstudio() {
  const supabase = await createClient();
  const { data: niveles } = await supabase
    .from("niveles_estudio")
    .select("id, nombre")
    .order("nombre");

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Niveles de estudio</h1>

      <FormularioNuevoNivelEstudio />

      <ul className="divide-y divide-slate-200 rounded-lg bg-white shadow-sm">
        {niveles?.map((n) => (
          <li key={n.id} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-slate-900">{n.nombre}</span>
            <form action={eliminarNivelEstudio}>
              <input type="hidden" name="id" value={n.id} />
              <button
                type="submit"
                className="text-sm font-medium text-red-600 underline"
              >
                Eliminar
              </button>
            </form>
          </li>
        ))}
        {!niveles?.length ? (
          <li className="px-4 py-3 text-sm text-slate-500">
            Aún no hay niveles de estudio.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
