import { Platform } from "react-native";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { apiClient } from "../../../config/apiClient";

export async function createCollectionApi({ title, imageUris }) {
  const formData = new FormData();
  formData.append("title", title);

  if (Array.isArray(imageUris)) {
    for (let i = 0; i < imageUris.length; i++) {
      const uri = imageUris[i];
      let manipulatedUri = uri;
      try {
        const manipulated = await manipulateAsync(
          uri,
          [],
          { format: SaveFormat.WEBP }
        );
        manipulatedUri = manipulated.uri;
      } catch (e) {
        manipulatedUri = uri;
      }

      const filename = `photo_${Date.now()}_${i}.webp`;

      if (Platform.OS === "web") {
        try {
          const res = await fetch(manipulatedUri);
          const blob = await res.blob();
          formData.append("files", blob, filename);
        } catch {
          formData.append("files", {
            uri: manipulatedUri,
            name: filename,
            type: "image/webp",
          });
        }
      } else {
        formData.append("files", {
          uri: manipulatedUri,
          name: filename,
          type: "image/webp",
        });
      }
    }
  }

  return apiClient.post("/collections", formData);
}

export async function getCollectionsApi() {
  return apiClient.get("/collections");
}

export async function updatePhotoCaptionApi(collectionId, photoId, caption) {
  return apiClient.put(`/collections/${collectionId}/photos/${photoId}`, {
    caption,
  });
}
