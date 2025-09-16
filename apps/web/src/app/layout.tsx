import "./globals.css";

import type { Metadata } from "next";
import { JetBrains_Mono, Merriweather, Poppins } from "next/font/google";

import RootProvider from "@/components/root-provider";
import { cn } from "@repo/ui/utils/cn";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-merriweather",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "LinkyBoard - 지식을 연결하는 스마트 지식 관리 서비스",
  description:
    "브라우저 통합 지식 관리 서비스로 흩어진 정보를 연결된 인사이트로 변환하세요. AI 요약, 시각화, 개인 지식 보드를 통해 효율적인 학습과 창의적 사고를 경험하세요.",
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
    url: "https://nebula-ai.kr",
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
    canonical: "https://nebula-ai.kr",
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
    <html lang="ko" className={cn(poppins.variable, merriweather.variable, jetbrainsMono.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Merriweather:wght@300;400;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn(poppins.className, "antialiased")}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
