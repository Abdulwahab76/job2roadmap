import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
});

// 🎯 Token counter
let tokensUsed = 0;
let requestsMade = 0;

export function getTokenStats() {
  return {
    tokensUsed,
    requestsMade,
    avgTokens: requestsMade > 0 ? Math.round(tokensUsed / requestsMade) : 0,
  };
}

// 🎯 Pre-process input to reduce tokens by 60-70%
function optimizeInput(text: string): string {
  // Remove common words that don't help
  const lines = text.split("\n");
  const usefulLines = lines.filter((line) => {
    const lower = line.toLowerCase();
    return (
      lower.includes("react") ||
      lower.includes("node") ||
      lower.includes("python") ||
      lower.includes("java") ||
      lower.includes("aws") ||
      lower.includes("sql") ||
      lower.includes("docker") ||
      lower.includes("kubernetes") ||
      lower.includes("git") ||
      lower.includes("typescript") ||
      lower.includes("javascript") ||
      lower.includes("go") ||
      lower.includes("rust") ||
      lower.includes("php") ||
      lower.includes("ruby") ||
      lower.includes("angular") ||
      lower.includes("vue") ||
      lower.includes("next") ||
      lower.includes("express") ||
      lower.includes("django") ||
      lower.includes("flask") ||
      lower.includes("mongodb") ||
      lower.includes("postgres") ||
      lower.includes("mysql") ||
      lower.includes("redis") ||
      lower.includes("graphql") ||
      lower.includes("rest") ||
      lower.includes("css") ||
      lower.includes("html") ||
      lower.includes("tailwind") ||
      /^\s*[-•*]\s/.test(line) // Bullet points
    );
  });

  // Limit to 500 characters
  return usefulLines.join("\n").substring(0, 500);
}

// 🎯 Ultra-minimal skill extraction (uses ~50-100 tokens)
export async function extractSkillsFromJob(jobDescription: string) {
  const optimized = optimizeInput(jobDescription);

  console.log(
    "📊 Input optimized:",
    jobDescription.length,
    "→",
    optimized.length,
    "chars"
  );

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Extract skills as JSON: ${optimized.substring(
      0,
      300
    )}\nFormat: {"jobTitle":"","requiredSkills":[],"niceToHaveSkills":[],"experienceLevel":""}`,
    config: {
      maxOutputTokens: 100, // 🎯 Limit output
      temperature: 0.1, // 🎯 Less creative = less tokens
    },
  });

  tokensUsed += response.usageMetadata?.totalTokenCount || 0;
  requestsMade++;

  return parseJSON(response.text as string);
}

// 🎯 Ultra-minimal roadmap generation (uses ~200-300 tokens)
export async function generateLearningRoadmap(skills: any) {
  // Only send essential info
  const minimalSkills = {
    title: skills.jobTitle || "Developer",
    skills: (skills.requiredSkills || []).slice(0, 5).join(", "),
    level: skills.experienceLevel || "intermediate",
  };

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `Create 3-phase roadmap as JSON for: ${JSON.stringify(
      minimalSkills
    )}. Each phase: 2-3 topics with free resources.`,
    config: {
      maxOutputTokens: 500, // 🎯 Limit output
      temperature: 0.3,
    },
  });

  tokensUsed += response.usageMetadata?.totalTokenCount || 0;
  requestsMade++;

  return parseJSON(response.text as string);
}

function parseJSON(text: string): any {
  const clean = text.replace(/```json\n?|\n?```/g, "").trim();
  const match = clean.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : clean);
}
