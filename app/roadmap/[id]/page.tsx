"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

// 🎯 FIXED: Correct import path
import {
  getRoadmapById,
  type SavedRoadmap,
} from "@/lib/roadmaps/roadmapService";

import { useRoadmapStore } from "@/store/useRoadmapStore";
import RoadmapView from "@/components/canvas/RoadmapView";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function RoadmapPage() {
  const params = useParams();
  const router = useRouter();
  const { setSkills, setRoadmap, setStep } = useRoadmapStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const roadmapId = params.id as string;

  useEffect(() => {
    if (roadmapId) {
      loadRoadmap();
    }
  }, [roadmapId]);

  const loadRoadmap = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🔍 Loading roadmap:", roadmapId);
      const saved = await getRoadmapById(roadmapId);

      if (!saved) {
        setError("Roadmap not found");
        return;
      }

      console.log("✅ Roadmap loaded:", saved.title);
      console.log("📦 Phases:", saved.phases);

      // 🎯 Extract skills from phases (since no skills column)
      const extractedSkills = {
        jobTitle: saved.title,
        requiredSkills: extractSkillsFromPhases(saved.phases),
        niceToHaveSkills: [],
        tools: [],
        experienceLevel: saved.difficulty_level || "intermediate",
        keyResponsibilities: [],
      };

      // Set skills in store
      setSkills(extractedSkills);

      // Set roadmap in store
      setRoadmap(
        {
          title: saved.title,
          difficulty: saved.difficulty_level || "intermediate",
          estimatedDays: saved.estimated_days || 30,
          phases: saved.phases || [],
        },
        "local" // Default source since no source column
      );

      // 🎯 Trigger roadmap view
      setStep("roadmap");
    } catch (error) {
      console.error("❌ Error loading roadmap:", error);
      setError("Failed to load roadmap");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to extract skills from phases
  const extractSkillsFromPhases = (phases: any): string[] => {
    if (!phases || !Array.isArray(phases)) return [];

    const skills = new Set<string>();

    phases.forEach((phase: any) => {
      if (phase.topics) {
        phase.topics.forEach((topic: any) => {
          if (topic.title) {
            // Extract technology names from topic titles
            const words = topic.title
              .replace(/[^a-zA-Z0-9.#+\s]/g, "")
              .split(/\s+/)
              .filter(
                (w: string) =>
                  w.length > 2 &&
                  ![
                    "and",
                    "the",
                    "with",
                    "for",
                    "basics",
                    "fundamentals",
                    "mastery",
                    "advanced",
                  ].includes(w.toLowerCase())
              );

            words.forEach((word: string) => skills.add(word));
          }
        });
      }
    });

    return Array.from(skills).slice(0, 10); // Max 10 skills
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading roadmap...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <p className="text-red-600 text-xl mb-4">{error}</p>
          <button
            onClick={() => router.push("/dashboard/roadmaps")}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mx-auto bg-purple-50 px-4 py-2 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Roadmaps
          </button>
        </div>
      </div>
    );
  }

  // 🎯 Show Canvas Roadmap View
  return <RoadmapView />;
}
