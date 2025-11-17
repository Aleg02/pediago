export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string;
          expires_at: string | null;
          features: Json | null;
          full_name: string | null;
          id: string;
          job_role: string | null;
          subscription_status: string | null;
          subscription_tier: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          expires_at?: string | null;
          features?: Json | null;
          full_name?: string | null;
          id: string;
          job_role?: string | null;
          subscription_status?: string | null;
          subscription_tier?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          expires_at?: string | null;
          features?: Json | null;
          full_name?: string | null;
          id?: string;
          job_role?: string | null;
          subscription_status?: string | null;
          subscription_tier?: string | null;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          cancel_at: string | null;
          created_at: string;
          current_period_end: string | null;
          id: string;
          metadata: Json | null;
          plan_code: string | null;
          profile_id: string;
          provider: string;
          provider_customer_id: string | null;
          status: string;
          updated_at: string;
        };
        Insert: {
          cancel_at?: string | null;
          created_at?: string;
          current_period_end?: string | null;
          id?: string;
          metadata?: Json | null;
          plan_code?: string | null;
          profile_id: string;
          provider: string;
          provider_customer_id?: string | null;
          status: string;
          updated_at?: string;
        };
        Update: {
          cancel_at?: string | null;
          created_at?: string;
          current_period_end?: string | null;
          id?: string;
          metadata?: Json | null;
          plan_code?: string | null;
          profile_id?: string;
          provider?: string;
          provider_customer_id?: string | null;
          status?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      user_entitlements: {
        Row: {
          can_view_premium: boolean | null;
          expires_at: string | null;
          subscription_status: string | null;
          subscription_tier: string | null;
          user_id: string | null;
        };
      };
    };
  };
};
