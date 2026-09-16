"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Opcion = { id: string; nombre: string };

/**
 * Selects en cascada País → Estado → Ciudad → Colonia. Permite crear una
 * colonia nueva sobre la marcha (no hay un seed nacional tipo SEPOMEX; el
 * catálogo crece según se van registrando direcciones reales).
 * Expone el colonia_id elegido en un input oculto llamado "colonia_id".
 */
export function SelectorGeografico({ paises }: { paises: Opcion[] }) {
  const supabase = createClient();

  const [paisId, setPaisId] = useState(paises[0]?.id ?? "");
  const [estados, setEstados] = useState<Opcion[]>([]);
  const [estadoId, setEstadoId] = useState("");
  const [ciudades, setCiudades] = useState<Opcion[]>([]);
  const [ciudadId, setCiudadId] = useState("");
  const [colonias, setColonias] = useState<Opcion[]>([]);
  const [coloniaId, setColoniaId] = useState("");
  const [nuevaColonia, setNuevaColonia] = useState({ nombre: "", codigoPostal: "" });
  const [creandoColonia, setCreandoColonia] = useState(false);
  const [errorColonia, setErrorColonia] = useState("");

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

  useEffect(() => {
    if (!ciudadId) return;
    supabase
      .from("colonias")
      .select("id, nombre")
      .eq("ciudad_id", ciudadId)
      .order("nombre")
      .then(({ data }) => setColonias(data ?? []));
  }, [ciudadId, supabase]);

  function seleccionarPais(id: string) {
    setPaisId(id);
    setEstados([]);
    setEstadoId("");
    setCiudades([]);
    setCiudadId("");
    setColonias([]);
    setColoniaId("");
  }

  function seleccionarEstado(id: string) {
    setEstadoId(id);
    setCiudades([]);
    setCiudadId("");
    setColonias([]);
    setColoniaId("");
  }

  function seleccionarCiudad(id: string) {
    setCiudadId(id);
    setColonias([]);
    setColoniaId("");
  }

  async function agregarColonia() {
    setErrorColonia("");
    if (!nuevaColonia.nombre.trim() || !nuevaColonia.codigoPostal.trim()) {
      setErrorColonia("Nombre y código postal son obligatorios.");
      return;
    }
    setCreandoColonia(true);
    const { data, error } = await supabase
      .from("colonias")
      .insert({
        nombre: nuevaColonia.nombre.trim(),
        codigo_postal: nuevaColonia.codigoPostal.trim(),
        ciudad_id: ciudadId,
      })
      .select("id, nombre")
      .single();
    setCreandoColonia(false);

    if (error || !data) {
      setErrorColonia(error?.message ?? "No se pudo crear la colonia.");
      return;
    }
    setColonias((prev) => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    setColoniaId(data.id);
    setNuevaColonia({ nombre: "", codigoPostal: "" });
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
          onChange={seleccionarCiudad}
          opciones={ciudades}
          disabled={!estadoId}
        />
        <Select
          label="Colonia"
          value={coloniaId}
          onChange={setColoniaId}
          opciones={colonias}
          disabled={!ciudadId}
        />
      </div>

      {ciudadId ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-3">
          <p className="mb-2 text-sm font-medium text-slate-700">
            ¿La colonia no está en la lista? Agrégala:
          </p>
          <div className="flex flex-wrap items-end gap-2">
            <input
              placeholder="Nombre de la colonia"
              value={nuevaColonia.nombre}
              onChange={(e) =>
                setNuevaColonia((prev) => ({ ...prev, nombre: e.target.value }))
              }
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base"
            />
            <input
              placeholder="Código postal"
              value={nuevaColonia.codigoPostal}
              onChange={(e) =>
                setNuevaColonia((prev) => ({ ...prev, codigoPostal: e.target.value }))
              }
              className="w-32 rounded-lg border border-slate-300 px-3 py-2 text-base"
            />
            <button
              type="button"
              onClick={agregarColonia}
              disabled={creandoColonia}
              className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              Agregar colonia
            </button>
          </div>
          {errorColonia ? (
            <p className="mt-1 text-sm text-red-600">{errorColonia}</p>
          ) : null}
        </div>
      ) : null}

      <input type="hidden" name="colonia_id" value={coloniaId} />
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
