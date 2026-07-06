"use client"

import { useRoadmapStore } from "@/store/useRoadmapStore";
import { useState } from "react";
import {
  CheckCircle,
  Circle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Zap,
  Globe,
} from "lucide-react";

export default function RoadmapView() {
  const { extractedSkills, roadmap, source, setStep } = useRoadmapStore();
  const [expandedPhases, setExpandedPhases] = useState<number[]>([0]);
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  const togglePhase = (index: number) => {
    setExpandedPhases((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const toggleTopic = (phaseIndex: number, topicIndex: number) => {
    const key = `${phaseIndex}-${topicIndex}`;
    setProgress((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateProgress = () => {
    let total = 0;
    let completed = 0;

    roadmap?.phases?.forEach((phase: any, phaseIndex: number) => {
      phase.topics.forEach((_: any, topicIndex: number) => {
        total++;
        if (progress[`${phaseIndex}-${topicIndex}`]) completed++;
      });
    });

    return {
      total,
      completed,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  };

  const stats = calculateProgress();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <button
                onClick={() => setStep("input")}
                className="text-purple-600 text-sm mb-4 hover:underline flex items-center gap-1"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-800">
                  {roadmap?.title || "Your Learning Roadmap"}
                </h1>
                {source && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      source === "local"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {source === "local" ? (
                      <>
                        <Zap className="w-3 h-3" /> Instant
                      </>
                    ) : (
                      <>
                        <Globe className="w-3 h-3" /> AI Generated
                      </>
                    )}
                  </span>
                )}
              </div>
              <p className="text-gray-600 mt-2">
                ⏱️ {roadmap?.estimatedDays} days • 📊 {roadmap?.difficulty}
              </p>
            </div>

            {/* Progress Circle */}
            <div className="text-center">
              <div className="relative w-24 h-24">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    className="stroke-current text-gray-200"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="44"
                    className="stroke-current text-purple-600"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${stats.percentage * 2.76} 276`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="text-2xl font-bold text-purple-600">
                    {stats.percentage}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {stats.completed}/{stats.total} topics
              </p>
            </div>
          </div>
        </div>

        {/* Learning Phases */}
        <div className="space-y-4">
          {roadmap?.phases?.map((phase: any, phaseIndex: number) => (
            <div
              key={phaseIndex}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <button
                onClick={() => togglePhase(phaseIndex)}
                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                    {phaseIndex + 1}
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-semibold text-gray-800">
                      {phase.phaseTitle}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      ⏱️ {phase.duration} • {phase.topics.length} topics
                    </p>
                  </div>
                </div>
                {expandedPhases.includes(phaseIndex) ? (
                  <ChevronUp className="w-6 h-6 text-gray-400" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-gray-400" />
                )}
              </button>

              {expandedPhases.includes(phaseIndex) && (
                <div className="px-6 pb-6 space-y-4">
                  {phase.topics.map((topic: any, topicIndex: number) => {
                    const key = `${phaseIndex}-${topicIndex}`;
                    const isCompleted = progress[key];

                    return (
                      <div
                        key={topicIndex}
                        className={`border rounded-xl p-4 transition-all ${
                          isCompleted
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200 hover:border-purple-200"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => toggleTopic(phaseIndex, topicIndex)}
                            className="mt-1"
                          >
                            {isCompleted ? (
                              <CheckCircle className="w-6 h-6 text-green-500" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-300 hover:text-purple-500" />
                            )}
                          </button>

                          <div className="flex-1">
                            <h4
                              className={`font-semibold text-lg ${
                                isCompleted
                                  ? "text-gray-500 line-through"
                                  : "text-gray-800"
                              }`}
                            >
                              {topic.title}
                            </h4>
                            <p className="text-gray-600 text-sm mt-1">
                              {topic.description}
                            </p>

                            {topic.resources && topic.resources.length > 0 && (
                              <div className="mt-3 space-y-2">
                                <h5 className="text-sm font-medium text-gray-700">
                                  📚 Resources:
                                </h5>
                                <div className="grid gap-2">
                                  {topic.resources.map(
                                    (resource: any, resIndex: number) => (
                                      <a
                                        key={resIndex}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-white transition-colors"
                                      >
                                        <ExternalLink className="w-4 h-4 text-purple-600" />
                                        <span className="text-purple-600 flex-1">
                                          {resource.name}
                                        </span>
                                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
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

                            {topic.project && (
                              <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <span className="text-sm font-medium text-yellow-800">
                                  💡 Project:
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
      </div>
    </div>
  );
}
