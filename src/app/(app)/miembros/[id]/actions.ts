"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function actualizarMiembro(_prevState: unknown, formData: FormData) {
  const id = formData.get("id") as string;
  const personaId = formData.get("persona_id") as string;
  const comisionIds = formData.getAll("comision_ids") as string[];

  const supabase = await createClient();

  const { error: errorPersona } = await supabase
    .from("personas")
    .update({
      nombres: (formData.get("nombres") as string)?.trim(),
      apellido_paterno: (formData.get("apellido_paterno") as string)?.trim(),
      apellido_materno: (formData.get("apellido_materno") as string)?.trim() || null,
      fecha_nacimiento: formData.get("fecha_nacimiento") as string,
      sexo: formData.get("sexo") as string,
      telefono_celular:
        (formData.get("telefono_celular") as string)?.trim() || null,
      curp: (formData.get("curp") as string)?.trim() || null,
    })
    .eq("id", personaId);

  if (errorPersona) return { error: errorPersona.message };

  const { error: errorMiembro } = await supabase
    .from("miembros")
    .update({
      grupo_id: formData.get("grupo_id") as string,
      correo_personal: (formData.get("correo_personal") as string)?.trim() || null,
      lugar_nacimiento_ciudad_id:
        (formData.get("lugar_nacimiento_ciudad_id") as string) || null,
      fecha_bautismo: formData.get("fecha_bautismo") as string,
      lugar_bautismo: (formData.get("lugar_bautismo") as string)?.trim() || null,
      ministro_bautizo_nombre:
        (formData.get("ministro_bautizo_nombre") as string)?.trim() || null,
      fecha_espiritu_santo: formData.get("fecha_espiritu_santo") as string,
      ministro_testifico_nombre:
        (formData.get("ministro_testifico_nombre") as string)?.trim() || null,
      nivel_estudios_id: (formData.get("nivel_estudios_id") as string) || null,
      profesion_ocupacion_id:
        (formData.get("profesion_ocupacion_id") as string) || null,
      estado_civil_id: (formData.get("estado_civil_id") as string) || null,
      credencial_vigente_hasta:
        (formData.get("credencial_vigente_hasta") as string) || null,
      categoria: formData.get("categoria") as string,
    })
    .eq("id", id);

  if (errorMiembro) return { error: errorMiembro.message };

  await supabase.from("miembro_comisiones").delete().eq("miembro_id", id);
  if (comisionIds.length) {
    const { error: errorComisiones } = await supabase
      .from("miembro_comisiones")
      .insert(comisionIds.map((comisionId) => ({ miembro_id: id, comision_id: comisionId })));
    if (errorComisiones) return { error: errorComisiones.message };
  }

  revalidatePath(`/miembros/${id}`);
  revalidatePath("/miembros");
  return { error: "", exito: true };
}
