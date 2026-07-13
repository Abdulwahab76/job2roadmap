"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  useNodesState,
  useEdgesState,
  Position,
  MarkerType,
  Handle,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  X,
  ExternalLink,
  Clock,
  BookOpen,
  Code2,
  Play,
  CheckCircle2,
  Circle,
  Loader2,
  Edit3,
  Save,
} from "lucide-react";
import { useAuth } from "@/context/authContext";
import {
  getRoadmapProgress,
  markNodeComplete,
  markNodeInProgress,
  addNodeNote,
  type ProgressStatus,
} from "@/lib/progressService";
import { useParams } from "next/navigation";

// Custom Node Component
function RoadmapNodeComponent({
  data,
  selected,
}: {
  data: any;
  selected: boolean;
}) {
  const getStatusColor = () => {
    if (data.status === "completed") return "border-green-500 bg-green-50";
    if (data.status === "in_progress") return "border-blue-500 bg-blue-50";
    if (data.isPhase) return "border-purple-500 bg-purple-50";
    return "border-gray-200 bg-white";
  };

  const getStatusBadge = () => {
    if (data.status === "completed") return "✅";
    if (data.status === "in_progress") return "🔄";
    if (data.isPhase) return "📚";
    return "⭕";
  };

  return (
    <div
      className={`
        relative rounded-xl shadow-lg border-2 p-4 min-w-[220px] max-w-[280px]
        transition-all duration-200 cursor-pointer
        hover:shadow-xl hover:scale-105
        ${getStatusColor()}
        ${selected ? "ring-3 ring-purple-400 ring-offset-2" : ""}
      `}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-purple-500 border-2 border-white"
      />

      <div className="absolute -top-2 -right-2 text-lg">{getStatusBadge()}</div>

      <div className="flex items-start gap-3">
        {data.icon && <span className="text-2xl">{data.icon}</span>}
        <div className="flex-1 min-w-0">
          <h3
            className={`font-bold text-sm truncate ${
              data.status === "completed"
                ? "line-through text-gray-500"
                : "text-gray-900"
            }`}
          >
            {data.label}
          </h3>
          {data.duration && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3 flex-shrink-0" /> {data.duration}
            </p>
          )}
        </div>
      </div>

      {data.isPhase && data.progressPercent !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Phase Progress</span>
            <span className="font-medium text-gray-700">
              {data.progressPercent}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
              style={{ width: `${data.progressPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Detail Panel Component
function DetailPanel({
  nodeData,
  nodeId,
  roadmapId,
  onClose,
  onProgressUpdate,
}: {
  nodeData: any;
  nodeId: string;
  roadmapId: string;
  onClose: () => void;
  onProgressUpdate: (
    nodeId: string,
    status: ProgressStatus,
    notes?: string
  ) => Promise<void>;
}) {
  const { user } = useAuth();
  const [notes, setNotes] = useState(nodeData.notes || "");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [saving, setSaving] = useState(false);
  const [localStatus, setLocalStatus] = useState(
    nodeData.status || "not_started"
  );

  // Update local state when nodeData changes
  useEffect(() => {
    setNotes(nodeData.notes || "");
    setLocalStatus(nodeData.status || "not_started");
  }, [nodeData]);

  if (!nodeData) return null;

  const handleMarkComplete = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await onProgressUpdate(nodeId, "completed", notes);
      setLocalStatus("completed");
      setSaving(false);
    } catch (error) {
      setSaving(false);
    }
  };

  const handleMarkInProgress = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await onProgressUpdate(nodeId, "in_progress", notes);
      setLocalStatus("in_progress");
      setSaving(false);
    } catch (error) {
      setSaving(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const newStatus =
        localStatus === "not_started" ? "in_progress" : localStatus;
      await onProgressUpdate(nodeId, newStatus as ProgressStatus, notes);
      if (localStatus === "not_started") setLocalStatus("in_progress");
      setIsEditingNotes(false);
      setSaving(false);
    } catch (error) {
      setSaving(false);
    }
  };

  return (
    <div className="w-96 bg-white border-l border-gray-200 shadow-2xl h-full overflow-y-auto animate-slideIn">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b p-4 flex items-start justify-between z-10">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {nodeData.isPhase ? (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                📚 Phase
              </span>
            ) : (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                📖 Topic
              </span>
            )}
            {localStatus === "completed" && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Completed
              </span>
            )}
            {localStatus === "in_progress" && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                🔄 In Progress
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-900 truncate">
            {nodeData.label}
          </h2>
          {nodeData.duration && (
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <Clock className="w-4 h-4" /> {nodeData.duration}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Status Buttons */}
        {!nodeData.isPhase && (
          <div className="space-y-2">
            {localStatus !== "completed" ? (
              <button
                onClick={handleMarkComplete}
                disabled={saving}
                className="w-full py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Mark as Complete
              </button>
            ) : (
              <button
                onClick={handleMarkInProgress}
                disabled={saving}
                className="w-full py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                Reopen - Mark In Progress
              </button>
            )}
          </div>
        )}

        {/* Description */}
        {nodeData.description && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Description
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {nodeData.description}
            </p>
          </div>
        )}

        {/* Resources */}
        {nodeData.resources && nodeData.resources.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Learning Resources ({nodeData.resources.length})
            </h3>
            <div className="space-y-2">
              {nodeData.resources.map((resource: any, idx: number) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-purple-700 truncate">
                        {resource.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {resource.type}
                        </span>
                        {resource.isFree && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                            🆓 FREE
                          </span>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600 flex-shrink-0" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Project */}
        {nodeData.project && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Code2 className="w-4 h-4" /> Practice Project
            </h3>
            <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Play className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Hands-on Exercise
                </span>
              </div>
              <p className="text-sm text-yellow-700">{nodeData.project}</p>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="pt-4 border-t">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Edit3 className="w-4 h-4" /> My Notes
          </h3>
          {isEditingNotes ? (
            <div className="space-y-2">
              <textarea
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your notes here..."
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-purple-500 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveNotes}
                  disabled={saving}
                  className="flex items-center gap-1 px-3 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Save className="w-3 h-3" />
                  )}
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditingNotes(false);
                    setNotes(nodeData.notes || "");
                  }}
                  className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              {notes ? (
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                  {notes}
                </p>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  No notes yet. Click to add.
                </p>
              )}
              <button
                onClick={() => setIsEditingNotes(true)}
                className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium"
              >
                {notes ? "✏️ Edit Notes" : "➕ Add Note"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Main Canvas
export default function RoadmapCanvas({ roadmap }: { roadmap: any }) {
  const { user } = useAuth();
  const params = useParams();
  const roadmapId = params?.id as string;

  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [completedNodes, setCompletedNodes] = useState<Set<string>>(new Set());
  const [inProgressNodes, setInProgressNodes] = useState<Set<string>>(
    new Set()
  );
  const [nodeNotes, setNodeNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  // Load progress from DB
  useEffect(() => {
    if (user && roadmapId) {
      loadProgress();
    } else {
      setLoading(false);
    }
  }, [user, roadmapId]);

  const loadProgress = async () => {
    if (!user || !roadmapId) return;
    try {
      setLoading(true);
      const progress = await getRoadmapProgress(user.uid, roadmapId);

      const completed = new Set<string>();
      const inProgress = new Set<string>();
      const notes: Record<string, string> = {};

      progress.forEach((p) => {
        if (p.status === "completed") completed.add(p.node_id);
        if (p.status === "in_progress") inProgress.add(p.node_id);
        if (p.notes) notes[p.node_id] = p.notes;
      });

      setCompletedNodes(completed);
      setInProgressNodes(inProgress);
      setNodeNotes(notes);
    } catch (error) {
      console.error("❌ Error loading progress:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Update progress + refresh nodes
  const handleProgressUpdate = async (
    nodeId: string,
    status: ProgressStatus,
    notes?: string
  ) => {
    if (!user || !roadmapId) return;

    try {
      if (status === "completed") {
        await markNodeComplete(user.uid, roadmapId, nodeId);
      } else if (status === "in_progress") {
        await markNodeInProgress(user.uid, roadmapId, nodeId);
      }

      if (notes !== undefined) {
        await addNodeNote(user.uid, roadmapId, nodeId, notes);
      }

      // 🎯 Reload progress to refresh all nodes
      await loadProgress();

      // 🎯 Update selected node in panel
      setSelectedNode((prev: any) => {
        if (!prev) return null;
        return {
          ...prev,
          status,
          notes: notes !== undefined ? notes : prev?.notes,
        };
      });
    } catch (error) {
      console.error("❌ Error updating progress:", error);
    }
  };

  // Generate nodes with REAL progress data
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (!roadmap?.phases) return { initialNodes: nodes, initialEdges: edges };

    let xPosition = 0;
    const PHASE_SPACING = 350;
    const TOPIC_SPACING = 120;

    roadmap.phases.forEach((phase: any, phaseIndex: number) => {
      let phaseCompletedCount = 0;
      const phaseTotalTopics = phase.topics.length;

      nodes.push({
        id: `phase-${phaseIndex}`,
        type: "roadmapNode",
        position: { x: xPosition, y: 10 },
        data: {
          label: phase.phaseTitle,
          duration: phase.duration,
          isPhase: true,
          icon: "📚",
          description: `${phase.topics.length} topics`,
          progressPercent: 0,
        },
      });

      phase.topics.forEach((topic: any, topicIndex: number) => {
        const nodeId = `topic-${phaseIndex}-${topicIndex}`;
        const isCompleted = completedNodes.has(nodeId);
        const isInProgress = inProgressNodes.has(nodeId);

        if (isCompleted) phaseCompletedCount++;

        nodes.push({
          id: nodeId,
          type: "roadmapNode",
          position: { x: xPosition, y: 180 + topicIndex * TOPIC_SPACING },
          data: {
            label: topic.title,
            description: topic.description,
            resources: topic.resources || [],
            project: topic.project || null,
            status: isCompleted
              ? "completed"
              : isInProgress
              ? "in_progress"
              : "not_started",
            notes: nodeNotes[nodeId] || "",
          },
        });

        if (topicIndex === 0) {
          edges.push({
            id: `e-phase-${phaseIndex}-start`,
            source: `phase-${phaseIndex}`,
            target: nodeId,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#9333ea", strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#9333ea" },
          });
        }

        if (topicIndex > 0) {
          edges.push({
            id: `e-${phaseIndex}-${topicIndex - 1}-${topicIndex}`,
            source: `topic-${phaseIndex}-${topicIndex - 1}`,
            target: nodeId,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
            markerEnd: { type: MarkerType.ArrowClosed, color: "#3b82f6" },
          });
        }
      });

      // Update phase progress
      const phaseNode = nodes.find((n) => n.id === `phase-${phaseIndex}`);
      if (phaseNode && phaseTotalTopics > 0) {
        phaseNode.data.progressPercent = Math.round(
          (phaseCompletedCount / phaseTotalTopics) * 100
        );
      }

      // Connect to next phase
      if (phaseIndex < roadmap.phases.length - 1 && phase.topics.length > 0) {
        edges.push({
          id: `e-phase-${phaseIndex}-to-next`,
          source: `topic-${phaseIndex}-${phase.topics.length - 1}`,
          target: `phase-${phaseIndex + 1}`,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#f59e0b", strokeWidth: 3, strokeDasharray: "5,5" },
          markerEnd: { type: MarkerType.ArrowClosed, color: "#f59e0b" },
        });
      }

      xPosition += PHASE_SPACING;
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [roadmap, completedNodes, inProgressNodes, nodeNotes]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // 🎯 Update nodes when progress changes
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges]);

  const nodeTypes = useMemo(() => ({ roadmapNode: RoadmapNodeComponent }), []);

  const onNodeClick = useCallback((event: any, node: Node) => {
    setSelectedNode(node.data);
    setSelectedNodeId(node.id);
    setPanelOpen(true);
  }, []);

  const onPaneClick = useCallback(() => {
    setPanelOpen(false);
    setSelectedNode(null);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[85vh] flex items-center justify-center bg-gray-50 rounded-xl">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[85vh] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 flex">
      <div
        className={`${
          panelOpen ? "w-[calc(100%-384px)]" : "w-full"
        } transition-all duration-300`}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          fitView
          fitViewOptions={{ padding: 0.3 }}
          minZoom={0.3}
          maxZoom={2}
          defaultEdgeOptions={{ type: "smoothstep" }}
          attributionPosition="bottom-left"
        >
          <Background color="#e5e7eb" gap={20} size={1} />
          <Controls
            className="bg-white shadow-lg rounded-lg border text-black border-gray-200 m-4"
            position="bottom-right"
          />
          {/* <MiniMap
            nodeColor={(node) => {
              if (node.data?.status === "completed") return "#10b981";
              if (node.data?.status === "in_progress") return "#3b82f6";
              if (node.data?.isPhase) return "#9333ea";
              return "#d1d5db";
            }}
            maskColor="rgba(0,0,0,0.1)"
            className="bg-white shadow-lg rounded-lg border border-gray-200 m-4"
            position="bottom-left"
          /> */}
        </ReactFlow>
      </div>

      {panelOpen && selectedNode && (
        <DetailPanel
          nodeData={selectedNode}
          nodeId={selectedNodeId}
          roadmapId={roadmapId}
          onClose={() => {
            setPanelOpen(false);
            setSelectedNode(null);
          }}
          onProgressUpdate={handleProgressUpdate}
        />
      )}
    </div>
  );
}
