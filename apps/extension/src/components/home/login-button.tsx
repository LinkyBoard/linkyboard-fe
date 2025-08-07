import { useState } from "react";

import Google from "@/assets/google.svg?react";
import { useReplaceNavigate } from "@/hooks/use-replace-navigate";
import { errorToast } from "@/utils/toast";

import { Loader2 } from "lucide-react";

import { Button } from "../ui/button";

const baseUrl = import.meta.env.VITE_API_BASE_URL;
const googleLoginPage = baseUrl + "/auth/google?redirectType=extension";

export default function LoginButton() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useReplaceNavigate();

  const onLogin = async () => {
    setIsLoading(true);

    chrome.identity.launchWebAuthFlow(
      {
        interactive: true,
        url: googleLoginPage,
      },
      async (redirectUri) => {
        setIsLoading(false);

        if (!redirectUri) {
          setIsLoading(false);
          return errorToast("로그인에 실패했어요. 다시 시도해주세요.");
        }

        const url = new URL(redirectUri);
        const accessToken = url.searchParams.get("accessToken");
        const refreshToken = url.searchParams.get("refreshToken");

        if (!accessToken || !refreshToken) {
          setIsLoading(false);
          return errorToast("로그인에 실패했어요. 다시 시도해주세요.");
        }

        chrome.cookies.set({
          url: baseUrl,
          name: "accessToken",
          value: accessToken,
          path: "/",
          httpOnly: true,
          secure: false,
        });
        chrome.cookies.set({
          url: baseUrl,
          name: "refreshToken",
          value: refreshToken,
          path: "/",
          secure: false,
        });
        return navigate("/search-content");
      }
    );
  };

  return (
    <Button
      onClick={onLogin}
      disabled={isLoading}
      size="lg"
      className="shadow-google hover:text-foreground w-full bg-white hover:bg-gray-100"
      aria-label="구글로 시작하기"
      variant="outline"
    >
      <div className="flex items-center justify-center space-x-2">
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            <span>로그인 중...</span>
          </>
        ) : (
          <>
            <Google />
            <span>Google로 시작하기</span>
          </>
        )}
      </div>
    </Button>
  );
}
