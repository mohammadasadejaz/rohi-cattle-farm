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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      animal_cards: {
        Row: {
          category: string
          created_at: string
          cta_label: string
          description: string
          featured: boolean
          id: string
          image_url: string | null
          is_active: boolean
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          cta_label?: string
          description?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          cta_label?: string
          description?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          is_active?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      animals: {
        Row: {
          availability: string
          breed: string | null
          category: string
          created_at: string
          description: string | null
          featured: boolean
          gender: string
          id: string
          photos: string[]
          price: number | null
          purpose: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          availability?: string
          breed?: string | null
          category: string
          created_at?: string
          description?: string | null
          featured?: boolean
          gender?: string
          id?: string
          photos?: string[]
          price?: number | null
          purpose?: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          availability?: string
          breed?: string | null
          category?: string
          created_at?: string
          description?: string | null
          featured?: boolean
          gender?: string
          id?: string
          photos?: string[]
          price?: number | null
          purpose?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      breeds: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          caption: string | null
          category: string
          created_at: string
          featured: boolean
          id: string
          image_url: string
          is_active: boolean
          media_type: string
          sort_order: number
        }
        Insert: {
          caption?: string | null
          category?: string
          created_at?: string
          featured?: boolean
          id?: string
          image_url: string
          is_active?: boolean
          media_type?: string
          sort_order?: number
        }
        Update: {
          caption?: string | null
          category?: string
          created_at?: string
          featured?: boolean
          id?: string
          image_url?: string
          is_active?: boolean
          media_type?: string
          sort_order?: number
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          animal_type: string
          breed: string | null
          created_at: string
          delivery: string
          full_name: string
          id: string
          message: string | null
          phone: string
          purpose: string
          quantity: number
          status: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          animal_type: string
          breed?: string | null
          created_at?: string
          delivery?: string
          full_name: string
          id?: string
          message?: string | null
          phone: string
          purpose: string
          quantity?: number
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          animal_type?: string
          breed?: string | null
          created_at?: string
          delivery?: string
          full_name?: string
          id?: string
          message?: string | null
          phone?: string
          purpose?: string
          quantity?: number
          status?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          created_at: string
          cta_label: string | null
          description: string
          id: string
          image_url: string | null
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          cta_label?: string | null
          description?: string
          id?: string
          image_url?: string | null
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          cta_label?: string | null
          description?: string
          id?: string
          image_url?: string | null
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          about_description: string
          about_image_url: string | null
          about_title: string
          address: string
          animals_description: string
          animals_eyebrow: string
          animals_title: string
          contact_person: string
          email: string | null
          established_year: string
          facebook_url: string | null
          farm_name: string
          favicon_url: string | null
          hero_cta_primary: string
          hero_cta_secondary: string
          hero_description: string
          hero_heading: string
          hero_image_url: string | null
          id: string
          instagram_url: string | null
          location_description: string
          logo_url: string | null
          maps_url: string | null
          phone: string
          slogan: string
          updated_at: string
          whatsapp: string
        }
        Insert: {
          about_description?: string
          about_image_url?: string | null
          about_title?: string
          address?: string
          animals_description?: string
          animals_eyebrow?: string
          animals_title?: string
          contact_person?: string
          email?: string | null
          established_year?: string
          facebook_url?: string | null
          farm_name?: string
          favicon_url?: string | null
          hero_cta_primary?: string
          hero_cta_secondary?: string
          hero_description?: string
          hero_heading?: string
          hero_image_url?: string | null
          id?: string
          instagram_url?: string | null
          location_description?: string
          logo_url?: string | null
          maps_url?: string | null
          phone?: string
          slogan?: string
          updated_at?: string
          whatsapp?: string
        }
        Update: {
          about_description?: string
          about_image_url?: string | null
          about_title?: string
          address?: string
          animals_description?: string
          animals_eyebrow?: string
          animals_title?: string
          contact_person?: string
          email?: string | null
          established_year?: string
          facebook_url?: string | null
          farm_name?: string
          favicon_url?: string | null
          hero_cta_primary?: string
          hero_cta_secondary?: string
          hero_description?: string
          hero_heading?: string
          hero_image_url?: string | null
          id?: string
          instagram_url?: string | null
          location_description?: string
          logo_url?: string | null
          maps_url?: string | null
          phone?: string
          slogan?: string
          updated_at?: string
          whatsapp?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_exists: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin"
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
    Enums: {
      app_role: ["admin"],
    },
  },
} as const
