import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver(options: UseIntersectionObserverOptions = {}) {
  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px", triggerOnce = true } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsIntersecting(true);
          if (triggerOnce && !hasTriggered) {
            setHasTriggered(true);
            element.classList.add("animate-fade-in-up");
          }
        } else if (!triggerOnce) {
          setIsIntersecting(false);
          element.classList.remove("animate-fade-in-up");
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { elementRef, isIntersecting };
}

// 스크롤 위치에 따른 네비게이션 활성화 훅
export function useScrollSpy(ids: string[], offset: number = 200) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const onScroll = () => {
      const scrollPosition = window.scrollY + offset;

      for (const id of ids) {
        const element = document.getElementById(id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveId(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", onScroll);
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [ids, offset]);

  return activeId;
}

// 부드러운 스크롤 함수
export function scrollToSection(sectionId: string) {
  const element = document.querySelector(sectionId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - 80;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
}
