import { createClient } from "@/lib/supabase/server";
import { registrarErrorFatal } from "@/lib/log-error";
import { FormularioNuevaIglesia } from "./formulario";

export default async function PaginaNuevaIglesia() {
  const supabase = await createClient();
  const resultados = await Promise.all([
    supabase.from("paises").select("id, nombre").order("nombre"),
    supabase.from("distritos").select("id, numero, nombre").order("numero"),
  ]);
  const errorCatalogos = resultados.find((r) => r.error)?.error;
  if (errorCatalogos) {
    await registrarErrorFatal(errorCatalogos, {
      ruta: "/iglesias/nueva",
      operacion: "cargar catálogos para alta de iglesia",
    });
  }
  const [{ data: paises }, { data: distritos }] = resultados;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Nueva iglesia</h1>
      <FormularioNuevaIglesia paises={paises ?? []} distritos={distritos ?? []} />
    </div>
  );
}
