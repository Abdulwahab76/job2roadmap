import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
});

// 🎯 Extract potential tech stack from generic description
function inferTechStack(text: string): string {
  const lower = text.toLowerCase();
  const inferred: string[] = [];

  // Check for keywords and infer related stack
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

  // If nothing inferred, add common web dev stack
  if (inferred.length === 0) {
    inferred.push("HTML", "CSS", "JavaScript", "React", "Git");
  }

  return inferred.join(", ");
}

// 🎯 Smart skill extraction with fallback
export async function extractSkillsFromJob(jobDescription: string) {
  // Infer tech stack if generic
  const inferredStack = inferTechStack(jobDescription);

  const prompt = `Analyze this job description and extract required technical skills.
  
  Job: ${jobDescription.substring(0, 800)}
  Hint: This appears to be a ${inferredStack} related role.
  
  Return ONLY JSON:
  {
    "jobTitle": "extracted or inferred job title",
    "requiredSkills": ["skill1", "skill2", ...],
    "niceToHaveSkills": ["skill1", ...],
    "experienceLevel": "beginner/intermediate/advanced"
  }`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 200,
        temperature: 0.3,
      },
    });

    const text = response.text as string;
    return parseJSON(text);
  } catch (error: any) {
    console.error("❌ Gemini Error:", error.message);

    // 🎯 FALLBACK: Return inferred skills if AI fails
    console.log("⚠️ Using inferred skills as fallback");
    return {
      jobTitle: "Web Developer",
      requiredSkills: inferredStack.split(", "),
      niceToHaveSkills: ["TypeScript", "Docker", "AWS"],
      experienceLevel: "beginner",
    };
  }
}

// 🎯 Smart roadmap generation with error handling
export async function generateLearningRoadmap(skills: any) {
  const minimalSkills = {
    title: skills.jobTitle || "Web Developer",
    skills: (skills.requiredSkills || []).slice(0, 6).join(", "),
    level: skills.experienceLevel || "beginner",
  };

  const prompt = `Create a 3-phase learning roadmap for: ${JSON.stringify(
    minimalSkills
  )}.
  Each phase: 2-3 topics with 2 free resources each.
  Return ONLY JSON with phases array.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 600,
        temperature: 0.5,
      },
    });

    const text = response.text as string;
    return parseJSON(text);
  } catch (error: any) {
    console.error("❌ Gemini Error:", error.message);

    // 🎯 FALLBACK: Return generic roadmap
    console.log("⚠️ Using generic roadmap as fallback");
    return {
      title: `${skills.jobTitle || "Web Developer"} Roadmap`,
      difficulty: skills.experienceLevel || "beginner",
      estimatedDays: 60,
      phases: [
        {
          phaseTitle: "Phase 1: Fundamentals",
          duration: "3 weeks",
          topics: [
            {
              title: "HTML, CSS & JavaScript Basics",
              description: "Master the core web technologies",
              resources: [
                {
                  name: "freeCodeCamp",
                  url: "https://www.freecodecamp.org/",
                  type: "course",
                  isFree: true,
                },
                {
                  name: "MDN Web Docs",
                  url: "https://developer.mozilla.org/",
                  type: "documentation",
                  isFree: true,
                },
              ],
              project: "Build a personal portfolio website",
            },
            {
              title: "Version Control with Git",
              description: "Learn Git basics and GitHub workflow",
              resources: [
                {
                  name: "GitHub Learning Lab",
                  url: "https://github.com/apps/github-learning-lab",
                  type: "course",
                  isFree: true,
                },
                {
                  name: "Git Handbook",
                  url: "https://guides.github.com/introduction/git-handbook/",
                  type: "documentation",
                  isFree: true,
                },
              ],
              project: "Push your portfolio to GitHub",
            },
          ],
        },
        {
          phaseTitle: "Phase 2: Frontend Development",
          duration: "4 weeks",
          topics: [
            {
              title: "React.js Fundamentals",
              description: "Learn components, state, props, and hooks",
              resources: [
                {
                  name: "React Official Tutorial",
                  url: "https://react.dev/learn",
                  type: "documentation",
                  isFree: true,
                },
                {
                  name: "Net Ninja React Playlist",
                  url: "https://youtube.com/playlist?list=PL4cUxeGkcC9gZD-Tvwfod2gaISzfRiP9d",
                  type: "video",
                  isFree: true,
                },
              ],
              project: "Build a task management app",
            },
            {
              title: "Responsive Design & CSS Frameworks",
              description: "Master responsive layouts and TailwindCSS",
              resources: [
                {
                  name: "TailwindCSS Docs",
                  url: "https://tailwindcss.com/docs",
                  type: "documentation",
                  isFree: true,
                },
                {
                  name: "CSS Tricks",
                  url: "https://css-tricks.com/",
                  type: "documentation",
                  isFree: true,
                },
              ],
              project: "Make your app responsive",
            },
          ],
        },
        {
          phaseTitle: "Phase 3: Backend & Database",
          duration: "4 weeks",
          topics: [
            {
              title: "Node.js & Express",
              description: "Build RESTful APIs with Node.js",
              resources: [
                {
                  name: "Node.js Official Docs",
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
              project: "Create API for your app",
            },
            {
              title: "Database Fundamentals",
              description: "Learn SQL and database design",
              resources: [
                {
                  name: "PostgreSQL Tutorial",
                  url: "https://www.postgresqltutorial.com/",
                  type: "tutorial",
                  isFree: true,
                },
                {
                  name: "MongoDB University",
                  url: "https://learn.mongodb.com/",
                  type: "course",
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
}

// JSON parser
function parseJSON(text: string): any {
  try {
    const clean = text.replace(/```json\n?|\n?```/g, "").trim();
    const match = clean.match(/\{[\s\S]*\}/);
    return JSON.parse(match ? match[0] : clean);
  } catch (error) {
    console.error("JSON parse error:", text.substring(0, 200));
    throw new Error("Failed to parse AI response");
  }
}
