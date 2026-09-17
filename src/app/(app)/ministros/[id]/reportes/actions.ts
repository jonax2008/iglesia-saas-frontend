"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { registrarErrorAccion } from "@/lib/log-error";

export async function generarReporte(formData: FormData) {
  const ministroId = formData.get("ministro_id") as string;
  const supabase = await createClient();
  const { error } = await supabase.rpc("generar_reporte_administracion", {
    p_ministro_id: ministroId,
  });
  if (error) {
    await registrarErrorAccion(error, {
      ruta: `/ministros/${ministroId}`,
      operacion: "generar reporte de administración",
    });
  }
  revalidatePath(`/ministros/${ministroId}`);
}
