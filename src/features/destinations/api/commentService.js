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
    })),
  };
}

export async function createCommentApi(destinationId, { rating, content }) {
  return apiClient.post(`/destinations/${destinationId}/comments`, {
    rating: Math.round(Number(rating)),
    content: content.trim(),
  });
}

export async function updateCommentApi(commentId, { rating, content }) {
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
