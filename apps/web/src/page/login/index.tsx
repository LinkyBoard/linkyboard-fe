"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Google from "@/assets/google.svg";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onLogin = async () => {
    setIsLoading(true);
    try {
      // TODO: Google OAuth 로그인 구현
      console.log("Google 로그인");
      // 임시로 2초 후 대시보드로 이동
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push("/dashboard");
    } catch (error) {
      console.error("Google 로그인 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <header className="p-6">
        <Link
          href="/"
          className="text-primary hover:text-primary text-2xl font-bold transition-colors"
        >
          LinkyBoard
        </Link>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6">
        {/* 로고 및 제목 */}
        <h1 className="text-center text-2xl font-semibold">
          <span className="text-primary">LinkyBoard</span>에<br className="block sm:hidden" />
          오신 것을 환영합니다
        </h1>

        {/* 로그인 폼 */}
        <Button
          onClick={onLogin}
          disabled={isLoading}
          size="lg"
          className="shadow-google hover:text-foreground w-full max-w-sm bg-white hover:bg-gray-100"
          aria-label="구글로 시작하기"
          variant="outline"
        >
          <div className="flex items-center justify-center space-x-2">
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" />
                <span>로그인 중...</span>
              </>
            ) : (
              <>
                <Google />
                <span>Google로 시작하기</span>
              </>
            )}
          </div>
        </Button>

        {/* 약관 동의 */}
        <div className="space-y-2 text-center">
          <p className="text-sm text-gray-500">
            계정이 없으신가요?
            <br className="block sm:hidden" />
            Google로 로그인하면 자동으로 계정이 생성됩니다.
          </p>
          <p className="text-xs leading-relaxed text-gray-500">
            계속 진행하면 LinkyBoard의{" "}
            <Link href="/terms" className="underline hover:text-gray-700">
              서비스 약관
            </Link>
            에 동의하고 <br className="block sm:hidden" />
            <Link href="/privacy" className="underline hover:text-gray-700">
              개인정보 보호정책
            </Link>
            을 읽었음을 인정하는 것입니다.
          </p>
        </div>
      </div>

      {/* 푸터 */}
      <div className="p-6 text-center">
        <p className="text-xs text-gray-400">© 2025 LinkyBoard. All rights reserved.</p>
      </div>
    </div>
  );
}
