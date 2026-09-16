import { createClient } from "@/lib/supabase/server";
import { FormularioNuevaIglesia } from "./formulario";

export default async function PaginaNuevaIglesia() {
  const supabase = await createClient();
  const [{ data: paises }, { data: distritos }] = await Promise.all([
    supabase.from("paises").select("id, nombre").order("nombre"),
    supabase.from("distritos").select("id, numero, nombre").order("numero"),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Nueva iglesia</h1>
      <FormularioNuevaIglesia paises={paises ?? []} distritos={distritos ?? []} />
    </div>
  );
}
