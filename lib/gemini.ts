import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
});

function parseJSON(text: string): any {
  const clean = text.replace(/```json\n?|\n?```/g, "").trim();
  const match = clean.match(/\{[\s\S]*\}/);
  return JSON.parse(match ? match[0] : clean);
}

export async function extractSkillsFromJob(jobDescription: string) {
  const text = jobDescription.substring(0, 1500);

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: `Extract skills from this job as JSON: {"jobTitle":"","requiredSkills":[],"niceToHaveSkills":[],"tools":[],"experienceLevel":"","keyResponsibilities":[]}\n\n${text}`,
  });

  return parseJSON(response.text as string);
}


export async function generateLearningRoadmap(skills: any) {
  const simpleSkills = {
    title: skills.jobTitle,
    skills: skills.requiredSkills?.slice(0, 5) || [],
  };

  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: `Create a 3-phase learning roadmap as JSON for: ${JSON.stringify(
      simpleSkills
    )}. Include topics with free resources and projects.`,
  });

  return parseJSON(response.text as string);
}
