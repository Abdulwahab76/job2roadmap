// lib/gemini.ts - PRODUCTION READY with proper error throwing
import { GoogleGenAI } from "@google/genai";
import { decrypt } from "./encryption";
import { supabase } from "./supabase";

// ──────────────────────────────────────────────
// 🎯 Custom Error Classes
// ──────────────────────────────────────────────
export class QuotaExceededError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QuotaExceededError";
  }
}

export class InvalidAPIKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidAPIKeyError";
  }
}

export class AITimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AITimeoutError";
  }
}

// ──────────────────────────────────────────────
// 🎯 CONFIG
// ──────────────────────────────────────────────
const MAX_PROMPT_LENGTH = 300;
const MAX_OUTPUT_TOKENS = 400;
const API_TIMEOUT_MS = 15000;

// ──────────────────────────────────────────────
// 🎯 Get user API key
// ──────────────────────────────────────────────
async function getUserAPIKey(userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("user_api_keys")
      .select("api_key_encrypted, api_key")
      .eq("user_id", userId)
      .eq("provider", "gemini")
      .eq("is_active", true)
      .is("revoked_at", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error || !data) return null;

    const key = data.api_key_encrypted || data.api_key;
    if (!key) return null;

    if (!key.startsWith("AIza") && !key.startsWith("sk-")) {
      try {
        return decrypt(key);
      } catch {
        // decrypt failed
      }
    }

    return key;
  } catch {
    return null;
  }
}

// ──────────────────────────────────────────────
// 🎯 Call Gemini API - THROWS on error
// ──────────────────────────────────────────────
async function callGemini(apiKey: string, prompt: string): Promise<any> {
  const ai = new GoogleGenAI({ apiKey });

  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new AITimeoutError("Request timed out after 15 seconds")),
        API_TIMEOUT_MS
      )
    );

    const apiCall = ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        temperature: 0.3,
      },
    });

    const response = await Promise.race([apiCall, timeout]);
    const text = (response as any).text as string;

    return parseJSON(text);
  } catch (error: any) {
    // 🎯 THROW proper errors
    const msg = error.message || "";

    if (error instanceof AITimeoutError) {
      throw error; // Re-throw
    }

    if (msg.includes("API_TIMEOUT")) {
      throw new AITimeoutError("Request timed out. Please try again.");
    }

    if (
      msg.includes("quota") ||
      msg.includes("RESOURCE_EXHAUSTED") ||
      msg.includes("429")
    ) {
      throw new QuotaExceededError(
        "API quota exceeded. Daily limit reached. Try again later or use a different API key."
      );
    }

    if (msg.includes("INVALID_ARGUMENT") || msg.includes("API key not valid")) {
      throw new InvalidAPIKeyError(
        "Invalid API key. Please check your key in Settings."
      );
    }

    if (msg.includes("PERMISSION_DENIED") || msg.includes("403")) {
      throw new InvalidAPIKeyError("API key doesn't have permission.");
    }

    throw new Error(`AI generation failed: ${msg}`);
  }
}

// ──────────────────────────────────────────────
// 🎯 Build ultra-short prompt
// ──────────────────────────────────────────────
function buildPrompt(jobDescription: string): string {
  const clean = jobDescription
    .replace(/\s+/g, " ")
    .trim()
    .substring(0, MAX_PROMPT_LENGTH);
  return `Create roadmap as JSON for: ${clean}\nFormat: {"title":"","skills":[],"phases":[{"phaseTitle":"","duration":"","topics":[{"title":"","description":"","resources":[{"name":"","url":"","isFree":true}],"project":""}]}]}`;
}

// ──────────────────────────────────────────────
// 🎯 MAIN: Generate Roadmap - THROWS on error
// ──────────────────────────────────────────────
export async function generateRoadmapInOneShot(
  jobDescription: string,
  userId?: string
): Promise<{
  success: boolean;
  skills?: any;
  roadmap?: any;
  keySource: string;
  error?: string;
  errorType?: string;
}> {
  const prompt = buildPrompt(jobDescription);

  // ────────────────────────────────────────
  // LAYER 1: USER API KEY
  // ────────────────────────────────────────
  if (userId) {
    const userKey = await getUserAPIKey(userId);

    if (userKey) {
      console.log("🔑 LAYER 1: Trying USER API key...");
      try {
        const data = await callGemini(userKey, prompt);
        console.log("✅ USER KEY SUCCESS! 💰 FREE!");
        return {
          success: true,
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
          keySource: "user",
        };
      } catch (error: any) {
        // 🎯 USER KEY FAILED - Return error, DON'T fallback
        console.log("❌ User key failed:", error.message);
        return {
          success: false,
          error: error.message,
          errorType:
            error instanceof QuotaExceededError
              ? "user_quota"
              : error instanceof InvalidAPIKeyError
              ? "user_key_invalid"
              : "general",
          keySource: "user",
        };
      }
    }
  }

  // ────────────────────────────────────────
  // LAYER 2: APP API KEY (only if no user key OR user key not set)
  // ────────────────────────────────────────
  const appKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (appKey) {
    console.log("🔑 LAYER 2: Trying APP API key...");
    try {
      const data = await callGemini(appKey, prompt);
      console.log("✅ APP KEY SUCCESS!");
      return {
        success: true,
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
        keySource: "app",
      };
    } catch (error: any) {
      console.log("❌ App key failed:", error.message);
      return {
        success: false,
        error: error.message,
        errorType:
          error instanceof QuotaExceededError ? "app_quota" : "general",
        keySource: "app",
      };
    }
  }

  // ────────────────────────────────────────
  // LAYER 3: NO KEYS
  // ────────────────────────────────────────
  return {
    success: false,
    error: "No API key configured. Add your Gemini API key in Settings.",
    errorType: "no_key",
    keySource: "none",
  };
}
// ──────────────────────────────────────────────
// 🎯 JSON Parser
// ──────────────────────────────────────────────
function parseJSON(text: string): any {
  const clean = text.replace(/```json\n?|\n?```/g, "").trim();
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Invalid JSON response from AI");
  return JSON.parse(match[0]);
}

// ──────────────────────────────────────────────
// 🎯 Legacy exports
// ──────────────────────────────────────────────
export async function extractSkillsFromJob(jobDescription: string) {
  const result = await generateRoadmapInOneShot(jobDescription);
  if (!result.success) throw new Error(result.error);
  return result.skills;
}

export async function generateLearningRoadmap(skills: any) {
  const result = await generateRoadmapInOneShot(
    skills?.jobTitle || "Developer"
  );
  if (!result.success) throw new Error(result.error);
  return result.roadmap;
}
