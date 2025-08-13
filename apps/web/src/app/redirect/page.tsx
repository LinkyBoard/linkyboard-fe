"use client";

import { useEffect } from "react";
import { redirect, RedirectType } from "next/navigation";

import { setCookie } from "@/utils/cookie";

import { Loader2 } from "lucide-react";

export default function Redirect() {
  useEffect(() => {
    const setUpCookie = async () => {
      await setCookie("loggedIn", "true");
      redirect("/dashboard", RedirectType.replace);
    };
    setUpCookie();
  }, []);

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-2">
      <Loader2 className="text-primary size-10 animate-spin" />
      <span>로그인 중...</span>
    </div>
  );
}
