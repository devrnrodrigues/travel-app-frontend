import { apiClient } from "../../../config/apiClient";

export async function uploadAvatarApi(imageUri) {
  const formData = new FormData();

  const cleanUri = imageUri.split("?")[0];
  const originalName = cleanUri.split("/").pop() || "avatar.webp";
  const filename = originalName.includes(".") ? originalName : `${originalName}.webp`;
  const ext = filename.split(".").pop().toLowerCase();
  const mimeType = ext === "webp" ? "image/webp" : ext === "png" ? "image/png" : "image/jpeg";

  const res = await fetch(imageUri);
  const blob = await res.blob();

  formData.append("file", blob, filename);

  return apiClient.post("/users/avatar", formData);
}
