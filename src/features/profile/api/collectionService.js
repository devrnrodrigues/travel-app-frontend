import { apiClient } from "../../../config/apiClient";
import { prepareWebpFile } from "../../../shared/utils/webpHelper";

export async function createCollectionApi({ title, imageUris }) {
  const formData = new FormData();
  formData.append("title", title);

  if (Array.isArray(imageUris)) {
    for (let i = 0; i < imageUris.length; i++) {
      const { file, filename } = await prepareWebpFile(imageUris[i], "collection", i);
      formData.append("files", file, filename);
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
      const { file, filename } = await prepareWebpFile(imageUris[i], "collection", i);
      formData.append("files", file, filename);
    }
  }

  return apiClient.post(`/collections/${collectionId}/photos`, formData);
}

export async function deletePhotoApi(collectionId, photoId) {
  return apiClient.delete(`/collections/${collectionId}/photos/${photoId}`);
}
