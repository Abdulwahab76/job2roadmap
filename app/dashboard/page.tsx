"use client";

import { useState } from "react";
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

// Mock data - Replace with real data from Supabase
const mockStats = {
  totalRoadmaps: 5,
  completedTopics: 23,
  hoursLearned: 47,
  streak: 7,
  completionRate: 68,
};

const recentRoadmaps = [
  {
    id: 1,
    title: "MERN Stack Developer",
    progress: 75,
    lastAccessed: "2 hours ago",
    phase: "Backend with Node.js",
    color: "from-green-500 to-emerald-500",
  },
  {
    id: 2,
    title: "React Frontend Specialist",
    progress: 45,
    lastAccessed: "1 day ago",
    phase: "State Management",
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    title: "DevOps Engineer",
    progress: 20,
    lastAccessed: "3 days ago",
    phase: "Linux Basics",
    color: "from-orange-500 to-red-500",
  },
];

const weeklyActivity = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3.0 },
  { day: "Wed", hours: 1.5 },
  { day: "Thu", hours: 4.0 },
  { day: "Fri", hours: 2.0 },
  { day: "Sat", hours: 5.0 },
  { day: "Sun", hours: 1.0 },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "year">("week");

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
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
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
        {/* Recent Roadmaps */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Active Roadmaps
              </h2>
              <Link
                href="/dashboard/roadmaps"
                className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {recentRoadmaps.map((roadmap) => (
                <Link
                  key={roadmap.id}
                  href={`/roadmap/${roadmap.id}`}
                  className="block p-4 rounded-xl border border-gray-100 hover:border-purple-200 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 bg-gradient-to-br ${roadmap.color} rounded-lg flex items-center justify-center`}
                      >
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {roadmap.title}
                        </h3>
                        <p className="text-sm text-gray-500">{roadmap.phase}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {roadmap.progress}%
                      </span>
                      <p className="text-xs text-gray-500">
                        {roadmap.lastAccessed}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-gradient-to-r ${roadmap.color} transition-all duration-500`}
                      style={{ width: `${roadmap.progress}%` }}
                    ></div>
                  </div>
                </Link>
              ))}
            </div>

            {recentRoadmaps.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  No roadmaps yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Create your first learning roadmap to get started!
                </p>
                <Link
                  href="/create"
                  className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <PlusCircle className="w-5 h-5" />
                  Create Roadmap
                </Link>
              </div>
            )}
          </div>

          {/* Weekly Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Learning Activity
              </h2>
              <div className="flex gap-2">
                {(["week", "month", "year"] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      timeRange === range
                        ? "bg-purple-100 text-purple-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-end gap-2 h-48">
              {weeklyActivity.map((day) => {
                const maxHours = Math.max(
                  ...weeklyActivity.map((d) => d.hours)
                );
                const height = (day.hours / maxHours) * 100;

                return (
                  <div
                    key={day.day}
                    className="flex-1 flex flex-col items-center gap-2"
                  >
                    <span className="text-xs font-medium text-gray-600">
                      {day.hours}h
                    </span>
                    <div
                      className="w-full bg-gray-100 rounded-t-lg overflow-hidden"
                      style={{ height: "160px" }}
                    >
                      <div
                        className="w-full bg-gradient-to-t from-purple-600 to-blue-600 rounded-t-lg transition-all duration-500 mt-auto"
                        style={{
                          height: `${height}%`,
                          marginTop: `${100 - height}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">{day.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href="/create"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors group"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <PlusCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">New Roadmap</p>
                  <p className="text-xs text-gray-500">Create from job post</p>
                </div>
              </Link>

              <Link
                href="/dashboard/progress"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-green-50 transition-colors group"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">View Progress</p>
                  <p className="text-xs text-gray-500">Track your learning</p>
                </div>
              </Link>

              <Link
                href="/dashboard/saved"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-yellow-50 transition-colors group"
              >
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Star className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Saved Jobs</p>
                  <p className="text-xs text-gray-500">Bookmarked positions</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Achievement */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
            <Trophy className="w-8 h-8 text-yellow-400 mb-3" />
            <h3 className="font-semibold text-lg mb-1">7-Day Streak! 🔥</h3>
            <p className="text-white/80 text-sm mb-4">
              You're on fire! Keep learning to maintain your streak.
            </p>
            <div className="flex gap-1">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="w-4 h-4 bg-yellow-400 rounded-sm"></div>
              ))}
            </div>
          </div>

          {/* Today's Tip */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">💡 Pro Tip</h3>
            <p className="text-sm text-gray-600">
              Break your learning into 25-minute sessions with 5-minute breaks.
              This Pomodoro technique boosts focus and retention!
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
