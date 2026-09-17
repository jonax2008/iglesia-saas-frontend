import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { obtenerUsuarioActual } from "@/lib/auth";
import { FormularioEditarMinistro } from "./formulario";
import { ListaReportesMinistro } from "./reportes/lista";

export default async function PaginaDetalleMinistro({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: ministro } = await supabase
    .from("ministros")
    .select(
      "id, persona_id, correo_institucional, fecha_inicio_administracion, fecha_fin_administracion, grado_id, es_pastor_distrital, distrito_a_cargo_id, es_pastor_jurisdiccional, jurisdiccion_a_cargo_id, iglesias!ministros_iglesia_id_fkey(nombre), personas(nombres, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, telefono_celular, curp)",
    )
    .eq("id", id)
    .maybeSingle();

  if (!ministro) notFound();

  const usuario = await obtenerUsuarioActual();
  const puedeGenerarReporte = ["super_admin", "ministro_en_turno", "encargado_estadistica"].includes(
    usuario?.rol ?? "",
  );

  const [{ data: grados }, { data: distritos }, { data: jurisdicciones }, { data: reportes }] =
    await Promise.all([
      supabase.from("grados_ministros").select("id, nombre").order("nombre"),
      supabase.from("distritos").select("id, numero, nombre").order("numero"),
      supabase.from("jurisdicciones").select("id, nombre").order("nombre"),
      supabase
        .from("reportes_administracion")
        .select("id, fecha_generacion, total_activos, total_retirados_temporales, total_archivo, detalle")
        .eq("ministro_id", id)
        .order("fecha_generacion", { ascending: false }),
    ]);

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          {ministro.personas?.nombres} {ministro.personas?.apellido_paterno}{" "}
          {ministro.personas?.apellido_materno}
        </h1>
        <p className="mt-1 text-sm text-slate-600">{ministro.iglesias?.nombre}</p>
      </div>

      <ListaReportesMinistro
        ministroId={ministro.id}
        reportes={reportes ?? []}
        puedeGenerar={puedeGenerarReporte}
      />

      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Editar información</h2>
        <FormularioEditarMinistro
          ministro={ministro}
          grados={grados ?? []}
          distritos={distritos ?? []}
          jurisdicciones={jurisdicciones ?? []}
        />
      </div>
    </div>
  );
}
