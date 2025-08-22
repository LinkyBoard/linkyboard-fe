import Link from "next/link";

import Google from "@/assets/google.svg";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
const href = baseUrl + "/auth/google?redirectType=web";

export default function LoginPage() {
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

        <Link
          href={href}
          className="shadow-google hover:text-foreground border-input flex h-12 w-full max-w-sm items-center justify-center space-x-2 rounded-md border bg-white px-8 text-base font-semibold transition-transform hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-lg"
          aria-label="구글로 시작하기"
        >
          <Google />
          <span>Google로 시작하기</span>
        </Link>

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
