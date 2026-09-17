"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { registrarErrorAccion } from "@/lib/log-error";

export async function crearJurisdiccion(_prevState: unknown, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  if (!nombre) return { error: "El nombre es obligatorio." };

  const supabase = await createClient();
  const { error } = await supabase.from("jurisdicciones").insert({ nombre });

  if (error) {
    await registrarErrorAccion(error, { ruta: "/jurisdicciones", operacion: "crear jurisdicción" });
    return { error: error.message };
  }

  revalidatePath("/jurisdicciones");
  return { error: "" };
}

export async function eliminarJurisdiccion(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  const { error } = await supabase.from("jurisdicciones").delete().eq("id", id);
  if (error) {
    await registrarErrorAccion(error, { ruta: "/jurisdicciones", operacion: "eliminar jurisdicción" });
  }
  revalidatePath("/jurisdicciones");
}
