"use client";

import { useActionState, useState } from "react";
import { datosDesdeCurp } from "@/lib/curp";
import { actualizarMinistro } from "./actions";

type Opcion = { id: string; nombre: string };
type Distrito = { id: string; numero: number; nombre: string };

export function FormularioEditarMinistro({
  ministro,
  grados,
  distritos,
  jurisdicciones,
}: {
  ministro: {
    id: string;
    persona_id: string;
    correo_institucional: string;
    fecha_inicio_administracion: string;
    fecha_fin_administracion: string | null;
    grado_id: string;
    es_pastor_distrital: boolean;
    distrito_a_cargo_id: string | null;
    es_pastor_jurisdiccional: boolean;
    jurisdiccion_a_cargo_id: string | null;
    personas: {
      nombres: string;
      apellido_paterno: string;
      apellido_materno: string | null;
      fecha_nacimiento: string;
      sexo: string;
      telefono_celular: string | null;
      curp: string | null;
    } | null;
  };
  grados: Opcion[];
  distritos: Distrito[];
  jurisdicciones: Opcion[];
}) {
  const [estado, accion, enProceso] = useActionState(actualizarMinistro, {
    error: "",
  });
  const [esPastorDistrital, setEsPastorDistrital] = useState(
    ministro.es_pastor_distrital,
  );
  const [esPastorJurisdiccional, setEsPastorJurisdiccional] = useState(
    ministro.es_pastor_jurisdiccional,
  );
  const [fechaNacimiento, setFechaNacimiento] = useState(
    ministro.personas?.fecha_nacimiento ?? "",
  );
  const [sexo, setSexo] = useState(ministro.personas?.sexo ?? "");

  function onCurpChange(valor: string) {
    const datos = datosDesdeCurp(valor);
    if (datos) {
      setFechaNacimiento(datos.fechaNacimiento);
      setSexo(datos.sexo);
    }
  }

  return (
    <form action={accion} className="max-w-xl space-y-4">
      <input type="hidden" name="id" value={ministro.id} />
      <input type="hidden" name="persona_id" value={ministro.persona_id} />

      <fieldset className="space-y-4 rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-700">
          Datos personales
        </legend>

        <Campo label="Nombre(s)" name="nombres" required defaultValue={ministro.personas?.nombres} />
        <Campo
          label="Apellido paterno"
          name="apellido_paterno"
          required
          defaultValue={ministro.personas?.apellido_paterno}
        />
        <Campo
          label="Apellido materno"
          name="apellido_materno"
          defaultValue={ministro.personas?.apellido_materno ?? ""}
        />

        <div className="space-y-1">
          <label htmlFor="curp" className="text-sm font-medium text-slate-700">
            CURP
          </label>
          <input
            id="curp"
            name="curp"
            onChange={(e) => onCurpChange(e.target.value)}
            maxLength={18}
            defaultValue={ministro.personas?.curp ?? ""}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base uppercase"
          />
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

        <Campo
          label="Teléfono celular"
          name="telefono_celular"
          type="tel"
          defaultValue={ministro.personas?.telefono_celular ?? ""}
        />
      </fieldset>

      <fieldset className="space-y-4 rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-700">
          Datos de ministerio
        </legend>

        <Campo
          label="Correo institucional"
          name="correo_institucional"
          type="email"
          required
          defaultValue={ministro.correo_institucional}
        />
        <Campo
          label="Fecha de inicio de administración"
          name="fecha_inicio_administracion"
          type="date"
          required
          defaultValue={ministro.fecha_inicio_administracion}
        />
        <Campo
          label="Fecha de fin de administración"
          name="fecha_fin_administracion"
          type="date"
          defaultValue={ministro.fecha_fin_administracion ?? ""}
        />

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Grado</label>
          <select
            name="grado_id"
            required
            defaultValue={ministro.grado_id}
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
              defaultValue={ministro.distrito_a_cargo_id ?? ""}
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
              defaultValue={ministro.jurisdiccion_a_cargo_id ?? ""}
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
      {estado?.exito ? (
        <p className="text-sm text-green-700">Cambios guardados.</p>
      ) : null}

      <button
        type="submit"
        disabled={enProceso}
        className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-base font-medium text-white disabled:opacity-50 sm:w-auto"
      >
        {enProceso ? "Guardando…" : "Guardar cambios"}
      </button>
    </form>
  );
}

function Campo({
  label,
  name,
  type = "text",
  required,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
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
        defaultValue={defaultValue}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
      />
    </div>
  );
}
