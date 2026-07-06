import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Types for our database
export type JobPost = {
  id: string;
  user_id: string; // TEXT type for Firebase UID compatibility
  job_title: string;
  company?: string;
  raw_description: string;
  extracted_skills: any;
  created_at: string;
};

export type Roadmap = {
  id: string;
  user_id: string;
  job_post_id: string;
  title: string;
  description?: string;
  difficulty_level: string;
  estimated_days: number;
  phases: any;
  is_public: boolean;
  created_at: string;
};

// Helper to get current Firebase user's Supabase data
export async function getOrCreateUser(
  firebaseUid: string,
  email?: string,
  displayName?: string
) {
  try {
    // Check if user settings exist
    const { data: existingSettings } = await supabase
      .from("user_settings")
      .select("*")
      .eq("user_id", firebaseUid)
      .single();

    if (existingSettings) {
      return existingSettings;
    }

    // Create new user settings
    const { data: newSettings, error } = await supabase
      .from("user_settings")
      .insert({
        user_id: firebaseUid,
        display_name: displayName || "",
        theme: "light",
        language: "en",
        email_notifications: true,
        weekly_digest: true,
        roadmap_updates: true,
        default_mode: "auto",
        auto_save: true,
        tier: "free",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating user settings:", error);
      throw error;
    }

    return newSettings;
  } catch (error) {
    console.error("Error in getOrCreateUser:", error);
    throw error;
  }
}
