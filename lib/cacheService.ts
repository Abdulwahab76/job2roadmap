import { supabase } from "./supabase";

const db = supabase;

// 🎯 Generate normalized hash (case-insensitive, punctuation removed)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s#+.-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// 🎯 Extract key skills from text
function extractKeyPhrases(text: string): string[] {
  const stopWords = [
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "as",
    "is",
    "was",
    "are",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "shall",
    "can",
    "need",
    "dare",
    "ought",
    "used",
    "we",
    "you",
    "they",
    "our",
  ];

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.includes(w));
}

// 🎯 Check cache with fuzzy matching
export async function checkCache(jobDescription: string): Promise<any | null> {
  try {
    const normalized = normalizeText(jobDescription);
    const keyPhrases = extractKeyPhrases(jobDescription);

    console.log("🔍 Checking cache...");

    // Step 1: Exact match
    const { data: exactMatch } = await db
      .from("cached_roadmaps")
      .select("*")
      .eq("normalized_input", normalized)
      .single();

    if (exactMatch) {
      console.log("✅ Exact cache hit!");
      await incrementCacheAccess(exactMatch.id);
      return {
        skills: exactMatch.skills,
        roadmap: exactMatch.roadmap,
        source: "cache",
      };
    }

    // Step 2: Partial match (at least 60% keywords match)
    if (keyPhrases.length >= 3) {
      const { data: partialMatches } = await db
        .from("cached_roadmaps")
        .select("*")
        .order("access_count", { ascending: false })
        .limit(20);

      if (partialMatches) {
        for (const cached of partialMatches) {
          const cachedPhrases = extractKeyPhrases(
            cached.normalized_input || ""
          );
          const matchCount = keyPhrases.filter((p) =>
            cachedPhrases.includes(p)
          ).length;
          const totalPhrases = Math.max(
            keyPhrases.length,
            cachedPhrases.length
          );
          const matchPercent = totalPhrases > 0 ? matchCount / totalPhrases : 0;

          if (matchPercent >= 0.6) {
            console.log(
              `🟡 Partial cache hit! (${Math.round(matchPercent * 100)}% match)`
            );
            await incrementCacheAccess(cached.id);
            return {
              skills: cached.skills,
              roadmap: cached.roadmap,
              source: "cache",
            };
          }
        }
      }
    }

    console.log("❌ No cache match found");
    return null;
  } catch (error) {
    console.error("❌ Cache check error:", error);
    return null;
  }
}

// 🎯 Save to cache
export async function saveToCache(
  jobDescription: string,
  skills: any,
  roadmap: any,
  source: string
): Promise<void> {
  try {
    const normalized = normalizeText(jobDescription);
    const keyPhrases = extractKeyPhrases(jobDescription);

    // Check if already exists
    const { data: existing } = await db
      .from("cached_roadmaps")
      .select("id")
      .eq("normalized_input", normalized)
      .single();

    if (existing) {
      // Update existing
      await db
        .from("cached_roadmaps")
        .update({
          access_count: (existing as any).access_count
            ? (existing as any).access_count + 1
            : 1,
          last_accessed: new Date().toISOString(),
        })
        .eq("id", existing.id);

      console.log("✅ Cache updated!");
    } else {
      // Insert new
      const { error } = await db.from("cached_roadmaps").insert({
        normalized_input: normalized,
        key_phrases: keyPhrases,
        job_title: skills?.jobTitle || "Untitled",
        skills: skills,
        roadmap: roadmap,
        source: source,
        access_count: 1,
        last_accessed: new Date().toISOString(),
      });

      if (error) {
        console.error("❌ Cache save error:", error.message);
      } else {
        console.log("✅ Saved to cache!");
      }
    }
  } catch (error) {
    console.error("❌ Cache save error:", error);
  }
}

// 🎯 Increment cache access count (FIXED)
async function incrementCacheAccess(id: string): Promise<void> {
  try {
    // First get current count
    const { data: current } = await db
      .from("cached_roadmaps")
      .select("access_count")
      .eq("id", id)
      .single();

    const newCount = (current?.access_count || 0) + 1;

    // Update with new count
    await db
      .from("cached_roadmaps")
      .update({
        access_count: newCount,
        last_accessed: new Date().toISOString(),
      })
      .eq("id", id);
  } catch (error) {
    console.error("❌ Increment error:", error);
  }
}

// 🎯 Clear old cache entries (optional cleanup)
export async function clearOldCache(daysOld: number = 30): Promise<void> {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const { error } = await db
      .from("cached_roadmaps")
      .delete()
      .lt("last_accessed", cutoffDate.toISOString());

    if (error) {
      console.error("❌ Cleanup error:", error);
    } else {
      console.log(`✅ Cleared cache older than ${daysOld} days`);
    }
  } catch (error) {
    console.error("❌ Cleanup error:", error);
  }
}
