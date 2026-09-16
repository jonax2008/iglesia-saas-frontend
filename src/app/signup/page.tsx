"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registrarse } from "./actions";

const estadoInicial = { error: "", exito: false, mensaje: "" };

export default function PaginaRegistro() {
  const [estado, accion, enProceso] = useActionState(registrarse, estadoInicial);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        action={accion}
        className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-slate-900">Crear cuenta</h1>

        <div className="space-y-1">
          <label htmlFor="correo" className="text-sm font-medium text-slate-700">
            Correo
          </label>
          <input
            id="correo"
            name="correo"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="contrasena" className="text-sm font-medium text-slate-700">
            Contraseña
          </label>
          <input
            id="contrasena"
            name="contrasena"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          />
        </div>

        {estado?.error ? <p className="text-sm text-red-600">{estado.error}</p> : null}
        {estado?.exito ? (
          <p className="text-sm text-green-700">{estado.mensaje}</p>
        ) : null}

        <button
          type="submit"
          disabled={enProceso}
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-base font-medium text-white disabled:opacity-50"
        >
          {enProceso ? "Creando…" : "Crear cuenta"}
        </button>

        <p className="text-center text-sm text-slate-600">
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className="font-medium text-slate-900 underline">
            Inicia sesión
          </Link>
        </p>
      </form>
    </main>
  );
}
