"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/authContext";
import { getUserProgressStats } from "@/lib/progressService";
import { getUserRoadmaps } from "@/lib/roadmaps/roadmapService";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Flame,
  Trophy,
  Loader2,
  Activity,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalInProgress: 0,
    totalRoadmaps: 0,
    completionRate: 0,
  });
  const [recentRoadmaps, setRecentRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [progressStats, roadmaps] = await Promise.all([
        getUserProgressStats(user.uid),
        getUserRoadmaps(user.uid),
      ]);
      setStats(progressStats);
      setRecentRoadmaps(roadmaps?.slice(0, 3) || []);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.displayName?.split(" ")[0] || "Learner"}! 👋
        </h1>
        <p className="text-gray-600 mt-1">Here's your learning overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: BookOpen,
            label: "Roadmaps",
            value: stats.totalRoadmaps,
            color: "text-purple-600",
            bg: "bg-purple-100",
          },
          {
            icon: CheckCircle2,
            label: "Completed",
            value: stats.totalCompleted,
            color: "text-green-600",
            bg: "bg-green-100",
          },
          {
            icon: Activity,
            label: "In Progress",
            value: stats.totalInProgress,
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            icon: TrendingUp,
            label: "Rate",
            value: `${stats.completionRate}%`,
            color: "text-orange-600",
            bg: "bg-orange-100",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all"
          >
            <div className={`p-2 rounded-lg ${stat.bg} inline-block mb-3`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Roadmaps */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-black">
                Active Roadmaps
              </h2>
              <Link
                href="/dashboard/roadmaps"
                className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {recentRoadmaps.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No roadmaps yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first learning roadmap!
                </p>
                <button
                  onClick={() => router.push("/create")}
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
                >
                  <PlusCircle className="w-5 h-5" />
                  Create Roadmap
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentRoadmaps.map((roadmap: any) => (
                  <Link
                    key={roadmap.id}
                    href={`/roadmap/${roadmap.id}`}
                    className="block p-4 rounded-xl border hover:border-purple-200 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">
                        {roadmap.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {new Date(roadmap.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
                        style={{ width: `${stats.completionRate}%` }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push("/create")}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-all"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <PlusCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">New Roadmap</p>
                  <p className="text-xs text-gray-500">Create from job post</p>
                </div>
              </button>
              <button
                onClick={() => router.push("/dashboard/progress")}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition-all"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">View Progress</p>
                  <p className="text-xs text-gray-500">Track learning</p>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
            <Trophy className="w-8 h-8 text-yellow-400 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Keep Learning! 🔥</h3>
            <p className="text-white/80 text-sm">
              {stats.totalCompleted > 0
                ? `You've completed ${stats.totalCompleted} topics! Keep going!`
                : "Start your first roadmap to track progress!"}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
