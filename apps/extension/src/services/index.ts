import { getCookie, removeCookie, setCookie } from "@/utils/cookie";

import ky, { type KyRequest, type KyResponse } from "ky";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// let isRefreshing = false;

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
        // 토큰 만료 시 임시로 로그아웃 처리
        if (response.status === 401) {
          await removeCookie("accessToken");
          await removeCookie("refreshToken");
          window.location.replace("/");
        }
        // if (response.status === 401 && !isRefreshing) {
        //   isRefreshing = true;

        //   try {
        //     const refreshToken = await getCookie("refreshToken");

        //     if (!refreshToken) {
        //       window.location.replace("/");
        //       return;
        //     }

        //     const refreshResponse = await ky.post(API_BASE_URL + "/auth/reissue").json();
        //     console.log("refreshResponse", refreshResponse);

        //     // 새로운 토큰들을 쿠키에 저장
        //     // if (refreshResponse.isSuccess && refreshResponse.result) {
        //     //   await setCookie("accessToken", refreshResponse.result.accessToken);
        //     //   await setCookie("refreshToken", refreshResponse.result.refreshToken);

        //     //   // 원래 요청 재시도
        //     //   return ky(request);
        //     // } else {
        //     //   throw new Error("토큰 재발급 실패");
        //     // }
        //   } catch (error) {
        //     console.error("토큰 재발급 중 오류:", error);
        //     window.location.replace("/");
        //   } finally {
        //     isRefreshing = false;
        //   }
        // }

        return response;
      },
    ],
  },
});
