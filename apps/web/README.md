# LinkyBoard Web

Next.js 기반 웹 플랫폼입니다.

## 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **State**: Zustand, TanStack Query

## 설치 방법

1. 프로젝트 루트에서 의존성 설치 (이미 설치되어 있다면 생략)

```bash
pnpm install
```

## 개발 서버 실행

```bash
# 루트에서 실행
pnpm dev:web

# 또는 web 디렉토리에서 직접 실행
cd apps/web
pnpm dev
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 프로젝트 구조

```plaintext
web/
├── public/              # 정적 파일
│   ├── example/         # 예제 비디오 파일
│   └── static/          # 정적 이미지
├── src/
│   ├── app/             # Next.js App Router
│   │   ├── (with-side-bar)/  # 사이드바가 있는 레이아웃 그룹
│   │   │   ├── dashboard/    # 대시보드 페이지
│   │   │   ├── library/      # 라이브러리 페이지
│   │   │   └── topic/        # 토픽 페이지
│   │   ├── login/            # 로그인 페이지
│   │   ├── redirect/         # 로그인 리다이렉트 페이지
│   │   ├── layout.tsx        # 루트 레이아웃
│   │   └── page.tsx          # 랜딩 페이지
│   ├── assets/          # 폰트, SVG 등
│   ├── components/      # React 컴포넌트
│   │   ├── (with-side-bar)/  # 사이드바 관련 컴포넌트
│   │   ├── common/           # 공통 컴포넌트
│   │   ├── landing/          # 랜딩 페이지 컴포넌트
│   │   └── provider/         # Provider 컴포넌트
│   ├── constants/       # 상수 정의
│   ├── hooks/           # 커스텀 훅
│   ├── lib/             # 라이브러리 설정
│   │   ├── tanstack/        # TanStack Query 설정
│   │   └── zustand/         # Zustand 스토어
│   ├── models/          # 데이터 모델
│   ├── page/            # 경로에 해당하는 페이지 컴포넌트
│   ├── schemas/         # Zod 스키마
│   ├── services/        # API 서비스
│   ├── types/           # TypeScript 타입 정의
│   └── utils/           # 유틸리티 함수
├── next.config.ts       # Next.js 설정
└── postcss.config.mjs   # PostCSS 설정
```
