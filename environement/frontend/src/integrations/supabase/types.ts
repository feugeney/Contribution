export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      cotisations: {
        Row: {
          annee: number
          courrier_id: string | null
          created_at: string
          date_echeance: string | null
          date_paiement: string | null
          devise: string
          id: string
          montant_arrieres: number | null
          montant_attendu: number
          montant_paye: number | null
          organisation_id: string
          situation: string
          updated_at: string
        }
        Insert: {
          annee: number
          courrier_id?: string | null
          created_at?: string
          date_echeance?: string | null
          date_paiement?: string | null
          devise?: string
          id?: string
          montant_arrieres?: number | null
          montant_attendu: number
          montant_paye?: number | null
          organisation_id: string
          situation?: string
          updated_at?: string
        }
        Update: {
          annee?: number
          courrier_id?: string | null
          created_at?: string
          date_echeance?: string | null
          date_paiement?: string | null
          devise?: string
          id?: string
          montant_arrieres?: number | null
          montant_attendu?: number
          montant_paye?: number | null
          organisation_id?: string
          situation?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cotisations_courrier_id_fkey"
            columns: ["courrier_id"]
            isOneToOne: false
            referencedRelation: "courriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cotisations_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      courriers: {
        Row: {
          annee_cotisation: number
          created_at: string
          date_reception: string
          devise: string
          fichier_courrier_url: string | null
          id: string
          ministere_id: string
          montant_cotisation: number
          numero_courrier: string | null
          observations: string | null
          organisation_id: string
          statut: string
          updated_at: string
        }
        Insert: {
          annee_cotisation?: number
          created_at?: string
          date_reception?: string
          devise?: string
          fichier_courrier_url?: string | null
          id?: string
          ministere_id: string
          montant_cotisation: number
          numero_courrier?: string | null
          observations?: string | null
          organisation_id: string
          statut?: string
          updated_at?: string
        }
        Update: {
          annee_cotisation?: number
          created_at?: string
          date_reception?: string
          devise?: string
          fichier_courrier_url?: string | null
          id?: string
          ministere_id?: string
          montant_cotisation?: number
          numero_courrier?: string | null
          observations?: string | null
          organisation_id?: string
          statut?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "courriers_ministere_id_fkey"
            columns: ["ministere_id"]
            isOneToOne: false
            referencedRelation: "ministeres"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "courriers_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
        ]
      }
      ministeres: {
        Row: {
          created_at: string
          id: string
          nom: string
          sigle: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nom: string
          sigle?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nom?: string
          sigle?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      organisations: {
        Row: {
          created_at: string
          description: string | null
          devise_defaut: string | null
          id: string
          ministere_tutelle_id: string | null
          montant_cotisation_annuelle: number | null
          nom: string
          sigle: string | null
          type_organisation: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          devise_defaut?: string | null
          id?: string
          ministere_tutelle_id?: string | null
          montant_cotisation_annuelle?: number | null
          nom: string
          sigle?: string | null
          type_organisation?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          devise_defaut?: string | null
          id?: string
          ministere_tutelle_id?: string | null
          montant_cotisation_annuelle?: number | null
          nom?: string
          sigle?: string | null
          type_organisation?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organisations_ministere_tutelle_id_fkey"
            columns: ["ministere_tutelle_id"]
            isOneToOne: false
            referencedRelation: "ministeres"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
