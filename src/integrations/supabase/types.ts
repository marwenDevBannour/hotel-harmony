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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      guests: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          id_number: string | null
          id_type: string | null
          last_name: string
          loyalty_points: number
          nationality: string | null
          notes: string | null
          phone: string
          total_stays: number
          updated_at: string
          vip: boolean
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          id_number?: string | null
          id_type?: string | null
          last_name: string
          loyalty_points?: number
          nationality?: string | null
          notes?: string | null
          phone: string
          total_stays?: number
          updated_at?: string
          vip?: boolean
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          id_number?: string | null
          id_type?: string | null
          last_name?: string
          loyalty_points?: number
          nationality?: string | null
          notes?: string | null
          phone?: string
          total_stays?: number
          updated_at?: string
          vip?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          first_name: string
          id: string
          last_name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reservations: {
        Row: {
          adults: number
          check_in: string
          check_out: string
          children: number
          created_at: string
          created_by: string | null
          guest_id: string
          id: string
          paid_amount: number
          reservation_number: string
          room_id: string
          source: Database["public"]["Enums"]["reservation_source"]
          special_requests: string | null
          status: Database["public"]["Enums"]["reservation_status"]
          total_amount: number
          updated_at: string
        }
        Insert: {
          adults?: number
          check_in: string
          check_out: string
          children?: number
          created_at?: string
          created_by?: string | null
          guest_id: string
          id?: string
          paid_amount?: number
          reservation_number: string
          room_id: string
          source?: Database["public"]["Enums"]["reservation_source"]
          special_requests?: string | null
          status?: Database["public"]["Enums"]["reservation_status"]
          total_amount?: number
          updated_at?: string
        }
        Update: {
          adults?: number
          check_in?: string
          check_out?: string
          children?: number
          created_at?: string
          created_by?: string | null
          guest_id?: string
          id?: string
          paid_amount?: number
          reservation_number?: string
          room_id?: string
          source?: Database["public"]["Enums"]["reservation_source"]
          special_requests?: string | null
          status?: Database["public"]["Enums"]["reservation_status"]
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservations_guest_id_fkey"
            columns: ["guest_id"]
            isOneToOne: false
            referencedRelation: "guests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservations_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          amenities: string[] | null
          capacity: number
          created_at: string
          description: string | null
          floor: number
          id: string
          number: string
          price_per_night: number
          status: Database["public"]["Enums"]["room_status"]
          type: Database["public"]["Enums"]["room_type"]
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string
          description?: string | null
          floor?: number
          id?: string
          number: string
          price_per_night?: number
          status?: Database["public"]["Enums"]["room_status"]
          type?: Database["public"]["Enums"]["room_type"]
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          capacity?: number
          created_at?: string
          description?: string | null
          floor?: number
          id?: string
          number?: string
          price_per_night?: number
          status?: Database["public"]["Enums"]["room_status"]
          type?: Database["public"]["Enums"]["room_type"]
          updated_at?: string
        }
        Relationships: []
      }
      staff_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["staff_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["staff_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["staff_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_staff_role: {
        Args: {
          _role: Database["public"]["Enums"]["staff_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      reservation_source: "direct" | "website" | "booking" | "expedia" | "phone"
      reservation_status:
        | "confirmed"
        | "pending"
        | "checked_in"
        | "checked_out"
        | "cancelled"
      room_status:
        | "available"
        | "occupied"
        | "cleaning"
        | "maintenance"
        | "reserved"
      room_type: "standard" | "superior" | "deluxe" | "suite" | "presidential"
      staff_role:
        | "admin"
        | "receptionist"
        | "housekeeping"
        | "restaurant"
        | "maintenance"
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
      reservation_source: ["direct", "website", "booking", "expedia", "phone"],
      reservation_status: [
        "confirmed",
        "pending",
        "checked_in",
        "checked_out",
        "cancelled",
      ],
      room_status: [
        "available",
        "occupied",
        "cleaning",
        "maintenance",
        "reserved",
      ],
      room_type: ["standard", "superior", "deluxe", "suite", "presidential"],
      staff_role: [
        "admin",
        "receptionist",
        "housekeeping",
        "restaurant",
        "maintenance",
      ],
    },
  },
} as const
