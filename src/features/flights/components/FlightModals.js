import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, FlatList } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import styles from "../flightSearch.styles";

const CURRENCY_LIST = ["BRL", "USD", "EUR", "AED", "GBP"];

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

export function DestinationModal({
  visible,
  onClose,
  destinationOptions,
  onSelectAirport,
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
        <View
          style={[
            styles.modalDestinationContent,
            !isDarkMode && {
              backgroundColor: "#FFFFFF",
              borderWidth: 0,
              shadowColor: "transparent",
              shadowOpacity: 0,
              shadowRadius: 0,
              elevation: 0,
            },
          ]}
        >
          <Text style={[styles.calendarTitleText, { marginBottom: 15, textAlign: "center" }, !isDarkMode && { color: "#000000" }]}>
            Selecione o Aeroporto de Chegada
          </Text>
          <FlatList
            data={destinationOptions}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.autocompleteItem, !isDarkMode && { borderBottomColor: "rgba(0, 0, 0, 0.08)" }]}
                onPress={() => {
                  onSelectAirport(item);
                  onClose();
                }}
              >
                <Feather name="navigation" size={16} color={currentTheme.accent} style={styles.marginRight10} />
                <Text style={[styles.autocompleteText, !isDarkMode && { color: "#000000" }]}>
                  {item.nome_aeroporto} ({item.codigo_iata})
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Text style={[styles.closeModalButtonText, !isDarkMode && { color: "rgba(0, 0, 0, 0.6)" }]}>Cancelar</Text>
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
        <View
          style={[
            styles.modalDestinationContent,
            !isDarkMode && {
              backgroundColor: "#FFFFFF",
              borderWidth: 0,
              shadowColor: "transparent",
              shadowOpacity: 0,
              shadowRadius: 0,
              elevation: 0,
            },
          ]}
        >
          <Text style={[styles.calendarTitleText, { marginBottom: 15, textAlign: "center" }, !isDarkMode && { color: "#000000" }]}>
            Selecione a Classe do Voo
          </Text>
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.autocompleteItem, !isDarkMode && { borderBottomColor: "rgba(0, 0, 0, 0.08)" }]}
                onPress={() => {
                  onSelectClass(item.label);
                  onClose();
                }}
              >
                <Feather name="layers" size={16} color={currentTheme.accent} style={styles.marginRight10} />
                <Text style={[styles.autocompleteText, !isDarkMode && { color: "#000000" }]}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Text style={[styles.closeModalButtonText, !isDarkMode && { color: "rgba(0, 0, 0, 0.6)" }]}>Cancelar</Text>
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
        <View
          style={[
            styles.modalDestinationContent,
            !isDarkMode && {
              backgroundColor: "#FFFFFF",
              borderWidth: 0,
              shadowColor: "transparent",
              shadowOpacity: 0,
              shadowRadius: 0,
              elevation: 0,
            },
          ]}
        >
          <Text style={[styles.calendarTitleText, { marginBottom: 15, textAlign: "center" }, !isDarkMode && { color: "#000000" }]}>
            Selecione o Tipo de Moeda
          </Text>
          <FlatList
            data={CURRENCY_LIST}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.autocompleteItem, !isDarkMode && { borderBottomColor: "rgba(0, 0, 0, 0.08)" }]}
                onPress={() => {
                  onSelectCurrency(item);
                  onClose();
                }}
              >
                <Feather name="dollar-sign" size={16} color={currentTheme.accent} style={styles.marginRight10} />
                <Text style={[styles.autocompleteText, !isDarkMode && { color: "#000000" }]}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Text style={[styles.closeModalButtonText, !isDarkMode && { color: "rgba(0, 0, 0, 0.6)" }]}>Cancelar</Text>
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

  useEffect(() => {
    if (visible) {
      const dateStr = target === "IDA" ? departDate : returnDate;
      if (dateStr && dateStr.includes("-")) {
        const [year, month] = dateStr.split("-").map(Number);
        setCurrentCalendarYear(year);
        setCurrentCalendarMonth(month - 1);
      }
    }
  }, [visible, target, departDate, returnDate]);

  const changeMonth = (dir) => {
    let m = currentCalendarMonth + dir;
    let y = currentCalendarYear;
    if (m > 11) { m = 0; y++; } else if (m < 0) { m = 11; y--; }
    setCurrentCalendarMonth(m);
    setCurrentCalendarYear(y);
  };

  const generateCalendarDays = () => {
    const firstDayIndex = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();
    const totalDays = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDayIndex; i++) days.push({ dayStr: "", isEmpty: true });
    for (let i = 1; i <= totalDays; i++)
      days.push({ dayStr: String(i).padStart(2, "0"), isEmpty: false });
    return days;
  };

  const handleSelectDay = (dayStr) => {
    const m = String(currentCalendarMonth + 1).padStart(2, "0");
    const newDate = `${currentCalendarYear}-${m}-${dayStr}`;
    onSelectDate(newDate, target);
    onClose();
  };

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
        <View
          style={[
            styles.modalContent,
            !isDarkMode && {
              backgroundColor: "#FFFFFF",
              borderWidth: 0,
              shadowColor: "transparent",
              shadowOpacity: 0,
              shadowRadius: 0,
              elevation: 0,
            },
          ]}
        >
          <View style={styles.calendarSelectorRow}>
            <TouchableOpacity
              style={[styles.calendarNavButton, !isDarkMode && { backgroundColor: "rgba(0, 0, 0, 0.06)" }]}
              onPress={() => changeMonth(-1)}
            >
              <Feather name="chevron-left" size={18} color={!isDarkMode ? "#000000" : "#FFFFFF"} />
            </TouchableOpacity>
            <Text style={[styles.calendarTitleText, !isDarkMode && { color: "#000000" }]}>
              {MONTH_NAMES[currentCalendarMonth]} {currentCalendarYear}
            </Text>
            <TouchableOpacity
              style={[styles.calendarNavButton, !isDarkMode && { backgroundColor: "rgba(0, 0, 0, 0.06)" }]}
              onPress={() => changeMonth(1)}
            >
              <Feather name="chevron-right" size={18} color={!isDarkMode ? "#000000" : "#FFFFFF"} />
            </TouchableOpacity>
          </View>
          <View style={styles.calendarHeaderRow}>
            {WEEKDAYS.map((day, i) => (
              <Text key={i} style={[styles.calendarHeaderCell, !isDarkMode && { color: "rgba(0, 0, 0, 0.5)" }]}>{day}</Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {generateCalendarDays().map((item, index) => {
              const today = new Date(); today.setHours(0, 0, 0, 0);
              const cellDate = new Date(currentCalendarYear, currentCalendarMonth, Number(item.dayStr));
              const isPast = !item.isEmpty && cellDate < today;
              const fullDate = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, "0")}-${item.dayStr}`;
              const isSelected = !item.isEmpty &&
                (target === "IDA" ? departDate : returnDate) === fullDate;
              return (
                <TouchableOpacity
                  key={index}
                  disabled={item.isEmpty || isPast}
                  style={[
                    styles.calendarDay,
                    isSelected && [styles.calendarDayActive, { backgroundColor: currentTheme.accent }],
                  ]}
                  onPress={() => handleSelectDay(item.dayStr)}
                >
                  <Text style={[
                    styles.calendarDayText,
                    !isDarkMode && { color: "#000000" },
                    isSelected && styles.calendarDayTextActive,
                    isPast && (styles.calendarDayTextDisabled || { color: "rgba(0, 0, 0, 0.25)" }),
                    item.isEmpty && styles.calendarDayTextEmpty,
                  ]}>
                    {item.dayStr}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity style={styles.closeModalButton} onPress={onClose}>
            <Text style={[styles.closeModalButtonText, !isDarkMode && { color: "rgba(0, 0, 0, 0.6)" }]}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
