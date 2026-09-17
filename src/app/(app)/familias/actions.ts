"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { registrarErrorAccion } from "@/lib/log-error";

export async function agregarHijo(formData: FormData) {
  const familiaId = formData.get("familia_id") as string;
  const miembroId = formData.get("miembro_id") as string;
  if (!miembroId) return;

  const supabase = await createClient();
  const { error } = await supabase
    .from("familia_hijos")
    .insert({ familia_id: familiaId, miembro_id: miembroId });

  if (error) {
    await registrarErrorAccion(error, { ruta: "/familias", operacion: "agregar hijo a familia" });
  }
  revalidatePath("/familias");
}

export async function quitarHijo(formData: FormData) {
  const familiaId = formData.get("familia_id") as string;
  const miembroId = formData.get("miembro_id") as string;

  const supabase = await createClient();
  const { error } = await supabase
    .from("familia_hijos")
    .delete()
    .eq("familia_id", familiaId)
    .eq("miembro_id", miembroId);

  if (error) {
    await registrarErrorAccion(error, { ruta: "/familias", operacion: "quitar hijo de familia" });
  }
  revalidatePath("/familias");
}
