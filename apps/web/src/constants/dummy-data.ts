import { CategoryContentDTO, ContentType } from "@repo/types";
import { Node } from "@xyflow/react";

export const dummyContents = [
  {
    id: 1,
    thumbnail: "",
    title: "React 18의 새로운 기능들",
    summary: "React 18에서 도입된 새로운 기능들과 개선사항들을 살펴봅니다.",
    tags: ["react", "javascript", "frontend"],
    type: "WEB" as ContentType,
    url: "https://ko.react.dev/",
    memo: "성능 개선이 핵심",
    category: "프로그래밍",
  },
  {
    id: 2,
    thumbnail: "",
    title: "TypeScript 완벽 가이드",
    summary: "TypeScript의 모든 기능을 체계적으로 학습할 수 있는 가이드입니다.",
    tags: ["typescript", "javascript", "programming"],
    type: "WEB" as ContentType,
    url: "https://www.typescriptlang.org/",
    memo: "기본부터 고급까지",
    category: "프로그래밍",
  },
  {
    id: 3,
    thumbnail: "",
    title: "UI/UX 디자인 원칙",
    summary: "사용자 경험을 향상시키는 디자인 원칙들을 알아봅니다.",
    tags: ["design", "ux", "ui"],
    type: "YOUTUBE" as ContentType,
    url: "https://www.youtube.com/watch?v=AwgbMaxb59c",
    memo: "실무에 바로 적용 가능",
    category: "디자인",
  },
  {
    id: 4,
    thumbnail: "",
    title: "디지털 마케팅 전략",
    summary: "현대적인 디지털 마케팅 전략과 실행 방법을 다룹니다.",
    tags: ["marketing", "digital", "strategy"],
    type: "WEB" as ContentType,
    url: "https://seo.tbwakorea.com/blog/all-about-digital-marketing/",
    memo: "데이터 기반 접근",
    category: "마케팅",
  },
  {
    id: 5,
    thumbnail: "",
    title: "Next.js 15 마이그레이션",
    summary: "Next.js 14에서 15로 업그레이드하는 방법을 단계별로 안내합니다.",
    tags: ["nextjs", "react", "migration"],
    type: "WEB" as ContentType,
    url: "https://nextjs.org/",
    memo: "App Router 활용",
    category: "프로그래밍",
  },
  {
    id: 6,
    thumbnail: "",
    title: "브랜드 아이덴티티 디자인",
    summary: "강력한 브랜드 아이덴티티를 구축하는 디자인 방법론을 다룹니다.",
    tags: ["branding", "design", "identity"],
    type: "YOUTUBE" as ContentType,
    url: "https://www.youtube.com/watch?v=lBSAqGsTGPQ",
    memo: "로고 디자인 포함",
    category: "디자인",
  },
];

