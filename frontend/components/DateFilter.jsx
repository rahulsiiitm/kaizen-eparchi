import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
    Platform,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
} from "react-native";
import { Colors } from "../constants/theme";

export default function DateFilter({ selectedDate, onDateSelect }) {
  const [showPicker, setShowPicker] = useState(false);
  const theme = useColorScheme() ?? "light";
  const activeColors = Colors[theme];

  const handleDateChange = (event, date) => {
    setShowPicker(false);
    if (event.type === "set" && date) {
      onDateSelect(date);
    }
  };

  return (
    <>
      {/* 📅 The Calendar Button */}
      <TouchableOpacity
        style={[
          styles.calendarButton,
          {
            backgroundColor: selectedDate
              ? activeColors.tint
              : activeColors.inputBackground,
            borderColor: selectedDate
              ? activeColors.tint
              : activeColors.cardBorder,
          },
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Ionicons
          name={selectedDate ? "calendar" : "calendar-outline"}
          size={22}
          color={selectedDate ? "white" : activeColors.text}
        />
      </TouchableOpacity>

      {/* 📅 The Hidden Picker */}
      {showPicker && (
        <DateTimePicker
          value={selectedDate || new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  calendarButton: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
});
