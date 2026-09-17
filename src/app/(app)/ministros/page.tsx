import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function PaginaMinistros() {
  const supabase = await createClient();
  const { data: ministros } = await supabase
    .from("ministros")
    .select(
      "id, correo_institucional, fecha_inicio_administracion, fecha_fin_administracion, personas(nombres, apellido_paterno, apellido_materno), iglesias(nombre), grados_ministros(nombre)",
    )
    .order("fecha_inicio_administracion", { ascending: false });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Ministros</h1>
        <Link
          href="/ministros/nuevo"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
        >
          Nuevo ministro
        </Link>
      </div>

      <ul className="divide-y divide-slate-200 rounded-lg bg-white shadow-sm">
        {ministros?.map((m) => (
          <li key={m.id} className="px-4 py-3">
            <Link
              href={`/ministros/${m.id}`}
              className="text-sm font-medium text-slate-900 underline"
            >
              {m.personas?.nombres} {m.personas?.apellido_paterno}{" "}
              {m.personas?.apellido_materno}
            </Link>{" "}
            <span className="text-sm font-normal text-slate-500">
              ({m.grados_ministros?.nombre})
            </span>
            <p className="text-sm text-slate-500">
              {m.iglesias?.nombre} — desde {m.fecha_inicio_administracion}
              {m.fecha_fin_administracion ? ` hasta ${m.fecha_fin_administracion}` : ""}
            </p>
          </li>
        ))}
        {!ministros?.length ? (
          <li className="px-4 py-3 text-sm text-slate-500">Aún no hay ministros.</li>
        ) : null}
      </ul>
    </div>
  );
}
