import React, { memo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import FadeInView from "../../../shared/components/FadeInView";
import { FlightDirectSwitch } from "./FlightDirectSwitch";
import { CURRENCY_MAP } from "./modals/CurrencyModal";
import styles, { getAccentBg, getPaddingBottom } from "../styles/flightSearchForm.styles";

function FlightSearchFormComponent({
  scrollViewRef,
  keyboardPadding,
  tripType,
  setTripType,
  originInput,
  setOriginInput,
  setOriginAirport,
  originSuggestions,
  setOriginSuggestions,
  loadingOrigin,
  destinationAirport,
  loadingDestination,
  setDestinationModalVisible,
  departDate,
  returnDate,
  formatDateDisplay,
  handleOpenCalendar,
  adults,
  children,
  childrenAges,
  handleAdultsChange,
  handleChildrenChange,
  setSelectedChildIndex,
  setChildAgeModalVisible,
  sortOption,
  setSortModalVisible,
  cabinClass,
  setClassModalVisible,
  currency,
  setCurrencyModalVisible,
  onlyDirect,
  setOnlyDirect,
  switchTrackBg,
  switchThumbTranslate,
  switchThumbBg,
  formErrors,
  setFormErrors,
  handleSearchFlights,
  scrollToOffset,
  selectedItem,
  currentTheme,
  isDarkMode,
}) {
  const activeTripTypeBg = getAccentBg(currentTheme.accent);
  const actionButtonBg = isDarkMode
    ? [styles.actionButtonDark, getAccentBg(currentTheme.accent)]
    : styles.actionButtonLight;
  const paddingBottomStyle = getPaddingBottom(keyboardPadding);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.flex1}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.flex1}
        contentContainerStyle={[styles.scrollContent, paddingBottomStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={true}
      >
        <View
          style={[
            styles.tripTypeContainer,
            !isDarkMode && styles.tripTypeContainerLight,
          ]}
        >
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.tripTypeTab,
              tripType === "ROUND_TRIP" && activeTripTypeBg,
            ]}
            onPress={() => setTripType("ROUND_TRIP")}
          >
            <Text
              style={[
                styles.tripTypeText,
                tripType === "ROUND_TRIP"
                  ? styles.tripTypeTextActive
                  : isDarkMode
                  ? styles.tripTypeTextInactiveDark
                  : styles.tripTypeTextInactiveLight,
              ]}
            >
              Ida e Volta
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={[
              styles.tripTypeTab,
              tripType === "ONE_WAY" && activeTripTypeBg,
            ]}
            onPress={() => setTripType("ONE_WAY")}
          >
            <Text
              style={[
                styles.tripTypeText,
                tripType === "ONE_WAY"
                  ? styles.tripTypeTextActive
                  : isDarkMode
                  ? styles.tripTypeTextInactiveDark
                  : styles.tripTypeTextInactiveLight,
              ]}
            >
              Somente Ida
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.inputLabel,
            isDarkMode ? styles.inputLabelDark : styles.inputLabelLight,
          ]}
        >
          Aeroporto de Origem
        </Text>
        <View
          style={[
            styles.inputSearchContainer,
            formErrors.origin && styles.inputSearchContainerError,
          ]}
        >
          <TextInput
            style={[
              styles.textInputField,
              isDarkMode ? styles.textInputFieldDark : styles.textInputFieldLight,
            ]}
            value={originInput}
            onChangeText={(text) => {
              setOriginInput(text);
              if (!text) setOriginAirport(null);
              setFormErrors((prev) => ({ ...prev, origin: null }));
            }}
            placeholder="Ex: São Paulo"
            placeholderTextColor={!isDarkMode ? "#9CA3AF" : "#8E8E93"}
            onFocus={() => scrollToOffset(70)}
          />
          {loadingOrigin && (
            <ActivityIndicator
              size="small"
              color={currentTheme.accent}
              style={styles.inputSpinner}
            />
          )}
        </View>
        {formErrors.origin && (
          <Text style={styles.fieldErrorText}>{formErrors.origin}</Text>
        )}
        {originSuggestions.length > 0 && (
          <FadeInView
            duration={200}
            style={[
              styles.autocompleteContainer,
              isDarkMode ? styles.autocompleteContainerDark : styles.autocompleteContainerLight,
            ]}
          >
            {originSuggestions.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.autocompleteItem,
                  !isDarkMode && styles.autocompleteItemLight,
                ]}
                onPress={() => {
                  setOriginAirport(item);
                  setOriginInput(
                    `${item.nome_aeroporto || item.name} (${item.codigo_iata || item.iataCode})`
                  );
                  setOriginSuggestions([]);
                  setFormErrors((prev) => ({ ...prev, origin: null }));
                }}
              >
                <Feather
                  name="map-pin"
                  size={14}
                  color={!isDarkMode ? "#6B7280" : "#8E8E93"}
                  style={styles.autocompleteIcon}
                />
                <Text
                  style={[
                    styles.autocompleteText,
                    isDarkMode ? styles.autocompleteTextDark : styles.autocompleteTextLight,
                  ]}
                >
                  {item.nome_aeroporto || item.name} ({item.codigo_iata || item.iataCode}) - {item.cidade || item.city}/{item.estado || item.state}
                </Text>
              </TouchableOpacity>
            ))}
          </FadeInView>
        )}

        <Text
          style={[
            styles.inputLabel,
            isDarkMode ? styles.inputLabelDark : styles.inputLabelLight,
          ]}
        >
          Aeroporto de Destino
        </Text>
        <TouchableOpacity
          style={[
            styles.input,
            styles.selectContainerRow,
            isDarkMode ? styles.inputDark : styles.inputLight,
            formErrors.destination && styles.inputError,
          ]}
          onPress={() => setDestinationModalVisible(true)}
          disabled={loadingDestination}
          activeOpacity={0.6}
        >
          {loadingDestination ? (
            <ActivityIndicator size="small" color={currentTheme.accent} />
          ) : (
            <Text
              style={[
                styles.inputText,
                isDarkMode ? styles.inputTextDark : styles.inputTextLight,
              ]}
            >
              {destinationAirport
                ? `${destinationAirport.nome_aeroporto || destinationAirport.name} (${destinationAirport.codigo_iata || destinationAirport.iataCode})`
                : "Nenhum aeroporto encontrado"}
            </Text>
          )}
        </TouchableOpacity>
        {formErrors.destination && (
          <Text style={styles.fieldErrorText}>{formErrors.destination}</Text>
        )}

        <Text
          style={[
            styles.inputLabel,
            isDarkMode ? styles.inputLabelDark : styles.inputLabelLight,
          ]}
        >
          DATA DE IDA
        </Text>
        <TouchableOpacity
          style={[
            styles.input,
            styles.selectContainerRow,
            isDarkMode ? styles.inputDark : styles.inputLight,
            formErrors.departDate && styles.inputError,
          ]}
          onPress={() => handleOpenCalendar("IDA")}
        >
          <Text
            style={[
              styles.inputText,
              isDarkMode ? styles.inputTextDark : styles.inputTextLight,
            ]}
          >
            {departDate ? formatDateDisplay(departDate) : "Selecione a data"}
          </Text>
          <Feather name="calendar" size={18} color="#8E8E93" />
        </TouchableOpacity>
        {formErrors.departDate && (
          <Text style={styles.fieldErrorText}>{formErrors.departDate}</Text>
        )}

        {tripType === "ROUND_TRIP" && (
          <>
            <Text
              style={[
                styles.inputLabel,
                isDarkMode ? styles.inputLabelDark : styles.inputLabelLight,
              ]}
            >
              DATA DE VOLTA
            </Text>
            <TouchableOpacity
              style={[
                styles.input,
                styles.selectContainerRow,
                isDarkMode ? styles.inputDark : styles.inputLight,
                formErrors.returnDate && styles.inputError,
              ]}
              onPress={() => handleOpenCalendar("VOLTA")}
            >
              <Text
                style={[
                  styles.inputText,
                  isDarkMode ? styles.inputTextDark : styles.inputTextLight,
                ]}
              >
                {returnDate ? formatDateDisplay(returnDate) : "Selecione a data"}
              </Text>
              <Feather name="calendar" size={18} color="#8E8E93" />
            </TouchableOpacity>
            {formErrors.returnDate && (
              <Text style={styles.fieldErrorText}>{formErrors.returnDate}</Text>
            )}
          </>
        )}

        <View style={styles.rowInputs}>
          <View style={styles.inputCol}>
            <Text
              style={[
                styles.labelCol,
                isDarkMode ? styles.labelColDark : styles.labelColLight,
              ]}
            >
              ADULTOS
            </Text>
            <TextInput
              style={[
                styles.inputCenter,
                isDarkMode ? styles.inputCenterDark : styles.inputCenterLight,
                formErrors.adults && styles.inputCenterError,
              ]}
              value={adults}
              onChangeText={handleAdultsChange}
              keyboardType="numeric"
              onFocus={() => scrollToOffset(tripType === "ROUND_TRIP" ? 360 : 300)}
            />
            {formErrors.adults && (
              <Text style={styles.fieldErrorTextCentered}>
                {formErrors.adults}
              </Text>
            )}
          </View>
          <View style={styles.inputColLast}>
            <Text
              style={[
                styles.labelCol,
                isDarkMode ? styles.labelColDark : styles.labelColLight,
              ]}
            >
              CRIANÇAS
            </Text>
            <TextInput
              style={[
                styles.inputCenter,
                isDarkMode ? styles.inputCenterDark : styles.inputCenterLight,
              ]}
              value={children}
              onChangeText={handleChildrenChange}
              keyboardType="numeric"
              onFocus={() => scrollToOffset(tripType === "ROUND_TRIP" ? 400 : 340)}
            />
          </View>
        </View>

        {(parseInt(adults, 10) || 0) + (parseInt(children, 10) || 0) >= 9 && (
          <Text style={styles.fieldLimitNotice}>
            Limite máximo de 9 passageiros atingido (adultos + crianças).
          </Text>
        )}

        {childrenAges.length > 0 && (
          <View style={styles.childrenAgesWrapper}>
            <Text
              style={[
                styles.inputLabel,
                isDarkMode ? styles.inputLabelDark : styles.inputLabelLight,
              ]}
            >
              IDADE DAS CRIANÇAS
            </Text>
            <View style={styles.childrenAgesGrid}>
              {childrenAges.map((age, idx) => (
                <TouchableOpacity
                  key={idx}
                  activeOpacity={0.7}
                  style={[
                    styles.childAgeCard,
                    !isDarkMode && styles.childAgeCardLight,
                  ]}
                  onPress={() => {
                    setSelectedChildIndex(idx);
                    setChildAgeModalVisible(true);
                  }}
                >
                  <Text style={styles.childAgeCardLabel}>Criança {idx + 1}</Text>
                  <View style={styles.childAgeValueRow}>
                    <Text
                      style={[
                        styles.childAgeCardValue,
                        isDarkMode ? styles.childAgeCardValueDark : styles.childAgeCardValueLight,
                      ]}
                    >
                      {age === 0 ? "Menos de 1 ano" : `${age} ${age === 1 ? "ano" : "anos"}`}
                    </Text>
                    <Feather
                      name="chevron-down"
                      size={16}
                      color={!isDarkMode ? "#6B7280" : "#8E8E93"}
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <Text
          style={[
            styles.inputLabel,
            isDarkMode ? styles.inputLabelDark : styles.inputLabelLight,
          ]}
        >
          CRITÉRIO DE BUSCA
        </Text>
        <TouchableOpacity
          style={[
            styles.input,
            styles.selectContainerRow,
            isDarkMode ? styles.inputDark : styles.inputLight,
          ]}
          onPress={() => setSortModalVisible(true)}
          activeOpacity={0.6}
        >
          <Text
            style={[
              styles.inputText,
              isDarkMode ? styles.inputTextDark : styles.inputTextLight,
            ]}
          >
            {sortOption}
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.inputLabel,
            isDarkMode ? styles.inputLabelDark : styles.inputLabelLight,
          ]}
        >
          CLASSE DO VOO
        </Text>
        <TouchableOpacity
          style={[
            styles.input,
            styles.selectContainerRow,
            isDarkMode ? styles.inputDark : styles.inputLight,
          ]}
          onPress={() => setClassModalVisible(true)}
          activeOpacity={0.6}
        >
          <Text
            style={[
              styles.inputText,
              isDarkMode ? styles.inputTextDark : styles.inputTextLight,
            ]}
          >
            {cabinClass}
          </Text>
        </TouchableOpacity>

        <Text
          style={[
            styles.inputLabel,
            isDarkMode ? styles.inputLabelDark : styles.inputLabelLight,
          ]}
        >
          TIPO DE MOEDA
        </Text>
        <TouchableOpacity
          style={[
            styles.input,
            styles.selectContainerRow,
            isDarkMode ? styles.inputDark : styles.inputLight,
          ]}
          onPress={() => setCurrencyModalVisible(true)}
          activeOpacity={0.6}
        >
          <Text
            style={[
              styles.inputText,
              isDarkMode ? styles.inputTextDark : styles.inputTextLight,
            ]}
          >
            {`${currency} (${CURRENCY_MAP[currency] || currency})`}
          </Text>
        </TouchableOpacity>

        <FlightDirectSwitch
          onlyDirect={onlyDirect}
          setOnlyDirect={setOnlyDirect}
          currentTheme={currentTheme}
          isDarkMode={isDarkMode}
          switchTrackBg={switchTrackBg}
          switchThumbTranslate={switchThumbTranslate}
          switchThumbBg={switchThumbBg}
        />
      </ScrollView>

      <View
        style={[
          styles.footerPriceRow,
          isDarkMode ? styles.footerPriceRowDark : styles.footerPriceRowLight,
        ]}
      >
        <View style={styles.priceContainer}>
          <Text
            style={[
              styles.priceLabel,
              isDarkMode ? styles.priceLabelDark : styles.priceLabelLight,
            ]}
          >
            Localização
          </Text>
          <Text
            style={[
              styles.priceValue,
              isDarkMode ? styles.priceValueDark : styles.priceValueLight,
            ]}
            numberOfLines={1}
          >
            {selectedItem?.location || selectedItem?.title || "Pronto para buscar"}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.actionButton, actionButtonBg]}
          onPress={handleSearchFlights}
          activeOpacity={0.8}
        >
          <Feather
            name="search"
            size={24}
            color={!isDarkMode ? "#FFFFFF" : "#000000"}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

export const FlightSearchForm = memo(FlightSearchFormComponent);
