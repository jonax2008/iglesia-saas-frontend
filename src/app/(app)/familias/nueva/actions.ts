"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { registrarErrorAccion } from "@/lib/log-error";

export async function crearFamilia(_prevState: unknown, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  const iglesiaId = formData.get("iglesia_id") as string;
  const padreId = (formData.get("padre_miembro_id") as string) || null;
  const madreId = (formData.get("madre_miembro_id") as string) || null;

  if (!nombre || !iglesiaId) {
    return { error: "Nombre e iglesia son obligatorios." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("familias").insert({
    nombre,
    iglesia_id: iglesiaId,
    padre_miembro_id: padreId,
    madre_miembro_id: madreId,
  });

  if (error) {
    await registrarErrorAccion(error, { ruta: "/familias/nueva", operacion: "crear familia" });
    return { error: error.message };
  }

  redirect("/familias");
}
