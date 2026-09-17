import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { obtenerUsuarioActual } from "@/lib/auth";
import { FormularioEditarMiembro } from "./formulario";
import { FormularioMoverGrupo } from "./mover-grupo/formulario";

export default async function PaginaDetalleMiembro({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: miembro } = await supabase
    .from("miembros")
    .select(
      "id, persona_id, categoria, correo_personal, grupo_id, fecha_bautismo, lugar_bautismo, ministro_bautizo_nombre, fecha_espiritu_santo, ministro_testifico_nombre, nivel_estudios_id, profesion_ocupacion_id, estado_civil_id, credencial_vigente_hasta, lugar_nacimiento_pais_id, lugar_nacimiento_estado_id, lugar_nacimiento_ciudad_id, iglesias(nombre), personas(nombres, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, telefono_celular, curp)",
    )
    .eq("id", id)
    .maybeSingle();

  if (!miembro) notFound();

  const usuario = await obtenerUsuarioActual();
  const puedeMoverGrupo = ["super_admin", "ministro_en_turno", "encargado_estadistica"].includes(
    usuario?.rol ?? "",
  );

  const [
    { data: paises },
    { data: grupos },
    { data: nivelesEstudio },
    { data: estadosCiviles },
    { data: profesiones },
    { data: comisiones },
    { data: comisionesActuales },
  ] = await Promise.all([
    supabase.from("paises").select("id, nombre").order("nombre"),
    supabase
      .from("grupos")
      .select("id, nombre, edad_inicial, edad_final, iglesias(nombre)")
      .order("nombre"),
    supabase.from("niveles_estudio").select("id, nombre").order("nombre"),
    supabase.from("estados_civiles").select("id, nombre").order("nombre"),
    supabase.from("profesiones_ocupaciones").select("id, nombre").order("nombre"),
    supabase.from("comisiones").select("id, nombre").order("nombre"),
    supabase.from("miembro_comisiones").select("comision_id").eq("miembro_id", id),
  ]);

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          {miembro.personas?.nombres} {miembro.personas?.apellido_paterno}{" "}
          {miembro.personas?.apellido_materno}
        </h1>
        <p className="mt-1 text-sm text-slate-600">{miembro.iglesias?.nombre}</p>
      </div>

      {puedeMoverGrupo ? (
        <FormularioMoverGrupo
          miembroId={miembro.id}
          grupoActualId={miembro.grupo_id}
          fechaNacimiento={miembro.personas?.fecha_nacimiento ?? ""}
          grupos={grupos ?? []}
        />
      ) : null}

      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Editar información</h2>
        <FormularioEditarMiembro
          miembro={miembro}
          paises={paises ?? []}
          grupos={grupos ?? []}
          nivelesEstudio={nivelesEstudio ?? []}
          estadosCiviles={estadosCiviles ?? []}
          profesiones={profesiones ?? []}
          comisiones={comisiones ?? []}
          comisionesActuales={(comisionesActuales ?? []).map((c) => c.comision_id)}
        />
      </div>
    </div>
  );
}
