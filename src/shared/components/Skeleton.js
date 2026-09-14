import homeStyles from "../../features/home/home.styles";
import exploreStyles, { COLUMN_WIDTH } from "../../features/explore/explore.styles";
import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.75;
const CARD_HEIGHT = 500;

export function useShimmerAnimation(normalDuration = 1800, firstDuration = 800) {
  const animatedValue = useRef(new Animated.Value(0.28)).current;

  useEffect(() => {
    let isMounted = true;
    let activeAnim = null;

    animatedValue.setValue(0.28);

    activeAnim = Animated.timing(animatedValue, {
      toValue: 1,
      duration: firstDuration,
      easing: Easing.out(Easing.quad),
      useNativeDriver: Platform.OS !== "web",
    });

    activeAnim.start(({ finished }) => {
      if (!isMounted || !finished) return;

      animatedValue.setValue(0);
      const loop = Animated.loop(
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: normalDuration,
          easing: Easing.bezier(0.35, 0, 0.25, 1),
          useNativeDriver: Platform.OS !== "web",
        })
      );
      activeAnim = loop;
      loop.start();
    });

    return () => {
      isMounted = false;
      if (activeAnim) {
        activeAnim.stop();
      }
      animatedValue.stopAnimation();
    };
  }, [animatedValue, normalDuration, firstDuration]);

  return animatedValue;
}

