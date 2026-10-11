import { apiClient } from "../../../config/apiClient";
import { prepareWebpFile } from "../../../shared/utils/webpHelper";

export async function uploadAvatarApi(imageUri) {
  const formData = new FormData();
  const { file, filename } = await prepareWebpFile(imageUri, "avatar", 0);
  formData.append("file", file, filename);

  return apiClient.post("/users/avatar", formData);
}

export async function getProfileApi() {
  return apiClient.get("/users/me");
}

export async function updateProfileApi(data) {
  return apiClient.put("/users/profile", data);
}
