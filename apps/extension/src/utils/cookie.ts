import { errorToast } from "@linkyboard/components";

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
