import { GoogleTagManager } from "@next/third-parties/google";

const isProduction = process.env.NODE_ENV === "production";

export default function ThirdPartyProvider() {
  return isProduction ? <GoogleTagManager gtmId="GTM-N32B47GH" /> : null;
}
