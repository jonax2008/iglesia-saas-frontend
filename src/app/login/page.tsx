"use client";

import { useActionState } from "react";
import Link from "next/link";
import { iniciarSesion } from "./actions";

const estadoInicial = { error: "" };

export default function PaginaLogin() {
  const [estado, accion, enProceso] = useActionState(iniciarSesion, estadoInicial);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        action={accion}
        className="w-full max-w-sm space-y-4 rounded-xl bg-white p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-slate-900">Iniciar sesión</h1>

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
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          />
        </div>

        {estado?.error ? (
          <p className="text-sm text-red-600">{estado.error}</p>
        ) : null}

        <button
          type="submit"
          disabled={enProceso}
          className="w-full rounded-lg bg-slate-900 px-3 py-2 text-base font-medium text-white disabled:opacity-50"
        >
          {enProceso ? "Entrando…" : "Entrar"}
        </button>

        <p className="text-center text-sm text-slate-600">
          ¿No tienes cuenta?{" "}
          <Link href="/signup" className="font-medium text-slate-900 underline">
            Regístrate
          </Link>
        </p>
      </form>
    </main>
  );
}
