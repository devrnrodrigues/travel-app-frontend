import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import styles from "../flightSearch.styles";

export const CURRENCY_MAP = {
  BRL: "Real",
  USD: "Dólar",
  EUR: "Euro",
  GBP: "Libra",
  AED: "Dirham",
};

export const CURRENCY_LIST = [
  { code: "BRL", label: "BRL (Real)" },
  { code: "USD", label: "USD (Dólar)" },
  { code: "EUR", label: "EUR (Euro)" },
  { code: "GBP", label: "GBP (Libra)" },
  { code: "AED", label: "AED (Dirham)" },
];

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function DestinationModal({
  visible,
  onClose,
  destinationOptions,
  onSelectAirport,
  selectedAirport,
  currentTheme,
  isDarkMode,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalDestinationContent, !isDarkMode && styles.modalDestinationContentLight]}>
          <View style={[styles.modalSelectHeader, !isDarkMode && styles.modalSelectHeaderLight]}>
            <Text style={[styles.modalSelectTitle, !isDarkMode && { color: "#111827" }]}>
              Aeroporto de Chegada
            </Text>
          </View>
          <FlatList
            data={destinationOptions}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = selectedAirport?.id === item.id || selectedAirport?.codigo_iata === item.codigo_iata;
              return (
                <TouchableOpacity
                  style={[
                    styles.modalOptionItem,
                    !isDarkMode && styles.modalOptionItemLight,
                    isSelected && { borderColor: currentTheme.accent, borderWidth: 1.5 },
                  ]}
                  onPress={() => {
                    onSelectAirport(item);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalOptionLeft}>
                    <View
                      style={[
                        styles.modalOptionIconBox,
                        !isDarkMode && styles.modalOptionIconBoxLight,
                        isSelected && { backgroundColor: currentTheme.accent + "18" },
                      ]}
                    >
                      <Feather
                        name="navigation"
                        size={16}
                        color={isSelected ? currentTheme.accent : (!isDarkMode ? "#4B5563" : "#8E8E93")}
                      />
                    </View>
                    <Text
                      style={[
                        styles.modalOptionText,
                        !isDarkMode && { color: "#111827" },
                        isSelected && { fontWeight: "700" },
                      ]}
                    >
                      {item.nome_aeroporto} ({item.codigo_iata})
                    </Text>
                  </View>
                  {isSelected && <Feather name="check" size={18} color={currentTheme.accent} />}
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity
            style={[styles.closeModalButton, !isDarkMode && styles.closeModalButtonLight]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.closeModalButtonText, !isDarkMode && { color: "#4B5563" }]}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export function CabinClassModal({
  visible,
  onClose,
  onSelectClass,
  cabinClassMap,
  selectedClass,
  currentTheme,
  isDarkMode,
}) {
  const data = Object.keys(cabinClassMap).map((label) => ({ id: cabinClassMap[label], label }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalDestinationContent, !isDarkMode && styles.modalDestinationContentLight]}>
          <View style={[styles.modalSelectHeader, !isDarkMode && styles.modalSelectHeaderLight]}>
            <Text style={[styles.modalSelectTitle, !isDarkMode && { color: "#111827" }]}>
              Classe do Voo
            </Text>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = selectedClass === item.label;
              return (
                <TouchableOpacity
                  style={[
                    styles.modalOptionItem,
                    !isDarkMode && styles.modalOptionItemLight,
                    isSelected && { borderColor: currentTheme.accent, borderWidth: 1.5 },
                  ]}
                  onPress={() => {
                    onSelectClass(item.label);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalOptionLeft}>
                    <View
                      style={[
                        styles.modalOptionIconBox,
                        !isDarkMode && styles.modalOptionIconBoxLight,
                        isSelected && { backgroundColor: currentTheme.accent + "18" },
                      ]}
                    >
                      <Feather
                        name="layers"
                        size={16}
                        color={isSelected ? currentTheme.accent : (!isDarkMode ? "#4B5563" : "#8E8E93")}
                      />
                    </View>
                    <Text
                      style={[
                        styles.modalOptionText,
                        !isDarkMode && { color: "#111827" },
                        isSelected && { fontWeight: "700" },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  {isSelected && <Feather name="check" size={18} color={currentTheme.accent} />}
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity
            style={[styles.closeModalButton, !isDarkMode && styles.closeModalButtonLight]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.closeModalButtonText, !isDarkMode && { color: "#4B5563" }]}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export function CurrencyModal({
  visible,
  onClose,
  onSelectCurrency,
  selectedCurrency,
  currentTheme,
  isDarkMode,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalDestinationContent, !isDarkMode && styles.modalDestinationContentLight]}>
          <View style={[styles.modalSelectHeader, !isDarkMode && styles.modalSelectHeaderLight]}>
            <Text style={[styles.modalSelectTitle, !isDarkMode && { color: "#111827" }]}>
              Tipo de Moeda
            </Text>
          </View>
          <FlatList
            data={CURRENCY_LIST}
            keyExtractor={(item) => item.code}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = selectedCurrency === item.code;
              return (
                <TouchableOpacity
                  style={[
                    styles.modalOptionItem,
                    !isDarkMode && styles.modalOptionItemLight,
                    isSelected && { borderColor: currentTheme.accent, borderWidth: 1.5 },
                  ]}
                  onPress={() => {
                    onSelectCurrency(item.code);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalOptionLeft}>
                    <View
                      style={[
                        styles.modalOptionIconBox,
                        !isDarkMode && styles.modalOptionIconBoxLight,
                        isSelected && { backgroundColor: currentTheme.accent + "18" },
                      ]}
                    >
                      <Feather
                        name="dollar-sign"
                        size={16}
                        color={isSelected ? currentTheme.accent : (!isDarkMode ? "#4B5563" : "#8E8E93")}
                      />
                    </View>
                    <Text
                      style={[
                        styles.modalOptionText,
                        !isDarkMode && { color: "#111827" },
                        isSelected && { fontWeight: "700" },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  {isSelected && <Feather name="check" size={18} color={currentTheme.accent} />}
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity
            style={[styles.closeModalButton, !isDarkMode && styles.closeModalButtonLight]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.closeModalButtonText, !isDarkMode && { color: "#4B5563" }]}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export function SortModal({
  visible,
  onClose,
  onSelectSort,
  sortMap,
  selectedSort,
  currentTheme,
  isDarkMode,
}) {
  const data = Object.keys(sortMap).map((label) => ({ id: sortMap[label], label }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalDestinationContent, !isDarkMode && styles.modalDestinationContentLight]}>
          <View style={[styles.modalSelectHeader, !isDarkMode && styles.modalSelectHeaderLight]}>
            <Text style={[styles.modalSelectTitle, !isDarkMode && { color: "#111827" }]}>
              Critério de Busca
            </Text>
          </View>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = selectedSort === item.label;
              return (
                <TouchableOpacity
                  style={[
                    styles.modalOptionItem,
                    !isDarkMode && styles.modalOptionItemLight,
                    isSelected && { borderColor: currentTheme.accent, borderWidth: 1.5 },
                  ]}
                  onPress={() => {
                    onSelectSort(item.label);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalOptionLeft}>
                    <View
                      style={[
                        styles.modalOptionIconBox,
                        !isDarkMode && styles.modalOptionIconBoxLight,
                        isSelected && { backgroundColor: currentTheme.accent + "18" },
                      ]}
                    >
                      <Feather
                        name={item.id === "CHEAPEST" ? "dollar-sign" : item.id === "FASTEST" ? "zap" : "award"}
                        size={16}
                        color={isSelected ? currentTheme.accent : (!isDarkMode ? "#4B5563" : "#8E8E93")}
                      />
                    </View>
                    <Text
                      style={[
                        styles.modalOptionText,
                        !isDarkMode && { color: "#111827" },
                        isSelected && { fontWeight: "700" },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  {isSelected && <Feather name="check" size={18} color={currentTheme.accent} />}
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity
            style={[styles.closeModalButton, !isDarkMode && styles.closeModalButtonLight]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.closeModalButtonText, !isDarkMode && { color: "#4B5563" }]}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export function CalendarModal({
  visible,
  onClose,
  target,
  departDate,
  returnDate,
  onSelectDate,
  currentTheme,
  isDarkMode,
}) {
  const [currentCalendarYear, setCurrentCalendarYear] = useState(new Date().getFullYear());
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    if (visible) {
      const dateStr = target === "IDA" ? departDate : returnDate;
      if (dateStr && dateStr.includes("-")) {
        const [year, month] = dateStr.split("-").map(Number);
        setCurrentCalendarYear(year);
        setCurrentCalendarMonth(month - 1);
        setSelectedDate(dateStr);
      } else {
        const today = new Date();
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, "0");
        const d = String(today.getDate()).padStart(2, "0");
        const defaultDate = `${y}-${m}-${d}`;
        setSelectedDate(defaultDate);
        setCurrentCalendarYear(today.getFullYear());
        setCurrentCalendarMonth(today.getMonth());
      }
    }
  }, [visible, target, departDate, returnDate]);

  const changeMonth = (dir) => {
    let m = currentCalendarMonth + dir;
    let y = currentCalendarYear;
    if (m > 11) {
      m = 0;
      y++;
    } else if (m < 0) {
      m = 11;
      y--;
    }
    setCurrentCalendarMonth(m);
    setCurrentCalendarYear(y);
  };

  const generateCalendarDays = () => {
    const firstDayIndex = (new Date(currentCalendarYear, currentCalendarMonth, 1).getDay() + 6) % 7;
    const daysInPrevMonth = new Date(currentCalendarYear, currentCalendarMonth, 0).getDate();
    const totalDays = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();

    const days = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      days.push({
        dayNumber: daysInPrevMonth - i,
        isOtherMonth: true,
        isDisabled: true,
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const departDateObj = departDate && departDate.includes("-") ? new Date(departDate + "T00:00:00") : today;
    departDateObj.setHours(0, 0, 0, 0);

    for (let i = 1; i <= totalDays; i++) {
      const cellDate = new Date(currentCalendarYear, currentCalendarMonth, i);
      cellDate.setHours(0, 0, 0, 0);

      const isPast = cellDate < today;
      const isBeforeDepart = target === "VOLTA" && cellDate < departDateObj;
      const isDisabled = isPast || isBeforeDepart;
      const fullDate = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const isSelected = selectedDate === fullDate;
      const isToday = cellDate.getTime() === today.getTime();
      const isDepartDate = target === "VOLTA" && fullDate === departDate;

      days.push({
        dayNumber: i,
        dayStr: String(i),
        fullDate,
        isOtherMonth: false,
        isDisabled,
        isSelected,
        isToday,
        isDepartDate,
      });
    }

    const totalCells = days.length;
    const remainder = totalCells % 7;
    if (remainder > 0) {
      const nextDaysCount = 7 - remainder;
      for (let i = 1; i <= nextDaysCount; i++) {
        days.push({
          dayNumber: i,
          isOtherMonth: true,
          isDisabled: true,
        });
      }
    }

    return days;
  };

  const handleSelectDay = (fullDate) => {
    setSelectedDate(fullDate);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onSelectDate(selectedDate, target);
    }
    onClose();
  };

  const now = new Date();
  const isCurrentOrPastMonth =
    currentCalendarYear < now.getFullYear() ||
    (currentCalendarYear === now.getFullYear() && currentCalendarMonth <= now.getMonth());

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, !isDarkMode && styles.modalContentLight]}>
          <View style={styles.calendarSelectorRow}>
            <TouchableOpacity
              style={[
                styles.calendarNavButton,
                !isDarkMode && styles.calendarNavButtonLight,
                isCurrentOrPastMonth && { opacity: 0.3 },
              ]}
              disabled={isCurrentOrPastMonth}
              onPress={() => changeMonth(-1)}
              activeOpacity={0.7}
            >
              <Feather name="chevron-left" size={18} color={!isDarkMode ? "#111827" : "#FFFFFF"} />
            </TouchableOpacity>

            <View style={{ alignItems: "center" }}>
              <Text style={[styles.calendarTitleText, !isDarkMode && { color: "#111827" }]}>
                {MONTH_NAMES[currentCalendarMonth]} {currentCalendarYear}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.calendarNavButton, !isDarkMode && styles.calendarNavButtonLight]}
              onPress={() => changeMonth(1)}
              activeOpacity={0.7}
            >
              <Feather name="chevron-right" size={18} color={!isDarkMode ? "#111827" : "#FFFFFF"} />
            </TouchableOpacity>
          </View>

          <View style={[styles.calendarDivider, !isDarkMode && styles.calendarDividerLight]} />

          <View style={styles.calendarHeaderRow}>
            {WEEKDAYS.map((day, i) => (
              <Text
                key={i}
                style={[
                  styles.calendarHeaderCell,
                  !isDarkMode && { color: "#9CA3AF" },
                ]}
              >
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {generateCalendarDays().map((item, index) => {
              if (item.isOtherMonth) {
                return (
                  <View key={index} style={styles.calendarDay}>
                    <View style={styles.calendarDayTile}>
                      <Text
                        style={[
                          styles.calendarDayText,
                          styles.calendarDayTextOtherMonth,
                          !isDarkMode && { color: "#D1D5DB" },
                        ]}
                      >
                        {item.dayNumber}
                      </Text>
                    </View>
                  </View>
                );
              }

              return (
                <View key={index} style={styles.calendarDay}>
                  <TouchableOpacity
                    disabled={item.isDisabled}
                    style={[
                      styles.calendarDayTile,
                      item.isSelected && [styles.calendarDayTileActive, { backgroundColor: currentTheme.accent }],
                      target === "IDA" && item.isToday && !item.isSelected && [
                        styles.calendarDayTileOutline,
                        { borderColor: currentTheme.accent },
                      ],
                    ]}
                    onPress={() => handleSelectDay(item.fullDate)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.calendarDayText,
                        !isDarkMode && { color: "#111827" },
                        item.isSelected && styles.calendarDayTextActive,
                        target === "IDA" && item.isToday && !item.isSelected && {
                          color: currentTheme.accent,
                          fontWeight: "700",
                        },
                        item.isDisabled && (styles.calendarDayTextDisabled || { color: "rgba(0, 0, 0, 0.25)" }),
                        item.isDisabled && !isDarkMode && { color: "#D1D5DB" },
                      ]}
                    >
                      {item.dayNumber}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          <View style={[styles.calendarFooterRow, !isDarkMode && styles.calendarFooterRowLight]}>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Text style={[styles.calendarCancelText, !isDarkMode && { color: "#6B7280" }]}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.calendarDoneButton, { backgroundColor: currentTheme.accent }]}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Text style={styles.calendarDoneButtonText}>Concluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function ChildAgeModal({
  visible,
  onClose,
  childIndex,
  currentAge,
  onSelectAge,
  currentTheme,
  isDarkMode,
}) {
  const ages = Array.from({ length: 18 }, (_, i) => ({
    age: i,
    label: i === 0 ? "Bebê (< 1 ano / colo)" : `${i} ${i === 1 ? "ano" : "anos"}`,
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent={true}
      navigationBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalDestinationContent, !isDarkMode && styles.modalDestinationContentLight]}>
          <View style={[styles.modalSelectHeader, !isDarkMode && styles.modalSelectHeaderLight]}>
            <Text style={[styles.modalSelectTitle, !isDarkMode && { color: "#111827" }]}>
              Idade da Criança {childIndex + 1}
            </Text>
          </View>
          <FlatList
            data={ages}
            keyExtractor={(item) => String(item.age)}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = currentAge === item.age;
              return (
                <TouchableOpacity
                  style={[
                    styles.modalOptionItem,
                    !isDarkMode && styles.modalOptionItemLight,
                    isSelected && { borderColor: currentTheme.accent, borderWidth: 1.5 },
                  ]}
                  onPress={() => {
                    onSelectAge(item.age);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.modalOptionLeft}>
                    <View
                      style={[
                        styles.modalOptionIconBox,
                        !isDarkMode && styles.modalOptionIconBoxLight,
                        isSelected && { backgroundColor: currentTheme.accent + "18" },
                      ]}
                    >
                      <Feather
                        name="user"
                        size={16}
                        color={isSelected ? currentTheme.accent : (!isDarkMode ? "#4B5563" : "#8E8E93")}
                      />
                    </View>
                    <Text
                      style={[
                        styles.modalOptionText,
                        !isDarkMode && { color: "#111827" },
                        isSelected && { fontWeight: "700" },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </View>
                  {isSelected && <Feather name="check" size={18} color={currentTheme.accent} />}
                </TouchableOpacity>
              );
            }}
          />
          <TouchableOpacity
            style={[styles.closeModalButton, !isDarkMode && styles.closeModalButtonLight]}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={[styles.closeModalButtonText, !isDarkMode && { color: "#4B5563" }]}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
