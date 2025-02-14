import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Calendar, DateData } from "react-native-calendars";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import XDate from "xdate";

const WEEK_ROW_HEIGHT = 46;
const HEADER_HEIGHT = 80;

interface CalendarPickerProps {
  onHeightChange?: (height: number) => void;
  reservations?: any[];
  onDateSelected?: (date: string) => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({
  onHeightChange,
  reservations = [],
  onDateSelected,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [containerHeight, setContainerHeight] = useState(360);

  // Arreglos de nombres para el calendario (respaldo y para el renderHeader)
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril",
    "Mayo", "Junio", "Julio", "Agosto",
    "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const dayNames = [
    "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"
  ];
  const dayNamesShort = [
    "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"
  ];

  const onDayPress = (day: DateData) => {
    // Se actualiza la fecha seleccionada (formato "YYYY-MM-DD")
    setSelectedDate(day.dateString);
    // Se envía al componente padre la fecha seleccionada
    onDateSelected && onDateSelected(day.dateString);
  };

  const getWeeksInMonth = (month: number, year: number) => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const dayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();
    return Math.ceil((totalDays + dayOfWeek) / 7);
  };

  const handleMonthChange = (month: any) => {
    const weeksInMonth = getWeeksInMonth(month.month, month.year);
    const calculatedHeight = HEADER_HEIGHT + WEEK_ROW_HEIGHT * weeksInMonth;
    setContainerHeight(calculatedHeight);
    onHeightChange?.(calculatedHeight);
  };

  // Genera marcas de reservaciones usando la fecha local
  const reservationMarks: { [date: string]: any } = {};
  reservations.forEach((reservation) => {
    const dateObj = reservation.rawDate.toDate();
    // Extrae la fecha local: año, mes y día
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const dateKey = `${year}-${month}-${day}`;

    if (!reservationMarks[dateKey]) {
      reservationMarks[dateKey] = {
        dots: [{ key: "reservation", color: "#1E88E5", selectedDotColor: "#ffffff" }],
      };
    }
  });

  const mergedMarkedDates = { ...reservationMarks };
  if (selectedDate) {
    mergedMarkedDates[selectedDate] = {
      ...(mergedMarkedDates[selectedDate] || {}),
      selected: true,
      selectedColor: "#1E88E5",
      customStyles: {
        text: {
          color: "white",
          fontWeight: "bold",
        },
      },
    };
  }

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      <Calendar
        onDayPress={onDayPress}
        onMonthChange={handleMonthChange}
        firstDay={1}
        monthNames={monthNames}
        dayNames={dayNames}
        dayNamesShort={dayNamesShort}
        monthFormat="MMMM"
        markingType="multi-dot"
        renderHeader={(date?: XDate) => {
          const monthIndex = date?.getMonth() ?? 0;
          const year = date?.getFullYear() ?? new Date().getFullYear();
          const monthName = monthNames[monthIndex] || "";
          return (
            <Text style={styles.monthHeader}>
              {monthName} {year}
            </Text>
          );
        }}
        markedDates={mergedMarkedDates}
        theme={{
          calendarBackground: "#ffffff",
          selectedDayBackgroundColor: "#1E88E5",
          selectedDayTextColor: "#ffffff",
          todayTextColor: "#1E88E5",
          todayBackgroundColor: "#E3F2FD",
          arrowColor: "#1E88E5",
          monthTextColor: "#1E88E5",
          textMonthFontWeight: "bold",
          textMonthFontSize: 18,
          textDayHeaderFontWeight: "600",
          textDayFontSize: 14,
          textDisabledColor: "#BDBDBD",
          dayTextColor: "#212121",
          weekVerticalMargin: 2,
        }}
        renderArrow={(direction: "left" | "right") => (
          <MaterialCommunityIcons
            name={direction === "left" ? "chevron-left" : "chevron-right"}
            size={24}
            color="#1E88E5"
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    padding: 10,
    marginHorizontal: 0,
    minHeight: 330,
  },
  monthHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E88E5",
    textAlign: "center",
    paddingVertical: 10,
  },
});

export default CalendarPicker;