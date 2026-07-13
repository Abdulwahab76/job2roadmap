"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/authContext";
import { getUserProgressStats } from "@/lib/progressService";
import { getUserRoadmaps } from "@/lib/roadmaps/roadmapService";
import {
  TrendingUp,
  Target,
  Clock,
  BookOpen,
  CheckCircle2,
  Flame,
  Award,
  Star,
  Loader2,
  BarChart3,
  Activity,
} from "lucide-react";
import Link from "next/link";

export default function ProgressPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalInProgress: 0,
    totalRoadmaps: 0,
    completionRate: 0,
  });
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const [progressStats, userRoadmaps] = await Promise.all([
        getUserProgressStats(user.uid),
        getUserRoadmaps(user.uid),
      ]);
      setStats(progressStats);
      setRoadmaps(userRoadmaps || []);
    } catch (error) {
      console.error("Error loading progress:", error);
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
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learning Progress</h1>
        <p className="text-gray-600 mt-1">
          Track your skill development across all roadmaps
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: BookOpen,
            label: "Total Roadmaps",
            value: stats.totalRoadmaps,
            color: "text-purple-600",
            bg: "bg-purple-100",
          },
          {
            icon: CheckCircle2,
            label: "Topics Completed",
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
            icon: Target,
            label: "Completion Rate",
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
        {/* Roadmap Progress List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Your Roadmaps
            </h2>

            {roadmaps.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No roadmaps yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first roadmap to start tracking progress!
                </p>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
                >
                  Create Roadmap
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {roadmaps.map((roadmap: any) => (
                  <Link
                    key={roadmap.id}
                    href={`/roadmap/${roadmap.id}`}
                    className="block p-4 rounded-xl border hover:border-purple-200 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {roadmap.title}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {roadmap.difficulty_level} • {roadmap.estimated_days}{" "}
                          days
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(roadmap.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
                        style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Achievements & Tips */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-yellow-500" />
              Achievements
            </h2>
            <div className="space-y-3">
              {[
                {
                  icon: Flame,
                  title: "First Steps",
                  desc: "Complete your first topic",
                  unlocked: stats.totalCompleted > 0,
                },
                {
                  icon: Target,
                  title: "Roadmap Creator",
                  desc: "Create your first roadmap",
                  unlocked: stats.totalRoadmaps > 0,
                },
                {
                  icon: BookOpen,
                  title: "Knowledge Seeker",
                  desc: "Complete 10 topics",
                  unlocked: stats.totalCompleted >= 10,
                },
                {
                  icon: Star,
                  title: "Halfway There",
                  desc: "Reach 50% completion",
                  unlocked: stats.completionRate >= 50,
                },
                {
                  icon: Award,
                  title: "Master",
                  desc: "Complete a full roadmap",
                  unlocked: stats.completionRate >= 100,
                },
              ].map((achievement, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    achievement.unlocked
                      ? "bg-gray-50"
                      : "bg-gray-100 opacity-50"
                  }`}
                >
                  <achievement.icon
                    className={`w-8 h-8 ${
                      achievement.unlocked ? "text-yellow-500" : "text-gray-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        achievement.unlocked ? "text-gray-900" : "text-gray-500"
                      }`}
                    >
                      {achievement.title}
                    </p>
                    <p className="text-xs text-gray-500">{achievement.desc}</p>
                  </div>
                  {achievement.unlocked ? (
                    <Award className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tip */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
            <TrendingUp className="w-8 h-8 text-yellow-400 mb-3" />
            <h3 className="font-semibold text-lg mb-1">💡 Pro Tip</h3>
            <p className="text-white/80 text-sm">
              Focus on completing one phase at a time. Mark topics as complete
              to track your progress!
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
