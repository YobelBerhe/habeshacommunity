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
      bible_study_discussion_replies: {
        Row: {
          content: string
          created_at: string | null
          discussion_id: string
          id: string
          like_count: number | null
          parent_reply_id: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          discussion_id: string
          id?: string
          like_count?: number | null
          parent_reply_id?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          discussion_id?: string
          id?: string
          like_count?: number | null
          parent_reply_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_study_discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "bible_study_discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bible_study_discussion_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "bible_study_discussion_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_study_discussions: {
        Row: {
          book: string | null
          chapter: number | null
          content: string
          created_at: string | null
          group_id: string
          id: string
          is_pinned: boolean | null
          like_count: number | null
          passage_reference: string | null
          reply_count: number | null
          title: string
          user_id: string
        }
        Insert: {
          book?: string | null
          chapter?: number | null
          content: string
          created_at?: string | null
          group_id: string
          id?: string
          is_pinned?: boolean | null
          like_count?: number | null
          passage_reference?: string | null
          reply_count?: number | null
          title: string
          user_id: string
        }
        Update: {
          book?: string | null
          chapter?: number | null
          content?: string
          created_at?: string | null
          group_id?: string
          id?: string
          is_pinned?: boolean | null
          like_count?: number | null
          passage_reference?: string | null
          reply_count?: number | null
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_study_discussions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "bible_study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_study_group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string | null
          role: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string | null
          role?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string | null
          role?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_study_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "bible_study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_study_groups: {
        Row: {
          created_at: string | null
          current_book: string | null
          current_chapter: number | null
          description: string
          discussion_count: number | null
          group_type: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          language_code: string | null
          leader_id: string
          meeting_schedule: string | null
          member_count: number | null
          name: string
          slug: string
          study_focus: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          current_book?: string | null
          current_chapter?: number | null
          description: string
          discussion_count?: number | null
          group_type?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          language_code?: string | null
          leader_id: string
          meeting_schedule?: string | null
          member_count?: number | null
          name: string
          slug: string
          study_focus?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          current_book?: string | null
          current_chapter?: number | null
          description?: string
          discussion_count?: number | null
          group_type?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          language_code?: string | null
          leader_id?: string
          meeting_schedule?: string | null
          member_count?: number | null
          name?: string
          slug?: string
          study_focus?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
      blog_authors: {
        Row: {
          avatar_url: string | null
          bio_am: string | null
          bio_en: string | null
          bio_ti: string | null
          created_at: string | null
          display_name: string
          email: string | null
          id: string
          is_verified: boolean | null
          post_count: number | null
          social_media: Json | null
          updated_at: string | null
          user_id: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio_am?: string | null
          bio_en?: string | null
          bio_ti?: string | null
          created_at?: string | null
          display_name: string
          email?: string | null
          id?: string
          is_verified?: boolean | null
          post_count?: number | null
          social_media?: Json | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio_am?: string | null
          bio_en?: string | null
          bio_ti?: string | null
          created_at?: string | null
          display_name?: string
          email?: string | null
          id?: string
          is_verified?: boolean | null
          post_count?: number | null
          social_media?: Json | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description_am: string | null
          description_en: string | null
          description_ti: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name_am: string | null
          name_en: string
          name_ti: string | null
          parent_category_id: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description_am?: string | null
          description_en?: string | null
          description_ti?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_am?: string | null
          name_en: string
          name_ti?: string | null
          parent_category_id?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description_am?: string | null
          description_en?: string | null
          description_ti?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_am?: string | null
          name_en?: string
          name_ti?: string | null
          parent_category_id?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_approved: boolean | null
          is_highlighted: boolean | null
          like_count: number | null
          parent_comment_id: string | null
          post_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_highlighted?: boolean | null
          like_count?: number | null
          parent_comment_id?: string | null
          post_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          is_highlighted?: boolean | null
          like_count?: number | null
          parent_comment_id?: string | null
          post_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_post_likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          allow_comments: boolean | null
          audio_url: string | null
          author_id: string | null
          category_id: string | null
          comment_count: number | null
          content_am: string | null
          content_en: string | null
          content_ti: string | null
          created_at: string | null
          excerpt_am: string | null
          excerpt_en: string | null
          excerpt_ti: string | null
          featured_image: string | null
          gallery_images: string[] | null
          id: string
          is_featured: boolean | null
          is_pinned: boolean | null
          like_count: number | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          post_type: string | null
          published_at: string | null
          reading_time_minutes: number | null
          scheduled_for: string | null
          scripture_references: string[] | null
          share_count: number | null
          slug: string
          status: string | null
          tags: string[] | null
          title_am: string | null
          title_en: string
          title_ti: string | null
          updated_at: string | null
          video_url: string | null
          view_count: number | null
          word_count: number | null
        }
        Insert: {
          allow_comments?: boolean | null
          audio_url?: string | null
          author_id?: string | null
          category_id?: string | null
          comment_count?: number | null
          content_am?: string | null
          content_en?: string | null
          content_ti?: string | null
          created_at?: string | null
          excerpt_am?: string | null
          excerpt_en?: string | null
          excerpt_ti?: string | null
          featured_image?: string | null
          gallery_images?: string[] | null
          id?: string
          is_featured?: boolean | null
          is_pinned?: boolean | null
          like_count?: number | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          post_type?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          scheduled_for?: string | null
          scripture_references?: string[] | null
          share_count?: number | null
          slug: string
          status?: string | null
          tags?: string[] | null
          title_am?: string | null
          title_en: string
          title_ti?: string | null
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
          word_count?: number | null
        }
        Update: {
          allow_comments?: boolean | null
          audio_url?: string | null
          author_id?: string | null
          category_id?: string | null
          comment_count?: number | null
          content_am?: string | null
          content_en?: string | null
          content_ti?: string | null
          created_at?: string | null
          excerpt_am?: string | null
          excerpt_en?: string | null
          excerpt_ti?: string | null
          featured_image?: string | null
          gallery_images?: string[] | null
          id?: string
          is_featured?: boolean | null
          is_pinned?: boolean | null
          like_count?: number | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          post_type?: string | null
          published_at?: string | null
          reading_time_minutes?: number | null
          scheduled_for?: string | null
          scripture_references?: string[] | null
          share_count?: number | null
          slug?: string
          status?: string | null
          tags?: string[] | null
          title_am?: string | null
          title_en?: string
          title_ti?: string | null
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
          word_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "blog_authors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
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
      church_contacts: {
        Row: {
          church_id: number
          created_at: string | null
          display_order: number | null
          email: string | null
          id: number
          is_primary: boolean | null
          name: string
          phone: string | null
          role: string | null
          title: string | null
        }
        Insert: {
          church_id: number
          created_at?: string | null
          display_order?: number | null
          email?: string | null
          id?: number
          is_primary?: boolean | null
          name: string
          phone?: string | null
          role?: string | null
          title?: string | null
        }
        Update: {
          church_id?: number
          created_at?: string | null
          display_order?: number | null
          email?: string | null
          id?: number
          is_primary?: boolean | null
          name?: string
          phone?: string | null
          role?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "church_contacts_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      church_denominations: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          display_order: number | null
          id: number
          is_active: boolean | null
          name: string
          parent_denomination_id: number | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          name: string
          parent_denomination_id?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          name?: string
          parent_denomination_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "church_denominations_parent_denomination_id_fkey"
            columns: ["parent_denomination_id"]
            isOneToOne: false
            referencedRelation: "church_denominations"
            referencedColumns: ["id"]
          },
        ]
      }
      church_events: {
        Row: {
          church_id: number
          created_at: string | null
          description: string | null
          end_time: string | null
          event_date: string
          id: number
          is_online: boolean | null
          is_recurring: boolean | null
          location_details: string | null
          online_url: string | null
          recurrence_pattern: string | null
          start_time: string | null
          title: string
        }
        Insert: {
          church_id: number
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_date: string
          id?: number
          is_online?: boolean | null
          is_recurring?: boolean | null
          location_details?: string | null
          online_url?: string | null
          recurrence_pattern?: string | null
          start_time?: string | null
          title: string
        }
        Update: {
          church_id?: number
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          event_date?: string
          id?: number
          is_online?: boolean | null
          is_recurring?: boolean | null
          location_details?: string | null
          online_url?: string | null
          recurrence_pattern?: string | null
          start_time?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_events_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      church_reviews: {
        Row: {
          church_id: number
          created_at: string | null
          helpful_count: number | null
          id: string
          is_verified_visit: boolean | null
          rating: number
          review_text: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          church_id: number
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_visit?: boolean | null
          rating: number
          review_text?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          church_id?: number
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_verified_visit?: boolean | null
          rating?: number
          review_text?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_reviews_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      church_services: {
        Row: {
          church_id: number
          created_at: string | null
          day_of_week: number | null
          description: string | null
          duration_minutes: number | null
          id: number
          is_livestreamed: boolean | null
          language: string | null
          livestream_url: string | null
          service_name: string
          service_type: string
          time: string | null
          updated_at: string | null
        }
        Insert: {
          church_id: number
          created_at?: string | null
          day_of_week?: number | null
          description?: string | null
          duration_minutes?: number | null
          id?: number
          is_livestreamed?: boolean | null
          language?: string | null
          livestream_url?: string | null
          service_name: string
          service_type: string
          time?: string | null
          updated_at?: string | null
        }
        Update: {
          church_id?: number
          created_at?: string | null
          day_of_week?: number | null
          description?: string | null
          duration_minutes?: number | null
          id?: number
          is_livestreamed?: boolean | null
          language?: string | null
          livestream_url?: string | null
          service_name?: string
          service_type?: string
          time?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "church_services_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      churches: {
        Row: {
          address: string | null
          capacity: number | null
          city: string
          country: string
          country_code: string
          created_at: string | null
          created_by: string | null
          denomination_id: number | null
          description: string | null
          email: string | null
          facebook_url: string | null
          favorite_count: number | null
          founding_year: number | null
          gallery_images: string[] | null
          has_livestream: boolean | null
          has_parking: boolean | null
          has_sunday_school: boolean | null
          has_wheelchair_access: boolean | null
          has_youth_ministry: boolean | null
          id: number
          instagram_url: string | null
          is_active: boolean | null
          is_verified: boolean | null
          languages: string[] | null
          latitude: number | null
          location: unknown
          longitude: number | null
          main_image_url: string | null
          name: string
          phone: string | null
          postal_code: string | null
          priest_pastor_name: string | null
          primary_language: string | null
          rating_average: number | null
          rating_count: number | null
          search_vector: unknown
          slug: string
          state_province: string | null
          updated_at: string | null
          verification_date: string | null
          view_count: number | null
          website: string | null
          youtube_url: string | null
        }
        Insert: {
          address?: string | null
          capacity?: number | null
          city: string
          country: string
          country_code: string
          created_at?: string | null
          created_by?: string | null
          denomination_id?: number | null
          description?: string | null
          email?: string | null
          facebook_url?: string | null
          favorite_count?: number | null
          founding_year?: number | null
          gallery_images?: string[] | null
          has_livestream?: boolean | null
          has_parking?: boolean | null
          has_sunday_school?: boolean | null
          has_wheelchair_access?: boolean | null
          has_youth_ministry?: boolean | null
          id?: number
          instagram_url?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          main_image_url?: string | null
          name: string
          phone?: string | null
          postal_code?: string | null
          priest_pastor_name?: string | null
          primary_language?: string | null
          rating_average?: number | null
          rating_count?: number | null
          search_vector?: unknown
          slug: string
          state_province?: string | null
          updated_at?: string | null
          verification_date?: string | null
          view_count?: number | null
          website?: string | null
          youtube_url?: string | null
        }
        Update: {
          address?: string | null
          capacity?: number | null
          city?: string
          country?: string
          country_code?: string
          created_at?: string | null
          created_by?: string | null
          denomination_id?: number | null
          description?: string | null
          email?: string | null
          facebook_url?: string | null
          favorite_count?: number | null
          founding_year?: number | null
          gallery_images?: string[] | null
          has_livestream?: boolean | null
          has_parking?: boolean | null
          has_sunday_school?: boolean | null
          has_wheelchair_access?: boolean | null
          has_youth_ministry?: boolean | null
          id?: number
          instagram_url?: string | null
          is_active?: boolean | null
          is_verified?: boolean | null
          languages?: string[] | null
          latitude?: number | null
          location?: unknown
          longitude?: number | null
          main_image_url?: string | null
          name?: string
          phone?: string | null
          postal_code?: string | null
          priest_pastor_name?: string | null
          primary_language?: string | null
          rating_average?: number | null
          rating_count?: number | null
          search_vector?: unknown
          slug?: string
          state_province?: string | null
          updated_at?: string | null
          verification_date?: string | null
          view_count?: number | null
          website?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "churches_denomination_id_fkey"
            columns: ["denomination_id"]
            isOneToOne: false
            referencedRelation: "church_denominations"
            referencedColumns: ["id"]
          },
        ]
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
      daily_prayers: {
        Row: {
          author: string | null
          created_at: string | null
          display_order: number | null
          id: number
          is_active: boolean | null
          language_code: string
          occasion: string
          prayer_text: string
          prayer_type: string
          source: string | null
          title: string
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          language_code: string
          occasion: string
          prayer_text: string
          prayer_type: string
          source?: string | null
          title: string
        }
        Update: {
          author?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: number
          is_active?: boolean | null
          language_code?: string
          occasion?: string
          prayer_text?: string
          prayer_type?: string
          source?: string | null
          title?: string
        }
        Relationships: []
      }
      event_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description_am: string | null
          description_en: string | null
          description_ti: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name_am: string | null
          name_en: string
          name_ti: string | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description_am?: string | null
          description_en?: string | null
          description_ti?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_am?: string | null
          name_en: string
          name_ti?: string | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description_am?: string | null
          description_en?: string | null
          description_ti?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name_am?: string | null
          name_en?: string
          name_ti?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      event_comments: {
        Row: {
          content: string
          created_at: string | null
          event_id: string
          id: string
          is_approved: boolean | null
          parent_comment_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          event_id: string
          id?: string
          is_approved?: boolean | null
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          event_id?: string
          id?: string
          is_approved?: boolean | null
          parent_comment_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_comments_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "event_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      event_rsvps: {
        Row: {
          created_at: string | null
          event_id: string
          id: string
          notes: string | null
          number_of_guests: number | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          event_id: string
          id?: string
          notes?: string | null
          number_of_guests?: number | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          number_of_guests?: number | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string | null
          category_id: string | null
          church_id: number | null
          city: string | null
          country: string | null
          created_at: string | null
          description_am: string | null
          description_en: string | null
          description_ti: string | null
          end_date: string
          event_type: string | null
          featured_image: string | null
          gallery_images: string[] | null
          id: string
          is_all_day: boolean | null
          is_featured: boolean | null
          latitude: number | null
          location_type: string | null
          longitude: number | null
          max_attendees: number | null
          meeting_password: string | null
          meeting_url: string | null
          organizer_id: string | null
          postal_code: string | null
          recurrence_rule: string | null
          registration_deadline: string | null
          registration_url: string | null
          requires_registration: boolean | null
          start_date: string
          state: string | null
          status: string | null
          tags: string[] | null
          timezone: string | null
          title_am: string | null
          title_en: string
          title_ti: string | null
          updated_at: string | null
          venue_name: string | null
          view_count: number | null
        }
        Insert: {
          address?: string | null
          category_id?: string | null
          church_id?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description_am?: string | null
          description_en?: string | null
          description_ti?: string | null
          end_date: string
          event_type?: string | null
          featured_image?: string | null
          gallery_images?: string[] | null
          id?: string
          is_all_day?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          location_type?: string | null
          longitude?: number | null
          max_attendees?: number | null
          meeting_password?: string | null
          meeting_url?: string | null
          organizer_id?: string | null
          postal_code?: string | null
          recurrence_rule?: string | null
          registration_deadline?: string | null
          registration_url?: string | null
          requires_registration?: boolean | null
          start_date: string
          state?: string | null
          status?: string | null
          tags?: string[] | null
          timezone?: string | null
          title_am?: string | null
          title_en: string
          title_ti?: string | null
          updated_at?: string | null
          venue_name?: string | null
          view_count?: number | null
        }
        Update: {
          address?: string | null
          category_id?: string | null
          church_id?: number | null
          city?: string | null
          country?: string | null
          created_at?: string | null
          description_am?: string | null
          description_en?: string | null
          description_ti?: string | null
          end_date?: string
          event_type?: string | null
          featured_image?: string | null
          gallery_images?: string[] | null
          id?: string
          is_all_day?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          location_type?: string | null
          longitude?: number | null
          max_attendees?: number | null
          meeting_password?: string | null
          meeting_url?: string | null
          organizer_id?: string | null
          postal_code?: string | null
          recurrence_rule?: string | null
          registration_deadline?: string | null
          registration_url?: string | null
          requires_registration?: boolean | null
          start_date?: string
          state?: string | null
          status?: string | null
          tags?: string[] | null
          timezone?: string | null
          title_am?: string | null
          title_en?: string
          title_ti?: string | null
          updated_at?: string | null
          venue_name?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "events_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      fasting_calendar: {
        Row: {
          allowed_foods: string[] | null
          created_at: string | null
          denomination_category: string | null
          description: string | null
          end_date: string
          fast_name: string
          fast_type: string
          fasting_level: string | null
          id: number
          is_recurring: boolean | null
          language_code: string
          recurrence_rule: string | null
          restricted_foods: string[] | null
          start_date: string
        }
        Insert: {
          allowed_foods?: string[] | null
          created_at?: string | null
          denomination_category?: string | null
          description?: string | null
          end_date: string
          fast_name: string
          fast_type: string
          fasting_level?: string | null
          id?: number
          is_recurring?: boolean | null
          language_code: string
          recurrence_rule?: string | null
          restricted_foods?: string[] | null
          start_date: string
        }
        Update: {
          allowed_foods?: string[] | null
          created_at?: string | null
          denomination_category?: string | null
          description?: string | null
          end_date?: string
          fast_name?: string
          fast_type?: string
          fasting_level?: string | null
          id?: number
          is_recurring?: boolean | null
          language_code?: string
          recurrence_rule?: string | null
          restricted_foods?: string[] | null
          start_date?: string
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
      forum_categories: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          icon: string | null
          id: number
          is_active: boolean | null
          is_locked: boolean | null
          language_code: string | null
          name: string
          parent_category_id: number | null
          post_count: number | null
          requires_approval: boolean | null
          slug: string
          topic_count: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          is_locked?: boolean | null
          language_code?: string | null
          name: string
          parent_category_id?: number | null
          post_count?: number | null
          requires_approval?: boolean | null
          slug: string
          topic_count?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          icon?: string | null
          id?: number
          is_active?: boolean | null
          is_locked?: boolean | null
          language_code?: string | null
          name?: string
          parent_category_id?: number | null
          post_count?: number | null
          requires_approval?: boolean | null
          slug?: string
          topic_count?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_categories_parent_category_id_fkey"
            columns: ["parent_category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_likes: {
        Row: {
          created_at: string | null
          discussion_id: string | null
          id: string
          post_id: string | null
          reply_id: string | null
          topic_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          post_id?: string | null
          reply_id?: string | null
          topic_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          post_id?: string | null
          reply_id?: string | null
          topic_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_likes_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "bible_study_discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_likes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "bible_study_discussion_replies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_likes_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
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
        Relationships: []
      }
      forum_posts: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_best_answer: boolean | null
          like_count: number | null
          parent_post_id: string | null
          topic_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_best_answer?: boolean | null
          like_count?: number | null
          parent_post_id?: string | null
          topic_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_best_answer?: boolean | null
          like_count?: number | null
          parent_post_id?: string | null
          topic_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
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
          category_id: number
          content: string
          created_at: string | null
          id: string
          is_locked: boolean | null
          is_pinned: boolean | null
          last_activity_at: string | null
          like_count: number | null
          reply_count: number | null
          slug: string
          tags: string[] | null
          title: string
          topic_type: string | null
          updated_at: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          category_id: number
          content: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_activity_at?: string | null
          like_count?: number | null
          reply_count?: number | null
          slug: string
          tags?: string[] | null
          title: string
          topic_type?: string | null
          updated_at?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          category_id?: number
          content?: string
          created_at?: string | null
          id?: string
          is_locked?: boolean | null
          is_pinned?: boolean | null
          last_activity_at?: string | null
          like_count?: number | null
          reply_count?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          topic_type?: string | null
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_topics_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "forum_categories"
            referencedColumns: ["id"]
          },
        ]
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
      prayer_comments: {
        Row: {
          comment_text: string
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          is_approved: boolean | null
          is_flagged: boolean | null
          prayer_request_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment_text: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_approved?: boolean | null
          is_flagged?: boolean | null
          prayer_request_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment_text?: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_approved?: boolean | null
          is_flagged?: boolean | null
          prayer_request_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_comments_prayer_request_id_fkey"
            columns: ["prayer_request_id"]
            isOneToOne: false
            referencedRelation: "prayer_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_requests: {
        Row: {
          answered_at: string | null
          answered_description: string | null
          category: string | null
          comment_count: number | null
          created_at: string | null
          description: string
          expires_at: string | null
          id: string
          is_anonymous: boolean | null
          is_public: boolean | null
          prayer_count: number | null
          search_vector: unknown
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answered_at?: string | null
          answered_description?: string | null
          category?: string | null
          comment_count?: number | null
          created_at?: string | null
          description: string
          expires_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_public?: boolean | null
          prayer_count?: number | null
          search_vector?: unknown
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answered_at?: string | null
          answered_description?: string | null
          category?: string | null
          comment_count?: number | null
          created_at?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_public?: boolean | null
          prayer_count?: number | null
          search_vector?: unknown
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      prayer_responses: {
        Row: {
          id: string
          message: string | null
          prayed_at: string | null
          prayer_request_id: string
          user_id: string
        }
        Insert: {
          id?: string
          message?: string | null
          prayed_at?: string | null
          prayer_request_id: string
          user_id: string
        }
        Update: {
          id?: string
          message?: string | null
          prayed_at?: string | null
          prayer_request_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_responses_prayer_request_id_fkey"
            columns: ["prayer_request_id"]
            isOneToOne: false
            referencedRelation: "prayer_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      preachers: {
        Row: {
          bio_am: string | null
          bio_en: string | null
          bio_ti: string | null
          church_id: number | null
          created_at: string | null
          email: string | null
          id: string
          is_featured: boolean | null
          name_am: string | null
          name_en: string
          name_ti: string | null
          phone: string | null
          photo_url: string | null
          sermon_count: number | null
          social_media: Json | null
          title: string | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          bio_am?: string | null
          bio_en?: string | null
          bio_ti?: string | null
          church_id?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_featured?: boolean | null
          name_am?: string | null
          name_en: string
          name_ti?: string | null
          phone?: string | null
          photo_url?: string | null
          sermon_count?: number | null
          social_media?: Json | null
          title?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          bio_am?: string | null
          bio_en?: string | null
          bio_ti?: string | null
          church_id?: number | null
          created_at?: string | null
          email?: string | null
          id?: string
          is_featured?: boolean | null
          name_am?: string | null
          name_en?: string
          name_ti?: string | null
          phone?: string | null
          photo_url?: string | null
          sermon_count?: number | null
          social_media?: Json | null
          title?: string | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "preachers_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
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
      reading_plan_day_translations: {
        Row: {
          created_at: string | null
          day_id: number
          devotional_content: string | null
          id: number
          language_code: string
          prayer_prompt: string | null
          reflection_questions: string[] | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_id: number
          devotional_content?: string | null
          id?: number
          language_code: string
          prayer_prompt?: string | null
          reflection_questions?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_id?: number
          devotional_content?: string | null
          id?: number
          language_code?: string
          prayer_prompt?: string | null
          reflection_questions?: string[] | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reading_plan_day_translations_day_id_fkey"
            columns: ["day_id"]
            isOneToOne: false
            referencedRelation: "reading_plan_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_plan_day_translations_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "supported_languages"
            referencedColumns: ["code"]
          },
        ]
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
      reading_plan_translations: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          language_code: string
          plan_id: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          language_code: string
          plan_id: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          language_code?: string
          plan_id?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reading_plan_translations_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "supported_languages"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "reading_plan_translations_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "popular_reading_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reading_plan_translations_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "reading_plans"
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
      saints_calendar: {
        Row: {
          biography: string | null
          created_at: string | null
          denomination_category: string | null
          feast_date: string
          icon_url: string | null
          id: number
          is_recurring: boolean | null
          language_code: string
          saint_name: string
          significance: string | null
          title: string | null
        }
        Insert: {
          biography?: string | null
          created_at?: string | null
          denomination_category?: string | null
          feast_date: string
          icon_url?: string | null
          id?: number
          is_recurring?: boolean | null
          language_code: string
          saint_name: string
          significance?: string | null
          title?: string | null
        }
        Update: {
          biography?: string | null
          created_at?: string | null
          denomination_category?: string | null
          feast_date?: string
          icon_url?: string | null
          id?: number
          is_recurring?: boolean | null
          language_code?: string
          saint_name?: string
          significance?: string | null
          title?: string | null
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
      sermon_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_approved: boolean | null
          like_count: number | null
          parent_comment_id: string | null
          sermon_id: string
          timestamp_seconds: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          like_count?: number | null
          parent_comment_id?: string | null
          sermon_id: string
          timestamp_seconds?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          like_count?: number | null
          parent_comment_id?: string | null
          sermon_id?: string
          timestamp_seconds?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sermon_comments_parent_comment_id_fkey"
            columns: ["parent_comment_id"]
            isOneToOne: false
            referencedRelation: "sermon_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sermon_comments_sermon_id_fkey"
            columns: ["sermon_id"]
            isOneToOne: false
            referencedRelation: "sermons"
            referencedColumns: ["id"]
          },
        ]
      }
      sermon_downloads: {
        Row: {
          download_type: string
          downloaded_at: string | null
          id: string
          ip_address: unknown
          sermon_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          download_type: string
          downloaded_at?: string | null
          id?: string
          ip_address?: unknown
          sermon_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          download_type?: string
          downloaded_at?: string | null
          id?: string
          ip_address?: unknown
          sermon_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sermon_downloads_sermon_id_fkey"
            columns: ["sermon_id"]
            isOneToOne: false
            referencedRelation: "sermons"
            referencedColumns: ["id"]
          },
        ]
      }
      sermon_likes: {
        Row: {
          created_at: string | null
          id: string
          sermon_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          sermon_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          sermon_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sermon_likes_sermon_id_fkey"
            columns: ["sermon_id"]
            isOneToOne: false
            referencedRelation: "sermons"
            referencedColumns: ["id"]
          },
        ]
      }
      sermon_series: {
        Row: {
          church_id: number | null
          created_at: string | null
          description_am: string | null
          description_en: string | null
          description_ti: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          sermon_count: number | null
          slug: string
          start_date: string | null
          thumbnail_url: string | null
          title_am: string | null
          title_en: string
          title_ti: string | null
          updated_at: string | null
        }
        Insert: {
          church_id?: number | null
          created_at?: string | null
          description_am?: string | null
          description_en?: string | null
          description_ti?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          sermon_count?: number | null
          slug: string
          start_date?: string | null
          thumbnail_url?: string | null
          title_am?: string | null
          title_en: string
          title_ti?: string | null
          updated_at?: string | null
        }
        Update: {
          church_id?: number | null
          created_at?: string | null
          description_am?: string | null
          description_en?: string | null
          description_ti?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          sermon_count?: number | null
          slug?: string
          start_date?: string | null
          thumbnail_url?: string | null
          title_am?: string | null
          title_en?: string
          title_ti?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sermon_series_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      sermons: {
        Row: {
          allow_downloads: boolean | null
          audio_duration_seconds: number | null
          audio_file_size_mb: number | null
          audio_url: string | null
          church_id: number | null
          created_at: string | null
          description_am: string | null
          description_en: string | null
          description_ti: string | null
          download_count: number | null
          id: string
          is_featured: boolean | null
          like_count: number | null
          preacher_id: string | null
          primary_scripture: string | null
          secondary_scriptures: string[] | null
          series_id: string | null
          sermon_date: string
          sermon_notes_url: string | null
          sermon_type: string | null
          share_count: number | null
          slug: string
          status: string | null
          study_guide_url: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title_am: string | null
          title_en: string
          title_ti: string | null
          topics: string[] | null
          transcript_am: string | null
          transcript_en: string | null
          transcript_ti: string | null
          updated_at: string | null
          video_duration_seconds: number | null
          video_file_size_mb: number | null
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          allow_downloads?: boolean | null
          audio_duration_seconds?: number | null
          audio_file_size_mb?: number | null
          audio_url?: string | null
          church_id?: number | null
          created_at?: string | null
          description_am?: string | null
          description_en?: string | null
          description_ti?: string | null
          download_count?: number | null
          id?: string
          is_featured?: boolean | null
          like_count?: number | null
          preacher_id?: string | null
          primary_scripture?: string | null
          secondary_scriptures?: string[] | null
          series_id?: string | null
          sermon_date: string
          sermon_notes_url?: string | null
          sermon_type?: string | null
          share_count?: number | null
          slug: string
          status?: string | null
          study_guide_url?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title_am?: string | null
          title_en: string
          title_ti?: string | null
          topics?: string[] | null
          transcript_am?: string | null
          transcript_en?: string | null
          transcript_ti?: string | null
          updated_at?: string | null
          video_duration_seconds?: number | null
          video_file_size_mb?: number | null
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          allow_downloads?: boolean | null
          audio_duration_seconds?: number | null
          audio_file_size_mb?: number | null
          audio_url?: string | null
          church_id?: number | null
          created_at?: string | null
          description_am?: string | null
          description_en?: string | null
          description_ti?: string | null
          download_count?: number | null
          id?: string
          is_featured?: boolean | null
          like_count?: number | null
          preacher_id?: string | null
          primary_scripture?: string | null
          secondary_scriptures?: string[] | null
          series_id?: string | null
          sermon_date?: string
          sermon_notes_url?: string | null
          sermon_type?: string | null
          share_count?: number | null
          slug?: string
          status?: string | null
          study_guide_url?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title_am?: string | null
          title_en?: string
          title_ti?: string | null
          topics?: string[] | null
          transcript_am?: string | null
          transcript_en?: string | null
          transcript_ti?: string | null
          updated_at?: string | null
          video_duration_seconds?: number | null
          video_file_size_mb?: number | null
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sermons_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sermons_preacher_id_fkey"
            columns: ["preacher_id"]
            isOneToOne: false
            referencedRelation: "preachers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sermons_series_id_fkey"
            columns: ["series_id"]
            isOneToOne: false
            referencedRelation: "sermon_series"
            referencedColumns: ["id"]
          },
        ]
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
      spatial_ref_sys: {
        Row: {
          auth_name: string | null
          auth_srid: number | null
          proj4text: string | null
          srid: number
          srtext: string | null
        }
        Insert: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid: number
          srtext?: string | null
        }
        Update: {
          auth_name?: string | null
          auth_srid?: number | null
          proj4text?: string | null
          srid?: number
          srtext?: string | null
        }
        Relationships: []
      }
      supported_languages: {
        Row: {
          code: string
          created_at: string | null
          direction: string | null
          display_order: number | null
          flag_emoji: string | null
          id: number
          is_active: boolean | null
          name: string
          native_name: string
        }
        Insert: {
          code: string
          created_at?: string | null
          direction?: string | null
          display_order?: number | null
          flag_emoji?: string | null
          id?: number
          is_active?: boolean | null
          name: string
          native_name: string
        }
        Update: {
          code?: string
          created_at?: string | null
          direction?: string | null
          display_order?: number | null
          flag_emoji?: string | null
          id?: number
          is_active?: boolean | null
          name?: string
          native_name?: string
        }
        Relationships: []
      }
      ui_translations: {
        Row: {
          context: string | null
          created_at: string | null
          id: number
          language_code: string
          translation_key: string
          translation_text: string
          updated_at: string | null
        }
        Insert: {
          context?: string | null
          created_at?: string | null
          id?: number
          language_code: string
          translation_key: string
          translation_text: string
          updated_at?: string | null
        }
        Update: {
          context?: string | null
          created_at?: string | null
          id?: number
          language_code?: string
          translation_key?: string
          translation_text?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ui_translations_language_code_fkey"
            columns: ["language_code"]
            isOneToOne: false
            referencedRelation: "supported_languages"
            referencedColumns: ["code"]
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
      user_bookmarks: {
        Row: {
          created_at: string | null
          discussion_id: string | null
          id: string
          topic_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          topic_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          topic_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_bookmarks_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "bible_study_discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_bookmarks_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "forum_topics"
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
      user_favorite_churches: {
        Row: {
          church_id: number
          created_at: string | null
          notes: string | null
          user_id: string
        }
        Insert: {
          church_id: number
          created_at?: string | null
          notes?: string | null
          user_id: string
        }
        Update: {
          church_id?: number
          created_at?: string | null
          notes?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_churches_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      user_language_preferences: {
        Row: {
          created_at: string | null
          id: string
          preferred_bible_version_id: number | null
          preferred_language: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          preferred_bible_version_id?: number | null
          preferred_language: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          preferred_bible_version_id?: number | null
          preferred_language?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_language_preferences_preferred_language_fkey"
            columns: ["preferred_language"]
            isOneToOne: false
            referencedRelation: "supported_languages"
            referencedColumns: ["code"]
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
      user_prayer_journal: {
        Row: {
          created_at: string | null
          entry_date: string
          entry_text: string
          gratitude_items: string[] | null
          id: string
          mood: string | null
          prayer_topics: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          entry_date: string
          entry_text: string
          gratitude_items?: string[] | null
          id?: string
          mood?: string | null
          prayer_topics?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          entry_date?: string
          entry_text?: string
          gratitude_items?: string[] | null
          id?: string
          mood?: string | null
          prayer_topics?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_prayer_list: {
        Row: {
          answer_notes: string | null
          answered_at: string | null
          category: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          prayer_item: string
          reminder_enabled: boolean | null
          reminder_frequency: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          answer_notes?: string | null
          answered_at?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          prayer_item: string
          reminder_enabled?: boolean | null
          reminder_frequency?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          answer_notes?: string | null
          answered_at?: string | null
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          prayer_item?: string
          reminder_enabled?: boolean | null
          reminder_frequency?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      geography_columns: {
        Row: {
          coord_dimension: number | null
          f_geography_column: unknown
          f_table_catalog: unknown
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Relationships: []
      }
      geometry_columns: {
        Row: {
          coord_dimension: number | null
          f_geometry_column: unknown
          f_table_catalog: string | null
          f_table_name: unknown
          f_table_schema: unknown
          srid: number | null
          type: string | null
        }
        Insert: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Update: {
          coord_dimension?: number | null
          f_geometry_column?: unknown
          f_table_catalog?: string | null
          f_table_name?: unknown
          f_table_schema?: unknown
          srid?: number | null
          type?: string | null
        }
        Relationships: []
      }
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
      _postgis_deprecate: {
        Args: { newname: string; oldname: string; version: string }
        Returns: undefined
      }
      _postgis_index_extent: {
        Args: { col: string; tbl: unknown }
        Returns: unknown
      }
      _postgis_pgsql_version: { Args: never; Returns: string }
      _postgis_scripts_pgsql_version: { Args: never; Returns: string }
      _postgis_selectivity: {
        Args: { att_name: string; geom: unknown; mode?: string; tbl: unknown }
        Returns: number
      }
      _postgis_stats: {
        Args: { ""?: string; att_name: string; tbl: unknown }
        Returns: string
      }
      _st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_crosses: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      _st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      _st_intersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      _st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      _st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      _st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_sortablehash: { Args: { geom: unknown }; Returns: number }
      _st_touches: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      _st_voronoi: {
        Args: {
          clip?: unknown
          g1: unknown
          return_polygons?: boolean
          tolerance?: number
        }
        Returns: unknown
      }
      _st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      addauth: { Args: { "": string }; Returns: boolean }
      addgeometrycolumn:
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              column_name: string
              new_dim: number
              new_srid: number
              new_type: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              catalog_name: string
              column_name: string
              new_dim: number
              new_srid_in: number
              new_type: string
              schema_name: string
              table_name: string
              use_typmod?: boolean
            }
            Returns: string
          }
      award_badges: { Args: { mentor_id: string }; Returns: undefined }
      calculate_match_score: {
        Args: { profile_user_id: string; viewer_id: string }
        Returns: {
          match_percent: number
          matched_questions: number
          total_questions: number
        }[]
      }
      calculate_reading_time: { Args: { content: string }; Returns: number }
      disablelongtransactions: { Args: never; Returns: string }
      dropgeometrycolumn:
        | {
            Args: {
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
        | { Args: { column_name: string; table_name: string }; Returns: string }
        | {
            Args: {
              catalog_name: string
              column_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
      dropgeometrytable:
        | { Args: { schema_name: string; table_name: string }; Returns: string }
        | { Args: { table_name: string }; Returns: string }
        | {
            Args: {
              catalog_name: string
              schema_name: string
              table_name: string
            }
            Returns: string
          }
      enablelongtransactions: { Args: never; Returns: string }
      equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      find_nearby_churches: {
        Args: {
          lat: number
          lng: number
          radius: number
          result_limit?: number
        }
        Returns: {
          address: string
          city: string
          country: string
          country_code: string
          denomination_id: number
          description: string
          distance_km: number
          distance_meters: number
          email: string
          favorite_count: number
          has_livestream: boolean
          has_parking: boolean
          has_sunday_school: boolean
          has_wheelchair_access: boolean
          has_youth_ministry: boolean
          id: number
          is_active: boolean
          is_verified: boolean
          languages: string[]
          latitude: number
          longitude: number
          main_image_url: string
          name: string
          phone: string
          postal_code: string
          primary_language: string
          rating_average: number
          rating_count: number
          slug: string
          state_province: string
          view_count: number
          website: string
        }[]
      }
      geometry: { Args: { "": string }; Returns: unknown }
      geometry_above: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_below: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_cmp: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_contained_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_contains_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_distance_box: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_distance_centroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      geometry_eq: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_ge: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_gt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_le: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_left: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_lt: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overabove: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overbelow: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overlaps_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overleft: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_overright: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_right: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_same_3d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geometry_within: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      geomfromewkt: { Args: { "": string }; Returns: unknown }
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
      gettransactionid: { Args: never; Returns: unknown }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_views: { Args: { listing_id: string }; Returns: undefined }
      longtransactionsenabled: { Args: never; Returns: boolean }
      populate_geometry_columns:
        | { Args: { use_typmod?: boolean }; Returns: string }
        | { Args: { tbl_oid: unknown; use_typmod?: boolean }; Returns: number }
      postgis_constraint_dims: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_srid: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: number
      }
      postgis_constraint_type: {
        Args: { geomcolumn: string; geomschema: string; geomtable: string }
        Returns: string
      }
      postgis_extensions_upgrade: { Args: never; Returns: string }
      postgis_full_version: { Args: never; Returns: string }
      postgis_geos_version: { Args: never; Returns: string }
      postgis_lib_build_date: { Args: never; Returns: string }
      postgis_lib_revision: { Args: never; Returns: string }
      postgis_lib_version: { Args: never; Returns: string }
      postgis_libjson_version: { Args: never; Returns: string }
      postgis_liblwgeom_version: { Args: never; Returns: string }
      postgis_libprotobuf_version: { Args: never; Returns: string }
      postgis_libxml_version: { Args: never; Returns: string }
      postgis_proj_version: { Args: never; Returns: string }
      postgis_scripts_build_date: { Args: never; Returns: string }
      postgis_scripts_installed: { Args: never; Returns: string }
      postgis_scripts_released: { Args: never; Returns: string }
      postgis_svn_version: { Args: never; Returns: string }
      postgis_type_name: {
        Args: {
          coord_dimension: number
          geomname: string
          use_new_name?: boolean
        }
        Returns: string
      }
      postgis_version: { Args: never; Returns: string }
      postgis_wagyu_version: { Args: never; Returns: string }
      st_3dclosestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3ddistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dintersects: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_3dlongestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmakebox: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_3dmaxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_3dshortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_addpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_angle:
        | { Args: { line1: unknown; line2: unknown }; Returns: number }
        | {
            Args: { pt1: unknown; pt2: unknown; pt3: unknown; pt4?: unknown }
            Returns: number
          }
      st_area:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_asencodedpolyline: {
        Args: { geom: unknown; nprecision?: number }
        Returns: string
      }
      st_asewkt: { Args: { "": string }; Returns: string }
      st_asgeojson:
        | {
            Args: {
              geom_column?: string
              maxdecimaldigits?: number
              pretty_bool?: boolean
              r: Record<string, unknown>
            }
            Returns: string
          }
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_asgml:
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
              version: number
            }
            Returns: string
          }
        | {
            Args: {
              geog: unknown
              id?: string
              maxdecimaldigits?: number
              nprefix?: string
              options?: number
            }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_askml:
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; nprefix?: string }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_aslatlontext: {
        Args: { geom: unknown; tmpl?: string }
        Returns: string
      }
      st_asmarc21: { Args: { format?: string; geom: unknown }; Returns: string }
      st_asmvtgeom: {
        Args: {
          bounds: unknown
          buffer?: number
          clip_geom?: boolean
          extent?: number
          geom: unknown
        }
        Returns: unknown
      }
      st_assvg:
        | {
            Args: { geom: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | {
            Args: { geog: unknown; maxdecimaldigits?: number; rel?: number }
            Returns: string
          }
        | { Args: { "": string }; Returns: string }
      st_astext: { Args: { "": string }; Returns: string }
      st_astwkb:
        | {
            Args: {
              geom: unknown[]
              ids: number[]
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
        | {
            Args: {
              geom: unknown
              prec?: number
              prec_m?: number
              prec_z?: number
              with_boxes?: boolean
              with_sizes?: boolean
            }
            Returns: string
          }
      st_asx3d: {
        Args: { geom: unknown; maxdecimaldigits?: number; options?: number }
        Returns: string
      }
      st_azimuth:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | { Args: { geog1: unknown; geog2: unknown }; Returns: number }
      st_boundingdiagonal: {
        Args: { fits?: boolean; geom: unknown }
        Returns: unknown
      }
      st_buffer:
        | {
            Args: { geom: unknown; options?: string; radius: number }
            Returns: unknown
          }
        | {
            Args: { geom: unknown; quadsegs: number; radius: number }
            Returns: unknown
          }
      st_centroid: { Args: { "": string }; Returns: unknown }
      st_clipbybox2d: {
        Args: { box: unknown; geom: unknown }
        Returns: unknown
      }
      st_closestpoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_collect: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_concavehull: {
        Args: {
          param_allow_holes?: boolean
          param_geom: unknown
          param_pctconvex: number
        }
        Returns: unknown
      }
      st_contains: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_containsproperly: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_coorddim: { Args: { geometry: unknown }; Returns: number }
      st_coveredby:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_covers:
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_crosses: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_curvetoline: {
        Args: { flags?: number; geom: unknown; tol?: number; toltype?: number }
        Returns: unknown
      }
      st_delaunaytriangles: {
        Args: { flags?: number; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_difference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_disjoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_distance:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geog1: unknown; geog2: unknown; use_spheroid?: boolean }
            Returns: number
          }
      st_distancesphere:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: number }
        | {
            Args: { geom1: unknown; geom2: unknown; radius: number }
            Returns: number
          }
      st_distancespheroid: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_dwithin: {
        Args: {
          geog1: unknown
          geog2: unknown
          tolerance: number
          use_spheroid?: boolean
        }
        Returns: boolean
      }
      st_equals: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_expand:
        | {
            Args: {
              dm?: number
              dx: number
              dy: number
              dz?: number
              geom: unknown
            }
            Returns: unknown
          }
        | {
            Args: { box: unknown; dx: number; dy: number; dz?: number }
            Returns: unknown
          }
        | { Args: { box: unknown; dx: number; dy: number }; Returns: unknown }
      st_force3d: { Args: { geom: unknown; zvalue?: number }; Returns: unknown }
      st_force3dm: {
        Args: { geom: unknown; mvalue?: number }
        Returns: unknown
      }
      st_force3dz: {
        Args: { geom: unknown; zvalue?: number }
        Returns: unknown
      }
      st_force4d: {
        Args: { geom: unknown; mvalue?: number; zvalue?: number }
        Returns: unknown
      }
      st_generatepoints:
        | { Args: { area: unknown; npoints: number }; Returns: unknown }
        | {
            Args: { area: unknown; npoints: number; seed: number }
            Returns: unknown
          }
      st_geogfromtext: { Args: { "": string }; Returns: unknown }
      st_geographyfromtext: { Args: { "": string }; Returns: unknown }
      st_geohash:
        | { Args: { geom: unknown; maxchars?: number }; Returns: string }
        | { Args: { geog: unknown; maxchars?: number }; Returns: string }
      st_geomcollfromtext: { Args: { "": string }; Returns: unknown }
      st_geometricmedian: {
        Args: {
          fail_if_not_converged?: boolean
          g: unknown
          max_iter?: number
          tolerance?: number
        }
        Returns: unknown
      }
      st_geometryfromtext: { Args: { "": string }; Returns: unknown }
      st_geomfromewkt: { Args: { "": string }; Returns: unknown }
      st_geomfromgeojson:
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": Json }; Returns: unknown }
        | { Args: { "": string }; Returns: unknown }
      st_geomfromgml: { Args: { "": string }; Returns: unknown }
      st_geomfromkml: { Args: { "": string }; Returns: unknown }
      st_geomfrommarc21: { Args: { marc21xml: string }; Returns: unknown }
      st_geomfromtext: { Args: { "": string }; Returns: unknown }
      st_gmltosql: { Args: { "": string }; Returns: unknown }
      st_hasarc: { Args: { geometry: unknown }; Returns: boolean }
      st_hausdorffdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_hexagon: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_hexagongrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_interpolatepoint: {
        Args: { line: unknown; point: unknown }
        Returns: number
      }
      st_intersection: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_intersects:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
        | { Args: { geog1: unknown; geog2: unknown }; Returns: boolean }
      st_isvaliddetail: {
        Args: { flags?: number; geom: unknown }
        Returns: Database["public"]["CompositeTypes"]["valid_detail"]
        SetofOptions: {
          from: "*"
          to: "valid_detail"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      st_length:
        | { Args: { geog: unknown; use_spheroid?: boolean }; Returns: number }
        | { Args: { "": string }; Returns: number }
      st_letters: { Args: { font?: Json; letters: string }; Returns: unknown }
      st_linecrossingdirection: {
        Args: { line1: unknown; line2: unknown }
        Returns: number
      }
      st_linefromencodedpolyline: {
        Args: { nprecision?: number; txtin: string }
        Returns: unknown
      }
      st_linefromtext: { Args: { "": string }; Returns: unknown }
      st_linelocatepoint: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_linetocurve: { Args: { geometry: unknown }; Returns: unknown }
      st_locatealong: {
        Args: { geometry: unknown; leftrightoffset?: number; measure: number }
        Returns: unknown
      }
      st_locatebetween: {
        Args: {
          frommeasure: number
          geometry: unknown
          leftrightoffset?: number
          tomeasure: number
        }
        Returns: unknown
      }
      st_locatebetweenelevations: {
        Args: { fromelevation: number; geometry: unknown; toelevation: number }
        Returns: unknown
      }
      st_longestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makebox2d: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makeline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_makevalid: {
        Args: { geom: unknown; params: string }
        Returns: unknown
      }
      st_maxdistance: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: number
      }
      st_minimumboundingcircle: {
        Args: { inputgeom: unknown; segs_per_quarter?: number }
        Returns: unknown
      }
      st_mlinefromtext: { Args: { "": string }; Returns: unknown }
      st_mpointfromtext: { Args: { "": string }; Returns: unknown }
      st_mpolyfromtext: { Args: { "": string }; Returns: unknown }
      st_multilinestringfromtext: { Args: { "": string }; Returns: unknown }
      st_multipointfromtext: { Args: { "": string }; Returns: unknown }
      st_multipolygonfromtext: { Args: { "": string }; Returns: unknown }
      st_node: { Args: { g: unknown }; Returns: unknown }
      st_normalize: { Args: { geom: unknown }; Returns: unknown }
      st_offsetcurve: {
        Args: { distance: number; line: unknown; params?: string }
        Returns: unknown
      }
      st_orderingequals: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_overlaps: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: boolean
      }
      st_perimeter: {
        Args: { geog: unknown; use_spheroid?: boolean }
        Returns: number
      }
      st_pointfromtext: { Args: { "": string }; Returns: unknown }
      st_pointm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
        }
        Returns: unknown
      }
      st_pointz: {
        Args: {
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_pointzm: {
        Args: {
          mcoordinate: number
          srid?: number
          xcoordinate: number
          ycoordinate: number
          zcoordinate: number
        }
        Returns: unknown
      }
      st_polyfromtext: { Args: { "": string }; Returns: unknown }
      st_polygonfromtext: { Args: { "": string }; Returns: unknown }
      st_project: {
        Args: { azimuth: number; distance: number; geog: unknown }
        Returns: unknown
      }
      st_quantizecoordinates: {
        Args: {
          g: unknown
          prec_m?: number
          prec_x: number
          prec_y?: number
          prec_z?: number
        }
        Returns: unknown
      }
      st_reduceprecision: {
        Args: { geom: unknown; gridsize: number }
        Returns: unknown
      }
      st_relate: { Args: { geom1: unknown; geom2: unknown }; Returns: string }
      st_removerepeatedpoints: {
        Args: { geom: unknown; tolerance?: number }
        Returns: unknown
      }
      st_segmentize: {
        Args: { geog: unknown; max_segment_length: number }
        Returns: unknown
      }
      st_setsrid:
        | { Args: { geom: unknown; srid: number }; Returns: unknown }
        | { Args: { geog: unknown; srid: number }; Returns: unknown }
      st_sharedpaths: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_shortestline: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_simplifypolygonhull: {
        Args: { geom: unknown; is_outer?: boolean; vertex_fraction: number }
        Returns: unknown
      }
      st_split: { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
      st_square: {
        Args: { cell_i: number; cell_j: number; origin?: unknown; size: number }
        Returns: unknown
      }
      st_squaregrid: {
        Args: { bounds: unknown; size: number }
        Returns: Record<string, unknown>[]
      }
      st_srid:
        | { Args: { geom: unknown }; Returns: number }
        | { Args: { geog: unknown }; Returns: number }
      st_subdivide: {
        Args: { geom: unknown; gridsize?: number; maxvertices?: number }
        Returns: unknown[]
      }
      st_swapordinates: {
        Args: { geom: unknown; ords: unknown }
        Returns: unknown
      }
      st_symdifference: {
        Args: { geom1: unknown; geom2: unknown; gridsize?: number }
        Returns: unknown
      }
      st_symmetricdifference: {
        Args: { geom1: unknown; geom2: unknown }
        Returns: unknown
      }
      st_tileenvelope: {
        Args: {
          bounds?: unknown
          margin?: number
          x: number
          y: number
          zoom: number
        }
        Returns: unknown
      }
      st_touches: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_transform:
        | { Args: { geom: unknown; to_proj: string }; Returns: unknown }
        | {
            Args: { from_proj: string; geom: unknown; to_srid: number }
            Returns: unknown
          }
        | {
            Args: { from_proj: string; geom: unknown; to_proj: string }
            Returns: unknown
          }
      st_triangulatepolygon: { Args: { g1: unknown }; Returns: unknown }
      st_union:
        | { Args: { geom1: unknown; geom2: unknown }; Returns: unknown }
        | {
            Args: { geom1: unknown; geom2: unknown; gridsize: number }
            Returns: unknown
          }
      st_voronoilines: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_voronoipolygons: {
        Args: { extend_to?: unknown; g1: unknown; tolerance?: number }
        Returns: unknown
      }
      st_within: { Args: { geom1: unknown; geom2: unknown }; Returns: boolean }
      st_wkbtosql: { Args: { wkb: string }; Returns: unknown }
      st_wkttosql: { Args: { "": string }; Returns: unknown }
      st_wrapx: {
        Args: { geom: unknown; move: number; wrap: number }
        Returns: unknown
      }
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
      unlockrows: { Args: { "": string }; Returns: number }
      updategeometrysrid: {
        Args: {
          catalogn_name: string
          column_name: string
          new_srid_in: number
          schema_name: string
          table_name: string
        }
        Returns: string
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
      geometry_dump: {
        path: number[] | null
        geom: unknown
      }
      valid_detail: {
        valid: boolean | null
        reason: string | null
        location: unknown
      }
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
