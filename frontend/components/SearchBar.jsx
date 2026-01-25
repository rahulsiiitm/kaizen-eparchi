import { Ionicons } from "@expo/vector-icons";
import {
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import { Colors } from "../constants/theme";

export default function SearchBar({
  value,
  onChangeText,
  onClear,
  placeholder = "Search...",
}) {
  const theme = useColorScheme() ?? "light";
  const activeColors = Colors[theme];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: activeColors.inputBackground,
          borderColor: activeColors.cardBorder,
        },
      ]}
    >
      <Ionicons
        name="search"
        size={20}
        color={activeColors.subtext}
        style={styles.icon}
      />
      <TextInput
        style={[styles.input, { color: activeColors.text }]}
        placeholder={placeholder}
        placeholderTextColor={activeColors.inputPlaceholder}
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <Ionicons
            name="close-circle"
            size={20}
            color={activeColors.subtext}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 20,
    borderWidth: 1,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%", // Ensures it fills the container height
  },
});
