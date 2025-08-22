export const extractYoutubeId = (url: string) => {
  if (!url) return "";
  const urlObj = new URL(url);
  const searchParams = new URLSearchParams(urlObj.search);
  return searchParams.get("v");
};
