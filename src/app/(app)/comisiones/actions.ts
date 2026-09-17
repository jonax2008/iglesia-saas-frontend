"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { registrarErrorAccion } from "@/lib/log-error";

export async function crearComision(_prevState: unknown, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  if (!nombre) return { error: "El nombre es obligatorio." };

  const supabase = await createClient();
  const { error } = await supabase.from("comisiones").insert({ nombre });

  if (error) {
    await registrarErrorAccion(error, { ruta: "/comisiones", operacion: "crear comisión" });
    return { error: error.message };
  }

  revalidatePath("/comisiones");
  return { error: "" };
}

export async function eliminarComision(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  const { error } = await supabase.from("comisiones").delete().eq("id", id);
  if (error) {
    await registrarErrorAccion(error, { ruta: "/comisiones", operacion: "eliminar comisión" });
  }
  revalidatePath("/comisiones");
}
