import { supabase } from "../supabase";

const db = supabase;

// 🎯 Type matching your EXACT table structure
export type SavedRoadmap = {
  source: string;
  id: string;
  user_id: string;
  job_post_id?: string | null;
  title: string;
  description?: string | null;
  difficulty_level?: string | null;
  estimated_days?: number | null;
  phases?: any | null;
  is_public?: boolean | null;
  created_at?: string;
};

// Save roadmap (matches your table columns)
export async function saveRoadmap(data: {
  userId: string;
  title: string;
  jobDescription: string;
  skills: any;
  roadmap: any;
  source: "local" | "ai" | "cache";
}): Promise<{ id: string }> {
  try {
    console.log("💾 Saving roadmap to database...");

    // 🎯 Only insert columns that exist in your table
    const { data: saved, error } = await db
      .from("roadmaps")
      .insert({
        user_id: data.userId || "anonymous",
        title: data.title || "Untitled Roadmap",
        description: data.jobDescription || "", // job description as description
        difficulty_level: data.roadmap?.difficulty || "intermediate",
        estimated_days: data.roadmap?.estimatedDays || 30,
        phases: data.roadmap?.phases || [],
        is_public: false,
      })
      .select("id")
      .single();

    if (error) {
      console.error("❌ Save error:", error);
      throw error;
    }

    console.log("✅ Saved! ID:", saved.id);
    return { id: saved.id };
  } catch (error: any) {
    console.error("❌ Save failed:", error.message);
    throw error;
  }
}

// Get roadmap by ID
export async function getRoadmapById(id: string): Promise<SavedRoadmap | null> {
  try {
    console.log("🔍 Fetching roadmap:", id);

    const { data, error } = await db
      .from("roadmaps")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("❌ Fetch error:", error);
      return null;
    }

    console.log("✅ Roadmap found:", data.title);
    return data;
  } catch (error) {
    console.error("❌ Fetch error:", error);
    return null;
  }
}

// Get user's roadmaps
export async function getUserRoadmaps(userId: string): Promise<SavedRoadmap[]> {
  try {
    console.log("🔍 Fetching roadmaps for user:", userId);

    const { data, error } = await db
      .from("roadmaps")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("❌ Fetch error:", error);
      return [];
    }

    console.log(`✅ Found ${data?.length || 0} roadmaps`);
    return data || [];
  } catch (error) {
    console.error("❌ Fetch error:", error);
    return [];
  }
}

// Delete roadmap
export async function deleteRoadmap(id: string, userId: string): Promise<void> {
  try {
    console.log("🗑️ Deleting roadmap:", id);

    const { error } = await db
      .from("roadmaps")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("❌ Delete error:", error);
      throw error;
    }

    console.log("✅ Deleted successfully");
  } catch (error) {
    console.error("❌ Delete error:", error);
    throw error;
  }
}

// Toggle public/private visibility
export async function toggleRoadmapVisibility(
  id: string,
  userId: string,
  isPublic: boolean
): Promise<void> {
  try {
    console.log(`🔒 Setting visibility to: ${isPublic ? "Public" : "Private"}`);

    const { error } = await db
      .from("roadmaps")
      .update({ is_public: isPublic })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("❌ Toggle error:", error);
      throw error;
    }

    console.log("✅ Visibility updated");
  } catch (error) {
    console.error("❌ Toggle error:", error);
    throw error;
  }
}

// Update roadmap description (for future use)
export async function updateRoadmapDescription(
  id: string,
  userId: string,
  description: string
): Promise<void> {
  try {
    const { error } = await db
      .from("roadmaps")
      .update({ description })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;
    console.log("✅ Description updated");
  } catch (error) {
    console.error("❌ Update error:", error);
    throw error;
  }
}
