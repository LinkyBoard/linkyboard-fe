import Link from "next/link";

import Logo from "@/assets/logo.svg";

export default function SidebarSkeleton() {
  return (
    <aside className="bg-sidebar border-sidebar-border fixed z-50 hidden h-screen w-70 overflow-y-auto border-r p-6 transition-transform duration-300 lg:relative lg:block">
      <Link
        href="/dashboard"
        className="border-sidebar-border flex items-center gap-3 border-b pb-4"
      >
        <Logo className="size-10" />

        <div className="text-primary text-2xl font-bold">LinkyBoard</div>
      </Link>
    </aside>
  );
}
