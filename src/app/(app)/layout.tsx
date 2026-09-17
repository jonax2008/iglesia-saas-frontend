import { redirect } from "next/navigation";
import Link from "next/link";
import { obtenerUsuarioActual } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { cerrarSesion } from "./actions";

const NAV_ADMIN = [
  { href: "/jurisdicciones", label: "Jurisdicciones" },
  { href: "/distritos", label: "Distritos" },
  { href: "/grados-ministros", label: "Grados de ministro" },
  { href: "/iglesias", label: "Iglesias" },
  { href: "/ministros", label: "Ministros" },
  { href: "/grupos", label: "Grupos" },
  { href: "/miembros", label: "Miembros" },
  { href: "/familias", label: "Familias" },
  { href: "/comisiones", label: "Comisiones" },
  { href: "/niveles-estudio", label: "Niveles de estudio" },
  { href: "/estados-civiles", label: "Estado civil" },
  { href: "/profesiones-ocupaciones", label: "Profesiones/ocupaciones" },
];

const NAV_ENCARGADO_GRUPO = [{ href: "/grupos", label: "Grupos" }];

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = await obtenerUsuarioActual();

  if (!usuario) {
    redirect("/login");
  }

  const esAdmin = ["super_admin", "ministro_en_turno", "encargado_estadistica"].includes(
    usuario.rol,
  );
  const esEncargadoGrupo = ["encargado_grupo", "auxiliar_grupo"].includes(usuario.rol);
  const itemsNav = esAdmin ? NAV_ADMIN : esEncargadoGrupo ? NAV_ENCARGADO_GRUPO : [];

  const supabase = await createClient();
  const { count: noLeidas } = await supabase
    .from("notificaciones")
    .select("id", { count: "exact", head: true })
    .eq("usuario_id", usuario.id)
    .eq("leida", false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <span className="text-base font-semibold text-slate-900">
          Estadística Iglesia
        </span>
        <div className="flex items-center gap-4">
          <Link href="/notificaciones" className="relative text-sm font-medium text-slate-600">
            Notificaciones
            {noLeidas ? (
              <span className="absolute -right-3 -top-2 rounded-full bg-red-600 px-1.5 py-0.5 text-xs font-semibold text-white">
                {noLeidas}
              </span>
            ) : null}
          </Link>
          <form action={cerrarSesion}>
            <button
              type="submit"
              className="text-sm font-medium text-slate-600 underline"
            >
              Salir ({usuario.correo})
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {itemsNav.length ? (
          <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 md:w-56 md:flex-col md:border-b-0 md:border-r md:py-4">
            {itemsNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}

        <main className="flex-1 p-4">{children}</main>
      </div>
    </div>
  );
}
