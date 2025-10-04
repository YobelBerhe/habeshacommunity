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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          amount_cents: number
          created_at: string
          currency: string
          duration_minutes: number
          id: string
          meeting_url: string | null
          mentor_id: string
          notes: string | null
          session_date: string
          status: string | null
          stripe_payment_intent_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          currency?: string
          duration_minutes?: number
          id: string
          meeting_url?: string | null
          mentor_id: string
          notes?: string | null
          session_date: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          currency?: string
          duration_minutes?: number
          id?: string
          meeting_url?: string | null
          mentor_id?: string
          notes?: string | null
          session_date?: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          board: string
          city: string
          content: string
          created_at: string | null
          id: string
          media_url: string | null
          message_type: string | null
          user_id: string
        }
        Insert: {
          board: string
          city: string
          content: string
          created_at?: string | null
          id?: string
          media_url?: string | null
          message_type?: string | null
          user_id: string
        }
        Update: {
          board?: string
          city?: string
          content?: string
          created_at?: string | null
          id?: string
          media_url?: string | null
          message_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          participant1_id: string
          participant2_id: string
        }
        Insert: {
          created_at?: string
          id: string
          last_message_at?: string | null
          participant1_id: string
          participant2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant1_id?: string
          participant2_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          listing_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          listing_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          listing_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_messages: {
        Row: {
          author_id: string | null
          author_name: string | null
          body: string
          created_at: string
          id: string
          topic_id: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          body: string
          created_at?: string
          id: string
          topic_id: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          body?: string
          created_at?: string
          id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_messages_topic_id_fkey"
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
          author_name: string | null
          board: Database["public"]["Enums"]["forum_board"]
          city: string
          created_at: string
          id: string
          replies_count: number | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          author_name?: string | null
          board: Database["public"]["Enums"]["forum_board"]
          city: string
          created_at?: string
          id: string
          replies_count?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          author_name?: string | null
          board?: Database["public"]["Enums"]["forum_board"]
          city?: string
          created_at?: string
          id?: string
          replies_count?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string
          id: string
          liked_id: string
          liker_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          liked_id: string
          liker_id: string
        }
        Update: {
          created_at?: string
          id?: string
          liked_id?: string
          liker_id?: string
        }
        Relationships: []
      }
      listing_contacts: {
        Row: {
          contact_method: Database["public"]["Enums"]["contact_method"] | null
          contact_value: string | null
          created_at: string
          id: string
          listing_id: string
        }
        Insert: {
          contact_method?: Database["public"]["Enums"]["contact_method"] | null
          contact_value?: string | null
          created_at?: string
          id: string
          listing_id: string
        }
        Update: {
          contact_method?: Database["public"]["Enums"]["contact_method"] | null
          contact_value?: string | null
          created_at?: string
          id?: string
          listing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_contacts_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          category: Database["public"]["Enums"]["listing_category"]
          city: string
          contact_hidden: boolean | null
          country: string | null
          created_at: string
          currency: string | null
          description: string
          id: string
          images: string[] | null
          is_featured: boolean | null
          location_lat: number | null
          location_lng: number | null
          price_cents: number | null
          status: Database["public"]["Enums"]["listing_status"] | null
          subcategory: string | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
          views: number | null
          website_url: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["listing_category"]
          city: string
          contact_hidden?: boolean | null
          country?: string | null
          created_at?: string
          currency?: string | null
          description: string
          id: string
          images?: string[] | null
          is_featured?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          price_cents?: number | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          subcategory?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
          views?: number | null
          website_url?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["listing_category"]
          city?: string
          contact_hidden?: boolean | null
          country?: string | null
          created_at?: string
          currency?: string | null
          description?: string
          id?: string
          images?: string[] | null
          is_featured?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          price_cents?: number | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
          views?: number | null
          website_url?: string | null
        }
        Relationships: []
      }
      marketplace_items: {
        Row: {
          category: string
          city: string
          condition: string | null
          country: string | null
          created_at: string
          currency: string | null
          description: string
          id: string
          images: string[] | null
          price_cents: number
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          city: string
          condition?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          description: string
          id: string
          images?: string[] | null
          price_cents: number
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          city?: string
          condition?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          description?: string
          id?: string
          images?: string[] | null
          price_cents?: number
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      match_profiles: {
        Row: {
          active: boolean | null
          age: number | null
          bio: string | null
          city: string
          country: string | null
          created_at: string
          display_name: string | null
          gender: string | null
          id: string
          interests: string[] | null
          looking_for: string | null
          name: string
          photos: string[] | null
          seeking: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          age?: number | null
          bio?: string | null
          city: string
          country?: string | null
          created_at?: string
          display_name?: string | null
          gender?: string | null
          id: string
          interests?: string[] | null
          looking_for?: string | null
          name: string
          photos?: string[] | null
          seeking?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          active?: boolean | null
          age?: number | null
          bio?: string | null
          city?: string
          country?: string | null
          created_at?: string
          display_name?: string | null
          gender?: string | null
          id?: string
          interests?: string[] | null
          looking_for?: string | null
          name?: string
          photos?: string[] | null
          seeking?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      match_questions: {
        Row: {
          choices: Json
          created_at: string
          id: string
          is_required: boolean
          question_text: string
          section: string
          weight: number
        }
        Insert: {
          choices?: Json
          created_at?: string
          id?: string
          is_required?: boolean
          question_text: string
          section: string
          weight?: number
        }
        Update: {
          choices?: Json
          created_at?: string
          id?: string
          is_required?: boolean
          question_text?: string
          section?: string
          weight?: number
        }
        Relationships: []
      }
      matches: {
        Row: {
          created_at: string
          id: string
          user1_id: string
          user2_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          user1_id: string
          user2_id: string
        }
        Update: {
          created_at?: string
          id?: string
          user1_id?: string
          user2_id?: string
        }
        Relationships: []
      }
      mentor_bookings: {
        Row: {
          application_fee_cents: number | null
          charge_id: string | null
          created_at: string
          id: string
          join_expires_at: string | null
          join_url: string | null
          mentor_id: string
          message: string | null
          net_to_mentor_cents: number | null
          notes: string | null
          payment_status: string | null
          status: string
          stripe_session_id: string | null
          transfer_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          application_fee_cents?: number | null
          charge_id?: string | null
          created_at?: string
          id?: string
          join_expires_at?: string | null
          join_url?: string | null
          mentor_id: string
          message?: string | null
          net_to_mentor_cents?: number | null
          notes?: string | null
          payment_status?: string | null
          status?: string
          stripe_session_id?: string | null
          transfer_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          application_fee_cents?: number | null
          charge_id?: string | null
          created_at?: string
          id?: string
          join_expires_at?: string | null
          join_url?: string | null
          mentor_id?: string
          message?: string | null
          net_to_mentor_cents?: number | null
          notes?: string | null
          payment_status?: string | null
          status?: string
          stripe_session_id?: string | null
          transfer_id?: string | null
          updated_at?: string
          user_id?: string
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
      mentor_reviews: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          mentor_id: string
          rating: number
          review_text: string | null
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          mentor_id: string
          rating: number
          review_text?: string | null
          user_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          mentor_id?: string
          rating?: number
          review_text?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "mentor_bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_reviews_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_verifications: {
        Row: {
          admin_notes: string | null
          bio_statement: string | null
          created_at: string
          documents_url: string[] | null
          id: string
          mentor_id: string
          reviewed_at: string | null
          social_links: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          bio_statement?: string | null
          created_at?: string
          documents_url?: string[] | null
          id?: string
          mentor_id: string
          reviewed_at?: string | null
          social_links?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          bio_statement?: string | null
          created_at?: string
          documents_url?: string[] | null
          id?: string
          mentor_id?: string
          reviewed_at?: string | null
          social_links?: string[] | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_verifications_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          available: boolean | null
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          currency: string | null
          display_name: string | null
          expertise: string[] | null
          hourly_rate_cents: number | null
          id: string
          is_verified: boolean | null
          languages: string[] | null
          name: string
          onboarding_required: boolean | null
          payouts_enabled: boolean | null
          photos: string[] | null
          price_cents: number | null
          rating_avg: number | null
          rating_count: number | null
          stripe_account_id: string | null
          timezone: string | null
          title: string
          topics: string[] | null
          updated_at: string
          user_id: string
          verification_celebrated: boolean | null
          website_url: string | null
        }
        Insert: {
          available?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          display_name?: string | null
          expertise?: string[] | null
          hourly_rate_cents?: number | null
          id?: string
          is_verified?: boolean | null
          languages?: string[] | null
          name: string
          onboarding_required?: boolean | null
          payouts_enabled?: boolean | null
          photos?: string[] | null
          price_cents?: number | null
          rating_avg?: number | null
          rating_count?: number | null
          stripe_account_id?: string | null
          timezone?: string | null
          title: string
          topics?: string[] | null
          updated_at?: string
          user_id: string
          verification_celebrated?: boolean | null
          website_url?: string | null
        }
        Update: {
          available?: boolean | null
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          display_name?: string | null
          expertise?: string[] | null
          hourly_rate_cents?: number | null
          id?: string
          is_verified?: boolean | null
          languages?: string[] | null
          name?: string
          onboarding_required?: boolean | null
          payouts_enabled?: boolean | null
          photos?: string[] | null
          price_cents?: number | null
          rating_avg?: number | null
          rating_count?: number | null
          stripe_account_id?: string | null
          timezone?: string | null
          title?: string
          topics?: string[] | null
          updated_at?: string
          user_id?: string
          verification_celebrated?: boolean | null
          website_url?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read: boolean | null
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id: string
          read?: boolean | null
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read?: boolean | null
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string | null
          read: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          display_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string | null
          details: string | null
          id: string
          listing_id: string
          reason: string
          reporter_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          details?: string | null
          id?: string
          listing_id: string
          reason: string
          reporter_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          details?: string | null
          id?: string
          listing_id?: string
          reason?: string
          reporter_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      saved_searches: {
        Row: {
          created_at: string
          id: string
          last_seen: string | null
          name: string | null
          params: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          last_seen?: string | null
          name?: string | null
          params: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_seen?: string | null
          name?: string | null
          params?: Json
          user_id?: string
        }
        Relationships: []
      }
      user_answers: {
        Row: {
          answer: string
          created_at: string
          id: string
          question_id: string
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          question_id: string
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "match_questions"
            referencedColumns: ["id"]
          },
        ]
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
      calculate_match_score: {
        Args: { profile_user_id: string; viewer_id: string }
        Returns: {
          match_percent: number
          matched_questions: number
          total_questions: number
        }[]
      }
      get_listing_counts: {
        Args: Record<PropertyKey, never>
        Returns: {
          category: string
          count: number
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_views: {
        Args: { listing_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      contact_method: "phone" | "whatsapp" | "telegram" | "email"
      forum_board:
        | "general"
        | "housing_tips"
        | "jobs_career"
        | "immigration_legal"
        | "community_events"
        | "buy_sell_swap"
        | "health_wellness"
        | "faith_bible"
        | "tech_learn"
      listing_category:
        | "housing"
        | "jobs"
        | "services"
        | "forsale"
        | "community"
      listing_status: "active" | "paused" | "flagged" | "archived"
      notification_type: "message" | "favorite" | "reply" | "mention" | "system"
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
      app_role: ["admin", "moderator", "user"],
      contact_method: ["phone", "whatsapp", "telegram", "email"],
      forum_board: [
        "general",
        "housing_tips",
        "jobs_career",
        "immigration_legal",
        "community_events",
        "buy_sell_swap",
        "health_wellness",
        "faith_bible",
        "tech_learn",
      ],
      listing_category: ["housing", "jobs", "services", "forsale", "community"],
      listing_status: ["active", "paused", "flagged", "archived"],
      notification_type: ["message", "favorite", "reply", "mention", "system"],
    },
  },
} as const
