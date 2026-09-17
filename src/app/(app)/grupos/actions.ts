"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { registrarErrorAccion } from "@/lib/log-error";

export async function asignarEncargado(_prevState: unknown, formData: FormData) {
  const grupoId = formData.get("grupo_id") as string;
  const miembroId = (formData.get("miembro_id") as string) || null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("grupos")
    .update({ encargado_miembro_id: miembroId })
    .eq("id", grupoId);

  if (error) {
    await registrarErrorAccion(error, { ruta: "/grupos", operacion: "asignar encargado de grupo" });
    return { error: error.message };
  }
  revalidatePath("/grupos");
  return { error: "" };
}

export async function agregarAuxiliar(_prevState: unknown, formData: FormData) {
  const grupoId = formData.get("grupo_id") as string;
  const miembroId = formData.get("miembro_id") as string;
  if (!miembroId) return { error: "Selecciona un miembro." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("grupo_auxiliares")
    .insert({ grupo_id: grupoId, miembro_id: miembroId });

  if (error) {
    await registrarErrorAccion(error, { ruta: "/grupos", operacion: "agregar auxiliar de grupo" });
    return { error: error.message };
  }
  revalidatePath("/grupos");
  return { error: "" };
}

export async function quitarAuxiliar(formData: FormData) {
  const grupoId = formData.get("grupo_id") as string;
  const miembroId = formData.get("miembro_id") as string;

  const supabase = await createClient();
  const { error } = await supabase
    .from("grupo_auxiliares")
    .delete()
    .eq("grupo_id", grupoId)
    .eq("miembro_id", miembroId);

  if (error) {
    await registrarErrorAccion(error, { ruta: "/grupos", operacion: "quitar auxiliar de grupo" });
  }
  revalidatePath("/grupos");
}
