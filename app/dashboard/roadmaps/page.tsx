"use client";

import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  Filter,
  Trash2,
  MoreVertical,
  Clock,
  BarChart3,
  BookOpen,
  Share2,
  Download,
} from "lucide-react";

const mockRoadmaps = [
  {
    id: 1,
    title: "MERN Stack Developer Path",
    source: "Local Template",
    difficulty: "Intermediate",
    estimatedDays: 90,
    progress: 75,
    topicsCompleted: 18,
    totalTopics: 24,
    createdAt: "2024-01-15",
    lastModified: "2 hours ago",
    isPublic: true,
  },
  {
    id: 2,
    title: "React Frontend Specialist",
    source: "AI Generated",
    difficulty: "Advanced",
    estimatedDays: 60,
    progress: 45,
    topicsCompleted: 12,
    totalTopics: 27,
    createdAt: "2024-01-10",
    lastModified: "1 day ago",
    isPublic: false,
  },
  {
    id: 3,
    title: "DevOps Engineer Roadmap",
    source: "Local Template",
    difficulty: "Advanced",
    estimatedDays: 120,
    progress: 20,
    topicsCompleted: 5,
    totalTopics: 25,
    createdAt: "2024-01-05",
    lastModified: "3 days ago",
    isPublic: true,
  },
];

export default function RoadmapsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const filteredRoadmaps = mockRoadmaps
    .filter((r) => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(
      (r) =>
        filterDifficulty === "all" ||
        r.difficulty.toLowerCase() === filterDifficulty
    );

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Roadmaps</h1>
          <p className="text-gray-600 mt-1">
            {mockRoadmaps.length} roadmaps created
          </p>
        </div>
        <Link
          href="/create"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
        >
          <PlusCircle className="w-5 h-5" />
          Create New Roadmap
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search roadmaps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="recent">Most Recent</option>
            <option value="progress">Highest Progress</option>
            <option value="name">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Roadmaps Grid */}
      {filteredRoadmaps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
          <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No roadmaps found
          </h2>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? "Try different search terms"
              : "Create your first learning roadmap!"}
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
          >
            <PlusCircle className="w-5 h-5" />
            Create Roadmap
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all group"
            >
              {/* Card Header */}
              <div className="p-6 pb-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          roadmap.source === "Local Template"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {roadmap.source}
                      </span>
                      {roadmap.isPublic && (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                          Public
                        </span>
                      )}
                    </div>
                    <Link href={`/roadmap/${roadmap.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                        {roadmap.title}
                      </h3>
                    </Link>
                  </div>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    {roadmap.difficulty}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {roadmap.estimatedDays}d
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">
                      {roadmap.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all"
                      style={{ width: `${roadmap.progress}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-xs text-gray-500">
                  {roadmap.topicsCompleted}/{roadmap.totalTopics} topics
                  completed
                </p>
              </div>

              {/* Card Footer */}
              <div className="border-t px-6 py-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Modified {roadmap.lastModified}
                </span>
                <div className="flex gap-2">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="Share"
                  >
                    <Share2 className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title="Download"
                  >
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                  <button
                    className="p-2 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
