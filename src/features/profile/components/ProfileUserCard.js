import React, { memo } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  ProfileAvatarSkeleton,
  ProfileSkeletonBar,
} from "../../../shared/components/Skeleton";
import FadeInView from "../../../shared/components/FadeInView";
import {
  styles,
  getAvatarContainerDynamicStyle,
  getAvatarBorderedDynamicStyle,
  getAvatarImageDynamicStyle,
  getSkeletonWrapperStyle,
  getUserNameDynamicStyle,
  getNationalityDynamicStyle,
  getBioDynamicStyle,
  getStatsContainerDynamicStyle,
  getStatValueDynamicStyle,
  getStatLabelDynamicStyle,
  getStatDividerDynamicStyle,
} from "../styles/profile.styles";

const ProfileUserCard = memo(function ProfileUserCard({
  user,
  name,
  nationality,
  bio,
  commentsCount,
  collectionsCount,
  favoritesCount,
  refreshKey,
  loading,
  isDarkMode,
  currentTheme,
  scale,
  avatarDimensions,
  onOpenAvatarModal,
}) {
  const {
    avatarSize,
    avatarMarginTop,
    avatarMarginBottom,
    avatarBorderWidth,
    avatarIconSize,
    userNameFontSize,
    userNameLineHeight,
    nationalityFontSize,
    nationalityLineHeight,
    nationalityMarginTop,
    nationalityMarginBottom,
    bioFontSize,
    bioLineHeight,
    bioMarginBottom,
    statsPaddingVertical,
    statsMarginBottom,
    statValueFontSize,
    statValueLineHeight,
    statLabelFontSize,
    statLabelLineHeight,
    statDividerHeight,
  } = avatarDimensions;

  const avatarSource = user?.avatarUrl
    ? {
        uri: user.avatarUrl.includes("?")
          ? `${user.avatarUrl}&t=${refreshKey}`
          : `${user.avatarUrl}?t=${refreshKey}`,
      }
    : null;

  return (
    <View style={styles.profileInfoGroup}>
      <View
        style={getAvatarContainerDynamicStyle(
          scale,
          avatarSize,
          avatarMarginTop,
          avatarMarginBottom
        )}
      >
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onOpenAvatarModal}
          delayLongPress={300}
          onLongPress={onOpenAvatarModal}
        >
          <View
            style={getAvatarBorderedDynamicStyle(
              isDarkMode,
              scale,
              avatarSize,
              avatarBorderWidth
            )}
          >
            {loading ? (
              <ProfileAvatarSkeleton size={avatarSize} isDarkMode={isDarkMode} />
            ) : (
              <FadeInView duration={350} style={styles.centerFull}>
                {avatarSource ? (
                  <Image
                    key={`avatar_${refreshKey}`}
                    source={avatarSource}
                    style={getAvatarImageDynamicStyle(scale, avatarSize)}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons
                    name="person"
                    size={avatarIconSize}
                    color={currentTheme.accent}
                  />
                )}
              </FadeInView>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={getSkeletonWrapperStyle(userNameLineHeight)}>
          <ProfileSkeletonBar
            width={Math.round(150 * scale)}
            height={Math.round(userNameFontSize * 0.82)}
            borderRadius={6}
            isDarkMode={isDarkMode}
          />
        </View>
      ) : (
        <FadeInView duration={350}>
          <Text
            style={getUserNameDynamicStyle(
              isDarkMode,
              scale,
              userNameFontSize,
              userNameLineHeight
            )}
          >
            {name || "Usuário"}
          </Text>
        </FadeInView>
      )}

      {loading ? (
        <View
          style={getSkeletonWrapperStyle(
            nationalityLineHeight,
            nationalityMarginTop,
            nationalityMarginBottom
          )}
        >
          <ProfileSkeletonBar
            width={Math.round(90 * scale)}
            height={Math.round(nationalityFontSize * 0.82)}
            borderRadius={4}
            isDarkMode={isDarkMode}
          />
        </View>
      ) : (
        <FadeInView duration={350}>
          <Text
            style={getNationalityDynamicStyle(
              currentTheme.accent,
              scale,
              nationalityFontSize,
              nationalityLineHeight,
              nationalityMarginTop,
              nationalityMarginBottom
            )}
          >
            {nationality || "Brasileiro"}
          </Text>
        </FadeInView>
      )}

      {loading ? (
        <View
          style={getSkeletonWrapperStyle(
            bioLineHeight,
            0,
            bioMarginBottom
          )}
        >
          <ProfileSkeletonBar
            width={Math.round(210 * scale)}
            height={Math.round(bioFontSize * 0.82)}
            borderRadius={4}
            isDarkMode={isDarkMode}
          />
        </View>
      ) : (
        <FadeInView duration={350}>
          <Text
            style={getBioDynamicStyle(
              isDarkMode,
              scale,
              bioFontSize,
              bioLineHeight,
              bioMarginBottom
            )}
          >
            {bio || "Sem bio definida."}
          </Text>
        </FadeInView>
      )}

      <View
        style={getStatsContainerDynamicStyle(
          isDarkMode,
          scale,
          statsPaddingVertical,
          statsMarginBottom
        )}
      >
        <View style={styles.statItem}>
          {loading ? (
            <View style={getSkeletonWrapperStyle(statValueLineHeight)}>
              <ProfileSkeletonBar
                width={Math.round(24 * scale)}
                height={Math.round(statValueFontSize * 0.8)}
                borderRadius={5}
                isDarkMode={isDarkMode}
              />
            </View>
          ) : (
            <FadeInView duration={350}>
              <Text
                style={getStatValueDynamicStyle(
                  isDarkMode,
                  scale,
                  statValueFontSize,
                  statValueLineHeight
                )}
              >
                {commentsCount}
              </Text>
            </FadeInView>
          )}
          <Text
            style={getStatLabelDynamicStyle(
              isDarkMode,
              scale,
              statLabelFontSize,
              statLabelLineHeight
            )}
          >
            COMENTÁRIOS
          </Text>
        </View>

        <View
          style={getStatDividerDynamicStyle(isDarkMode, scale, statDividerHeight)}
        />

        <View style={styles.statItem}>
          {loading ? (
            <View style={getSkeletonWrapperStyle(statValueLineHeight)}>
              <ProfileSkeletonBar
                width={Math.round(24 * scale)}
                height={Math.round(statValueFontSize * 0.8)}
                borderRadius={5}
                isDarkMode={isDarkMode}
              />
            </View>
          ) : (
            <FadeInView duration={350}>
              <Text
                style={getStatValueDynamicStyle(
                  isDarkMode,
                  scale,
                  statValueFontSize,
                  statValueLineHeight
                )}
              >
                {collectionsCount}
              </Text>
            </FadeInView>
          )}
          <Text
            style={getStatLabelDynamicStyle(
              isDarkMode,
              scale,
              statLabelFontSize,
              statLabelLineHeight
            )}
          >
            COLEÇÕES
          </Text>
        </View>

        <View
          style={getStatDividerDynamicStyle(isDarkMode, scale, statDividerHeight)}
        />

        <View style={styles.statItem}>
          {loading ? (
            <View style={getSkeletonWrapperStyle(statValueLineHeight)}>
              <ProfileSkeletonBar
                width={Math.round(28 * scale)}
                height={Math.round(statValueFontSize * 0.8)}
                borderRadius={5}
                isDarkMode={isDarkMode}
              />
            </View>
          ) : (
            <FadeInView duration={350}>
              <Text
                style={getStatValueDynamicStyle(
                  isDarkMode,
                  scale,
                  statValueFontSize,
                  statValueLineHeight
                )}
              >
                {favoritesCount}
              </Text>
            </FadeInView>
          )}
          <Text
            style={getStatLabelDynamicStyle(
              isDarkMode,
              scale,
              statLabelFontSize,
              statLabelLineHeight
            )}
          >
            FAVORITOS
          </Text>
        </View>
      </View>
    </View>
  );
});

export default ProfileUserCard;
