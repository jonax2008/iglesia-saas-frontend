"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Opcion = { id: string; nombre: string };
type ColoniaOpcion = Opcion & { codigo_postal: string };

/**
 * Captura de dirección apoyada en el catálogo de SEPOMEX: el código
 * postal es la entrada principal — al escribirlo se precargan país,
 * estado y ciudad, y la lista de colonias se acota a ese CP. País,
 * estado y ciudad quedan como selects manuales de respaldo (por si el
 * CP no está en el catálogo, o para casos fuera de México a futuro).
 * Expone "colonia_id" y "codigo_postal" como inputs ocultos.
 */
type ValorInicial = {
  paisId: string;
  estadoId: string;
  ciudadId: string;
  coloniaId: string;
  codigoPostal: string;
};

export function SelectorGeografico({
  paises,
  valorInicial,
}: {
  paises: Opcion[];
  valorInicial?: ValorInicial;
}) {
  const supabase = createClient();

  const [codigoPostal, setCodigoPostal] = useState(valorInicial?.codigoPostal ?? "");
  const [cpNoEncontrado, setCpNoEncontrado] = useState(false);

  const [paisId, setPaisId] = useState(valorInicial?.paisId ?? paises[0]?.id ?? "");
  const [estados, setEstados] = useState<Opcion[]>([]);
  const [estadoId, setEstadoId] = useState(valorInicial?.estadoId ?? "");
  const [ciudades, setCiudades] = useState<Opcion[]>([]);
  const [ciudadId, setCiudadId] = useState(valorInicial?.ciudadId ?? "");
  const [colonias, setColonias] = useState<ColoniaOpcion[]>([]);
  const [coloniaId, setColoniaId] = useState(valorInicial?.coloniaId ?? "");
  const [nuevaColonia, setNuevaColonia] = useState({ nombre: "" });
  const [creandoColonia, setCreandoColonia] = useState(false);
  const [errorColonia, setErrorColonia] = useState("");

  // Código postal -> precarga país/estado/ciudad
  useEffect(() => {
    if (codigoPostal.length !== 5) return;
    supabase
      .from("colonias")
      .select("ciudad_id, ciudades(estado_id, estados(pais_id))")
      .eq("codigo_postal", codigoPostal)
      .limit(1)
      .then(({ data }) => {
        const fila = data?.[0];
        if (!fila) {
          setCpNoEncontrado(true);
          return;
        }
        setCpNoEncontrado(false);
        if (fila.ciudades?.estados?.pais_id) setPaisId(fila.ciudades.estados.pais_id);
        if (fila.ciudades?.estado_id) setEstadoId(fila.ciudades.estado_id);
        if (fila.ciudad_id) setCiudadId(fila.ciudad_id);
      });
  }, [codigoPostal, supabase]);

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

  // Colonias del municipio, acotadas al código postal cuando ya se conoce.
  useEffect(() => {
    if (!ciudadId) return;
    let consulta = supabase
      .from("colonias")
      .select("id, nombre, codigo_postal")
      .eq("ciudad_id", ciudadId)
      .order("nombre");
    if (codigoPostal.length === 5) {
      consulta = consulta.eq("codigo_postal", codigoPostal);
    }
    consulta.then(({ data }) => setColonias(data ?? []));
  }, [ciudadId, codigoPostal, supabase]);

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

  function seleccionarColonia(id: string) {
    setColoniaId(id);
    // Si el CP se dejó vacío y se llegó por la vía manual, se sincroniza
    // con el código postal real de la colonia elegida.
    const colonia = colonias.find((c) => c.id === id);
    if (colonia) setCodigoPostal(colonia.codigo_postal);
  }

  async function agregarColonia() {
    setErrorColonia("");
    if (!nuevaColonia.nombre.trim() || codigoPostal.length !== 5) {
      setErrorColonia("Nombre de colonia y código postal (5 dígitos) son obligatorios.");
      return;
    }
    if (!ciudadId) {
      setErrorColonia("Selecciona primero el estado y la ciudad/municipio.");
      return;
    }
    setCreandoColonia(true);
    const { data, error } = await supabase
      .from("colonias")
      .insert({
        nombre: nuevaColonia.nombre.trim(),
        codigo_postal: codigoPostal,
        ciudad_id: ciudadId,
      })
      .select("id, nombre, codigo_postal")
      .single();
    setCreandoColonia(false);

    if (error || !data) {
      setErrorColonia(error?.message ?? "No se pudo crear la colonia.");
      return;
    }
    setColonias((prev) => [...prev, data].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    setColoniaId(data.id);
    setNuevaColonia({ nombre: "" });
  }

  return (
    <div className="space-y-3">
      <div className="space-y-1">
        <label htmlFor="codigo_postal_buscar" className="text-sm font-medium text-slate-700">
          Código postal
        </label>
        <input
          id="codigo_postal_buscar"
          value={codigoPostal}
          onChange={(e) => {
            setCodigoPostal(e.target.value.replace(/\D/g, "").slice(0, 5));
            setCpNoEncontrado(false);
          }}
          inputMode="numeric"
          maxLength={5}
          placeholder="Ej. 91000"
          className="w-full max-w-[10rem] rounded-lg border border-slate-300 px-3 py-2 text-base"
        />
        {cpNoEncontrado ? (
          <p className="text-xs text-amber-700">
            Ese código postal no está en el catálogo. Selecciona país/estado/ciudad
            manualmente y agrega la colonia con el botón de abajo.
          </p>
        ) : (
          <p className="text-xs text-slate-500">
            Al escribirlo se precargan país, estado y ciudad, y la colonia se elige de
            la lista ya acotada a ese CP.
          </p>
        )}
      </div>

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
          onChange={seleccionarColonia}
          opciones={colonias}
          disabled={!ciudadId}
        />
      </div>

      {ciudadId ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-3">
          <p className="mb-2 text-sm font-medium text-slate-700">
            ¿La colonia no está en la lista? Agrégala (con el código postal de arriba):
          </p>
          <div className="flex flex-wrap items-end gap-2">
            <input
              placeholder="Nombre de la colonia"
              value={nuevaColonia.nombre}
              onChange={(e) => setNuevaColonia({ nombre: e.target.value })}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-base"
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
      <input type="hidden" name="codigo_postal" value={codigoPostal} />
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
