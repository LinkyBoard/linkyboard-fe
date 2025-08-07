import { create } from "zustand";

export interface ContentItem {
  id: number;
  title: string;
  description: string;
  type: "web" | "youtube" | "pdf" | "note";
  date: string;
  x?: number;
  y?: number;
}

export interface Topic {
  id: number;
  title: string;
  description: string;
  contents: ContentItem[];
  x?: number;
  y?: number;
  createdAt: string;
}

// 드래그 가능한 아이템을 위한 유니온 타입
export type DraggableItem = ContentItem | Topic;

interface TopicStore {
  topics: Topic[];
  showNewTopicModal: boolean;
  editingTopic: Topic | null;
  setEditingTopic: (topic: Topic | null) => void;
  setShowNewTopicModal: (show: boolean) => void;
  // TODO: API 요청으로 CRUD
  addTopic: (topic: Topic) => void;
  updateTopic: (topic: Topic) => void;
  deleteTopic: (topicId: number) => void;
  getTopicById: (id: number) => Topic | undefined;
  // TODO: API 요청으로 가져오기
  getRecentTopics: (limit?: number) => Topic[];
}

// 미리 정의된 토픽 데이터
const predefinedTopics: Topic[] = [
  {
    id: 1,
    title: "사용자 클러스터링과 하이브리드 콘텐츠 추천 시스템",
    description: "사용자 콘텐츠 추천 엔진 제작 과정",
    x: 50,
    y: 50,
    contents: [
      {
        id: 101,
        title: "사용자 행동 분석",
        description: "사용자의 클릭, 스크롤, 체류 시간 등을 분석하여 패턴을 파악합니다.",
        type: "web",
        date: "2024-03-15",
        x: 200,
        y: 200,
      },
      {
        id: 102,
        title: "협업 필터링 알고리즘",
        description: "유사한 사용자 그룹을 찾아 추천하는 방법론",
        type: "pdf",
        date: "2024-03-10",
        x: 400,
        y: 200,
      },
    ],
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    title: "AI 기반 디자인 시스템",
    description: "AI를 활용한 디자인 자동화",
    x: 50,
    y: 50,
    contents: [
      {
        id: 201,
        title: "디자인 토큰 시스템",
        description: "색상, 타이포그래피, 간격 등을 체계적으로 관리하는 시스템",
        type: "web",
        date: "2024-03-12",
        x: 200,
        y: 200,
      },
      {
        id: 202,
        title: "AI 컴포넌트 생성",
        description: "설계 명세를 바탕으로 자동으로 컴포넌트를 생성하는 AI",
        type: "youtube",
        date: "2024-03-08",
        x: 400,
        y: 200,
      },
    ],
    createdAt: "2024-01-20T14:30:00Z",
  },
  {
    id: 3,
    title: "프로덕트 관리 워크플로우",
    description: "효율적인 프로젝트 관리 방법",
    x: 50,
    y: 50,
    contents: [
      {
        id: 301,
        title: "애자일 방법론",
        description: "빠른 반복과 지속적인 개선을 통한 프로젝트 관리",
        type: "web",
        date: "2024-03-14",
        x: 200,
        y: 200,
      },
      {
        id: 302,
        title: "스크럼 프레임워크",
        description: "팀 기반의 애자일 개발 방법론",
        type: "pdf",
        date: "2024-03-09",
        x: 400,
        y: 200,
      },
    ],
    createdAt: "2024-01-25T09:15:00Z",
  },
];

export const useTopicStore = create<TopicStore>((set, get) => ({
  topics: predefinedTopics,

  showNewTopicModal: false,
  setShowNewTopicModal: (show: boolean) => {
    set({ showNewTopicModal: show });
  },

  editingTopic: null,
  setEditingTopic: (topic: Topic | null) => {
    set({ editingTopic: topic });
  },

  addTopic: (topic: Topic) => {
    set((state) => ({
      topics: [topic, ...state.topics],
    }));
  },

  updateTopic: (topic: Topic) => {
    set((state) => ({
      topics: state.topics.map((t) => (t.id === topic.id ? topic : t)),
    }));
  },

  deleteTopic: (topicId: number) => {
    set((state) => ({
      topics: state.topics.filter((t) => t.id !== topicId),
    }));
  },

  getTopicById: (id: number) => {
    return get().topics.find((topic) => topic.id === id);
  },

  getRecentTopics: (limit = 5) => {
    const topics = get().topics;
    // 생성일 기준으로 정렬하여 최근 토픽 반환
    return topics
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  },
}));
