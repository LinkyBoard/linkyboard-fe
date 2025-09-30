"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "@/assets/logo.svg";
import { useMobileMenuStore } from "@/lib/zustand/mobile-menu-store";
import { cn } from "@linkyboard/utils";

import type { LucideIcon } from "lucide-react";
import { Book, Grid3X3, Home } from "lucide-react";

import RecentTopicList from "./recent-topic-list";

interface NavItem {
  icon: LucideIcon;
  label: string;
  href: string;
  active?: boolean;
}

const navItems: NavItem[] = [
  { icon: Home, label: "대시보드", href: "/dashboard" },
  { icon: Book, label: "라이브러리", href: "/library" },
  { icon: Grid3X3, label: "토픽 보드", href: "/topic" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const { isOpen, close } = useMobileMenuStore();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={cn(
          "bg-sidebar border-sidebar-border w-70 fixed z-50 h-screen overflow-y-auto border-r p-6 transition-transform duration-300",
          "lg:sticky lg:top-0 lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          className="border-sidebar-border mb-8 flex items-center gap-3 border-b pb-4"
        >
          <Logo className="size-10" />
          <div className="text-primary text-2xl font-bold">LinkyBoard</div>
        </Link>

        {/* Navigation */}
        <nav className="mb-8">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "mb-2 flex items-center gap-3 rounded-md px-4 py-3 transition-all duration-300",
                pathname === item.href
                  ? "bg-sidebar-primary text-sidebar-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              onClick={close}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Recent Topics */}
        <div className="mt-8">
          <div className="text-muted-foreground mb-4 text-sm font-semibold uppercase tracking-wider">
            나의 토픽
          </div>
          <RecentTopicList />
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={close} />}
    </>
  );
}
