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
      bible_books: {
        Row: {
          abbreviation: string | null
          book_order: number
          canon: string
          chapters_count: number
          created_at: string | null
          id: number
          name: string
          usfm: string
        }
        Insert: {
          abbreviation?: string | null
          book_order: number
          canon: string
          chapters_count: number
          created_at?: string | null
          id?: number
          name: string
          usfm: string
        }
        Update: {
          abbreviation?: string | null
          book_order?: number
          canon?: string
          chapters_count?: number
          created_at?: string | null
          id?: number
          name?: string
          usfm?: string
        }
        Relationships: []
      }
      bible_chapters: {
        Row: {
          book_id: number | null
          canonical: boolean | null
          chapter_number: number
          created_at: string | null
          id: number
          usfm: string
          verses_count: number
        }
        Insert: {
          book_id?: number | null
          canonical?: boolean | null
          chapter_number: number
          created_at?: string | null
          id?: number
          usfm: string
          verses_count: number
        }
        Update: {
          book_id?: number | null
          canonical?: boolean | null
          chapter_number?: number
          created_at?: string | null
          id?: number
          usfm?: string
          verses_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "bible_chapters_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "bible_books"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_verses: {
        Row: {
          audio_url: string | null
          chapter_id: number | null
          created_at: string | null
          id: number
          text: string
          text_searchable: unknown
          usfm: string
          verse_number: number
          version_id: number | null
        }
        Insert: {
          audio_url?: string | null
          chapter_id?: number | null
          created_at?: string | null
          id?: number
          text: string
          text_searchable?: unknown
          usfm: string
          verse_number: number
          version_id?: number | null
        }
        Update: {
          audio_url?: string | null
          chapter_id?: number | null
          created_at?: string | null
          id?: number
          text?: string
          text_searchable?: unknown
          usfm?: string
          verse_number?: number
          version_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bible_verses_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "bible_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bible_verses_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "bible_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_versions: {
        Row: {
          abbreviation: string
          audio_available: boolean | null
          copyright: string | null
          created_at: string | null
          description: string | null
          id: number
          language_code: string
          language_name: string
          name: string
          publisher: string | null
          text_available: boolean | null
          updated_at: string | null
          version_id: number
        }
        Insert: {
          abbreviation: string
          audio_available?: boolean | null
          copyright?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          language_code: string
          language_name: string
          name: string
          publisher?: string | null
          text_available?: boolean | null
          updated_at?: string | null
          version_id: number
        }
        Update: {
          abbreviation?: string
          audio_available?: boolean | null
          copyright?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          language_code?: string
          language_name?: string
          name?: string
          publisher?: string | null
          text_available?: boolean | null
          updated_at?: string | null
          version_id?: number
        }
        Relationships: []
      }
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
          reminder_1h_sent: boolean | null
          reminder_5m_sent: boolean | null
          scheduled_time: string | null
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
          reminder_1h_sent?: boolean | null
          reminder_5m_sent?: boolean | null
          scheduled_time?: string | null
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
          reminder_1h_sent?: boolean | null
          reminder_5m_sent?: boolean | null
          scheduled_time?: string | null
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
          {
            foreignKeyName: "bookings_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "public_mentors"
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
          booking_id: string | null
          created_at: string
          id: string
          last_message_at: string | null
          participant1_id: string
          participant2_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant1_id: string
          participant2_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          last_message_at?: string | null
          participant1_id?: string
          participant2_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
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
      fulfillments: {
        Row: {
          carrier: string | null
          created_at: string
          id: string
          label_url: string | null
          order_id: string
          raw_events: Json | null
          status: string
          tracking_number: string | null
          updated_at: string
        }
        Insert: {
          carrier?: string | null
          created_at?: string
          id?: string
          label_url?: string | null
          order_id: string
          raw_events?: Json | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
        }
        Update: {
          carrier?: string | null
          created_at?: string
          id?: string
          label_url?: string | null
          order_id?: string
          raw_events?: Json | null
          status?: string
          tracking_number?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fulfillments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      ledger_entries: {
        Row: {
          amount_cents: number
          created_at: string
          id: string
          note: string | null
          order_id: string | null
          seller_id: string
          type: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string | null
          seller_id: string
          type: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          id?: string
          note?: string | null
          order_id?: string | null
          seller_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
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
          delivery_mode: string | null
          delivery_title: string | null
          delivery_token: string | null
          delivery_url: string | null
          description: string
          dims_cm: Json | null
          featured_until: string | null
          hs_code: string | null
          id: string
          images: string[] | null
          inventory: number | null
          is_featured: boolean | null
          location_lat: number | null
          location_lng: number | null
          origin_country: string | null
          price_cents: number | null
          status: Database["public"]["Enums"]["listing_status"] | null
          subcategory: string | null
          tags: string[] | null
          title: string
          type: string | null
          updated_at: string
          user_id: string
          views: number | null
          website_url: string | null
          weight_grams: number | null
        }
        Insert: {
          category: Database["public"]["Enums"]["listing_category"]
          city: string
          contact_hidden?: boolean | null
          country?: string | null
          created_at?: string
          currency?: string | null
          delivery_mode?: string | null
          delivery_title?: string | null
          delivery_token?: string | null
          delivery_url?: string | null
          description: string
          dims_cm?: Json | null
          featured_until?: string | null
          hs_code?: string | null
          id: string
          images?: string[] | null
          inventory?: number | null
          is_featured?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          origin_country?: string | null
          price_cents?: number | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          subcategory?: string | null
          tags?: string[] | null
          title: string
          type?: string | null
          updated_at?: string
          user_id: string
          views?: number | null
          website_url?: string | null
          weight_grams?: number | null
        }
        Update: {
          category?: Database["public"]["Enums"]["listing_category"]
          city?: string
          contact_hidden?: boolean | null
          country?: string | null
          created_at?: string
          currency?: string | null
          delivery_mode?: string | null
          delivery_title?: string | null
          delivery_token?: string | null
          delivery_url?: string | null
          description?: string
          dims_cm?: Json | null
          featured_until?: string | null
          hs_code?: string | null
          id?: string
          images?: string[] | null
          inventory?: number | null
          is_featured?: boolean | null
          location_lat?: number | null
          location_lng?: number | null
          origin_country?: string | null
          price_cents?: number | null
          status?: Database["public"]["Enums"]["listing_status"] | null
          subcategory?: string | null
          tags?: string[] | null
          title?: string
          type?: string | null
          updated_at?: string
          user_id?: string
          views?: number | null
          website_url?: string | null
          weight_grams?: number | null
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
      mentor_availability: {
        Row: {
          available_date: string
          created_at: string | null
          end_time: string
          id: string
          is_booked: boolean | null
          mentor_id: string
          start_time: string
          updated_at: string | null
        }
        Insert: {
          available_date: string
          created_at?: string | null
          end_time: string
          id?: string
          is_booked?: boolean | null
          mentor_id: string
          start_time: string
          updated_at?: string | null
        }
        Update: {
          available_date?: string
          created_at?: string | null
          end_time?: string
          id?: string
          is_booked?: boolean | null
          mentor_id?: string
          start_time?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mentor_availability_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_availability_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "public_mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_badges: {
        Row: {
          badge_type: string
          earned_at: string | null
          icon: string | null
          id: string
          label: string
          mentor_id: string
        }
        Insert: {
          badge_type: string
          earned_at?: string | null
          icon?: string | null
          id?: string
          label: string
          mentor_id: string
        }
        Update: {
          badge_type?: string
          earned_at?: string | null
          icon?: string | null
          id?: string
          label?: string
          mentor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_badges_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_badges_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "public_mentors"
            referencedColumns: ["id"]
          },
        ]
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
          used_credit: boolean | null
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
          used_credit?: boolean | null
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
          used_credit?: boolean | null
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
          {
            foreignKeyName: "mentor_bookings_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "public_mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_credits: {
        Row: {
          bundle_size: number
          created_at: string
          credits_left: number
          currency: string
          id: string
          mentor_id: string
          price_cents: number
          purchased_at: string
          user_id: string
        }
        Insert: {
          bundle_size: number
          created_at?: string
          credits_left: number
          currency?: string
          id?: string
          mentor_id: string
          price_cents: number
          purchased_at?: string
          user_id: string
        }
        Update: {
          bundle_size?: number
          created_at?: string
          credits_left?: number
          currency?: string
          id?: string
          mentor_id?: string
          price_cents?: number
          purchased_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_credits_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_credits_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "public_mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_favorites: {
        Row: {
          created_at: string
          mentor_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          mentor_id: string
          user_id: string
        }
        Update: {
          created_at?: string
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
          {
            foreignKeyName: "mentor_favorites_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "public_mentors"
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
          {
            foreignKeyName: "mentor_reviews_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "public_mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentor_skills: {
        Row: {
          created_at: string
          id: string
          mentor_id: string
          skill: string
        }
        Insert: {
          created_at?: string
          id?: string
          mentor_id: string
          skill: string
        }
        Update: {
          created_at?: string
          id?: string
          mentor_id?: string
          skill?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentor_skills_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mentor_skills_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "public_mentors"
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
          {
            foreignKeyName: "mentor_verifications_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "public_mentors"
            referencedColumns: ["id"]
          },
        ]
      }
      mentors: {
        Row: {
          available: boolean | null
          avatar_url: string | null
          badges_count: number | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string
          currency: string | null
          display_name: string | null
          expertise: string[] | null
          hourly_rate_cents: number | null
          id: string
          industries: string[] | null
          is_featured: boolean | null
          is_verified: boolean | null
          languages: string[] | null
          name: string
          onboarding_required: boolean | null
          payouts_enabled: boolean | null
          photos: string[] | null
          price_cents: number | null
          rating_avg: number | null
          rating_count: number | null
          skills: string[] | null
          stripe_account_id: string | null
          timezone: string | null
          title: string
          topics: string[] | null
          updated_at: string
          user_id: string
          verification_celebrated: boolean | null
          website_url: string | null
          youtube_link: string | null
        }
        Insert: {
          available?: boolean | null
          avatar_url?: string | null
          badges_count?: number | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          display_name?: string | null
          expertise?: string[] | null
          hourly_rate_cents?: number | null
          id?: string
          industries?: string[] | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          name: string
          onboarding_required?: boolean | null
          payouts_enabled?: boolean | null
          photos?: string[] | null
          price_cents?: number | null
          rating_avg?: number | null
          rating_count?: number | null
          skills?: string[] | null
          stripe_account_id?: string | null
          timezone?: string | null
          title: string
          topics?: string[] | null
          updated_at?: string
          user_id: string
          verification_celebrated?: boolean | null
          website_url?: string | null
          youtube_link?: string | null
        }
        Update: {
          available?: boolean | null
          avatar_url?: string | null
          badges_count?: number | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          currency?: string | null
          display_name?: string | null
          expertise?: string[] | null
          hourly_rate_cents?: number | null
          id?: string
          industries?: string[] | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          name?: string
          onboarding_required?: boolean | null
          payouts_enabled?: boolean | null
          photos?: string[] | null
          price_cents?: number | null
          rating_avg?: number | null
          rating_count?: number | null
          skills?: string[] | null
          stripe_account_id?: string | null
          timezone?: string | null
          title?: string
          topics?: string[] | null
          updated_at?: string
          user_id?: string
          verification_celebrated?: boolean | null
          website_url?: string | null
          youtube_link?: string | null
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
          id?: string
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
          conversation_id: string | null
          created_at: string
          id: string
          link: string | null
          message: string | null
          read: boolean | null
          read_at: string | null
          sender_id: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          read_at?: string | null
          sender_id?: string | null
          title: string
          type: Database["public"]["Enums"]["notification_type"]
          user_id: string
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          read?: boolean | null
          read_at?: string | null
          sender_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"]
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          buyer_id: string | null
          created_at: string
          currency: string
          delivery_link_hash: string | null
          id: string
          kind: string
          listing_id: string | null
          platform_fee_cents: number
          qty: number
          seller_id: string | null
          shipping_cents: number
          status: string
          stripe_payment_intent: string | null
          subtotal_cents: number
          total_cents: number
          updated_at: string
        }
        Insert: {
          buyer_id?: string | null
          created_at?: string
          currency?: string
          delivery_link_hash?: string | null
          id?: string
          kind: string
          listing_id?: string | null
          platform_fee_cents: number
          qty?: number
          seller_id?: string | null
          shipping_cents?: number
          status?: string
          stripe_payment_intent?: string | null
          subtotal_cents: number
          total_cents: number
          updated_at?: string
        }
        Update: {
          buyer_id?: string | null
          created_at?: string
          currency?: string
          delivery_link_hash?: string | null
          id?: string
          kind?: string
          listing_id?: string | null
          platform_fee_cents?: number
          qty?: number
          seller_id?: string | null
          shipping_cents?: number
          status?: string
          stripe_payment_intent?: string | null
          subtotal_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      payout_methods: {
        Row: {
          created_at: string
          details: Json
          id: string
          seller_id: string
          type: string
          verified: boolean
        }
        Insert: {
          created_at?: string
          details: Json
          id?: string
          seller_id: string
          type: string
          verified?: boolean
        }
        Update: {
          created_at?: string
          details?: Json
          id?: string
          seller_id?: string
          type?: string
          verified?: boolean
        }
        Relationships: []
      }
      payouts: {
        Row: {
          amount_cents: number
          created_at: string
          id: string
          method_type: string
          provider_ref: string | null
          seller_id: string
          status: string
          updated_at: string
        }
        Insert: {
          amount_cents: number
          created_at?: string
          id?: string
          method_type: string
          provider_ref?: string | null
          seller_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount_cents?: number
          created_at?: string
          id?: string
          method_type?: string
          provider_ref?: string | null
          seller_id?: string
          status?: string
          updated_at?: string
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
          credits_balance: number | null
          display_name: string | null
          email_notifications_enabled: boolean | null
          gender: string | null
          id: string
          referral_code: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          credits_balance?: number | null
          display_name?: string | null
          email_notifications_enabled?: boolean | null
          gender?: string | null
          id: string
          referral_code?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          credits_balance?: number | null
          display_name?: string | null
          email_notifications_enabled?: boolean | null
          gender?: string | null
          id?: string
          referral_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      reading_plan_days: {
        Row: {
          created_at: string | null
          day_number: number
          description: string | null
          id: number
          plan_id: number | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          day_number: number
          description?: string | null
          id?: number
          plan_id?: number | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          day_number?: number
          description?: string | null
          id?: number
          plan_id?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reading_plan_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "popular_reading_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_plan_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_plan_publishers: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          logo_url: string | null
          name: string
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          logo_url?: string | null
          name: string
          website?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          logo_url?: string | null
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      reading_plan_segments: {
        Row: {
          content_html: string | null
          content_text: string | null
          created_at: string | null
          day_id: number | null
          id: number
          segment_order: number
          title: string | null
          type: string
          usfm: string | null
          version_id: number | null
          video_thumbnail: string | null
          video_url: string | null
        }
        Insert: {
          content_html?: string | null
          content_text?: string | null
          created_at?: string | null
          day_id?: number | null
          id?: number
          segment_order: number
          title?: string | null
          type: string
          usfm?: string | null
          version_id?: number | null
          video_thumbnail?: string | null
          video_url?: string | null
        }
        Update: {
          content_html?: string | null
          content_text?: string | null
          created_at?: string | null
          day_id?: number | null
          id?: number
          segment_order?: number
          title?: string | null
          type?: string
          usfm?: string | null
          version_id?: number | null
          video_thumbnail?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reading_plan_segments_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "reading_plan_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_plan_segments_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "bible_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      reading_plans: {
        Row: {
          about_html: string | null
          about_text: string | null
          average_rating: number | null
          categories: Json | null
          cover_image_url: string | null
          created_at: string | null
          days_count: number
          description: string | null
          external_id: number | null
          gradient: Json | null
          id: number
          languages: Json | null
          popularity_rank: number | null
          premium: boolean | null
          publisher_id: number | null
          slug: string
          thumbnail_url: string | null
          title: string
          total_ratings: number | null
          total_subscriptions: number | null
          updated_at: string | null
        }
        Insert: {
          about_html?: string | null
          about_text?: string | null
          average_rating?: number | null
          categories?: Json | null
          cover_image_url?: string | null
          created_at?: string | null
          days_count: number
          description?: string | null
          external_id?: number | null
          gradient?: Json | null
          id?: number
          languages?: Json | null
          popularity_rank?: number | null
          premium?: boolean | null
          publisher_id?: number | null
          slug: string
          thumbnail_url?: string | null
          title: string
          total_ratings?: number | null
          total_subscriptions?: number | null
          updated_at?: string | null
        }
        Update: {
          about_html?: string | null
          about_text?: string | null
          average_rating?: number | null
          categories?: Json | null
          cover_image_url?: string | null
          created_at?: string | null
          days_count?: number
          description?: string | null
          external_id?: number | null
          gradient?: Json | null
          id?: number
          languages?: Json | null
          popularity_rank?: number | null
          premium?: boolean | null
          publisher_id?: number | null
          slug?: string
          thumbnail_url?: string | null
          title?: string
          total_ratings?: number | null
          total_subscriptions?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reading_plans_publisher_id_fkey"
            columns: ["publisher_id"]
            isOneToOne: false
            referencedRelation: "reading_plan_publishers"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referee_id: string | null
          referral_code: string
          referrer_id: string | null
          reward_applied: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referee_id?: string | null
          referral_code: string
          referrer_id?: string | null
          reward_applied?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referee_id?: string | null
          referral_code?: string
          referrer_id?: string | null
          reward_applied?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      seller_balances: {
        Row: {
          available_cents: number
          on_hold_cents: number
          seller_id: string
          updated_at: string
        }
        Insert: {
          available_cents?: number
          on_hold_cents?: number
          seller_id: string
          updated_at?: string
        }
        Update: {
          available_cents?: number
          on_hold_cents?: number
          seller_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      session_logs: {
        Row: {
          created_at: string | null
          duration_seconds: number | null
          ended_at: string | null
          id: string
          proof_recorded: boolean | null
          recording_url: string | null
          session_id: string | null
          started_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          proof_recorded?: boolean | null
          recording_url?: string | null
          session_id?: string | null
          started_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          id?: string
          proof_recorded?: boolean | null
          recording_url?: string | null
          session_id?: string | null
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "mentor_bookings"
            referencedColumns: ["id"]
          },
        ]
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
      user_bible_preferences: {
        Row: {
          created_at: string | null
          cross_references: boolean | null
          daily_reminder_enabled: boolean | null
          daily_reminder_time: string | null
          default_version_id: number | null
          font_size: string | null
          red_letter_words: boolean | null
          show_verse_numbers: boolean | null
          theme: string | null
          updated_at: string | null
          user_id: string
          verse_of_day_notification: boolean | null
        }
        Insert: {
          created_at?: string | null
          cross_references?: boolean | null
          daily_reminder_enabled?: boolean | null
          daily_reminder_time?: string | null
          default_version_id?: number | null
          font_size?: string | null
          red_letter_words?: boolean | null
          show_verse_numbers?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
          verse_of_day_notification?: boolean | null
        }
        Update: {
          created_at?: string | null
          cross_references?: boolean | null
          daily_reminder_enabled?: boolean | null
          daily_reminder_time?: string | null
          default_version_id?: number | null
          font_size?: string | null
          red_letter_words?: boolean | null
          show_verse_numbers?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
          verse_of_day_notification?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "user_bible_preferences_default_version_id_fkey"
            columns: ["default_version_id"]
            isOneToOne: false
            referencedRelation: "bible_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_daily_readings: {
        Row: {
          chapters_read: number[] | null
          created_at: string | null
          id: string
          plans_engaged: number[] | null
          read_date: string
          time_spent_seconds: number | null
          user_id: string
          verses_read: number[] | null
        }
        Insert: {
          chapters_read?: number[] | null
          created_at?: string | null
          id?: string
          plans_engaged?: number[] | null
          read_date: string
          time_spent_seconds?: number | null
          user_id: string
          verses_read?: number[] | null
        }
        Update: {
          chapters_read?: number[] | null
          created_at?: string | null
          id?: string
          plans_engaged?: number[] | null
          read_date?: string
          time_spent_seconds?: number | null
          user_id?: string
          verses_read?: number[] | null
        }
        Relationships: []
      }
      user_day_completions: {
        Row: {
          completed_at: string | null
          day_id: number | null
          id: string
          subscription_id: string | null
          time_spent_seconds: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          day_id?: number | null
          id?: string
          subscription_id?: string | null
          time_spent_seconds?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          day_id?: number | null
          id?: string
          subscription_id?: string | null
          time_spent_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_day_completions_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "reading_plan_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_day_completions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_active_plans_with_progress"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_day_completions_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "user_plan_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_plan_subscriptions: {
        Row: {
          completed_at: string | null
          completed_days: number[] | null
          created_at: string | null
          current_day: number | null
          id: string
          last_read_at: string | null
          notes: string | null
          plan_id: number | null
          rating: number | null
          review: string | null
          started_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          completed_days?: number[] | null
          created_at?: string | null
          current_day?: number | null
          id?: string
          last_read_at?: string | null
          notes?: string | null
          plan_id?: number | null
          rating?: number | null
          review?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          completed_days?: number[] | null
          created_at?: string | null
          current_day?: number | null
          id?: string
          last_read_at?: string | null
          notes?: string | null
          plan_id?: number | null
          rating?: number | null
          review?: string | null
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_plan_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "popular_reading_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_plan_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reading_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_read_date: string | null
          longest_streak: number | null
          streak_start_date: string | null
          total_days_read: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_read_date?: string | null
          longest_streak?: number | null
          streak_start_date?: string | null
          total_days_read?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_read_date?: string | null
          longest_streak?: number | null
          streak_start_date?: string | null
          total_days_read?: number | null
          updated_at?: string | null
          user_id?: string
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
      user_verse_bookmarks: {
        Row: {
          created_at: string | null
          id: string
          note: string | null
          tags: string[] | null
          user_id: string
          verse_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          note?: string | null
          tags?: string[] | null
          user_id: string
          verse_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          note?: string | null
          tags?: string[] | null
          user_id?: string
          verse_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_verse_bookmarks_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "bible_verses"
            referencedColumns: ["id"]
          },
        ]
      }
      user_verse_highlights: {
        Row: {
          color: string | null
          created_at: string | null
          id: string
          is_public: boolean | null
          note: string | null
          updated_at: string | null
          user_id: string
          verse_id: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          note?: string | null
          updated_at?: string | null
          user_id: string
          verse_id?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          note?: string | null
          updated_at?: string | null
          user_id?: string
          verse_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_verse_highlights_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "bible_verses"
            referencedColumns: ["id"]
          },
        ]
      }
      verse_of_the_day: {
        Row: {
          created_at: string | null
          date: string
          id: number
          images: Json | null
          usfm: string
          verse_id: number | null
          version_id: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: number
          images?: Json | null
          usfm: string
          verse_id?: number | null
          version_id?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: number
          images?: Json | null
          usfm?: string
          verse_id?: number | null
          version_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "verse_of_the_day_verse_id_fkey"
            columns: ["verse_id"]
            isOneToOne: false
            referencedRelation: "bible_verses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "verse_of_the_day_version_id_fkey"
            columns: ["version_id"]
            isOneToOne: false
            referencedRelation: "bible_versions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      popular_reading_plans: {
        Row: {
          average_rating: number | null
          cover_image_url: string | null
          days_count: number | null
          description: string | null
          gradient: Json | null
          id: number | null
          popularity_rank: number | null
          slug: string | null
          title: string | null
          total_subscriptions: number | null
        }
        Relationships: []
      }
      public_mentors: {
        Row: {
          available: boolean | null
          avatar_url: string | null
          badges_count: number | null
          bio: string | null
          city: string | null
          country: string | null
          created_at: string | null
          currency: string | null
          display_name: string | null
          expertise: string[] | null
          hourly_rate_cents: number | null
          id: string | null
          industries: string[] | null
          is_featured: boolean | null
          is_verified: boolean | null
          languages: string[] | null
          name: string | null
          photos: string[] | null
          price_cents: number | null
          rating_avg: number | null
          rating_count: number | null
          skills: string[] | null
          timezone: string | null
          title: string | null
          topics: string[] | null
          updated_at: string | null
          website_url: string | null
          youtube_link: string | null
        }
        Insert: {
          available?: boolean | null
          avatar_url?: string | null
          badges_count?: number | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          display_name?: string | null
          expertise?: string[] | null
          hourly_rate_cents?: number | null
          id?: string | null
          industries?: string[] | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          name?: string | null
          photos?: string[] | null
          price_cents?: number | null
          rating_avg?: number | null
          rating_count?: number | null
          skills?: string[] | null
          timezone?: string | null
          title?: string | null
          topics?: string[] | null
          updated_at?: string | null
          website_url?: string | null
          youtube_link?: string | null
        }
        Update: {
          available?: boolean | null
          avatar_url?: string | null
          badges_count?: number | null
          bio?: string | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          currency?: string | null
          display_name?: string | null
          expertise?: string[] | null
          hourly_rate_cents?: number | null
          id?: string | null
          industries?: string[] | null
          is_featured?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          name?: string | null
          photos?: string[] | null
          price_cents?: number | null
          rating_avg?: number | null
          rating_count?: number | null
          skills?: string[] | null
          timezone?: string | null
          title?: string | null
          topics?: string[] | null
          updated_at?: string | null
          website_url?: string | null
          youtube_link?: string | null
        }
        Relationships: []
      }
      public_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          city: string | null
          country: string | null
          display_name: string | null
          id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          display_name?: string | null
          id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          city?: string | null
          country?: string | null
          display_name?: string | null
          id?: string | null
        }
        Relationships: []
      }
      user_active_plans_with_progress: {
        Row: {
          cover_image_url: string | null
          current_day: number | null
          days_count: number | null
          gradient: Json | null
          id: string | null
          last_read_at: string | null
          plan_id: number | null
          progress_percentage: number | null
          slug: string | null
          started_at: string | null
          status: string | null
          title: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_plan_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "popular_reading_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_plan_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      award_badges: { Args: { mentor_id: string }; Returns: undefined }
      calculate_match_score: {
        Args: { profile_user_id: string; viewer_id: string }
        Returns: {
          match_percent: number
          matched_questions: number
          total_questions: number
        }[]
      }
      get_available_slots: {
        Args: { p_date: string; p_mentor_id: string }
        Returns: {
          end_time: string
          id: string
          is_booked: boolean
          start_time: string
        }[]
      }
      get_listing_counts: {
        Args: never
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
      increment_views: { Args: { listing_id: string }; Returns: undefined }
      top_referrers: {
        Args: never
        Returns: {
          display_name: string
          email: string
          successful_referrals: number
          total_credits_earned: number
          total_referrals: number
          user_id: string
        }[]
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
