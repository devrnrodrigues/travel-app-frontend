import React, { forwardRef, useImperativeHandle, memo } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/details.styles";
import reviewStyles from "../styles/reviews.styles";
import { DetailsReviewsSkeleton, SkeletonBox } from "../../../shared/components/Skeleton";
import FadeInView from "../../../shared/components/FadeInView";
import { ReviewFormModal, DeleteReviewModal } from "./ReviewModals";
import CommentPolaroid from "./CommentPolaroid";
import CommentPhotoViewerModal from "./CommentPhotoViewerModal";
import ReviewDropdownMenu from "./ReviewDropdownMenu";
import useReviews from "../hooks/useReviews";

const HIT_SLOP_8 = { top: 8, bottom: 8, left: 8, right: 8 };
const HIT_SLOP_10 = { top: 10, bottom: 10, left: 10, right: 10 };

function formatReviewDate(dateString) {
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
}

const ReviewsSection = forwardRef(function ReviewsSection(
  { item, currentUser, currentTheme, isDarkMode, onRatingCalculated },
  ref
) {
  const {
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
  } = useReviews(item, currentUser, onRatingCalculated);

  useImperativeHandle(
    ref,
    () => ({
      fetchReviews,
    }),
    [fetchReviews]
  );

  return (
    <>
      <View style={reviewStyles.commentSectionContainer}>
        <View style={reviewStyles.commentSectionHeader}>
          <View style={styles.rowCenter}>
            <Ionicons
              name="chatbubbles-outline"
              size={18}
              color={currentTheme.accent}
              style={styles.marginRight8}
            />
            <Text style={[reviewStyles.sectionTitle, !isDarkMode && { color: "#111827" }]}>
              Comentários ({loadingReviews ? "..." : reviews.length})
            </Text>
          </View>

          {loadingReviews ? (
            <SkeletonBox
              width={76}
              height={28}
              borderRadius={20}
              isDarkMode={isDarkMode}
            />
          ) : (
            !userReview && (
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
                <Ionicons
                  name="star"
                  size={12}
                  color={currentTheme.accent}
                  style={styles.marginRight4}
                />
                <Text
                  style={[
                    reviewStyles.inlineActionText,
                    { color: currentTheme.accent, fontWeight: "700" },
                  ]}
                >
                  Avaliar
                </Text>
              </TouchableOpacity>
            )
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
                  {
                    backgroundColor: !isDarkMode ? "#F8F9FA" : "#161616",
                  },
                  !isDarkMode
                    ? {
                        borderWidth: 0,
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.09,
                        shadowRadius: 8,
                        elevation: 0,
                      }
                    : null,
                ]}
              >
                <Ionicons
                  name="chatbox-ellipses-outline"
                  size={32}
                  color={!isDarkMode ? "#9CA3AF" : "rgba(255,255,255,0.3)"}
                />
                <Text style={[reviewStyles.emptyText, !isDarkMode && { color: "#6B7280" }]}>
                  Nenhum comentário por aqui ainda. Seja o primeiro a compartilhar sua experiência!
                </Text>
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
                  const isMenuElevated =
                    activeDropdownId === rev.id || elevatedDropdownId === rev.id;
                  const isOwner = Boolean(
                    currentUser &&
                      (rev.user_id === currentUser.id || rev.userId === currentUser.id)
                  );
                  const reviewerName =
                    rev.userName ||
                    rev.user_name ||
                    (isOwner ? currentUser.fullName || currentUser.email : "Viajante");
                  const reviewerAvatar =
                    rev.userAvatarUrl ||
                    rev.avatarUrl ||
                    rev.avatar_url ||
                    (isOwner ? currentUser.avatarUrl : null);

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
                        <View style={reviewStyles.reviewMainBodyRow}>
                          <View style={reviewStyles.reviewTextDetails}>
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
                                  name={
                                    starNum <= Math.round(Number(rev.rating) || 5)
                                      ? "star"
                                      : "star-outline"
                                  }
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
                          </View>

                          {rev.photos && rev.photos.length > 0 && (
                            <CommentPolaroid
                              photos={rev.photos}
                              onOpenViewer={handleOpenPolaroidViewer}
                            />
                          )}
                        </View>

                        <View style={reviewStyles.commentFooterRow}>
                          <TouchableOpacity
                            style={reviewStyles.helpfulButton}
                            onPress={() => toggleHelpful(rev)}
                            activeOpacity={0.7}
                            hitSlop={HIT_SLOP_8}
                          >
                            <Ionicons
                              name={rev.isHelpful ? "thumbs-up" : "thumbs-up-outline"}
                              size={13}
                              color={
                                rev.isHelpful
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
                                  color: rev.isHelpful
                                    ? currentTheme.accent
                                    : !isDarkMode
                                    ? "#9CA3AF"
                                    : "#6B7280",
                                },
                              ]}
                            >
                              {rev.helpfulCount > 0
                                ? `Útil (${rev.helpfulCount})`
                                : "Útil?"}
                            </Text>
                          </TouchableOpacity>

                          <View
                            style={[
                              reviewStyles.menuRelative,
                              { zIndex: isMenuElevated ? 200 : 1 },
                            ]}
                          >
                            <TouchableOpacity
                              style={[
                                reviewStyles.moreOptionsBtn,
                                activeDropdownId === rev.id && {
                                  backgroundColor: !isDarkMode
                                    ? "rgba(0,0,0,0.06)"
                                    : "rgba(255,255,255,0.08)",
                                  borderRadius: 14,
                                },
                              ]}
                              onPress={() => handleToggleDropdown(rev.id)}
                              activeOpacity={0.7}
                              hitSlop={HIT_SLOP_10}
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
                              onAnimationEnd={() =>
                                handleDropdownAnimationEnd(rev.id)
                              }
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
        onClose={() => {
          setShowForm(false);
          setReviewToEdit(null);
        }}
        editingReviewId={editingReviewId}
        initialPhotos={reviewToEdit?.photos || []}
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
        visible={Boolean(reviewToDelete)}
        onClose={() => setReviewToDelete(null)}
        onConfirm={confirmDeleteReview}
        isDeleting={isDeletingReview}
        isDarkMode={isDarkMode}
      />

      <CommentPhotoViewerModal
        visible={viewerConfig.visible}
        photos={viewerConfig.photos}
        initialIndex={viewerConfig.initialIndex}
        onClose={handleClosePolaroidViewer}
      />
    </>
  );
});

export default memo(ReviewsSection);
