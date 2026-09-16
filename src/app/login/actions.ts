"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function iniciarSesion(_prevState: unknown, formData: FormData) {
  const correo = formData.get("correo") as string;
  const contrasena = formData.get("contrasena") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: correo,
    password: contrasena,
  });

  if (error) {
    return { error: "Correo o contraseña incorrectos." };
  }

  redirect("/");
}
