import { createClient } from "@/lib/supabase/server";
import { eliminarComision } from "./actions";
import { FormularioNuevaComision } from "./formulario-nueva";

export default async function PaginaComisiones() {
  const supabase = await createClient();
  const { data: comisiones } = await supabase
    .from("comisiones")
    .select("id, nombre")
    .order("nombre");

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Comisiones</h1>

      <FormularioNuevaComision />

      <ul className="divide-y divide-slate-200 rounded-lg bg-white shadow-sm">
        {comisiones?.map((c) => (
          <li key={c.id} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-slate-900">{c.nombre}</span>
            <form action={eliminarComision}>
              <input type="hidden" name="id" value={c.id} />
              <button
                type="submit"
                className="text-sm font-medium text-red-600 underline"
              >
                Eliminar
              </button>
            </form>
          </li>
        ))}
        {!comisiones?.length ? (
          <li className="px-4 py-3 text-sm text-slate-500">Aún no hay comisiones.</li>
        ) : null}
      </ul>
    </div>
  );
}
