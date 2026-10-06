import { useState, useEffect, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getCommentsApi,
  createCommentApi,
  updateCommentApi,
  deleteCommentApi,
  toggleCommentHelpfulApi,
} from "../api/commentService";

export function useReviews(item, currentUser, onRatingCalculated) {
  const queryClient = useQueryClient();
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [inputComment, setInputComment] = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [openedFromAvaliarBtn, setOpenedFromAvaliarBtn] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeletingReview, setIsDeletingReview] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [elevatedDropdownId, setElevatedDropdownId] = useState(null);
  const [reportedReviews, setReportedReviews] = useState({});
  const [viewerConfig, setViewerConfig] = useState({
    visible: false,
    photos: [],
    initialIndex: 0,
  });

  const handleOpenPolaroidViewer = useCallback((photos, index) => {
    setViewerConfig({
      visible: true,
      photos,
      initialIndex: index,
    });
  }, []);

  const handleClosePolaroidViewer = useCallback(() => {
    setViewerConfig((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleToggleDropdown = useCallback((id) => {
    setActiveDropdownId((prev) => {
      if (prev === id) {
        return null;
      }
      setElevatedDropdownId(id);
      return id;
    });
  }, []);

  const handleDropdownAnimationEnd = useCallback((id) => {
    setElevatedDropdownId((prev) => (prev === id ? null : prev));
  }, []);

  const fetchReviews = useCallback(
    async (isPull = false) => {
      if (!item?.id) return;
      try {
        if (!isPull) {
          setLoadingReviews(true);
          if (onRatingCalculated) onRatingCalculated("...", true);
        }
        const data = await getCommentsApi(item.id);
        const list = data.comments || [];
        setReviews(list);
        if (list.length > 0) {
          const calculated =
            Number(data.averageRating || 0) > 0
              ? Number(data.averageRating).toFixed(1)
              : (
                  list.reduce((sum, review) => sum + Number(review.rating), 0) /
                  list.length
                ).toFixed(1);
          if (onRatingCalculated) onRatingCalculated(calculated, false);
        } else {
          if (onRatingCalculated) onRatingCalculated("N/A", false);
        }
      } catch {
        if (onRatingCalculated) onRatingCalculated("N/A", false);
      } finally {
        setLoadingReviews(false);
      }
    },
    [item?.id, onRatingCalculated]
  );

  useEffect(() => {
    if (item?.id) {
      fetchReviews();
    }
  }, [item?.id, fetchReviews]);

  const toggleHelpful = useCallback(
    async (rev) => {
      if (!currentUser) {
        alert("Você precisa estar logado para curtir uma avaliação.");
        return;
      }

      const reviewId = rev.id;
      const wasHelpful = Boolean(rev.isHelpful);
      const previousCount = Number(rev.helpfulCount) || 0;
      const newHelpful = !wasHelpful;
      const newCount = newHelpful ? previousCount + 1 : Math.max(0, previousCount - 1);

      setReviews((prev) =>
        prev.map((r) =>
          r.id === reviewId
            ? { ...r, isHelpful: newHelpful, helpfulCount: newCount }
            : r
        )
      );

      try {
        const response = await toggleCommentHelpfulApi(reviewId);
        if (response && response.id) {
          setReviews((prev) =>
            prev.map((r) =>
              r.id === reviewId
                ? {
                    ...r,
                    isHelpful: Boolean(response.isHelpful),
                    helpfulCount: Number(response.helpfulCount ?? newCount),
                  }
                : r
            )
          );
        }
      } catch (err) {
        setReviews((prev) =>
          prev.map((r) =>
            r.id === reviewId
              ? { ...r, isHelpful: wasHelpful, helpfulCount: previousCount }
              : r
          )
        );
        alert(err.message || "Não foi possível registrar seu voto. Tente novamente.");
      }
    },
    [currentUser]
  );

  const handleReportReview = useCallback(
    (rev) => {
      if (reportedReviews[rev.id]) {
        alert("Você já denunciou este comentário. Nossa equipe está analisando.");
        return;
      }
      setReportedReviews((prev) => ({ ...prev, [rev.id]: true }));
      alert("Comentário reportado com sucesso. Nossa equipe irá analisar.");
    },
    [reportedReviews]
  );

  const userReview = useMemo(() => {
    if (!currentUser || !reviews || reviews.length === 0) return null;
    return (
      reviews.find(
        (rev) => rev.user_id === currentUser.id || rev.userId === currentUser.id
      ) || null
    );
  }, [currentUser, reviews]);

  const handleOpenReviewModal = useCallback(() => {
    if (!currentUser) {
      alert("Você precisa estar logado para avaliar.");
      return;
    }
    setOpenedFromAvaliarBtn(true);
    if (userReview) {
      setSelectedRating(Number(userReview.rating) || 5);
      setInputComment(userReview.content || userReview.comment || "");
      setEditingReviewId(userReview.id);
      setReviewToEdit(userReview);
    } else {
      setSelectedRating(5);
      setInputComment("");
      setEditingReviewId(null);
      setReviewToEdit(null);
    }
    setShowForm(true);
  }, [currentUser, userReview]);

  const handleEditReview = useCallback((rev) => {
    setOpenedFromAvaliarBtn(false);
    setSelectedRating(Number(rev.rating) || 5);
    setInputComment(rev.content || rev.comment || "");
    setEditingReviewId(rev.id);
    setReviewToEdit(rev);
    setShowForm(true);
  }, []);

  const confirmDeleteReview = useCallback(async () => {
    if (!reviewToDelete) return;
    try {
      setIsDeletingReview(true);
      await deleteCommentApi(reviewToDelete.id);
      setReviewToDelete(null);
      fetchReviews();
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    } catch (err) {
      alert(err.message || "Não foi possível excluir o comentário.");
    } finally {
      setIsDeletingReview(false);
    }
  }, [reviewToDelete, fetchReviews, queryClient]);

  const handleSendReview = useCallback(
    async (photoData = {}) => {
      const trimmed = inputComment.trim();
      if (!trimmed) {
        alert("Por favor, escreva um comentário antes de enviar.");
        return;
      }
      const keptPhotoIds = Array.isArray(photoData)
        ? []
        : photoData?.keptPhotoIds || [];
      const newImages = Array.isArray(photoData)
        ? photoData
        : photoData?.newImages || [];
      const clearPhotos = Boolean(photoData?.clearPhotos);

      try {
        setIsSubmitting(true);
        if (editingReviewId) {
          await updateCommentApi(editingReviewId, {
            rating: selectedRating,
            content: trimmed,
            keptPhotoIds,
            newImages,
            clearPhotos,
          });
        } else {
          await createCommentApi(item.id, {
            rating: selectedRating,
            content: trimmed,
            images: newImages,
          });
        }
        setInputComment("");
        setSelectedRating(5);
        setEditingReviewId(null);
        setReviewToEdit(null);
        setShowForm(false);
        fetchReviews();
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      } catch (err) {
        alert(err.message || "Não foi possível enviar sua avaliação.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [inputComment, editingReviewId, selectedRating, item?.id, fetchReviews, queryClient]
  );

  return {
    reviews,
    loadingReviews,
    inputComment,
    setInputComment,
    selectedRating,
    setSelectedRating,
    isSubmitting,
    showForm,
    setShowForm,
    editingReviewId,
    reviewToEdit,
    setReviewToEdit,
    openedFromAvaliarBtn,
    reviewToDelete,
    setReviewToDelete,
    isDeletingReview,
    activeDropdownId,
    setActiveDropdownId,
    elevatedDropdownId,
    viewerConfig,
    userReview,
    fetchReviews,
    toggleHelpful,
    handleReportReview,
    handleOpenReviewModal,
    handleEditReview,
    confirmDeleteReview,
    handleSendReview,
    handleOpenPolaroidViewer,
    handleClosePolaroidViewer,
    handleToggleDropdown,
    handleDropdownAnimationEnd,
  };
}

export default useReviews;
