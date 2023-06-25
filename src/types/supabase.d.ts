export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      commands: {
        Row: {
          cooldown: number
          created_at: string | null
          name: string
        }
        Insert: {
          cooldown: number
          created_at?: string | null
          name: string
        }
        Update: {
          cooldown?: number
          created_at?: string | null
          name?: string
        }
        Relationships: []
      }
      showcases: {
        Row: {
          created_at: string | null
          description: string
          id: number
          id_author: string
          id_message: string
          link: string
          name: string
          need_contributors: boolean
          supabase_relation: string
          thumbnail: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: number
          id_author: string
          id_message: string
          link: string
          name: string
          need_contributors: boolean
          supabase_relation: string
          thumbnail?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: number
          id_author?: string
          id_message?: string
          link?: string
          name?: string
          need_contributors?: boolean
          supabase_relation?: string
          thumbnail?: string | null
        }
        Relationships: []
      }
      user_cooldowns: {
        Row: {
          command_name: string
          id: number
          id_user: string
          last_used: string
        }
        Insert: {
          command_name: string
          id?: number
          id_user: string
          last_used: string
        }
        Update: {
          command_name?: string
          id?: number
          id_user?: string
          last_used?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cooldowns_command_name_fkey"
            columns: ["command_name"]
            referencedRelation: "commands"
            referencedColumns: ["name"]
          }
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

