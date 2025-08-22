import { dummyEdges, dummyNodes, dummyTopics } from "@/constants/dummy-data";
import { TopicDTO } from "@/models/topic";
import { StickerType } from "@/types/topic";
import { CategoryContentDTO } from "@repo/types";
import { Edge, Node } from "@xyflow/react";

import { create } from "zustand";

export const useTopicStore = create<TopicStore>((set) => ({
  topics: dummyTopics,
  contents: {
    nodes: dummyNodes,
    edges: dummyEdges,
  },
  setTopics: (topics) => set({ topics }),
  addTopic: (topic: TopicDTO) => set((state) => ({ topics: [...state.topics, topic] })),
  removeNode: (id: number) =>
    set((state) => ({
      contents: {
        nodes: state.contents.nodes.filter(
          (node) => (node.data as { item: CategoryContentDTO | TopicDTO }).item.id !== id
        ),
        edges: state.contents.edges,
      },
    })),
  addNode: (type: StickerType, item: CategoryContentDTO | TopicDTO) =>
    set((state) => ({
      contents: {
        nodes: [
          ...state.contents.nodes,
          {
            id: `${type}-${item.id}`,
            data: {
              item,
              nodeContent: type,
            },
            position: { x: 0, y: 0 },
            measured: { height: 0, width: 0 },
            type: "custom",
          },
        ],
        edges: state.contents.edges,
      },
    })),
  addEdges: (edges: Edge[]) =>
    set((state) => ({
      contents: {
        nodes: state.contents.nodes,
        edges: [...state.contents.edges, ...edges],
      },
    })),
}));

interface TopicStore {
  topics: TopicDTO[];
  contents: {
    nodes: Node[];
    edges: Edge[];
  };
  setTopics: (topics: TopicDTO[]) => void;
  addTopic: (topic: TopicDTO) => void;
  removeNode: (id: number) => void;
  addNode: (type: StickerType, item: CategoryContentDTO | TopicDTO) => void;
  addEdges: (edges: Edge[]) => void;
}
