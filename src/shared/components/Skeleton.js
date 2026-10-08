import homeStyles from "../../features/home/home.styles";
import exploreStyles, { COLUMN_WIDTH, CARD_HEIGHT as EXPLORE_CARD_HEIGHT, GAP } from "../../features/explore/explore.styles";
import favoritesStyles from "../../features/favorites/favorites.styles";
import { styles as profileStyles } from "../../features/profile/profile.styles";
import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = 500;

export function useShimmerAnimation(duration = 2200) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: Platform.OS !== "web",
      })
    );

    animation.start();

    return () => {
      animation.stop();
      animatedValue.stopAnimation();
    };
  }, [animatedValue, duration]);

  return animatedValue;
}

export function ShimmerOverlay({
  animatedValue,
  width: compWidth = CARD_WIDTH,
  height: compHeight = CARD_HEIGHT,
  isDarkMode = true,
  customColors,
}) {
  const shimmerWidth =
    compWidth < 80
      ? Math.max(48, Math.round(compWidth * 2.2))
      : Math.max(160, compWidth * 1.6);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-shimmerWidth, compWidth + shimmerWidth * 0.25],
  });

  const defaultColors = isDarkMode
    ? [
        "rgba(255, 255, 255, 0)",
        "rgba(255, 255, 255, 0.01)",
        "rgba(255, 255, 255, 0.04)",
        "rgba(255, 255, 255, 0.08)",
        "rgba(255, 255, 255, 0.18)",
        "rgba(255, 255, 255, 0.08)",
        "rgba(255, 255, 255, 0.04)",
        "rgba(255, 255, 255, 0.01)",
        "rgba(255, 255, 255, 0)",
      ]
    : [
        "rgba(0, 0, 0, 0)",
        "rgba(0, 0, 0, 0.01)",
        "rgba(0, 0, 0, 0.03)",
        "rgba(0, 0, 0, 0.07)",
        "rgba(0, 0, 0, 0.11)",
        "rgba(0, 0, 0, 0.07)",
        "rgba(0, 0, 0, 0.03)",
        "rgba(0, 0, 0, 0.01)",
        "rgba(0, 0, 0, 0)",
      ];

  const locations = [0, 0.15, 0.3, 0.42, 0.5, 0.58, 0.7, 0.85, 1];
  const colors = customColors || defaultColors;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: shimmerWidth,
        height: compHeight,
        transform: [{ translateX }],
      }}
    >
      <LinearGradient
        colors={colors}
        locations={locations}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={{
          width: shimmerWidth,
          height: compHeight,
        }}
      />
    </Animated.View>
  );
}

