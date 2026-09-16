export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      ciudades: {
        Row: {
          estado_id: string
          id: string
          nombre: string
        }
        Insert: {
          estado_id: string
          id?: string
          nombre: string
        }
        Update: {
          estado_id?: string
          id?: string
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "ciudades_estado_id_fkey"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados"
            referencedColumns: ["id"]
          },
        ]
      }
      colonias: {
        Row: {
          ciudad_id: string
          codigo_postal: string
          id: string
          nombre: string
        }
        Insert: {
          ciudad_id: string
          codigo_postal: string
          id?: string
          nombre: string
        }
        Update: {
          ciudad_id?: string
          codigo_postal?: string
          id?: string
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "colonias_ciudad_id_fkey"
            columns: ["ciudad_id"]
            isOneToOne: false
            referencedRelation: "ciudades"
            referencedColumns: ["id"]
          },
        ]
      }
      comisiones: {
        Row: {
          id: string
          nombre: string
        }
        Insert: {
          id?: string
          nombre: string
        }
        Update: {
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      distritos: {
        Row: {
          id: string
          jurisdiccion_id: string
          nombre: string
          numero: number
        }
        Insert: {
          id?: string
          jurisdiccion_id: string
          nombre: string
          numero: number
        }
        Update: {
          id?: string
          jurisdiccion_id?: string
          nombre?: string
          numero?: number
        }
        Relationships: [
          {
            foreignKeyName: "distritos_jurisdiccion_id_fkey"
            columns: ["jurisdiccion_id"]
            isOneToOne: false
            referencedRelation: "jurisdicciones"
            referencedColumns: ["id"]
          },
        ]
      }
      estados: {
        Row: {
          id: string
          nombre: string
          pais_id: string
        }
        Insert: {
          id?: string
          nombre: string
          pais_id: string
        }
        Update: {
          id?: string
          nombre?: string
          pais_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "estados_pais_id_fkey"
            columns: ["pais_id"]
            isOneToOne: false
            referencedRelation: "paises"
            referencedColumns: ["id"]
          },
        ]
      }
      estados_civiles: {
        Row: {
          id: string
          nombre: string
        }
        Insert: {
          id?: string
          nombre: string
        }
        Update: {
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      familia_hijos: {
        Row: {
          familia_id: string
          miembro_id: string
        }
        Insert: {
          familia_id: string
          miembro_id: string
        }
        Update: {
          familia_id?: string
          miembro_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "familia_hijos_familia_id_fkey"
            columns: ["familia_id"]
            isOneToOne: false
            referencedRelation: "familias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "familia_hijos_miembro_id_fkey"
            columns: ["miembro_id"]
            isOneToOne: false
            referencedRelation: "miembros"
            referencedColumns: ["id"]
          },
        ]
      }
      familias: {
        Row: {
          creado_en: string
          id: string
          iglesia_id: string
          madre_miembro_id: string | null
          nombre: string
          padre_miembro_id: string | null
        }
        Insert: {
          creado_en?: string
          id?: string
          iglesia_id: string
          madre_miembro_id?: string | null
          nombre: string
          padre_miembro_id?: string | null
        }
        Update: {
          creado_en?: string
          id?: string
          iglesia_id?: string
          madre_miembro_id?: string | null
          nombre?: string
          padre_miembro_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "familias_iglesia_id_fkey"
            columns: ["iglesia_id"]
            isOneToOne: false
            referencedRelation: "iglesias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "familias_madre_miembro_id_fkey"
            columns: ["madre_miembro_id"]
            isOneToOne: false
            referencedRelation: "miembros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "familias_padre_miembro_id_fkey"
            columns: ["padre_miembro_id"]
            isOneToOne: false
            referencedRelation: "miembros"
            referencedColumns: ["id"]
          },
        ]
      }
      grados_ministros: {
        Row: {
          id: string
          nombre: string
        }
        Insert: {
          id?: string
          nombre: string
        }
        Update: {
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      grupo_auxiliares: {
        Row: {
          grupo_id: string
          miembro_id: string
        }
        Insert: {
          grupo_id: string
          miembro_id: string
        }
        Update: {
          grupo_id?: string
          miembro_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grupo_auxiliares_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grupo_auxiliares_miembro_id_fkey"
            columns: ["miembro_id"]
            isOneToOne: false
            referencedRelation: "miembros"
            referencedColumns: ["id"]
          },
        ]
      }
      grupos: {
        Row: {
          creado_en: string
          edad_final: number
          edad_inicial: number
          encargado_miembro_id: string | null
          id: string
          iglesia_id: string
          nombre: string
        }
        Insert: {
          creado_en?: string
          edad_final: number
          edad_inicial: number
          encargado_miembro_id?: string | null
          id?: string
          iglesia_id: string
          nombre: string
        }
        Update: {
          creado_en?: string
          edad_final?: number
          edad_inicial?: number
          encargado_miembro_id?: string | null
          id?: string
          iglesia_id?: string
          nombre?: string
        }
        Relationships: [
          {
            foreignKeyName: "grupos_encargado_miembro_id_fkey"
            columns: ["encargado_miembro_id"]
            isOneToOne: false
            referencedRelation: "miembros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grupos_iglesia_id_fkey"
            columns: ["iglesia_id"]
            isOneToOne: false
            referencedRelation: "iglesias"
            referencedColumns: ["id"]
          },
        ]
      }
      iglesias: {
        Row: {
          calle_numero: string
          ciudad_id: string
          codigo_postal: string
          colonia_id: string
          creado_en: string
          distrito_id: string
          estado_id: string
          google_maps_link: string | null
          id: string
          nombre: string
          pais_id: string
          telefono_casa_pastoral: string | null
        }
        Insert: {
          calle_numero: string
          ciudad_id: string
          codigo_postal: string
          colonia_id: string
          creado_en?: string
          distrito_id: string
          estado_id: string
          google_maps_link?: string | null
          id?: string
          nombre: string
          pais_id: string
          telefono_casa_pastoral?: string | null
        }
        Update: {
          calle_numero?: string
          ciudad_id?: string
          codigo_postal?: string
          colonia_id?: string
          creado_en?: string
          distrito_id?: string
          estado_id?: string
          google_maps_link?: string | null
          id?: string
          nombre?: string
          pais_id?: string
          telefono_casa_pastoral?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "iglesias_ciudad_id_fkey"
            columns: ["ciudad_id"]
            isOneToOne: false
            referencedRelation: "ciudades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iglesias_colonia_id_fkey"
            columns: ["colonia_id"]
            isOneToOne: false
            referencedRelation: "colonias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iglesias_distrito_id_fkey"
            columns: ["distrito_id"]
            isOneToOne: false
            referencedRelation: "distritos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iglesias_estado_id_fkey"
            columns: ["estado_id"]
            isOneToOne: false
            referencedRelation: "estados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iglesias_pais_id_fkey"
            columns: ["pais_id"]
            isOneToOne: false
            referencedRelation: "paises"
            referencedColumns: ["id"]
          },
        ]
      }
      jurisdicciones: {
        Row: {
          id: string
          nombre: string
        }
        Insert: {
          id?: string
          nombre: string
        }
        Update: {
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      miembro_comisiones: {
        Row: {
          comision_id: string
          miembro_id: string
        }
        Insert: {
          comision_id: string
          miembro_id: string
        }
        Update: {
          comision_id?: string
          miembro_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "miembro_comisiones_comision_id_fkey"
            columns: ["comision_id"]
            isOneToOne: false
            referencedRelation: "comisiones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "miembro_comisiones_miembro_id_fkey"
            columns: ["miembro_id"]
            isOneToOne: false
            referencedRelation: "miembros"
            referencedColumns: ["id"]
          },
        ]
      }
      miembros: {
        Row: {
          categoria: string
          correo_personal: string | null
          creado_en: string
          credencial_vigente_hasta: string | null
          estado_civil_id: string | null
          fecha_bautismo: string
          fecha_espiritu_santo: string
          grupo_id: string
          id: string
          iglesia_id: string
          lugar_bautismo: string | null
          lugar_nacimiento_ciudad_id: string | null
          lugar_nacimiento_estado_id: string | null
          lugar_nacimiento_pais_id: string | null
          ministro_bautizo_id: string | null
          ministro_testifico_id: string | null
          nivel_estudios_id: string | null
          persona_id: string
          profesion_ocupacion_id: string | null
        }
        Insert: {
          categoria?: string
          correo_personal?: string | null
          creado_en?: string
          credencial_vigente_hasta?: string | null
          estado_civil_id?: string | null
          fecha_bautismo: string
          fecha_espiritu_santo: string
          grupo_id: string
          id?: string
          iglesia_id: string
          lugar_bautismo?: string | null
          lugar_nacimiento_ciudad_id?: string | null
          lugar_nacimiento_estado_id?: string | null
          lugar_nacimiento_pais_id?: string | null
          ministro_bautizo_id?: string | null
          ministro_testifico_id?: string | null
          nivel_estudios_id?: string | null
          persona_id: string
          profesion_ocupacion_id?: string | null
        }
        Update: {
          categoria?: string
          correo_personal?: string | null
          creado_en?: string
          credencial_vigente_hasta?: string | null
          estado_civil_id?: string | null
          fecha_bautismo?: string
          fecha_espiritu_santo?: string
          grupo_id?: string
          id?: string
          iglesia_id?: string
          lugar_bautismo?: string | null
          lugar_nacimiento_ciudad_id?: string | null
          lugar_nacimiento_estado_id?: string | null
          lugar_nacimiento_pais_id?: string | null
          ministro_bautizo_id?: string | null
          ministro_testifico_id?: string | null
          nivel_estudios_id?: string | null
          persona_id?: string
          profesion_ocupacion_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "miembros_estado_civil_id_fkey"
            columns: ["estado_civil_id"]
            isOneToOne: false
            referencedRelation: "estados_civiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "miembros_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "miembros_iglesia_id_fkey"
            columns: ["iglesia_id"]
            isOneToOne: false
            referencedRelation: "iglesias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "miembros_lugar_nacimiento_ciudad_id_fkey"
            columns: ["lugar_nacimiento_ciudad_id"]
            isOneToOne: false
            referencedRelation: "ciudades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "miembros_lugar_nacimiento_estado_id_fkey"
            columns: ["lugar_nacimiento_estado_id"]
            isOneToOne: false
            referencedRelation: "estados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "miembros_lugar_nacimiento_pais_id_fkey"
            columns: ["lugar_nacimiento_pais_id"]
            isOneToOne: false
            referencedRelation: "paises"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "miembros_ministro_bautizo_id_fkey"
            columns: ["ministro_bautizo_id"]
            isOneToOne: false
            referencedRelation: "ministros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "miembros_ministro_testifico_id_fkey"
            columns: ["ministro_testifico_id"]
            isOneToOne: false
            referencedRelation: "ministros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "miembros_nivel_estudios_id_fkey"
            columns: ["nivel_estudios_id"]
            isOneToOne: false
            referencedRelation: "niveles_estudio"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "miembros_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: true
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "miembros_profesion_ocupacion_id_fkey"
            columns: ["profesion_ocupacion_id"]
            isOneToOne: false
            referencedRelation: "profesiones_ocupaciones"
            referencedColumns: ["id"]
          },
        ]
      }
      ministros: {
        Row: {
          correo_institucional: string
          creado_en: string
          distrito_a_cargo_id: string | null
          es_pastor_distrital: boolean
          es_pastor_jurisdiccional: boolean
          fecha_fin_administracion: string | null
          fecha_inicio_administracion: string
          grado_id: string
          id: string
          iglesia_id: string
          jurisdiccion_a_cargo_id: string | null
          persona_id: string
        }
        Insert: {
          correo_institucional: string
          creado_en?: string
          distrito_a_cargo_id?: string | null
          es_pastor_distrital?: boolean
          es_pastor_jurisdiccional?: boolean
          fecha_fin_administracion?: string | null
          fecha_inicio_administracion: string
          grado_id: string
          id?: string
          iglesia_id: string
          jurisdiccion_a_cargo_id?: string | null
          persona_id: string
        }
        Update: {
          correo_institucional?: string
          creado_en?: string
          distrito_a_cargo_id?: string | null
          es_pastor_distrital?: boolean
          es_pastor_jurisdiccional?: boolean
          fecha_fin_administracion?: string | null
          fecha_inicio_administracion?: string
          grado_id?: string
          id?: string
          iglesia_id?: string
          jurisdiccion_a_cargo_id?: string | null
          persona_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ministros_distrito_a_cargo_id_fkey"
            columns: ["distrito_a_cargo_id"]
            isOneToOne: false
            referencedRelation: "distritos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ministros_grado_id_fkey"
            columns: ["grado_id"]
            isOneToOne: false
            referencedRelation: "grados_ministros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ministros_iglesia_id_fkey"
            columns: ["iglesia_id"]
            isOneToOne: false
            referencedRelation: "iglesias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ministros_jurisdiccion_a_cargo_id_fkey"
            columns: ["jurisdiccion_a_cargo_id"]
            isOneToOne: false
            referencedRelation: "jurisdicciones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ministros_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
        ]
      }
      niveles_estudio: {
        Row: {
          id: string
          nombre: string
        }
        Insert: {
          id?: string
          nombre: string
        }
        Update: {
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      paises: {
        Row: {
          id: string
          nombre: string
        }
        Insert: {
          id?: string
          nombre: string
        }
        Update: {
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      personas: {
        Row: {
          apellido_materno: string | null
          apellido_paterno: string
          creado_en: string
          curp: string | null
          fecha_nacimiento: string
          foto_perfil_url: string | null
          id: string
          nombres: string
          sexo: string
          telefono_celular: string | null
        }
        Insert: {
          apellido_materno?: string | null
          apellido_paterno: string
          creado_en?: string
          curp?: string | null
          fecha_nacimiento: string
          foto_perfil_url?: string | null
          id?: string
          nombres: string
          sexo: string
          telefono_celular?: string | null
        }
        Update: {
          apellido_materno?: string | null
          apellido_paterno?: string
          creado_en?: string
          curp?: string | null
          fecha_nacimiento?: string
          foto_perfil_url?: string | null
          id?: string
          nombres?: string
          sexo?: string
          telefono_celular?: string | null
        }
        Relationships: []
      }
      profesiones_ocupaciones: {
        Row: {
          id: string
          nombre: string
        }
        Insert: {
          id?: string
          nombre: string
        }
        Update: {
          id?: string
          nombre?: string
        }
        Relationships: []
      }
      roles: {
        Row: {
          id: number
          nombre: string
        }
        Insert: {
          id: number
          nombre: string
        }
        Update: {
          id?: number
          nombre?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          correo: string
          creado_en: string
          estatus: string
          id: string
          iglesia_id: string | null
          persona_id: string | null
          rol_id: number
        }
        Insert: {
          correo: string
          creado_en?: string
          estatus?: string
          id: string
          iglesia_id?: string | null
          persona_id?: string | null
          rol_id: number
        }
        Update: {
          correo?: string
          creado_en?: string
          estatus?: string
          id?: string
          iglesia_id?: string | null
          persona_id?: string | null
          rol_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "usuarios_iglesia_id_fkey"
            columns: ["iglesia_id"]
            isOneToOne: false
            referencedRelation: "iglesias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_persona_id_fkey"
            columns: ["persona_id"]
            isOneToOne: false
            referencedRelation: "personas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usuarios_rol_id_fkey"
            columns: ["rol_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      contar_grupos_liderados: {
        Args: { p_miembro_id: string }
        Returns: number
      }
      crear_miembro: {
        Args: {
          p_apellido_materno?: string
          p_apellido_paterno: string
          p_comision_ids?: string[]
          p_correo_personal?: string
          p_credencial_vigente_hasta?: string
          p_curp?: string
          p_estado_civil_id?: string
          p_fecha_bautismo?: string
          p_fecha_espiritu_santo?: string
          p_fecha_nacimiento?: string
          p_grupo_id?: string
          p_iglesia_id?: string
          p_lugar_bautismo?: string
          p_lugar_nacimiento_ciudad_id?: string
          p_ministro_bautizo_id?: string
          p_ministro_testifico_id?: string
          p_nivel_estudios_id?: string
          p_nombres: string
          p_profesion_ocupacion_id?: string
          p_sexo?: string
          p_telefono_celular?: string
        }
        Returns: string
      }
      crear_ministro: {
        Args: {
          p_apellido_materno?: string
          p_apellido_paterno: string
          p_correo_institucional?: string
          p_curp?: string
          p_distrito_a_cargo_id?: string
          p_es_pastor_distrital?: boolean
          p_es_pastor_jurisdiccional?: boolean
          p_fecha_inicio_administracion?: string
          p_fecha_nacimiento?: string
          p_grado_id?: string
          p_iglesia_id?: string
          p_jurisdiccion_a_cargo_id?: string
          p_nombres: string
          p_sexo?: string
          p_telefono_celular?: string
        }
        Returns: string
      }
      es_encargado_de_grupo: { Args: { p_grupo_id: string }; Returns: boolean }
      iglesia_actual: { Args: never; Returns: string }
      miembro_actual: { Args: never; Returns: string }
      rol_actual: { Args: never; Returns: string }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
