import React, { memo } from "react";
import { View, StatusBar, Animated } from "react-native";
import { useTheme } from "../../../theme/ThemeContext";
import { CABIN_CLASS_MAP, SORT_MAP } from "../api/flightApi";
import { useFlightSearchForm } from "../hooks/useFlightSearchForm";
import { useFlightSearchAnimation } from "../hooks/useFlightSearchAnimation";
import { FlightSearchHeader } from "../components/FlightSearchHeader";
import { FlightSearchForm } from "../components/FlightSearchForm";
import FlightResults from "./FlightResultsScreen";
import {
  DestinationModal,
  CabinClassModal,
  CurrencyModal,
  CalendarModal,
  SortModal,
  ChildAgeModal,
} from "../components/modals/index";
import styles, { getScreenContainerStyle } from "../styles/flightSearchScreen.styles";

function FlightSearchScreenComponent({ navigation, route }) {
  const { isDarkMode } = useTheme();
  const { currentTheme, item: selectedItem } = route.params || {
    currentTheme: { colors: ["#FFF"], accent: "#249689" },
    item: { title: "Destino", image_url: "" },
  };

  const form = useFlightSearchForm({ selectedItem, currentTheme });

  const anim = useFlightSearchAnimation({
    onlyDirect: form.onlyDirect,
    isDarkMode,
    currentTheme,
    navigation,
    searchSubmitted: form.searchSubmitted,
    setSearchSubmitted: form.setSearchSubmitted,
    destinationModalVisible: form.destinationModalVisible,
    setDestinationModalVisible: form.setDestinationModalVisible,
    classModalVisible: form.classModalVisible,
    setClassModalVisible: form.setClassModalVisible,
    currencyModalVisible: form.currencyModalVisible,
    setCurrencyModalVisible: form.setCurrencyModalVisible,
    calendarModalVisible: form.calendarModalVisible,
    setCalendarModalVisible: form.setCalendarModalVisible,
    sortModalVisible: form.sortModalVisible,
    setSortModalVisible: form.setSortModalVisible,
    childAgeModalVisible: form.childAgeModalVisible,
    setChildAgeModalVisible: form.setChildAgeModalVisible,
  });

  const animatedMainStyle = [
    styles.mainContainer,
    getScreenContainerStyle(isDarkMode, anim.screenFadeAnim),
  ];

  return (
    <Animated.View style={animatedMainStyle}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      <FlightSearchHeader
        headerImageSource={form.headerImageSource}
        searchSubmitted={form.searchSubmitted}
        destinationTitle={selectedItem?.title}
        isDarkMode={isDarkMode}
        onBackPress={() =>
          form.searchSubmitted ? form.setSearchSubmitted(false) : anim.handleGoBack()
        }
      />

      <View
        style={[
          styles.infoBottomSection,
          isDarkMode ? styles.infoBottomSectionDark : styles.infoBottomSectionLight,
        ]}
      >
        {!form.searchSubmitted ? (
          <FlightSearchForm
            scrollViewRef={form.scrollViewRef}
            keyboardPadding={form.keyboardPadding}
            tripType={form.tripType}
            setTripType={form.setTripType}
            originInput={form.originInput}
            setOriginInput={form.setOriginInput}
            setOriginAirport={form.setOriginAirport}
            originSuggestions={form.originSuggestions}
            setOriginSuggestions={form.setOriginSuggestions}
            loadingOrigin={form.loadingOrigin}
            destinationAirport={form.destinationAirport}
            loadingDestination={form.loadingDestination}
            setDestinationModalVisible={form.setDestinationModalVisible}
            departDate={form.departDate}
            returnDate={form.returnDate}
            formatDateDisplay={form.formatDateDisplay}
            handleOpenCalendar={form.handleOpenCalendar}
            adults={form.adults}
            children={form.children}
            childrenAges={form.childrenAges}
            handleAdultsChange={form.handleAdultsChange}
            handleChildrenChange={form.handleChildrenChange}
            setSelectedChildIndex={form.setSelectedChildIndex}
            setChildAgeModalVisible={form.setChildAgeModalVisible}
            sortOption={form.sortOption}
            setSortModalVisible={form.setSortModalVisible}
            cabinClass={form.cabinClass}
            setClassModalVisible={form.setClassModalVisible}
            currency={form.currency}
            setCurrencyModalVisible={form.setCurrencyModalVisible}
            onlyDirect={form.onlyDirect}
            setOnlyDirect={form.setOnlyDirect}
            switchTrackBg={anim.switchTrackBg}
            switchThumbTranslate={anim.switchThumbTranslate}
            switchThumbBg={anim.switchThumbBg}
            formErrors={form.formErrors}
            setFormErrors={form.setFormErrors}
            handleSearchFlights={form.handleSearchFlights}
            scrollToOffset={form.scrollToOffset}
            selectedItem={selectedItem}
            currentTheme={currentTheme}
            isDarkMode={isDarkMode}
          />
        ) : (
          <FlightResults
            tickets={form.tickets}
            loading={form.loading}
            error={form.error}
            onRetry={form.handleSearchFlights}
            currentTheme={currentTheme}
            isDarkMode={isDarkMode}
          />
        )}
      </View>

      <DestinationModal
        visible={form.destinationModalVisible}
        onClose={() => form.setDestinationModalVisible(false)}
        destinationOptions={form.destinationOptions}
        onSelectAirport={(airport) => {
          form.setDestinationAirport(airport);
          form.setFormErrors((prev) => ({ ...prev, destination: null }));
        }}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
      />

      <CabinClassModal
        visible={form.classModalVisible}
        onClose={() => form.setClassModalVisible(false)}
        onSelectClass={form.setCabinClass}
        cabinClassMap={CABIN_CLASS_MAP}
        selectedClass={form.cabinClass}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
      />

      <CurrencyModal
        visible={form.currencyModalVisible}
        onClose={() => form.setCurrencyModalVisible(false)}
        onSelectCurrency={form.setCurrency}
        selectedCurrency={form.currency}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
      />

      <CalendarModal
        visible={form.calendarModalVisible}
        onClose={() => form.setCalendarModalVisible(false)}
        target={form.calendarTarget}
        departDate={form.departDate}
        returnDate={form.returnDate}
        onSelectDate={(newDate, target) => {
          if (target === "IDA") {
            form.setDepartDate(newDate);
            form.setFormErrors((prev) => ({ ...prev, departDate: null }));
          } else {
            form.setReturnDate(newDate);
            form.setFormErrors((prev) => ({ ...prev, returnDate: null }));
          }
        }}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
      />

      <SortModal
        visible={form.sortModalVisible}
        onClose={() => form.setSortModalVisible(false)}
        onSelectSort={form.setSortOption}
        sortMap={SORT_MAP}
        selectedSort={form.sortOption}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
      />

      <ChildAgeModal
        visible={form.childAgeModalVisible}
        onClose={() => form.setChildAgeModalVisible(false)}
        childIndex={form.selectedChildIndex}
        currentAge={
          form.childrenAges[form.selectedChildIndex] !== undefined
            ? form.childrenAges[form.selectedChildIndex]
            : 7
        }
        onSelectAge={(newAge) => {
          form.setChildrenAges((prev) => {
            const next = [...prev];
            next[form.selectedChildIndex] = newAge;
            return next;
          });
        }}
        currentTheme={currentTheme}
        isDarkMode={isDarkMode}
      />
    </Animated.View>
  );
}

export default memo(FlightSearchScreenComponent);
