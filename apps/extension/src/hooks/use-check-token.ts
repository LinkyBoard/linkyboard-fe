import { useEffect } from "react";

import { useUserStore } from "@/lib/zustand/user";

import { useReplaceNavigate } from "./use-replace-navigate";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export function useCheckToken() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  const navigate = useReplaceNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      const checkToken = async () => {
        const token = await chrome.cookies.get({
          url: baseUrl,
          name: "accessToken",
        });

        if (!token) {
          return navigate("/");
        }
      };

      checkToken();
    }
  }, [isLoggedIn]);
}
