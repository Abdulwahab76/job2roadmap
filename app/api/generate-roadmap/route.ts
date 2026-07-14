import { NextResponse } from "next/server";
import {
  findMatchingRoadmap,
  extractSkillsFromTemplate,
} from "@/lib/roadmaps/templates";
import { generateRoadmapInOneShot } from "@/lib/gemini"; // 🆕 One-shot function
import { checkCache, saveToCache } from "@/lib/cacheService";
import { saveRoadmap } from "@/lib/roadmaps/roadmapService";
import { validateJobInput } from "@/lib/validator";
import { canGenerate, incrementUsage } from "@/lib/usageTracker";
import { getUserAPIKeys } from "@/lib/settingsService";
import { supabase } from "@/lib/supabase";

// 🎯 Check if user has custom API key
async function getUserHasKey(userId: string): Promise<boolean> {
  if (!userId || userId === "anonymous") return false;

  const { data } = await supabase
    .from("user_api_keys")
    .select("id")
    .eq("user_id", userId)
    .eq("provider", "gemini")
    .eq("is_active", true)
    .is("revoked_at", null)
    .limit(1)
    .single();

  return !!data;
}
// Helper function
async function checkUserHasKey(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from("user_api_keys")
    .select("id")
    .eq("user_id", userId)
    .eq("is_active", true)
    .single();

  return !!data; // true agar key mili, false agar nahi
}
export async function POST(request: Request) {
  try {
    const { jobDescription, mode = "auto", userId } = await request.json();
    const isAuthenticated = userId && userId !== "anonymous";
    const userHasKey = await checkUserHasKey(userId);
    if (userHasKey) {
      console.log("✅ User has API key!");
    }
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔍 NEW REQUEST");
    console.log("📝 Input:", jobDescription?.substring(0, 80) + "...");
    console.log("👤 User:", userId || "anonymous");
    console.log("🎮 Mode:", mode);

    // Validate
    const validation = validateJobInput(jobDescription);

    if (jobDescription.trim().length < 20) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Description too short. Please provide at least 20 characters.",
        },
        { status: 400 }
      );
    }

    // 🆕 Check if user has custom API key
    const userHasCustomKey = await getUserHasKey(userId);
    if (userHasCustomKey) {
      console.log("🔑 User has custom API key - will use AI generation");
    }

    let skills: any = null;
    let roadmap: any = null;
    let source: string = "ai";
    let keySource: string = "none";

    // ────────────────────────────────────────
    // 🎯 LAYER 1: LOCAL TEMPLATE
    // ────────────────────────────────────────
    if (mode === "auto" || mode === "local-only") {
      if (userHasCustomKey && mode === "auto") {
        console.log("⏭️ Skipping local templates (user has custom API key)");
      } else {
        console.log("🔍 LAYER 1: Checking local templates...");
        const localTemplate = findMatchingRoadmap(jobDescription);

        if (localTemplate) {
          console.log("✅ LOCAL MATCH:", localTemplate.title);
          skills = extractSkillsFromTemplate(localTemplate);
          roadmap = {
            title: localTemplate.title,
            difficulty: localTemplate.difficulty,
            estimatedDays: localTemplate.estimatedDays,
            phases: localTemplate.phases,
          };
          source = "local";
          keySource = "none";
        }
      }
    }

    // ────────────────────────────────────────
    // 🎯 LAYER 2: CACHE CHECK
    // ────────────────────────────────────────
    if (!roadmap && mode !== "ai-only") {
      if (userHasCustomKey && mode === "auto") {
        console.log("⏭️ Skipping cache (user has custom API key)");
      } else {
        console.log("🔍 LAYER 2: Checking cache...");
        const cached = await checkCache(jobDescription);
        if (cached) {
          console.log("✅ CACHE HIT!");
          skills = cached.skills;
          roadmap = cached.roadmap;
          source = "cache";
          keySource = "none";
        }
      }
    }

    // ────────────────────────────────────────
    // 🎯 LAYER 3: AI GENERATION (ONLY ONCE!)
    // ────────────────────────────────────────
    // app/api/generate-roadmap/route.ts (LAYER 3 part)
    if (!roadmap && (mode === "auto" || mode === "ai-only")) {
      console.log("🤖 LAYER 3: AI generation...");

      const result = await generateRoadmapInOneShot(jobDescription, userId);

      if (result.success && result.roadmap) {
        // ✅ Success
        skills = result.skills;
        roadmap = result.roadmap;
        source = "ai";
        keySource = result.keySource;

        if (keySource === "app") incrementUsage(isAuthenticated);
        try {
          await saveToCache(jobDescription, skills, roadmap, "ai");
        } catch {}
      } else {
        // ❌ AI Failed - Return ERROR to frontend
        console.log("❌ AI failed:", result.error);

        return NextResponse.json(
          {
            success: false,
            error: result.error,
            errorType: result.errorType, // "user_quota" | "user_key_invalid" | "app_quota" | "no_key"
            keySource: result.keySource,
          },
          { status: result.errorType?.includes("quota") ? 429 : 400 }
        );
      }
    }

    // ────────────────────────────────────────
    // 🎯 Save to user account
    // ────────────────────────────────────────
    let savedId = null;
    if (isAuthenticated && userId) {
      try {
        const saved = await saveRoadmap({
          userId,
          title: roadmap.title,
          jobDescription,
          skills,
          roadmap,
          source: source as any,
        });
        savedId = saved.id;
        console.log("✅ Saved! ID:", savedId);
      } catch (e: any) {
        console.error("❌ Save failed:", e.message);
      }
    }

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📊 RESULT:", {
      source,
      keySource,
      phases: roadmap?.phases?.length,
    });
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return NextResponse.json({
      success: true,
      source,
      keySource,
      skills,
      roadmap,
      savedId,
      validation,
    });
  } catch (error: any) {
    console.error("❌ FATAL ERROR:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🎯 Fallback roadmap
function generateFallbackRoadmap(): any {
  return {
    title: "Software Developer Learning Roadmap",
    difficulty: "beginner",
    estimatedDays: 60,
    phases: [
      {
        phaseTitle: "Phase 1: Programming Fundamentals (3 weeks)",
        duration: "3 weeks",
        topics: [
          {
            title: "HTML, CSS & JavaScript",
            description: "Master the core building blocks of the web",
            resources: [
              {
                name: "freeCodeCamp",
                url: "https://www.freecodecamp.org/",
                type: "course",
                isFree: true,
              },
              {
                name: "The Odin Project",
                url: "https://www.theodinproject.com/",
                type: "course",
                isFree: true,
              },
            ],
            project: "Build a personal portfolio website",
          },
        ],
      },
    ],
  };
}

// ────────────────────────────────────────
// 🎯 Fallback roadmap generator
// ────────────────────────────────────────
