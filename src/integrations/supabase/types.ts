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
      ab_test_assignments: {
        Row: {
          assigned_at: string | null
          conversion_value: number | null
          converted_at: string | null
          id: string
          test_name: string
          user_identifier: string
          variant: string
        }
        Insert: {
          assigned_at?: string | null
          conversion_value?: number | null
          converted_at?: string | null
          id?: string
          test_name: string
          user_identifier: string
          variant: string
        }
        Update: {
          assigned_at?: string | null
          conversion_value?: number | null
          converted_at?: string | null
          id?: string
          test_name?: string
          user_identifier?: string
          variant?: string
        }
        Relationships: []
      }
      ab_tests: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          test_name: string
          updated_at: string | null
          variants: Json
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          test_name: string
          updated_at?: string | null
          variants?: Json
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          test_name?: string
          updated_at?: string | null
          variants?: Json
        }
        Relationships: []
      }
      about_page_settings: {
        Row: {
          created_at: string | null
          created_by: string | null
          credentials_cta_headline: string | null
          credentials_cta_text: string | null
          cta_headline: string | null
          cta_subheadline: string | null
          faq_items: Json | null
          id: string
          insurance: Json | null
          is_active: boolean | null
          licenses: Json | null
          memberships: string[] | null
          safety_commitment: string | null
          safety_headline: string | null
          safety_programs: Json | null
          safety_stats: Json | null
          satisfaction_rate: number | null
          story_content: Json | null
          story_headline: string | null
          story_image_url: string | null
          story_promise_text: string | null
          story_promise_title: string | null
          sustainability_commitment: string | null
          sustainability_headline: string | null
          sustainability_initiatives: Json | null
          total_projects: number | null
          updated_at: string | null
          updated_by: string | null
          values: Json | null
          years_in_business: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          credentials_cta_headline?: string | null
          credentials_cta_text?: string | null
          cta_headline?: string | null
          cta_subheadline?: string | null
          faq_items?: Json | null
          id?: string
          insurance?: Json | null
          is_active?: boolean | null
          licenses?: Json | null
          memberships?: string[] | null
          safety_commitment?: string | null
          safety_headline?: string | null
          safety_programs?: Json | null
          safety_stats?: Json | null
          satisfaction_rate?: number | null
          story_content?: Json | null
          story_headline?: string | null
          story_image_url?: string | null
          story_promise_text?: string | null
          story_promise_title?: string | null
          sustainability_commitment?: string | null
          sustainability_headline?: string | null
          sustainability_initiatives?: Json | null
          total_projects?: number | null
          updated_at?: string | null
          updated_by?: string | null
          values?: Json | null
          years_in_business?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          credentials_cta_headline?: string | null
          credentials_cta_text?: string | null
          cta_headline?: string | null
          cta_subheadline?: string | null
          faq_items?: Json | null
          id?: string
          insurance?: Json | null
          is_active?: boolean | null
          licenses?: Json | null
          memberships?: string[] | null
          safety_commitment?: string | null
          safety_headline?: string | null
          safety_programs?: Json | null
          safety_stats?: Json | null
          satisfaction_rate?: number | null
          story_content?: Json | null
          story_headline?: string | null
          story_image_url?: string | null
          story_promise_text?: string | null
          story_promise_title?: string | null
          sustainability_commitment?: string | null
          sustainability_headline?: string | null
          sustainability_initiatives?: Json | null
          total_projects?: number | null
          updated_at?: string | null
          updated_by?: string | null
          values?: Json | null
          years_in_business?: number | null
        }
        Relationships: []
      }
      admin_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          reference_id: string
          title: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: string
          reference_id: string
          title: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          reference_id?: string
          title?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analytics_snapshots: {
        Row: {
          avg_time_on_page: number | null
          bounce_rate: number | null
          created_at: string | null
          id: string
          page_path: string
          page_views: number | null
          snapshot_date: string
          unique_visitors: number | null
        }
        Insert: {
          avg_time_on_page?: number | null
          bounce_rate?: number | null
          created_at?: string | null
          id?: string
          page_path: string
          page_views?: number | null
          snapshot_date?: string
          unique_visitors?: number | null
        }
        Update: {
          avg_time_on_page?: number | null
          bounce_rate?: number | null
          created_at?: string | null
          id?: string
          page_path?: string
          page_views?: number | null
          snapshot_date?: string
          unique_visitors?: number | null
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          after_state: Json | null
          before_state: Json | null
          created_at: string | null
          id: string
          ip_address: string | null
          object_id: string | null
          object_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          object_id?: string | null
          object_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          after_state?: Json | null
          before_state?: Json | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          object_id?: string | null
          object_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      auth_failed_attempts: {
        Row: {
          attempt_time: string | null
          created_at: string | null
          id: string
          ip_address: string | null
          user_agent: string | null
          user_identifier: string
        }
        Insert: {
          attempt_time?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_identifier: string
        }
        Update: {
          attempt_time?: string | null
          created_at?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_identifier?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          after_images: Json | null
          author_id: string | null
          before_images: Json | null
          budget_range: string | null
          canonical_url: string | null
          category: string | null
          challenge: string | null
          client_name: string | null
          content: string | null
          content_type: Database["public"]["Enums"]["post_content_type"] | null
          created_at: string | null
          created_by: string | null
          featured_image: string | null
          id: string
          is_pinned: boolean | null
          og_image_url: string | null
          preview_token: string | null
          preview_token_created_by: string | null
          preview_token_expires_at: string | null
          process_steps: Json | null
          project_duration: string | null
          project_location: string | null
          project_size: string | null
          publish_state: Database["public"]["Enums"]["publish_state"] | null
          published_at: string | null
          read_time_minutes: number | null
          results: string | null
          scheduled_publish: string | null
          scheduled_publish_at: string | null
          sector: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          solution: string | null
          source: string | null
          summary: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          after_images?: Json | null
          author_id?: string | null
          before_images?: Json | null
          budget_range?: string | null
          canonical_url?: string | null
          category?: string | null
          challenge?: string | null
          client_name?: string | null
          content?: string | null
          content_type?: Database["public"]["Enums"]["post_content_type"] | null
          created_at?: string | null
          created_by?: string | null
          featured_image?: string | null
          id?: string
          is_pinned?: boolean | null
          og_image_url?: string | null
          preview_token?: string | null
          preview_token_created_by?: string | null
          preview_token_expires_at?: string | null
          process_steps?: Json | null
          project_duration?: string | null
          project_location?: string | null
          project_size?: string | null
          publish_state?: Database["public"]["Enums"]["publish_state"] | null
          published_at?: string | null
          read_time_minutes?: number | null
          results?: string | null
          scheduled_publish?: string | null
          scheduled_publish_at?: string | null
          sector?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          solution?: string | null
          source?: string | null
          summary?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          after_images?: Json | null
          author_id?: string | null
          before_images?: Json | null
          budget_range?: string | null
          canonical_url?: string | null
          category?: string | null
          challenge?: string | null
          client_name?: string | null
          content?: string | null
          content_type?: Database["public"]["Enums"]["post_content_type"] | null
          created_at?: string | null
          created_by?: string | null
          featured_image?: string | null
          id?: string
          is_pinned?: boolean | null
          og_image_url?: string | null
          preview_token?: string | null
          preview_token_created_by?: string | null
          preview_token_expires_at?: string | null
          process_steps?: Json | null
          project_duration?: string | null
          project_location?: string | null
          project_size?: string | null
          publish_state?: Database["public"]["Enums"]["publish_state"] | null
          published_at?: string | null
          read_time_minutes?: number | null
          results?: string | null
          scheduled_publish?: string | null
          scheduled_publish_at?: string | null
          sector?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          solution?: string | null
          source?: string | null
          summary?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certifications: {
        Row: {
          created_at: string | null
          description: string | null
          display_order: number | null
          expiry_date: string | null
          id: string
          is_active: boolean | null
          issued_by: string | null
          logo_url: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          issued_by?: string | null
          logo_url?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean | null
          issued_by?: string | null
          logo_url?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      company_overview_items: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          section_id: string
          title: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          section_id: string
          title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          section_id?: string
          title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "company_overview_items_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "company_overview_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      company_overview_sections: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          section_type: string
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          section_type: string
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          section_type?: string
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      contact_page_settings: {
        Row: {
          careers_email: string | null
          created_at: string | null
          created_by: string | null
          general_email: string | null
          id: string
          is_active: boolean | null
          main_phone: string | null
          map_embed_url: string | null
          office_address: string | null
          projects_email: string | null
          rfp_email: string | null
          saturday_hours: string | null
          sunday_hours: string | null
          toll_free_phone: string | null
          updated_at: string | null
          updated_by: string | null
          weekday_hours: string | null
        }
        Insert: {
          careers_email?: string | null
          created_at?: string | null
          created_by?: string | null
          general_email?: string | null
          id?: string
          is_active?: boolean | null
          main_phone?: string | null
          map_embed_url?: string | null
          office_address?: string | null
          projects_email?: string | null
          rfp_email?: string | null
          saturday_hours?: string | null
          sunday_hours?: string | null
          toll_free_phone?: string | null
          updated_at?: string | null
          updated_by?: string | null
          weekday_hours?: string | null
        }
        Update: {
          careers_email?: string | null
          created_at?: string | null
          created_by?: string | null
          general_email?: string | null
          id?: string
          is_active?: boolean | null
          main_phone?: string | null
          map_embed_url?: string | null
          office_address?: string | null
          projects_email?: string | null
          rfp_email?: string | null
          saturday_hours?: string | null
          sunday_hours?: string | null
          toll_free_phone?: string | null
          updated_at?: string | null
          updated_by?: string | null
          weekday_hours?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          admin_notes: string | null
          company: string | null
          consent_ip: string | null
          consent_timestamp: string | null
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          newsletter_consent: boolean | null
          phone: string | null
          status: string | null
          submission_type: string | null
        }
        Insert: {
          admin_notes?: string | null
          company?: string | null
          consent_ip?: string | null
          consent_timestamp?: string | null
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          newsletter_consent?: boolean | null
          phone?: string | null
          status?: string | null
          submission_type?: string | null
        }
        Update: {
          admin_notes?: string | null
          company?: string | null
          consent_ip?: string | null
          consent_timestamp?: string | null
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          newsletter_consent?: boolean | null
          phone?: string | null
          status?: string | null
          submission_type?: string | null
        }
        Relationships: []
      }
      content_review_comments: {
        Row: {
          comment: string
          created_at: string | null
          created_by: string
          entity_id: string
          entity_type: string
          id: string
          status: string | null
        }
        Insert: {
          comment: string
          created_at?: string | null
          created_by: string
          entity_id: string
          entity_type: string
          id?: string
          status?: string | null
        }
        Update: {
          comment?: string
          created_at?: string | null
          created_by?: string
          entity_id?: string
          entity_type?: string
          id?: string
          status?: string | null
        }
        Relationships: []
      }
      content_versions: {
        Row: {
          change_summary: string | null
          changed_by: string
          content_snapshot: Json
          created_at: string | null
          entity_id: string
          entity_type: string
          id: string
          version_number: number
        }
        Insert: {
          change_summary?: string | null
          changed_by: string
          content_snapshot: Json
          created_at?: string | null
          entity_id: string
          entity_type: string
          id?: string
          version_number: number
        }
        Update: {
          change_summary?: string | null
          changed_by?: string
          content_snapshot?: Json
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          id?: string
          version_number?: number
        }
        Relationships: []
      }
      document_access_log: {
        Row: {
          created_at: string | null
          document_id: string | null
          id: string
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          document_id?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          document_id?: string | null
          id?: string
          ip_address?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "document_access_log_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents_library"
            referencedColumns: ["id"]
          },
        ]
      }
      documents_library: {
        Row: {
          alt_text: string | null
          category: string
          created_at: string | null
          created_by: string | null
          crop_presets: Json | null
          description: string | null
          display_order: number | null
          download_count: number | null
          expiry_date: string | null
          file_name: string
          file_size: number | null
          file_type: string | null
          file_url: string
          focal_point_x: number | null
          focal_point_y: number | null
          id: string
          is_active: boolean | null
          requires_authentication: boolean | null
          title: string
          updated_at: string | null
          updated_by: string | null
          version: string | null
        }
        Insert: {
          alt_text?: string | null
          category: string
          created_at?: string | null
          created_by?: string | null
          crop_presets?: Json | null
          description?: string | null
          display_order?: number | null
          download_count?: number | null
          expiry_date?: string | null
          file_name: string
          file_size?: number | null
          file_type?: string | null
          file_url: string
          focal_point_x?: number | null
          focal_point_y?: number | null
          id?: string
          is_active?: boolean | null
          requires_authentication?: boolean | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
          version?: string | null
        }
        Update: {
          alt_text?: string | null
          category?: string
          created_at?: string | null
          created_by?: string | null
          crop_presets?: Json | null
          description?: string | null
          display_order?: number | null
          download_count?: number | null
          expiry_date?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          focal_point_x?: number | null
          focal_point_y?: number | null
          id?: string
          is_active?: boolean | null
          requires_authentication?: boolean | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
          version?: string | null
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_html: string
          body_text: string
          category: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string
          updated_at: string | null
        }
        Insert: {
          body_html: string
          body_text: string
          category?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          updated_at?: string | null
        }
        Update: {
          body_html?: string
          body_text?: string
          category?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      error_logs: {
        Row: {
          context: Json | null
          created_at: string
          id: string
          message: string
          stack: string | null
          url: string | null
          user_agent: string | null
        }
        Insert: {
          context?: Json | null
          created_at?: string
          id?: string
          message: string
          stack?: string | null
          url?: string | null
          user_agent?: string | null
        }
        Update: {
          context?: Json | null
          created_at?: string
          id?: string
          message?: string
          stack?: string | null
          url?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      featured_services: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          display_order: number
          end_date: string | null
          icon_name: string
          id: string
          is_active: boolean
          promotion_badge: string | null
          service_link: string
          service_name: string
          start_date: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number
          end_date?: string | null
          icon_name: string
          id?: string
          is_active?: boolean
          promotion_badge?: string | null
          service_link: string
          service_name: string
          start_date?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number
          end_date?: string | null
          icon_name?: string
          id?: string
          is_active?: boolean
          promotion_badge?: string | null
          service_link?: string
          service_name?: string
          start_date?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_services_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "featured_services_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      footer_settings: {
        Row: {
          contact_info: Json | null
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          quick_links: Json | null
          sectors_links: Json | null
          social_media: Json | null
          trust_bar_items: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          contact_info?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          quick_links?: Json | null
          sectors_links?: Json | null
          social_media?: Json | null
          trust_bar_items?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          contact_info?: Json | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          quick_links?: Json | null
          sectors_links?: Json | null
          social_media?: Json | null
          trust_bar_items?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      google_auth_tokens: {
        Row: {
          access_token: string
          created_at: string | null
          id: string
          refresh_token: string | null
          scope: string
          token_expiry: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string | null
          id?: string
          refresh_token?: string | null
          scope: string
          token_expiry: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string | null
          id?: string
          refresh_token?: string | null
          scope?: string
          token_expiry?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      hero_slides: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          display_order: number
          headline: string
          id: string
          is_active: boolean
          poster_url: string | null
          primary_cta_icon: string | null
          primary_cta_text: string
          primary_cta_url: string
          secondary_cta_text: string | null
          secondary_cta_url: string | null
          stat_label: string | null
          stat_number: string | null
          subheadline: string
          updated_at: string
          updated_by: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number
          headline: string
          id?: string
          is_active?: boolean
          poster_url?: string | null
          primary_cta_icon?: string | null
          primary_cta_text?: string
          primary_cta_url?: string
          secondary_cta_text?: string | null
          secondary_cta_url?: string | null
          stat_label?: string | null
          stat_number?: string | null
          subheadline: string
          updated_at?: string
          updated_by?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          display_order?: number
          headline?: string
          id?: string
          is_active?: boolean
          poster_url?: string | null
          primary_cta_icon?: string | null
          primary_cta_text?: string
          primary_cta_url?: string
          secondary_cta_text?: string | null
          secondary_cta_url?: string | null
          stat_label?: string | null
          stat_number?: string | null
          subheadline?: string
          updated_at?: string
          updated_by?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      homepage_settings: {
        Row: {
          created_at: string | null
          created_by: string | null
          cta_primary_text: string | null
          cta_primary_url: string | null
          cta_secondary_text: string | null
          cta_secondary_url: string | null
          cta_tertiary_text: string | null
          cta_tertiary_url: string | null
          headline: string
          hero_description: string | null
          id: string
          is_active: boolean | null
          subheadline: string
          updated_at: string | null
          updated_by: string | null
          value_prop_1: string | null
          value_prop_2: string | null
          value_prop_3: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          cta_primary_text?: string | null
          cta_primary_url?: string | null
          cta_secondary_text?: string | null
          cta_secondary_url?: string | null
          cta_tertiary_text?: string | null
          cta_tertiary_url?: string | null
          headline?: string
          hero_description?: string | null
          id?: string
          is_active?: boolean | null
          subheadline?: string
          updated_at?: string | null
          updated_by?: string | null
          value_prop_1?: string | null
          value_prop_2?: string | null
          value_prop_3?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          cta_primary_text?: string | null
          cta_primary_url?: string | null
          cta_secondary_text?: string | null
          cta_secondary_url?: string | null
          cta_tertiary_text?: string | null
          cta_tertiary_url?: string | null
          headline?: string
          hero_description?: string | null
          id?: string
          is_active?: boolean | null
          subheadline?: string
          updated_at?: string | null
          updated_by?: string | null
          value_prop_1?: string | null
          value_prop_2?: string | null
          value_prop_3?: string | null
        }
        Relationships: []
      }
      navigation_menu_items: {
        Row: {
          badge: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          is_mega_menu: boolean | null
          label: string
          mega_menu_section_title: string | null
          menu_type: string
          parent_id: string | null
          updated_at: string | null
          updated_by: string | null
          url: string
        }
        Insert: {
          badge?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          is_mega_menu?: boolean | null
          label: string
          mega_menu_section_title?: string | null
          menu_type?: string
          parent_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          url: string
        }
        Update: {
          badge?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          is_mega_menu?: boolean | null
          label?: string
          mega_menu_section_title?: string | null
          menu_type?: string
          parent_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "navigation_menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "navigation_menu_items"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscribers: {
        Row: {
          consent_ip: string | null
          consent_method: string | null
          consent_timestamp: string | null
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          source: string | null
          subscribed_at: string | null
          unsubscribe_token: string | null
          unsubscribed_at: string | null
          updated_at: string | null
        }
        Insert: {
          consent_ip?: string | null
          consent_method?: string | null
          consent_timestamp?: string | null
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          source?: string | null
          subscribed_at?: string | null
          unsubscribe_token?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          consent_ip?: string | null
          consent_method?: string | null
          consent_timestamp?: string | null
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          source?: string | null
          subscribed_at?: string | null
          unsubscribe_token?: string | null
          unsubscribed_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          link: string | null
          message: string
          metadata: Json | null
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          link?: string | null
          message: string
          metadata?: Json | null
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          link?: string | null
          message?: string
          metadata?: Json | null
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      optimization_recommendations: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          priority: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: string | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          priority?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: string | null
          title?: string
        }
        Relationships: []
      }
      performance_metrics: {
        Row: {
          id: string
          metadata: Json | null
          metric_name: string
          metric_type: string
          recorded_at: string | null
          unit: string | null
          value: number
        }
        Insert: {
          id?: string
          metadata?: Json | null
          metric_name: string
          metric_type: string
          recorded_at?: string | null
          unit?: string | null
          value: number
        }
        Update: {
          id?: string
          metadata?: Json | null
          metric_name?: string
          metric_type?: string
          recorded_at?: string | null
          unit?: string | null
          value?: number
        }
        Relationships: []
      }
      popular_services_analytics: {
        Row: {
          created_at: string
          event_type: string
          id: string
          position: number | null
          service_link: string
          service_name: string
          session_id: string | null
          source: string
          user_identifier: string
          variant: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          position?: number | null
          service_link: string
          service_name: string
          session_id?: string | null
          source?: string
          user_identifier: string
          variant?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          position?: number | null
          service_link?: string
          service_name?: string
          session_id?: string | null
          source?: string
          user_identifier?: string
          variant?: string | null
        }
        Relationships: []
      }
      prequalification_downloads: {
        Row: {
          company_name: string
          consent_ip: string | null
          consent_timestamp: string | null
          contact_name: string
          downloaded_at: string | null
          email: string
          id: string
          message: string | null
          phone: string | null
          project_type: string | null
          project_value_range: string | null
          status: string | null
        }
        Insert: {
          company_name: string
          consent_ip?: string | null
          consent_timestamp?: string | null
          contact_name: string
          downloaded_at?: string | null
          email: string
          id?: string
          message?: string | null
          phone?: string | null
          project_type?: string | null
          project_value_range?: string | null
          status?: string | null
        }
        Update: {
          company_name?: string
          consent_ip?: string | null
          consent_timestamp?: string | null
          contact_name?: string
          downloaded_at?: string | null
          email?: string
          id?: string
          message?: string | null
          phone?: string | null
          project_type?: string | null
          project_value_range?: string | null
          status?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      project_images: {
        Row: {
          caption: string | null
          category: string
          created_at: string | null
          display_order: number
          featured: boolean | null
          id: string
          project_id: string
          updated_at: string | null
          url: string
        }
        Insert: {
          caption?: string | null
          category: string
          created_at?: string | null
          display_order?: number
          featured?: boolean | null
          id?: string
          project_id: string
          updated_at?: string | null
          url: string
        }
        Update: {
          caption?: string | null
          category?: string
          created_at?: string | null
          display_order?: number
          featured?: boolean | null
          id?: string
          project_id?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_services: {
        Row: {
          id: string
          project_id: string | null
          service_id: string | null
        }
        Insert: {
          id?: string
          project_id?: string | null
          service_id?: string | null
        }
        Update: {
          id?: string
          project_id?: string | null
          service_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_services_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_services_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          after_images: Json | null
          before_images: Json | null
          budget_range: string | null
          canonical_url: string | null
          category: string | null
          challenge: string | null
          client_name: string | null
          client_type: string | null
          completion_date: string | null
          content_blocks: Json | null
          created_at: string | null
          created_by: string | null
          delivery_method: string | null
          description: string | null
          draft_content: Json | null
          duration: string | null
          featured: boolean | null
          featured_image: string | null
          gallery: Json | null
          id: string
          location: string | null
          og_image_url: string | null
          on_budget: boolean | null
          on_time_completion: boolean | null
          peak_workforce: number | null
          preview_token: string | null
          preview_token_created_by: string | null
          preview_token_expires_at: string | null
          process_notes: string | null
          project_size: string | null
          project_status: string | null
          project_value: string | null
          publish_state: Database["public"]["Enums"]["publish_state"] | null
          results: string | null
          safety_incidents: number | null
          scheduled_publish_at: string | null
          scope_of_work: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          slug: string
          solution: string | null
          square_footage: string | null
          start_date: string | null
          subtitle: string | null
          summary: string | null
          tags: string[] | null
          team_credits: Json | null
          title: string
          trades_coordinated: number | null
          updated_at: string | null
          updated_by: string | null
          version: number | null
          year: string | null
          your_role: string | null
        }
        Insert: {
          after_images?: Json | null
          before_images?: Json | null
          budget_range?: string | null
          canonical_url?: string | null
          category?: string | null
          challenge?: string | null
          client_name?: string | null
          client_type?: string | null
          completion_date?: string | null
          content_blocks?: Json | null
          created_at?: string | null
          created_by?: string | null
          delivery_method?: string | null
          description?: string | null
          draft_content?: Json | null
          duration?: string | null
          featured?: boolean | null
          featured_image?: string | null
          gallery?: Json | null
          id?: string
          location?: string | null
          og_image_url?: string | null
          on_budget?: boolean | null
          on_time_completion?: boolean | null
          peak_workforce?: number | null
          preview_token?: string | null
          preview_token_created_by?: string | null
          preview_token_expires_at?: string | null
          process_notes?: string | null
          project_size?: string | null
          project_status?: string | null
          project_value?: string | null
          publish_state?: Database["public"]["Enums"]["publish_state"] | null
          results?: string | null
          safety_incidents?: number | null
          scheduled_publish_at?: string | null
          scope_of_work?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug: string
          solution?: string | null
          square_footage?: string | null
          start_date?: string | null
          subtitle?: string | null
          summary?: string | null
          tags?: string[] | null
          team_credits?: Json | null
          title: string
          trades_coordinated?: number | null
          updated_at?: string | null
          updated_by?: string | null
          version?: number | null
          year?: string | null
          your_role?: string | null
        }
        Update: {
          after_images?: Json | null
          before_images?: Json | null
          budget_range?: string | null
          canonical_url?: string | null
          category?: string | null
          challenge?: string | null
          client_name?: string | null
          client_type?: string | null
          completion_date?: string | null
          content_blocks?: Json | null
          created_at?: string | null
          created_by?: string | null
          delivery_method?: string | null
          description?: string | null
          draft_content?: Json | null
          duration?: string | null
          featured?: boolean | null
          featured_image?: string | null
          gallery?: Json | null
          id?: string
          location?: string | null
          og_image_url?: string | null
          on_budget?: boolean | null
          on_time_completion?: boolean | null
          peak_workforce?: number | null
          preview_token?: string | null
          preview_token_created_by?: string | null
          preview_token_expires_at?: string | null
          process_notes?: string | null
          project_size?: string | null
          project_status?: string | null
          project_value?: string | null
          publish_state?: Database["public"]["Enums"]["publish_state"] | null
          results?: string | null
          safety_incidents?: number | null
          scheduled_publish_at?: string | null
          scope_of_work?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          slug?: string
          solution?: string | null
          square_footage?: string | null
          start_date?: string | null
          subtitle?: string | null
          summary?: string | null
          tags?: string[] | null
          team_credits?: Json | null
          title?: string
          trades_coordinated?: number | null
          updated_at?: string | null
          updated_by?: string | null
          version?: number | null
          year?: string | null
          your_role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quote_requests: {
        Row: {
          access_hours: string | null
          additional_notes: string | null
          after_hours_required: boolean | null
          assigned_to: string | null
          city: string | null
          company: string | null
          consent_given: boolean | null
          consent_ip: string | null
          consent_timestamp: string | null
          created_at: string | null
          email: string
          estimated_lf: Json | null
          estimated_sf: Json | null
          estimated_value: number | null
          id: string
          lead_score: number | null
          name: string
          nte_budget: number | null
          phone: string | null
          priority: string | null
          project_address: string | null
          quote_type: string
          role: string | null
          scope_categories: string[] | null
          source: string | null
          status: string | null
          target_deadline: string | null
          updated_at: string | null
          uploaded_files: string[] | null
        }
        Insert: {
          access_hours?: string | null
          additional_notes?: string | null
          after_hours_required?: boolean | null
          assigned_to?: string | null
          city?: string | null
          company?: string | null
          consent_given?: boolean | null
          consent_ip?: string | null
          consent_timestamp?: string | null
          created_at?: string | null
          email: string
          estimated_lf?: Json | null
          estimated_sf?: Json | null
          estimated_value?: number | null
          id?: string
          lead_score?: number | null
          name: string
          nte_budget?: number | null
          phone?: string | null
          priority?: string | null
          project_address?: string | null
          quote_type: string
          role?: string | null
          scope_categories?: string[] | null
          source?: string | null
          status?: string | null
          target_deadline?: string | null
          updated_at?: string | null
          uploaded_files?: string[] | null
        }
        Update: {
          access_hours?: string | null
          additional_notes?: string | null
          after_hours_required?: boolean | null
          assigned_to?: string | null
          city?: string | null
          company?: string | null
          consent_given?: boolean | null
          consent_ip?: string | null
          consent_timestamp?: string | null
          created_at?: string | null
          email?: string
          estimated_lf?: Json | null
          estimated_sf?: Json | null
          estimated_value?: number | null
          id?: string
          lead_score?: number | null
          name?: string
          nte_budget?: number | null
          phone?: string | null
          priority?: string | null
          project_address?: string | null
          quote_type?: string
          role?: string | null
          scope_categories?: string[] | null
          source?: string | null
          status?: string | null
          target_deadline?: string | null
          updated_at?: string | null
          uploaded_files?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      redirects: {
        Row: {
          created_at: string | null
          created_by: string | null
          destination_path: string
          hit_count: number | null
          id: string
          is_active: boolean | null
          notes: string | null
          redirect_type: number | null
          source_path: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          destination_path: string
          hit_count?: number | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          redirect_type?: number | null
          source_path: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          destination_path?: string
          hit_count?: number | null
          id?: string
          is_active?: boolean | null
          notes?: string | null
          redirect_type?: number | null
          source_path?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      review_requests: {
        Row: {
          client_name: string
          created_at: string
          email: string
          id: string
          project_id: string | null
          responded_at: string | null
          sent_at: string | null
          status: string
          updated_at: string
        }
        Insert: {
          client_name: string
          created_at?: string
          email: string
          id?: string
          project_id?: string | null
          responded_at?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          client_name?: string
          created_at?: string
          email?: string
          id?: string
          project_id?: string | null
          responded_at?: string | null
          sent_at?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_requests_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      rfp_submissions: {
        Row: {
          additional_requirements: string | null
          admin_notes: string | null
          bonding_required: boolean | null
          company_name: string
          consent_ip: string | null
          consent_timestamp: string | null
          contact_name: string
          created_at: string | null
          delivery_method: string | null
          email: string
          estimated_start_date: string | null
          estimated_timeline: string | null
          estimated_value_range: string | null
          id: string
          phone: string | null
          plans_available: boolean | null
          prequalification_complete: boolean | null
          project_description: string | null
          project_location: string | null
          project_name: string
          project_start_date: string | null
          project_type: string | null
          scope_of_work: string
          site_visit_required: boolean | null
          special_requirements: string | null
          status: string | null
          title: string | null
        }
        Insert: {
          additional_requirements?: string | null
          admin_notes?: string | null
          bonding_required?: boolean | null
          company_name: string
          consent_ip?: string | null
          consent_timestamp?: string | null
          contact_name: string
          created_at?: string | null
          delivery_method?: string | null
          email: string
          estimated_start_date?: string | null
          estimated_timeline?: string | null
          estimated_value_range?: string | null
          id?: string
          phone?: string | null
          plans_available?: boolean | null
          prequalification_complete?: boolean | null
          project_description?: string | null
          project_location?: string | null
          project_name: string
          project_start_date?: string | null
          project_type?: string | null
          scope_of_work?: string
          site_visit_required?: boolean | null
          special_requirements?: string | null
          status?: string | null
          title?: string | null
        }
        Update: {
          additional_requirements?: string | null
          admin_notes?: string | null
          bonding_required?: boolean | null
          company_name?: string
          consent_ip?: string | null
          consent_timestamp?: string | null
          contact_name?: string
          created_at?: string | null
          delivery_method?: string | null
          email?: string
          estimated_start_date?: string | null
          estimated_timeline?: string | null
          estimated_value_range?: string | null
          id?: string
          phone?: string | null
          plans_available?: boolean | null
          prequalification_complete?: boolean | null
          project_description?: string | null
          project_location?: string | null
          project_name?: string
          project_start_date?: string | null
          project_type?: string | null
          scope_of_work?: string
          site_visit_required?: boolean | null
          special_requirements?: string | null
          status?: string | null
          title?: string | null
        }
        Relationships: []
      }
      search_analytics: {
        Row: {
          clicked_result_link: string | null
          clicked_result_name: string | null
          created_at: string
          id: string
          results_count: number
          search_query: string
          searched_at: string
          section_distribution: Json | null
          user_session_id: string | null
        }
        Insert: {
          clicked_result_link?: string | null
          clicked_result_name?: string | null
          created_at?: string
          id?: string
          results_count?: number
          search_query: string
          searched_at?: string
          section_distribution?: Json | null
          user_session_id?: string | null
        }
        Update: {
          clicked_result_link?: string | null
          clicked_result_name?: string | null
          created_at?: string
          id?: string
          results_count?: number
          search_query?: string
          searched_at?: string
          section_distribution?: Json | null
          user_session_id?: string | null
        }
        Relationships: []
      }
      search_console_data: {
        Row: {
          clicks: number | null
          country: string | null
          created_at: string | null
          ctr: number | null
          date: string
          device: string | null
          id: string
          impressions: number | null
          page_path: string | null
          position: number | null
          query: string | null
          site_url: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          clicks?: number | null
          country?: string | null
          created_at?: string | null
          ctr?: number | null
          date: string
          device?: string | null
          id?: string
          impressions?: number | null
          page_path?: string | null
          position?: number | null
          query?: string | null
          site_url: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          clicks?: number | null
          country?: string | null
          created_at?: string | null
          ctr?: number | null
          date?: string
          device?: string | null
          id?: string
          impressions?: number | null
          page_path?: string | null
          position?: number | null
          query?: string | null
          site_url?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      security_settings: {
        Row: {
          audit_retention_days: number | null
          created_at: string | null
          created_by: string | null
          id: string
          ip_whitelist: string[] | null
          is_active: boolean | null
          max_failed_login_attempts: number | null
          mfa_required: boolean | null
          password_min_length: number | null
          password_require_lowercase: boolean | null
          password_require_numbers: boolean | null
          password_require_special: boolean | null
          password_require_uppercase: boolean | null
          session_timeout_minutes: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          audit_retention_days?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          ip_whitelist?: string[] | null
          is_active?: boolean | null
          max_failed_login_attempts?: number | null
          mfa_required?: boolean | null
          password_min_length?: number | null
          password_require_lowercase?: boolean | null
          password_require_numbers?: boolean | null
          password_require_special?: boolean | null
          password_require_uppercase?: boolean | null
          session_timeout_minutes?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          audit_retention_days?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          ip_whitelist?: string[] | null
          is_active?: boolean | null
          max_failed_login_attempts?: number | null
          mfa_required?: boolean | null
          password_min_length?: number | null
          password_require_lowercase?: boolean | null
          password_require_numbers?: boolean | null
          password_require_special?: boolean | null
          password_require_uppercase?: boolean | null
          session_timeout_minutes?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "security_settings_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "security_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_promotions: {
        Row: {
          badge_color: string | null
          badge_text: string | null
          created_at: string
          created_by: string | null
          discount_percentage: number | null
          end_date: string
          id: string
          is_active: boolean
          priority: number
          promotion_message: string | null
          promotion_type: string
          service_link: string
          start_date: string
          target_audience: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          badge_color?: string | null
          badge_text?: string | null
          created_at?: string
          created_by?: string | null
          discount_percentage?: number | null
          end_date: string
          id?: string
          is_active?: boolean
          priority?: number
          promotion_message?: string | null
          promotion_type: string
          service_link: string
          start_date: string
          target_audience?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          badge_color?: string | null
          badge_text?: string | null
          created_at?: string
          created_by?: string | null
          discount_percentage?: number | null
          end_date?: string
          id?: string
          is_active?: boolean
          priority?: number
          promotion_message?: string | null
          promotion_type?: string
          service_link?: string
          start_date?: string
          target_audience?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_promotions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      service_recommendations_cache: {
        Row: {
          algorithm_version: string
          created_at: string
          expires_at: string
          id: string
          recommendation_score: number | null
          recommended_services: Json
          user_identifier: string
        }
        Insert: {
          algorithm_version?: string
          created_at?: string
          expires_at: string
          id?: string
          recommendation_score?: number | null
          recommended_services: Json
          user_identifier: string
        }
        Update: {
          algorithm_version?: string
          created_at?: string
          expires_at?: string
          id?: string
          recommendation_score?: number | null
          recommended_services?: Json
          user_identifier?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          canonical_url: string | null
          category: string | null
          category_color: string | null
          category_description: string | null
          category_icon: string | null
          challenge_tags: string[] | null
          created_at: string | null
          created_by: string | null
          faq_items: Json | null
          featured: boolean | null
          featured_image: string | null
          icon_name: string | null
          id: string
          key_benefits: Json | null
          long_description: string | null
          name: string
          og_image_url: string | null
          preview_token: string | null
          preview_token_created_by: string | null
          preview_token_expires_at: string | null
          process_steps: Json | null
          project_types: string[] | null
          publish_state: Database["public"]["Enums"]["publish_state"] | null
          scheduled_publish_at: string | null
          scope_template: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          seo_title: string | null
          service_overview: string | null
          service_tier: string | null
          short_description: string | null
          slug: string
          thumbnail_url: string | null
          typical_applications: Json | null
          typical_timeline: string | null
          updated_at: string | null
          updated_by: string | null
          video_url: string | null
          what_we_provide: Json | null
        }
        Insert: {
          canonical_url?: string | null
          category?: string | null
          category_color?: string | null
          category_description?: string | null
          category_icon?: string | null
          challenge_tags?: string[] | null
          created_at?: string | null
          created_by?: string | null
          faq_items?: Json | null
          featured?: boolean | null
          featured_image?: string | null
          icon_name?: string | null
          id?: string
          key_benefits?: Json | null
          long_description?: string | null
          name: string
          og_image_url?: string | null
          preview_token?: string | null
          preview_token_created_by?: string | null
          preview_token_expires_at?: string | null
          process_steps?: Json | null
          project_types?: string[] | null
          publish_state?: Database["public"]["Enums"]["publish_state"] | null
          scheduled_publish_at?: string | null
          scope_template?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          service_overview?: string | null
          service_tier?: string | null
          short_description?: string | null
          slug: string
          thumbnail_url?: string | null
          typical_applications?: Json | null
          typical_timeline?: string | null
          updated_at?: string | null
          updated_by?: string | null
          video_url?: string | null
          what_we_provide?: Json | null
        }
        Update: {
          canonical_url?: string | null
          category?: string | null
          category_color?: string | null
          category_description?: string | null
          category_icon?: string | null
          challenge_tags?: string[] | null
          created_at?: string | null
          created_by?: string | null
          faq_items?: Json | null
          featured?: boolean | null
          featured_image?: string | null
          icon_name?: string | null
          id?: string
          key_benefits?: Json | null
          long_description?: string | null
          name?: string
          og_image_url?: string | null
          preview_token?: string | null
          preview_token_created_by?: string | null
          preview_token_expires_at?: string | null
          process_steps?: Json | null
          project_types?: string[] | null
          publish_state?: Database["public"]["Enums"]["publish_state"] | null
          scheduled_publish_at?: string | null
          scope_template?: string | null
          seo_description?: string | null
          seo_keywords?: string[] | null
          seo_title?: string | null
          service_overview?: string | null
          service_tier?: string | null
          short_description?: string | null
          slug?: string
          thumbnail_url?: string | null
          typical_applications?: Json | null
          typical_timeline?: string | null
          updated_at?: string | null
          updated_by?: string | null
          video_url?: string | null
          what_we_provide?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "services_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          address: string | null
          admin_quick_actions: Json | null
          business_hours: Json | null
          certifications: string[] | null
          company_name: string
          company_tagline: string | null
          created_at: string | null
          email: string
          founded_year: number | null
          google_analytics_id: string | null
          id: string
          is_active: boolean | null
          knows_about: string[] | null
          meta_description: string | null
          meta_title: string | null
          og_image: string | null
          phone: string
          robots_txt: string | null
          service_areas: string[] | null
          social_links: Json | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          admin_quick_actions?: Json | null
          business_hours?: Json | null
          certifications?: string[] | null
          company_name?: string
          company_tagline?: string | null
          created_at?: string | null
          email: string
          founded_year?: number | null
          google_analytics_id?: string | null
          id?: string
          is_active?: boolean | null
          knows_about?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          phone: string
          robots_txt?: string | null
          service_areas?: string[] | null
          social_links?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          admin_quick_actions?: Json | null
          business_hours?: Json | null
          certifications?: string[] | null
          company_name?: string
          company_tagline?: string | null
          created_at?: string | null
          email?: string
          founded_year?: number | null
          google_analytics_id?: string | null
          id?: string
          is_active?: boolean | null
          knows_about?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          og_image?: string | null
          phone?: string
          robots_txt?: string | null
          service_areas?: string[] | null
          social_links?: Json | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      sitemap_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          id: string
          status: string
          url_count: number | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          status: string
          url_count?: number | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          id?: string
          status?: string
          url_count?: number | null
        }
        Relationships: []
      }
      specialty_pages: {
        Row: {
          content_blocks: Json
          created_at: string | null
          created_by: string | null
          id: string
          is_active: boolean | null
          meta_description: string | null
          meta_title: string | null
          og_image_url: string | null
          slug: string
          subtitle: string | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content_blocks?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          slug: string
          subtitle?: string | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content_blocks?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_active?: boolean | null
          meta_description?: string | null
          meta_title?: string | null
          og_image_url?: string | null
          slug?: string
          subtitle?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "specialty_pages_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "specialty_pages_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stats: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          display_order: number | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          label: string
          suffix: string | null
          updated_at: string | null
          updated_by: string | null
          value: number
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          label: string
          suffix?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value: number
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          label?: string
          suffix?: string | null
          updated_at?: string | null
          updated_by?: string | null
          value?: number
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          author_name: string
          author_position: string | null
          company_name: string | null
          created_at: string | null
          created_by: string | null
          date_published: string | null
          display_order: number | null
          id: string
          is_featured: boolean | null
          project_name: string | null
          publish_state: Database["public"]["Enums"]["publish_state"] | null
          quote: string
          rating: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          author_name: string
          author_position?: string | null
          company_name?: string | null
          created_at?: string | null
          created_by?: string | null
          date_published?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          project_name?: string | null
          publish_state?: Database["public"]["Enums"]["publish_state"] | null
          quote: string
          rating?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          author_name?: string
          author_position?: string | null
          company_name?: string | null
          created_at?: string | null
          created_by?: string | null
          date_published?: string | null
          display_order?: number | null
          id?: string
          is_featured?: boolean | null
          project_name?: string | null
          publish_state?: Database["public"]["Enums"]["publish_state"] | null
          quote?: string
          rating?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_service_preferences: {
        Row: {
          clicked_from_popular: boolean | null
          created_at: string
          id: string
          interaction_count: number
          last_viewed_at: string
          service_link: string
          time_spent_seconds: number | null
          updated_at: string
          user_identifier: string
        }
        Insert: {
          clicked_from_popular?: boolean | null
          created_at?: string
          id?: string
          interaction_count?: number
          last_viewed_at?: string
          service_link: string
          time_spent_seconds?: number | null
          updated_at?: string
          user_identifier: string
        }
        Update: {
          clicked_from_popular?: boolean | null
          created_at?: string
          id?: string
          interaction_count?: number
          last_viewed_at?: string
          service_link?: string
          time_spent_seconds?: number | null
          updated_at?: string
          user_identifier?: string
        }
        Relationships: []
      }
      value_pillars: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string
          display_order: number
          icon_name: string | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description: string
          display_order: number
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string
          display_order?: number
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "value_pillars_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "value_pillars_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      why_choose_us_items: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string
          display_order: number | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          stats_badge: string | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description: string
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          stats_badge?: string | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string
          display_order?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          stats_badge?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_lead_score: {
        Args: { req: Database["public"]["Tables"]["quote_requests"]["Row"] }
        Returns: number
      }
      can_edit_content: { Args: { _user_id: string }; Returns: boolean }
      check_and_update_rate_limit: {
        Args: {
          p_endpoint: string
          p_identifier: string
          p_limit?: number
          p_window_minutes?: number
        }
        Returns: Json
      }
      cleanup_old_error_logs: { Args: never; Returns: undefined }
      create_notification: {
        Args: {
          p_link?: string
          p_message: string
          p_metadata?: Json
          p_title: string
          p_type: string
          p_user_id: string
        }
        Returns: string
      }
      get_active_featured_services: {
        Args: never
        Returns: {
          category: string
          description: string
          icon_name: string
          id: string
          promotion_badge: string
          service_link: string
          service_name: string
        }[]
      }
      get_active_promotions: {
        Args: never
        Returns: {
          badge_color: string
          badge_text: string
          discount_percentage: number
          id: string
          promotion_message: string
          promotion_type: string
          service_link: string
          title: string
        }[]
      }
      get_admin_dashboard_stats: { Args: never; Returns: Json }
      get_personalized_recommendations: {
        Args: { p_limit?: number; p_user_identifier: string }
        Returns: {
          reason: string
          recommendation_score: number
          service_link: string
          service_name: string
        }[]
      }
      get_security_audit_log: {
        Args: { limit_count?: number }
        Returns: {
          accessed_by_email: string
          accessed_email: string
          action: string
          created_at: string
          id: string
          ip_address: string
          object_id: string
          object_type: string
          user_agent: string
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      notify_admins: {
        Args: {
          p_message: string
          p_ref_id: string
          p_title: string
          p_type: string
        }
        Returns: undefined
      }
      save_content_version: {
        Args: {
          p_change_summary: string
          p_content_snapshot: Json
          p_entity_id: string
          p_entity_type: string
        }
        Returns: undefined
      }
      track_service_interaction: {
        Args: {
          p_from_popular?: boolean
          p_service_link: string
          p_time_spent?: number
          p_user_identifier: string
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "editor" | "contributor" | "viewer"
      application_status:
        | "new"
        | "reviewed"
        | "contacted"
        | "rejected"
        | "hired"
      business_client_type: "residential" | "commercial"
      business_estimate_status:
        | "draft"
        | "sent"
        | "viewed"
        | "accepted"
        | "rejected"
        | "expired"
        | "converted"
      business_invoice_status:
        | "draft"
        | "sent"
        | "partially_paid"
        | "paid"
        | "overdue"
        | "cancelled"
      business_invoice_type: "standard" | "progress" | "final" | "deposit"
      business_payment_method:
        | "cash"
        | "check"
        | "credit_card"
        | "e_transfer"
        | "wire_transfer"
        | "other"
      business_project_priority: "low" | "normal" | "high" | "urgent"
      business_project_status:
        | "lead"
        | "quoted"
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
      employment_type: "full_time" | "part_time" | "contract" | "internship"
      post_content_type: "article" | "case_study" | "insight" | "case-study"
      publish_state: "draft" | "scheduled" | "published" | "archived" | "review"
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
      app_role: ["super_admin", "admin", "editor", "contributor", "viewer"],
      application_status: ["new", "reviewed", "contacted", "rejected", "hired"],
      business_client_type: ["residential", "commercial"],
      business_estimate_status: [
        "draft",
        "sent",
        "viewed",
        "accepted",
        "rejected",
        "expired",
        "converted",
      ],
      business_invoice_status: [
        "draft",
        "sent",
        "partially_paid",
        "paid",
        "overdue",
        "cancelled",
      ],
      business_invoice_type: ["standard", "progress", "final", "deposit"],
      business_payment_method: [
        "cash",
        "check",
        "credit_card",
        "e_transfer",
        "wire_transfer",
        "other",
      ],
      business_project_priority: ["low", "normal", "high", "urgent"],
      business_project_status: [
        "lead",
        "quoted",
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
      ],
      employment_type: ["full_time", "part_time", "contract", "internship"],
      post_content_type: ["article", "case_study", "insight", "case-study"],
      publish_state: ["draft", "scheduled", "published", "archived", "review"],
    },
  },
} as const
