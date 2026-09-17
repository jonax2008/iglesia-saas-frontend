"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { registrarErrorAccion } from "@/lib/log-error";

export async function crearNivelEstudio(_prevState: unknown, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  if (!nombre) return { error: "El nombre es obligatorio." };

  const supabase = await createClient();
  const { error } = await supabase.from("niveles_estudio").insert({ nombre });

  if (error) {
    await registrarErrorAccion(error, { ruta: "/niveles-estudio", operacion: "crear nivel de estudio" });
    return { error: error.message };
  }

  revalidatePath("/niveles-estudio");
  return { error: "" };
}

export async function eliminarNivelEstudio(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  const { error } = await supabase.from("niveles_estudio").delete().eq("id", id);
  if (error) {
    await registrarErrorAccion(error, { ruta: "/niveles-estudio", operacion: "eliminar nivel de estudio" });
  }
  revalidatePath("/niveles-estudio");
}
