export const CONTENT = {
  GET_CATEGORY_CONTENT_BY_ID: "get-category-content-by-id",
  GET_CONTENT_BY_ID: "get-content-by-id",
};

export const CONTENT_TYPE = {
  WEB: "WEB",
  YOUTUBE: "YOUTUBE",
  PDF: "PDF",
} as const;

export const CONTENT_TYPE_OPTIONS = {
  ALL: "ALL",
  ...CONTENT_TYPE,
} as const;

export type ContentType = (typeof CONTENT_TYPE)[keyof typeof CONTENT_TYPE];
export type ContentTypeOptions = (typeof CONTENT_TYPE_OPTIONS)[keyof typeof CONTENT_TYPE_OPTIONS];
