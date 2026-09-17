"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { registrarErrorAccion } from "@/lib/log-error";

export async function crearGradoMinistro(_prevState: unknown, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  if (!nombre) return { error: "El nombre es obligatorio." };

  const supabase = await createClient();
  const { error } = await supabase.from("grados_ministros").insert({ nombre });

  if (error) {
    await registrarErrorAccion(error, { ruta: "/grados-ministros", operacion: "crear grado de ministro" });
    return { error: error.message };
  }

  revalidatePath("/grados-ministros");
  return { error: "" };
}

export async function eliminarGradoMinistro(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  const { error } = await supabase.from("grados_ministros").delete().eq("id", id);
  if (error) {
    await registrarErrorAccion(error, { ruta: "/grados-ministros", operacion: "eliminar grado de ministro" });
  }
  revalidatePath("/grados-ministros");
}
