"use server";

import { createClient } from "@/lib/supabase/server";
import { obtenerUsuarioActual } from "@/lib/auth";
import { registrarErrorAccion } from "@/lib/log-error";

export async function ejecutarAutomatizaciones() {
  const supabase = await createClient();
  const usuario = await obtenerUsuarioActual();

  const { data: actualizados, error: errorCategorias } = await supabase.rpc(
    "actualizar_categorias_miembros",
    usuario?.rol === "super_admin" ? {} : { p_iglesia_id: usuario?.iglesiaId ?? undefined },
  );
  if (errorCategorias) {
    await registrarErrorAccion(errorCategorias, {
      ruta: "/",
      operacion: "actualizar categorías de miembros (manual)",
    });
    return { error: errorCategorias.message };
  }

  const { data: avisos, error: errorAvisos } = await supabase.rpc(
    "generar_avisos_cambio_grupo",
  );
  if (errorAvisos) {
    await registrarErrorAccion(errorAvisos, {
      ruta: "/",
      operacion: "generar avisos de cambio de grupo (manual)",
    });
    return { error: errorAvisos.message };
  }

  return { error: "", exito: true, actualizados, avisos };
}
