"use server";

import { createClient } from "@/lib/supabase/server";

export async function registrarse(_prevState: unknown, formData: FormData) {
  const correo = formData.get("correo") as string;
  const contrasena = formData.get("contrasena") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email: correo,
    password: contrasena,
  });

  if (error) {
    return { error: error.message, exito: false };
  }

  return {
    error: "",
    exito: true,
    mensaje:
      "Cuenta creada. Revisa tu correo para confirmarla y luego pide a un super_admin que active tu perfil.",
  };
}
