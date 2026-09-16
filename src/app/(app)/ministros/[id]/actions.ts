"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function actualizarMinistro(_prevState: unknown, formData: FormData) {
  const id = formData.get("id") as string;
  const personaId = formData.get("persona_id") as string;
  const esPastorDistrital = formData.get("es_pastor_distrital") === "on";
  const esPastorJurisdiccional = formData.get("es_pastor_jurisdiccional") === "on";

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

  const { error: errorMinistro } = await supabase
    .from("ministros")
    .update({
      correo_institucional: (formData.get("correo_institucional") as string)?.trim(),
      fecha_inicio_administracion: formData.get(
        "fecha_inicio_administracion",
      ) as string,
      fecha_fin_administracion:
        (formData.get("fecha_fin_administracion") as string) || null,
      grado_id: formData.get("grado_id") as string,
      es_pastor_distrital: esPastorDistrital,
      distrito_a_cargo_id: esPastorDistrital
        ? (formData.get("distrito_a_cargo_id") as string)
        : null,
      es_pastor_jurisdiccional: esPastorJurisdiccional,
      jurisdiccion_a_cargo_id: esPastorJurisdiccional
        ? (formData.get("jurisdiccion_a_cargo_id") as string)
        : null,
    })
    .eq("id", id);

  if (errorMinistro) return { error: errorMinistro.message };

  revalidatePath(`/ministros/${id}`);
  revalidatePath("/ministros");
  return { error: "", exito: true };
}
