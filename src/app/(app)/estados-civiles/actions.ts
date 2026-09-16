"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function crearEstadoCivil(_prevState: unknown, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  if (!nombre) return { error: "El nombre es obligatorio." };

  const supabase = await createClient();
  const { error } = await supabase.from("estados_civiles").insert({ nombre });

  if (error) return { error: error.message };

  revalidatePath("/estados-civiles");
  return { error: "" };
}

export async function eliminarEstadoCivil(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  await supabase.from("estados_civiles").delete().eq("id", id);
  revalidatePath("/estados-civiles");
}
