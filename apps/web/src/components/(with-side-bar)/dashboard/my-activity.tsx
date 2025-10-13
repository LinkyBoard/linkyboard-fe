"use client";

import Link from "next/link";

import { useDashboardStore } from "@/lib/zustand/dashboard";
import { cn } from "@linkyboard/utils";

import { Bookmark, Lightbulb, Star } from "lucide-react";

export default function MyActivity() {
  const { totalLibraries, totalTopics } = useDashboardStore();

  const summaryCards = [
    {
      icon: Bookmark,
      number: totalLibraries,
      label: "저장된 항목",
      color: "blue",
      href: "/library",
    },
    { icon: Star, number: totalTopics, label: "토픽", color: "green", href: "/topic" },
    { icon: Lightbulb, number: 3, label: "AI 인사이트", color: "purple", href: "/dashboard" },
  ];

  return (
    <section className="mb-8">
      <h2 className="mb-6 text-2xl font-semibold">나의 활동</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {summaryCards.map((card) => (
          <Link
            key={card.label}
            className="bg-card border-border rounded-lg border p-6 text-start transition-all duration-300 hover:-translate-y-1 hover:transform hover:shadow-lg"
            href={card.href}
          >
            <div className="mb-4 flex items-start justify-between">
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-md",
                  card.color === "blue"
                    ? "bg-blue-100 text-blue-600"
                    : card.color === "green"
                      ? "bg-green-100 text-green-600"
                      : "bg-purple-100 text-purple-600"
                )}
              >
                <card.icon size={24} />
              </div>
            </div>
            <div className="mb-1 text-3xl font-bold">{card.number}</div>
            <div className="text-muted-foreground text-sm">{card.label}</div>
          </Link>
        ))}
      </div>
    </section>
  );
}
