"use client";

import { Github } from "lucide-react";

const footerSections = [
  {
    title: "제품",
    links: [
      { name: "기능", href: "#features" },
      { name: "사용법", href: "#how-it-works" },
      { name: "가격", href: "#pricing" },
      { name: "업데이트", href: "#updates" },
    ],
  },
  {
    title: "지원",
    links: [
      { name: "FAQ", href: "#faq" },
      { name: "고객 지원", href: "#support" },
      { name: "문서", href: "#docs" },
      { name: "커뮤니티", href: "#community" },
    ],
  },
];

export default function Footer() {
  const onLinkClick = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <h3 className="mb-4 text-xl font-semibold">LinkyBoard</h3>
            <p className="text-background/80 mb-6 max-w-md">
              지식을 연결하는 스마트 지식 관리 서비스
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/LinkyBoard"
                className="text-background/80 hover:text-background text-xl transition-colors"
                aria-label="GitHub"
                target="_blank"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="mb-4 font-semibold">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-background/80 hover:text-background transition-colors"
                      onClick={(event) => {
                        event.preventDefault();
                        onLinkClick(link.href);
                      }}
                      aria-label={`${link.name} 페이지로 이동`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-background/10 mt-12 border-t pt-8 text-center">
          <p className="text-background/80 text-sm">© 2025 LinkyBoard. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
