import { NextResponse } from "next/server";
import {
  findMatchingRoadmap,
  extractSkillsFromTemplate,
} from "@/lib/roadmaps/templates";
import { extractSkillsFromJob, generateLearningRoadmap } from "@/lib/gemini";
import { checkCache, saveToCache } from "@/lib/cacheService";
import { saveRoadmap } from "@/lib/roadmaps/roadmapService";
import { validateJobInput } from "@/lib/validator";
import { canGenerate, incrementUsage } from "@/lib/usageTracker";

export async function POST(request: Request) {
  try {
    const { jobDescription, mode = "auto", userId } = await request.json();
    const isAuthenticated = userId && userId !== "anonymous";

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("🔍 NEW REQUEST");
    console.log("📝 Input:", jobDescription?.substring(0, 80) + "...");
    console.log("👤 User:", userId || "anonymous");
    console.log("🎮 Mode:", mode);

    // Validate input
    const validation = validateJobInput(jobDescription);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(" ") },
        { status: 400 }
      );
    }

    let skills: any = null;
    let roadmap: any = null;
    let source: string = "ai";

    // 🎯 LAYER 1: LOCAL TEMPLATE (0 tokens)
    if (mode === "auto" || mode === "local-only") {
      console.log("🔍 LAYER 1: Checking local templates...");
      const localTemplate = findMatchingRoadmap(jobDescription);

      if (localTemplate) {
        console.log("✅ LOCAL MATCH:", localTemplate.title);
        console.log("💰 Tokens: 0 | API Calls: 0");
        skills = extractSkillsFromTemplate(localTemplate);
        roadmap = {
          title: localTemplate.title,
          difficulty: localTemplate.difficulty,
          estimatedDays: localTemplate.estimatedDays,
          phases: localTemplate.phases,
        };
        source = "local";
      } else {
        console.log("❌ No local template matched");
      }
    }

    // 🎯 LAYER 2: CACHE CHECK (0 tokens) - Only if no local match
    if (!roadmap && mode !== "ai-only") {
      console.log("🔍 LAYER 2: Checking cache...");
      const cached = await checkCache(jobDescription);

      if (cached) {
        console.log("✅ CACHE HIT!");
        console.log("💰 Tokens: 0 | API Calls: 0");
        skills = cached.skills;
        roadmap = cached.roadmap;
        source = "cache";
      } else {
        console.log("❌ No cache match");
      }
    }

    // 🎯 LAYER 3: AI GENERATION (minimal tokens) - Only if no match
    if (!roadmap && (mode === "auto" || mode === "ai-only")) {
      console.log("🤖 LAYER 3: AI generation needed");

      // Check usage limits
      const usageCheck = canGenerate(isAuthenticated);
      if (!usageCheck.canGenerate) {
        console.log("❌ Usage limit reached");
        return NextResponse.json(
          {
            success: false,
            error: usageCheck.message,
            usageLimitReached: true,
          },
          { status: 429 }
        );
      }

      // Generate with OPTIMIZED prompts
      console.log("📡 Calling Gemini API...");
      skills = await extractSkillsFromJob(jobDescription);
      roadmap = await generateLearningRoadmap(skills);
      source = "ai";

      // Track usage
      incrementUsage(isAuthenticated);

      // Save to cache for future (FREE next time!)
      console.log("💾 Saving to cache...");
      await saveToCache(jobDescription, skills, roadmap, "ai");
      console.log("✅ Cached for future (next time FREE)");
    }

    // 🎯 If still no roadmap (local-only mode with no match)
    if (!roadmap) {
      console.log("❌ No roadmap generated");
      return NextResponse.json(
        {
          success: false,
          error:
            "No matching roadmap found. Try AI mode or use different keywords.",
          noLocalMatch: true,
        },
        { status: 404 }
      );
    }

    // 🎯 Save to user's roadmaps (if authenticated)
    let savedId = null;
    if (isAuthenticated && userId) {
      try {
        console.log("💾 Saving to user account...");
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
      phases: roadmap.phases?.length,
      topics: roadmap.phases?.reduce(
        (acc: number, p: any) => acc + p.topics.length,
        0
      ),
      tokensSaved: source !== "ai" ? "100%" : "0%",
    });
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return NextResponse.json({
      success: true,
      source,
      skills,
      roadmap,
      savedId,
    });
  } catch (error: any) {
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.error("❌ FATAL ERROR:", error.message);
    console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return NextResponse.json(
      { success: false, error: error.message || "Failed to generate roadmap" },
      { status: 500 }
    );
  }
}
