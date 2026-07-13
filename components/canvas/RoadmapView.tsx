"use client";

import { useState } from "react";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import dynamic from "next/dynamic";
import {
  Layout,
  List,
  GitBranch,
  Download,
  Share2,
  ArrowLeft,
  Zap,
  Globe,
  Maximize2,
  Minimize2,
  Clock,
  BarChart3,
  CheckCircle2,
  Circle,
} from "lucide-react";

// Dynamic import for canvas (heavy component)
const RoadmapCanvas = dynamic(
  () => import("@/components/canvas/RoadmapCanvas"),
  {
    loading: () => (
      <div className="w-full h-[85vh] flex items-center justify-center bg-gray-50 rounded-xl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Canvas...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

type ViewMode = "canvas" | "list" | "timeline";

export default function RoadmapView() {
  const { extractedSkills, roadmap, source, setStep } = useRoadmapStore();
  const [viewMode, setViewMode] = useState<ViewMode>("canvas");
  const [fullscreen, setFullscreen] = useState(false);
  const [showStats, setShowStats] = useState(true);

  if (!roadmap) return null;

  // Calculate stats
  const totalTopics =
    roadmap.phases?.reduce(
      (acc: number, phase: any) => acc + phase.topics.length,
      0
    ) || 0;
  const totalPhases = roadmap.phases?.length || 0;
  const estimatedDays = roadmap.estimatedDays || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-full mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Left Section */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setStep("input")}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">
                  Back
                </span>
              </button>

              <div className="h-6 w-px bg-gray-200" />

              <div>
                <h1 className="text-lg font-bold text-gray-900 truncate max-w-[300px] lg:max-w-[500px]">
                  {roadmap.title}
                </h1>
                <div className="flex items-center gap-2">
                  {source && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
                        source === "local" || source === "cache"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {source === "local" && (
                        <>
                          <Zap className="w-3 h-3" /> Local Template
                        </>
                      )}
                      {source === "cache" && (
                        <>
                          <Globe className="w-3 h-3" /> Cached
                        </>
                      )}
                      {source === "ai" && <>🤖 AI Generated</>}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {totalPhases} phases • {totalTopics} topics •{" "}
                    {estimatedDays} days
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Controls */}
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {[
                  {
                    mode: "canvas" as ViewMode,
                    icon: GitBranch,
                    label: "Canvas",
                  },
                  { mode: "list" as ViewMode, icon: List, label: "List" },
                  {
                    mode: "timeline" as ViewMode,
                    icon: Layout,
                    label: "Timeline",
                  },
                ].map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                      viewMode === mode
                        ? "bg-white shadow-sm text-purple-600"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    title={`${label} View`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline">{label}</span>
                  </button>
                ))}
              </div>

              <div className="h-6 w-px bg-gray-200" />

              {/* Action Buttons */}
              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                title="Share Roadmap"
              >
                <Share2 className="w-4 h-4 text-gray-600" />
              </button>

              <button
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                title="Download as PDF"
              >
                <Download className="w-4 h-4 text-gray-600" />
              </button>

              <button
                onClick={() => setFullscreen(!fullscreen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                title={fullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {fullscreen ? (
                  <Minimize2 className="w-4 h-4 text-gray-600" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Skills Summary Bar */}
      {extractedSkills && showStats && (
        <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-xs font-medium text-gray-500">
              Required Skills:
            </span>
            {extractedSkills.requiredSkills
              ?.slice(0, 8)
              .map((skill: string, i: number) => (
                <span
                  key={i}
                  className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium"
                >
                  {skill}
                </span>
              ))}
            {extractedSkills.requiredSkills?.length > 8 && (
              <span className="text-xs text-gray-500">
                +{extractedSkills.requiredSkills.length - 8} more
              </span>
            )}
            <button
              onClick={() => setShowStats(false)}
              className="ml-auto text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div
        className={fullscreen ? "fixed inset-0 top-14 z-40 bg-gray-50" : "p-4"}
      >
        {viewMode === "canvas" && <RoadmapCanvas roadmap={roadmap} />}
        {viewMode === "list" && <ListView roadmap={roadmap} />}
        {viewMode === "timeline" && <TimelineView roadmap={roadmap} />}
      </div>
    </div>
  );
}

// List View Component
function ListView({ roadmap }: { roadmap: any }) {
  const [expandedPhases, setExpandedPhases] = useState<number[]>([0]);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(
    new Set()
  );

  const toggleTopic = (phaseIndex: number, topicIndex: number) => {
    const key = `${phaseIndex}-${topicIndex}`;
    const newCompleted = new Set(completedTopics);
    if (newCompleted.has(key)) {
      newCompleted.delete(key);
    } else {
      newCompleted.add(key);
    }
    setCompletedTopics(newCompleted);
  };

  const togglePhase = (index: number) => {
    setExpandedPhases((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-8">
      {roadmap.phases?.map((phase: any, phaseIndex: number) => (
        <div
          key={phaseIndex}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Phase Header */}
          <button
            onClick={() => togglePhase(phaseIndex)}
            className="w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                {phaseIndex + 1}
              </div>
              <div className="text-left">
                <h3 className="text-lg font-semibold text-gray-900">
                  {phase.phaseTitle}
                </h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  ⏱️ {phase.duration} • {phase.topics.length} topics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                {
                  phase.topics.filter((_: any, i: number) =>
                    completedTopics.has(`${phaseIndex}-${i}`)
                  ).length
                }
                /{phase.topics.length}
              </span>
              <span
                className={`transform transition-transform ${
                  expandedPhases.includes(phaseIndex) ? "rotate-180" : ""
                }`}
              >
                ▼
              </span>
            </div>
          </button>

          {/* Phase Topics */}
          {expandedPhases.includes(phaseIndex) && (
            <div className="px-5 pb-5 space-y-3">
              {phase.topics.map((topic: any, topicIndex: number) => {
                const topicKey = `${phaseIndex}-${topicIndex}`;
                const isCompleted = completedTopics.has(topicKey);

                return (
                  <div
                    key={topicIndex}
                    className={`p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? "border-green-200 bg-green-50"
                        : "border-gray-200 bg-gray-50 hover:border-purple-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTopic(phaseIndex, topicIndex)}
                        className="mt-0.5 transition-transform hover:scale-110"
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-300" />
                        )}
                      </button>

                      <div className="flex-1">
                        <h4
                          className={`font-semibold ${
                            isCompleted
                              ? "text-gray-500 line-through"
                              : "text-gray-900"
                          }`}
                        >
                          {topic.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {topic.description}
                        </p>

                        {/* Resources */}
                        {topic.resources && topic.resources.length > 0 && (
                          <div className="mt-3">
                            <h5 className="text-xs font-medium text-gray-700 mb-2">
                              📚 Resources:
                            </h5>
                            <div className="space-y-1.5">
                              {topic.resources.map(
                                (resource: any, resIdx: number) => (
                                  <a
                                    key={resIdx}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-white transition-colors group"
                                  >
                                    <span className="text-purple-500">🔗</span>
                                    <span className="text-purple-600 group-hover:text-purple-800 flex-1 text-sm">
                                      {resource.name}
                                    </span>
                                    <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                                      {resource.type}
                                    </span>
                                    {resource.isFree && (
                                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                                        FREE
                                      </span>
                                    )}
                                  </a>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Project */}
                        {topic.project && (
                          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <span className="text-sm font-medium text-yellow-800">
                              💡 Practice Project:
                            </span>
                            <p className="text-sm text-yellow-700 mt-1">
                              {topic.project}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Timeline View Component
function TimelineView({ roadmap }: { roadmap: any }) {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 md:left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-400 to-blue-400" />

        <div className="space-y-12">
          {roadmap.phases?.map((phase: any, phaseIndex: number) => (
            <div key={phaseIndex} className="relative pl-16 md:pl-24">
              {/* Timeline Node */}
              <div className="absolute left-4 md:left-8 w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm">
                {phaseIndex + 1}
              </div>

              {/* Phase Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 ml-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {phase.phaseTitle}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      ⏱️ {phase.duration}
                    </p>
                  </div>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {phase.topics.length} topics
                  </span>
                </div>

                <div className="space-y-4">
                  {phase.topics.map((topic: any, topicIndex: number) => (
                    <div
                      key={topicIndex}
                      className="flex items-start gap-3 pl-4 border-l-2 border-purple-200"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {topic.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {topic.description}
                        </p>
                        {topic.resources && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {topic.resources
                              .slice(0, 3)
                              .map((r: any, i: number) => (
                                <a
                                  key={i}
                                  href={r.url}
                                  target="_blank"
                                  className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded hover:bg-purple-100"
                                >
                                  📚 {r.name}
                                </a>
                              ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
