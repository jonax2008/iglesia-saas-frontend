import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PanelAsistencia } from "./panel";

export default async function PaginaAsistenciaGrupo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: grupo } = await supabase
    .from("grupos")
    .select("id, nombre, iglesias(nombre)")
    .eq("id", id)
    .maybeSingle();

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
          Asistencia — {grupo.nombre}
        </h1>
        <p className="text-sm text-slate-600">{grupo.iglesias?.nombre}</p>
      </div>
      <PanelAsistencia grupoId={grupo.id} miembros={miembros ?? []} />
    </div>
  );
}
