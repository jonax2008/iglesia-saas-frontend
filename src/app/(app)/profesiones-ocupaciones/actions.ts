"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function crearProfesionOcupacion(
  _prevState: unknown,
  formData: FormData,
) {
  const nombre = (formData.get("nombre") as string)?.trim();
  if (!nombre) return { error: "El nombre es obligatorio." };

  const supabase = await createClient();
  const { error } = await supabase.from("profesiones_ocupaciones").insert({ nombre });

  if (error) return { error: error.message };

  revalidatePath("/profesiones-ocupaciones");
  return { error: "" };
}

export async function eliminarProfesionOcupacion(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  await supabase.from("profesiones_ocupaciones").delete().eq("id", id);
  revalidatePath("/profesiones-ocupaciones");
}
