"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function asignarEncargado(formData: FormData) {
  const grupoId = formData.get("grupo_id") as string;
  const miembroId = (formData.get("miembro_id") as string) || null;

  const supabase = await createClient();
  const { error } = await supabase
    .from("grupos")
    .update({ encargado_miembro_id: miembroId })
    .eq("id", grupoId);

  if (error) {
    console.error("No se pudo asignar el encargado:", error.message);
  }
  revalidatePath("/grupos");
}

export async function agregarAuxiliar(formData: FormData) {
  const grupoId = formData.get("grupo_id") as string;
  const miembroId = formData.get("miembro_id") as string;
  if (!miembroId) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("grupo_auxiliares")
    .insert({ grupo_id: grupoId, miembro_id: miembroId });

  if (error) {
    console.error("No se pudo agregar el auxiliar:", error.message);
  }
  revalidatePath("/grupos");
}

export async function quitarAuxiliar(formData: FormData) {
  const grupoId = formData.get("grupo_id") as string;
  const miembroId = formData.get("miembro_id") as string;

  const supabase = await createClient();
  await supabase
    .from("grupo_auxiliares")
    .delete()
    .eq("grupo_id", grupoId)
    .eq("miembro_id", miembroId);

  revalidatePath("/grupos");
}
