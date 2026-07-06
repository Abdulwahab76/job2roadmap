"use client";

import { useState, useEffect } from "react";
import { useRoadmapStore } from "@/store/useRoadmapStore";
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

  // Real-time analysis as user types
  useEffect(() => {
    if (jobDescription.length > 10) {
      const analysis = analyzeInput(jobDescription);
      setLiveAnalysis(analysis);

      // Validate when length is sufficient
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
    // Final validation before submit
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
          mode, // Pass the selected mode
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSkills(data.skills);
        setRoadmap(data.roadmap, data.source);
        setStep("roadmap");
      } else {
        setError(data.error || "Something went wrong");

        // If local-only fails, suggest switching mode
        if (data.availableTemplates) {
          setError(`${data.error} (Switch to AI mode for custom generation)`);
        }
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStack = (stack: (typeof QUICK_STACKS)[0]) => {
    setJobDescription(`${stack.name} Developer\n\nSkills: ${stack.desc}`);
    setMode("local-only"); // Quick stacks use local templates
    setError(null);
  };

  const getModeIcon = (m: GenerationMode) => {
    switch (m) {
      case "local-only":
        return <Database className="w-4 h-4" />;
      case "ai-only":
        return <Cloud className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🚀 Job2Roadmap
          </h1>
          <p className="text-gray-600 text-lg">
            Smart learning paths from job descriptions
          </p>
        </div>

        {/* Mode Selector */}
        <div className="mb-4 relative">
          <button
            onClick={() => setShowModeSelector(!showModeSelector)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            {getModeIcon(mode)}
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
                    <div className="font-medium text-sm">{option.label}</div>
                    <div className="text-xs text-gray-600">{option.desc}</div>
                  </div>
                  {mode === option.mode && (
                    <CheckCircle2 className="w-4 h-4 text-purple-600 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stack Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ⚡ Quick Select (Instant - No validation needed):
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
          <div>
            <textarea
              rows={6}
              placeholder="Paste job description or type tech stack...

Examples:
• 'Senior React Developer with TypeScript and GraphQL'
• 'DevOps Engineer: AWS, Docker, Kubernetes, CI/CD'
• 'Python Backend Developer Django PostgreSQL'"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className={`w-full px-4 py-3 border-2 text-black rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none ${
                validation && !validation.isValid
                  ? "border-red-300 bg-red-50"
                  : validation?.isValid
                  ? "border-green-300 bg-green-50"
                  : "border-gray-300"
              }`}
            />

            {/* Live Analysis Bar */}
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-4">
                {liveAnalysis && (
                  <>
                    <span className="text-xs flex items-center gap-1">
                      <BarChart3 className="w-3 h-3" />
                      <span className="font-medium">
                        {liveAnalysis.skillCount}
                      </span>{" "}
                      skills detected
                    </span>
                    {liveAnalysis.category && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                        {liveAnalysis.category}
                      </span>
                    )}
                  </>
                )}
              </div>
              <span
                className={`text-xs ${
                  jobDescription.length > 200
                    ? "text-yellow-600"
                    : "text-gray-500"
                }`}
              >
                {jobDescription.length} characters
              </span>
            </div>

            {/* Validation Messages */}
            {validation && (
              <div className="mt-2 space-y-1">
                {validation.errors.map((err: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-red-600 text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {err}
                  </div>
                ))}
                {validation.warnings.map((warn: string, i: number) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-yellow-600 text-sm"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    {warn}
                  </div>
                ))}
                {validation.isValid && (
                  <div className="flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle2 className="w-4 h-4" />
                    Looks good! {validation.requiredSkills.length} skills
                    detected in {validation.detectedCategory}
                  </div>
                )}
              </div>
            )}

            {/* Suggestions */}
            {liveAnalysis?.suggestions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {liveAnalysis.suggestions.map(
                  (suggestion: string, i: number) => (
                    <div
                      key={i}
                      className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full"
                    >
                      💡 {suggestion}
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Error Display */}
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
            disabled={loading || (validation && !validation.isValid)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                {mode === "local-only" ? (
                  <Zap className="w-5 h-5" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                Generate Roadmap
                {mode === "local-only" && " (Instant)"}
              </>
            )}
          </button>

          {/* Mode Indicator */}
          <p className="text-xs text-center text-gray-500">
            {mode === "auto" &&
              "🔄 Will try local templates first, then use AI if needed"}
            {mode === "local-only" &&
              "📚 Using only pre-built roadmaps - no API calls"}
            {mode === "ai-only" && "🤖 Using AI for custom roadmap generation"}
          </p>
        </div>
      </div>
    </div>
  );
}
