import { createClient } from "@/lib/supabase/server";
import { registrarErrorFatal } from "@/lib/log-error";
import { FormularioNuevoGrupo } from "./formulario";

export default async function PaginaNuevoGrupo() {
  const supabase = await createClient();
  const { data: iglesias, error } = await supabase
    .from("iglesias")
    .select("id, nombre")
    .order("nombre");
  if (error) await registrarErrorFatal(error, { ruta: "/grupos/nuevo", operacion: "cargar iglesias para alta de grupo" });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-900">Nuevo grupo</h1>
      <FormularioNuevoGrupo iglesias={iglesias ?? []} />
    </div>
  );
}
