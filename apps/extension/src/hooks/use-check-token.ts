import { useEffect } from "react";

import { useGetAllContents } from "@/lib/tanstack/query/content";
import { useUserStore } from "@/lib/zustand/user";
import { getCookie } from "@/utils/cookie";

import { useReplaceNavigate } from "./use-replace-navigate";

export function useCheckToken() {
  const { isLoggedIn, setIsLoggedIn, setContents } = useUserStore();

  const navigate = useReplaceNavigate();

  const { data: contents } = useGetAllContents(isLoggedIn);

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

  useEffect(() => {
    if (!contents) return;

    const updateContents = async () => {
      setContents(contents?.result.content || []);
    };

    updateContents();
  }, [contents]);
}
