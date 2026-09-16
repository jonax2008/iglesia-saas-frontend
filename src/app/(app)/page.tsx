import { obtenerUsuarioActual } from "@/lib/auth";

export default async function PaginaInicio() {
  const usuario = await obtenerUsuarioActual();

  return (
    <div className="space-y-2">
      <h1 className="text-xl font-semibold text-slate-900">Inicio</h1>
      <p className="text-sm text-slate-600">
        Sesión: {usuario?.correo} — Rol: {usuario?.rol}
      </p>
    </div>
  );
}
