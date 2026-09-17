import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { registrarErrorFatal } from "@/lib/log-error";

export default async function PaginaReportesIglesia({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: iglesia, error: errorIglesia } = await supabase
    .from("iglesias")
    .select("id, nombre")
    .eq("id", id)
    .maybeSingle();
  if (errorIglesia) {
    await registrarErrorFatal(errorIglesia, {
      ruta: `/iglesias/${id}/reportes`,
      operacion: "cargar iglesia para reportes",
    });
  }

  if (!iglesia) notFound();

  const { data: reportes, error: errorReportes } = await supabase
    .from("reportes_administracion")
    .select(
      "id, fecha_generacion, total_activos, total_retirados_temporales, total_archivo, ministros!inner(iglesia_id, personas(nombres, apellido_paterno))",
    )
    .eq("ministros.iglesia_id", id)
    .order("fecha_generacion");
  if (errorReportes) {
    await registrarErrorFatal(errorReportes, {
      ruta: `/iglesias/${id}/reportes`,
      operacion: "listar reportes de administración",
    });
  }

  const lista = reportes ?? [];
  const maxActivos = Math.max(1, ...lista.map((r) => r.total_activos));

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">
          Reportes comparativos — {iglesia.nombre}
        </h1>
        <p className="text-sm text-slate-600">
          Evolución de miembros activos entre administraciones
        </p>
      </div>

      <div className="space-y-2 rounded-lg bg-white p-4 shadow-sm">
        {lista.length ? (
          <ul className="space-y-2">
            {lista.map((r) => (
              <li key={r.id} className="flex items-center gap-2">
                <span className="w-36 shrink-0 truncate text-xs text-slate-500">
                  {r.ministros?.personas?.nombres} {r.ministros?.personas?.apellido_paterno} (
                  {new Date(r.fecha_generacion).toLocaleDateString("es-MX")})
                </span>
                <div className="h-4 flex-1 rounded bg-slate-100">
                  <div
                    className="h-4 rounded bg-emerald-700"
                    style={{ width: `${(r.total_activos / maxActivos) * 100}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-xs text-slate-600">
                  {r.total_activos}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-500">
            Aún no hay reportes de administración generados para esta iglesia.
          </p>
        )}
      </div>

      <table className="w-full overflow-hidden rounded-lg bg-white text-sm shadow-sm">
        <thead className="bg-slate-100 text-left text-slate-600">
          <tr>
            <th className="px-3 py-2">Ministro</th>
            <th className="px-3 py-2">Fecha</th>
            <th className="px-3 py-2">Activos</th>
            <th className="px-3 py-2">Retirados</th>
            <th className="px-3 py-2">Archivo</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((r) => (
            <tr key={r.id} className="border-t border-slate-100">
              <td className="px-3 py-2">
                {r.ministros?.personas?.nombres} {r.ministros?.personas?.apellido_paterno}
              </td>
              <td className="px-3 py-2">
                {new Date(r.fecha_generacion).toLocaleDateString("es-MX")}
              </td>
              <td className="px-3 py-2">{r.total_activos}</td>
              <td className="px-3 py-2">{r.total_retirados_temporales}</td>
              <td className="px-3 py-2">{r.total_archivo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
