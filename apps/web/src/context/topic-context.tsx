import { createContext } from "react";

import type { Connection, Edge, Node, OnEdgesChange, OnNodesChange } from "@xyflow/react";

interface TopicContextProps {
  isLoading: boolean;
  isTopicError: boolean;
  isNotFoundError: boolean;
  id: string;
  nodes: Node[];
  edges: Edge[];
  selectedNodeIds: string[];
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: (params: Connection) => void;
  onEdgeClick: (e: React.MouseEvent, edge: Edge) => void;
  onNodeSelect: (nodeId: string) => void;
  onResetSelectedNodeIds: () => void;
}

export const TopicContext = createContext<TopicContextProps | null>(null);
