"use client";

import { useActionState, useState } from "react";
import { crearMinistro } from "./actions";

type Opcion = { id: string; nombre: string };
type Distrito = { id: string; numero: number; nombre: string };

export function FormularioNuevoMinistro({
  iglesias,
  grados,
  distritos,
  jurisdicciones,
}: {
  iglesias: Opcion[];
  grados: Opcion[];
  distritos: Distrito[];
  jurisdicciones: Opcion[];
}) {
  const [estado, accion, enProceso] = useActionState(crearMinistro, { error: "" });
  const [esPastorDistrital, setEsPastorDistrital] = useState(false);
  const [esPastorJurisdiccional, setEsPastorJurisdiccional] = useState(false);

  return (
    <form action={accion} className="max-w-xl space-y-4">
      <fieldset className="space-y-4 rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-700">
          Datos personales
        </legend>

        <Campo label="Nombre(s)" name="nombres" required />
        <Campo label="Apellido paterno" name="apellido_paterno" required />
        <Campo label="Apellido materno" name="apellido_materno" />
        <Campo label="Fecha de nacimiento" name="fecha_nacimiento" type="date" required />

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Sexo</label>
          <select
            name="sexo"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          >
            <option value="">Selecciona…</option>
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
          </select>
        </div>

        <Campo label="Teléfono celular" name="telefono_celular" type="tel" />
        <Campo label="CURP" name="curp" />
      </fieldset>

      <fieldset className="space-y-4 rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-700">
          Datos de ministerio
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

        <Campo
          label="Correo institucional"
          name="correo_institucional"
          type="email"
          required
        />
        <Campo
          label="Fecha de inicio de administración"
          name="fecha_inicio_administracion"
          type="date"
          required
        />

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Grado</label>
          <select
            name="grado_id"
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          >
            <option value="">Selecciona…</option>
            {grados.map((g) => (
              <option key={g.id} value={g.id}>
                {g.nombre}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="es_pastor_distrital"
            checked={esPastorDistrital}
            onChange={(e) => setEsPastorDistrital(e.target.checked)}
          />
          Es pastor distrital
        </label>
        {esPastorDistrital ? (
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Distrito a cargo
            </label>
            <select
              name="distrito_a_cargo_id"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
            >
              <option value="">Selecciona…</option>
              {distritos.map((d) => (
                <option key={d.id} value={d.id}>
                  #{d.numero} — {d.nombre}
                </option>
              ))}
            </select>
          </div>
        ) : null}

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            name="es_pastor_jurisdiccional"
            checked={esPastorJurisdiccional}
            onChange={(e) => setEsPastorJurisdiccional(e.target.checked)}
          />
          Es pastor jurisdiccional
        </label>
        {esPastorJurisdiccional ? (
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Jurisdicción a cargo
            </label>
            <select
              name="jurisdiccion_a_cargo_id"
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
            >
              <option value="">Selecciona…</option>
              {jurisdicciones.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nombre}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </fieldset>

      {estado?.error ? <p className="text-sm text-red-600">{estado.error}</p> : null}

      <button
        type="submit"
        disabled={enProceso}
        className="w-full rounded-lg bg-slate-900 px-4 py-2 text-base font-medium text-white disabled:opacity-50 sm:w-auto"
      >
        {enProceso ? "Guardando…" : "Guardar ministro"}
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
