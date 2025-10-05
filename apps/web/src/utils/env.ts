export const isProduction = process.env.NODE_ENV === "production";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
export const S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BASE_URL || "";
