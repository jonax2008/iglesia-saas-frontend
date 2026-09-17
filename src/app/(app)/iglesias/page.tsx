import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { obtenerUsuarioActual } from "@/lib/auth";
import { registrarErrorFatal } from "@/lib/log-error";

export default async function PaginaIglesias() {
  const supabase = await createClient();
  const usuario = await obtenerUsuarioActual();
  const puedeCrear = usuario?.rol === "super_admin";
  const { data: iglesias, error } = await supabase
    .from("iglesias")
    .select(
      "id, nombre, calle_numero, ciudades(nombre), estados(nombre), distritos(numero, nombre)",
    )
    .order("nombre");
  if (error) await registrarErrorFatal(error, { ruta: "/iglesias", operacion: "listar iglesias" });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Iglesias</h1>
        {puedeCrear ? (
          <Link
            href="/iglesias/nueva"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            Nueva iglesia
          </Link>
        ) : null}
      </div>

      <ul className="divide-y divide-slate-200 rounded-lg bg-white shadow-sm">
        {iglesias?.map((i) => (
          <li key={i.id} className="px-4 py-3">
            <Link href={`/iglesias/${i.id}`} className="text-sm font-medium text-slate-900 underline">
              {i.nombre}
            </Link>
            <p className="text-sm text-slate-500">
              {i.calle_numero}, {i.ciudades?.nombre}, {i.estados?.nombre} — Distrito #
              {i.distritos?.numero} {i.distritos?.nombre}
            </p>
          </li>
        ))}
        {!iglesias?.length ? (
          <li className="px-4 py-3 text-sm text-slate-500">Aún no hay iglesias.</li>
        ) : null}
      </ul>
    </div>
  );
}
