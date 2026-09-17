"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { registrarErrorAccion } from "@/lib/log-error";

export async function crearGrupo(_prevState: unknown, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  const iglesiaId = formData.get("iglesia_id") as string;
  const edadInicial = Number(formData.get("edad_inicial"));
  const edadFinal = Number(formData.get("edad_final"));

  if (!nombre || !iglesiaId || Number.isNaN(edadInicial) || Number.isNaN(edadFinal)) {
    return { error: "Faltan campos obligatorios." };
  }
  if (edadInicial > edadFinal) {
    return { error: "La edad inicial no puede ser mayor que la edad final." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("grupos").insert({
    nombre,
    iglesia_id: iglesiaId,
    edad_inicial: edadInicial,
    edad_final: edadFinal,
  });

  if (error) {
    await registrarErrorAccion(error, { ruta: "/grupos/nuevo", operacion: "crear grupo" });
    return { error: error.message };
  }

  redirect("/grupos");
}
