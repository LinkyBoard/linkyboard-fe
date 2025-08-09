import { useEffect } from "react";

import { useUserStore } from "@/lib/zustand/user";
import { getCookie } from "@/utils/cookie";

import { useReplaceNavigate } from "./use-replace-navigate";

export function useCheckToken() {
  const { isLoggedIn, setIsLoggedIn } = useUserStore();

  const navigate = useReplaceNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      const checkToken = async () => {
        const token = await getCookie("accessToken");

        if (!token) {
          return navigate("/");
        } else {
          setIsLoggedIn(true);
          return navigate("/search-content");
        }
      };

      checkToken();
    }
  }, [isLoggedIn]);
}
