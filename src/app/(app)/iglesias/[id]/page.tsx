import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { registrarErrorFatal } from "@/lib/log-error";
import { FormularioEditarIglesia } from "./formulario";

export default async function PaginaDetalleIglesia({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: iglesia, error } = await supabase
    .from("iglesias")
    .select(
      "id, nombre, calle_numero, codigo_postal, google_maps_link, telefono_casa_pastoral, distrito_id, ministro_actual_id, colonia_id, pais_id, estado_id, ciudad_id, colonias(nombre), ciudades(nombre), estados(nombre), paises(nombre), distritos(numero, nombre)",
    )
    .eq("id", id)
    .maybeSingle();
  if (error) await registrarErrorFatal(error, { ruta: `/iglesias/${id}`, operacion: "cargar detalle de iglesia" });

  if (!iglesia) notFound();

  const [{ data: paises }, { data: distritos }, { data: ministros }] = await Promise.all(
    [
      supabase.from("paises").select("id, nombre").order("nombre"),
      supabase.from("distritos").select("id, numero, nombre").order("numero"),
      supabase
        .from("ministros")
        .select("id, personas(nombres, apellido_paterno)")
        .eq("iglesia_id", id),
    ],
  );

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">{iglesia.nombre}</h1>
        <p className="mt-1 text-sm text-slate-600">
          {iglesia.calle_numero}, {iglesia.colonias?.nombre}, C.P. {iglesia.codigo_postal}
          <br />
          {iglesia.ciudades?.nombre}, {iglesia.estados?.nombre}, {iglesia.paises?.nombre}
          <br />
          Distrito #{iglesia.distritos?.numero} {iglesia.distritos?.nombre}
        </p>
        <Link
          href={`/iglesias/${iglesia.id}/reportes`}
          className="mt-2 inline-block text-sm font-medium text-slate-700 underline"
        >
          Ver reportes comparativos de administración
        </Link>
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-slate-700">Editar información</h2>
        <FormularioEditarIglesia
          iglesia={iglesia}
          paises={paises ?? []}
          distritos={distritos ?? []}
          ministros={ministros ?? []}
        />
      </div>
    </div>
  );
}
