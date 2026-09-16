"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Opcion = { id: string; nombre: string };

/**
 * Selects en cascada País → Estado → Ciudad para el lugar de nacimiento.
 * A diferencia del selector de direcciones de iglesia, no llega hasta
 * colonia ni permite crear catálogo nuevo (aquí solo se usa para ubicar,
 * no para una dirección postal).
 */
type ValorInicial = { paisId: string; estadoId: string; ciudadId: string };

export function SelectorLugarNacimiento({
  paises,
  valorInicial,
}: {
  paises: Opcion[];
  valorInicial?: ValorInicial;
}) {
  const supabase = createClient();

  const [paisId, setPaisId] = useState(valorInicial?.paisId ?? paises[0]?.id ?? "");
  const [estados, setEstados] = useState<Opcion[]>([]);
  const [estadoId, setEstadoId] = useState(valorInicial?.estadoId ?? "");
  const [ciudades, setCiudades] = useState<Opcion[]>([]);
  const [ciudadId, setCiudadId] = useState(valorInicial?.ciudadId ?? "");

  useEffect(() => {
    if (!paisId) return;
    supabase
      .from("estados")
      .select("id, nombre")
      .eq("pais_id", paisId)
      .order("nombre")
      .then(({ data }) => setEstados(data ?? []));
  }, [paisId, supabase]);

  useEffect(() => {
    if (!estadoId) return;
    supabase
      .from("ciudades")
      .select("id, nombre")
      .eq("estado_id", estadoId)
      .order("nombre")
      .then(({ data }) => setCiudades(data ?? []));
  }, [estadoId, supabase]);

  function seleccionarPais(id: string) {
    setPaisId(id);
    setEstados([]);
    setEstadoId("");
    setCiudades([]);
    setCiudadId("");
  }

  function seleccionarEstado(id: string) {
    setEstadoId(id);
    setCiudades([]);
    setCiudadId("");
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <Select label="País" value={paisId} onChange={seleccionarPais} opciones={paises} />
      <Select
        label="Estado"
        value={estadoId}
        onChange={seleccionarEstado}
        opciones={estados}
        disabled={!paisId}
      />
      <Select
        label="Ciudad/Municipio"
        value={ciudadId}
        onChange={setCiudadId}
        opciones={ciudades}
        disabled={!estadoId}
      />
      <input type="hidden" name="lugar_nacimiento_ciudad_id" value={ciudadId} />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  opciones,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  opciones: Opcion[];
  disabled?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base disabled:bg-slate-100"
      >
        <option value="">Selecciona…</option>
        {opciones.map((o) => (
          <option key={o.id} value={o.id}>
            {o.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}
