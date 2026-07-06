import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database
export type JobPost = {
  id: string;
  user_id: string;
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
