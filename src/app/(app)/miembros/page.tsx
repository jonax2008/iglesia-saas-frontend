import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { registrarErrorFatal } from "@/lib/log-error";

const ETIQUETA_CATEGORIA: Record<string, string> = {
  activo: "Activo",
  retirado_temporal: "Retirado temporal",
  archivo: "En archivo",
};

export default async function PaginaMiembros() {
  const supabase = await createClient();
  const { data: miembros, error } = await supabase
    .from("miembros")
    .select(
      "id, categoria, correo_personal, personas(nombres, apellido_paterno, apellido_materno), iglesias(nombre), grupos(nombre)",
    )
    .order("categoria");
  if (error) await registrarErrorFatal(error, { ruta: "/miembros", operacion: "listar miembros" });

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Miembros</h1>
        <Link
          href="/miembros/nuevo"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
        >
          Nuevo miembro
        </Link>
      </div>

      <ul className="divide-y divide-slate-200 rounded-lg bg-white shadow-sm">
        {miembros?.map((m) => (
          <li key={m.id} className="px-4 py-3">
            <Link
              href={`/miembros/${m.id}`}
              className="text-sm font-medium text-slate-900 underline"
            >
              {m.personas?.nombres} {m.personas?.apellido_paterno}{" "}
              {m.personas?.apellido_materno}
            </Link>{" "}
            <span className="text-sm font-normal text-slate-500">
              ({ETIQUETA_CATEGORIA[m.categoria] ?? m.categoria})
            </span>
            <p className="text-sm text-slate-500">
              {m.iglesias?.nombre} — Grupo: {m.grupos?.nombre}
            </p>
          </li>
        ))}
        {!miembros?.length ? (
          <li className="px-4 py-3 text-sm text-slate-500">Aún no hay miembros.</li>
        ) : null}
      </ul>
    </div>
  );
}
