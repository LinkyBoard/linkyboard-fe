export const searchFilter = (search: string, target: string) => {
  if (!search) return true;
  const searchLower = search.toLowerCase();
  const targetLower = target.toLowerCase();
  const searchWords = searchLower.split(/\s+/).filter(Boolean);
  return searchWords.every((word) => targetLower.includes(word));
};