export const dummyContentsByCategory: { id: number; items: CategoryContentDTO[] }[] = [
  {
    id: 1,
    items: [
      {
        id: 1,
        thumbnail: "",
        title: "React 18의 새로운 기능들",
        summary: "React 18에서 도입된 새로운 기능들과 개선사항들을 살펴봅니다.",
        tags: ["react", "javascript", "frontend"],
        type: "WEB" as ContentType,
        url: "https://ko.react.dev/",
        memo: "성능 개선이 핵심",
        category: "프로그래밍",
      },
      {
        id: 2,
        thumbnail: "",
        title: "TypeScript 완벽 가이드",
        summary: "TypeScript의 모든 기능을 체계적으로 학습할 수 있는 가이드입니다.",
        tags: ["typescript", "javascript", "programming"],
        type: "WEB" as ContentType,
        url: "https://www.typescriptlang.org/",
        memo: "기본부터 고급까지",
        category: "프로그래밍",
      },
      {
        id: 5,
        thumbnail: "",
        title: "Next.js 15 마이그레이션",
        summary: "Next.js 14에서 15로 업그레이드하는 방법을 단계별로 안내합니다.",
        tags: ["nextjs", "react", "migration"],
        type: "WEB" as ContentType,
        url: "https://nextjs.org/",
        memo: "App Router 활용",
        category: "프로그래밍",
      },
    ],
  },
  {
    id: 2,
    items: [
      {
        id: 3,
        thumbnail: "",
        title: "UI/UX 디자인 원칙",
        summary: "사용자 경험을 향상시키는 디자인 원칙들을 알아봅니다.",
        tags: ["design", "ux", "ui"],
        type: "YOUTUBE" as ContentType,
        url: "https://www.youtube.com/watch?v=AwgbMaxb59c",
        memo: "실무에 바로 적용 가능",
        category: "디자인",
      },
      {
        id: 6,
        thumbnail: "",
        title: "브랜드 아이덴티티 디자인",
        summary: "강력한 브랜드 아이덴티티를 구축하는 디자인 방법론을 다룹니다.",
        tags: ["branding", "design", "identity"],
        type: "YOUTUBE" as ContentType,
        url: "https://www.youtube.com/watch?v=lBSAqGsTGPQ",
        memo: "로고 디자인 포함",
        category: "디자인",
      },
    ],
  },
  {
    id: 3,
    items: [
      {
        id: 4,
        thumbnail: "",
        title: "디지털 마케팅 전략",
        summary: "현대적인 디지털 마케팅 전략과 실행 방법을 다룹니다.",
        tags: ["marketing", "digital", "strategy"],
        type: "WEB" as ContentType,
        url: "https://seo.tbwakorea.com/blog/all-about-digital-marketing/",
        memo: "데이터 기반 접근",
        category: "마케팅",
      },
    ],
  },
];

export const dummyTopics = [
  {
    id: 1,
    title: "프론트엔드",
    content: "프론트엔드 관련 콘텐츠들을 모아둔 토픽입니다.",
  },
];

export const dummyNodes: Node[] = [
  {
    id: `topic-1`,
    data: {
      item: {
        id: 1,
        title: "프론트엔드",
        content: "프론트엔드 관련 콘텐츠들을 모아둔 토픽입니다.",
      },
      nodeContent: "topic",
    },
    position: { x: 0, y: 0 },
    measured: {
      height: 220,
      width: 350,
    },
    type: "custom",
  },
  {
    id: `content-1`,
    data: {
      item: {
        id: 1,
        thumbnail: "",
        title: "React 18의 새로운 기능들",
        summary: "React 18에서 도입된 새로운 기능들과 개선사항들을 살펴봅니다.",
        tags: ["react", "javascript", "frontend"],
        type: "WEB" as ContentType,
        url: "https://ko.react.dev/",
        memo: "성능 개선이 핵심",
        category: "프로그래밍",
      },
      nodeContent: "content",
    },
    position: { x: 100, y: 100 },
    measured: {
      height: 220,
      width: 350,
    },
    type: "custom",
  },

  {
    id: `content-2`,
    data: {
      item: {
        id: 2,
        thumbnail: "",
        title: "TypeScript 완벽 가이드",
        summary: "TypeScript의 모든 기능을 체계적으로 학습할 수 있는 가이드입니다.",
        tags: ["typescript", "javascript", "programming"],
        type: "WEB" as ContentType,
        url: "https://www.typescriptlang.org/",
        memo: "기본부터 고급까지",
        category: "프로그래밍",
      },
      nodeContent: "content",
    },
    position: { x: 200, y: 200 },
    measured: {
      height: 220,
      width: 350,
    },
    type: "custom",
  },
  {
    id: `content-5`,
    data: {
      item: {
        id: 5,
        thumbnail: "",
        title: "Next.js 15 마이그레이션",
        summary: "Next.js 14에서 15로 업그레이드하는 방법을 단계별로 안내합니다.",
        tags: ["nextjs", "react", "migration"],
        type: "WEB" as ContentType,
        url: "https://nextjs.org/",
        memo: "App Router 활용",
        category: "프로그래밍",
      },
      nodeContent: "content",
    },
    position: { x: 300, y: 300 },
    measured: {
      height: 220,
      width: 350,
    },
    type: "custom",
  },
];

export const dummyEdges = [
  {
    id: "xy-edge__content-2top-topic-1bottom-target",
    source: "content-2",
    sourceHandle: "top",
    target: "topic-1",
    targetHandle: "bottom-target",
  },
];
