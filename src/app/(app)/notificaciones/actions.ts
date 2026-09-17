"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { registrarErrorAccion } from "@/lib/log-error";

export async function marcarLeida(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  const { error } = await supabase
    .from("notificaciones")
    .update({ leida: true })
    .eq("id", id);
  if (error) {
    await registrarErrorAccion(error, { ruta: "/notificaciones", operacion: "marcar notificación como leída" });
  }
  revalidatePath("/notificaciones");
  revalidatePath("/", "layout");
}

export async function marcarTodasLeidas() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return;
  const { error } = await supabase
    .from("notificaciones")
    .update({ leida: true })
    .eq("usuario_id", auth.user.id)
    .eq("leida", false);
  if (error) {
    await registrarErrorAccion(error, {
      ruta: "/notificaciones",
      operacion: "marcar todas las notificaciones como leídas",
    });
  }
  revalidatePath("/notificaciones");
  revalidatePath("/", "layout");
}
