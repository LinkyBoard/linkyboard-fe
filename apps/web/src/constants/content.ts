export const CONTENT = {
  GET_CATEGORY_CONTENT_BY_ID: "get-category-content-by-id",
  GET_CONTENT_BY_ID: "get-content-by-id",
};

export const CONTENT_TYPE = {
  ALL: "ALL",
  WEB: "WEB",
  YOUTUBE: "YOUTUBE",
} as const;

export type ContentType = (typeof CONTENT_TYPE)[keyof typeof CONTENT_TYPE];
