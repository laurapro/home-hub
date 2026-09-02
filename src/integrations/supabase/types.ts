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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      calendar_events: {
        Row: {
          all_day: boolean
          attendees: Json
          calendar_source_id: string
          categories: string[]
          created_at: string
          description: string | null
          end_date: string | null
          ends_at: string | null
          event_url: string | null
          external_event_id: string
          household_id: string
          id: string
          is_recurring: boolean
          last_seen_at: string
          last_seen_sync_run_id: string | null
          location: string | null
          metadata: Json
          occurrence_key: string
          original_start_at: string | null
          recurrence_id: string | null
          recurrence_rule: string | null
          source_calendar_name: string | null
          source_etag: string | null
          source_href: string | null
          start_date: string | null
          starts_at: string | null
          status: string
          synchronized_at: string
          title: string
          transparency: string
          updated_at: string
        }
        Insert: {
          all_day?: boolean
          attendees?: Json
          calendar_source_id: string
          categories?: string[]
          created_at?: string
          description?: string | null
          end_date?: string | null
          ends_at?: string | null
          event_url?: string | null
          external_event_id: string
          household_id: string
          id?: string
          is_recurring?: boolean
          last_seen_at?: string
          last_seen_sync_run_id?: string | null
          location?: string | null
          metadata?: Json
          occurrence_key?: string
          original_start_at?: string | null
          recurrence_id?: string | null
          recurrence_rule?: string | null
          source_calendar_name?: string | null
          source_etag?: string | null
          source_href?: string | null
          start_date?: string | null
          starts_at?: string | null
          status?: string
          synchronized_at?: string
          title: string
          transparency?: string
          updated_at?: string
        }
        Update: {
          all_day?: boolean
          attendees?: Json
          calendar_source_id?: string
          categories?: string[]
          created_at?: string
          description?: string | null
          end_date?: string | null
          ends_at?: string | null
          event_url?: string | null
          external_event_id?: string
          household_id?: string
          id?: string
          is_recurring?: boolean
          last_seen_at?: string
          last_seen_sync_run_id?: string | null
          location?: string | null
          metadata?: Json
          occurrence_key?: string
          original_start_at?: string | null
          recurrence_id?: string | null
          recurrence_rule?: string | null
          source_calendar_name?: string | null
          source_etag?: string | null
          source_href?: string | null
          start_date?: string | null
          starts_at?: string | null
          status?: string
          synchronized_at?: string
          title?: string
          transparency?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_calendar_source_id_fkey"
            columns: ["calendar_source_id"]
            isOneToOne: false
            referencedRelation: "calendar_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "calendar_events_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "calendar_events_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "calendar_events_last_seen_sync_run_id_fkey"
            columns: ["last_seen_sync_run_id"]
            isOneToOne: false
            referencedRelation: "calendar_sync_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_sources: {
        Row: {
          active: boolean
          connection_metadata: Json
          created_at: string
          external_source_id: string
          household_id: string
          id: string
          last_sync_completed_at: string | null
          last_sync_error: string | null
          last_sync_started_at: string | null
          last_sync_status: string | null
          name: string
          provider: string
          sync_token: string | null
          sync_window_future_days: number
          sync_window_past_days: number
          updated_at: string
        }
        Insert: {
          active?: boolean
          connection_metadata?: Json
          created_at?: string
          external_source_id: string
          household_id: string
          id?: string
          last_sync_completed_at?: string | null
          last_sync_error?: string | null
          last_sync_started_at?: string | null
          last_sync_status?: string | null
          name: string
          provider?: string
          sync_token?: string | null
          sync_window_future_days?: number
          sync_window_past_days?: number
          updated_at?: string
        }
        Update: {
          active?: boolean
          connection_metadata?: Json
          created_at?: string
          external_source_id?: string
          household_id?: string
          id?: string
          last_sync_completed_at?: string | null
          last_sync_error?: string | null
          last_sync_started_at?: string | null
          last_sync_status?: string | null
          name?: string
          provider?: string
          sync_token?: string | null
          sync_window_future_days?: number
          sync_window_past_days?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_sources_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_sources_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "calendar_sources_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "calendar_sources_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      calendar_sync_commands: {
        Row: {
          actor_ref: string
          calendar_source_id: string
          created_at: string
          error_text: string | null
          events_payload: Json
          household_id: string
          id: string
          processed_at: string | null
          result: Json | null
          status: string
          window_end: string
          window_start: string
        }
        Insert: {
          actor_ref?: string
          calendar_source_id: string
          created_at?: string
          error_text?: string | null
          events_payload?: Json
          household_id: string
          id?: string
          processed_at?: string | null
          result?: Json | null
          status?: string
          window_end: string
          window_start: string
        }
        Update: {
          actor_ref?: string
          calendar_source_id?: string
          created_at?: string
          error_text?: string | null
          events_payload?: Json
          household_id?: string
          id?: string
          processed_at?: string | null
          result?: Json | null
          status?: string
          window_end?: string
          window_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_sync_commands_calendar_source_id_fkey"
            columns: ["calendar_source_id"]
            isOneToOne: false
            referencedRelation: "calendar_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_sync_commands_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_sync_commands_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "calendar_sync_commands_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "calendar_sync_commands_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      calendar_sync_runs: {
        Row: {
          calendar_source_id: string
          completed_at: string | null
          error_text: string | null
          events_cancelled: number
          events_inserted: number
          events_seen: number
          events_updated: number
          household_id: string
          id: string
          started_at: string
          status: string
          window_end: string
          window_start: string
        }
        Insert: {
          calendar_source_id: string
          completed_at?: string | null
          error_text?: string | null
          events_cancelled?: number
          events_inserted?: number
          events_seen?: number
          events_updated?: number
          household_id: string
          id?: string
          started_at?: string
          status?: string
          window_end: string
          window_start: string
        }
        Update: {
          calendar_source_id?: string
          completed_at?: string | null
          error_text?: string | null
          events_cancelled?: number
          events_inserted?: number
          events_seen?: number
          events_updated?: number
          household_id?: string
          id?: string
          started_at?: string
          status?: string
          window_end?: string
          window_start?: string
        }
        Relationships: [
          {
            foreignKeyName: "calendar_sync_runs_calendar_source_id_fkey"
            columns: ["calendar_source_id"]
            isOneToOne: false
            referencedRelation: "calendar_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_sync_runs_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_sync_runs_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "calendar_sync_runs_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "calendar_sync_runs_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      events: {
        Row: {
          actor_ref: string | null
          actor_type: string | null
          created_at: string
          dedupe_key: string | null
          entity_id: string | null
          entity_type: string | null
          event_type: string
          household_id: string
          id: string
          occurred_at: string
          payload: Json
        }
        Insert: {
          actor_ref?: string | null
          actor_type?: string | null
          created_at?: string
          dedupe_key?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_type: string
          household_id: string
          id?: string
          occurred_at?: string
          payload?: Json
        }
        Update: {
          actor_ref?: string | null
          actor_type?: string | null
          created_at?: string
          dedupe_key?: string | null
          entity_id?: string | null
          entity_type?: string | null
          event_type?: string
          household_id?: string
          id?: string
          occurred_at?: string
          payload?: Json
        }
        Relationships: [
          {
            foreignKeyName: "events_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "events_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "events_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      family_routines: {
        Row: {
          active: boolean
          created_at: string
          effective_from: string | null
          effective_until: string | null
          ends_at: string
          household_id: string
          id: string
          metadata: Json
          name: string
          person_context: string
          planning_window_ends_at: string | null
          routine_type: string
          starts_at: string
          updated_at: string
          weekday: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          ends_at: string
          household_id: string
          id?: string
          metadata?: Json
          name: string
          person_context: string
          planning_window_ends_at?: string | null
          routine_type: string
          starts_at: string
          updated_at?: string
          weekday: number
        }
        Update: {
          active?: boolean
          created_at?: string
          effective_from?: string | null
          effective_until?: string | null
          ends_at?: string
          household_id?: string
          id?: string
          metadata?: Json
          name?: string
          person_context?: string
          planning_window_ends_at?: string | null
          routine_type?: string
          starts_at?: string
          updated_at?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "family_routines_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_routines_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "family_routines_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "family_routines_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      food_ui_commands: {
        Row: {
          actor_ref: string
          command_type: string
          created_at: string
          error_message: string | null
          household_id: string
          id: string
          payload: Json
          processed_at: string | null
          result: Json | null
          status: string
        }
        Insert: {
          actor_ref?: string
          command_type: string
          created_at?: string
          error_message?: string | null
          household_id: string
          id?: string
          payload?: Json
          processed_at?: string | null
          result?: Json | null
          status?: string
        }
        Update: {
          actor_ref?: string
          command_type?: string
          created_at?: string
          error_message?: string | null
          household_id?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          result?: Json | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "food_ui_commands_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "food_ui_commands_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "food_ui_commands_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "food_ui_commands_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      household_memberships: {
        Row: {
          created_at: string
          household_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          household_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string
          household_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "household_memberships_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "household_memberships_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "household_memberships_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "household_memberships_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      household_routine_schedule: {
        Row: {
          active: boolean
          created_at: string
          household_id: string
          id: string
          label: string
          metadata: Json
          routine_key: string
          time_of_day: string
          updated_at: string
          weekday: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          household_id: string
          id?: string
          label: string
          metadata?: Json
          routine_key: string
          time_of_day: string
          updated_at?: string
          weekday: number
        }
        Update: {
          active?: boolean
          created_at?: string
          household_id?: string
          id?: string
          label?: string
          metadata?: Json
          routine_key?: string
          time_of_day?: string
          updated_at?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "household_routine_schedule_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "household_routine_schedule_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "household_routine_schedule_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "household_routine_schedule_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      households: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
          timezone: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
          timezone?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
          timezone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          confidence: number
          created_at: string
          household_id: string
          id: string
          item_id: string
          last_confirmed_at: string | null
          last_purchased_at: string | null
          location_id: string
          meals_remaining: number | null
          opened_at: string | null
          quantity: number | null
          quantity_unit: string | null
          source: string | null
          status: string
          updated_at: string
        }
        Insert: {
          confidence?: number
          created_at?: string
          household_id: string
          id?: string
          item_id: string
          last_confirmed_at?: string | null
          last_purchased_at?: string | null
          location_id: string
          meals_remaining?: number | null
          opened_at?: string | null
          quantity?: number | null
          quantity_unit?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          confidence?: number
          created_at?: string
          household_id?: string
          id?: string
          item_id?: string
          last_confirmed_at?: string | null
          last_purchased_at?: string | null
          location_id?: string
          meals_remaining?: number | null
          opened_at?: string | null
          quantity?: number | null
          quantity_unit?: string | null
          source?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "inventory_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "inventory_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "costco_item_predictions"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_inventory_controls"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_planned_meal_shopping_candidates"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "inventory_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["to_location_id"]
          },
          {
            foreignKeyName: "inventory_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_corrections: {
        Row: {
          actor_ref: string | null
          actor_type: string
          after_state: Json
          before_state: Json
          correction_type: string
          created_at: string
          household_id: string
          id: string
          inventory_id: string
          item_id: string
          location_id: string
        }
        Insert: {
          actor_ref?: string | null
          actor_type?: string
          after_state: Json
          before_state: Json
          correction_type: string
          created_at?: string
          household_id: string
          id?: string
          inventory_id: string
          item_id: string
          location_id: string
        }
        Update: {
          actor_ref?: string | null
          actor_type?: string
          after_state?: Json
          before_state?: Json
          correction_type?: string
          created_at?: string
          household_id?: string
          id?: string
          inventory_id?: string
          item_id?: string
          location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_corrections_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_corrections_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "inventory_corrections_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "inventory_corrections_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "inventory_corrections_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "food_inventory_controls"
            referencedColumns: ["inventory_id"]
          },
          {
            foreignKeyName: "inventory_corrections_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "food_owned_item_attention"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "inventory_corrections_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["from_inventory_id"]
          },
          {
            foreignKeyName: "inventory_corrections_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "food_use_soon_attention"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "inventory_corrections_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_corrections_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["inventory_id"]
          },
          {
            foreignKeyName: "inventory_corrections_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "costco_item_predictions"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_corrections_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_inventory_controls"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_corrections_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_planned_meal_shopping_candidates"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_corrections_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_corrections_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_corrections_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_corrections_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_corrections_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_corrections_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "inventory_corrections_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["to_location_id"]
          },
          {
            foreignKeyName: "inventory_corrections_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          actor_ref: string | null
          actor_type: string
          after_state: Json
          before_state: Json
          created_at: string
          dedupe_key: string | null
          from_inventory_id: string
          from_location_id: string
          household_id: string
          id: string
          item_id: string
          meals_moved: number | null
          to_inventory_id: string
          to_location_id: string
        }
        Insert: {
          actor_ref?: string | null
          actor_type?: string
          after_state: Json
          before_state: Json
          created_at?: string
          dedupe_key?: string | null
          from_inventory_id: string
          from_location_id: string
          household_id: string
          id?: string
          item_id: string
          meals_moved?: number | null
          to_inventory_id: string
          to_location_id: string
        }
        Update: {
          actor_ref?: string | null
          actor_type?: string
          after_state?: Json
          before_state?: Json
          created_at?: string
          dedupe_key?: string | null
          from_inventory_id?: string
          from_location_id?: string
          household_id?: string
          id?: string
          item_id?: string
          meals_moved?: number | null
          to_inventory_id?: string
          to_location_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_from_inventory_id_fkey"
            columns: ["from_inventory_id"]
            isOneToOne: false
            referencedRelation: "food_inventory_controls"
            referencedColumns: ["inventory_id"]
          },
          {
            foreignKeyName: "inventory_movements_from_inventory_id_fkey"
            columns: ["from_inventory_id"]
            isOneToOne: false
            referencedRelation: "food_owned_item_attention"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "inventory_movements_from_inventory_id_fkey"
            columns: ["from_inventory_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["from_inventory_id"]
          },
          {
            foreignKeyName: "inventory_movements_from_inventory_id_fkey"
            columns: ["from_inventory_id"]
            isOneToOne: false
            referencedRelation: "food_use_soon_attention"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "inventory_movements_from_inventory_id_fkey"
            columns: ["from_inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_from_inventory_id_fkey"
            columns: ["from_inventory_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["inventory_id"]
          },
          {
            foreignKeyName: "inventory_movements_from_location_id_fkey"
            columns: ["from_location_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["to_location_id"]
          },
          {
            foreignKeyName: "inventory_movements_from_location_id_fkey"
            columns: ["from_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "inventory_movements_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "inventory_movements_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "costco_item_predictions"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_inventory_controls"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_planned_meal_shopping_candidates"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "inventory_movements_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "inventory_movements_to_inventory_id_fkey"
            columns: ["to_inventory_id"]
            isOneToOne: false
            referencedRelation: "food_inventory_controls"
            referencedColumns: ["inventory_id"]
          },
          {
            foreignKeyName: "inventory_movements_to_inventory_id_fkey"
            columns: ["to_inventory_id"]
            isOneToOne: false
            referencedRelation: "food_owned_item_attention"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "inventory_movements_to_inventory_id_fkey"
            columns: ["to_inventory_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["from_inventory_id"]
          },
          {
            foreignKeyName: "inventory_movements_to_inventory_id_fkey"
            columns: ["to_inventory_id"]
            isOneToOne: false
            referencedRelation: "food_use_soon_attention"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "inventory_movements_to_inventory_id_fkey"
            columns: ["to_inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_to_inventory_id_fkey"
            columns: ["to_inventory_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["inventory_id"]
          },
          {
            foreignKeyName: "inventory_movements_to_location_id_fkey"
            columns: ["to_location_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["to_location_id"]
          },
          {
            foreignKeyName: "inventory_movements_to_location_id_fkey"
            columns: ["to_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      item_aliases: {
        Row: {
          alias: string
          created_at: string
          external_item_code: string | null
          id: string
          item_id: string
          source: string | null
        }
        Insert: {
          alias: string
          created_at?: string
          external_item_code?: string | null
          id?: string
          item_id: string
          source?: string | null
        }
        Update: {
          alias?: string
          created_at?: string
          external_item_code?: string | null
          id?: string
          item_id?: string
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "item_aliases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "costco_item_predictions"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_aliases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_inventory_controls"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_aliases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_planned_meal_shopping_candidates"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_aliases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_aliases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_aliases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "item_aliases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_aliases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "item_aliases_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["entity_id"]
          },
        ]
      }
      items: {
        Row: {
          active: boolean
          category: string
          created_at: string
          default_location_id: string | null
          default_unit: string | null
          household_id: string
          id: string
          meal_planning_relevant: boolean
          name: string
          notes: string | null
          preferred_store_id: string | null
          reorder_threshold: number | null
          restock_policy: string
          surface_when_owned: boolean
          tracking_mode: string
          typical_lifespan_days: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          category: string
          created_at?: string
          default_location_id?: string | null
          default_unit?: string | null
          household_id: string
          id?: string
          meal_planning_relevant?: boolean
          name: string
          notes?: string | null
          preferred_store_id?: string | null
          reorder_threshold?: number | null
          restock_policy?: string
          surface_when_owned?: boolean
          tracking_mode?: string
          typical_lifespan_days?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          category?: string
          created_at?: string
          default_location_id?: string | null
          default_unit?: string | null
          household_id?: string
          id?: string
          meal_planning_relevant?: boolean
          name?: string
          notes?: string | null
          preferred_store_id?: string | null
          reorder_threshold?: number | null
          restock_policy?: string
          surface_when_owned?: boolean
          tracking_mode?: string
          typical_lifespan_days?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "items_default_location_id_fkey"
            columns: ["default_location_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["to_location_id"]
          },
          {
            foreignKeyName: "items_default_location_id_fkey"
            columns: ["default_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "items_preferred_store_id_fkey"
            columns: ["preferred_store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          active: boolean
          created_at: string
          household_id: string
          id: string
          location_type: string | null
          name: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          household_id: string
          id?: string
          location_type?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          household_id?: string
          id?: string
          location_type?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "locations_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locations_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "locations_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "locations_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      meal_completions: {
        Row: {
          actor_ref: string | null
          actor_type: string
          completed_at: string
          household_id: string
          id: string
          planned_meal_id: string
          portions_made: number | null
          recipe_id: string
        }
        Insert: {
          actor_ref?: string | null
          actor_type?: string
          completed_at?: string
          household_id: string
          id?: string
          planned_meal_id: string
          portions_made?: number | null
          recipe_id: string
        }
        Update: {
          actor_ref?: string | null
          actor_type?: string
          completed_at?: string
          household_id?: string
          id?: string
          planned_meal_id?: string
          portions_made?: number | null
          recipe_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_completions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_completions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "meal_completions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "meal_completions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "meal_completions_planned_meal_id_fkey"
            columns: ["planned_meal_id"]
            isOneToOne: true
            referencedRelation: "food_planned_meal_shopping_candidates"
            referencedColumns: ["planned_meal_id"]
          },
          {
            foreignKeyName: "meal_completions_planned_meal_id_fkey"
            columns: ["planned_meal_id"]
            isOneToOne: true
            referencedRelation: "food_planned_meal_state"
            referencedColumns: ["planned_meal_id"]
          },
          {
            foreignKeyName: "meal_completions_planned_meal_id_fkey"
            columns: ["planned_meal_id"]
            isOneToOne: true
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["planned_meal_id"]
          },
          {
            foreignKeyName: "meal_completions_planned_meal_id_fkey"
            columns: ["planned_meal_id"]
            isOneToOne: true
            referencedRelation: "household_home_meals"
            referencedColumns: ["planned_meal_id"]
          },
          {
            foreignKeyName: "meal_completions_planned_meal_id_fkey"
            columns: ["planned_meal_id"]
            isOneToOne: true
            referencedRelation: "planned_meals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_completions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_feasibility"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "meal_completions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "meal_completions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "meal_completions_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_consumptions: {
        Row: {
          after_state: Json | null
          amount: number | null
          before_state: Json | null
          consumption_method: string
          created_at: string
          household_id: string
          id: string
          inventory_id: string | null
          item_id: string
          meal_completion_id: string
          recipe_ingredient_id: string
          unit: string | null
        }
        Insert: {
          after_state?: Json | null
          amount?: number | null
          before_state?: Json | null
          consumption_method: string
          created_at?: string
          household_id: string
          id?: string
          inventory_id?: string | null
          item_id: string
          meal_completion_id: string
          recipe_ingredient_id: string
          unit?: string | null
        }
        Update: {
          after_state?: Json | null
          amount?: number | null
          before_state?: Json | null
          consumption_method?: string
          created_at?: string
          household_id?: string
          id?: string
          inventory_id?: string | null
          item_id?: string
          meal_completion_id?: string
          recipe_ingredient_id?: string
          unit?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meal_consumptions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_consumptions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "meal_consumptions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "meal_consumptions_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "meal_consumptions_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "food_inventory_controls"
            referencedColumns: ["inventory_id"]
          },
          {
            foreignKeyName: "meal_consumptions_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "food_owned_item_attention"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "meal_consumptions_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["from_inventory_id"]
          },
          {
            foreignKeyName: "meal_consumptions_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "food_use_soon_attention"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "meal_consumptions_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "inventory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_consumptions_inventory_id_fkey"
            columns: ["inventory_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["inventory_id"]
          },
          {
            foreignKeyName: "meal_consumptions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "costco_item_predictions"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "meal_consumptions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_inventory_controls"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "meal_consumptions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_planned_meal_shopping_candidates"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "meal_consumptions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "meal_consumptions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "meal_consumptions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_consumptions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "meal_consumptions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "meal_consumptions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "meal_consumptions_meal_completion_id_fkey"
            columns: ["meal_completion_id"]
            isOneToOne: false
            referencedRelation: "meal_completions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_consumptions_recipe_ingredient_id_fkey"
            columns: ["recipe_ingredient_id"]
            isOneToOne: false
            referencedRelation: "food_planned_meal_shopping_candidates"
            referencedColumns: ["recipe_ingredient_id"]
          },
          {
            foreignKeyName: "meal_consumptions_recipe_ingredient_id_fkey"
            columns: ["recipe_ingredient_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["recipe_ingredient_id"]
          },
          {
            foreignKeyName: "meal_consumptions_recipe_ingredient_id_fkey"
            columns: ["recipe_ingredient_id"]
            isOneToOne: false
            referencedRelation: "recipe_ingredients"
            referencedColumns: ["id"]
          },
        ]
      }
      people: {
        Row: {
          active: boolean
          created_at: string
          display_name: string
          household_id: string
          id: string
          notes: string | null
          role: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          display_name: string
          household_id: string
          id?: string
          notes?: string | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          display_name?: string
          household_id?: string
          id?: string
          notes?: string | null
          role?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "people_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "people_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "people_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      pet_attention_scan_commands: {
        Row: {
          actor_ref: string
          created_at: string
          events_created: number | null
          household_id: string
          id: string
          processed_at: string | null
        }
        Insert: {
          actor_ref?: string
          created_at?: string
          events_created?: number | null
          household_id: string
          id?: string
          processed_at?: string | null
        }
        Update: {
          actor_ref?: string
          created_at?: string
          events_created?: number | null
          household_id?: string
          id?: string
          processed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_attention_scan_commands_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_attention_scan_commands_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "pet_attention_scan_commands_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "pet_attention_scan_commands_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      pet_medication_administrations: {
        Row: {
          actor_ref: string | null
          actor_type: string
          created_at: string
          dose_quantity: number
          dose_unit: string
          given_at: string
          household_id: string
          id: string
          notes: string | null
          pet_id: string
          pet_medication_id: string
          scheduled_for: string
        }
        Insert: {
          actor_ref?: string | null
          actor_type?: string
          created_at?: string
          dose_quantity: number
          dose_unit: string
          given_at?: string
          household_id: string
          id?: string
          notes?: string | null
          pet_id: string
          pet_medication_id: string
          scheduled_for: string
        }
        Update: {
          actor_ref?: string | null
          actor_type?: string
          created_at?: string
          dose_quantity?: number
          dose_unit?: string
          given_at?: string
          household_id?: string
          id?: string
          notes?: string | null
          pet_id?: string
          pet_medication_id?: string
          scheduled_for?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_medication_administrations_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_medication_administrations_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "pet_medication_administrations_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "pet_medication_administrations_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "pet_medication_administrations_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_medication_administrations_pet_medication_id_fkey"
            columns: ["pet_medication_id"]
            isOneToOne: false
            referencedRelation: "pet_medications"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_medication_commands: {
        Row: {
          actor_ref: string
          command_type: string
          created_at: string
          household_id: string
          id: string
          pet_medication_id: string
          processed_at: string | null
          result: Json | null
          scheduled_for: string
        }
        Insert: {
          actor_ref?: string
          command_type?: string
          created_at?: string
          household_id: string
          id?: string
          pet_medication_id: string
          processed_at?: string | null
          result?: Json | null
          scheduled_for: string
        }
        Update: {
          actor_ref?: string
          command_type?: string
          created_at?: string
          household_id?: string
          id?: string
          pet_medication_id?: string
          processed_at?: string | null
          result?: Json | null
          scheduled_for?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_medication_commands_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_medication_commands_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "pet_medication_commands_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "pet_medication_commands_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "pet_medication_commands_pet_medication_id_fkey"
            columns: ["pet_medication_id"]
            isOneToOne: false
            referencedRelation: "pet_medications"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_medication_supplies: {
        Row: {
          active: boolean
          created_at: string
          household_id: string
          id: string
          item_id: string
          notes: string | null
          package_size: number | null
          packages_per_order: number | null
          reorder_lead_days: number
          reorder_quantity: number | null
          updated_at: string
          vendor_name: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          household_id: string
          id?: string
          item_id: string
          notes?: string | null
          package_size?: number | null
          packages_per_order?: number | null
          reorder_lead_days?: number
          reorder_quantity?: number | null
          updated_at?: string
          vendor_name?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          household_id?: string
          id?: string
          item_id?: string
          notes?: string | null
          package_size?: number | null
          packages_per_order?: number | null
          reorder_lead_days?: number
          reorder_quantity?: number | null
          updated_at?: string
          vendor_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pet_medication_supplies_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_medication_supplies_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "pet_medication_supplies_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "pet_medication_supplies_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "pet_medication_supplies_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "costco_item_predictions"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "pet_medication_supplies_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_inventory_controls"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "pet_medication_supplies_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_planned_meal_shopping_candidates"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "pet_medication_supplies_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "pet_medication_supplies_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "pet_medication_supplies_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_medication_supplies_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "pet_medication_supplies_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "pet_medication_supplies_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["entity_id"]
          },
        ]
      }
      pet_medications: {
        Row: {
          active: boolean
          administration_time: string | null
          created_at: string
          dose_quantity: number | null
          dose_text: string | null
          dose_unit: string | null
          household_id: string
          id: string
          interval_days: number | null
          item_id: string | null
          last_given_at: string | null
          medication_name: string
          monthly_day: number | null
          next_due_at: string | null
          notes: string | null
          pet_id: string
          quantity_remaining: number | null
          reorder_threshold: number | null
          schedule_type: string
          source: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          administration_time?: string | null
          created_at?: string
          dose_quantity?: number | null
          dose_text?: string | null
          dose_unit?: string | null
          household_id: string
          id?: string
          interval_days?: number | null
          item_id?: string | null
          last_given_at?: string | null
          medication_name: string
          monthly_day?: number | null
          next_due_at?: string | null
          notes?: string | null
          pet_id: string
          quantity_remaining?: number | null
          reorder_threshold?: number | null
          schedule_type: string
          source?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          administration_time?: string | null
          created_at?: string
          dose_quantity?: number | null
          dose_text?: string | null
          dose_unit?: string | null
          household_id?: string
          id?: string
          interval_days?: number | null
          item_id?: string | null
          last_given_at?: string | null
          medication_name?: string
          monthly_day?: number | null
          next_due_at?: string | null
          notes?: string | null
          pet_id?: string
          quantity_remaining?: number | null
          reorder_threshold?: number | null
          schedule_type?: string
          source?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pet_medications_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_medications_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "pet_medications_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "pet_medications_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "pet_medications_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "costco_item_predictions"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "pet_medications_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_inventory_controls"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "pet_medications_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_planned_meal_shopping_candidates"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "pet_medications_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "pet_medications_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "pet_medications_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pet_medications_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "pet_medications_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "pet_medications_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "pet_medications_pet_id_fkey"
            columns: ["pet_id"]
            isOneToOne: false
            referencedRelation: "pets"
            referencedColumns: ["id"]
          },
        ]
      }
      pets: {
        Row: {
          active: boolean
          created_at: string
          household_id: string
          id: string
          name: string
          notes: string | null
          species: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          household_id: string
          id?: string
          name: string
          notes?: string | null
          species?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          household_id?: string
          id?: string
          name?: string
          notes?: string | null
          species?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pets_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pets_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "pets_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "pets_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      planned_meals: {
        Row: {
          cancelled_at: string | null
          completed_at: string | null
          created_at: string
          household_id: string
          id: string
          meal_slot: string
          notes: string | null
          plan_type: string
          planned_for: string
          recipe_id: string | null
          source: string
          status: string
          updated_at: string
        }
        Insert: {
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          household_id: string
          id?: string
          meal_slot?: string
          notes?: string | null
          plan_type?: string
          planned_for: string
          recipe_id?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Update: {
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string
          household_id?: string
          id?: string
          meal_slot?: string
          notes?: string | null
          plan_type?: string
          planned_for?: string
          recipe_id?: string | null
          source?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_feasibility"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          completed_at: string | null
          created_at: string
          external_thread_ref: string | null
          follow_up_at: string | null
          household_id: string
          id: string
          last_action: string | null
          last_action_at: string | null
          name: string
          next_action: string | null
          notes: string | null
          owner_person_id: string | null
          status: string
          updated_at: string
          waiting_on: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          external_thread_ref?: string | null
          follow_up_at?: string | null
          household_id: string
          id?: string
          last_action?: string | null
          last_action_at?: string | null
          name: string
          next_action?: string | null
          notes?: string | null
          owner_person_id?: string | null
          status?: string
          updated_at?: string
          waiting_on?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          external_thread_ref?: string | null
          follow_up_at?: string | null
          household_id?: string
          id?: string
          last_action?: string | null
          last_action_at?: string | null
          name?: string
          next_action?: string | null
          notes?: string | null
          owner_person_id?: string | null
          status?: string
          updated_at?: string
          waiting_on?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "projects_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "projects_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "projects_owner_person_id_fkey"
            columns: ["owner_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_items: {
        Row: {
          confidence: number | null
          created_at: string
          id: string
          item_id: string | null
          line_total: number | null
          mapped_by: string | null
          purchase_id: string
          quantity: number | null
          raw_label: string
          unit_price: number | null
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          id?: string
          item_id?: string | null
          line_total?: number | null
          mapped_by?: string | null
          purchase_id: string
          quantity?: number | null
          raw_label: string
          unit_price?: number | null
        }
        Update: {
          confidence?: number | null
          created_at?: string
          id?: string
          item_id?: string | null
          line_total?: number | null
          mapped_by?: string | null
          purchase_id?: string
          quantity?: number | null
          raw_label?: string
          unit_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "costco_item_predictions"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "purchase_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_inventory_controls"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "purchase_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_planned_meal_shopping_candidates"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "purchase_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "purchase_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "purchase_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "purchase_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "purchase_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "purchase_items_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      purchases: {
        Row: {
          confidence: number | null
          created_at: string
          household_id: string
          id: string
          purchased_at: string
          raw_text: string | null
          receipt_external_id: string | null
          receipt_source: string | null
          store_id: string | null
          total: number | null
          updated_at: string
        }
        Insert: {
          confidence?: number | null
          created_at?: string
          household_id: string
          id?: string
          purchased_at: string
          raw_text?: string | null
          receipt_external_id?: string | null
          receipt_source?: string | null
          store_id?: string | null
          total?: number | null
          updated_at?: string
        }
        Update: {
          confidence?: number | null
          created_at?: string
          household_id?: string
          id?: string
          purchased_at?: string
          raw_text?: string | null
          receipt_external_id?: string | null
          receipt_source?: string | null
          store_id?: string | null
          total?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "purchases_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "purchases_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "purchases_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_ingredients: {
        Row: {
          created_at: string
          id: string
          item_id: string
          preparation: string | null
          quantity: number | null
          recipe_id: string
          required: boolean
          sort_order: number
          substitution_group: string | null
          thaw_lead_hours: number | null
          thaw_required: boolean
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          preparation?: string | null
          quantity?: number | null
          recipe_id: string
          required?: boolean
          sort_order?: number
          substitution_group?: string | null
          thaw_lead_hours?: number | null
          thaw_required?: boolean
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          preparation?: string | null
          quantity?: number | null
          recipe_id?: string
          required?: boolean
          sort_order?: number
          substitution_group?: string | null
          thaw_lead_hours?: number | null
          thaw_required?: boolean
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_ingredients_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "costco_item_predictions"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "recipe_ingredients_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_inventory_controls"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "recipe_ingredients_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_planned_meal_shopping_candidates"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "recipe_ingredients_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "recipe_ingredients_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "recipe_ingredients_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_ingredients_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "recipe_ingredients_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "recipe_ingredients_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_feasibility"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "recipe_ingredients_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          active: boolean
          cook_minutes: number | null
          created_at: string
          household_id: string
          id: string
          instructions: string | null
          name: string
          notes: string | null
          prep_minutes: number | null
          servings: number | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          cook_minutes?: number | null
          created_at?: string
          household_id: string
          id?: string
          instructions?: string | null
          name: string
          notes?: string | null
          prep_minutes?: number | null
          servings?: number | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          cook_minutes?: number | null
          created_at?: string
          household_id?: string
          id?: string
          instructions?: string | null
          name?: string
          notes?: string | null
          prep_minutes?: number | null
          servings?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipes_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "recipes_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "recipes_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      shopping_items: {
        Row: {
          created_at: string
          custom_name: string | null
          household_id: string
          id: string
          item_id: string | null
          needed_by: string | null
          priority: string
          purchase_id: string | null
          purchased_at: string | null
          quantity: number | null
          reason: string | null
          source: string | null
          status: string
          store_id: string | null
          unit: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          custom_name?: string | null
          household_id: string
          id?: string
          item_id?: string | null
          needed_by?: string | null
          priority?: string
          purchase_id?: string | null
          purchased_at?: string | null
          quantity?: number | null
          reason?: string | null
          source?: string | null
          status?: string
          store_id?: string | null
          unit?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          custom_name?: string | null
          household_id?: string
          id?: string
          item_id?: string | null
          needed_by?: string | null
          priority?: string
          purchase_id?: string | null
          purchased_at?: string | null
          quantity?: number | null
          reason?: string | null
          source?: string | null
          status?: string
          store_id?: string | null
          unit?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "costco_item_predictions"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_inventory_controls"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_planned_meal_shopping_candidates"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "shopping_items_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          active: boolean
          created_at: string
          household_id: string
          id: string
          name: string
          store_type: string | null
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          household_id: string
          id?: string
          name: string
          store_type?: string | null
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          household_id?: string
          id?: string
          name?: string
          store_type?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stores_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "stores_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "stores_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "stores_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
    }
    Views: {
      active_household_shopping_list: {
        Row: {
          created_at: string | null
          custom_name: string | null
          household_id: string | null
          id: string | null
          item_id: string | null
          item_name: string | null
          needed_by: string | null
          priority: string | null
          purchase_id: string | null
          purchased_at: string | null
          quantity: number | null
          reason: string | null
          source: string | null
          status: string | null
          store_id: string | null
          store_name: string | null
          unit: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "costco_item_predictions"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_inventory_controls"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_planned_meal_shopping_candidates"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "shopping_items_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_attention_items: {
        Row: {
          action_url: string | null
          attention_type: string | null
          due_at: string | null
          entity_id: string | null
          entity_type: string | null
          household_id: string | null
          human_action: string | null
          metadata: Json | null
          severity: string | null
          severity_rank: number | null
          sort_rank: number | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "calendar_events_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "calendar_events_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      calendar_today_next_items: {
        Row: {
          all_day: boolean | null
          calendar_event_id: string | null
          calendar_source_id: string | null
          end_date: string | null
          ends_at: string | null
          event_url: string | null
          external_event_id: string | null
          household_id: string | null
          household_timezone: string | null
          is_recurring: boolean | null
          local_start_date: string | null
          local_start_time: string | null
          location: string | null
          metadata: Json | null
          occurrence_key: string | null
          recurrence_id: string | null
          source_href: string | null
          start_date: string | null
          starts_at: string | null
          status: string | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_calendar_source_id_fkey"
            columns: ["calendar_source_id"]
            isOneToOne: false
            referencedRelation: "calendar_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "calendar_events_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "calendar_events_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      costco_item_predictions: {
        Row: {
          household_id: string | null
          inventory_confidence: number | null
          inventory_status: string | null
          item_id: string | null
          last_purchased_at: string | null
          name: string | null
          next_expected_trip_at: string | null
          prediction_bucket: string | null
          prediction_reason: string | null
          restock_policy: string | null
          typical_lifespan_days: number | null
        }
        Relationships: [
          {
            foreignKeyName: "items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      food_attention_items: {
        Row: {
          action_url: string | null
          attention_type: string | null
          due_at: string | null
          entity_id: string | null
          entity_type: string | null
          household_id: string | null
          human_action: string | null
          metadata: Json | null
          severity: string | null
          severity_rank: number | null
          sort_rank: number | null
          title: string | null
        }
        Relationships: []
      }
      food_inventory_controls: {
        Row: {
          available_controls: Json | null
          category: string | null
          confidence: number | null
          default_unit: string | null
          evidence_type: string | null
          household_id: string | null
          inventory_id: string | null
          item_id: string | null
          item_name: string | null
          last_confirmed_at: string | null
          last_purchased_at: string | null
          location_id: string | null
          location_name: string | null
          location_type: string | null
          meal_planning_relevant: boolean | null
          meals_remaining: number | null
          opened_at: string | null
          quantity: number | null
          quantity_unit: string | null
          source: string | null
          status: string | null
          surface_when_owned: boolean | null
          tracking_mode: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "inventory_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "inventory_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "inventory_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["to_location_id"]
          },
          {
            foreignKeyName: "inventory_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      food_owned_item_attention: {
        Row: {
          action_url: string | null
          attention_type: string | null
          due_at: string | null
          entity_id: string | null
          entity_type: string | null
          household_id: string | null
          human_action: string | null
          metadata: Json | null
          severity: string | null
          severity_rank: number | null
          sort_rank: number | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "inventory_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "inventory_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      food_planned_meal_shopping_candidates: {
        Row: {
          household_id: string | null
          item_id: string | null
          item_name: string | null
          meal_slot: string | null
          message: string | null
          planned_for: string | null
          planned_meal_id: string | null
          recipe_id: string | null
          recipe_ingredient_id: string | null
          recipe_name: string | null
          required_quantity: number | null
          required_unit: string | null
          suggested_store_id: string | null
          suggested_store_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_feasibility"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      food_planned_meal_state: {
        Row: {
          created_at: string | null
          feasibility: string | null
          household_id: string | null
          household_timezone: string | null
          meal_slot: string | null
          missing_count: number | null
          missing_items: Json | null
          notes: string | null
          plan_type: string | null
          planned_for: string | null
          planned_meal_id: string | null
          recipe_id: string | null
          recipe_name: string | null
          source: string | null
          status: string | null
          thaw_count: number | null
          thaw_items: Json | null
          unknown_count: number | null
          unknown_items: Json | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_feasibility"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      food_recipe_feasibility: {
        Row: {
          feasibility: string | null
          household_id: string | null
          missing_count: number | null
          missing_items: Json | null
          recipe_id: string | null
          recipe_name: string | null
          thaw_count: number | null
          thaw_items: Json | null
          unknown_count: number | null
          unknown_items: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "recipes_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "recipes_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      food_recipe_ingredient_state: {
        Row: {
          has_freezer_stock: boolean | null
          has_non_freezer_stock: boolean | null
          has_present_stock: boolean | null
          household_id: string | null
          ingredient_state: string | null
          inventory_row_count: number | null
          item_id: string | null
          item_name: string | null
          non_freezer_meals: number | null
          preparation: string | null
          recipe_id: string | null
          recipe_ingredient_id: string | null
          recipe_name: string | null
          required: boolean | null
          required_quantity: number | null
          required_unit: string | null
          thaw_lead_hours: number | null
          thaw_required: boolean | null
          total_meals: number | null
          tracking_mode: string | null
        }
        Relationships: [
          {
            foreignKeyName: "recipes_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipes_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "recipes_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "recipes_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      food_shopping_attention_items: {
        Row: {
          action_url: string | null
          attention_type: string | null
          due_at: string | null
          entity_id: string | null
          entity_type: string | null
          household_id: string | null
          human_action: string | null
          metadata: Json | null
          severity: string | null
          severity_rank: number | null
          sort_rank: number | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      food_thaw_attention: {
        Row: {
          dedupe_key: string | null
          due_at: string | null
          from_inventory_id: string | null
          from_location_id: string | null
          household_id: string | null
          household_timezone: string | null
          item_id: string | null
          item_name: string | null
          meal_at: string | null
          meal_slot: string | null
          message: string | null
          plan_type: string | null
          planned_for: string | null
          planned_meal_id: string | null
          recipe_id: string | null
          recipe_name: string | null
          required_quantity: number | null
          required_unit: string | null
          severity: string | null
          thaw_lead_hours: number | null
          to_location_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_location_id_fkey"
            columns: ["from_location_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["to_location_id"]
          },
          {
            foreignKeyName: "inventory_location_id_fkey"
            columns: ["from_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      food_use_soon_attention: {
        Row: {
          action_url: string | null
          attention_type: string | null
          due_at: string | null
          entity_id: string | null
          entity_type: string | null
          household_id: string | null
          human_action: string | null
          metadata: Json | null
          severity: string | null
          severity_rank: number | null
          sort_rank: number | null
          title: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "inventory_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "inventory_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      household_attention_items: {
        Row: {
          action_url: string | null
          attention_type: string | null
          domain: string | null
          due_at: string | null
          entity_id: string | null
          entity_type: string | null
          household_id: string | null
          human_action: string | null
          metadata: Json | null
          severity: string | null
          severity_rank: number | null
          sort_rank: number | null
          title: string | null
        }
        Relationships: []
      }
      household_home_meals: {
        Row: {
          created_at: string | null
          feasibility: string | null
          household_id: string | null
          household_timezone: string | null
          meal_slot: string | null
          missing_count: number | null
          missing_items: Json | null
          notes: string | null
          plan_type: string | null
          planned_for: string | null
          planned_meal_id: string | null
          recipe_id: string | null
          recipe_name: string | null
          source: string | null
          status: string | null
          thaw_count: number | null
          thaw_items: Json | null
          unknown_count: number | null
          unknown_items: Json | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "planned_meals_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_feasibility"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["recipe_id"]
          },
          {
            foreignKeyName: "planned_meals_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      household_shopping_list: {
        Row: {
          created_at: string | null
          custom_name: string | null
          household_id: string | null
          id: string | null
          item_id: string | null
          item_name: string | null
          needed_by: string | null
          priority: string | null
          purchase_id: string | null
          purchased_at: string | null
          quantity: number | null
          reason: string | null
          source: string | null
          status: string | null
          store_id: string | null
          store_name: string | null
          unit: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "costco_item_predictions"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_inventory_controls"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_planned_meal_shopping_candidates"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "shopping_items_purchase_id_fkey"
            columns: ["purchase_id"]
            isOneToOne: false
            referencedRelation: "purchases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      household_shopping_summary: {
        Row: {
          dog_food_included: boolean | null
          household_id: string | null
          item_count: number | null
          next_needed_by: string | null
          store_name: string | null
          urgent_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
      household_today_timeline: {
        Row: {
          all_day: boolean | null
          ends_at: string | null
          entity_id: string | null
          household_id: string | null
          item_type: string | null
          location: string | null
          metadata: Json | null
          sort_rank: number | null
          starts_at: string | null
          title: string | null
        }
        Relationships: []
      }
      open_shopping_items: {
        Row: {
          created_at: string | null
          custom_name: string | null
          household_id: string | null
          id: string | null
          item_id: string | null
          needed_by: string | null
          priority: string | null
          quantity: number | null
          reason: string | null
          source: string | null
          status: string | null
          store_id: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_name?: string | null
          household_id?: string | null
          id?: string | null
          item_id?: string | null
          needed_by?: string | null
          priority?: string | null
          quantity?: number | null
          reason?: string | null
          source?: string | null
          status?: string | null
          store_id?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_name?: string | null
          household_id?: string | null
          id?: string | null
          item_id?: string | null
          needed_by?: string | null
          priority?: string | null
          quantity?: number | null
          reason?: string | null
          source?: string | null
          status?: string | null
          store_id?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "shopping_items_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "costco_item_predictions"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_inventory_controls"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_planned_meal_shopping_candidates"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_recipe_ingredient_state"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "food_thaw_attention"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "shopping_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["entity_id"]
          },
          {
            foreignKeyName: "shopping_items_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      pet_food_depletion_projection: {
        Row: {
          already_on_shopping_list: boolean | null
          depletion_status: string | null
          estimated_days_remaining: number | null
          household_id: string | null
          inventory_id: string | null
          inventory_status: string | null
          item_id: string | null
          item_name: string | null
          last_confirmed_at: string | null
          predicted_depletion_date: string | null
          quantity: number | null
          quantity_unit: string | null
          typical_lifespan_days: number | null
        }
        Relationships: []
      }
      pet_medication_reorder_projection: {
        Row: {
          first_uncovered_administration_date: string | null
          household_id: string | null
          item_id: string | null
          medication_name: string | null
          order_by_date: string | null
          package_size: number | null
          packages_per_order: number | null
          quantity_available: number | null
          quantity_is_known: boolean | null
          quantity_unit: string | null
          reorder_lead_days: number | null
          reorder_quantity: number | null
          reorder_status: string | null
          vendor_name: string | null
        }
        Relationships: []
      }
      pets_attention_items: {
        Row: {
          action_url: string | null
          attention_type: string | null
          due_at: string | null
          entity_id: string | null
          entity_type: string | null
          household_id: string | null
          human_action: string | null
          medication_name: string | null
          metadata: Json | null
          order_by_date: string | null
          pet_id: string | null
          pet_name: string | null
          quantity_remaining: number | null
          quantity_unit: string | null
          severity: string | null
          severity_rank: number | null
        }
        Relationships: []
      }
      pets_food_attention_items: {
        Row: {
          action_url: string | null
          attention_type: string | null
          due_at: string | null
          entity_id: string | null
          entity_type: string | null
          household_id: string | null
          human_action: string | null
          medication_name: string | null
          metadata: Json | null
          order_by_date: string | null
          pet_id: string | null
          pet_name: string | null
          quantity_remaining: number | null
          quantity_unit: string | null
          severity: string | null
          severity_rank: number | null
        }
        Relationships: []
      }
      pets_household_attention_items: {
        Row: {
          action_url: string | null
          attention_type: string | null
          due_at: string | null
          entity_id: string | null
          entity_type: string | null
          household_id: string | null
          human_action: string | null
          metadata: Json | null
          severity: string | null
          severity_rank: number | null
          sort_rank: number | null
          title: string | null
        }
        Relationships: []
      }
      pets_medication_attention_items: {
        Row: {
          action_url: string | null
          attention_type: string | null
          due_at: string | null
          entity_id: string | null
          entity_type: string | null
          household_id: string | null
          human_action: string | null
          medication_name: string | null
          metadata: Json | null
          order_by_date: string | null
          pet_id: string | null
          pet_name: string | null
          quantity_remaining: number | null
          quantity_unit: string | null
          severity: string | null
          severity_rank: number | null
        }
        Relationships: []
      }
      project_attention_queue: {
        Row: {
          attention_rank: number | null
          attention_state: string | null
          days_overdue: number | null
          display_color: string | null
          follow_up_at: string | null
          household_id: string | null
          id: string | null
          last_action: string | null
          last_action_at: string | null
          name: string | null
          next_action: string | null
          notes: string | null
          owner_person_id: string | null
          status: string | null
          waiting_on: string | null
        }
        Insert: {
          attention_rank?: never
          attention_state?: never
          days_overdue?: never
          display_color?: never
          follow_up_at?: string | null
          household_id?: string | null
          id?: string | null
          last_action?: string | null
          last_action_at?: string | null
          name?: string | null
          next_action?: string | null
          notes?: string | null
          owner_person_id?: string | null
          status?: string | null
          waiting_on?: string | null
        }
        Update: {
          attention_rank?: never
          attention_state?: never
          days_overdue?: never
          display_color?: never
          follow_up_at?: string | null
          household_id?: string | null
          id?: string | null
          last_action?: string | null
          last_action_at?: string | null
          name?: string | null
          next_action?: string | null
          notes?: string | null
          owner_person_id?: string | null
          status?: string | null
          waiting_on?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "projects_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "projects_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "projects_owner_person_id_fkey"
            columns: ["owner_person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
        ]
      }
      projects_household_attention_items: {
        Row: {
          action_url: string | null
          attention_type: string | null
          due_at: string | null
          entity_id: string | null
          entity_type: string | null
          household_id: string | null
          human_action: string | null
          metadata: Json | null
          severity: string | null
          severity_rank: number | null
          sort_rank: number | null
          title: string | null
        }
        Insert: {
          action_url?: never
          attention_type?: never
          due_at?: string | null
          entity_id?: string | null
          entity_type?: never
          household_id?: string | null
          human_action?: never
          metadata?: never
          severity?: never
          severity_rank?: never
          sort_rank?: never
          title?: string | null
        }
        Update: {
          action_url?: never
          attention_type?: never
          due_at?: string | null
          entity_id?: string | null
          entity_type?: never
          household_id?: string | null
          human_action?: never
          metadata?: never
          severity?: never
          severity_rank?: never
          sort_rank?: never
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "households"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_food_depletion_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "projects_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pet_medication_reorder_projection"
            referencedColumns: ["household_id"]
          },
          {
            foreignKeyName: "projects_household_id_fkey"
            columns: ["household_id"]
            isOneToOne: false
            referencedRelation: "pets_food_attention_items"
            referencedColumns: ["household_id"]
          },
        ]
      }
    }
    Functions: {
      add_household_shopping_item: {
        Args: {
          p_household_id: string
          p_name: string
          p_priority?: string
          p_quantity?: number
          p_store_id?: string | null
          p_unit?: string
        }
        Returns: {
          created_at: string
          custom_name: string | null
          household_id: string
          id: string
          item_id: string | null
          needed_by: string | null
          priority: string
          purchase_id: string | null
          purchased_at: string | null
          quantity: number | null
          reason: string | null
          source: string | null
          status: string
          store_id: string | null
          unit: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "shopping_items"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      add_planned_meal_item_to_shopping: {
        Args: {
          p_actor_ref?: string
          p_item_id: string
          p_planned_meal_id: string
          p_store_id?: string
        }
        Returns: Json
      }
      cancel_food_meal: {
        Args: { p_actor_ref?: string; p_planned_meal_id: string }
        Returns: Json
      }
      complete_food_meal: {
        Args: {
          p_actor_ref?: string
          p_planned_meal_id: string
          p_portions_made?: number
        }
        Returns: Json
      }
      complete_food_thaw: {
        Args: {
          p_actor_ref?: string
          p_item_id: string
          p_planned_meal_id: string
        }
        Returns: Json
      }
      complete_shopping_item: {
        Args: { p_shopping_item_id: string }
        Returns: {
          created_at: string
          custom_name: string | null
          household_id: string
          id: string
          item_id: string | null
          needed_by: string | null
          priority: string
          purchase_id: string | null
          purchased_at: string | null
          quantity: number | null
          reason: string | null
          source: string | null
          status: string
          store_id: string | null
          unit: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "shopping_items"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      correct_food_inventory: {
        Args: {
          p_actor_ref?: string
          p_inventory_id: string
          p_mark_opened?: boolean
          p_meals_remaining?: number
          p_quantity?: number
          p_quantity_unit?: string
          p_status?: string
        }
        Returns: Json
      }
      get_after_care_context: {
        Args: {
          p_days?: number
          p_household_slug?: string
          p_start_date?: string
        }
        Returns: Json
      }
      get_household_attention: {
        Args: { p_household_slug?: string }
        Returns: Json
      }
      get_lovable_food_inventory: {
        Args: { p_household_slug?: string }
        Returns: {
          confidence: number
          inventory_id: string
          item_id: string
          item_name: string
          last_confirmed_at: string
          location_id: string
          location_name: string
          location_type: string
          meals_remaining: number
          opened_at: string
          quantity: number
          quantity_unit: string
          status: string
          tracking_mode: string
        }[]
      }
      get_lovable_food_recipes: {
        Args: { p_household_slug?: string }
        Returns: {
          cook_minutes: number
          name: string
          prep_minutes: number
          recipe_id: string
          servings: number
        }[]
      }
      get_lovable_home_meals: {
        Args: { p_household_slug?: string }
        Returns: {
          created_at: string | null
          feasibility: string | null
          household_id: string | null
          household_timezone: string | null
          meal_slot: string | null
          missing_count: number | null
          missing_items: Json | null
          notes: string | null
          plan_type: string | null
          planned_for: string | null
          planned_meal_id: string | null
          recipe_id: string | null
          recipe_name: string | null
          source: string | null
          status: string | null
          thaw_count: number | null
          thaw_items: Json | null
          unknown_count: number | null
          unknown_items: Json | null
          updated_at: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "household_home_meals"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_lovable_household_attention: {
        Args: { p_household_slug?: string }
        Returns: {
          action_url: string | null
          attention_type: string | null
          domain: string | null
          due_at: string | null
          entity_id: string | null
          entity_type: string | null
          household_id: string | null
          human_action: string | null
          metadata: Json | null
          severity: string | null
          severity_rank: number | null
          sort_rank: number | null
          title: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "household_attention_items"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_lovable_pets_attention: {
        Args: { p_household_slug?: string }
        Returns: {
          attention_type: string
          can_mark_given: boolean
          due_at: string
          entity_id: string
          entity_type: string
          human_action: string
          medication_name: string
          metadata: Json
          order_by_date: string
          pet_id: string
          pet_name: string
          quantity_remaining: number
          quantity_unit: string
          scheduled_for: string
          severity: string
        }[]
      }
      get_lovable_planned_meal: {
        Args: { p_household_slug: string; p_planned_meal_id: string }
        Returns: {
          created_at: string
          feasibility: string
          household_timezone: string
          meal_slot: string
          missing_count: number
          missing_items: Json
          notes: string
          plan_type: string
          planned_for: string
          planned_meal_id: string
          recipe_id: string
          recipe_name: string
          source: string
          status: string
          thaw_count: number
          thaw_items: Json
          unknown_count: number
          unknown_items: Json
          updated_at: string
        }[]
      }
      get_lovable_projects: {
        Args: { p_household_slug?: string; p_include_complete?: boolean }
        Returns: {
          completed_at: string
          created_at: string
          follow_up_at: string
          id: string
          last_action: string
          last_action_at: string
          name: string
          next_action: string
          notes: string
          status: string
          updated_at: string
          waiting_on: string
        }[]
      }
      get_lovable_shopping_items: {
        Args: { p_household_slug?: string; p_include_completed?: boolean }
        Returns: {
          created_at: string
          custom_name: string
          household_id: string
          id: string
          item_id: string
          item_name: string
          needed_by: string
          priority: string
          purchased_at: string
          quantity: number
          reason: string
          source: string
          status: string
          store_id: string
          store_name: string
          unit: string
          updated_at: string
        }[]
      }
      get_lovable_shopping_summary: {
        Args: { p_household_slug?: string }
        Returns: {
          dog_food_included: boolean | null
          household_id: string | null
          item_count: number | null
          next_needed_by: string | null
          store_name: string | null
          urgent_count: number | null
        }[]
        SetofOptions: {
          from: "*"
          to: "household_shopping_summary"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_lovable_stores: {
        Args: { p_household_slug?: string }
        Returns: {
          id: string
          name: string
          store_type: string
        }[]
      }
      get_lovable_today_timeline: {
        Args: { p_household_slug?: string }
        Returns: {
          all_day: boolean | null
          ends_at: string | null
          entity_id: string | null
          household_id: string | null
          item_type: string | null
          location: string | null
          metadata: Json | null
          sort_rank: number | null
          starts_at: string | null
          title: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "household_today_timeline"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_lovable_tomorrow_timeline: {
        Args: { p_household_slug?: string }
        Returns: {
          all_day: boolean
          ends_at: string
          entity_id: string
          household_id: string
          item_type: string
          location: string
          metadata: Json
          sort_rank: number
          starts_at: string
          title: string
        }[]
      }
      get_pets_attention: { Args: { p_household_slug?: string }; Returns: Json }
      lovable_add_planned_meal_item_to_shopping: {
        Args: { p_item_id: string; p_planned_meal_id: string }
        Returns: Json
      }
      lovable_add_shopping_item: {
        Args: {
          p_household_slug: string
          p_name: string
          p_priority?: string
          p_quantity?: number
          p_store_id?: string
          p_unit?: string
        }
        Returns: {
          created_at: string
          custom_name: string | null
          household_id: string
          id: string
          item_id: string | null
          needed_by: string | null
          priority: string
          purchase_id: string | null
          purchased_at: string | null
          quantity: number | null
          reason: string | null
          source: string | null
          status: string
          store_id: string | null
          unit: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "shopping_items"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      lovable_cancel_food_meal: {
        Args: { p_planned_meal_id: string }
        Returns: Json
      }
      lovable_complete_food_meal: {
        Args: { p_planned_meal_id: string; p_portions_made?: number }
        Returns: Json
      }
      lovable_complete_food_thaw: {
        Args: { p_item_id: string; p_planned_meal_id: string }
        Returns: Json
      }
      lovable_complete_project: {
        Args: {
          p_confirm: boolean
          p_household_slug: string
          p_project_id: string
        }
        Returns: {
          completed_at: string | null
          created_at: string
          external_thread_ref: string | null
          follow_up_at: string | null
          household_id: string
          id: string
          last_action: string | null
          last_action_at: string | null
          name: string
          next_action: string | null
          notes: string | null
          owner_person_id: string | null
          status: string
          updated_at: string
          waiting_on: string | null
        }
        SetofOptions: {
          from: "*"
          to: "projects"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      lovable_complete_shopping_item: {
        Args: { p_household_slug: string; p_shopping_item_id: string }
        Returns: {
          created_at: string
          custom_name: string | null
          household_id: string
          id: string
          item_id: string | null
          needed_by: string | null
          priority: string
          purchase_id: string | null
          purchased_at: string | null
          quantity: number | null
          reason: string | null
          source: string | null
          status: string
          store_id: string | null
          unit: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "shopping_items"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      lovable_correct_food_inventory: {
        Args: {
          p_inventory_id: string
          p_mark_opened?: boolean
          p_meals_remaining?: number
          p_quantity?: number
          p_quantity_unit?: string
          p_status?: string
        }
        Returns: Json
      }
      lovable_undo_food_inventory_correction: {
        Args: { p_correction_id: string }
        Returns: Json
      }
      lovable_create_project: {
        Args: {
          p_follow_up_at?: string
          p_household_slug: string
          p_name: string
          p_next_action?: string
          p_notes?: string
          p_status?: string
          p_waiting_on?: string
        }
        Returns: {
          completed_at: string | null
          created_at: string
          external_thread_ref: string | null
          follow_up_at: string | null
          household_id: string
          id: string
          last_action: string | null
          last_action_at: string | null
          name: string
          next_action: string | null
          notes: string | null
          owner_person_id: string | null
          status: string
          updated_at: string
          waiting_on: string | null
        }
        SetofOptions: {
          from: "*"
          to: "projects"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      lovable_mark_pet_medication_given: {
        Args: {
          p_confirm: boolean
          p_household_slug: string
          p_pet_medication_id: string
          p_scheduled_for: string
        }
        Returns: Json
      }
      lovable_plan_food_meal: {
        Args: {
          p_household_slug: string
          p_meal_slot?: string
          p_notes?: string
          p_plan_type?: string
          p_planned_for: string
          p_recipe_id?: string
        }
        Returns: Json
      }
      lovable_restore_shopping_item: {
        Args: { p_household_slug: string; p_shopping_item_id: string }
        Returns: {
          created_at: string
          custom_name: string | null
          household_id: string
          id: string
          item_id: string | null
          needed_by: string | null
          priority: string
          purchase_id: string | null
          purchased_at: string | null
          quantity: number | null
          reason: string | null
          source: string | null
          status: string
          store_id: string | null
          unit: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "shopping_items"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      lovable_skip_shopping_item: {
        Args: { p_household_slug: string; p_shopping_item_id: string }
        Returns: {
          created_at: string
          custom_name: string | null
          household_id: string
          id: string
          item_id: string | null
          needed_by: string | null
          priority: string
          purchase_id: string | null
          purchased_at: string | null
          quantity: number | null
          reason: string | null
          source: string | null
          status: string
          store_id: string | null
          unit: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "shopping_items"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      lovable_set_shopping_item_store: {
        Args: {
          p_household_slug: string
          p_shopping_item_id: string
          p_store_id?: string | null
        }
        Returns: {
          created_at: string
          custom_name: string | null
          household_id: string
          id: string
          item_id: string | null
          needed_by: string | null
          priority: string
          purchase_id: string | null
          purchased_at: string | null
          quantity: number | null
          reason: string | null
          source: string | null
          status: string
          store_id: string | null
          unit: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "shopping_items"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      lovable_update_project: {
        Args: {
          p_follow_up_at?: string
          p_household_slug: string
          p_last_action?: string
          p_name: string
          p_next_action?: string
          p_notes?: string
          p_project_id: string
          p_status: string
          p_waiting_on?: string
        }
        Returns: {
          completed_at: string | null
          created_at: string
          external_thread_ref: string | null
          follow_up_at: string | null
          household_id: string
          id: string
          last_action: string | null
          last_action_at: string | null
          name: string
          next_action: string | null
          notes: string | null
          owner_person_id: string | null
          status: string
          updated_at: string
          waiting_on: string | null
        }
        SetofOptions: {
          from: "*"
          to: "projects"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      mark_pet_medication_given: {
        Args: {
          p_actor_ref?: string
          p_pet_medication_id: string
          p_scheduled_for: string
        }
        Returns: Json
      }
      move_food_inventory: {
        Args: {
          p_actor_ref?: string
          p_dedupe_key?: string
          p_from_inventory_id: string
          p_meals_to_move?: number
          p_to_location_id: string
        }
        Returns: Json
      }
      plan_food_meal: {
        Args: {
          p_actor_ref?: string
          p_household_slug: string
          p_meal_slot?: string
          p_notes?: string
          p_plan_type?: string
          p_planned_for: string
          p_recipe_id?: string
        }
        Returns: Json
      }
      restore_shopping_item: {
        Args: { p_shopping_item_id: string }
        Returns: {
          created_at: string
          custom_name: string | null
          household_id: string
          id: string
          item_id: string | null
          needed_by: string | null
          priority: string
          purchase_id: string | null
          purchased_at: string | null
          quantity: number | null
          reason: string | null
          source: string | null
          status: string
          store_id: string | null
          unit: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "shopping_items"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      skip_shopping_item: {
        Args: { p_shopping_item_id: string }
        Returns: {
          created_at: string
          custom_name: string | null
          household_id: string
          id: string
          item_id: string | null
          needed_by: string | null
          priority: string
          purchase_id: string | null
          purchased_at: string | null
          quantity: number | null
          reason: string | null
          source: string | null
          status: string
          store_id: string | null
          unit: string | null
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "shopping_items"
          isOneToOne: true
          isSetofReturn: false
        }
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
