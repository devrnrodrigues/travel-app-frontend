import { Platform } from "react-native";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";

export async function prepareWebpFile(uri, prefix = "image", index = 0, quality = 0.85) {
  const filename = `${prefix}_${Date.now()}_${index}.webp`;

  if (Platform.OS === "web") {
    const res = await fetch(uri);
    const blob = await res.blob();

    let webpBlob = null;

    if (typeof createImageBitmap === "function") {
      try {
        const bitmap = await createImageBitmap(blob);
        const canvas = document.createElement("canvas");
        canvas.width = bitmap.width;
        canvas.height = bitmap.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(bitmap, 0, 0);
        if (typeof bitmap.close === "function") {
          bitmap.close();
        }
        webpBlob = await new Promise((resolve) => {
          canvas.toBlob(
            (b) => resolve(b),
            "image/webp",
            quality
          );
        });
      } catch (err) {
        console.error("createImageBitmap conversion error:", err);
      }
    }

    if (!webpBlob) {
      webpBlob = await new Promise((resolve, reject) => {
        const img = new Image();
        if (typeof uri === "string" && (uri.startsWith("http://") || uri.startsWith("https://"))) {
          img.crossOrigin = "anonymous";
        }
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
              (b) => resolve(b),
              "image/webp",
              quality
            );
          } catch (canvasErr) {
            reject(canvasErr);
          }
        };
        img.onerror = () => reject(new Error("Falha ao carregar imagem para conversão"));
        img.src = uri;
      });
    }

    if (!webpBlob) {
      throw new Error("Não foi possível converter a imagem para WebP");
    }

    const webpFile = new File([webpBlob], filename, { type: "image/webp" });
    return { file: webpFile, filename };
  }

  const manipulated = await manipulateAsync(
    uri,
    [],
    { format: SaveFormat.WEBP, compress: quality }
  );

  return {
    file: {
      uri: manipulated.uri,
      name: filename,
      type: "image/webp",
    },
    filename,
  };
}
