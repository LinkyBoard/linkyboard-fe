import Link from "next/link";

export default function SidebarSkeleton() {
  return (
    <aside className="bg-sidebar border-sidebar-border fixed z-50 hidden h-screen w-70 overflow-y-auto border-r p-6 transition-transform duration-300 lg:relative lg:block">
      <Link
        href="/dashboard"
        className="border-sidebar-border flex items-center gap-3 border-b pb-4"
      >
        <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-md text-xl font-bold text-white">
          N
        </div>
        <div className="text-primary text-2xl font-bold">NEBULA</div>
      </Link>
    </aside>
  );
}
