"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function crearGradoMinistro(_prevState: unknown, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  if (!nombre) return { error: "El nombre es obligatorio." };

  const supabase = await createClient();
  const { error } = await supabase.from("grados_ministros").insert({ nombre });

  if (error) return { error: error.message };

  revalidatePath("/grados-ministros");
  return { error: "" };
}

export async function eliminarGradoMinistro(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  await supabase.from("grados_ministros").delete().eq("id", id);
  revalidatePath("/grados-ministros");
}
