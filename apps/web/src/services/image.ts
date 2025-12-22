import { S3_BASE_URL } from "@/utils/env";
import { convertImageToWebP } from "@/utils/image";
import { errorToast } from "@linkyboard/components";
import type { BaseResponseDTO } from "@linkyboard/types";

import ky from "ky";

import { clientApi } from ".";

export async function uploadImage(file: File): Promise<string> {
  const ext = file.type;
  if (!ext.includes("image")) {
    errorToast("이미지 파일만 업로드 가능해요.");
    return "";
  }

  try {
    const webpFile = await convertImageToWebP(file);

    const {
      result: { preSignedUrl },
    } = await clientApi
      .get<
        BaseResponseDTO<{ preSignedUrl: string }>
      >("generate-presigned-url", { searchParams: { fileName: webpFile.name } })
      .json();

    // S3 URL을 프록시 URL로 변경
    const proxyUrl = preSignedUrl.replace(S3_BASE_URL, "/api/s3");

    await ky
      .put(proxyUrl, {
        body: webpFile,
        headers: {
          "Content-Type": "image/webp",
        },
        retry: 0,
      })
      .json();

    const urlObj = new URL(preSignedUrl);
    const fileName = urlObj.pathname.split("/linkyboard-bucket/")[1];

    const {
      result: { preSignedUrl: imageUrl },
    } = await clientApi
      .get<BaseResponseDTO<{ preSignedUrl: string }>>("images", { searchParams: { fileName } })
      .json();

    return imageUrl;
  } catch (err) {
    console.error(err);
    errorToast("이미지 업로드에 실패했어요.");
    return "";
  }
}
