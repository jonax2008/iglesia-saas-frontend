"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function actualizarIglesia(_prevState: unknown, formData: FormData) {
  const id = formData.get("id") as string;
  const nombre = (formData.get("nombre") as string)?.trim();
  const calleNumero = (formData.get("calle_numero") as string)?.trim();
  const coloniaId = formData.get("colonia_id") as string;
  const codigoPostal = (formData.get("codigo_postal") as string)?.trim();
  const distritoId = formData.get("distrito_id") as string;
  const googleMapsLink = (formData.get("google_maps_link") as string)?.trim();
  const telefonoCasaPastoral = (
    formData.get("telefono_casa_pastoral") as string
  )?.trim();
  const ministroActualId = (formData.get("ministro_actual_id") as string) || null;

  if (!nombre || !calleNumero || !coloniaId || !codigoPostal || !distritoId) {
    return {
      error:
        "Faltan campos obligatorios (nombre, dirección, colonia, código postal y distrito).",
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("iglesias")
    .update({
      nombre,
      calle_numero: calleNumero,
      colonia_id: coloniaId,
      codigo_postal: codigoPostal,
      distrito_id: distritoId,
      google_maps_link: googleMapsLink || null,
      telefono_casa_pastoral: telefonoCasaPastoral || null,
      ministro_actual_id: ministroActualId,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath(`/iglesias/${id}`);
  revalidatePath("/iglesias");
  return { error: "", exito: true };
}
