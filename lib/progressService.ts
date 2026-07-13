import { supabase } from "./supabase";

const db = supabase;

export type ProgressStatus = "not_started" | "in_progress" | "completed";

export type UserProgress = {
  id?: string;
  user_id: string;
  roadmap_id: string;
  node_id: string;
  status: ProgressStatus;
  notes?: string;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
};

// Get all progress for a roadmap
export async function getRoadmapProgress(
  userId: string,
  roadmapId: string
): Promise<UserProgress[]> {
  try {
    const { data, error } = await db
      .from("user_progress")
      .select("*")
      .eq("user_id", userId)
      .eq("roadmap_id", roadmapId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("❌ Error fetching progress:", error);
    return [];
  }
}

// Update node progress
export async function updateNodeProgress(
  userId: string,
  roadmapId: string,
  nodeId: string,
  status: ProgressStatus,
  notes?: string
): Promise<UserProgress> {
  try {
    const now = new Date().toISOString();

    // Check if record exists
    const { data: existing } = await db
      .from("user_progress")
      .select("id")
      .eq("user_id", userId)
      .eq("roadmap_id", roadmapId)
      .eq("node_id", nodeId)
      .single();

    if (existing) {
      // Update existing
      const { data, error } = await db
        .from("user_progress")
        .update({
          status,
          notes: notes || null,
          completed_at: status === "completed" ? now : null,
          updated_at: now,
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      // Insert new
      const { data, error } = await db
        .from("user_progress")
        .insert({
          user_id: userId,
          roadmap_id: roadmapId,
          node_id: nodeId,
          status,
          notes: notes || "",
          completed_at: status === "completed" ? now : null,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  } catch (error: any) {
    console.error("❌ Error updating progress:", error.message);
    throw error;
  }
}

// Mark complete
export async function markNodeComplete(
  userId: string,
  roadmapId: string,
  nodeId: string
): Promise<UserProgress> {
  return updateNodeProgress(userId, roadmapId, nodeId, "completed");
}

// Mark in progress
export async function markNodeInProgress(
  userId: string,
  roadmapId: string,
  nodeId: string
): Promise<UserProgress> {
  return updateNodeProgress(userId, roadmapId, nodeId, "in_progress");
}

// Add note
export async function addNodeNote(
  userId: string,
  roadmapId: string,
  nodeId: string,
  notes: string
): Promise<UserProgress> {
  const { data: existing } = await db
    .from("user_progress")
    .select("status")
    .eq("user_id", userId)
    .eq("roadmap_id", roadmapId)
    .eq("node_id", nodeId)
    .single();

  const status = existing?.status || "in_progress";
  return updateNodeProgress(userId, roadmapId, nodeId, status, notes);
}

// Get overall stats for dashboard
export async function getUserProgressStats(userId: string): Promise<{
  totalCompleted: number;
  totalInProgress: number;
  totalRoadmaps: number;
  completionRate: number;
}> {
  try {
    // Get all progress
    const { data: allProgress } = await db
      .from("user_progress")
      .select("status")
      .eq("user_id", userId);

    // Get total roadmaps
    const { count: roadmapCount } = await db
      .from("roadmaps")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    const total = allProgress?.length || 0;
    const completed =
      allProgress?.filter((p) => p.status === "completed").length || 0;
    const inProgress =
      allProgress?.filter((p) => p.status === "in_progress").length || 0;

    return {
      totalCompleted: completed,
      totalInProgress: inProgress,
      totalRoadmaps: roadmapCount || 0,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  } catch (error) {
    console.error("❌ Error fetching stats:", error);
    return {
      totalCompleted: 0,
      totalInProgress: 0,
      totalRoadmaps: 0,
      completionRate: 0,
    };
  }
}

// Get all completed nodes for a roadmap
export async function getCompletedNodes(
  userId: string,
  roadmapId: string
): Promise<string[]> {
  try {
    const { data } = await db
      .from("user_progress")
      .select("node_id")
      .eq("user_id", userId)
      .eq("roadmap_id", roadmapId)
      .eq("status", "completed");

    return (data || []).map((d) => d.node_id);
  } catch (error) {
    return [];
  }
}

// Get all in-progress nodes
export async function getInProgressNodes(
  userId: string,
  roadmapId: string
): Promise<string[]> {
  try {
    const { data } = await db
      .from("user_progress")
      .select("node_id")
      .eq("user_id", userId)
      .eq("roadmap_id", roadmapId)
      .eq("status", "in_progress");

    return (data || []).map((d) => d.node_id);
  } catch (error) {
    return [];
  }
}
