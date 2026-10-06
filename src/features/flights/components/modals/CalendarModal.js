import React, { memo } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useCalendarModal } from "../../hooks/useCalendarModal";
import styles, {
  getAccentBg,
  getAccentBorder,
  getAccentText,
} from "../../styles/calendarModal.styles";

const WEEKDAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
const MONTH_NAMES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

function CalendarModalComponent({
  visible,
  onClose,
  target,
  departDate,
  returnDate,
  onSelectDate,
  currentTheme,
  isDarkMode,
}) {
  const {
    currentCalendarYear,
    currentCalendarMonth,
    calendarDays,
    changeMonth,
    handleSelectDay,
    handleConfirm,
    isCurrentOrPastMonth,
  } = useCalendarModal({
    visible,
    target,
    departDate,
    returnDate,
    onSelectDate,
    onClose,
  });

  const doneButtonBg = getAccentBg(currentTheme.accent);

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
                isCurrentOrPastMonth && styles.calendarNavButtonDisabled,
              ]}
              disabled={isCurrentOrPastMonth}
              onPress={() => changeMonth(-1)}
              activeOpacity={0.7}
            >
              <Feather name="chevron-left" size={18} color={!isDarkMode ? "#111827" : "#FFFFFF"} />
            </TouchableOpacity>

            <View style={styles.calendarTitleContainer}>
              <Text style={[styles.calendarTitleText, !isDarkMode && styles.calendarTitleTextLight]}>
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
                  !isDarkMode && styles.calendarHeaderCellLight,
                ]}
              >
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {calendarDays.map((item, index) => {
              if (item.isOtherMonth) {
                return (
                  <View key={index} style={styles.calendarDay}>
                    <View style={styles.calendarDayTile}>
                      <Text
                        style={[
                          styles.calendarDayText,
                          styles.calendarDayTextOtherMonth,
                          !isDarkMode && styles.calendarDayTextOtherMonthLight,
                        ]}
                      >
                        {item.dayNumber}
                      </Text>
                    </View>
                  </View>
                );
              }

              const selectedBg = item.isSelected ? getAccentBg(currentTheme.accent) : null;
              const todayBorder = target === "IDA" && item.isToday && !item.isSelected
                ? getAccentBorder(currentTheme.accent)
                : null;
              const todayColor = target === "IDA" && item.isToday && !item.isSelected
                ? getAccentText(currentTheme.accent)
                : null;

              return (
                <View key={index} style={styles.calendarDay}>
                  <TouchableOpacity
                    disabled={item.isDisabled}
                    style={[
                      styles.calendarDayTile,
                      item.isSelected && styles.calendarDayTileActive,
                      selectedBg,
                      target === "IDA" && item.isToday && !item.isSelected && styles.calendarDayTileOutline,
                      todayBorder,
                    ]}
                    onPress={() => handleSelectDay(item.fullDate)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.calendarDayText,
                        !isDarkMode && styles.calendarDayTextLight,
                        item.isSelected && styles.calendarDayTextActive,
                        todayColor,
                        item.isDisabled && styles.calendarDayTextDisabled,
                        item.isDisabled && !isDarkMode && styles.calendarDayTextDisabledLight,
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
              <Text style={[styles.calendarCancelText, !isDarkMode && styles.calendarCancelTextLight]}>
                Cancelar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.calendarDoneButton, doneButtonBg]}
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

export const CalendarModal = memo(CalendarModalComponent);
