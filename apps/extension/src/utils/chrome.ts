import { decodeQuotedPrintable } from "lettercoder";

export const searchHistory = (text: string) => {
  chrome.history.search({ text, startTime: Date.now() - 7 * 24 * 60 * 60 * 1000 }, (results) => {
    console.log(results);
  });
};

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
