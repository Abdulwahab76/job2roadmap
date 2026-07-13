"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { useAuth } from "@/context/authContext";
import {
  getUserRoadmaps,
  deleteRoadmap,
  toggleRoadmapVisibility,
  type SavedRoadmap,
} from "@/lib/roadmaps/roadmapService";
import Link from "next/link";
import {
  PlusCircle,
  Search,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  BarChart3,
  ExternalLink,
  Loader2,
} from "lucide-react";

export default function MyRoadmapsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [roadmaps, setRoadmaps] = useState<SavedRoadmap[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (user) {
      loadRoadmaps();
    }
  }, [user]);

  const loadRoadmaps = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const data = await getUserRoadmaps(user.uid);
      setRoadmaps(data);
    } catch (error) {
      console.error("Error loading roadmaps:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(roadmaps, "roadmaps");

  const handleDelete = async (id: string) => {
    if (!user || !confirm("Delete this roadmap?")) return;
    try {
      await deleteRoadmap(id, user.uid);
      setRoadmaps((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleToggleVisibility = async (
    id: string,
    currentVisibility: boolean
  ) => {
    if (!user) return;
    try {
      await toggleRoadmapVisibility(id, user.uid, !currentVisibility);
      setRoadmaps((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, is_public: !currentVisibility } : r
        )
      );
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const filteredRoadmaps = roadmaps.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Roadmaps</h1>
            <p className="text-gray-600 mt-1">
              {roadmaps.length} roadmaps created
            </p>
          </div>
          <button
            onClick={() => router.push("/create")}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all"
          >
            <PlusCircle className="w-5 h-5" />
            Create New
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search roadmaps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Roadmaps List */}
      {loading ? (
        <div className="text-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading roadmaps...</p>
        </div>
      ) : filteredRoadmaps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border">
          <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No roadmaps yet
          </h2>
          <p className="text-gray-500 mb-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoadmaps.map((roadmap) => (
            <div
              key={roadmap.id}
              className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          roadmap.source === "local"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {roadmap.source === "local" ? "⚡ Local" : "🤖 AI"}
                      </span>
                      {roadmap.is_public ? (
                        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                          Public
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                          Private
                        </span>
                      )}
                    </div>

                    {/* 🎯 ID-Based Link */}
                    <Link href={`/roadmap/${roadmap.id}`}>
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                        {roadmap.title}
                      </h3>
                    </Link>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4" />
                    {roadmap.difficulty_level || "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {roadmap.estimated_days || 0}d
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  Created {new Date(roadmap.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Actions */}
              <div className="border-t px-6 py-3 flex items-center justify-between">
                <Link
                  href={`/roadmap/${roadmap.id}`}
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  <ExternalLink className="w-4 h-4" />
                  View
                </Link>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleToggleVisibility(roadmap.id, roadmap.is_public)
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg"
                    title={roadmap.is_public ? "Make Private" : "Make Public"}
                  >
                    {roadmap.is_public ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(roadmap.id)}
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
