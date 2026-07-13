 import { NextResponse } from "next/server";
import {
  findMatchingRoadmap,
  extractSkillsFromTemplate,
} from "@/lib/roadmaps/templates";
import { extractSkillsFromJob, generateLearningRoadmap } from "@/lib/gemini";
import { validateJobInput } from "@/lib/validator";
import { canGenerate, incrementUsage } from "@/lib/usageTracker";
import { saveRoadmap } from "@/lib/roadmaps/roadmapService";

export async function POST(request: Request) {
  try {
    const { jobDescription, mode = "auto", userId } = await request.json();
    const isAuthenticated = userId && userId !== "anonymous";

    // Check usage limits
    if (mode !== "local-only") {
      const usageCheck = canGenerate(isAuthenticated);
      if (!usageCheck.canGenerate) {
        return NextResponse.json(
          {
            success: false,
            error: usageCheck.message,
            usageLimitReached: true,
          },
          { status: 429 }
        );
      }
    }

    // Validate input
    const validation = validateJobInput(jobDescription);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.errors.join(" ") },
        { status: 400 }
      );
    }

    console.log(`🔍 Processing for user: ${userId || "anonymous"}`);

    let skills: any = null;
    let roadmap: any = null;
    let source = "local";

    // Try local template
    if (mode === "auto" || mode === "local-only") {
      const localTemplate = findMatchingRoadmap(jobDescription);
      if (localTemplate) {
        console.log("📚 Local template:", localTemplate.title);
        skills = extractSkillsFromTemplate(localTemplate);
        roadmap = {
          title: localTemplate.title,
          difficulty: localTemplate.difficulty,
          estimatedDays: localTemplate.estimatedDays,
          phases: localTemplate.phases,
        };
        source = "local";
      }
    }

    // Try AI
    if (!roadmap && (mode === "auto" || mode === "ai-only")) {
      console.log("🤖 Using AI...");
      skills = await extractSkillsFromJob(jobDescription);
      roadmap = await generateLearningRoadmap(skills);
      source = "ai";
      incrementUsage(isAuthenticated);
    }

    if (!roadmap || !skills) {
      throw new Error("Failed to generate roadmap");
    }

    // 🎯 ALWAYS TRY TO SAVE
    let savedId = null;
    try {
      console.log("💾 Saving to database...");
      const saved = await saveRoadmap({
        userId: userId || "anonymous",
        title: roadmap.title,
        jobDescription,
        skills,
        roadmap,
        source: source as any,
      });
      savedId = saved.id;
      console.log("✅ SAVED! ID:", savedId);
    } catch (saveError: any) {
      console.error("❌ Save failed:", saveError.message);
      // Continue even if save fails
    }

    return NextResponse.json({
      success: true,
      source,
      skills,
      roadmap,
      savedId, // Should not be null now!
    });

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
 