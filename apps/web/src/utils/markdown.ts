import { marked } from "marked";

/**
 * 마크다운 텍스트를 HTML 문자열로 변환합니다.
 * @param markdown - 변환할 마크다운 텍스트
 * @returns HTML 문자열
 */
export function markdownToHtml(markdown: string): string {
  try {
    // marked 라이브러리를 사용하여 마크다운을 HTML로 변환
    const result = marked(markdown, {
      breaks: true, // 줄바꿈을 <br>로 변환
      gfm: true, // GitHub Flavored Markdown 지원
    });

    // Promise인 경우 처리
    if (typeof result === "string") {
      return result;
    } else {
      // Promise인 경우 동기적으로 처리 (실제로는 이런 경우가 거의 없음)
      return markdown;
    }
  } catch (error) {
    console.error("마크다운 변환 중 오류:", error);
    // 변환 실패 시 원본 텍스트 반환
    return markdown;
  }
}

/**
 * 마크다운 텍스트가 포함되어 있는지 확인합니다.
 * @param text - 확인할 텍스트
 * @returns 마크다운 문법이 포함되어 있으면 true
 */
export function containsMarkdown(text: string): boolean {
  if (!text || typeof text !== "string") {
    return false;
  }

  const markdownPatterns = [
    /^#{1,6}\s/m, // 헤딩 (multiline flag)
    /\*\*.*?\*\*/, // 볼드
    /\*[^*\s].*?[^*\s]\*/, // 이탤릭 (더 정확한 패턴)
    /`[^`]+`/, // 인라인 코드
    /\[.*?\]\(.*?\)/, // 링크
    /^- /m, // 리스트 (multiline flag)
    /^\d+\. /m, // 순서 리스트 (multiline flag)
    /```[\s\S]*?```/, // 코드 블록
    /^\|.*\|$/m, // 테이블
    /^\> /m, // 인용
  ];

  return markdownPatterns.some((pattern) => pattern.test(text));
}
