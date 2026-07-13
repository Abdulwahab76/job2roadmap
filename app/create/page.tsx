"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { useRoadmapStore } from "@/store/useRoadmapStore";
import JobInput from "@/components/JobInput";
import RoadmapView from "@/components/canvas/RoadmapView";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

export default function CreatePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { currentStep } = useRoadmapStore();

  // Auth check
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <DashboardLayout>
      {/* Agar roadmap generate ho gaya to Canvas dikhao */}
      {currentStep === "roadmap" ? (
        <RoadmapView />
      ) : (
        /* Nahi to JobInput form dikhao */
        <JobInput />
      )}
    </DashboardLayout>
  );
}
