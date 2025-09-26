"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Logo from "@/assets/logo.svg";
import { Button } from "@linkyboard/components";
import { scrollToSection, useScrollSpy } from "@/hooks/use-intersection-observer";
import { cn } from "@linkyboard/utils";

import { Menu, X } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  const sectionIds = ["introduction", "features", "benefits", "how-it-works"];
  const activeSection = useScrollSpy(sectionIds);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onNavLinkClick = (href: string) => {
    setIsMenuOpen(false);
    scrollToSection(href);
  };

  const onLogoClick = (event: React.MouseEvent) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { href: "#introduction", label: "소개" },
    { href: "#features", label: "기능" },
    { href: "#benefits", label: "혜택" },
    { href: "#how-it-works", label: "사용법" },
  ];

  return (
    <header
      className={cn(
        "bg-card border-border sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-300",
        isScrolled ? "shadow-sm" : ""
      )}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <a
          href="#"
          className="text-primary hover:text-primary flex items-center gap-2 text-2xl font-bold transition-colors"
          onClick={onLogoClick}
          aria-label="홈으로 이동"
        >
          <Logo className="size-10" />
          <span>LinkyBoard</span>
        </a>

        {/* Desktop Navigation */}
        <ul className="hidden list-none gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={cn(
                  "hover:text-primary font-medium transition-colors",
                  activeSection === link.href.slice(1) ? "text-primary" : "text-foreground"
                )}
                onClick={(event) => {
                  event.preventDefault();
                  onNavLinkClick(link.href);
                }}
                aria-label={`${link.label} 섹션으로 이동`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="lg"
            className="hidden w-full flex-col md:flex"
            aria-label="무료 시작하기"
            asChild
          >
            <a
              href="https://linkyboard-demo.vercel.app/dashboard"
              target="_blank"
              rel="noopener noreferrer"
            >
              데모 보기
            </a>
          </Button>
          <Button
            variant="default"
            size="lg"
            className="hidden md:block"
            onClick={() => router.push("/login")}
            aria-label="무료 시작하기"
          >
            무료 시작
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuToggle}
          aria-label="메뉴 토글"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </nav>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="bg-card border-border border-t md:hidden">
          <ul className="mx-auto max-w-6xl space-y-4 px-4 py-4">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={cn(
                    "hover:text-primary block font-medium transition-colors",
                    activeSection === link.href.slice(1) ? "text-primary" : "text-foreground"
                  )}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavLinkClick(link.href);
                  }}
                  aria-label={`${link.label} 섹션으로 이동`}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-4">
              <Button
                variant="default"
                size="lg"
                className="w-full"
                onClick={() => router.push("/login")}
                aria-label="무료 시작하기"
              >
                무료 시작
              </Button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
