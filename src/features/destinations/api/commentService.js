import { Platform } from "react-native";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { apiClient } from "../../../config/apiClient";

export async function getCommentsApi(destinationId) {
  const data = await apiClient.get(`/destinations/${destinationId}/comments`);
  return {
    destinationId: data?.destinationId,
    averageRating: data?.averageRating ?? 0,
    totalComments: data?.totalComments ?? 0,
    comments: (data?.comments || []).map((item) => ({
      id: item.id,
      userId: item.userId,
      user_id: item.userId,
      userName: item.userName,
      user_name: item.userName,
      userAvatarUrl: item.userAvatarUrl,
      avatar_url: item.userAvatarUrl,
      avatarUrl: item.userAvatarUrl,
      destinationId: item.destinationId,
      destination_id: item.destinationId,
      rating: item.rating,
      content: item.content,
      comment: item.content,
      createdAt: item.createdAt,
      created_at: item.createdAt,
      updatedAt: item.updatedAt,
      updated_at: item.updatedAt,
      helpfulCount: Number(item.helpfulCount ?? item.helpful_count ?? 0),
      isHelpful: Boolean(item.isHelpful ?? item.is_helpful ?? false),
      photos: (item.photos || []).map((p) => ({
        id: p.id,
        url: p.url,
        orderIndex: p.orderIndex,
      })),
    })),
  };
}

export async function createCommentApi(destinationId, { rating, content, images = [] }) {
  if (Array.isArray(images) && images.length > 0) {
    const formData = new FormData();
    formData.append("rating", String(Math.round(Number(rating))));
    formData.append("content", content.trim());

    for (let i = 0; i < images.length; i++) {
      const uri = images[i];
      let manipulatedUri = uri;
      try {
        const manipulated = await manipulateAsync(
          uri,
          [],
          { format: SaveFormat.WEBP, compress: 0.85 }
        );
        manipulatedUri = manipulated.uri;
      } catch {
        manipulatedUri = uri;
      }

      const filename = `comment_${Date.now()}_${i}.webp`;

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

    return apiClient.post(`/destinations/${destinationId}/comments`, formData);
  }

  return apiClient.post(`/destinations/${destinationId}/comments`, {
    rating: Math.round(Number(rating)),
    content: content.trim(),
  });
}

export async function updateCommentApi(commentId, { rating, content, keptPhotoIds, newImages = [] }) {
  if (keptPhotoIds !== undefined || (Array.isArray(newImages) && newImages.length > 0)) {
    const formData = new FormData();
    formData.append("rating", String(Math.round(Number(rating))));
    formData.append("content", content.trim());

    if (Array.isArray(keptPhotoIds)) {
      keptPhotoIds.forEach((id) => {
        formData.append("keepPhotoIds", id);
      });
    }

    if (Array.isArray(newImages) && newImages.length > 0) {
      for (let i = 0; i < newImages.length; i++) {
        const uri = newImages[i];
        let manipulatedUri = uri;
        try {
          const manipulated = await manipulateAsync(
            uri,
            [],
            { format: SaveFormat.WEBP, compress: 0.85 }
          );
          manipulatedUri = manipulated.uri;
        } catch {
          manipulatedUri = uri;
        }

        const filename = `comment_${Date.now()}_${i}.webp`;

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

    return apiClient.put(`/comments/${commentId}`, formData);
  }

  return apiClient.put(`/comments/${commentId}`, {
    rating: Math.round(Number(rating)),
    content: content.trim(),
  });
}

export async function deleteCommentApi(commentId) {
  return apiClient.delete(`/comments/${commentId}`);
}

export async function toggleCommentHelpfulApi(commentId) {
  return apiClient.post(`/comments/${commentId}/helpful`);
}
