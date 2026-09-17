"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { registrarErrorAccion } from "@/lib/log-error";

export async function guardarAsistencia(_prevState: unknown, formData: FormData) {
  const grupoId = formData.get("grupo_id") as string;
  const fecha = formData.get("fecha") as string;
  const categoria = formData.get("categoria") as string;
  const miembroIds = (formData.get("miembro_ids") as string).split(",").filter(Boolean);
  const observaciones = (formData.get("observaciones") as string)?.trim();

  const supabase = await createClient();

  const { data: existentes, error: errorExistentes } = await supabase
    .from("asistencias")
    .select("id, miembro_id, valor")
    .in("miembro_id", miembroIds)
    .eq("fecha", fecha)
    .eq("categoria", categoria);

  if (errorExistentes) {
    await registrarErrorAccion(errorExistentes, {
      ruta: `/grupos/${grupoId}/asistencia`,
      operacion: "cargar asistencia existente",
    });
    return { error: errorExistentes.message };
  }

  const existentePorMiembro = new Map(
    (existentes ?? []).map((a) => [a.miembro_id, a]),
  );

  const nuevos: { miembro_id: string; fecha: string; categoria: string; valor: string }[] =
    [];
  const correcciones: { asistencia_id: string; valor_nuevo: string }[] = [];

  for (const miembroId of miembroIds) {
    const valor = formData.get(`valor_${miembroId}`) as string | null;
    if (!valor) continue; // sin marcar, se deja como estaba (o sin registro)

    const existente = existentePorMiembro.get(miembroId);
    if (!existente) {
      nuevos.push({ miembro_id: miembroId, fecha, categoria, valor });
    } else if (existente.valor !== valor) {
      correcciones.push({ asistencia_id: existente.id, valor_nuevo: valor });
    }
  }

  if (correcciones.length && !observaciones) {
    return {
      error:
        "Hay cambios sobre asistencia ya registrada: agrega una observación que justifique la corrección.",
    };
  }

  if (nuevos.length) {
    const { error } = await supabase.from("asistencias").insert(nuevos);
    if (error) {
      await registrarErrorAccion(error, {
        ruta: `/grupos/${grupoId}/asistencia`,
        operacion: "registrar asistencia nueva",
      });
      return { error: error.message };
    }
  }

  for (const correccion of correcciones) {
    const { error } = await supabase.rpc("corregir_asistencia", {
      p_asistencia_id: correccion.asistencia_id,
      p_valor_nuevo: correccion.valor_nuevo,
      p_observaciones: observaciones,
    });
    if (error) {
      await registrarErrorAccion(error, {
        ruta: `/grupos/${grupoId}/asistencia`,
        operacion: "corregir asistencia",
      });
      return { error: error.message };
    }
  }

  revalidatePath(`/grupos/${grupoId}/asistencia`);
  return { error: "", exito: true, guardados: nuevos.length + correcciones.length };
}
