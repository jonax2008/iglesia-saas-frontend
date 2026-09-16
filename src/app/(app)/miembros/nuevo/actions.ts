"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function crearMiembro(_prevState: unknown, formData: FormData) {
  const comisionIds = formData.getAll("comision_ids") as string[];

  const supabase = await createClient();
  const { data: miembroId, error } = await supabase.rpc("crear_miembro", {
    p_nombres: (formData.get("nombres") as string)?.trim(),
    p_apellido_paterno: (formData.get("apellido_paterno") as string)?.trim(),
    p_apellido_materno: (formData.get("apellido_materno") as string)?.trim() || undefined,
    p_fecha_nacimiento: (formData.get("fecha_nacimiento") as string) || undefined,
    p_sexo: (formData.get("sexo") as string) || undefined,
    p_telefono_celular:
      (formData.get("telefono_celular") as string)?.trim() || undefined,
    p_curp: (formData.get("curp") as string)?.trim() || undefined,
    p_iglesia_id: formData.get("iglesia_id") as string,
    p_grupo_id: formData.get("grupo_id") as string,
    p_correo_personal: (formData.get("correo_personal") as string)?.trim() || undefined,
    p_lugar_nacimiento_ciudad_id:
      (formData.get("lugar_nacimiento_ciudad_id") as string) || undefined,
    p_fecha_bautismo: formData.get("fecha_bautismo") as string,
    p_lugar_bautismo: (formData.get("lugar_bautismo") as string)?.trim() || undefined,
    p_ministro_bautizo_id: (formData.get("ministro_bautizo_id") as string) || undefined,
    p_fecha_espiritu_santo: formData.get("fecha_espiritu_santo") as string,
    p_ministro_testifico_id:
      (formData.get("ministro_testifico_id") as string) || undefined,
    p_nivel_estudios_id: (formData.get("nivel_estudios_id") as string) || undefined,
    p_profesion_ocupacion_id:
      (formData.get("profesion_ocupacion_id") as string) || undefined,
    p_estado_civil_id: (formData.get("estado_civil_id") as string) || undefined,
    p_credencial_vigente_hasta:
      (formData.get("credencial_vigente_hasta") as string) || undefined,
    p_comision_ids: comisionIds.length ? comisionIds : undefined,
  });

  if (error) return { error: error.message };
  if (!miembroId) return { error: "No se pudo crear el miembro." };

  redirect("/miembros");
}
