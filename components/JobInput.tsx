"use client";

import { useState, useEffect } from "react";
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

type GenerationMode = "auto" | "local-only" | "ai-only";

const QUICK_STACKS = [
  {
    name: "MERN Stack",
    desc: "MongoDB + Express + React + Node.js",
    icon: "🟢",
  },
  { name: "React Frontend", desc: "React + TypeScript + Next.js", icon: "⚛️" },
  { name: "Python Backend", desc: "Python + Django + PostgreSQL", icon: "🐍" },
  { name: "DevOps Engineer", desc: "Docker + AWS + CI/CD", icon: "🚀" },
  { name: "Data Scientist", desc: "Python + ML + Pandas", icon: "📊" },
  {
    name: "Mobile Developer",
    desc: "React Native + iOS + Android",
    icon: "📱",
  },
];

export default function JobInput() {
  const { user } = useAuth();
  const router = useRouter();

  const {
    jobDescription,
    setJobDescription,
    setLoading,
    loading,
    setStep,
    setSkills,
    setRoadmap,
    setError,
    error,
  } = useRoadmapStore();

  const [mode, setMode] = useState<GenerationMode>("auto");
  const [validation, setValidation] = useState<any>(null);
  const [liveAnalysis, setLiveAnalysis] = useState<any>(null);
  const [usageCheck, setUsageCheck] = useState(canGenerate(!!user));

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

  const handleGenerate = async () => {
    const check = canGenerate(!!user);
    if (!check.canGenerate) {
      setError(check.message);
      return;
    }

    const finalValidation = validateJobInput(jobDescription);
    if (!finalValidation.isValid) {
      setError(finalValidation.errors.join(" "));
      return;
    }

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
      console.log(data, "daa===");

      if (data.success) {
        incrementUsage(!!user);
        setUsageCheck(canGenerate(!!user));

        setSkills(data.skills);
        setRoadmap(data.roadmap, data.source);

        // 🎯 Smart redirect logic
        if (data.savedId) {
          // Saved to DB successfully - go to ID route
          console.log("✅ Redirecting to /roadmap/" + data.savedId);
          router.push(`/roadmap/${data.savedId}`);
        } else {
          // No savedId - show roadmap directly using store
          console.log("⚠️ No savedId, showing roadmap directly");
          setStep("roadmap");
        }
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStack = (stack: (typeof QUICK_STACKS)[0]) => {
    setJobDescription(`${stack.name} Developer\n\nSkills: ${stack.desc}`);
    setMode("local-only");
    setError(null);
  };

  const remaining = getRemainingGenerations(!!user);

  return (
    <div className="min-h-screen   flex items-center justify-center  ">
      <div className="  w-full   rounded-2xl  ">
        {/* Header with Usage Info */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              🚀 Create Your Roadmap
            </h1>
            <p className="text-gray-600">
              Paste a job description or select a tech stack
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

        {/* Quick Stacks */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            ⚡ Quick Select (Instant - No API):
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {QUICK_STACKS.map((stack, i) => (
              <button
                key={i}
                onClick={() => handleQuickStack(stack)}
                className="text-left bg-white p-3 border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{stack.icon}</span>
                  <span className="font-medium text-sm text-gray-800">
                    {stack.name}
                  </span>
                </div>
                <p className="text-xs text-gray-600">{stack.desc}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-sm text-gray-500">
            OR paste job description
          </span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* Input Area */}
        <div className="space-y-4">
          <textarea
            rows={8}
            placeholder="Paste job description here...

Example:
Senior React Developer
Requirements: React, TypeScript, Next.js, Node.js
Experience: 5+ years..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all ${
              validation && !validation.isValid
                ? "border-red-300 bg-red-50"
                : validation?.isValid
                ? "border-green-300 bg-green-50"
                : "border-gray-300"
            }`}
          />

          {/* Live Analysis */}
          {liveAnalysis && (
            <div className="flex items-center gap-4 text-sm">
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
                  Ready to generate! {validation.requiredSkills.length} skills
                  found
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
                <p className="text-red-600 text-sm">{error}</p>
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
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Your Roadmap...
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
              ? "🔄 Auto mode: Tries local first, uses AI if needed"
              : mode === "local-only"
              ? "📚 Local only: Instant results, no API calls"
              : "🤖 AI mode: Custom generation for unique jobs"}
          </p>
        </div>
      </div>
    </div>
  );
}
