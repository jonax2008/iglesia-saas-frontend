"use client";

import { useActionState, useState } from "react";
import { datosDesdeCurp } from "@/lib/curp";
import { crearMiembro } from "./actions";
import { SelectorLugarNacimiento } from "./selector-lugar-nacimiento";

type Opcion = { id: string; nombre: string };
type Grupo = {
  id: string;
  nombre: string;
  edad_inicial: number;
  edad_final: number;
  iglesias: { nombre: string } | null;
};
type Ministro = {
  id: string;
  personas: { nombres: string; apellido_paterno: string } | null;
};

export function FormularioNuevoMiembro({
  paises,
  iglesias,
  grupos,
  ministros,
  nivelesEstudio,
  estadosCiviles,
  profesiones,
  comisiones,
}: {
  paises: Opcion[];
  iglesias: Opcion[];
  grupos: Grupo[];
  ministros: Ministro[];
  nivelesEstudio: Opcion[];
  estadosCiviles: Opcion[];
  profesiones: Opcion[];
  comisiones: Opcion[];
}) {
  const [estado, accion, enProceso] = useActionState(crearMiembro, { error: "" });
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [sexo, setSexo] = useState("");

  function onCurpChange(valor: string) {
    const datos = datosDesdeCurp(valor);
    if (datos) {
      setFechaNacimiento(datos.fechaNacimiento);
      setSexo(datos.sexo);
    }
  }

  return (
    <form action={accion} className="max-w-xl space-y-4">
      <fieldset className="space-y-4 rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-700">
          Datos personales
        </legend>

        <Campo label="Nombre(s)" name="nombres" required />
        <Campo label="Apellido paterno" name="apellido_paterno" required />
        <Campo label="Apellido materno" name="apellido_materno" />

        <div className="space-y-1">
          <label htmlFor="curp" className="text-sm font-medium text-slate-700">
            CURP
          </label>
          <input
            id="curp"
            name="curp"
            onChange={(e) => onCurpChange(e.target.value)}
            maxLength={18}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base uppercase"
          />
          <p className="text-xs text-slate-500">
            Si el CURP es válido, se autocompletan fecha de nacimiento y sexo (puedes
            corregirlos si hace falta).
          </p>
        </div>

        <div className="space-y-1">
          <label htmlFor="fecha_nacimiento" className="text-sm font-medium text-slate-700">
            Fecha de nacimiento
          </label>
          <input
            id="fecha_nacimiento"
            name="fecha_nacimiento"
            type="date"
            required
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Sexo</label>
          <select
            name="sexo"
            required
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          >
            <option value="">Selecciona…</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>

        <Campo label="Teléfono celular" name="telefono_celular" type="tel" />
        <Campo label="Correo electrónico personal" name="correo_personal" type="email" />

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Lugar de nacimiento</label>
          <SelectorLugarNacimiento paises={paises} />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Nivel de estudios</label>
          <select
            name="nivel_estudios_id"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          >
            <option value="">Selecciona…</option>
            {nivelesEstudio.map((n) => (
              <option key={n.id} value={n.id}>
                {n.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">
            Profesión u ocupación
          </label>
          <select
            name="profesion_ocupacion_id"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          >
            <option value="">Selecciona…</option>
            {profesiones.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Estado civil</label>
          <select
            name="estado_civil_id"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          >
            <option value="">Selecciona…</option>
            {estadosCiviles.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-700">
          Iglesia y grupo
        </legend>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Iglesia</label>
          <select
            name="iglesia_id"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          >
            <option value="">Selecciona…</option>
            {iglesias.map((i) => (
              <option key={i.id} value={i.id}>
                {i.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Grupo</label>
          <select
            name="grupo_id"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          >
            <option value="">Selecciona…</option>
            {grupos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.iglesias?.nombre} — {g.nombre} ({g.edad_inicial}-{g.edad_final} años)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Comisiones</label>
          <div className="space-y-1 rounded-lg border border-slate-200 p-3">
            {comisiones.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm text-slate-700">
                <input type="checkbox" name="comision_ids" value={c.id} />
                {c.nombre}
              </label>
            ))}
            {!comisiones.length ? (
              <p className="text-sm text-slate-500">Aún no hay comisiones registradas.</p>
            ) : null}
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-4 rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-700">
          Bautismo y espíritu santo
        </legend>

        <Campo label="Fecha de bautismo" name="fecha_bautismo" type="date" required />
        <Campo label="Lugar de bautismo" name="lugar_bautismo" />

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Ministro que bautizó</label>
          <select
            name="ministro_bautizo_id"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          >
            <option value="">Selecciona…</option>
            {ministros.map((m) => (
              <option key={m.id} value={m.id}>
                {m.personas?.nombres} {m.personas?.apellido_paterno}
              </option>
            ))}
          </select>
        </div>

        <Campo
          label="Fecha en que recibió el Espíritu Santo"
          name="fecha_espiritu_santo"
          type="date"
          required
        />

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Ministro que testificó</label>
          <select
            name="ministro_testifico_id"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          >
            <option value="">Selecciona…</option>
            {ministros.map((m) => (
              <option key={m.id} value={m.id}>
                {m.personas?.nombres} {m.personas?.apellido_paterno}
              </option>
            ))}
          </select>
        </div>

        <Campo
          label="Credencial vigente hasta"
          name="credencial_vigente_hasta"
          type="date"
        />
      </fieldset>

      {estado?.error ? <p className="text-sm text-red-600">{estado.error}</p> : null}

      <button
        type="submit"
        disabled={enProceso}
        className="w-full rounded-lg bg-slate-900 px-4 py-2 text-base font-medium text-white disabled:opacity-50 sm:w-auto"
      >
        {enProceso ? "Guardando…" : "Guardar miembro"}
      </button>
    </form>
  );
}

function Campo({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
      />
    </div>
  );
}
