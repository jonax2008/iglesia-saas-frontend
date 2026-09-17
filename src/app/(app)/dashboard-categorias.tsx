import { createClient } from "@/lib/supabase/server";

/**
 * Cards de retirados temporales / en archivo (regla de negocio 5). Los
 * conteos se apoyan enteramente en RLS de "miembros": para
 * ministro_en_turno/encargado_estadistica queda acotado a su iglesia, para
 * encargado_grupo/auxiliar_grupo a su(s) grupo(s), sin necesitar filtros
 * adicionales aquí.
 */
export async function DashboardCategorias() {
  const supabase = await createClient();

  const [{ count: retiradosTemporales }, { count: enArchivo }] = await Promise.all([
    supabase
      .from("miembros")
      .select("id", { count: "exact", head: true })
      .eq("categoria", "retirado_temporal"),
    supabase
      .from("miembros")
      .select("id", { count: "exact", head: true })
      .eq("categoria", "archivo"),
  ]);

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
