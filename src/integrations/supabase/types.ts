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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          board: string
          city: string
          content: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          board: string
          city: string
          content: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          board?: string
          city?: string
          content?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      dm_members: {
        Row: {
          thread_id: string
          user_id: string
        }
        Insert: {
          thread_id: string
          user_id: string
        }
        Update: {
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dm_members_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "dm_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      dm_messages: {
        Row: {
          body: string
          created_at: string | null
          id: string
          sender_id: string | null
          thread_id: string | null
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          sender_id?: string | null
          thread_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          sender_id?: string | null
          thread_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dm_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "dm_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      dm_threads: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number | null
          created_at: string | null
          currency: string | null
          id: string
          provider: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          provider?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          provider?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_boards: {
        Row: {
          id: string
          name: string
          slug: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          topic_id: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          topic_id?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_topics: {
        Row: {
          author_id: string | null
          board_id: string | null
          created_at: string | null
          id: string
          title: string
        }
        Insert: {
          author_id?: string | null
          board_id?: string | null
          created_at?: string | null
          id?: string
          title: string
        }
        Update: {
          author_id?: string | null
          board_id?: string | null
          created_at?: string | null
          id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_topics_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_topics_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "forum_boards"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_contacts: {
        Row: {
          contact_method: string | null
          contact_value: string | null
          created_at: string
          id: string
          listing_id: string
        }
        Insert: {
          contact_method?: string | null
          contact_value?: string | null
          created_at?: string
          id?: string
          listing_id: string
        }
        Update: {
          contact_method?: string | null
          contact_value?: string | null
          created_at?: string
          id?: string
          listing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_contacts_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: true
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_views: {
        Row: {
          id: string
          listing_id: string
          user_id: string
          viewed_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          user_id: string
          viewed_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          user_id?: string
          viewed_at?: string
        }
        Relationships: []
      }
      listings: {
        Row: {
          category: string | null
          city: string
          contact_hidden: boolean | null
          country: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          images: string[] | null
          is_featured: boolean | null
          location_lat: number | null
          location_lng: number | null
          price_cents: number | null
          status: string | null
          street_address: string | null
          subcategory: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string | null
          views: number | null
          website_url: string | null
        }
        Insert: {
          category?: string | null
          city: string
          contact_hidden?: boolean | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          price_cents?: number | null
          status?: string | null
          street_address?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          views?: number | null
          website_url?: string | null
        }
        Update: {
          category?: string | null
          city?: string
          contact_hidden?: boolean | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          price_cents?: number | null
          status?: string | null
          street_address?: string | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          views?: number | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      match_answers: {
        Row: {
          choice_index: number
          created_at: string | null
          importance: number | null
          question_id: number
          user_id: string
        }
        Insert: {
          choice_index: number
          created_at?: string | null
          importance?: number | null
          question_id: number
          user_id: string
        }
        Update: {
          choice_index?: number
          created_at?: string | null
          importance?: number | null
          question_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "match_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      match_likes: {
        Row: {
          created_at: string | null
          id: string
          target_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          target_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          target_id?: string
          user_id?: string
        }
        Relationships: []
      }
      match_passes: {
        Row: {
          created_at: string | null
          id: string
          target_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          target_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          target_id?: string
          user_id?: string
        }
        Relationships: []
      }
      match_profiles: {
        Row: {
          age: number | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string | null
          display_name: string | null
          gender: string | null
          photos: string[] | null
          seeking: string | null
          user_id: string
        }
        Insert: {
          age?: number | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          display_name?: string | null
          gender?: string | null
          photos?: string[] | null
          seeking?: string | null
          user_id: string
        }
        Update: {
          age?: number | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          display_name?: string | null
          gender?: string | null
          photos?: string[] | null
          seeking?: string | null
          user_id?: string
        }
        Relationships: []
      }
      match_questions: {
        Row: {
          choices: string[]
          id: number
          text: string
          weight: number | null
        }
        Insert: {
          choices: string[]
          id?: number
          text: string
          weight?: number | null
        }
        Update: {
          choices?: string[]
          id?: number
          text?: string
          weight?: number | null
        }
        Relationships: []
      }
      match_scores: {
        Row: {
          score: number
          updated_at: string | null
          user_a: string
          user_b: string
        }
        Insert: {
          score: number
          updated_at?: string | null
          user_a: string
          user_b: string
        }
        Update: {
          score?: number
          updated_at?: string | null
          user_a?: string
          user_b?: string
        }
        Relationships: []
      }
      mentor_bookings: {
        Row: {
          created_at: string | null
          id: string
          mentee_id: string
          mentor_id: string
          message: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          mentee_id: string
          mentor_id: string
          message?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          mentee_id?: string
          mentor_id?: string
          message?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentor_bookings_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_favorites: {
        Row: {
          created_at: string
          id: string
          mentor_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mentor_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mentor_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_favorites_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          bio: string | null
          city: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          display_name: string | null
          id: string
          languages: string[] | null
          photos: string[] | null
          plan_description: string | null
          price_cents: number | null
          rating: number | null
          social_links: Json | null
          topics: string[] | null
          user_id: string
          website_url: string | null
        }
        Insert: {
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          display_name?: string | null
          id?: string
          languages?: string[] | null
          photos?: string[] | null
          plan_description?: string | null
          price_cents?: number | null
          rating?: number | null
          social_links?: Json | null
          topics?: string[] | null
          user_id: string
          website_url?: string | null
        }
        Update: {
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          display_name?: string | null
          id?: string
          languages?: string[] | null
          photos?: string[] | null
          plan_description?: string | null
          price_cents?: number | null
          rating?: number | null
          social_links?: Json | null
          topics?: string[] | null
          user_id?: string
          website_url?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          listing_id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          listing_id: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          listing_id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          link: string | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          link?: string | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          link?: string | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      presence: {
        Row: {
          city: string | null
          last_seen: string
          user_id: string
        }
        Insert: {
          city?: string | null
          last_seen?: string
          user_id: string
        }
        Update: {
          city?: string | null
          last_seen?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          city: string | null
          created_at: string | null
          display_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          display_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          listing_id: string
          reason: string
          reporter_id: string | null
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          listing_id: string
          reason: string
          reporter_id?: string | null
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          listing_id?: string
          reason?: string
          reporter_id?: string | null
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          filters: Json | null
          id: string
          last_seen: string | null
          name: string | null
          user_id: string | null
        }
        Insert: {
          filters?: Json | null
          id?: string
          last_seen?: string | null
          name?: string | null
          user_id?: string | null
        }
        Update: {
          filters?: Json | null
          id?: string
          last_seen?: string | null
          name?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_searches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activity: {
        Row: {
          active_at: string | null
          city: string | null
          country: string | null
          id: string
          lat: number | null
          lng: number | null
          user_id: string | null
        }
        Insert: {
          active_at?: string | null
          city?: string | null
          country?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          user_id?: string | null
        }
        Update: {
          active_at?: string | null
          city?: string | null
          country?: string | null
          id?: string
          lat?: number | null
          lng?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          email: string
          id: string
          last_active: string | null
          name: string | null
          phone: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          email: string
          id?: string
          last_active?: string | null
          name?: string | null
          phone?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_active?: string | null
          name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      listing_counts: {
        Row: {
          subcategory: string | null
          total: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_listing_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          subcategory: string
          total: number
        }[]
      }
      get_or_create_dm_thread: {
        Args: { p_other_user: string; p_user?: string }
        Returns: string
      }
      get_potential_matches: {
        Args: { p_limit?: number; p_user_id?: string }
        Returns: {
          age: number
          bio: string
          city: string
          country: string
          display_name: string
          gender: string
          photos: string[]
          seeking: string
          user_id: string
        }[]
      }
      increment_views: {
        Args: { listing_id: string }
        Returns: undefined
      }
      touch_presence: {
        Args: { p_city: string }
        Returns: undefined
      }
      track_listing_view: {
        Args: { p_listing_id: string }
        Returns: undefined
      }
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
