"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function crearDistrito(_prevState: unknown, formData: FormData) {
  const numero = Number(formData.get("numero"));
  const nombre = (formData.get("nombre") as string)?.trim();
  const jurisdiccionId = formData.get("jurisdiccion_id") as string;

  if (!numero || !nombre || !jurisdiccionId) {
    return { error: "Número, nombre y jurisdicción son obligatorios." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("distritos")
    .insert({ numero, nombre, jurisdiccion_id: jurisdiccionId });

  if (error) return { error: error.message };

  revalidatePath("/distritos");
  return { error: "" };
}

export async function eliminarDistrito(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  await supabase.from("distritos").delete().eq("id", id);
  revalidatePath("/distritos");
}
