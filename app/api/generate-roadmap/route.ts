import { NextResponse } from "next/server";
import {
  findMatchingRoadmap,
  extractSkillsFromTemplate,
  ROADMAP_TEMPLATES,
} from "@/lib/roadmaps/templates";
import { extractSkillsFromJob, generateLearningRoadmap } from "@/lib/gemini";
import { validateJobInput } from "@/lib/validator";

// Mode can be 'auto', 'local-only', 'ai-only'
export async function POST(request: Request) {
  try {
    const { jobDescription, mode = "auto" } = await request.json();

    // Step 1: Validate input first
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

    console.log(`🔍 Processing (Mode: ${mode})...`);
    console.log(`📊 Detected: ${validation.detectedCategory}`);
    console.log(`🎯 Skills found: ${validation.requiredSkills.join(", ")}`);

    // Step 2: Try local first (for auto or local-only mode)
    if (mode === "auto" || mode === "local-only") {
      const localTemplate = findMatchingRoadmap(jobDescription);

      if (localTemplate) {
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

      if (mode === "local-only") {
        // No local match and we're in local-only mode
        const availableStacks = ROADMAP_TEMPLATES.map((t) => t.title).join(
          ", "
        );
        return NextResponse.json(
          {
            success: false,
            error: `No matching local roadmap found. Available stacks: ${availableStacks}. Try different keywords or switch to AI mode.`,
            availableTemplates: ROADMAP_TEMPLATES.map((t) => ({
              id: t.id,
              title: t.title,
              keywords: t.keywords.slice(0, 5),
            })),
          },
          { status: 404 }
        );
      }
    }

    // Step 3: Use AI (for auto or ai-only mode)
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
        isApiError:
          error.message?.includes("API") || error.message?.includes("token"),
      },
      { status: 500 }
    );
  }
}