export function SkeletonBox({
  width: boxWidth = "100%",
  height: boxHeight = 16,
  borderRadius = 6,
  style,
  isDarkMode = true,
  animatedValue,
}) {
  const localAnim = useShimmerAnimation();
  const anim = animatedValue || localAnim;

  const baseBg = isDarkMode
    ? "rgba(255, 255, 255, 0.07)"
    : "rgba(0, 0, 0, 0.06)";

  const numericWidth = typeof boxWidth === "number" ? boxWidth : 200;

  return (
    <View
      style={[
        {
          width: boxWidth,
          height: boxHeight,
          borderRadius,
          backgroundColor: baseBg,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <ShimmerOverlay
        animatedValue={anim}
        width={numericWidth}
        height={typeof boxHeight === "number" ? boxHeight : 20}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

export function HomeCardSkeleton({
  isDarkMode = true,
  currentTheme,
  animatedValue,
  cardWidth,
  cardHeight,
  cardInfoBottom,
  cardInfoHeight,
}) {
  const localAnim = useShimmerAnimation();
  const anim = animatedValue || localAnim;

  const cardBg = isDarkMode ? "rgba(26, 26, 26, 0.78)" : "rgba(250, 250, 250, 0.30)";
  const placeholderBg1 = isDarkMode
    ? "rgba(255, 255, 255, 0.12)"
    : "rgba(255, 255, 255, 0.20)";
  const placeholderBg2 = isDarkMode
    ? "rgba(255, 255, 255, 0.06)"
    : "rgba(255, 255, 255, 0.10)";
  const cardInfoOverlayBg = isDarkMode
    ? "rgba(12, 12, 12, 0.75)"
    : "rgba(250, 250, 250, 0.30)";

  const actualWidth = cardWidth || CARD_WIDTH;
  const actualHeight = cardHeight || CARD_HEIGHT;

  const titleLineHeight = cardInfoHeight && cardInfoHeight < 96 ? 21 : 24;
  const titleBarHeight = cardInfoHeight && cardInfoHeight < 96 ? 16 : 18;
  const locationLineHeight = cardInfoHeight && cardInfoHeight < 96 ? 14 : 16;
  const locationBarHeight = cardInfoHeight && cardInfoHeight < 96 ? 10 : 11;

  const resolvedBottom =
    cardInfoBottom !== undefined
      ? cardInfoBottom
      : cardHeight
      ? Math.round(Math.max(14, cardHeight * 0.055))
      : undefined;

  const resolvedHeight =
    cardInfoHeight !== undefined
      ? cardInfoHeight
      : cardHeight
      ? Math.round(Math.min(104, Math.max(86, cardHeight * 0.25)))
      : undefined;

  return (
    <View
      style={[
        homeStyles.card,
        cardWidth ? { width: cardWidth } : null,
        cardHeight ? { height: cardHeight } : null,
        {
          backgroundColor: cardBg,
          borderRadius: 40,
          overflow: "hidden",
          borderWidth: 0,
          borderColor: "transparent",
          elevation: 0,
          shadowOpacity: 0,
          shadowColor: "transparent",
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 0,
        },
      ]}
    >
      <View
        style={[
          homeStyles.cardInfo,
          resolvedBottom !== undefined ? { bottom: resolvedBottom } : null,
          resolvedHeight !== undefined ? { height: resolvedHeight } : null,
          {
            backgroundColor: "transparent",
            borderWidth: 0,
            shadowColor: "transparent",
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
            overflow: "hidden",
            paddingHorizontal: 0,
            paddingVertical: 0,
          },
        ]}
      >
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: cardInfoOverlayBg,
              borderRadius: 25,
            },
          ]}
        />

        <View style={homeStyles.cardInfoInner}>
          <View style={homeStyles.cardInfoLeft}>
            <View
              style={{
                height: titleLineHeight,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  height: titleBarHeight,
                  width: "75%",
                  borderRadius: 5,
                  backgroundColor: placeholderBg1,
                }}
              />
            </View>
            <View
              style={{
                height: locationLineHeight,
                justifyContent: "center",
                marginTop: 3,
              }}
            >
              <View
                style={{
                  height: locationBarHeight,
                  width: "45%",
                  borderRadius: 4,
                  backgroundColor: placeholderBg2,
                }}
              />
            </View>
          </View>
        </View>
      </View>

      <ShimmerOverlay
        animatedValue={anim}
        width={actualWidth}
        height={actualHeight}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

export function HomeSkeletonList({
  isDarkMode = true,
  currentTheme,
  cardWidth,
  cardHeight,
  cardInfoBottom,
  cardInfoHeight,
}) {
  const anim = useShimmerAnimation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ width: "100%" }}
      contentContainerStyle={homeStyles.cardsList}
      scrollEnabled={false}
    >
      <HomeCardSkeleton
        isDarkMode={isDarkMode}
        currentTheme={currentTheme}
        animatedValue={anim}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        cardInfoBottom={cardInfoBottom}
        cardInfoHeight={cardInfoHeight}
      />
      <HomeCardSkeleton
        isDarkMode={isDarkMode}
        currentTheme={currentTheme}
        animatedValue={anim}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        cardInfoBottom={cardInfoBottom}
        cardInfoHeight={cardInfoHeight}
      />
      <HomeCardSkeleton
        isDarkMode={isDarkMode}
        currentTheme={currentTheme}
        animatedValue={anim}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        cardInfoBottom={cardInfoBottom}
        cardInfoHeight={cardInfoHeight}
      />
    </ScrollView>
  );
}

export function HomeCategoriesSkeleton({
  isDarkMode = true,
  animatedValue,
}) {
  const localAnim = useShimmerAnimation();
  const anim = animatedValue || localAnim;

  const bg = isDarkMode ? "rgba(255, 255, 255, 0.10)" : "rgba(0, 0, 0, 0.08)";

  const tabWidths = [74, 88, 66, 92, 78];

  return (
    <View style={{ overflow: "hidden", position: "relative" }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        contentContainerStyle={homeStyles.categoriesContainer}
      >
        {tabWidths.map((w, index) => (
          <View key={`cat-skel-${index}`} style={homeStyles.categoryItem}>
            <View style={homeStyles.centerAligned}>
              <View style={homeStyles.rowCenter}>
                <View
                  style={{
                    width: w,
                    height: 16,
                    borderRadius: 5,
                    backgroundColor: bg,
                  }}
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <ShimmerOverlay
        animatedValue={anim}
        width={width}
        height={32}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

export function TopDestinationCardSkeleton({
  isDarkMode = true,
  animatedValue,
  cardWidth = 270,
  cardHeight = 98,
  imageSize = 78,
  titleSize = 16,
  locationSize = 13,
}) {
  const localAnim = useShimmerAnimation();
  const anim = animatedValue || localAnim;

  const cardBg = isDarkMode ? "rgba(26, 26, 26, 0.78)" : "rgba(250, 250, 250, 0.30)";
  const imgBg = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.16)";
  const placeholderBg1 = isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.20)";
  const placeholderBg2 = isDarkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.10)";

  const actualWidth = cardWidth || 270;
  const actualHeight = cardHeight || 98;
  const actualImgSize = imageSize || 78;
  const imgRadius = Math.round(actualImgSize * 0.25);
  const cardRadius = Math.round(actualHeight * 0.26);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        width: actualWidth,
        height: actualHeight,
        borderRadius: cardRadius,
        backgroundColor: cardBg,
        padding: 10,
        marginRight: 14,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <View
        style={{
          width: actualImgSize,
          height: actualImgSize,
          borderRadius: imgRadius,
          backgroundColor: imgBg,
          overflow: "hidden",
        }}
      />

      <View
        style={{
          flex: 1,
          marginLeft: 14,
          marginRight: 10,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            height: titleSize ? Math.round(titleSize * 1.25) : 20,
            justifyContent: "center",
            marginBottom: 4,
          }}
        >
          <View
            style={{
              height: Math.round((titleSize || 16) * 0.8),
              width: "72%",
              borderRadius: 4,
              backgroundColor: placeholderBg1,
            }}
          />
        </View>

        <View
          style={{
            height: locationSize ? Math.round(locationSize * 1.2) : 16,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              height: Math.round((locationSize || 13) * 0.75),
              width: "48%",
              borderRadius: 3,
              backgroundColor: placeholderBg2,
            }}
          />
        </View>
      </View>

      <ShimmerOverlay
        animatedValue={anim}
        width={actualWidth}
        height={actualHeight}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

export function TopDestinationsSkeletonList({
  isDarkMode = true,
  cardWidth,
  cardHeight,
  imageSize,
  titleSize,
  locationSize,
  count = 3,
}) {
  const anim = useShimmerAnimation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      scrollEnabled={false}
      style={{ width: "100%" }}
      contentContainerStyle={homeStyles.topDestinationsList}
    >
      {Array.from({ length: count }).map((_, index) => (
        <TopDestinationCardSkeleton
          key={`top-dest-skel-${index}`}
          isDarkMode={isDarkMode}
          animatedValue={anim}
          cardWidth={cardWidth}
          cardHeight={cardHeight}
          imageSize={imageSize}
          titleSize={titleSize}
          locationSize={locationSize}
        />
      ))}
    </ScrollView>
  );
}

export function ExploreCardSkeleton({
  height = EXPLORE_CARD_HEIGHT,
  isDarkMode = true,
  currentTheme,
  animatedValue,
}) {
  const localAnim = useShimmerAnimation();
  const anim = animatedValue || localAnim;

  const cardBg = isDarkMode ? "rgba(26, 26, 26, 0.78)" : "rgba(180, 180, 180, 0.45)";
  const placeholderBg1 = isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.28)";
  const placeholderBg2 = isDarkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.16)";

  return (
    <View
      style={[
        exploreStyles.gridItem,
        {
          flex: 1,
          height,
          backgroundColor: cardBg,
          overflow: "hidden",
        },
      ]}
    >
      <LinearGradient
        colors={["transparent", isDarkMode ? "rgba(0, 0, 0, 0.86)" : "rgba(0, 0, 0, 0.45)"]}
        style={exploreStyles.bottomOverlay}
      >
        <View
          style={{
            height: 10,
            width: "75%",
            borderRadius: 3,
            backgroundColor: placeholderBg1,
            marginBottom: 4,
          }}
        />
        <View
          style={{
            height: 7,
            width: "45%",
            borderRadius: 2,
            backgroundColor: placeholderBg2,
          }}
        />
      </LinearGradient>

      <ShimmerOverlay
        animatedValue={anim}
        width={COLUMN_WIDTH}
        height={height}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

export function ExploreSkeletonGrid({ isDarkMode = true, currentTheme, rows = 5 }) {
  const anim = useShimmerAnimation();

  return (
    <View style={{ width: "100%", gap: GAP, backgroundColor: isDarkMode ? "#000000" : "#E5E7EB" }}>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <View
          key={`skel-row-${rowIndex}`}
          style={{ flexDirection: "row", width: "100%", gap: GAP }}
        >
          <ExploreCardSkeleton
            isDarkMode={isDarkMode}
            currentTheme={currentTheme}
            animatedValue={anim}
          />
          <ExploreCardSkeleton
            isDarkMode={isDarkMode}
            currentTheme={currentTheme}
            animatedValue={anim}
          />
          <ExploreCardSkeleton
            isDarkMode={isDarkMode}
            currentTheme={currentTheme}
            animatedValue={anim}
          />
        </View>
      ))}
    </View>
  );
}

export function FavoriteCardSkeleton({
  isDarkMode = true,
  animatedValue,
  cardWidth,
  cardHeight,
}) {
  const localAnim = useShimmerAnimation();
  const anim = animatedValue || localAnim;

  const actualWidth = cardWidth || 170;
  const actualHeight = cardHeight || 200;

  const cardBg = isDarkMode ? "rgba(26, 26, 26, 0.78)" : "rgba(250, 250, 250, 0.30)";
  const placeholderBg1 = isDarkMode
    ? "rgba(255, 255, 255, 0.12)"
    : "rgba(255, 255, 255, 0.20)";
  const placeholderBg2 = isDarkMode
    ? "rgba(255, 255, 255, 0.06)"
    : "rgba(255, 255, 255, 0.10)";

  return (
    <View
      style={[
        favoritesStyles.card,
        {
          width: actualWidth,
          height: actualHeight,
          backgroundColor: cardBg,
          borderRadius: 18,
          overflow: "hidden",
        },
      ]}
    >
      <View style={favoritesStyles.cardInner}>
        <LinearGradient
          colors={
            isDarkMode
              ? ["transparent", "rgba(0, 0, 0, 0.35)", "rgba(0, 0, 0, 0.75)"]
              : ["transparent", "rgba(0, 0, 0, 0.15)", "rgba(0, 0, 0, 0.45)"]
          }
          locations={[0, 0.42, 1]}
          style={favoritesStyles.cardOverlay}
        >
          <View
            style={{
              height: 18,
              justifyContent: "center",
              marginBottom: 3,
            }}
          >
            <View
              style={{
                height: 13,
                width: "72%",
                borderRadius: 4,
                backgroundColor: placeholderBg1,
              }}
            />
          </View>
          <View style={favoritesStyles.locationRow}>
            <View
              style={{
                width: 11,
                height: 11,
                borderRadius: 3,
                backgroundColor: placeholderBg2,
              }}
            />
            <View
              style={{
                height: 15,
                justifyContent: "center",
                marginLeft: 4,
                width: "48%",
              }}
            >
              <View
                style={{
                  height: 10,
                  width: "100%",
                  borderRadius: 3,
                  backgroundColor: placeholderBg2,
                }}
              />
            </View>
          </View>
        </LinearGradient>

        <ShimmerOverlay
          animatedValue={anim}
          width={actualWidth}
          height={actualHeight}
          isDarkMode={isDarkMode}
        />
      </View>
    </View>
  );
}

export function FavoritesSkeletonList({
  isDarkMode = true,
  count = 6,
  cardWidth,
  cardHeight,
}) {
  const anim = useShimmerAnimation();

  const pairs = [];
  for (let i = 0; i < count; i += 2) {
    pairs.push([i, i + 1 < count ? i + 1 : null]);
  }

  return (
    <View style={favoritesStyles.listContent}>
      {pairs.map(([first, second], rowIndex) => (
        <View
          key={`fav-row-${rowIndex}`}
          style={favoritesStyles.columnWrapper}
        >
          <FavoriteCardSkeleton
            key={`fav-card-${first}`}
            isDarkMode={isDarkMode}
            animatedValue={anim}
            cardWidth={cardWidth}
            cardHeight={cardHeight}
          />
          {second !== null && (
            <FavoriteCardSkeleton
              key={`fav-card-${second}`}
              isDarkMode={isDarkMode}
              animatedValue={anim}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
            />
          )}
        </View>
      ))}
    </View>
  );
}

export function SearchCardSkeleton({
  cardHeight = 72,
  cardMarginBottom = 10,
  titleWidth = "60%",
  locationWidth = "38%",
  isDarkMode = true,
  animatedValue,
}) {
  const localAnim = useShimmerAnimation();
  const anim = animatedValue || localAnim;

  const cardBg = isDarkMode ? "rgba(26, 26, 26, 0.78)" : "rgba(250, 250, 250, 0.30)";
  const thumbBg = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.16)";
  const placeholderBg1 = isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.20)";
  const placeholderBg2 = isDarkMode ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.10)";

  const imageSize = Math.max(48, cardHeight - 20);
  const cardWidth = width - 40;

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: cardBg,
        borderRadius: 18,
        paddingVertical: 10,
        paddingHorizontal: 14,
        height: cardHeight,
        marginBottom: cardMarginBottom,
        flexDirection: "row",
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <View
        style={{
          width: imageSize,
          height: imageSize,
          borderRadius: 13,
          backgroundColor: thumbBg,
        }}
      />

      <View style={{ marginLeft: 14, flex: 1, justifyContent: "center" }}>
        <View
          style={{
            height: 14,
            width: titleWidth,
            borderRadius: 4,
            backgroundColor: placeholderBg1,
            marginBottom: 6,
          }}
        />
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2 }}>
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              backgroundColor: placeholderBg2,
              marginRight: 5,
            }}
          />
          <View
            style={{
              height: 10,
              width: locationWidth,
              borderRadius: 3,
              backgroundColor: placeholderBg2,
            }}
          />
        </View>
      </View>

      <ShimmerOverlay
        animatedValue={anim}
        width={cardWidth}
        height={cardHeight}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

