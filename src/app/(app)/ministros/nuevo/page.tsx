import { createClient } from "@/lib/supabase/server";
import { registrarErrorFatal } from "@/lib/log-error";
import { FormularioNuevoMinistro } from "./formulario";

export default async function PaginaNuevoMinistro() {
  const supabase = await createClient();
  const resultados = await Promise.all([
    supabase.from("iglesias").select("id, nombre").order("nombre"),
    supabase.from("grados_ministros").select("id, nombre").order("nombre"),
    supabase.from("distritos").select("id, numero, nombre").order("numero"),
    supabase.from("jurisdicciones").select("id, nombre").order("nombre"),
  ]);
  const errorCatalogos = resultados.find((r) => r.error)?.error;
  if (errorCatalogos) {
    await registrarErrorFatal(errorCatalogos, {
      ruta: "/ministros/nuevo",
      operacion: "cargar catálogos para alta de ministro",
    });
  }
  const [{ data: iglesias }, { data: grados }, { data: distritos }, { data: jurisdicciones }] =
    resultados;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Nuevo ministro</h1>
      <FormularioNuevoMinistro
        iglesias={iglesias ?? []}
        grados={grados ?? []}
        distritos={distritos ?? []}
        jurisdicciones={jurisdicciones ?? []}
      />
    </div>
  );
}
