import { createClient } from "@/lib/supabase/server";
import { FormularioNuevaFamilia } from "./formulario";

export default async function PaginaNuevaFamilia() {
  const supabase = await createClient();
  const [{ data: iglesias }, { data: miembros }] = await Promise.all([
    supabase.from("iglesias").select("id, nombre").order("nombre"),
    supabase
      .from("miembros")
      .select("id, iglesia_id, personas(nombres, apellido_paterno)")
      .order("id"),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Nueva familia</h1>
      <FormularioNuevaFamilia iglesias={iglesias ?? []} miembros={miembros ?? []} />
    </div>
  );
}
