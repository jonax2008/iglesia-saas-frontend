"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function marcarLeida(formData: FormData) {
  const id = formData.get("id") as string;
  const supabase = await createClient();
  await supabase.from("notificaciones").update({ leida: true }).eq("id", id);
  revalidatePath("/notificaciones");
  revalidatePath("/", "layout");
}

export async function marcarTodasLeidas() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return;
  await supabase
    .from("notificaciones")
    .update({ leida: true })
    .eq("usuario_id", auth.user.id)
    .eq("leida", false);
  revalidatePath("/notificaciones");
  revalidatePath("/", "layout");
}
