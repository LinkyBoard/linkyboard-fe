import { isProduction } from "@/utils/env";
import { GoogleTagManager } from "@next/third-parties/google";

export default function ThirdPartyProvider() {
  return isProduction ? <GoogleTagManager gtmId="GTM-N32B47GH" /> : null;
}
