import { useState, useEffect, useCallback, useMemo } from "react";

export function useCalendarModal({
  visible,
  target,
  departDate,
  returnDate,
  onSelectDate,
  onClose,
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

  const changeMonth = useCallback((dir) => {
    setCurrentCalendarMonth((prevMonth) => {
      let m = prevMonth + dir;
      if (m > 11) {
        setCurrentCalendarYear((prevYear) => prevYear + 1);
        return 0;
      }
      if (m < 0) {
        setCurrentCalendarYear((prevYear) => prevYear - 1);
        return 11;
      }
      return m;
    });
  }, []);

  const calendarDays = useMemo(() => {
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
  }, [currentCalendarYear, currentCalendarMonth, departDate, selectedDate, target]);

  const handleSelectDay = useCallback((fullDate) => {
    setSelectedDate(fullDate);
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedDate) {
      onSelectDate(selectedDate, target);
    }
    onClose();
  }, [selectedDate, onSelectDate, target, onClose]);

  const now = new Date();
  const isCurrentOrPastMonth =
    currentCalendarYear < now.getFullYear() ||
    (currentCalendarYear === now.getFullYear() && currentCalendarMonth <= now.getMonth());

  return {
    currentCalendarYear,
    currentCalendarMonth,
    selectedDate,
    calendarDays,
    changeMonth,
    handleSelectDay,
    handleConfirm,
    isCurrentOrPastMonth,
  };
}
