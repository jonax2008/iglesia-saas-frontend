import { createClient } from "@/lib/supabase/server";
import { eliminarProfesionOcupacion } from "./actions";
import { FormularioNuevaProfesionOcupacion } from "./formulario-nueva";

export default async function PaginaProfesionesOcupaciones() {
  const supabase = await createClient();
  const { data: profesiones } = await supabase
    .from("profesiones_ocupaciones")
    .select("id, nombre")
    .order("nombre");

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">
        Profesiones y ocupaciones
      </h1>

      <FormularioNuevaProfesionOcupacion />

      <ul className="divide-y divide-slate-200 rounded-lg bg-white shadow-sm">
        {profesiones?.map((p) => (
          <li key={p.id} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-slate-900">{p.nombre}</span>
            <form action={eliminarProfesionOcupacion}>
              <input type="hidden" name="id" value={p.id} />
              <button
                type="submit"
                className="text-sm font-medium text-red-600 underline"
              >
                Eliminar
              </button>
            </form>
          </li>
        ))}
        {!profesiones?.length ? (
          <li className="px-4 py-3 text-sm text-slate-500">
            Aún no hay profesiones u ocupaciones registradas.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
