"use client";

import { useActionState, useState } from "react";
import { datosDesdeCurp } from "@/lib/curp";
import { SelectorLugarNacimiento } from "../selector-lugar-nacimiento";
import { actualizarMiembro } from "./actions";

type Opcion = { id: string; nombre: string };
type Grupo = {
  id: string;
  nombre: string;
  edad_inicial: number;
  edad_final: number;
  iglesias: { nombre: string } | null;
};

const CATEGORIAS = [
  { value: "activo", label: "Activo" },
  { value: "retirado_temporal", label: "Retirado temporal" },
  { value: "archivo", label: "En archivo" },
];

export function FormularioEditarMiembro({
  miembro,
  paises,
  grupos,
  nivelesEstudio,
  estadosCiviles,
  profesiones,
  comisiones,
  comisionesActuales,
}: {
  miembro: {
    id: string;
    persona_id: string;
    categoria: string;
    correo_personal: string | null;
    grupo_id: string;
    fecha_bautismo: string;
    lugar_bautismo: string | null;
    ministro_bautizo_nombre: string | null;
    fecha_espiritu_santo: string;
    ministro_testifico_nombre: string | null;
    nivel_estudios_id: string | null;
    profesion_ocupacion_id: string | null;
    estado_civil_id: string | null;
    credencial_vigente_hasta: string | null;
    lugar_nacimiento_pais_id: string | null;
    lugar_nacimiento_estado_id: string | null;
    lugar_nacimiento_ciudad_id: string | null;
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
  paises: Opcion[];
  grupos: Grupo[];
  nivelesEstudio: Opcion[];
  estadosCiviles: Opcion[];
  profesiones: Opcion[];
  comisiones: Opcion[];
  comisionesActuales: string[];
}) {
  const [estado, accion, enProceso] = useActionState(actualizarMiembro, {
    error: "",
  });
  const [fechaNacimiento, setFechaNacimiento] = useState(
    miembro.personas?.fecha_nacimiento ?? "",
  );
  const [sexo, setSexo] = useState(miembro.personas?.sexo ?? "");

  function onCurpChange(valor: string) {
    const datos = datosDesdeCurp(valor);
    if (datos) {
      setFechaNacimiento(datos.fechaNacimiento);
      setSexo(datos.sexo);
    }
  }

  return (
    <form action={accion} className="max-w-xl space-y-4">
      <input type="hidden" name="id" value={miembro.id} />
      <input type="hidden" name="persona_id" value={miembro.persona_id} />

      <fieldset className="space-y-4 rounded-lg border border-slate-200 p-4">
        <legend className="px-1 text-sm font-semibold text-slate-700">
          Datos personales
        </legend>

        <Campo label="Nombre(s)" name="nombres" required defaultValue={miembro.personas?.nombres} />
        <Campo
          label="Apellido paterno"
          name="apellido_paterno"
          required
          defaultValue={miembro.personas?.apellido_paterno}
        />
        <Campo
          label="Apellido materno"
          name="apellido_materno"
          defaultValue={miembro.personas?.apellido_materno ?? ""}
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
            defaultValue={miembro.personas?.curp ?? ""}
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
          defaultValue={miembro.personas?.telefono_celular ?? ""}
        />
        <Campo
          label="Correo electrónico personal"
          name="correo_personal"
          type="email"
          defaultValue={miembro.correo_personal ?? ""}
        />

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Lugar de nacimiento</label>
          <SelectorLugarNacimiento
            paises={paises}
            valorInicial={{
              paisId: miembro.lugar_nacimiento_pais_id ?? "",
              estadoId: miembro.lugar_nacimiento_estado_id ?? "",
              ciudadId: miembro.lugar_nacimiento_ciudad_id ?? "",
            }}
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Nivel de estudios</label>
          <select
            name="nivel_estudios_id"
            defaultValue={miembro.nivel_estudios_id ?? ""}
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
            defaultValue={miembro.profesion_ocupacion_id ?? ""}
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
            defaultValue={miembro.estado_civil_id ?? ""}
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
          <label className="text-sm font-medium text-slate-700">Grupo</label>
          <select
            name="grupo_id"
            required
            defaultValue={miembro.grupo_id}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          >
            {grupos.map((g) => (
              <option key={g.id} value={g.id}>
                {g.iglesias?.nombre} — {g.nombre} ({g.edad_inicial}-{g.edad_final} años)
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Categoría</label>
          <select
            name="categoria"
            required
            defaultValue={miembro.categoria}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-base"
          >
            {CATEGORIAS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-slate-700">Comisiones</label>
          <div className="space-y-1 rounded-lg border border-slate-200 p-3">
            {comisiones.map((c) => (
              <label key={c.id} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="comision_ids"
                  value={c.id}
                  defaultChecked={comisionesActuales.includes(c.id)}
                />
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

        <Campo
          label="Fecha de bautismo"
          name="fecha_bautismo"
          type="date"
          required
          defaultValue={miembro.fecha_bautismo}
        />
        <Campo
          label="Lugar de bautismo"
          name="lugar_bautismo"
          defaultValue={miembro.lugar_bautismo ?? ""}
        />
        <Campo
          label="Ministro que bautizó"
          name="ministro_bautizo_nombre"
          defaultValue={miembro.ministro_bautizo_nombre ?? ""}
        />

        <Campo
          label="Fecha en que recibió el Espíritu Santo"
          name="fecha_espiritu_santo"
          type="date"
          required
          defaultValue={miembro.fecha_espiritu_santo}
        />
        <Campo
          label="Ministro que testificó"
          name="ministro_testifico_nombre"
          defaultValue={miembro.ministro_testifico_nombre ?? ""}
        />
        <Campo
          label="Credencial vigente hasta"
          name="credencial_vigente_hasta"
          type="date"
          defaultValue={miembro.credencial_vigente_hasta ?? ""}
        />
      </fieldset>

      {estado?.error ? <p className="text-sm text-red-600">{estado.error}</p> : null}
      {estado?.exito ? (
        <p className="text-sm text-green-700">Cambios guardados.</p>
      ) : null}

      <button
        type="submit"
        disabled={enProceso}
        className="w-full rounded-lg bg-slate-900 px-4 py-2 text-base font-medium text-white disabled:opacity-50 sm:w-auto"
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
