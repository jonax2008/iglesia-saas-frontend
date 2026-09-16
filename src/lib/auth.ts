import { createClient } from "@/lib/supabase/server";

export type UsuarioActual = {
  id: string;
  correo: string;
  rol: string;
  iglesiaId: string | null;
};

/** Sesión + perfil de `usuarios` del usuario autenticado, o null si no aplica. */
export async function obtenerUsuarioActual(): Promise<UsuarioActual | null> {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  if (!authData.user) return null;

  const { data: usuario } = await supabase
    .from("usuarios")
    .select("id, correo, iglesia_id, roles(nombre)")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (!usuario) return null;

  return {
    id: usuario.id,
    correo: usuario.correo,
    rol: usuario.roles!.nombre,
    iglesiaId: usuario.iglesia_id,
  };
}
