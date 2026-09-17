"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function generarReporte(formData: FormData) {
  const ministroId = formData.get("ministro_id") as string;
  const supabase = await createClient();
  const { error } = await supabase.rpc("generar_reporte_administracion", {
    p_ministro_id: ministroId,
  });
  if (error) {
    console.error("No se pudo generar el reporte:", error.message);
  }
  revalidatePath(`/ministros/${ministroId}`);
}
