import { NextResponse } from "next/server";
import {
  findMatchingRoadmap,
  extractSkillsFromTemplate,
} from "@/lib/roadmaps/templates";
import { extractSkillsFromJob, generateLearningRoadmap } from "@/lib/gemini";
import { validateJobInput } from "@/lib/validator";
import { canGenerate, incrementUsage } from "@/lib/usageTracker";

export async function POST(request: Request) {
  try {
    const { jobDescription, mode = "auto", userId } = await request.json();

    // Check if user is authenticated
    const isAuthenticated = userId && userId !== "anonymous";

    // Check usage limits (skip for local-only mode)
    if (mode !== "local-only") {
      const usageCheck = canGenerate(isAuthenticated);
      if (!usageCheck.canGenerate) {
        return NextResponse.json(
          {
            success: false,
            error: usageCheck.message,
            usageLimitReached: true,
            remainingToday: usageCheck.remainingToday,
          },
          { status: 429 }
        );
      }
    }

    // Validate input
    const validation = validateJobInput(jobDescription);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.errors.join(" "),
          validation,
        },
        { status: 400 }
      );
    }

    console.log(
      `🔍 Processing (Mode: ${mode}, User: ${userId || "anonymous"})...`
    );

    // Try local first
    if (mode === "auto" || mode === "local-only") {
      const localTemplate = findMatchingRoadmap(jobDescription);

      if (localTemplate) {
        // Local templates don't count towards usage
        console.log("📚 Using local template:", localTemplate.title);

        return NextResponse.json({
          success: true,
          source: "local",
          validation,
          skills: extractSkillsFromTemplate(localTemplate),
          roadmap: {
            title: localTemplate.title,
            difficulty: localTemplate.difficulty,
            estimatedDays: localTemplate.estimatedDays,
            phases: localTemplate.phases,
          },
        });
      }
    }

    // Use AI (counts towards usage)
    if (mode === "auto" || mode === "ai-only") {
      console.log("🤖 Using AI generation...");

      const skills = await extractSkillsFromJob(jobDescription);
      const roadmap = await generateLearningRoadmap(skills);

      return NextResponse.json({
        success: true,
        source: "ai",
        validation,
        skills,
        roadmap,
      });
    }

    throw new Error("Invalid mode");
  } catch (error: any) {
    console.error("❌ Error:", error.message);

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate roadmap",
      },
      { status: 500 }
    );
  }
}
