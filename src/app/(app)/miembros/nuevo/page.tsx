import { createClient } from "@/lib/supabase/server";
import { FormularioNuevoMiembro } from "./formulario";

export default async function PaginaNuevoMiembro() {
  const supabase = await createClient();
  const [
    { data: paises },
    { data: iglesias },
    { data: grupos },
    { data: nivelesEstudio },
    { data: estadosCiviles },
    { data: profesiones },
    { data: comisiones },
  ] = await Promise.all([
    supabase.from("paises").select("id, nombre").order("nombre"),
    supabase.from("iglesias").select("id, nombre").order("nombre"),
    supabase
      .from("grupos")
      .select("id, nombre, edad_inicial, edad_final, iglesias(nombre)")
      .order("nombre"),
    supabase.from("niveles_estudio").select("id, nombre").order("nombre"),
    supabase.from("estados_civiles").select("id, nombre").order("nombre"),
    supabase.from("profesiones_ocupaciones").select("id, nombre").order("nombre"),
    supabase.from("comisiones").select("id, nombre").order("nombre"),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Nuevo miembro</h1>
      <FormularioNuevoMiembro
        paises={paises ?? []}
        iglesias={iglesias ?? []}
        grupos={grupos ?? []}
        nivelesEstudio={nivelesEstudio ?? []}
        estadosCiviles={estadosCiviles ?? []}
        profesiones={profesiones ?? []}
        comisiones={comisiones ?? []}
      />
    </div>
  );
}
