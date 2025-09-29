import { Suspense } from "react";

import Sidebar from "@/components/(with-side-bar)/layout";
import ContentSidebar from "@/components/(with-side-bar)/library/content-sidebar";

import { Laptop, Loader2 } from "lucide-react";

interface WithSidePanelLayoutProps {
  children: React.ReactNode;
}

export default function WithSidePanelLayout({ children }: WithSidePanelLayoutProps) {
  return (
    <>
      <div className="hidden min-h-screen sm:flex">
        <Sidebar />
        <main className="flex-1 p-8">{children}</main>
        <Suspense
          fallback={
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <Loader2 className="animate-spin" />
              <p className="text-base">콘텐츠 정보를 가져오고 있어요</p>
            </div>
          }
        >
          <ContentSidebar />
        </Suspense>
      </div>

      <div className="from-background to-muted flex min-h-screen flex-col items-center justify-center bg-gradient-to-br sm:hidden">
        <div className="bg-primary/10 mx-auto mb-4 flex size-20 items-center justify-center rounded-full">
          <Laptop size={40} className="text-primary" />
        </div>
        <h1 className="text-foreground mb-2 text-2xl font-bold">데스크톱에서 접속해주세요</h1>
        <p className="text-muted-foreground leading-relaxed">
          이 서비스는 더 나은 사용자 경험을 위해
          <br />
          데스크톱 환경에서 이용하실 수 있습니다.
        </p>
      </div>
    </>
  );
}
