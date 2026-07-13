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
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

// Custom Roadmap Node Component
function RoadmapNodeComponent({
  data,
  selected,
}: {
  data: any;
  selected: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

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
        relative rounded-xl shadow-lg border-2 p-4 min-w-[250px] max-w-[300px]
        transition-all duration-200 cursor-pointer
        hover:shadow-xl hover:scale-105
        ${getStatusColor()}
        ${selected ? "ring-2 ring-purple-400" : ""}
      `}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Connection Handles */}
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

      {/* Status Badge */}
      <div className="absolute -top-2 -right-2 text-lg">{getStatusBadge()}</div>

      {/* Node Header */}
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
              <span>⏱️</span> {data.duration}
            </p>
          )}

          {data.description && (
            <p className="text-xs text-gray-600 mt-2 line-clamp-2">
              {data.description}
            </p>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      {data.progress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{Math.round(data.progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500"
              style={{ width: `${data.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Expanded Resources */}
      {isExpanded && data.resources && data.resources.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">
            📚 Learning Resources:
          </h4>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {data.resources.map((resource: any, idx: number) => (
              <a
                key={idx}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 text-xs p-2 rounded-lg hover:bg-white bg-gray-50 transition-colors group"
              >
                <span className="text-purple-500">🔗</span>
                <span className="text-purple-600 group-hover:text-purple-800 flex-1 truncate">
                  {resource.name}
                </span>
                <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">
                  {resource.type}
                </span>
                {resource.isFree && (
                  <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">
                    FREE
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Project */}
      {isExpanded && data.project && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-xs font-medium text-yellow-800">💡 Project:</p>
          <p className="text-xs text-yellow-700 mt-0.5">{data.project}</p>
        </div>
      )}
    </div>
  );
}

// Main Canvas Component
export default function RoadmapCanvas({ roadmap }: { roadmap: any }) {
  // Convert roadmap data to React Flow nodes and edges
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (!roadmap?.phases) return { initialNodes: nodes, initialEdges: edges };

    let xPosition = 0;
    const PHASE_SPACING = 350;
    const TOPIC_SPACING = 220;

    roadmap.phases.forEach((phase: any, phaseIndex: number) => {
      // Phase Header Node
      const phaseNode: Node = {
        id: `phase-${phaseIndex}`,
        type: "roadmapNode",
        position: {
          x: xPosition,
          y: 50,
        },
        data: {
          label: phase.phaseTitle,
          duration: phase.duration,
          isPhase: true,
          icon: "📚",
          description: `${phase.topics.length} topics to learn`,
          progress: 0,
          completed: false,
        },
      };
      nodes.push(phaseNode);

      // Topic Nodes for this phase
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
            project: topic.project,
            progress: Math.floor(Math.random() * 100),
            completed: Math.random() > 0.8,
            inProgress: Math.random() > 0.6,
          },
        };
        nodes.push(topicNode);

        // Connect phase to first topic
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
              width: 20,
              height: 20,
            },
          });
        }

        // Connect topics in sequence
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
              width: 20,
              height: 20,
            },
          });
        }
      });

      // Connect last topic of this phase to next phase header
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
            width: 20,
            height: 20,
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

  // Update nodes when roadmap changes
  const onInit = useCallback(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges]);

  return (
    <div className="w-full h-[85vh] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        onInit={onInit}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2}
        defaultEdgeOptions={{
          type: "smoothstep",
        }}
        attributionPosition="bottom-left"
      >
        <Background color="#e5e7eb" gap={20} size={1} />
        <Controls
          className="bg-white shadow-lg rounded-lg border border-gray-200 m-4"
          position="bottom-right"
        />
        <MiniMap
          nodeColor={(node) => {
            if (node.data?.completed) return "#10b981";
            if (node.data?.inProgress) return "#3b82f6";
            if (node.data?.isPhase) return "#9333ea";
            return "#d1d5db";
          }}
          maskColor="rgba(0,0,0,0.1)"
          className="bg-white shadow-lg rounded-lg border border-gray-200 m-4"
          position="bottom-left"
        />
      </ReactFlow>
    </div>
  );
}
