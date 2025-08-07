import "./globals.css";

import type { Metadata } from "next";
import localFont from "next/font/local";

import RootProvider from "@/components/provider/root-provider";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LinkyBoard",
  description: "LinkyBoard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={pretendard.className}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
