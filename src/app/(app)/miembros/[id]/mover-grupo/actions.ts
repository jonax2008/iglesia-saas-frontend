"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function moverDeGrupo(_prevState: unknown, formData: FormData) {
  const miembroId = formData.get("miembro_id") as string;
  const grupoDestinoId = formData.get("grupo_destino_id") as string;
  const observaciones = (formData.get("observaciones") as string)?.trim();

  const supabase = await createClient();
  const { data: respetaEdad, error } = await supabase.rpc("mover_miembro_grupo", {
    p_miembro_id: miembroId,
    p_grupo_destino_id: grupoDestinoId,
    p_observaciones: observaciones,
  });

  if (error) return { error: error.message };

  revalidatePath(`/miembros/${miembroId}`);
  return {
    error: "",
    exito: true,
    respetaEdad,
  };
}
