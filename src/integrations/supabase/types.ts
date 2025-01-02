export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      client_accounts: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          city: string | null
          client_account_id: string
          client_code: string
          contact_info: Json | null
          country: string | null
          created_at: string | null
          created_by: string | null
          display_name: string
          entity_type_id: string | null
          gstin: string | null
          headquarters_id: string | null
          icn: string | null
          industry_id: string | null
          is_active: boolean
          is_client: boolean
          location_type: Database["public"]["Enums"]["client_location_type"]
          logo_url: string | null
          parent_client_account_id: string | null
          postal_code: string | null
          registered_name: string
          relationship_notes: string | null
          relationship_type: Database["public"]["Enums"]["company_relationship_type"]
          slug: string | null
          state: string | null
          tan: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          client_account_id?: string
          client_code: string
          contact_info?: Json | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          display_name: string
          entity_type_id?: string | null
          gstin?: string | null
          headquarters_id?: string | null
          icn?: string | null
          industry_id?: string | null
          is_active?: boolean
          is_client?: boolean
          location_type: Database["public"]["Enums"]["client_location_type"]
          logo_url?: string | null
          parent_client_account_id?: string | null
          postal_code?: string | null
          registered_name: string
          relationship_notes?: string | null
          relationship_type?: Database["public"]["Enums"]["company_relationship_type"]
          slug?: string | null
          state?: string | null
          tan?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          client_account_id?: string
          client_code?: string
          contact_info?: Json | null
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          display_name?: string
          entity_type_id?: string | null
          gstin?: string | null
          headquarters_id?: string | null
          icn?: string | null
          industry_id?: string | null
          is_active?: boolean
          is_client?: boolean
          location_type?: Database["public"]["Enums"]["client_location_type"]
          logo_url?: string | null
          parent_client_account_id?: string | null
          postal_code?: string | null
          registered_name?: string
          relationship_notes?: string | null
          relationship_type?: Database["public"]["Enums"]["company_relationship_type"]
          slug?: string | null
          state?: string | null
          tan?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_accounts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_accounts_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profile_with_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_accounts_entity_type_id_fkey"
            columns: ["entity_type_id"]
            isOneToOne: false
            referencedRelation: "entity_types"
            referencedColumns: ["entity_type_id"]
          },
          {
            foreignKeyName: "client_accounts_headquarters_id_fkey"
            columns: ["headquarters_id"]
            isOneToOne: false
            referencedRelation: "client_accounts"
            referencedColumns: ["client_account_id"]
          },
          {
            foreignKeyName: "client_accounts_industry_id_fkey"
            columns: ["industry_id"]
            isOneToOne: false
            referencedRelation: "industries"
            referencedColumns: ["industry_id"]
          },
          {
            foreignKeyName: "client_accounts_parent_client_account_id_fkey"
            columns: ["parent_client_account_id"]
            isOneToOne: false
            referencedRelation: "client_accounts"
            referencedColumns: ["client_account_id"]
          },
          {
            foreignKeyName: "client_accounts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_accounts_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_profile_with_type"
            referencedColumns: ["id"]
          },
        ]
      }
      divisions: {
        Row: {
          cost_center_code: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          division_code: string
          division_head_id: string | null
          division_id: string
          division_name: string
          hierarchy_level: number | null
          is_active: boolean | null
          parent_division_id: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          cost_center_code?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          division_code: string
          division_head_id?: string | null
          division_id?: string
          division_name: string
          hierarchy_level?: number | null
          is_active?: boolean | null
          parent_division_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          cost_center_code?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          division_code?: string
          division_head_id?: string | null
          division_id?: string
          division_name?: string
          hierarchy_level?: number | null
          is_active?: boolean | null
          parent_division_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "divisions_division_head_id_fkey"
            columns: ["division_head_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "divisions_division_head_id_fkey"
            columns: ["division_head_id"]
            isOneToOne: false
            referencedRelation: "user_profile_with_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "divisions_parent_division_id_fkey"
            columns: ["parent_division_id"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["division_id"]
          },
          {
            foreignKeyName: "divisions_parent_division_id_fkey"
            columns: ["parent_division_id"]
            isOneToOne: false
            referencedRelation: "divisions_with_managers"
            referencedColumns: ["division_id"]
          },
        ]
      }
      entity_types: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          entity_type_id: string
          is_active: boolean
          type_code: string
          type_name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          entity_type_id?: string
          is_active?: boolean
          type_code: string
          type_name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          entity_type_id?: string
          is_active?: boolean
          type_code?: string
          type_name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "entity_types_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_types_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profile_with_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_types_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entity_types_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_profile_with_type"
            referencedColumns: ["id"]
          },
        ]
      }
      industries: {
        Row: {
          created_at: string | null
          created_by: string | null
          industry_code: string
          industry_id: string
          industry_name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          industry_code: string
          industry_id?: string
          industry_name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          industry_code?: string
          industry_id?: string
          industry_name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "industries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "industries_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profile_with_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "industries_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "industries_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_profile_with_type"
            referencedColumns: ["id"]
          },
        ]
      }
      menu_items: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          icon: string | null
          is_active: boolean | null
          menu_item_id: string
          order_index: number
          parent_id: string | null
          path: string | null
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          is_active?: boolean | null
          menu_item_id?: string
          order_index?: number
          parent_id?: string | null
          path?: string | null
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          is_active?: boolean | null
          menu_item_id?: string
          order_index?: number
          parent_id?: string | null
          path?: string | null
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "menu_items_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "menu_items"
            referencedColumns: ["menu_item_id"]
          },
        ]
      }
      menu_items_backup: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          icon: string | null
          is_active: boolean | null
          menu_item_id: string | null
          order_index: number | null
          parent_id: string | null
          path: string | null
          title: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          is_active?: boolean | null
          menu_item_id?: string | null
          order_index?: number | null
          parent_id?: string | null
          path?: string | null
          title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          icon?: string | null
          is_active?: boolean | null
          menu_item_id?: string | null
          order_index?: number | null
          parent_id?: string | null
          path?: string | null
          title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      parent_client_association: {
        Row: {
          association_id: string
          client_account_id: string
          created_at: string | null
          created_by: string | null
          has_billing_relationship: boolean | null
          parent_company_id: string
          relationship_notes: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          association_id?: string
          client_account_id: string
          created_at?: string | null
          created_by?: string | null
          has_billing_relationship?: boolean | null
          parent_company_id: string
          relationship_notes?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          association_id?: string
          client_account_id?: string
          created_at?: string | null
          created_by?: string | null
          has_billing_relationship?: boolean | null
          parent_company_id?: string
          relationship_notes?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_client_association_client_account_id_fkey"
            columns: ["client_account_id"]
            isOneToOne: false
            referencedRelation: "client_accounts"
            referencedColumns: ["client_account_id"]
          },
          {
            foreignKeyName: "parent_client_association_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_client_association_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profile_with_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_client_association_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "parent_companies"
            referencedColumns: ["parent_company_id"]
          },
          {
            foreignKeyName: "parent_client_association_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parent_client_association_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_profile_with_type"
            referencedColumns: ["id"]
          },
        ]
      }
      parent_companies: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          bank_account_no: string | null
          bank_name: string | null
          beneficiary_name: string | null
          branch_name: string | null
          city: string | null
          company_code: string
          country: string | null
          created_at: string | null
          created_by: string | null
          display_name: string
          email: string | null
          ifsc_code: string | null
          is_active: boolean | null
          logo_url: string | null
          parent_company_id: string
          parent_id: string | null
          phone: string | null
          postal_code: string | null
          registered_name: string
          registration_number: string | null
          state: string | null
          tax_number: string | null
          updated_at: string | null
          updated_by: string | null
          website: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          bank_account_no?: string | null
          bank_name?: string | null
          beneficiary_name?: string | null
          branch_name?: string | null
          city?: string | null
          company_code: string
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          display_name: string
          email?: string | null
          ifsc_code?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          parent_company_id?: string
          parent_id?: string | null
          phone?: string | null
          postal_code?: string | null
          registered_name: string
          registration_number?: string | null
          state?: string | null
          tax_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          bank_account_no?: string | null
          bank_name?: string | null
          beneficiary_name?: string | null
          branch_name?: string | null
          city?: string | null
          company_code?: string
          country?: string | null
          created_at?: string | null
          created_by?: string | null
          display_name?: string
          email?: string | null
          ifsc_code?: string | null
          is_active?: boolean | null
          logo_url?: string | null
          parent_company_id?: string
          parent_id?: string | null
          phone?: string | null
          postal_code?: string | null
          registered_name?: string
          registration_number?: string | null
          state?: string | null
          tax_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parent_companies_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "parent_companies"
            referencedColumns: ["parent_company_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          created_by: string | null
          division_id: string | null
          email: string | null
          employee_id: string | null
          first_name: string | null
          id: string
          image_url: string | null
          invitation_status: string | null
          is_active: boolean | null
          last_login: string | null
          last_name: string | null
          manager_id: string | null
          parent_company_id: string | null
          role_id: string | null
          updated_at: string | null
          updated_by: string | null
          user_type_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          division_id?: string | null
          email?: string | null
          employee_id?: string | null
          first_name?: string | null
          id: string
          image_url?: string | null
          invitation_status?: string | null
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          manager_id?: string | null
          parent_company_id?: string | null
          role_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_type_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          division_id?: string | null
          email?: string | null
          employee_id?: string | null
          first_name?: string | null
          id?: string
          image_url?: string | null
          invitation_status?: string | null
          is_active?: boolean | null
          last_login?: string | null
          last_name?: string | null
          manager_id?: string | null
          parent_company_id?: string | null
          role_id?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["division_id"]
          },
          {
            foreignKeyName: "profiles_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "divisions_with_managers"
            referencedColumns: ["division_id"]
          },
          {
            foreignKeyName: "profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "user_profile_with_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "parent_companies"
            referencedColumns: ["parent_company_id"]
          },
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "profiles_user_type_id_fkey"
            columns: ["user_type_id"]
            isOneToOne: false
            referencedRelation: "user_types"
            referencedColumns: ["user_type_id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          hierarchy_level: number | null
          is_active: boolean | null
          role_code: string
          role_id: string
          role_name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          hierarchy_level?: number | null
          is_active?: boolean | null
          role_code: string
          role_id?: string
          role_name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          hierarchy_level?: number | null
          is_active?: boolean | null
          role_code?: string
          role_id?: string
          role_name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      user_types: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          is_active: boolean | null
          type_code: string
          type_name: string
          updated_at: string | null
          updated_by: string | null
          user_type_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          is_active?: boolean | null
          type_code: string
          type_name: string
          updated_at?: string | null
          updated_by?: string | null
          user_type_id?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          is_active?: boolean | null
          type_code?: string
          type_name?: string
          updated_at?: string | null
          updated_by?: string | null
          user_type_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      divisions_with_managers: {
        Row: {
          cost_center_code: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          division_code: string | null
          division_head_id: string | null
          division_id: string | null
          division_name: string | null
          hierarchy_level: number | null
          is_active: boolean | null
          manager_first_name: string | null
          manager_last_name: string | null
          parent_division_id: string | null
          profile_count: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Relationships: [
          {
            foreignKeyName: "divisions_division_head_id_fkey"
            columns: ["division_head_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "divisions_division_head_id_fkey"
            columns: ["division_head_id"]
            isOneToOne: false
            referencedRelation: "user_profile_with_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "divisions_parent_division_id_fkey"
            columns: ["parent_division_id"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["division_id"]
          },
          {
            foreignKeyName: "divisions_parent_division_id_fkey"
            columns: ["parent_division_id"]
            isOneToOne: false
            referencedRelation: "divisions_with_managers"
            referencedColumns: ["division_id"]
          },
        ]
      }
      user_profile_with_type: {
        Row: {
          company_name: string | null
          created_at: string | null
          created_by: string | null
          division_code: string | null
          division_id: string | null
          division_name: string | null
          email: string | null
          employee_id: string | null
          first_name: string | null
          id: string | null
          image_url: string | null
          invitation_status: string | null
          is_active: boolean | null
          last_login: string | null
          last_name: string | null
          manager_id: string | null
          parent_company_id: string | null
          role_code: string | null
          role_id: string | null
          role_name: string | null
          updated_at: string | null
          updated_by: string | null
          user_type_code: string | null
          user_type_id: string | null
          user_type_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "divisions"
            referencedColumns: ["division_id"]
          },
          {
            foreignKeyName: "profiles_division_id_fkey"
            columns: ["division_id"]
            isOneToOne: false
            referencedRelation: "divisions_with_managers"
            referencedColumns: ["division_id"]
          },
          {
            foreignKeyName: "profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "user_profile_with_type"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_parent_company_id_fkey"
            columns: ["parent_company_id"]
            isOneToOne: false
            referencedRelation: "parent_companies"
            referencedColumns: ["parent_company_id"]
          },
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "profiles_user_type_id_fkey"
            columns: ["user_type_id"]
            isOneToOne: false
            referencedRelation: "user_types"
            referencedColumns: ["user_type_id"]
          },
        ]
      }
    }
    Functions: {
      generate_migration: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      generate_unique_slug: {
        Args: {
          display_name: string
        }
        Returns: string
      }
    }
    Enums: {
      client_location_type: "HEADQUARTERS" | "BRANCH"
      company_relationship_type: "PROSPECT" | "CLIENT" | "PARTNER" | "AFFILIATE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
