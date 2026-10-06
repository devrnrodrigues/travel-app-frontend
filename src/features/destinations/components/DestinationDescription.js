import React, { memo } from "react";
import { View, Text } from "react-native";
import styles from "../styles/details.styles";
import { DetailsDescriptionSkeleton } from "../../../shared/components/Skeleton";
import FadeInView from "../../../shared/components/FadeInView";
import {
  getFirstParagraph,
  getTruncatedFirstParagraph,
  getRemainingParagraphs,
  isDescriptionUnavailable,
} from "../utils/destinationUtils";

function DestinationDescriptionComponent({
  description,
  loadingAi,
  isDescriptionExpanded,
  toggleDescription,
  isDarkMode,
  currentTheme,
}) {
  return (
    <>
      <View style={styles.rowCenterMarginBottom8}>
        <Text
          style={[
            styles.descriptionHeader,
            styles.descriptionHeaderFlex,
            !isDarkMode && styles.descriptionHeaderLight,
          ]}
        >
          Descrição
        </Text>
      </View>

      {loadingAi ? (
        <DetailsDescriptionSkeleton isDarkMode={isDarkMode} />
      ) : isDescriptionUnavailable(description) ? (
        <FadeInView duration={240}>
          <Text style={[styles.descriptionBody, !isDarkMode && styles.descriptionBodyLight]}>
            {getFirstParagraph(description) || "Descrição indisponível."}
          </Text>
        </FadeInView>
      ) : (
        <FadeInView duration={240}>
          {!isDescriptionExpanded ? (
            <Text style={[styles.descriptionBody, !isDarkMode && styles.descriptionBodyLight]}>
              {getTruncatedFirstParagraph(description)}{" "}
              <Text
                onPress={toggleDescription}
                style={[styles.seeMoreText, { color: currentTheme.accent }]}
              >
                ver mais
              </Text>
            </Text>
          ) : (
            <View>
              <Text style={[styles.descriptionBody, !isDarkMode && styles.descriptionBodyLight]}>
                {getFirstParagraph(description)}
              </Text>
              {getRemainingParagraphs(description).map((para, idx, arr) => {
                const isLast = idx === arr.length - 1;
                return (
                  <Text
                    key={idx}
                    style={[
                      styles.descriptionBody,
                      styles.descriptionBodyMargin,
                      !isDarkMode && styles.descriptionBodyLight,
                    ]}
                  >
                    {para}
                    {isLast && (
                      <Text
                        onPress={toggleDescription}
                        style={[styles.seeMoreText, { color: currentTheme.accent }]}
                      >
                        {" "}ver menos
                      </Text>
                    )}
                  </Text>
                );
              })}
              {getRemainingParagraphs(description).length === 0 && (
                <Text
                  onPress={toggleDescription}
                  style={[styles.seeMoreTextMargin, { color: currentTheme.accent }]}
                >
                  ver menos
                </Text>
              )}
            </View>
          )}
        </FadeInView>
      )}
    </>
  );
}

export const DestinationDescription = memo(DestinationDescriptionComponent);
export default DestinationDescription;
