"use server";

import { createClient } from "@/lib/supabase/server";
import { obtenerUsuarioActual } from "@/lib/auth";

export async function ejecutarAutomatizaciones() {
  const supabase = await createClient();
  const usuario = await obtenerUsuarioActual();

  const { data: actualizados, error: errorCategorias } = await supabase.rpc(
    "actualizar_categorias_miembros",
    usuario?.rol === "super_admin" ? {} : { p_iglesia_id: usuario?.iglesiaId ?? undefined },
  );
  if (errorCategorias) return { error: errorCategorias.message };

  const { data: avisos, error: errorAvisos } = await supabase.rpc(
    "generar_avisos_cambio_grupo",
  );
  if (errorAvisos) return { error: errorAvisos.message };

  return { error: "", exito: true, actualizados, avisos };
}
