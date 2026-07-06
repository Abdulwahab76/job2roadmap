"use client";

import { useRoadmapStore } from "@/store/useRoadmapStore";
import JobInput from "@/components/JobInput";
import RoadmapView from "@/components/RoadmapView";

export default function Home() {
  const { currentStep } = useRoadmapStore();

  return (
    <>
      {currentStep === "input" && <JobInput />}
      {currentStep === "roadmap" && <RoadmapView />}
    </>
  );
}
