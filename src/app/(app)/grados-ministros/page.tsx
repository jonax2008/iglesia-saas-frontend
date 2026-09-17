import { createClient } from "@/lib/supabase/server";
import { registrarErrorFatal } from "@/lib/log-error";
import { eliminarGradoMinistro } from "./actions";
import { FormularioNuevoGrado } from "./formulario-nuevo";

export default async function PaginaGradosMinistros() {
  const supabase = await createClient();
  const { data: grados, error } = await supabase
    .from("grados_ministros")
    .select("id, nombre")
    .order("nombre");
  if (error) await registrarErrorFatal(error, { ruta: "/grados-ministros", operacion: "listar grados de ministro" });

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Grados de ministro</h1>

      <FormularioNuevoGrado />

      <ul className="divide-y divide-slate-200 rounded-lg bg-white shadow-sm">
        {grados?.map((g) => (
          <li key={g.id} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-slate-900">{g.nombre}</span>
            <form action={eliminarGradoMinistro}>
              <input type="hidden" name="id" value={g.id} />
              <button
                type="submit"
                className="text-sm font-medium text-red-600 underline"
              >
                Eliminar
              </button>
            </form>
          </li>
        ))}
        {!grados?.length ? (
          <li className="px-4 py-3 text-sm text-slate-500">Aún no hay grados.</li>
        ) : null}
      </ul>
    </div>
  );
}
