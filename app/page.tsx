"use client";

import { useState } from "react";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import JobInput from "@/components/JobInput";
import RoadmapView from "@/components/RoadmapView";
import ScrollTrail from "@/components/Scrolltrail";

export default function Home() {
  const { currentStep } = useRoadmapStore();
  const [showGenerator, setShowGenerator] = useState(false);

  // If user is on roadmap view (after generation)
  if (currentStep === "roadmap") {
    return <RoadmapView />;
  }

  // If user clicked "Get Started" or "Create Roadmap"
  if (showGenerator || currentStep === "skills") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20">
          <JobInput />
        </div>
      </div>
    );
  }

  // Default Landing Page
  return (
    <main className="relative bg-[#0A0E1A]">
      {/* Traces the route from the hero through how-it-works. */}
      <div className="relative">
        <Navbar />
        <ScrollTrail />
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
      </div>
      <Footer />
    </main>
  );
}
