export const convertImageToWebP = (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        img.src = reader.result;
      }
    };

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas context error"));

      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("WebP 변환 실패"));
        const webpFile = new File([blob], file.name.replace(/\.\w+$/, ".webp"), {
          type: "image/webp",
        });
        resolve(webpFile);
      }, "image/webp");
    };

    img.onerror = reject;
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
};
