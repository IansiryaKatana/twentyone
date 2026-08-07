export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type AdminRole = "owner" | "admin" | "editor" | "viewer";

export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string;
          auth_user_id: string | null;
          email: string;
          role: AdminRole;
          is_active: boolean;
          display_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id?: string | null;
          email: string;
          role?: AdminRole;
          is_active?: boolean;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          auth_user_id?: string | null;
          email?: string;
          role?: AdminRole;
          is_active?: boolean;
          display_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          slug: string;
          title: string;
          location: string;
          price: string;
          category: string;
          year: string;
          client: string;
          area: string;
          status: string;
          duration: string;
          typologies: Json;
          scope: Json;
          materials: Json;
          finishes: Json;
          credits: Json;
          challenge: string;
          approach: string;
          outcome: string;
          excerpt: string;
          body: Json;
          hero: string;
          gallery: Json;
          span: string;
          services: Json;
          featured: boolean;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          location?: string;
          price?: string;
          category?: string;
          year?: string;
          client?: string;
          area?: string;
          status?: string;
          duration?: string;
          typologies?: Json;
          scope?: Json;
          materials?: Json;
          finishes?: Json;
          credits?: Json;
          challenge?: string;
          approach?: string;
          outcome?: string;
          excerpt?: string;
          body?: Json;
          hero?: string;
          gallery?: Json;
          span?: string;
          services?: Json;
          featured?: boolean;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          location?: string;
          price?: string;
          category?: string;
          year?: string;
          client?: string;
          area?: string;
          status?: string;
          duration?: string;
          typologies?: Json;
          scope?: Json;
          materials?: Json;
          finishes?: Json;
          credits?: Json;
          challenge?: string;
          approach?: string;
          outcome?: string;
          excerpt?: string;
          body?: Json;
          hero?: string;
          gallery?: Json;
          span?: string;
          services?: Json;
          featured?: boolean;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      journal_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string;
          date: string;
          tag: string;
          image: string;
          body: Json;
          body_html: string | null;
          featured: boolean;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string;
          date?: string;
          tag?: string;
          image?: string;
          body?: Json;
          body_html?: string | null;
          featured?: boolean;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string;
          date?: string;
          tag?: string;
          image?: string;
          body?: Json;
          body_html?: string | null;
          featured?: boolean;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      faq_topics: {
        Row: {
          id: string;
          slug: string;
          label: string;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          label: string;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          label?: string;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      faq_entries: {
        Row: {
          id: string;
          topic_id: string;
          question: string;
          answer: string;
          answer_html: string | null;
          link_label: string | null;
          link_to: string | null;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          topic_id: string;
          question: string;
          answer: string;
          answer_html?: string | null;
          link_label?: string | null;
          link_to?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          topic_id?: string;
          question?: string;
          answer?: string;
          answer_html?: string | null;
          link_label?: string | null;
          link_to?: string | null;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "faq_entries_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "faq_topics";
            referencedColumns: ["id"];
          },
        ];
      };
      services: {
        Row: {
          id: string;
          slug: string;
          label: string;
          index_label: string | null;
          title: string;
          description: string;
          detail: string;
          intro: string;
          bullets: Json;
          cta: string;
          image: string;
          hero_image: string;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          label: string;
          index_label?: string | null;
          title?: string;
          description?: string;
          detail?: string;
          intro?: string;
          bullets?: Json;
          cta?: string;
          image?: string;
          hero_image?: string;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          label?: string;
          index_label?: string | null;
          title?: string;
          description?: string;
          detail?: string;
          intro?: string;
          bullets?: Json;
          cta?: string;
          image?: string;
          hero_image?: string;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      service_capabilities: {
        Row: {
          id: string;
          service_id: string;
          index_label: string;
          title: string;
          description: string;
          image: string;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          service_id: string;
          index_label: string;
          title: string;
          description?: string;
          image?: string;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          service_id?: string;
          index_label?: string;
          title?: string;
          description?: string;
          image?: string;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "service_capabilities_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          },
        ];
      };
      testimonials: {
        Row: {
          id: string;
          quote: string;
          name: string;
          role: string;
          image: string;
          status: string;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          quote: string;
          name: string;
          role?: string;
          image?: string;
          status?: string;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          quote?: string;
          name?: string;
          role?: string;
          image?: string;
          status?: string;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      team_members: {
        Row: {
          id: string;
          name: string;
          title: string;
          image: string;
          linkedin: string;
          instagram: string;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          title?: string;
          image?: string;
          linkedin?: string;
          instagram?: string;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          title?: string;
          image?: string;
          linkedin?: string;
          instagram?: string;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      awards: {
        Row: {
          id: string;
          status: string;
          title: string;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          status?: string;
          title: string;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          status?: string;
          title?: string;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      why_us: {
        Row: {
          id: string;
          title: string;
          body: string;
          sort_order: number;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          body?: string;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          body?: string;
          sort_order?: number;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      marketing_pages: {
        Row: {
          id: string;
          slug: string;
          title: string;
          content: Json;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          content?: Json;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          content?: Json;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value?: Json;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      cms_media: {
        Row: {
          id: string;
          public_url: string;
          storage_path: string;
          folder: string;
          kind: string;
          file_name: string;
          mime_type: string;
          size_bytes: number;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          public_url: string;
          storage_path: string;
          folder?: string;
          kind?: string;
          file_name: string;
          mime_type?: string;
          size_bytes?: number;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          public_url?: string;
          storage_path?: string;
          folder?: string;
          kind?: string;
          file_name?: string;
          mime_type?: string;
          size_bytes?: number;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      form_submissions: {
        Row: {
          id: string;
          form_name: string;
          payload: Json;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          form_name: string;
          payload?: Json;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          form_name?: string;
          payload?: Json;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_active_admin: {
        Args: never;
        Returns: boolean;
      };
      is_admin_role: {
        Args: { allowed: string[] };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
