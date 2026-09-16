"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function crearIglesia(_prevState: unknown, formData: FormData) {
  const nombre = (formData.get("nombre") as string)?.trim();
  const calleNumero = (formData.get("calle_numero") as string)?.trim();
  const coloniaId = formData.get("colonia_id") as string;
  const codigoPostal = (formData.get("codigo_postal") as string)?.trim();
  const distritoId = formData.get("distrito_id") as string;
  const googleMapsLink = (formData.get("google_maps_link") as string)?.trim();
  const telefonoCasaPastoral = (
    formData.get("telefono_casa_pastoral") as string
  )?.trim();

  if (!nombre || !calleNumero || !coloniaId || !codigoPostal || !distritoId) {
    return { error: "Faltan campos obligatorios (nombre, dirección, colonia, código postal y distrito)." };
  }

  // ciudad_id/estado_id/pais_id son NOT NULL en la tabla, pero un trigger
  // los deriva siempre desde colonia_id antes de insertar (ver migración
  // 20260916100000); el valor placeholder de abajo nunca llega a guardarse.
  const GEOGRAFIA_PLACEHOLDER = "00000000-0000-0000-0000-000000000000";

  const supabase = await createClient();
  const { error } = await supabase.from("iglesias").insert({
    nombre,
    calle_numero: calleNumero,
    colonia_id: coloniaId,
    codigo_postal: codigoPostal,
    distrito_id: distritoId,
    ciudad_id: GEOGRAFIA_PLACEHOLDER,
    estado_id: GEOGRAFIA_PLACEHOLDER,
    pais_id: GEOGRAFIA_PLACEHOLDER,
    google_maps_link: googleMapsLink || null,
    telefono_casa_pastoral: telefonoCasaPastoral || null,
  });

  if (error) return { error: error.message };

  redirect("/iglesias");
}
