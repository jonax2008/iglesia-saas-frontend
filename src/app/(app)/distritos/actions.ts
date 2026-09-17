"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { registrarErrorAccion } from "@/lib/log-error";

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

  if (error) {
    await registrarErrorAccion(error, { ruta: "/distritos", operacion: "crear distrito" });
    return { error: error.message };
  }

  revalidatePath("/distritos");
  return { error: "" };
}

export async function eliminarDistrito(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  const { error } = await supabase.from("distritos").delete().eq("id", id);
  if (error) {
    await registrarErrorAccion(error, { ruta: "/distritos", operacion: "eliminar distrito" });
  }
  revalidatePath("/distritos");
}
