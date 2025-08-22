import { useEffect } from "react";

import { useGetAllContents } from "@/lib/tanstack/mutation/content";
import { useUserStore } from "@/lib/zustand/user";
import { getCookie } from "@/utils/cookie";

import { useReplaceNavigate } from "./use-replace-navigate";

export function useCheckToken() {
  const { isLoggedIn, setIsLoggedIn, setContents } = useUserStore();
  const { mutateAsync: getAllContents } = useGetAllContents();

  const navigate = useReplaceNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      const checkToken = async () => {
        const token = await getCookie("accessToken");

        if (!token) {
          return navigate("/");
        } else {
          setIsLoggedIn(true);
          const res = await getAllContents();
          setContents(res.result.content);
          return navigate("/search-content");
        }
      };

      checkToken();
    }
  }, [isLoggedIn]);
}