export function ShimmerOverlay({
  animatedValue,
  width: compWidth = CARD_WIDTH,
  height: compHeight = CARD_HEIGHT,
  isDarkMode = true,
  customColors,
}) {
  const shimmerWidth = compWidth * 1.6;

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-shimmerWidth, compWidth + 20],
  });

  const defaultColors = isDarkMode
    ? [
        "rgba(255, 255, 255, 0)",
        "rgba(255, 255, 255, 0.005)",
        "rgba(255, 255, 255, 0.02)",
        "rgba(255, 255, 255, 0.05)",
        "rgba(255, 255, 255, 0.08)",
        "rgba(255, 255, 255, 0.05)",
        "rgba(255, 255, 255, 0.02)",
        "rgba(255, 255, 255, 0.005)",
        "rgba(255, 255, 255, 0)",
      ]
    : [
        "rgba(255, 255, 255, 0)",
        "rgba(255, 255, 255, 0.02)",
        "rgba(255, 255, 255, 0.06)",
        "rgba(255, 255, 255, 0.14)",
        "rgba(255, 255, 255, 0.22)",
        "rgba(255, 255, 255, 0.14)",
        "rgba(255, 255, 255, 0.06)",
        "rgba(255, 255, 255, 0.02)",
        "rgba(255, 255, 255, 0)",
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
}) {
  const localAnim = useShimmerAnimation();
  const anim = animatedValue || localAnim;

  const cardBg = isDarkMode ? "rgba(20, 20, 20, 0.95)" : "rgba(230, 230, 230, 0.25)";
  const infoBg = !isDarkMode ? "rgba(100, 100, 100, 0.40)" : "rgba(12, 12, 12, 0.85)";
  const placeholderBg1 = isDarkMode ? "rgba(255, 255, 255, 0.09)" : "rgba(255, 255, 255, 0.30)";
  const placeholderBg2 = isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.18)";
  const badgeBg = !isDarkMode ? "rgba(255, 255, 255, 0.15)" : "rgba(255, 255, 255, 0.04)";

  return (
    <View
      style={[
        homeStyles.card,
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
      {}
      <View style={{ flex: 1 }} />

      {}
      <View
        style={[
          homeStyles.cardInfo,
          {
            backgroundColor: infoBg,
            borderWidth: 0,
            borderColor: "transparent",
            shadowColor: "transparent",
            shadowOpacity: 0,
            shadowRadius: 0,
            shadowOffset: { width: 0, height: 0 },
            elevation: 0,
          },
        ]}
      >
        <View style={{ flex: 1, justifyContent: "center", marginRight: 10 }}>
          {}
          <View
            style={{
              height: 18,
              width: "75%",
              borderRadius: 6,
              backgroundColor: placeholderBg1,
              marginBottom: 8,
            }}
          />
          {}
          <View
            style={{
              height: 12,
              width: "45%",
              borderRadius: 4,
              backgroundColor: placeholderBg2,
            }}
          />
        </View>

        {}
        <View
          style={[
            homeStyles.ratingContainer,
            {
              backgroundColor: badgeBg,
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              elevation: 0,
              shadowOpacity: 0,
              shadowColor: "transparent",
            },
          ]}
        >
          <View
            style={{
              width: 26,
              height: 12,
              borderRadius: 4,
              backgroundColor: placeholderBg1,
            }}
          />
        </View>
      </View>

      {}
      <ShimmerOverlay
        animatedValue={anim}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

export function HomeSkeletonList({ isDarkMode = true, currentTheme }) {
  const anim = useShimmerAnimation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={homeStyles.cardsList}
      scrollEnabled={true}
    >
      <HomeCardSkeleton
        isDarkMode={isDarkMode}
        currentTheme={currentTheme}
        animatedValue={anim}
      />
      <HomeCardSkeleton
        isDarkMode={isDarkMode}
        currentTheme={currentTheme}
        animatedValue={anim}
      />
      <HomeCardSkeleton
        isDarkMode={isDarkMode}
        currentTheme={currentTheme}
        animatedValue={anim}
      />
    </ScrollView>
  );
}

export function ExploreCardSkeleton({
  height = 180,
  isDarkMode = true,
  currentTheme,
  animatedValue,
}) {
  const localAnim = useShimmerAnimation();
  const anim = animatedValue || localAnim;

  const cardBg = isDarkMode ? "rgba(22, 22, 22, 0.95)" : "rgba(215, 215, 215, 0.45)";
  const placeholderBg1 = isDarkMode ? "rgba(255, 255, 255, 0.09)" : "rgba(255, 255, 255, 0.50)";
  const placeholderBg2 = isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.35)";
  const badgeBg = isDarkMode ? "rgba(0, 0, 0, 0.60)" : "rgba(100, 100, 100, 0.40)";

  return (
    <View
      style={[
        exploreStyles.gridItem,
        {
          height,
          backgroundColor: cardBg,
          overflow: "hidden",
        },
      ]}
    >
      {}
      <View style={{ flex: 1 }} />

      {}
      <View
        style={[
          exploreStyles.topBadge,
          {
            backgroundColor: badgeBg,
            paddingHorizontal: 6,
            paddingVertical: 3.5,
          },
        ]}
      >
        <View
          style={{
            width: 16,
            height: 7.5,
            borderRadius: 2,
            backgroundColor: placeholderBg1,
          }}
        />
      </View>

      {}
      <LinearGradient
        colors={["transparent", isDarkMode ? "rgba(0, 0, 0, 0.86)" : "rgba(80, 80, 80, 0.65)"]}
        style={exploreStyles.bottomOverlay}
      >
        <View
          style={{
            height: 10,
            width: "75%",
            borderRadius: 3,
            backgroundColor: placeholderBg1,
            marginBottom: 5,
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

      {}
      <ShimmerOverlay
        animatedValue={anim}
        width={COLUMN_WIDTH}
        height={height}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

export function ExploreSkeletonGrid({ isDarkMode = true, currentTheme }) {
  const anim = useShimmerAnimation();

  const col1Heights = [
    Math.round(COLUMN_WIDTH * 1.50),
    Math.round(COLUMN_WIDTH * 1.00),
    Math.round(COLUMN_WIDTH * 1.70),
    Math.round(COLUMN_WIDTH * 1.20),
    Math.round(COLUMN_WIDTH * 1.40),
    Math.round(COLUMN_WIDTH * 1.10),
  ];

  const col2Heights = [
    Math.round(COLUMN_WIDTH * 1.10),
    Math.round(COLUMN_WIDTH * 1.65),
    Math.round(COLUMN_WIDTH * 0.95),
    Math.round(COLUMN_WIDTH * 1.80),
    Math.round(COLUMN_WIDTH * 1.30),
    Math.round(COLUMN_WIDTH * 1.15),
  ];

  const col3Heights = [
    Math.round(COLUMN_WIDTH * 1.75),
    Math.round(COLUMN_WIDTH * 1.25),
    Math.round(COLUMN_WIDTH * 1.45),
    Math.round(COLUMN_WIDTH * 0.90),
    Math.round(COLUMN_WIDTH * 1.55),
    Math.round(COLUMN_WIDTH * 1.05),
  ];

  return (
    <View style={exploreStyles.masonryRow}>
      <View style={exploreStyles.masonryColumn}>
        {col1Heights.map((h, i) => (
          <ExploreCardSkeleton
            key={`skel-col1-${i}`}
            height={h}
            isDarkMode={isDarkMode}
            currentTheme={currentTheme}
            animatedValue={anim}
          />
        ))}
      </View>
      <View style={exploreStyles.masonryColumn}>
        {col2Heights.map((h, i) => (
          <ExploreCardSkeleton
            key={`skel-col2-${i}`}
            height={h}
            isDarkMode={isDarkMode}
            currentTheme={currentTheme}
            animatedValue={anim}
          />
        ))}
      </View>
      <View style={exploreStyles.masonryColumn}>
        {col3Heights.map((h, i) => (
          <ExploreCardSkeleton
            key={`skel-col3-${i}`}
            height={h}
            isDarkMode={isDarkMode}
            currentTheme={currentTheme}
            animatedValue={anim}
          />
        ))}
      </View>
    </View>
  );
}

export function FavoriteCardSkeleton({
  cardHeight = 72,
  cardMarginBottom = 10,
  titleWidth = "60%",
  locationWidth = "38%",
  isDarkMode = true,
  animatedValue,
}) {
  const localAnim = useShimmerAnimation();
  const anim = animatedValue || localAnim;

  const cardBg = !isDarkMode ? "rgba(100, 100, 100, 0.40)" : "rgba(12, 12, 12, 0.82)";
  const thumbBg = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.35)";
  const placeholderBg1 = isDarkMode ? "rgba(255, 255, 255, 0.09)" : "rgba(255, 255, 255, 0.45)";
  const placeholderBg2 = isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.28)";

  const imageSize = Math.max(48, cardHeight - 20);
  const cardWidth = width - 40;

  return (
    <View
      style={{
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
      {}
      <View
        style={{
          width: imageSize,
          height: imageSize,
          borderRadius: 13,
          backgroundColor: thumbBg,
        }}
      />

      {}
      <View style={{ marginLeft: 14, flex: 1 }}>
        <View
          style={{
            height: 14,
            width: titleWidth,
            borderRadius: 4,
            backgroundColor: placeholderBg1,
            marginBottom: 8,
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

      {}
      <ShimmerOverlay
        animatedValue={anim}
        width={cardWidth}
        height={cardHeight}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

export function FavoritesSkeletonList({
  isDarkMode = true,
  cardHeight = 72,
  cardMarginBottom = 10,
  count = 6,
}) {
  const anim = useShimmerAnimation();
  const variations = [
    { title: "65%", loc: "42%" },
    { title: "52%", loc: "35%" },
    { title: "70%", loc: "48%" },
    { title: "58%", loc: "32%" },
    { title: "62%", loc: "40%" },
    { title: "50%", loc: "36%" },
  ];

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
      {Array.from({ length: count }).map((_, i) => {
        const v = variations[i % variations.length];
        return (
          <FavoriteCardSkeleton
            key={`fav-skel-${i}`}
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

export function SearchCardSkeleton({
  cardHeight = 72,
  cardMarginBottom = 10,
  titleWidth = "60%",
  locationWidth = "38%",
  showBadge = true,
  isDarkMode = true,
  animatedValue,
}) {
  const localAnim = useShimmerAnimation();
  const anim = animatedValue || localAnim;

  const cardBg = !isDarkMode ? "rgba(100, 100, 100, 0.25)" : "rgba(12, 12, 12, 0.85)";
  const thumbBg = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.20)";
  const placeholderBg1 = isDarkMode ? "rgba(255, 255, 255, 0.09)" : "rgba(255, 255, 255, 0.30)";
  const placeholderBg2 = isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.16)";
  const badgeBg = isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.14)";

  const imageSize = Math.max(48, cardHeight - 20);
  const cardWidth = width - 40;

  return (
    <View
      style={{
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
      {}
      <View
        style={{
          width: imageSize,
          height: imageSize,
          borderRadius: 13,
          backgroundColor: thumbBg,
        }}
      />

      {}
      <View style={{ marginLeft: 14, flex: 1, justifyContent: "center" }}>
        <View
          style={{
            height: 14,
            width: titleWidth,
            borderRadius: 4,
            backgroundColor: placeholderBg1,
            marginBottom: 8,
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

      {}
      {showBadge && (
        <View
          style={{
            position: "absolute",
            top: 10,
            right: 14,
            width: 44,
            height: 16,
            borderRadius: 6,
            backgroundColor: badgeBg,
          }}
        />
      )}

      {}
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
  count = 6,
}) {
  const anim = useShimmerAnimation();
  const variations = [
    { title: "65%", loc: "40%", badge: true },
    { title: "52%", loc: "34%", badge: false },
    { title: "72%", loc: "46%", badge: true },
    { title: "58%", loc: "30%", badge: true },
    { title: "64%", loc: "42%", badge: false },
    { title: "48%", loc: "36%", badge: true },
  ];

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 6 }}>
      {Array.from({ length: count }).map((_, i) => {
        const v = variations[i % variations.length];
        return (
          <SearchCardSkeleton
            key={`search-skel-${i}`}
            cardHeight={cardHeight}
            cardMarginBottom={cardMarginBottom}
            titleWidth={v.title}
            locationWidth={v.loc}
            showBadge={v.badge}
            isDarkMode={isDarkMode}
            animatedValue={anim}
          />
        );
      })}
    </View>
  );
}

export function ProfileSkeleton({ isDarkMode = true }) {
  const anim = useShimmerAnimation();

  const cardBg = !isDarkMode ? "rgba(100, 100, 100, 0.40)" : "rgba(12, 12, 12, 0.82)";
  const avatarBg = isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(255, 255, 255, 0.35)";
  const placeholderBg1 = isDarkMode ? "rgba(255, 255, 255, 0.09)" : "rgba(255, 255, 255, 0.45)";
  const placeholderBg2 = isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.28)";

  const cardWidth = width - 40;

  return (
    <View
      style={{
        margin: 20,
        backgroundColor: cardBg,
        borderRadius: 24,
        padding: 28,
        alignItems: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {}
      <View
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: placeholderBg2,
        }}
      />

      {}
      <View
        style={{
          width: 90,
          height: 90,
          borderRadius: 45,
          backgroundColor: avatarBg,
        }}
      />

      {}
      <View
        style={{
          height: 20,
          width: 140,
          borderRadius: 6,
          backgroundColor: placeholderBg1,
          marginTop: 18,
        }}
      />

      {}
      <View
        style={{
          height: 12,
          width: 80,
          borderRadius: 4,
          backgroundColor: placeholderBg2,
          marginTop: 8,
        }}
      />

      {}
      <View
        style={{
          height: 12,
          width: "75%",
          borderRadius: 4,
          backgroundColor: placeholderBg2,
          marginTop: 16,
        }}
      />
      <View
        style={{
          height: 12,
          width: "50%",
          borderRadius: 4,
          backgroundColor: placeholderBg2,
          marginTop: 6,
        }}
      />

      {}
      <ShimmerOverlay
        animatedValue={anim}
        width={cardWidth}
        height={280}
        isDarkMode={isDarkMode}
      />
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
          {}
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
          {}
          <View style={{ flex: 1 }}>
            {}
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <View style={{ width: 85, height: 12, borderRadius: 4, backgroundColor: bg1 }} />
              <View style={{ width: 42, height: 10, borderRadius: 3, backgroundColor: bg2 }} />
            </View>
            {}
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
  ExploreCardSkeleton,
  ExploreSkeletonGrid,
  FavoriteCardSkeleton,
  FavoritesSkeletonList,
  SearchCardSkeleton,
  SearchSkeletonList,
  ProfileSkeleton,
  DetailsDescriptionSkeleton,
  DetailsReviewsSkeleton,
};
