import { decodeQuotedPrintable } from "lettercoder";

export const getHtmlText = async () => {
  return new Promise<string>((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.pageCapture.saveAsMHTML({ tabId: tabs[0]?.id as number }, async (data) => {
        try {
          const quotedPrintableData = await data!.text();
          const decodedData = decodeQuotedPrintable(quotedPrintableData);
          const textDecoder = new TextDecoder("utf-8");
          const htmlContent = textDecoder.decode(decodedData);

          resolve(htmlContent);
        } catch (error) {
          reject(error);
        }
      });
    });
  });
};

export const updateCurrentTab = (
  setState: ({ url, title }: { url: string; title: string }) => void
) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    setState({ url: tabs[0]?.url ?? "", title: tabs[0]?.title ?? "" });
  });
};

export const extractMetaContent = (html: string, property: string): string | null => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const metaTag =
      doc.querySelector(`meta[property="${property}"]`) ||
      doc.querySelector(`meta[name="${property}"]`);

    return metaTag?.getAttribute("content") || null;
  } catch (error) {
    console.error("Meta content 추출 실패:", error);
    return null;
  }
};
