import { removeCookie } from "@/utils/cookie";

import ky from "ky";

// API 기본 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
const API_TIMEOUT = 30000; // 30초

// 공통 fetch 옵션
const createFetchOptions = (
  method: string,
  data?: unknown,
  options?: RequestInit
): RequestInit => ({
  method,
  credentials: "include",
  body: data ? JSON.stringify(data) : undefined,
  ...options,
});

// 공통 응답 처리
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// 서버측 API (Next.js 내장 fetch 사용)
export const serverApi = {
  async request<T>(
    method: string,
    endpoint: string,
    data?: unknown,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}/${endpoint}`;
    const fetchOptions = createFetchOptions(method, data, options);
    const response = await fetch(url, fetchOptions);
    return handleResponse<T>(response);
  },

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>("GET", endpoint, undefined, options);
  },

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>("POST", endpoint, data, options);
  },

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>("PUT", endpoint, data, options);
  },

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>("DELETE", endpoint, undefined, options);
  },
};

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
const clientKy = ky.create({
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

export const clientApi = {
  async get<T>(endpoint: string, options?: Parameters<typeof clientKy.get>[1]): Promise<T> {
    return clientKy.get(endpoint, options).json<T>();
  },

  async post<T>(
    endpoint: string,
    data?: unknown,
    options?: Parameters<typeof clientKy.post>[1]
  ): Promise<T> {
    return clientKy.post(endpoint, { json: data, ...options }).json<T>();
  },

  async put<T>(
    endpoint: string,
    data?: unknown,
    options?: Parameters<typeof clientKy.put>[1]
  ): Promise<T> {
    return clientKy.put(endpoint, { json: data, ...options }).json<T>();
  },

  async delete<T>(endpoint: string, options?: Parameters<typeof clientKy.delete>[1]): Promise<T> {
    return clientKy.delete(endpoint, options).json<T>();
  },

  async patch<T>(
    endpoint: string,
    data?: unknown,
    options?: Parameters<typeof clientKy.patch>[1]
  ): Promise<T> {
    return clientKy.patch(endpoint, { json: data, ...options }).json<T>();
  },
};
