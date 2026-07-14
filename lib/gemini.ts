import { GoogleGenAI } from "@google/genai";
import { decrypt } from "./encryption";
import { supabase } from "./supabase";

// ──────────────────────────────────────────────
// 🎯 Get user's custom API key (if exists)
// ──────────────────────────────────────────────
async function getUserAPIKey(userId: string): Promise<string | null> {
  try {
    console.log("🔍 Looking for user API key...");

    const { data, error } = await supabase
      .from("user_api_keys")
      .select("api_key")
      .eq("user_id", userId)
      .eq("provider", "gemini")
      .eq("is_active", true)
      .is("revoked_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.log("❌ Query error:", error.message);
      return null;
    }

    if (!data?.api_key) {
      console.log("❌ No API key found");
      return null;
    }

    const key = data.api_key;
    console.log("📝 Key from DB starts with:", key.substring(0, 10) + "...");

    return data.api_key;
  } catch (e: any) {
    console.error("❌ Error:", e.message);
    return null;
  }
}

// ──────────────────────────────────────────────
// 🎯 Track usage count
// ──────────────────────────────────────────────
async function incrementUsage(userId: string): Promise<void> {
  try {
    // Get current count
    const { data } = await supabase
      .from("user_api_keys")
      .select("usage_count")
      .eq("user_id", userId)
      .eq("provider", "gemini")
      .eq("is_active", true)
      .is("revoked_at", null)
      .single();

    const newCount = (data?.usage_count || 0) + 1;

    await supabase
      .from("user_api_keys")
      .update({ usage_count: newCount, last_used: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("provider", "gemini")
      .eq("is_active", true)
      .is("revoked_at", null);
  } catch {
    // Silently fail - usage tracking shouldn't block generation
  }
}

// ──────────────────────────────────────────────
// 🎯 Create AI instance (User key → App key fallback)
// ──────────────────────────────────────────────
async function createAIClient(userId?: string): Promise<{
  ai: GoogleGenAI;
  keySource: "user" | "app";
}> {
  // 🎯 Default: Use app key as fallback
  let apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY!;
  let keySource: "user" | "app" = "app";

  if (userId) {
    console.log("🔍 Checking for user API key...");
    const userKey = await getUserAPIKey(userId);

    if (userKey) {
      // ✅ User key mili - use this instead
      apiKey = userKey;
      keySource = "user";
      console.log("🔑 Using USER API key! 💰 FREE!");
      console.log("🔑 Key starts with:", apiKey.substring(0, 15) + "...");
    } else {
      // ❌ No user key - keep app key
      console.log("📡 No user key found, using APP key");
      console.log("🔑 App key starts with:", apiKey.substring(0, 15) + "...");
    }
  } else {
    console.log("📡 No userId, using APP key");
  }

  // 🎯 Safety check
  if (!apiKey) {
    console.error("❌ NO API KEY AVAILABLE!");
    throw new Error("No API key configured");
  }

  return {
    ai: new GoogleGenAI({ apiKey }),
    keySource,
  };
}

// ──────────────────────────────────────────────
// 🎯 Infer tech stack from generic descriptions
// ──────────────────────────────────────────────
function inferTechStack(text: string): string {
  const lower = text.toLowerCase();
  const inferred: string[] = [];

  if (
    lower.includes("frontend") ||
    lower.includes("ui") ||
    lower.includes("interface")
  ) {
    inferred.push("React", "TypeScript", "CSS", "HTML");
  }
  if (
    lower.includes("backend") ||
    lower.includes("api") ||
    lower.includes("server")
  ) {
    inferred.push("Node.js", "Express", "REST API");
  }
  if (lower.includes("database") || lower.includes("data")) {
    inferred.push("PostgreSQL", "MongoDB");
  }
  if (lower.includes("responsive") || lower.includes("mobile")) {
    inferred.push("Responsive Design", "CSS Flexbox/Grid");
  }
  if (
    lower.includes("test") ||
    lower.includes("qa") ||
    lower.includes("quality")
  ) {
    inferred.push("Jest", "Testing Library");
  }
  if (lower.includes("review") || lower.includes("git")) {
    inferred.push("Git", "GitHub", "Code Review");
  }

  if (inferred.length === 0) {
    inferred.push("HTML", "CSS", "JavaScript", "React", "Git");
  }

  return inferred.join(", ");
}

// ──────────────────────────────────────────────
// 🎯 JSON Parser
// ──────────────────────────────────────────────
function parseJSON(text: string): any {
  const clean = text.replace(/```json\n?|\n?```/g, "").trim();
  const match = clean.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : clean);
}

// ──────────────────────────────────────────────
// 🎯 Fallback Roadmap (when everything fails)
// ──────────────────────────────────────────────

// ──────────────────────────────────────────────
// 🎯 ONE SHOT: Extract skills + Generate roadmap
// ──────────────────────────────────────────────
export async function generateRoadmapInOneShot(
  jobDescription: string,
  userId?: string
): Promise<{ skills: any; roadmap: any; keySource: string }> {
  const { ai, keySource } = await createAIClient(userId);

  try {
    const prompt = `Create a 3-phase learning roadmap for: ${jobDescription.substring(
      0,
      400
    )}. Return JSON with phases array.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: { maxOutputTokens: 500, temperature: 0.3 },
    });

    const text = response.text as string;
    const data = parseJSON(text);

    return {
      skills: {
        jobTitle: data.title || "Developer",
        requiredSkills: data.skills || [],
        experienceLevel: "intermediate",
      },
      roadmap: {
        title: data.title || "Learning Roadmap",
        difficulty: "intermediate",
        estimatedDays: 60,
        phases: data.phases || [],
      },
      keySource,
    };
  } catch (error: any) {
    console.error("❌ AI failed:", error.message);

    return {
      skills: {
        jobTitle: "Developer",
        requiredSkills: ["HTML", "CSS", "JavaScript"],
        experienceLevel: "beginner",
      },
      roadmap: {
        title: "Developer Roadmap",
        difficulty: "beginner",
        estimatedDays: 45,
        phases: [
          {
            phaseTitle: "Phase 1: Fundamentals",
            duration: "2 weeks",
            topics: [
              {
                title: "Web Basics",
                description: "Learn HTML, CSS, JavaScript",
                resources: [
                  {
                    name: "freeCodeCamp",
                    url: "https://www.freecodecamp.org/",
                    type: "course",
                    isFree: true,
                  },
                ],
                project: "Build a portfolio",
              },
            ],
          },
        ],
      },
      keySource: "local",
    };
  }
}

// ──────────────────────────────────────────────
// 🎯 Legacy exports (for backward compatibility)
// ──────────────────────────────────────────────
export async function extractSkillsFromJob(jobDescription: string) {
  const result = await generateRoadmapInOneShot(jobDescription);
  return result.skills;
}

export async function generateLearningRoadmap(skills: any) {
  const result = await generateRoadmapInOneShot(skills.jobTitle || "Developer");
  return result.roadmap;
}
