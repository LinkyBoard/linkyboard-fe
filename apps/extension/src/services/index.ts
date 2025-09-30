import { removeCookie } from "@/utils/cookie";
import { infoToast } from "@linkyboard/components";

import ky, { type KyRequest, type KyResponse } from "ky";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TIMEOUT = 30000;

export const api = ky.create({
  prefixUrl: API_BASE_URL,
  credentials: "include",
  timeout: TIMEOUT,
  retry: {
    limit: 2,
    methods: ["get", "post", "put", "patch", "delete"],
  },
  hooks: {
    afterResponse: [
      async (request: KyRequest, _, response: KyResponse) => {
        if (response.status === 401) {
          infoToast("세션이 만료되었어요. 다시 로그인해주세요.");
          removeCookie("accessToken");
          removeCookie("refreshToken");
          return window.location.replace("/");
        }

        return response;
      },
    ],
  },
});
