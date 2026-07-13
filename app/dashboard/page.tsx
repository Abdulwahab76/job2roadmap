"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/authContext";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Zap,
  Star,
  Calendar,
  CheckCircle2,
  BarChart3,
  Activity,
  Flame,
  Trophy,
} from "lucide-react";

const mockStats = {
  totalRoadmaps: 5,
  completedTopics: 23,
  hoursLearned: 47,
  streak: 7,
};

const recentRoadmaps = [
  {
    id: 1,
    title: "MERN Stack Developer",
    progress: 75,
    lastAccessed: "2 hours ago",
    phase: "Backend with Node.js",
  },
  {
    id: 2,
    title: "React Frontend Specialist",
    progress: 45,
    lastAccessed: "1 day ago",
    phase: "State Management",
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <DashboardLayout>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.displayName?.split(" ")[0] || "Learner"}! 👋
        </h1>
        <p className="text-gray-600 mt-1">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: BookOpen,
            label: "Roadmaps",
            value: mockStats.totalRoadmaps,
            color: "text-purple-600",
            bg: "bg-purple-100",
          },
          {
            icon: CheckCircle2,
            label: "Completed",
            value: mockStats.completedTopics,
            color: "text-green-600",
            bg: "bg-green-100",
          },
          {
            icon: Clock,
            label: "Hours Learned",
            value: mockStats.hoursLearned,
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            icon: Flame,
            label: "Day Streak",
            value: mockStats.streak,
            color: "text-orange-600",
            bg: "bg-orange-100",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Roadmaps */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Active Roadmaps</h2>
              <Link
                href="/dashboard/roadmaps"
                className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentRoadmaps.map((roadmap) => (
                <div
                  key={roadmap.id}
                  className="p-4 rounded-xl border hover:border-purple-200 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{roadmap.title}</h3>
                      <p className="text-sm text-gray-500">{roadmap.phase}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium">
                        {roadmap.progress}%
                      </span>
                      <p className="text-xs text-gray-500">
                        {roadmap.lastAccessed}
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
                      style={{ width: `${roadmap.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              {recentRoadmaps.length === 0 && (
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
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Create Roadmap
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => router.push("/create")}
                className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-all group"
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
                  <p className="text-xs text-gray-500">Track your learning</p>
                </div>
              </button>
            </div>
          </div>

          {/* Achievement */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
            <Trophy className="w-8 h-8 text-yellow-400 mb-3" />
            <h3 className="font-semibold text-lg mb-1">Keep Learning! 🔥</h3>
            <p className="text-white/80 text-sm">
              Create roadmaps to unlock achievements.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
