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
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  X,
  Database,
  Cloud,
  Globe,
  Crown,
  Clock,
} from "lucide-react";
import { analyzeInput, validateJobInput } from "@/lib/validator";

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
  const [showModeSelector, setShowModeSelector] = useState(false);
  const [usageCheck, setUsageCheck] = useState(canGenerate(!!user));

  // Update usage check when user changes
  useEffect(() => {
    setUsageCheck(canGenerate(!!user));
  }, [user]);

  // Real-time analysis as user types
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
    // Check usage limits first
    const check = canGenerate(!!user);
    if (!check.canGenerate) {
      setError(check.message);
      return;
    }

    // Validate input
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

      if (data.success) {
        // Increment usage counter
        incrementUsage(!!user);
        setUsageCheck(canGenerate(!!user));

        setSkills(data.skills);
        setRoadmap(data.roadmap, data.source);
        setStep("roadmap");
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
    <div className="min-h-screen  flex items-center justify-center ">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Header with Usage Info */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              🚀 Job2Roadmap
            </h1>
            <p className="text-gray-600 text-lg">
              Smart learning paths from job descriptions
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

        {/* Usage Limit Warning */}
        {usageCheck.remainingToday === 0 && usageCheck.tier !== "pro" && (
          <div className="mb-6">
            <UsageLimit variant="inline" />
          </div>
        )}

        {/* Only show input if user can generate */}
        {usageCheck.canGenerate || usageCheck.tier === "pro" ? (
          <>
            {/* Mode Selector */}
            <div className="mb-4 relative">
              <button
                onClick={() => setShowModeSelector(!showModeSelector)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                {mode === "auto" ? (
                  <Globe className="w-4 h-4" />
                ) : mode === "local-only" ? (
                  <Database className="w-4 h-4" />
                ) : (
                  <Cloud className="w-4 h-4" />
                )}
                <span className="font-medium">
                  {mode === "auto"
                    ? "Auto (Local + AI)"
                    : mode === "local-only"
                    ? "Local Only (Instant)"
                    : "AI Only (Custom)"}
                </span>
                <span className="text-gray-500">▼</span>
              </button>

              {showModeSelector && (
                <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-10 w-64">
                  {[
                    {
                      mode: "auto" as GenerationMode,
                      label: "Auto Mode",
                      desc: "Try local first, fallback to AI",
                      icon: Globe,
                    },
                    {
                      mode: "local-only" as GenerationMode,
                      label: "Local Only",
                      desc: "Instant results, no API calls",
                      icon: Database,
                    },
                    {
                      mode: "ai-only" as GenerationMode,
                      label: "AI Only",
                      desc: "Custom generation for unique jobs",
                      icon: Cloud,
                    },
                  ].map((option, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setMode(option.mode);
                        setShowModeSelector(false);
                      }}
                      className={`w-full text-left p-3 hover:bg-gray-50 flex items-start gap-3 ${
                        mode === option.mode ? "bg-purple-50" : ""
                      }`}
                    >
                      <option.icon className="w-5 h-5 mt-0.5 text-purple-600" />
                      <div>
                        <div className="font-medium text-sm">
                          {option.label}
                        </div>
                        <div className="text-xs text-gray-600">
                          {option.desc}
                        </div>
                      </div>
                      {mode === option.mode && (
                        <CheckCircle2 className="w-4 h-4 text-purple-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Stacks */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ⚡ Quick Select (No API calls needed):
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {QUICK_STACKS.map((stack, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickStack(stack)}
                    className="text-left p-3 border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all group"
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
                rows={6}
                placeholder="Paste job description or type tech stack..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                  validation && !validation.isValid
                    ? "border-red-300 bg-red-50"
                    : validation?.isValid
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300"
                }`}
              />

              {/* Validation Messages */}
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
                      Ready to generate!
                    </div>
                  )}
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-red-700 font-medium">
                      Cannot Generate Roadmap
                    </p>
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
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Roadmap
                    {usageCheck.tier !== "pro" &&
                      ` (${usageCheck.remainingToday} left)`}
                  </>
                )}
              </button>
            </div>
          </>
        ) : (
          /* Show only usage limit card if no generations left */
          <div className="py-8">
            <UsageLimit variant="card" />
          </div>
        )}
      </div>
    </div>
  );
}
