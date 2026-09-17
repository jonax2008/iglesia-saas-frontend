"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { registrarErrorAccion } from "@/lib/log-error";

export async function crearMinistro(_prevState: unknown, formData: FormData) {
  const esPastorDistrital = formData.get("es_pastor_distrital") === "on";
  const esPastorJurisdiccional = formData.get("es_pastor_jurisdiccional") === "on";

  const supabase = await createClient();
  const { error } = await supabase.rpc("crear_ministro", {
    p_nombres: (formData.get("nombres") as string)?.trim(),
    p_apellido_paterno: (formData.get("apellido_paterno") as string)?.trim(),
    p_apellido_materno:
      (formData.get("apellido_materno") as string)?.trim() || undefined,
    p_fecha_nacimiento: formData.get("fecha_nacimiento") as string,
    p_sexo: formData.get("sexo") as string,
    p_telefono_celular:
      (formData.get("telefono_celular") as string)?.trim() || undefined,
    p_curp: (formData.get("curp") as string)?.trim() || undefined,
    p_iglesia_id: formData.get("iglesia_id") as string,
    p_correo_institucional: (formData.get("correo_institucional") as string)?.trim(),
    p_fecha_inicio_administracion: formData.get(
      "fecha_inicio_administracion",
    ) as string,
    p_grado_id: formData.get("grado_id") as string,
    p_es_pastor_distrital: esPastorDistrital,
    p_distrito_a_cargo_id: esPastorDistrital
      ? (formData.get("distrito_a_cargo_id") as string)
      : undefined,
    p_es_pastor_jurisdiccional: esPastorJurisdiccional,
    p_jurisdiccion_a_cargo_id: esPastorJurisdiccional
      ? (formData.get("jurisdiccion_a_cargo_id") as string)
      : undefined,
  });

  if (error) {
    await registrarErrorAccion(error, { ruta: "/ministros/nuevo", operacion: "crear ministro" });
    return { error: error.message };
  }

  redirect("/ministros");
}
