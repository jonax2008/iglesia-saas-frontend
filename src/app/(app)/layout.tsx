import { redirect } from "next/navigation";
import Link from "next/link";
import { obtenerUsuarioActual } from "@/lib/auth";
import { cerrarSesion } from "./actions";

const NAV_ADMIN = [
  { href: "/jurisdicciones", label: "Jurisdicciones" },
  { href: "/distritos", label: "Distritos" },
  { href: "/grados-ministros", label: "Grados de ministro" },
  { href: "/iglesias", label: "Iglesias" },
  { href: "/ministros", label: "Ministros" },
];

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

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <span className="text-base font-semibold text-slate-900">
          Estadística Iglesia
        </span>
        <form action={cerrarSesion}>
          <button
            type="submit"
            className="text-sm font-medium text-slate-600 underline"
          >
            Salir ({usuario.correo})
          </button>
        </form>
      </header>

      <div className="flex flex-1 flex-col md:flex-row">
        {esAdmin ? (
          <nav className="flex gap-2 overflow-x-auto border-b border-slate-200 bg-white px-4 py-2 md:w-56 md:flex-col md:border-b-0 md:border-r md:py-4">
            {NAV_ADMIN.map((item) => (
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
