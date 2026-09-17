import { createClient } from "@/lib/supabase/server";
import { marcarLeida, marcarTodasLeidas } from "./actions";

export default async function PaginaNotificaciones() {
  const supabase = await createClient();
  const { data: notificaciones } = await supabase
    .from("notificaciones")
    .select("id, mensaje, leida, creado_en")
    .order("creado_en", { ascending: false });

  const hayNoLeidas = (notificaciones ?? []).some((n) => !n.leida);

  return (
    <div className="max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-900">Notificaciones</h1>
        {hayNoLeidas ? (
          <form action={marcarTodasLeidas}>
            <button type="submit" className="text-sm font-medium text-slate-600 underline">
              Marcar todas como leídas
            </button>
          </form>
        ) : null}
      </div>

      <ul className="divide-y divide-slate-200 rounded-lg bg-white shadow-sm">
        {notificaciones?.map((n) => (
          <li
            key={n.id}
            className={`flex items-start justify-between gap-3 px-4 py-3 ${
              n.leida ? "" : "bg-amber-50"
            }`}
          >
            <div>
              <p className="text-sm text-slate-900">{n.mensaje}</p>
              <p className="text-xs text-slate-500">
                {new Date(n.creado_en).toLocaleString("es-MX")}
              </p>
            </div>
            {!n.leida ? (
              <form action={marcarLeida}>
                <input type="hidden" name="id" value={n.id} />
                <button
                  type="submit"
                  className="shrink-0 text-sm font-medium text-slate-600 underline"
                >
                  Marcar leída
                </button>
              </form>
            ) : null}
          </li>
        ))}
        {!notificaciones?.length ? (
          <li className="px-4 py-3 text-sm text-slate-500">No tienes notificaciones.</li>
        ) : null}
      </ul>
    </div>
  );
}
