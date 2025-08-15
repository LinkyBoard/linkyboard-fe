import { Suspense } from "react";

import Sidebar from "@/components/(with-side-bar)/layout";
import SidebarSkeleton from "@/components/(with-side-bar)/layout/skeleton";
import ContentSidebar from "@/components/(with-side-bar)/library/content-sidebar";

import { Laptop } from "lucide-react";

interface WithSidePanelLayoutProps {
  children: React.ReactNode;
}

export default function WithSidePanelLayout({ children }: WithSidePanelLayoutProps) {
  return (
    <>
      <div className="hidden min-h-screen sm:flex">
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />
        </Suspense>
        <main className="flex-1 p-8">{children}</main>
        <ContentSidebar />
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
