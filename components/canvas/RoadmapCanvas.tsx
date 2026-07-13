"use client";

import { useCallback, useMemo, useState } from "react";
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
} from "lucide-react";

// Custom Roadmap Node Component (Simplified - no inner expand)
function RoadmapNodeComponent({
  data,
  selected,
}: {
  data: any;
  selected: boolean;
}) {
  const getStatusColor = () => {
    if (data.completed) return "border-green-500 bg-green-50";
    if (data.inProgress) return "border-blue-500 bg-blue-50";
    if (data.isPhase) return "border-purple-500 bg-purple-50";
    return "border-gray-200 bg-white";
  };

  const getStatusBadge = () => {
    if (data.completed) return "✅";
    if (data.inProgress) return "🔄";
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
        <div className="flex-1">
          <h3
            className={`font-bold text-sm ${
              data.completed ? "line-through text-gray-500" : "text-gray-900"
            }`}
          >
            {data.label}
          </h3>
          {data.duration && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {data.duration}
            </p>
          )}
        </div>
      </div>

      {data.progress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500">Progress</span>
            <span className="font-medium text-gray-700">
              {Math.round(data.progress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
              style={{ width: `${data.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// 🎯 Right Side Panel Component
function DetailPanel({
  nodeData,
  onClose,
}: {
  nodeData: any;
  onClose: () => void;
}) {
  if (!nodeData) return null;

  return (
    <div className="w-96 bg-white border-l border-gray-200 shadow-2xl h-full overflow-y-auto animate-slideIn">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b p-4 flex items-start justify-between z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {nodeData.isPhase ? (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                Phase
              </span>
            ) : (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                Topic
              </span>
            )}
            {nodeData.completed && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Completed
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{nodeData.label}</h2>
          {nodeData.duration && (
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
              <Clock className="w-4 h-4" /> {nodeData.duration}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Description */}
        {nodeData.description && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Description
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {nodeData.description}
            </p>
          </div>
        )}

        {/* Progress */}
        {nodeData.progress !== undefined && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Progress
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className="h-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600"
                  style={{ width: `${nodeData.progress}%` }}
                />
              </div>
              <span className="text-sm font-bold text-gray-700">
                {Math.round(nodeData.progress)}%
              </span>
            </div>
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
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-purple-700">
                        {resource.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {resource.type}
                        </span>
                        {resource.isFree && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                            FREE
                          </span>
                        )}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-purple-600" />
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
              <Code2 className="w-4 h-4" />
              Practice Project
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

        {/* Action Buttons */}
        <div className="space-y-2 pt-4 border-t">
          <button className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
            Mark as Complete
          </button>
          <button className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Canvas Component
export default function RoadmapCanvas({ roadmap }: { roadmap: any }) {
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (!roadmap?.phases) return { initialNodes: nodes, initialEdges: edges };

    let xPosition = 0;
    const PHASE_SPACING = 350;
    const TOPIC_SPACING = 120;

    roadmap.phases.forEach((phase: any, phaseIndex: number) => {
      // Phase Header Node
      nodes.push({
        id: `phase-${phaseIndex}`,
        type: "roadmapNode",
        position: { x: xPosition, y: 10 },
        data: {
          label: phase.phaseTitle,
          duration: phase.duration,
          isPhase: true,
          icon: "📚",
          description: `This phase contains ${phase.topics.length} topics to master`,
          progress: 0,
          completed: false,
          resources: [],
          project: null,
        },
      });

      // Topic Nodes
      phase.topics.forEach((topic: any, topicIndex: number) => {
        const topicNode: Node = {
          id: `topic-${phaseIndex}-${topicIndex}`,
          type: "roadmapNode",
          position: {
            x: xPosition,
            y: 180 + topicIndex * TOPIC_SPACING,
          },
          data: {
            label: topic.title,
            description: topic.description,
            resources: topic.resources || [],
            project: topic.project || null,
            progress: Math.floor(Math.random() * 100),
            completed: Math.random() > 0.8,
            inProgress: Math.random() > 0.6,
          },
        };
        nodes.push(topicNode);

        if (topicIndex === 0) {
          edges.push({
            id: `e-phase-${phaseIndex}-start`,
            source: `phase-${phaseIndex}`,
            target: `topic-${phaseIndex}-${topicIndex}`,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#9333ea", strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#9333ea",
            },
          });
        }

        if (topicIndex > 0) {
          edges.push({
            id: `e-${phaseIndex}-${topicIndex - 1}-${topicIndex}`,
            source: `topic-${phaseIndex}-${topicIndex - 1}`,
            target: `topic-${phaseIndex}-${topicIndex}`,
            type: "smoothstep",
            animated: true,
            style: { stroke: "#3b82f6", strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "#3b82f6",
            },
          });
        }
      });

      if (phaseIndex < roadmap.phases.length - 1) {
        const lastTopicIndex = phase.topics.length - 1;
        edges.push({
          id: `e-phase-${phaseIndex}-to-${phaseIndex + 1}`,
          source: `topic-${phaseIndex}-${lastTopicIndex}`,
          target: `phase-${phaseIndex + 1}`,
          type: "smoothstep",
          animated: true,
          style: { stroke: "#f59e0b", strokeWidth: 3, strokeDasharray: "5,5" },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: "#f59e0b",
          },
        });
      }

      xPosition += PHASE_SPACING;
    });

    return { initialNodes: nodes, initialEdges: edges };
  }, [roadmap]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = useMemo(
    () => ({
      roadmapNode: RoadmapNodeComponent,
    }),
    []
  );

  // 🎯 Handle node click - open right panel
  const onNodeClick = useCallback((event: any, node: Node) => {
    setSelectedNode(node.data);
    setPanelOpen(true);
  }, []);

  // 🎯 Handle pane click - close panel
  const onPaneClick = useCallback(() => {
    setPanelOpen(false);
    setSelectedNode(null);
  }, []);

  return (
    <div className="w-full h-[85vh] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 flex space-x-5">
      {/* Canvas Area */}
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
              if (node.data?.completed) return "#10b981";
              if (node.data?.inProgress) return "#3b82f6";
              if (node.data?.isPhase) return "#9333ea";
              return "#d1d5db";
            }}
            maskColor="rgba(0,0,0,0.1)"
            className="bg-white shadow-lg rounded-lg border border-gray-200 m-4"
            position="bottom-left"
          /> */}
        </ReactFlow>
      </div>

      {/* 🎯 Right Side Panel */}
      {panelOpen && selectedNode && (
        <DetailPanel
          nodeData={selectedNode}
          onClose={() => {
            setPanelOpen(false);
            setSelectedNode(null);
          }}
        />
      )}
    </div>
  );
}
