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

export async function updateCollectionApi(collectionId, { title, deletePhotoIds }) {
  return apiClient.put(`/collections/${collectionId}`, {
    title,
    deletePhotoIds: Array.isArray(deletePhotoIds) ? deletePhotoIds : [],
  });
}

export async function deleteCollectionApi(collectionId) {
  return apiClient.delete(`/collections/${collectionId}`);
}

export async function addPhotosToCollectionApi(collectionId, imageUris) {
  const formData = new FormData();

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
    }
  }

  return apiClient.post(`/collections/${collectionId}/photos`, formData);
}

export async function deletePhotoApi(collectionId, photoId) {
  return apiClient.delete(`/collections/${collectionId}/photos/${photoId}`);
}
