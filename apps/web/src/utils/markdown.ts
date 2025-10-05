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
