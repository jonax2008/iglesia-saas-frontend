import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { registrarErrorFatal } from "@/lib/log-error";
import { PanelEstadisticasGrupo } from "./panel";

export default async function PaginaEstadisticasGrupo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: grupo, error } = await supabase
    .from("grupos")
    .select("id, nombre, iglesias(nombre)")
    .eq("id", id)
    .maybeSingle();
  if (error) await registrarErrorFatal(error, { ruta: `/grupos/${id}/estadisticas`, operacion: "cargar grupo para estadísticas" });

  if (!grupo) notFound();

  const { data: miembros } = await supabase
    .from("miembros")
    .select("id, personas(nombres, apellido_paterno)")
    .eq("grupo_id", id)
    .order("id");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Estadísticas de asistencia — {grupo.nombre}
        </h1>
        <p className="text-sm text-slate-600">{grupo.iglesias?.nombre}</p>
      </div>
      <PanelEstadisticasGrupo miembros={miembros ?? []} />
    </div>
  );
}
