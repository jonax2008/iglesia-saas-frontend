import { createClient } from "@/lib/supabase/server";
import { registrarErrorAccion } from "@/lib/log-error";

/**
 * Cards de retirados temporales / en archivo (regla de negocio 5). Los
 * conteos se apoyan enteramente en RLS de "miembros": para
 * ministro_en_turno/encargado_estadistica queda acotado a su iglesia, para
 * encargado_grupo/auxiliar_grupo a su(s) grupo(s), sin necesitar filtros
 * adicionales aquí.
 */
export async function DashboardCategorias() {
  const supabase = await createClient();

  const [
    { count: retiradosTemporales, error: errorRetirados },
    { count: enArchivo, error: errorArchivo },
  ] = await Promise.all([
    supabase
      .from("miembros")
      .select("id", { count: "exact", head: true })
      .eq("categoria", "retirado_temporal"),
    supabase
      .from("miembros")
      .select("id", { count: "exact", head: true })
      .eq("categoria", "archivo"),
  ]);

  const error = errorRetirados ?? errorArchivo;
  if (error) {
    await registrarErrorAccion(error, { ruta: "/", operacion: "cargar cards de categorías" });
    return (
      <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
        No se pudieron cargar los conteos de retirados/archivo. Ya quedó registrado.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <p className="text-2xl font-semibold text-amber-700">
          {retiradosTemporales ?? 0}
        </p>
        <p className="text-sm text-slate-600">Retirados temporales</p>
      </div>
      <div className="rounded-lg bg-white p-4 shadow-sm">
        <p className="text-2xl font-semibold text-red-700">{enArchivo ?? 0}</p>
        <p className="text-sm text-slate-600">En archivo</p>
      </div>
    </div>
  );
}
