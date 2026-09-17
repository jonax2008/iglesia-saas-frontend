import { generarReporte } from "./actions";

type DetalleMiembro = {
  miembro_id: string;
  nombres: string;
  apellido_paterno: string;
  apellido_materno: string | null;
  categoria: string;
};

type Reporte = {
  id: string;
  fecha_generacion: string;
  total_activos: number;
  total_retirados_temporales: number;
  total_archivo: number;
  detalle: unknown;
};

const ETIQUETA_CATEGORIA: Record<string, string> = {
  activo: "Activos",
  retirado_temporal: "Retirados temporales",
  archivo: "En archivo",
};

export function ListaReportesMinistro({
  ministroId,
  reportes,
  puedeGenerar,
}: {
  ministroId: string;
  reportes: Reporte[];
  puedeGenerar: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-700">
          Reportes de administración
        </h2>
        {puedeGenerar ? (
          <form action={generarReporte}>
            <input type="hidden" name="ministro_id" value={ministroId} />
            <button
              type="submit"
              className="rounded-lg bg-slate-700 px-3 py-1 text-sm text-white"
            >
              Generar reporte ahora
            </button>
          </form>
        ) : null}
      </div>

      {reportes.map((r) => {
        const detalle = (r.detalle as DetalleMiembro[] | null) ?? [];
        const porCategoria = new Map<string, DetalleMiembro[]>();
        for (const m of detalle) {
          const lista = porCategoria.get(m.categoria) ?? [];
          lista.push(m);
          porCategoria.set(m.categoria, lista);
        }

        return (
          <details key={r.id} className="rounded-lg bg-white p-4 shadow-sm">
            <summary className="cursor-pointer text-sm font-medium text-slate-900">
              {new Date(r.fecha_generacion).toLocaleDateString("es-MX")} — {r.total_activos}{" "}
              activos, {r.total_retirados_temporales} retirados, {r.total_archivo} en archivo
            </summary>
            <div className="mt-3 space-y-3">
              {[...porCategoria.entries()].map(([categoria, miembros]) => (
                <div key={categoria}>
                  <p className="text-sm font-medium text-slate-700">
                    {ETIQUETA_CATEGORIA[categoria] ?? categoria} ({miembros.length})
                  </p>
                  <ul className="ml-4 list-disc text-sm text-slate-600">
                    {miembros.map((m) => (
                      <li key={m.miembro_id}>
                        {m.nombres} {m.apellido_paterno} {m.apellido_materno}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </details>
        );
      })}
      {!reportes.length ? (
        <p className="text-sm text-slate-500">Aún no hay reportes generados.</p>
      ) : null}
    </div>
  );
}
