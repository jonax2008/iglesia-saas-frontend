import { createClient } from "@/lib/supabase/server";

type ErrorSupabase = {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
};

type ContextoError = {
  ruta: string;
  operacion: string;
};

async function guardarLog(error: ErrorSupabase, contexto: ContextoError) {
  const payload = {
    timestamp: new Date().toISOString(),
    ruta: contexto.ruta,
    operacion: contexto.operacion,
    mensaje: error.message,
    codigo: error.code ?? null,
    detalles: error.details ?? null,
    hint: error.hint ?? null,
  };

  // Siempre queda en los logs de la plataforma, aunque falle el insert de abajo.
  console.error(JSON.stringify(payload));

  try {
    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    await supabase.from("logs_errores").insert({
      ruta: contexto.ruta,
      operacion: contexto.operacion,
      mensaje: error.message,
      codigo: error.code ?? null,
      detalles: error.details ?? null,
      hint: error.hint ?? null,
      usuario_id: auth.user?.id ?? null,
      contexto: payload,
    });
  } catch (errorLog) {
    console.error("No se pudo guardar logs_errores:", errorLog);
  }
}

/**
 * Para fallos al CARGAR una pantalla (Server Components): registra el
 * error y lanza una excepción amigable, que activa error.tsx en vez de
 * mostrar la pantalla como si no hubiera datos.
 */
export async function registrarErrorFatal(
  error: ErrorSupabase,
  contexto: ContextoError,
): Promise<never> {
  await guardarLog(error, contexto);
  throw new Error(
    `No se pudo cargar la información (${contexto.operacion}). El error ya quedó registrado.`,
  );
}

/**
 * Para fallos dentro de Server Actions que ya devuelven {error} para
 * mostrarlo en el propio formulario: registra el error sin lanzar
 * excepción (no queremos tirar la pantalla completa por un guardado
 * fallido).
 */
export async function registrarErrorAccion(error: ErrorSupabase, contexto: ContextoError) {
  await guardarLog(error, contexto);
}
