import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Link, Bot, Lightbulb, Loader2, FolderArchive } from "lucide-react";
import Google from "@/assets/google.svg?react";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onLogin = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // 로그인 로직 구현 예정
      console.log("로그인 시도");
      // 실제 로그인 API 호출 로직이 여기에 들어갈 예정
    } catch (error) {
      console.error("로그인 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="from-background to-accent flex min-h-screen items-center justify-center bg-gradient-to-br p-6">
      <div className="animate-fade-in-up bg-card w-full max-w-md rounded-2xl p-8 shadow-xl">
        {/* 로고 및 제목 */}
        <div className="mb-8 text-center">
          <div className="from-primary to-chart-2 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r shadow-lg">
            <Link className="h-8 w-8 text-white" />
          </div>
          <h1 className="from-primary to-chart-2 mb-2 bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent">
            LinkyBoard
          </h1>
          <p className="text-muted-foreground text-sm">지식 관리의 새로운 패러다임</p>
        </div>

        {/* 서비스 설명 */}
        <div className="mb-8 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
              <Link className="text-primary h-3 w-3" />
            </div>
            <div>
              <h3 className="text-foreground text-sm font-semibold">정보 수집</h3>
              <p className="text-muted-foreground text-xs">
                웹페이지, PDF, 노트를 한 곳에 저장하세요
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
              <Bot className="text-primary h-3 w-3" />
            </div>
            <div>
              <h3 className="text-foreground text-sm font-semibold">AI 요약 & 정리</h3>
              <p className="text-muted-foreground text-xs">
                AI가 자동으로 내용을 요약하고 키워드를 추출해 정리해드립니다
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
              <FolderArchive className="text-primary h-3 w-3" />
            </div>
            <div>
              <h3 className="text-foreground text-sm font-semibold">시각화 & 연결</h3>
              <p className="text-muted-foreground text-xs">
                폴더 뷰로 지식 간의 연결을 시각적으로 확인하고 새로운 관계를 발견하세요
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full">
              <Lightbulb className="text-primary h-3 w-3" />
            </div>
            <div>
              <h3 className="text-foreground text-sm font-semibold">인사이트 도출</h3>
              <p className="text-muted-foreground text-xs">
                개인 지식 보드에서 창의적인 아이디어와 통찰력을 생성하세요
              </p>
            </div>
          </div>
        </div>

        {/* 로그인 버튼 */}
        <Button
          onClick={onLogin}
          disabled={isLoading}
          size="lg"
          className="shadow-google hover:text-foreground w-full bg-white hover:bg-gray-100"
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

        {/* 추가 정보 */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-xs">
            흩어진 정보를 연결된 인사이트로 변환하는 브라우저 통합 지식 관리 서비스
          </p>
        </div>
      </div>
    </div>
  );
}
