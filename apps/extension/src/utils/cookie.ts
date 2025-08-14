import { errorToast } from "./toast";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const setCookie = async (name: string, value: string) => {
  try {
    await chrome.cookies.set({
      url: baseUrl,
      name,
      value,
      path: "/",
      httpOnly: true,
      secure: false,
    });
  } catch (error) {
    errorToast("오류가 발생했어요.");
    console.error(error);
  }
};

export const getCookie = async (name: string) => {
  try {
    const cookie = await chrome.cookies.get({
      url: baseUrl,
      name,
    });

    return cookie?.value || null;
  } catch (error) {
    errorToast("오류가 발생했어요.");
    console.error(error);
  }
};

export const removeCookie = async (name: string) => {
  try {
    await chrome.cookies.remove({
      url: baseUrl,
      name,
    });
  } catch (error) {
    errorToast("오류가 발생했어요.");
  }
};

/**
 * Set-Cookie 헤더에서 특정 쿠키 값을 추출합니다.
 * @param setCookieHeader Set-Cookie 헤더 문자열
 * @param cookieName 추출할 쿠키 이름
 * @returns 쿠키 값 또는 null
 */
export const extractCookieFromHeader = (
  setCookieHeader: string | null,
  cookieName: string
): string | null => {
  if (!setCookieHeader) return null;

  // 여러 Set-Cookie 헤더가 있을 수 있으므로 분리
  const cookies = setCookieHeader.split(",");

  for (const cookie of cookies) {
    const trimmedCookie = cookie.trim();
    if (trimmedCookie.startsWith(`${cookieName}=`)) {
      // 쿠키 값 추출 (첫 번째 세미콜론까지)
      const valueStart = trimmedCookie.indexOf("=") + 1;
      const valueEnd = trimmedCookie.indexOf(";", valueStart);
      const value =
        valueEnd !== -1
          ? trimmedCookie.substring(valueStart, valueEnd)
          : trimmedCookie.substring(valueStart);

      return value;
    }
  }

  return null;
};
