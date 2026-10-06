import React, { memo } from "react";
import { ScrollView } from "react-native";
import FadeInView from "../../../shared/components/FadeInView";
import { useFlightResults } from "../hooks/useFlightResults";
import { FlightTicketCard } from "../components/FlightTicketCard";
import { FlightResultsFooter } from "../components/FlightResultsFooter";
import {
  FlightResultsLoading,
  FlightResultsError,
  FlightResultsEmpty,
} from "../components/FlightResultsStates";
import styles from "../styles/flightResults.styles";

function FlightResultsScreenComponent({
  tickets,
  loading,
  error,
  onRetry,
  currentTheme,
  isDarkMode,
}) {
  const {
    selectedTicketIndex,
    cheapestTicket,
    sanitizeBaggage,
    formatPriceDisplay,
    handleSelectTicketAndBook,
  } = useFlightResults({ tickets });

  if (loading) {
    return <FlightResultsLoading currentTheme={currentTheme} isDarkMode={isDarkMode} />;
  }

  if (error) {
    return (
      <FlightResultsError
        onRetry={onRetry}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
      />
    );
  }

  if (!tickets || tickets.length === 0) {
    return <FlightResultsEmpty isDarkMode={isDarkMode} />;
  }

  return (
    <FadeInView duration={280} style={styles.flex1}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {tickets.map((ticket, index) => (
          <FlightTicketCard
            key={`${ticket.id}_${index}`}
            ticket={ticket}
            index={index}
            isSelected={selectedTicketIndex === index}
            currentTheme={currentTheme}
            isDarkMode={isDarkMode}
            onSelectTicket={handleSelectTicketAndBook}
            sanitizeBaggage={sanitizeBaggage}
            formatPriceDisplay={formatPriceDisplay}
          />
        ))}
      </ScrollView>

      <FlightResultsFooter
        cheapestTicket={cheapestTicket}
        formatPriceDisplay={formatPriceDisplay}
        isDarkMode={isDarkMode}
      />
    </FadeInView>
  );
}

export default memo(FlightResultsScreenComponent);
