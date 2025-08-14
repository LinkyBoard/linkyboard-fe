import { extractCookieFromHeader, getCookie, setCookie } from "@/utils/cookie";

import ky, { type KyRequest, type KyResponse } from "ky";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let isRefreshing = false;

export const api = ky.create({
  prefixUrl: API_BASE_URL,
  credentials: "include",
  retry: {
    limit: 2,
    methods: ["get", "post", "put", "patch", "delete"],
  },
  hooks: {
    afterResponse: [
      async (request: KyRequest, _, response: KyResponse) => {
        if (response.status === 401 && !isRefreshing) {
          isRefreshing = true;

          try {
            const refreshToken = await getCookie("refreshToken");

            if (!refreshToken) {
              window.location.replace("/");
              return;
            }

            const refreshResponse = await ky.post(API_BASE_URL + "/auth/reissue", {
              credentials: "include",
            });

            // Set-Cookie 헤더에서 토큰 추출
            const setCookieHeader = refreshResponse.headers.get("set-cookie");

            // Set-Cookie 헤더에서 토큰 추출 (서버에서 Set-Cookie로 설정한 경우)
            const headerAccessToken = extractCookieFromHeader(setCookieHeader, "accessToken");
            const headerRefreshToken = extractCookieFromHeader(setCookieHeader, "refreshToken");

            // 새로운 토큰들을 쿠키에 저장
            // Set-Cookie 헤더에서 추출한 토큰이 있으면 사용, 없으면 response body에서 사용
            if (headerAccessToken && headerRefreshToken) {
              const accessToken = headerAccessToken;
              const refreshToken = headerRefreshToken;

              await setCookie("accessToken", accessToken);
              await setCookie("refreshToken", refreshToken);

              // 원래 요청 재시도
              return ky(request);
            } else {
              throw new Error("토큰 재발급 실패");
            }
          } catch (error) {
            console.error("토큰 재발급 중 오류:", error);
            window.location.replace("/");
          } finally {
            isRefreshing = false;
          }
        }

        return response;
      },
    ],
  },
});
