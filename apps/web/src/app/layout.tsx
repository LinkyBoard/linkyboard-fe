import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";

import RootProvider from "@/components/provider/root-provider";
import ThirdPartyProvider from "@/components/provider/third-party-provider";
import { cn } from "@linkyboard/utils";

const pretendard = localFont({
  src: "../assets/fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.linkyboard.com"),
  title: "LinkyBoard - 지식을 연결하는 스마트 지식 관리 서비스",
  description:
    "흩어진 정보를 하나로 연결하는 지식 관리 플랫폼. 웹 콘텐츠를 수집하고 시각화하여 나만의 지식 보드를 만들어 보세요.",
  keywords: [
    "LinkyBoard",
    "링키보드",
    "지식 관리",
    "지식 조직화",
    "인사이트 생성",
    "북마크 관리",
    "노트 관리",
    "PDF 관리",
    "AI 요약",
    "Chrome 확장프로그램",
    "시각적 지식 관리",
    "생산성 도구",
  ],
  openGraph: {
    title: "LinkyBoard - 지식을 연결하는 스마트 지식 관리 서비스",
    description: "브라우저 통합 지식 관리 서비스로 흩어진 정보를 연결된 인사이트로 변환하세요.",
    type: "website",
    images: "/og-image.png",
    url: "https://www.linkyboard.com",
    siteName: "LinkyBoard",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkyBoard - 지식을 연결하는 스마트 지식 관리 서비스",
    description: "브라우저 통합 지식 관리 서비스로 흩어진 정보를 연결된 인사이트로 변환하세요.",
    images: "/og-image.png",
  },
  alternates: {
    canonical: "https://www.linkyboard.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={cn(pretendard.className, "antialiased")}>
        <ThirdPartyProvider />
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
