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
  onOpenSettings,
  isMinimalist = true,
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
    statsMarginTop = 0,
    statsPaddingVertical,
    statsMarginBottom,
    statValueFontSize,
    statValueLineHeight,
    statLabelFontSize,
    statLabelLineHeight,
    statDividerHeight,
    decorativeTopMargin,
    decorativeCardPadding,
    decorativeStatsPaddingVertical,
    decorativeStatsMarginTop,
  } = avatarDimensions;

  const avatarSource = user?.avatarUrl
    ? {
        uri: user.avatarUrl.includes("?")
          ? `${user.avatarUrl}&t=${refreshKey}`
          : `${user.avatarUrl}?t=${refreshKey}`,
      }
    : null;

  if (!isMinimalist) {
    const hitSlopSettings = { top: 12, bottom: 12, left: 12, right: 12 };

    return (
      <View
        style={[
          styles.decorativeCard,
          isDarkMode ? styles.decorativeCardDark : styles.decorativeCardLight,
          decorativeTopMargin !== undefined && { marginTop: decorativeTopMargin },
          decorativeCardPadding !== undefined && { paddingVertical: decorativeCardPadding },
        ]}
      >
        <TouchableOpacity
          style={styles.decorativeSettingsButton}
          onPress={onOpenSettings}
          activeOpacity={0.7}
          hitSlop={hitSlopSettings}
        >
          <Ionicons name="settings-sharp" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.decorativeAvatarWrapper}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={onOpenAvatarModal}
            delayLongPress={300}
            onLongPress={onOpenAvatarModal}
          >
            <View
              style={[
                styles.decorativeAvatarBordered,
                {
                  width: avatarSize,
                  height: avatarSize,
                  borderRadius: avatarSize / 2,
                  backgroundColor: isDarkMode
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(255, 255, 255, 0.20)",
                },
              ]}
            >
              {loading ? (
                <ProfileAvatarSkeleton size={avatarSize} isDarkMode={isDarkMode} />
              ) : (
                <FadeInView duration={350} style={styles.centerFull}>
                  {avatarSource ? (
                    <Image
                      key={`avatar_${refreshKey}`}
                      source={avatarSource}
                      style={{
                        width: avatarSize,
                        height: avatarSize,
                        borderRadius: avatarSize / 2,
                      }}
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
              style={[
                styles.decorativeUserName,
                { fontSize: userNameFontSize, lineHeight: userNameLineHeight },
              ]}
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
              style={[
                styles.newNationalityText,
                {
                  color: currentTheme.accent,
                  fontSize: nationalityFontSize,
                  lineHeight: nationalityLineHeight,
                  marginTop: nationalityMarginTop,
                  marginBottom: nationalityMarginBottom,
                },
              ]}
            >
              {nationality || "Brasileiro"}
            </Text>
          </FadeInView>
        )}

        {loading ? (
          <View
            style={getSkeletonWrapperStyle(bioLineHeight, 0, bioMarginBottom)}
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
              style={[
                styles.decorativeBioText,
                {
                  fontSize: bioFontSize,
                  lineHeight: bioLineHeight,
                  marginBottom: bioMarginBottom,
                },
              ]}
            >
              {bio || "Sem bio definida."}
            </Text>
          </FadeInView>
        )}

        <View
          style={[
            styles.decorativeStatsContainer,
            isDarkMode
              ? styles.decorativeStatsContainerDark
              : styles.decorativeStatsContainerLight,
            decorativeStatsPaddingVertical !== undefined && {
              paddingVertical: decorativeStatsPaddingVertical,
            },
            decorativeStatsMarginTop !== undefined && {
              marginTop: decorativeStatsMarginTop,
            },
          ]}
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
                  style={[
                    styles.decorativeStatValue,
                    {
                      fontSize: statValueFontSize,
                      lineHeight: statValueLineHeight,
                    },
                  ]}
                >
                  {commentsCount}
                </Text>
              </FadeInView>
            )}
            <Text
              style={[
                styles.decorativeStatLabel,
                {
                  fontSize: statLabelFontSize,
                  lineHeight: statLabelLineHeight,
                },
              ]}
            >
              COMENTÁRIOS
            </Text>
          </View>

          <View
            style={[
              styles.decorativeStatDivider,
              { height: statDividerHeight },
            ]}
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
                  style={[
                    styles.decorativeStatValue,
                    {
                      fontSize: statValueFontSize,
                      lineHeight: statValueLineHeight,
                    },
                  ]}
                >
                  {collectionsCount}
                </Text>
              </FadeInView>
            )}
            <Text
              style={[
                styles.decorativeStatLabel,
                {
                  fontSize: statLabelFontSize,
                  lineHeight: statLabelLineHeight,
                },
              ]}
            >
              COLEÇÕES
            </Text>
          </View>

          <View
            style={[
              styles.decorativeStatDivider,
              { height: statDividerHeight },
            ]}
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
                  style={[
                    styles.decorativeStatValue,
                    {
                      fontSize: statValueFontSize,
                      lineHeight: statValueLineHeight,
                    },
                  ]}
                >
                  {favoritesCount}
                </Text>
              </FadeInView>
            )}
            <Text
              style={[
                styles.decorativeStatLabel,
                {
                  fontSize: statLabelFontSize,
                  lineHeight: statLabelLineHeight,
                },
              ]}
            >
              FAVORITOS
            </Text>
          </View>
        </View>
      </View>
    );
  }

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
          statsMarginBottom,
          statsMarginTop
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
