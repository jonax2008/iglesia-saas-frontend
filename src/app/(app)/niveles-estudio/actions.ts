"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function crearNivelEstudio(_prevState: unknown, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  if (!nombre) return { error: "El nombre es obligatorio." };

  const supabase = await createClient();
  const { error } = await supabase.from("niveles_estudio").insert({ nombre });

  if (error) return { error: error.message };

  revalidatePath("/niveles-estudio");
  return { error: "" };
}

export async function eliminarNivelEstudio(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  await supabase.from("niveles_estudio").delete().eq("id", id);
  revalidatePath("/niveles-estudio");
}
