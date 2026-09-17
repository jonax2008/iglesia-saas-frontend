import { createClient } from "@/lib/supabase/server";
import { registrarErrorFatal } from "@/lib/log-error";
import { eliminarJurisdiccion } from "./actions";
import { FormularioNuevaJurisdiccion } from "./formulario-nueva";

export default async function PaginaJurisdicciones() {
  const supabase = await createClient();
  const { data: jurisdicciones, error } = await supabase
    .from("jurisdicciones")
    .select("id, nombre")
    .order("nombre");
  if (error) await registrarErrorFatal(error, { ruta: "/jurisdicciones", operacion: "listar jurisdicciones" });

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Jurisdicciones</h1>

      <FormularioNuevaJurisdiccion />

      <ul className="divide-y divide-slate-200 rounded-lg bg-white shadow-sm">
        {jurisdicciones?.map((j) => (
          <li key={j.id} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-slate-900">{j.nombre}</span>
            <form action={eliminarJurisdiccion}>
              <input type="hidden" name="id" value={j.id} />
              <button
                type="submit"
                className="text-sm font-medium text-red-600 underline"
              >
                Eliminar
              </button>
            </form>
          </li>
        ))}
        {!jurisdicciones?.length ? (
          <li className="px-4 py-3 text-sm text-slate-500">
            Aún no hay jurisdicciones.
          </li>
        ) : null}
      </ul>
    </div>
  );
}
