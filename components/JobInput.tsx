"use client";

import { useState, useEffect, useMemo } from "react";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import { useAuth } from "@/context/authContext";
import {
  canGenerate,
  incrementUsage,
  getRemainingGenerations,
} from "@/lib/usageTracker";
import UsageLimit from "@/components/UsageLimit";
import {
  Sparkles,
  Loader2,
  Zap,
  Search,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  X,
  Database,
  Cloud,
  Globe,
  Crown,
  ArrowLeft,
} from "lucide-react";
import { analyzeInput, validateJobInput } from "@/lib/validator";
import { useRouter } from "next/navigation";
import { ALL_STACKS } from "@/lib/stackData";
import ErrorDisplay, { ErrorData } from "./ErrorDisplay";

type GenerationMode = "auto" | "local-only" | "ai-only";

export default function JobInput() {
  const { user } = useAuth();
  const router = useRouter();
  const {
    jobDescription,
    setJobDescription,
    setLoading,
    loading,
    setSkills,
    setRoadmap,
  } = useRoadmapStore();

  const [mode, setMode] = useState<GenerationMode>("auto");
  const [validation, setValidation] = useState<any>(null);
  const [liveAnalysis, setLiveAnalysis] = useState<any>(null);
  const [usageCheck, setUsageCheck] = useState(canGenerate(!!user));
  const [selectedStack, setSelectedStack] = useState<string>("");
  const [error, setError] = useState<ErrorData | null>(null);

  useEffect(() => {
    setUsageCheck(canGenerate(!!user));
  }, [user]);

  useEffect(() => {
    if (jobDescription.length > 10) {
      const analysis = analyzeInput(jobDescription);
      setLiveAnalysis(analysis);

      if (jobDescription.length >= 20) {
        const result = validateJobInput(jobDescription);
        setValidation(result);
      } else {
        setValidation(null);
      }
    } else {
      setLiveAnalysis(null);
      setValidation(null);
    }
  }, [jobDescription]);

  // 🎯 DYNAMIC QUICK STACKS - Filter based on typed text
  const dynamicStacks = useMemo(() => {
    if (jobDescription.length < 3) {
      // Show top 6 default stacks
      return ALL_STACKS.slice(0, 6);
    }

    const lowerInput = jobDescription.toLowerCase();

    // Score each stack based on keyword match
    const scored = ALL_STACKS.map((stack) => {
      let score = 0;
      stack.keywords.forEach((keyword) => {
        if (lowerInput.includes(keyword)) score += 1;
      });
      // Bonus for name match
      if (lowerInput.includes(stack.name.toLowerCase())) score += 3;
      return { ...stack, score };
    });

    // Sort by score (highest first)
    scored.sort((a, b) => b.score - a.score);

    // Return top 6 matching stacks
    const topStacks = scored.filter((s) => s.score > 0).slice(0, 6);

    // If no matches, show default
    if (topStacks.length === 0) {
      return ALL_STACKS.slice(0, 6);
    }

    return topStacks;
  }, [jobDescription]);

  const handleGenerate = async () => {
    const check = canGenerate(!!user);

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          mode,
          userId: user?.uid || "anonymous",
        }),
      });

      const data = await response.json();

      // 🎯 ERROR HANDLING
      if (!data.success) {
        // Custom error messages based on error type
        if (data.error?.includes("quota") || data.error?.includes("exceeded")) {
          setError({
            type: "quota",
            title: "API Quota Exceeded ⚠️",
            message: "Daily limit reached. You can:",
            actions: [
              {
                label: "Add Your API Key",
                href: "/dashboard/settings",
                icon: "🔑",
              },
              {
                label: "Try Local Templates",
                action: () => setMode("local-only"),
                icon: "📚",
              },
              { label: "Try Again Tomorrow", action: () => {}, icon: "⏰" },
            ],
          });
        } else if (
          data.error?.includes("API key") ||
          data.error?.includes("Invalid")
        ) {
          setError({
            type: "key",
            title: "Invalid API Key 🔑",
            message: "Your API key is invalid or expired.",
            actions: [
              {
                label: "Update API Key",
                href: "/dashboard/settings",
                icon: "⚙️",
              },
              {
                label: "Use App Key (if available)",
                action: () => setMode("auto"),
                icon: "🔄",
              },
            ],
          });
        } else if (
          data.error?.includes("timeout") ||
          data.error?.includes("timed out")
        ) {
          setError({
            type: "timeout",
            title: "Request Timeout ⏰",
            message: "The AI took too long to respond. Please try again.",
            actions: [
              { label: "Try Again", action: handleGenerate, icon: "🔄" },
              {
                label: "Use Local Templates",
                action: () => setMode("local-only"),
                icon: "📚",
              },
            ],
          });
        } else if (data.noLocalMatch) {
          setError({
            type: "no_match",
            title: "No Template Found 📚",
            message:
              "No local template matches. Try different keywords or AI mode.",
            actions: [
              {
                label: "Try AI Mode",
                action: () => setMode("ai-only"),
                icon: "🤖",
              },
              { label: "Use Different Keywords", action: () => {}, icon: "✏️" },
            ],
          });
        } else {
          setError({
            type: "general",
            title: "Generation Failed ❌",
            message: data.error || "Something went wrong. Please try again.",
            actions: [
              { label: "Try Again", action: handleGenerate, icon: "🔄" },
            ],
          });
        }
        return;
      }
      if (data.errorType === "user_quota") {
        setError({
          type: "user_quota",
          title: "⚡ Your API Key Quota Exceeded",
          message: "Your personal API key has reached its daily limit.",
          actions: [
            {
              label: "🗑️ Remove Your API Key (Use App Key)",
              action: async () => {
                // Revoke user's key
                await fetch("/api/revoke-my-key", {
                  method: "POST",
                  body: JSON.stringify({ userId: user?.uid }),
                });
                // Retry with app key
                setMode("auto");
                handleGenerate();
              },
              icon: "🗑️",
            },
            {
              label: "📚 Use Local Templates",
              action: () => setMode("local-only"),
              icon: "📚",
            },
            {
              label: "🔑 Add New API Key",
              href: "/dashboard/settings",
              icon: "🔑",
            },
          ],
        });
        return;
      }
      // 🎯 USER API KEY INVALID
      if (data.errorType === "user_key_invalid") {
        setError({
          type: "user_key_invalid",
          title: "🔑 Your API Key is Invalid",
          message:
            "Your saved API key is invalid or expired. Remove it or update with a new one.",
          actions: [
            {
              label: "🗑️ Remove Key (Use App)",
              action: async () => {
                await fetch("/api/revoke-my-key", {
                  method: "POST",
                  body: JSON.stringify({ userId: user?.uid }),
                });
                setMode("auto");
                handleGenerate();
              },
              icon: "🗑️",
            },
            {
              label: "⚙️ Update API Key",
              href: "/dashboard/settings",
              icon: "⚙️",
            },
          ],
        });
        return;
      }

      // 🎯 APP QUOTA EXCEEDED
      if (data.errorType === "app_quota") {
        setError({
          type: "app_quota",
          title: "⚡ App API Quota Exceeded",
          message:
            "The app's daily limit is reached. Add your own API key to continue.",
          actions: [
            {
              label: "🔑 Add Your API Key",
              href: "/dashboard/settings",
              icon: "🔑",
            },
            {
              label: "📚 Use Local Templates",
              action: () => setMode("local-only"),
              icon: "📚",
            },
          ],
        });
        return;
      }
      // ✅ Success
      incrementUsage(!!user);
      setUsageCheck(canGenerate(!!user));
      setSkills(data.skills);
      setRoadmap(data.roadmap, data.source);

      if (data.savedId) {
        router.push(`/roadmap/${data.savedId}`);
      }
    } catch (error) {
      setError({
        type: "network",
        title: "Network Error 🌐",
        message: "Check your internet connection and try again.",
        actions: [{ label: "Try Again", action: handleGenerate, icon: "🔄" }],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStack = (stack: (typeof ALL_STACKS)[0]) => {
    setJobDescription(
      `${stack.name} Developer\n\nSkills: ${
        stack.desc
      }\nKeywords: ${stack.keywords.join(", ")}`
    );
    setSelectedStack(stack.name);
    setMode("local-only");
    setError(null);
  };

  const remaining = getRemainingGenerations(!!user);
  {
    /* Error Display - JobInput mein textarea ke neeche */
  }
  console.log(error?.message, "erorr");

  {
    error && <ErrorDisplay error={error} onDismiss={() => setError(null)} />;
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            🚀 Create Your Roadmap
          </h1>
          <p className="text-gray-600 mt-1">
            Select a stack or paste a job description
          </p>
        </div>

        {/* Usage Badge */}
        <div
          className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${
            usageCheck.remainingToday === Infinity
              ? "bg-purple-100 text-purple-700"
              : usageCheck.remainingToday > 0
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {usageCheck.tier === "pro" ? (
            <Crown className="w-4 h-4" />
          ) : (
            <Zap className="w-4 h-4" />
          )}
          {usageCheck.tier === "pro"
            ? "Unlimited"
            : `${usageCheck.remainingToday} left today`}
        </div>
      </div>

      {/* 🎯 DYNAMIC QUICK STACKS */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          ⚡{" "}
          {jobDescription.length >= 3
            ? "Matching Stacks"
            : "Popular Tech Stacks"}{" "}
          (Instant - No API):
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {dynamicStacks.map((stack, i) => (
            <button
              key={i}
              onClick={() => handleQuickStack(stack)}
              className={`text-left bg-white p-3 border-2 rounded-lg transition-all ${
                selectedStack === stack.name
                  ? "border-purple-500 bg-purple-50 shadow-md"
                  : "border-gray-200 hover:border-purple-400 hover:bg-purple-50"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{stack.icon}</span>
                <span className="font-medium text-sm text-gray-800">
                  {stack.name}
                </span>
              </div>
              <p className="text-xs text-gray-600">{stack.desc}</p>
              {/* Show match score if typing */}
              {jobDescription.length >= 3 && (stack as any).score > 0 && (
                <div className="mt-1 flex items-center gap-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-1">
                    <div
                      className="h-1 rounded-full bg-green-500"
                      style={{
                        width: `${Math.min(
                          100,
                          ((stack as any).score / 5) * 100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-green-600 font-medium">
                    {Math.round(((stack as any).score / 5) * 100)}%
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-200"></div>
        <span className="text-sm text-gray-500">OR paste job description</span>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>

      {/* Input Area */}
      <div className="space-y-4">
        <textarea
          rows={6}
          placeholder="Paste job description or type tech stack...

Examples:
• 'Senior React Developer with TypeScript and GraphQL'
• 'DevOps Engineer: AWS, Docker, Kubernetes, CI/CD'
• 'Python Backend Developer Django PostgreSQL'"
          value={jobDescription}
          onChange={(e) => {
            setJobDescription(e.target.value);
            setSelectedStack(""); // Reset selected stack when typing
          }}
          className={`w-full px-4 py-3 border-2 rounded-xl text-black focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all bg-white ${
            validation && !validation.isValid
              ? "border-red-300"
              : validation?.isValid
              ? "border-green-300"
              : "border-gray-300"
          }`}
        />

        {/* Live Analysis */}
        {liveAnalysis && (
          <div className="flex items-center gap-4 text-sm flex-wrap">
            <span className="flex items-center gap-1 text-gray-600">
              <BarChart3 className="w-4 h-4" />
              <span className="font-medium">
                {liveAnalysis.skillCount}
              </span>{" "}
              skills detected
            </span>
            {liveAnalysis.category && (
              <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs">
                {liveAnalysis.category}
              </span>
            )}
            {liveAnalysis.suggestions.length > 0 && (
              <span className="text-xs text-blue-600">
                💡 {liveAnalysis.suggestions[0]}
              </span>
            )}
          </div>
        )}

        {/* Validation */}
        {validation && (
          <div className="space-y-1">
            {validation.errors.map((err: string, i: number) => (
              <div
                key={i}
                className="flex items-center gap-2 text-red-600 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {err}
              </div>
            ))}
            {validation.isValid && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                Ready! {validation.requiredSkills.length} skills found in{" "}
                {validation.detectedCategory}
              </div>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-700 font-medium">Cannot Generate</p>
              <ErrorDisplay error={error} onDismiss={() => setError(null)} />
            </div>
            <button onClick={() => setError(null)}>
              <X className="w-4 h-4 text-red-400" />
            </button>
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={
            loading ||
            (validation && !validation.isValid) ||
            !usageCheck.canGenerate
          }
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Learning Roadmap
              {usageCheck.tier !== "pro" &&
                ` (${usageCheck.remainingToday} left)`}
            </>
          )}
        </button>

        <p className="text-xs text-center text-gray-500">
          {mode === "auto"
            ? "🔄 Auto: Local first, AI if needed"
            : mode === "local-only"
            ? "📚 Local only: Instant, no API"
            : "🤖 AI mode: Custom generation"}
        </p>
      </div>
    </div>
  );
}
