import React, { memo } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "../styles/details.styles";
import { SkeletonBox } from "../../../shared/components/Skeleton";
import FadeInView from "../../../shared/components/FadeInView";
import { formatTimeAgo } from "../utils/destinationUtils";

function DestinationWeatherComponent({
  weather,
  loadingWeather,
  showWeatherInfo,
  toggleWeatherInfo,
  weatherInfoAnim,
  statCardBg,
  currentTheme,
  isDarkMode,
}) {
  return (
    <>
      <View style={[styles.marginBottom24, styles.marginTop24]}>
        <View style={styles.rowSpaceBetween}>
          <TouchableOpacity
            onPress={toggleWeatherInfo}
            activeOpacity={0.7}
            style={styles.rowCenter}
          >
            <Text
              style={[
                styles.descriptionHeader,
                { marginBottom: 0 },
                !isDarkMode && styles.descriptionHeaderLight,
              ]}
            >
              Clima
            </Text>
            <View style={styles.weatherCenterMargin}>
              <Feather
                name="info"
                size={14}
                color={
                  showWeatherInfo
                    ? currentTheme.accent
                    : !isDarkMode
                    ? "#9CA3AF"
                    : "rgba(255, 255, 255, 0.45)"
                }
              />
            </View>
          </TouchableOpacity>
        </View>

        <Animated.View
          style={[
            styles.weatherNoticeWrapper,
            {
              maxHeight: weatherInfoAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 24],
              }),
              opacity: weatherInfoAnim.interpolate({
                inputRange: [0, 0.4, 1],
                outputRange: [0, 0.5, 1],
              }),
              marginTop: weatherInfoAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 4],
              }),
            },
          ]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.weatherNotice,
              !isDarkMode
                ? styles.weatherNoticeTextLight
                : styles.weatherNoticeTextDark,
            ]}
          >
            {!loadingWeather && !weather
              ? "Sem informações de clima disponíveis"
              : `Informações de clima atualizado há ${formatTimeAgo(weather?.updatedAt)}`}
          </Text>
        </Animated.View>
      </View>

      <View
        style={[
          styles.statsContainer,
          !loadingWeather && weather ? styles.statsContainerHasWeather : null,
        ]}
      >
        <Animated.View
          style={[
            styles.statCard,
            { backgroundColor: statCardBg },
            !isDarkMode ? styles.statCardLight : styles.statCardDark,
          ]}
        >
          <Text style={[styles.statLabel, !isDarkMode && styles.statLabelLight]}>
            Vento
          </Text>
          {loadingWeather ? (
            <SkeletonBox width={46} height={18} borderRadius={5} isDarkMode={isDarkMode} />
          ) : (
            <FadeInView duration={200}>
              <Text style={[styles.statValue, { color: currentTheme.accent }]}>
                {weather?.wind != null ? `${weather.wind} km/h` : "N/A"}
              </Text>
            </FadeInView>
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.statCard,
            { backgroundColor: statCardBg },
            !isDarkMode ? styles.statCardLight : styles.statCardDark,
          ]}
        >
          <Text style={[styles.statLabel, !isDarkMode && styles.statLabelLight]}>
            Temperatura
          </Text>
          {loadingWeather ? (
            <SkeletonBox width={44} height={18} borderRadius={5} isDarkMode={isDarkMode} />
          ) : (
            <FadeInView duration={200}>
              <Text style={[styles.statValue, { color: currentTheme.accent }]}>
                {weather?.temp != null ? `${weather.temp}°C` : "N/A"}
              </Text>
            </FadeInView>
          )}
        </Animated.View>

        <Animated.View
          style={[
            styles.statCard,
            { backgroundColor: statCardBg },
            !isDarkMode ? styles.statCardLight : styles.statCardDark,
          ]}
        >
          <Text style={[styles.statLabel, !isDarkMode && styles.statLabelLight]}>
            Chuva
          </Text>
          {loadingWeather ? (
            <SkeletonBox width={36} height={18} borderRadius={5} isDarkMode={isDarkMode} />
          ) : (
            <FadeInView duration={200}>
              <Text style={[styles.statValue, { color: currentTheme.accent }]}>
                {weather?.rainProbability != null
                  ? `${weather.rainProbability}%`
                  : weather?.humidity != null
                  ? `${weather.humidity}%`
                  : "N/A"}
              </Text>
            </FadeInView>
          )}
        </Animated.View>
      </View>

      {!loadingWeather && weather && (
        <FadeInView duration={240}>
          <Text
            style={[
              styles.weatherAlert,
              isDarkMode ? styles.weatherAlertDark : styles.weatherAlertLight,
            ]}
          >
            {`Condição climática atual: ${weather.condition}.`}
          </Text>
        </FadeInView>
      )}
    </>
  );
}

export const DestinationWeather = memo(DestinationWeatherComponent);
export default DestinationWeather;
