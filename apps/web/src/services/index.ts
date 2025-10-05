import { removeCookie } from "@/utils/cookie";
import { API_BASE_URL } from "@/utils/env";

import ky from "ky";

// API 기본 설정
const API_TIMEOUT = 30000; // 30초

// 토큰 재발급 함수
const reissueToken = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/reissue`, {
      method: "POST",
      credentials: "include",
    });
    return response.ok;
  } catch (error) {
    console.error("토큰 재발급 실패:", error);
    return false;
  }
};

// 클라이언트측 API (ky 사용)
export const clientApi = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: API_TIMEOUT,
  credentials: "include",
  retry: {
    limit: 1,
    methods: ["get", "post", "put", "delete"],
  },
  hooks: {
    afterResponse: [
      async (request, options, response) => {
        if (response.status === 401) {
          // 토큰 재발급 시도
          const tokenReissued = await reissueToken();

          if (tokenReissued) {
            // 토큰 재발급 성공 시 원래 요청 재시도
            return ky(request, options);
          } else {
            // 토큰 재발급 실패 시 로그인 페이지로 리다이렉트
            await removeCookie("loggedIn");
            window.location.href = "/login";
          }
        }
        return response;
      },
    ],
  },
});
