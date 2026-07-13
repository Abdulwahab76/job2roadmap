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

    // 🎯 Validate but don't reject - sirf warnings do
    const validation = validateJobInput(jobDescription);

    // 🎯 FIX: Sirf length check mein reject karo
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

    // Warnings log karo but allow karo
    if (validation.warnings.length > 0) {
      console.log("⚠️ Warnings:", validation.warnings);
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

    // 🎯 LAYER 2: CACHE CHECK (0 tokens)
    if (!roadmap && mode !== "ai-only") {
      console.log("🔍 LAYER 2: Checking cache...");
      const cached = await checkCache(jobDescription);

      if (cached) {
        console.log("✅ CACHE HIT!");
        skills = cached.skills;
        roadmap = cached.roadmap;
        source = "cache";
      } else {
        console.log("❌ No cache match");
      }
    }

    // 🎯 LAYER 3: AI GENERATION (Smart handling)
    if (!roadmap && (mode === "auto" || mode === "ai-only")) {
      console.log("🤖 LAYER 3: AI generation needed");

      // Check usage limits
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

      // 🎯 Smart generation with fallback
      try {
        console.log("📡 Calling Gemini API...");
        skills = await extractSkillsFromJob(jobDescription);
        roadmap = await generateLearningRoadmap(skills);
        source = "ai";

        // Track usage
        incrementUsage(isAuthenticated);

        // Save to cache
        await saveToCache(jobDescription, skills, roadmap, "ai");
        console.log("✅ Cached for future");
      } catch (aiError: any) {
        console.error("❌ AI failed:", aiError.message);
        console.log("⚠️ Using fallback roadmap");

        // 🎯 FALLBACK: Return basic roadmap if AI fails
        skills = {
          jobTitle: "Software Developer",
          requiredSkills: ["HTML", "CSS", "JavaScript", "Git"],
          experienceLevel: "beginner",
        };
        roadmap = generateFallbackRoadmap();
        source = "ai";
      }
    }

    if (!roadmap) {
      return NextResponse.json(
        {
          success: false,
          error: "Unable to generate roadmap. Please try again.",
        },
        { status: 500 }
      );
    }

    // Save to user account
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

    console.log("📊 RESULT:", { source, phases: roadmap.phases?.length });
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━");

    return NextResponse.json({
      success: true,
      source,
      skills,
      roadmap,
      savedId,
      validation, // Warnings bhi bhejo
    });
  } catch (error: any) {
    console.error("❌ FATAL ERROR:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// 🎯 Fallback roadmap generator
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
          {
            title: "Version Control with Git & GitHub",
            description: "Learn essential version control for collaboration",
            resources: [
              {
                name: "GitHub Skills",
                url: "https://skills.github.com/",
                type: "interactive",
                isFree: true,
              },
              {
                name: "Git Handbook",
                url: "https://guides.github.com/introduction/git-handbook/",
                type: "documentation",
                isFree: true,
              },
            ],
            project: "Push your projects to GitHub",
          },
        ],
      },
      {
        phaseTitle: "Phase 2: Frontend Development (4 weeks)",
        duration: "4 weeks",
        topics: [
          {
            title: "React.js Fundamentals",
            description: "Learn the most popular frontend framework",
            resources: [
              {
                name: "React Official Docs",
                url: "https://react.dev/learn",
                type: "documentation",
                isFree: true,
              },
              {
                name: "Scrimba React Course",
                url: "https://scrimba.com/learn/learnreact",
                type: "course",
                isFree: true,
              },
            ],
            project: "Build a task management application",
          },
          {
            title: "CSS Frameworks & Responsive Design",
            description: "Create beautiful, mobile-friendly interfaces",
            resources: [
              {
                name: "TailwindCSS Docs",
                url: "https://tailwindcss.com/docs",
                type: "documentation",
                isFree: true,
              },
              {
                name: "CSS Grid Garden",
                url: "https://cssgridgarden.com/",
                type: "interactive",
                isFree: true,
              },
            ],
            project: "Style your app with TailwindCSS",
          },
        ],
      },
      {
        phaseTitle: "Phase 3: Backend & APIs (4 weeks)",
        duration: "4 weeks",
        topics: [
          {
            title: "Node.js & REST APIs",
            description: "Build server-side applications and APIs",
            resources: [
              {
                name: "Node.js Docs",
                url: "https://nodejs.org/en/docs/",
                type: "documentation",
                isFree: true,
              },
              {
                name: "Express.js Guide",
                url: "https://expressjs.com/en/guide/routing.html",
                type: "documentation",
                isFree: true,
              },
            ],
            project: "Create a REST API for your app",
          },
          {
            title: "Database Fundamentals",
            description: "Learn SQL and database design principles",
            resources: [
              {
                name: "SQL Tutorial",
                url: "https://www.sqltutorial.org/",
                type: "tutorial",
                isFree: true,
              },
              {
                name: "PostgreSQL Docs",
                url: "https://www.postgresql.org/docs/",
                type: "documentation",
                isFree: true,
              },
            ],
            project: "Connect database to your API",
          },
        ],
      },
    ],
  };
}
