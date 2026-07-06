"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  TrendingUp,
  Target,
  Clock,
  BookOpen,
  Calendar,
  Award,
  Star,
  Flame,
} from "lucide-react";

const skills = [
  { name: "React.js", progress: 85, color: "bg-blue-500" },
  { name: "TypeScript", progress: 70, color: "bg-blue-600" },
  { name: "Node.js", progress: 60, color: "bg-green-500" },
  { name: "MongoDB", progress: 45, color: "bg-green-600" },
  { name: "Docker", progress: 30, color: "bg-blue-400" },
  { name: "AWS", progress: 20, color: "bg-orange-500" },
];

const achievements = [
  {
    icon: Flame,
    title: "7-Day Streak",
    description: "Learned 7 days in a row",
    unlocked: true,
  },
  {
    icon: Target,
    title: "First Roadmap",
    description: "Created your first roadmap",
    unlocked: true,
  },
  {
    icon: BookOpen,
    title: "Bookworm",
    description: "Completed 20 topics",
    unlocked: true,
  },
  {
    icon: Star,
    title: "Rising Star",
    description: "Reached 50% overall progress",
    unlocked: false,
  },
  {
    icon: Award,
    title: "Master",
    description: "Completed a full roadmap",
    unlocked: false,
  },
];

export default function ProgressPage() {
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Learning Progress</h1>
        <p className="text-gray-600 mt-1">
          Track your skill development and achievements
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: BookOpen,
            label: "Topics Done",
            value: "35/120",
            color: "text-purple-600",
            bg: "bg-purple-100",
          },
          {
            icon: Clock,
            label: "Hours Spent",
            value: "47.5h",
            color: "text-blue-600",
            bg: "bg-blue-100",
          },
          {
            icon: Target,
            label: "Completion",
            value: "29%",
            color: "text-green-600",
            bg: "bg-green-100",
          },
          {
            icon: Flame,
            label: "Best Streak",
            value: "7 days",
            color: "text-orange-600",
            bg: "bg-orange-100",
          },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border">
            <div className={`p-2 rounded-lg ${stat.bg} inline-block mb-3`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Skills Progress */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Skills Breakdown
            </h2>
            <div className="space-y-4">
              {skills.map((skill, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-700">
                      {skill.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      {skill.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${skill.color} transition-all duration-500`}
                      style={{ width: `${skill.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Achievements
            </h2>
            <div className="space-y-3">
              {achievements.map((achievement, index) => (
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
                    <p className="text-xs text-gray-500">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked ? (
                    <Award className="w-5 h-5 text-yellow-500" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
