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
    <main className="min-h-screen">
      <Navbar />
      <HeroSection onGetStarted={() => setShowGenerator(true)} />
      <FeaturesSection />
      <HowItWorks />
      <Footer />
    </main>
  );
}
