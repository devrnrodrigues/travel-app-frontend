import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import styles from "../styles/details.styles";
import reviewStyles from "../styles/reviews.styles";
import {
  getCommentsApi,
  createCommentApi,
  updateCommentApi,
  deleteCommentApi,
} from "../api/commentService";
import { DetailsReviewsSkeleton } from "../../../shared/components/Skeleton";
import FadeInView from "../../../shared/components/FadeInView";
import { ReviewFormModal, DeleteReviewModal } from "./ReviewModals";

const ReviewDropdownMenu = React.memo(function ReviewDropdownMenu({
  visible,
  isOwner,
  onEdit,
  onDelete,
  onReport,
  isDarkMode,
  onAnimationEnd,
}) {
  const [shouldRender, setShouldRender] = useState(visible);
  const anim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      Animated.timing(anim, {
        toValue: 1,
        duration: 180,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: true,
      }).start();
    } else if (shouldRender) {
      Animated.timing(anim, {
        toValue: 0,
        duration: 140,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setShouldRender(false);
          if (onAnimationEnd) {
            onAnimationEnd();
          }
        }
      });
    }
  }, [visible]);

  if (!shouldRender) return null;

  const opacity = anim;
  const scale = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.85, 1],
  });
  const translateY = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [8, 0],
  });

  return (
    <Animated.View
      style={[
        reviewStyles.anchoredDropdown,
        !isDarkMode && reviewStyles.anchoredDropdownLight,
        {
          opacity,
          transform: [{ scale }, { translateY }],
        },
      ]}
    >
      {isOwner ? (
        <>
          <TouchableOpacity
            style={reviewStyles.anchoredDropdownItem}
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <Feather name="edit-2" size={13} color={!isDarkMode ? "#374151" : "#FFFFFF"} style={styles.marginRight8} />
            <Text style={[reviewStyles.anchoredDropdownText, !isDarkMode && { color: "#374151" }]}>
              Editar
            </Text>
          </TouchableOpacity>

          <View style={[reviewStyles.anchoredDropdownDivider, !isDarkMode && reviewStyles.anchoredDropdownDividerLight]} />

          <TouchableOpacity
            style={reviewStyles.anchoredDropdownItem}
            onPress={onDelete}
            activeOpacity={0.7}
          >
            <Feather name="trash-2" size={13} color="#FF453A" style={styles.marginRight8} />
            <Text style={[reviewStyles.anchoredDropdownText, { color: "#FF453A" }]}>
              Excluir
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <TouchableOpacity
          style={reviewStyles.anchoredDropdownItem}
          onPress={onReport}
          activeOpacity={0.7}
        >
          <Ionicons name="flag-outline" size={13} color={!isDarkMode ? "#374151" : "#FFFFFF"} style={styles.marginRight8} />
          <Text style={[reviewStyles.anchoredDropdownText, !isDarkMode && { color: "#374151" }]}>
            Reportar
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
});

export default function ReviewsSection({
  item,
  currentUser,
  currentTheme,
  isDarkMode,
  onRatingCalculated,
}) {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [inputComment, setInputComment] = useState("");
  const [selectedRating, setSelectedRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [openedFromAvaliarBtn, setOpenedFromAvaliarBtn] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);
  const [isDeletingReview, setIsDeletingReview] = useState(false);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [elevatedDropdownId, setElevatedDropdownId] = useState(null);
  const [helpfulReviews, setHelpfulReviews] = useState({});
  const [reportedReviews, setReportedReviews] = useState({});

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

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      if (onRatingCalculated) onRatingCalculated("...", true);
      const data = await getCommentsApi(item.id);
      const list = data.comments || [];
      setReviews(list);
      if (list.length > 0) {
        const calculated = Number(data.averageRating || 0) > 0
          ? Number(data.averageRating).toFixed(1)
          : (list.reduce((sum, review) => sum + Number(review.rating), 0) / list.length).toFixed(1);
        if (onRatingCalculated) onRatingCalculated(calculated, false);
      } else {
        if (onRatingCalculated) onRatingCalculated("N/A", false);
      }
    } catch {
      if (onRatingCalculated) onRatingCalculated("N/A", false);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (item?.id) {
      fetchReviews();
    }
  }, [item?.id]);

  const toggleHelpful = (reviewId) => {
    setHelpfulReviews((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const handleReportReview = (rev) => {
    if (reportedReviews[rev.id]) {
      alert("Você já denunciou este comentário. Nossa equipe está analisando.");
      return;
    }
    setReportedReviews((prev) => ({ ...prev, [rev.id]: true }));
    alert("Comentário reportado com sucesso. Nossa equipe irá analisar.");
  };

  const formatReviewDate = (dateString) => {
    if (!dateString) {
      const d = new Date();
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    try {
      const d = new Date(dateString);
      if (isNaN(d.getTime())) return "";
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch {
      return "";
    }
  };

  const userReview = useMemo(() => {
    if (!currentUser || !reviews || reviews.length === 0) return null;
    return reviews.find((rev) => rev.user_id === currentUser.id || rev.userId === currentUser.id) || null;
  }, [currentUser, reviews]);

  const handleOpenReviewModal = () => {
    if (!currentUser) {
      alert("Você precisa estar logado para avaliar.");
      return;
    }
    setOpenedFromAvaliarBtn(true);
    if (userReview) {
      setSelectedRating(Number(userReview.rating) || 5);
      setInputComment(userReview.content || userReview.comment || "");
      setEditingReviewId(userReview.id);
    } else {
      setSelectedRating(5);
      setInputComment("");
      setEditingReviewId(null);
    }
    setShowForm(true);
  };

  const handleEditReview = (rev) => {
    setOpenedFromAvaliarBtn(false);
    setSelectedRating(Number(rev.rating) || 5);
    setInputComment(rev.content || rev.comment || "");
    setEditingReviewId(rev.id);
    setShowForm(true);
  };

  const confirmDeleteReview = async () => {
    if (!reviewToDelete) return;
    try {
      setIsDeletingReview(true);
      await deleteCommentApi(reviewToDelete.id);
      setReviewToDelete(null);
      fetchReviews();
    } catch (err) {
      alert(err.message || "Não foi possível excluir o comentário.");
    } finally {
      setIsDeletingReview(false);
    }
  };

  const handleSendReview = async () => {
    const trimmed = inputComment.trim();
    if (!trimmed) {
      alert("Por favor, escreva um comentário antes de enviar.");
      return;
    }
    try {
      setIsSubmitting(true);
      if (editingReviewId) {
        await updateCommentApi(editingReviewId, {
          rating: selectedRating,
          content: trimmed,
        });
      } else {
        await createCommentApi(item.id, {
          rating: selectedRating,
          content: trimmed,
        });
      }
      setInputComment("");
      setSelectedRating(5);
      setEditingReviewId(null);
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      alert(err.message || "Não foi possível enviar sua avaliação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <View style={reviewStyles.commentSectionContainer}>
        <View style={reviewStyles.commentSectionHeader}>
          <View style={styles.rowCenter}>
            <Ionicons name="chatbubbles-outline" size={18} color={currentTheme.accent} style={styles.marginRight8} />
            <Text style={[reviewStyles.sectionTitle, !isDarkMode && { color: "#111827" }]}>
              Comentários ({loadingReviews ? "..." : reviews.length})
            </Text>
          </View>

          {!userReview && (
            <TouchableOpacity
              style={[
                reviewStyles.inlineActionBtn,
                {
                  borderColor: currentTheme.accent,
                  borderWidth: 1,
                  borderRadius: 20,
                },
                !isDarkMode && {
                  backgroundColor: "#FFFFFF",
                  shadowOpacity: 0,
                  elevation: 0,
                  shadowColor: "transparent",
                  shadowRadius: 0,
                  shadowOffset: { width: 0, height: 0 },
                },
              ]}
              onPress={handleOpenReviewModal}
              activeOpacity={0.7}
            >
              <Ionicons name="star" size={12} color={currentTheme.accent} style={styles.marginRight4} />
              <Text style={[reviewStyles.inlineActionText, { color: currentTheme.accent, fontWeight: "700" }]}>
                Avaliar
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {loadingReviews ? (
          <DetailsReviewsSkeleton isDarkMode={isDarkMode} count={2} />
        ) : (
          <FadeInView duration={260}>
            {reviews.length === 0 ? (
              <View
                style={[
                  reviewStyles.emptyBox,
                  !isDarkMode && {
                    backgroundColor: "#FFFFFF",
                    borderWidth: 0,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.04,
                    shadowRadius: 5,
                    elevation: 1,
                  },
                ]}
              >
                <Ionicons name="chatbox-ellipses-outline" size={32} color={!isDarkMode ? "#9CA3AF" : "rgba(255,255,255,0.3)"} />
                <Text style={[reviewStyles.emptyText, !isDarkMode && { color: "#6B7280" }]}>Nenhum comentário por aqui ainda. Seja o primeiro a compartilhar sua experiência!</Text>
              </View>
            ) : (
              <View style={[reviewStyles.commentsFeed, { position: "relative" }]}>
                {activeDropdownId !== null && (
                  <Pressable
                    style={[StyleSheet.absoluteFill, { zIndex: 50 }]}
                    onPress={() => setActiveDropdownId(null)}
                  />
                )}
                {reviews.map((rev) => {
                  const isMenuElevated = activeDropdownId === rev.id || elevatedDropdownId === rev.id;
                  const isOwner = Boolean(currentUser && (rev.user_id === currentUser.id || rev.userId === currentUser.id));
                  const reviewerName = rev.userName || rev.user_name || (isOwner ? (currentUser.fullName || currentUser.email) : "Viajante");
                  const reviewerAvatar = rev.userAvatarUrl || rev.avatarUrl || rev.avatar_url || rev.user_avatar || (isOwner ? currentUser.avatarUrl : null);
                  return (
                    <View
                      key={rev.id}
                      style={[
                        reviewStyles.reviewCard,
                        !isDarkMode && reviewStyles.reviewCardLight,
                        isMenuElevated && { zIndex: 100 },
                      ]}
                    >
                      <View
                        style={[
                          reviewStyles.avatarContainer,
                          !isDarkMode && reviewStyles.avatarContainerLight,
                        ]}
                      >
                        {reviewerAvatar ? (
                          <Image
                            source={{ uri: reviewerAvatar }}
                            style={reviewStyles.avatarImage}
                            resizeMode="cover"
                          />
                        ) : (
                          <Text
                            style={[
                              reviewStyles.avatarInitials,
                              !isDarkMode && { color: "#4B5563" },
                            ]}
                          >
                            {reviewerName ? reviewerName.charAt(0).toUpperCase() : "?"}
                          </Text>
                        )}
                      </View>

                      <View style={reviewStyles.reviewContentColumn}>
                        <View style={styles.rowWrap}>
                          <Text
                            style={[
                              reviewStyles.reviewerName,
                              !isDarkMode && reviewStyles.reviewerNameLight,
                            ]}
                            numberOfLines={1}
                          >
                            {reviewerName}
                          </Text>
                          {isOwner && (
                            <Text
                              style={[
                                reviewStyles.reviewerName,
                                {
                                  fontSize: 11.5,
                                  color: !isDarkMode ? "#6B7280" : "#9CA3AF",
                                  fontWeight: "500",
                                  marginLeft: 4,
                                },
                              ]}
                            >
                              (Eu)
                            </Text>
                          )}
                        </View>

                        <View style={reviewStyles.starsShopeeRow}>
                          {[1, 2, 3, 4, 5].map((starNum) => (
                            <Ionicons
                              key={starNum}
                              name={starNum <= Math.round(Number(rev.rating) || 5) ? "star" : "star-outline"}
                              size={12}
                              color={currentTheme.accent}
                              style={styles.marginRight2}
                            />
                          ))}
                        </View>

                        <Text
                          style={[
                            reviewStyles.reviewDate,
                            !isDarkMode && reviewStyles.reviewDateLight,
                          ]}
                        >
                          {formatReviewDate(rev.created_at || rev.createdAt)}
                        </Text>

                        {rev.content || rev.comment ? (
                          <Text
                            style={[
                              reviewStyles.reviewComment,
                              !isDarkMode && reviewStyles.reviewCommentLight,
                            ]}
                          >
                            {rev.content || rev.comment}
                          </Text>
                        ) : null}

                        <View style={reviewStyles.commentFooterRow}>
                          <TouchableOpacity
                            style={reviewStyles.helpfulButton}
                            onPress={() => toggleHelpful(rev.id)}
                            activeOpacity={0.7}
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                          >
                            <Ionicons
                              name={helpfulReviews[rev.id] ? "thumbs-up" : "thumbs-up-outline"}
                              size={13}
                              color={
                                helpfulReviews[rev.id]
                                  ? currentTheme.accent
                                  : !isDarkMode
                                    ? "#9CA3AF"
                                    : "#6B7280"
                              }
                            />
                            <Text
                              style={[
                                reviewStyles.helpfulText,
                                {
                                  color: helpfulReviews[rev.id]
                                    ? currentTheme.accent
                                    : !isDarkMode
                                      ? "#9CA3AF"
                                      : "#6B7280",
                                },
                              ]}
                            >
                              {helpfulReviews[rev.id] ? "Útil (1)" : "Útil?"}
                            </Text>
                          </TouchableOpacity>

                          <View style={[reviewStyles.menuRelative, { zIndex: isMenuElevated ? 200 : 1 }]}>
                            <TouchableOpacity
                              style={[
                                reviewStyles.moreOptionsBtn,
                                activeDropdownId === rev.id && {
                                  backgroundColor: !isDarkMode ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)",
                                  borderRadius: 14,
                                },
                              ]}
                              onPress={() => handleToggleDropdown(rev.id)}
                              activeOpacity={0.7}
                              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                            >
                              <Ionicons
                                name="ellipsis-vertical"
                                size={16}
                                color={
                                  activeDropdownId === rev.id
                                    ? currentTheme.accent
                                    : !isDarkMode
                                      ? "#9CA3AF"
                                      : "#6B7280"
                                }
                              />
                            </TouchableOpacity>

                            <ReviewDropdownMenu
                              visible={activeDropdownId === rev.id}
                              isOwner={isOwner}
                              onEdit={() => {
                                setActiveDropdownId(null);
                                handleEditReview(rev);
                              }}
                              onDelete={() => {
                                setActiveDropdownId(null);
                                setReviewToDelete(rev);
                              }}
                              onReport={() => {
                                setActiveDropdownId(null);
                                handleReportReview(rev);
                              }}
                              isDarkMode={isDarkMode}
                              onAnimationEnd={() => handleDropdownAnimationEnd(rev.id)}
                            />
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </FadeInView>
        )}
      </View>

      <ReviewFormModal
        visible={showForm}
        onClose={() => setShowForm(false)}
        editingReviewId={editingReviewId}
        openedFromAvaliarBtn={openedFromAvaliarBtn}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        inputComment={inputComment}
        setInputComment={setInputComment}
        isSubmitting={isSubmitting}
        onSubmit={handleSendReview}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
      />

      <DeleteReviewModal
        visible={!!reviewToDelete}
        onClose={() => setReviewToDelete(null)}
        onConfirm={confirmDeleteReview}
        isDeleting={isDeletingReview}
        isDarkMode={isDarkMode}
      />
    </>
  );
}
