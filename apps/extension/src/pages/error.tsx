import { useReplaceNavigate } from "@/hooks/use-replace-navigate";
import { Button } from "@linkyboard/components";

import { Home } from "lucide-react";

interface ErrorPageProps {
  title: string;
  subtitle: string;
}

function ErrorPage({ title, subtitle }: ErrorPageProps) {
  const navigate = useReplaceNavigate();

  const onGoHome = () => {
    navigate("/search-content");
  };

  return (
    <main className="bg-background flex min-h-screen flex-col items-center justify-center p-6">
      <div className="mx-auto max-w-md text-center">
        {/* 에러 아이콘 */}
        <div className="mb-8 flex justify-center">
          <div className="bg-destructive/10 flex h-24 w-24 items-center justify-center rounded-full">
            <svg
              className="text-destructive h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        {/* 에러 메시지 */}
        <div className="mb-8 space-y-3">
          <h1 className="text-foreground text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground text-base leading-relaxed">{subtitle}</p>
        </div>

        <Button
          onClick={onGoHome}
          className="mx-auto flex items-center gap-2"
          size="lg"
          aria-label="홈으로 돌아가기"
        >
          <Home className="h-4 w-4" />
          홈으로 돌아가기
        </Button>
      </div>
    </main>
  );
}

export default ErrorPage;