export function SearchSkeletonList({
  isDarkMode = true,
  cardHeight = 72,
  cardMarginBottom = 10,
  count = 7,
}) {
  const anim = useShimmerAnimation();
  const variations = [
    { title: "65%", loc: "40%" },
    { title: "52%", loc: "34%" },
    { title: "72%", loc: "46%" },
    { title: "58%", loc: "30%" },
    { title: "64%", loc: "42%" },
    { title: "48%", loc: "36%" },
  ];

  return (
    <View style={{ width: "100%", paddingHorizontal: 20, paddingTop: 6 }}>
      {Array.from({ length: count }).map((_, i) => {
        const v = variations[i % variations.length];
        return (
          <SearchCardSkeleton
            key={`search-skel-${i}`}
            cardHeight={cardHeight}
            cardMarginBottom={cardMarginBottom}
            titleWidth={v.title}
            locationWidth={v.loc}
            isDarkMode={isDarkMode}
            animatedValue={anim}
          />
        );
      })}
    </View>
  );
}

export function ProfileAvatarSkeleton({ size = 102, isDarkMode = true }) {
  const anim = useShimmerAnimation();

  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        borderRadius: size / 2,
        backgroundColor: isDarkMode ? "#1A1A1E" : "#E5E7EB",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <ShimmerOverlay
        animatedValue={anim}
        width={size}
        height={size}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

export function ProfileSkeletonBar({
  width: barW,
  height: barH,
  borderRadius = 4,
  bg,
  isDarkMode = true,
  anim: externalAnim,
  style,
}) {
  const localAnim = useShimmerAnimation();
  const anim = externalAnim || localAnim;
  const defaultBg = isDarkMode ? "rgba(255, 255, 255, 0.09)" : "#E5E7EB";

  const numW = typeof barW === "number" ? barW : 150;
  const numH = typeof barH === "number" ? barH : 20;

  return (
    <View
      style={[
        {
          width: barW,
          height: barH,
          borderRadius,
          backgroundColor: bg || defaultBg,
          overflow: "hidden",
          position: "relative",
        },
        style,
      ]}
    >
      <ShimmerOverlay
        animatedValue={anim}
        width={numW}
        height={numH}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

export function ProfileCollectionCardSkeleton({
  isDarkMode = true,
  anim: externalAnim,
  scale = 1,
  cardWidth = 180,
  cardHeight = 260,
  cardBorderRadius = 22,
  cardGradientHeight = 95,
  cardGradientPadding = 14,
  cardTitleFontSize = 15,
  cardSubFontSize = 12,
}) {
  const localAnim = useShimmerAnimation();
  const anim = externalAnim || localAnim;

  const cardBg = isDarkMode ? "rgba(255, 255, 255, 0.05)" : "#E2E2E2";
  const placeholderBg1 = isDarkMode ? "rgba(255, 255, 255, 0.09)" : "rgba(0, 0, 0, 0.12)";
  const placeholderBg2 = isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.06)";

  return (
    <View
      style={[
        profileStyles.collectionCardItem,
        scale < 1 && {
          width: cardWidth,
          height: cardHeight,
          borderRadius: cardBorderRadius,
        },
        { backgroundColor: cardBg, overflow: "hidden", position: "relative" },
      ]}
    >
      <View
        style={[
          profileStyles.collectionCardGradient,
          scale < 1 && {
            height: cardGradientHeight,
            padding: cardGradientPadding,
          },
        ]}
      >
        <View style={{ height: scale < 1 ? Math.round(19 * scale) : 19, justifyContent: "center" }}>
          <View
            style={{
              height: Math.round(cardTitleFontSize * 0.8),
              width: "70%",
              borderRadius: 4,
              backgroundColor: placeholderBg1,
            }}
          />
        </View>
        <View style={{ height: scale < 1 ? Math.round(15 * scale) : 15, marginTop: 3, justifyContent: "center" }}>
          <View
            style={{
              height: Math.round(cardSubFontSize * 0.8),
              width: "40%",
              borderRadius: 3,
              backgroundColor: placeholderBg2,
            }}
          />
        </View>
      </View>
      <ShimmerOverlay
        animatedValue={anim}
        width={cardWidth}
        height={cardHeight}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

export function ProfileCollectionsSkeletonList({
  isDarkMode = true,
  scale = 1,
  cardWidth = 180,
  cardHeight = 260,
  cardBorderRadius = 22,
  cardGradientHeight = 95,
  cardGradientPadding = 14,
  cardTitleFontSize = 15,
  cardSubFontSize = 12,
}) {
  const anim = useShimmerAnimation();

  return (
    <View style={{ flexDirection: "row", gap: Math.round(14 * scale) }}>
      <ProfileCollectionCardSkeleton
        isDarkMode={isDarkMode}
        anim={anim}
        scale={scale}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        cardBorderRadius={cardBorderRadius}
        cardGradientHeight={cardGradientHeight}
        cardGradientPadding={cardGradientPadding}
        cardTitleFontSize={cardTitleFontSize}
        cardSubFontSize={cardSubFontSize}
      />
      <ProfileCollectionCardSkeleton
        isDarkMode={isDarkMode}
        anim={anim}
        scale={scale}
        cardWidth={cardWidth}
        cardHeight={cardHeight}
        cardBorderRadius={cardBorderRadius}
        cardGradientHeight={cardGradientHeight}
        cardGradientPadding={cardGradientPadding}
        cardTitleFontSize={cardTitleFontSize}
        cardSubFontSize={cardSubFontSize}
      />
    </View>
  );
}


export function ProfileSkeleton({ isDarkMode = true, scale: customScale }) {
  const anim = useShimmerAnimation();

  const screenH = Dimensions.get("window").height;
  const screenW = Dimensions.get("window").width;
  const BASE_HEIGHT = 680;
  const scale = customScale !== undefined ? customScale : Math.min(1, Math.max(0.65, screenH / BASE_HEIGHT));

  const bannerHeight = Math.round(230 * scale);
  const bodyOverlap = Math.round(24 * scale);
  const avatarSize = Math.round(102 * scale);
  const avatarMarginTop = -Math.round(52 * scale);
  const avatarMarginBottom = Math.round(12 * scale);
  const avatarBorderWidth = Math.round(4 * scale);

  const userNameFontSize = Math.round(21 * scale);
  const userNameLineHeight = Math.round(27 * scale);
  const nationalityFontSize = Math.round(13.5 * scale);
  const nationalityLineHeight = Math.round(18 * scale);
  const nationalityMarginTop = Math.round(4 * scale);
  const nationalityMarginBottom = Math.round(8 * scale);

  const bioFontSize = Math.round(13 * scale);
  const bioLineHeight = Math.round(19 * scale);
  const bioMarginBottom = Math.round(20 * scale);

  const statsPaddingVertical = Math.round(18 * scale);
  const statsMarginBottom = Math.round(24 * scale);
  const statValueFontSize = Math.round(22 * scale);
  const statValueLineHeight = Math.round(27 * scale);
  const statLabelFontSize = Math.round(11 * scale);
  const statLabelLineHeight = Math.round(14 * scale);
  const statDividerHeight = Math.round(32 * scale);

  const collectionsSectionMarginTop = Math.round(8 * scale);
  const collectionsHeaderMarginBottom = Math.round(12 * scale);
  const collectionsHeadingFontSize = Math.round(17 * scale);
  const collectionsHeadingLineHeight = Math.round(22 * scale);

  const cardWidth = Math.round(180 * scale);
  const cardHeight = Math.round(260 * scale);
  const cardBorderRadius = Math.round(22 * scale);

  const cardTitleFontSize = Math.round(15 * scale);
  const cardSubFontSize = Math.round(12 * scale);
  const addCircleSize = Math.round(58 * scale);
  const cardGradientHeight = Math.round(95 * scale);
  const cardGradientPadding = Math.round(14 * scale);

  const bgColor = isDarkMode ? "#0C0C0E" : "#FFFFFF";
  const bannerBg = isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.06)";
  const avatarBorderColor = isDarkMode ? "#0C0C0E" : "#FFFFFF";
  const avatarBg = isDarkMode ? "#1A1A1E" : "#E5E7EB";
  const placeholderBg1 = isDarkMode ? "rgba(255, 255, 255, 0.09)" : "rgba(0, 0, 0, 0.09)";
  const placeholderBg2 = isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.06)";
  const dividerBg = isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)";
  const cardBg = isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)";
  const iconBtnBg = isDarkMode ? "rgba(0, 0, 0, 0.42)" : "rgba(0, 0, 0, 0.25)";

  const SkeletonBar = ({ width: barW, height: barH, borderRadius = 4, bg = placeholderBg1, style }) => (
    <View
      style={[
        {
          width: barW,
          height: barH,
          borderRadius,
          backgroundColor: bg,
          overflow: "hidden",
          position: "relative",
        },
        style,
      ]}
    >
      <ShimmerOverlay
        animatedValue={anim}
        width={typeof barW === "number" ? barW : 150}
        height={typeof barH === "number" ? barH : 20}
        isDarkMode={isDarkMode}
      />
    </View>
  );

  return (
    <View style={[profileStyles.flex1, { backgroundColor: bgColor, overflow: "hidden" }]}>
      <View
        style={[
          profileStyles.coverBanner,
          scale < 1 && { height: bannerHeight },
          { backgroundColor: bannerBg, overflow: "hidden", position: "relative" },
        ]}
      >
        <View style={profileStyles.coverTopBar}>
          <View style={[profileStyles.coverIconButton, { backgroundColor: iconBtnBg }]} />
        </View>
        <ShimmerOverlay
          animatedValue={anim}
          width={screenW}
          height={bannerHeight}
          isDarkMode={isDarkMode}
        />
      </View>

      <View
        style={[
          profileStyles.newProfileBody,
          isDarkMode ? profileStyles.newProfileBodyDark : profileStyles.newProfileBodyLight,
          {
            flex: 1,
            paddingBottom: 0,
          },
          scale < 1 && { marginTop: -bodyOverlap },
        ]}
      >
        <View style={profileStyles.profileInfoGroup}>
          <View
            style={[
              profileStyles.avatarContainer,
              scale < 1 && {
                width: avatarSize,
                height: avatarSize,
                marginTop: avatarMarginTop,
                marginBottom: avatarMarginBottom,
              },
            ]}
          >
            <View
              style={[
                profileStyles.avatarBordered,
                {
                  borderColor: avatarBorderColor,
                  backgroundColor: avatarBg,
                  overflow: "hidden",
                  position: "relative",
                },
                scale < 1 && {
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: avatarSize / 2,
                  borderWidth: avatarBorderWidth,
                },
              ]}
            >
              <ShimmerOverlay
                animatedValue={anim}
                width={avatarSize}
                height={avatarSize}
                isDarkMode={isDarkMode}
              />
            </View>
          </View>

          <View
            style={{
              height: scale < 1 ? userNameLineHeight : 27,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SkeletonBar
              width={Math.round(140 * scale)}
              height={Math.round(userNameFontSize * 0.82)}
              borderRadius={6}
              bg={placeholderBg1}
            />
          </View>

          <View
            style={{
              height: scale < 1 ? nationalityLineHeight : 18,
              marginTop: scale < 1 ? nationalityMarginTop : 4,
              marginBottom: scale < 1 ? nationalityMarginBottom : 8,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SkeletonBar
              width={Math.round(90 * scale)}
              height={Math.round(nationalityFontSize * 0.82)}
              borderRadius={4}
              bg={placeholderBg2}
            />
          </View>

          <View
            style={{
              height: scale < 1 ? bioLineHeight : 19,
              marginBottom: scale < 1 ? bioMarginBottom : 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SkeletonBar
              width={Math.round(210 * scale)}
              height={Math.round(bioFontSize * 0.82)}
              borderRadius={4}
              bg={placeholderBg2}
            />
          </View>

          <View
            style={[
              profileStyles.statsContainer,
              isDarkMode ? profileStyles.statsContainerDark : profileStyles.statsContainerLight,
              scale < 1 && {
                paddingVertical: statsPaddingVertical,
                marginBottom: statsMarginBottom,
              },
            ]}
          >
            <View style={profileStyles.statItem}>
              <View
                style={{
                  height: scale < 1 ? statValueLineHeight : 27,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SkeletonBar
                  width={Math.round(32 * scale)}
                  height={Math.round(statValueFontSize * 0.8)}
                  borderRadius={5}
                  bg={placeholderBg1}
                />
              </View>
              <View
                style={{
                  height: scale < 1 ? statLabelLineHeight : 14,
                  marginTop: 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SkeletonBar
                  width={Math.round(72 * scale)}
                  height={Math.round(statLabelFontSize * 0.8)}
                  borderRadius={3}
                  bg={placeholderBg2}
                />
              </View>
            </View>

            <View
              style={[
                profileStyles.statDividerLine,
                {
                  backgroundColor: dividerBg,
                },
                scale < 1 && { height: statDividerHeight },
              ]}
            />

            <View style={profileStyles.statItem}>
              <View
                style={{
                  height: scale < 1 ? statValueLineHeight : 27,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SkeletonBar
                  width={Math.round(28 * scale)}
                  height={Math.round(statValueFontSize * 0.8)}
                  borderRadius={5}
                  bg={placeholderBg1}
                />
              </View>
              <View
                style={{
                  height: scale < 1 ? statLabelLineHeight : 14,
                  marginTop: 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SkeletonBar
                  width={Math.round(58 * scale)}
                  height={Math.round(statLabelFontSize * 0.8)}
                  borderRadius={3}
                  bg={placeholderBg2}
                />
              </View>
            </View>

            <View
              style={[
                profileStyles.statDividerLine,
                {
                  backgroundColor: dividerBg,
                },
                scale < 1 && { height: statDividerHeight },
              ]}
            />

            <View style={profileStyles.statItem}>
              <View
                style={{
                  height: scale < 1 ? statValueLineHeight : 27,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SkeletonBar
                  width={Math.round(28 * scale)}
                  height={Math.round(statValueFontSize * 0.8)}
                  borderRadius={5}
                  bg={placeholderBg1}
                />
              </View>
              <View
                style={{
                  height: scale < 1 ? statLabelLineHeight : 14,
                  marginTop: 4,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <SkeletonBar
                  width={Math.round(64 * scale)}
                  height={Math.round(statLabelFontSize * 0.8)}
                  borderRadius={3}
                  bg={placeholderBg2}
                />
              </View>
            </View>
          </View>
        </View>

        <View
          style={[
            profileStyles.collectionsSection,
            scale < 1 && { marginTop: collectionsSectionMarginTop },
          ]}
        >
          <View
            style={[
              profileStyles.collectionsHeader,
              scale < 1 && { marginBottom: collectionsHeaderMarginBottom },
            ]}
          >
            <View
              style={{
                height: scale < 1 ? collectionsHeadingLineHeight : 22,
                justifyContent: "center",
              }}
            >
              <SkeletonBar
                width={Math.round(130 * scale)}
                height={Math.round(collectionsHeadingFontSize * 0.8)}
                borderRadius={5}
                bg={placeholderBg1}
              />
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            scrollEnabled={false}
            contentContainerStyle={[
              profileStyles.collectionsScrollContent,
              scale < 1 && {
                gap: Math.round(14 * scale),
                paddingTop: Math.round(6 * scale),
                paddingBottom: Math.round(14 * scale),
              },
            ]}
          >
            <View
              style={[
                profileStyles.addCardItem,
                scale < 1 && {
                  width: cardWidth,
                  height: cardHeight,
                  borderRadius: cardBorderRadius,
                },
                { backgroundColor: cardBg, overflow: "hidden", position: "relative" },
              ]}
            >
              <View
                style={[
                  profileStyles.addCardCircle,
                  scale < 1 && {
                    width: addCircleSize,
                    height: addCircleSize,
                    borderRadius: addCircleSize / 2,
                    marginBottom: Math.round(14 * scale),
                  },
                  { backgroundColor: placeholderBg2 },
                ]}
              />
              <View
                style={{
                  height: scale < 1 ? Math.round(40 * scale) : 40,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    height: Math.round(13 * scale),
                    width: Math.round(75 * scale),
                    borderRadius: 4,
                    backgroundColor: placeholderBg2,
                    marginBottom: 4,
                  }}
                />
                <View
                  style={{
                    height: Math.round(13 * scale),
                    width: Math.round(55 * scale),
                    borderRadius: 4,
                    backgroundColor: placeholderBg2,
                  }}
                />
              </View>
              <ShimmerOverlay
                animatedValue={anim}
                width={cardWidth}
                height={cardHeight}
                isDarkMode={isDarkMode}
              />
            </View>

            <View
              style={[
                profileStyles.collectionCardItem,
                scale < 1 && {
                  width: cardWidth,
                  height: cardHeight,
                  borderRadius: cardBorderRadius,
                },
                { backgroundColor: cardBg, overflow: "hidden", position: "relative" },
              ]}
            >
              <View
                style={[
                  profileStyles.collectionCardGradient,
                  scale < 1 && {
                    height: cardGradientHeight,
                    padding: cardGradientPadding,
                  },
                ]}
              >
                <View
                  style={{
                    height: scale < 1 ? Math.round(19 * scale) : 19,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      height: Math.round(cardTitleFontSize * 0.8),
                      width: "70%",
                      borderRadius: 4,
                      backgroundColor: placeholderBg1,
                    }}
                  />
                </View>
                <View
                  style={{
                    height: scale < 1 ? Math.round(15 * scale) : 15,
                    marginTop: 3,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      height: Math.round(cardSubFontSize * 0.8),
                      width: "40%",
                      borderRadius: 3,
                      backgroundColor: placeholderBg2,
                    }}
                  />
                </View>
              </View>
              <ShimmerOverlay
                animatedValue={anim}
                width={cardWidth}
                height={cardHeight}
                isDarkMode={isDarkMode}
              />
            </View>

            <View
              style={[
                profileStyles.collectionCardItem,
                scale < 1 && {
                  width: cardWidth,
                  height: cardHeight,
                  borderRadius: cardBorderRadius,
                },
                { backgroundColor: cardBg, overflow: "hidden", position: "relative" },
              ]}
            >
              <View
                style={[
                  profileStyles.collectionCardGradient,
                  scale < 1 && {
                    height: cardGradientHeight,
                    padding: cardGradientPadding,
                  },
                ]}
              >
                <View
                  style={{
                    height: scale < 1 ? Math.round(19 * scale) : 19,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      height: Math.round(cardTitleFontSize * 0.8),
                      width: "60%",
                      borderRadius: 4,
                      backgroundColor: placeholderBg1,
                    }}
                  />
                </View>
                <View
                  style={{
                    height: scale < 1 ? Math.round(15 * scale) : 15,
                    marginTop: 3,
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      height: Math.round(cardSubFontSize * 0.8),
                      width: "35%",
                      borderRadius: 3,
                      backgroundColor: placeholderBg2,
                    }}
                  />
                </View>
              </View>
              <ShimmerOverlay
                animatedValue={anim}
                width={cardWidth}
                height={cardHeight}
                isDarkMode={isDarkMode}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

export function DetailsDescriptionSkeleton({ isDarkMode = true }) {
  const anim = useShimmerAnimation();
  const bg1 = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.09)";
  const bg2 = isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.06)";

  return (
    <View style={{ marginVertical: 6, overflow: "hidden", position: "relative" }}>
      <View style={{ width: "100%", height: 13, borderRadius: 4, backgroundColor: bg1, marginBottom: 8 }} />
      <View style={{ width: "94%", height: 13, borderRadius: 4, backgroundColor: bg2, marginBottom: 8 }} />
      <View style={{ width: "88%", height: 13, borderRadius: 4, backgroundColor: bg1, marginBottom: 8 }} />
      <View style={{ width: "55%", height: 13, borderRadius: 4, backgroundColor: bg2 }} />
      <ShimmerOverlay animatedValue={anim} width={width - 50} height={80} isDarkMode={isDarkMode} />
    </View>
  );
}

export function DetailsReviewsSkeleton({ isDarkMode = true, count = 2 }) {
  const anim = useShimmerAnimation();
  const bg1 = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.09)";
  const bg2 = isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.06)";
  const borderCol = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)";

  return (
    <View style={{ marginTop: 6, overflow: "hidden", position: "relative" }}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={`detail-rev-skel-${i}`}
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            paddingVertical: 14,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: borderCol,
          }}
        >
          { }
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: bg1,
              marginRight: 10,
              marginTop: 2,
            }}
          />
          { }
          <View style={{ flex: 1 }}>
            { }
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <View style={{ width: 85, height: 12, borderRadius: 4, backgroundColor: bg1 }} />
              <View style={{ width: 42, height: 10, borderRadius: 3, backgroundColor: bg2 }} />
            </View>
            { }
            <View style={{ width: "95%", height: 11, borderRadius: 3, backgroundColor: bg2, marginBottom: 6 }} />
            <View style={{ width: i === 0 ? "70%" : "50%", height: 11, borderRadius: 3, backgroundColor: bg2 }} />
          </View>
        </View>
      ))}
      <ShimmerOverlay animatedValue={anim} width={width - 50} height={180} isDarkMode={isDarkMode} />
    </View>
  );
}

export default {
  useShimmerAnimation,
  ShimmerOverlay,
  SkeletonBox,
  HomeCardSkeleton,
  HomeSkeletonList,
  HomeCategoriesSkeleton,
  TopDestinationCardSkeleton,
  TopDestinationsSkeletonList,
  ExploreCardSkeleton,
  ExploreSkeletonGrid,
  FavoriteCardSkeleton,
  FavoritesSkeletonList,
  SearchCardSkeleton,
  SearchSkeletonList,
  ProfileSkeleton,
  ProfileAvatarSkeleton,
  ProfileSkeletonBar,
  ProfileCollectionCardSkeleton,
  ProfileCollectionsSkeletonList,
  DetailsDescriptionSkeleton,
  DetailsReviewsSkeleton,
};
