import { Ionicons } from "@expo/vector-icons";
import {
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
// 👇 Import Colors
import { Colors } from "../constants/theme";

export default function CustomAlert({
  visible,
  title,
  message,
  type = "info",
  onClose,
  onAction,
}) {
  const theme = useColorScheme() ?? "light"; // Get current theme (light/dark)
  const activeColors = Colors[theme]; // Get color palette

  if (!visible) return null;

  // Determine Icon & Header Color
  let iconName = "information-circle";
  let iconColor = activeColors.tint;

  if (type === "success") {
    iconName = "checkmark-circle";
    iconColor = activeColors.success;
  } else if (type === "error") {
    iconName = "alert-circle";
    iconColor = activeColors.danger;
  } else if (type === "warning") {
    iconName = "warning";
    iconColor = "#F59E0B";
  }

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        {/* 👇 Apply Dynamic Background and Border */}
        <View
          style={[
            styles.alertBox,
            {
              backgroundColor: activeColors.background,
              borderColor: activeColors.cardBorder,
              borderWidth: 1,
            },
          ]}
        >
          <View style={styles.iconContainer}>
            <Ionicons name={iconName} size={40} color={iconColor} />
          </View>

          {/* 👇 Apply Dynamic Text Colors */}
          <Text style={[styles.title, { color: activeColors.text }]}>
            {title}
          </Text>
          <Text style={[styles.message, { color: activeColors.subtext }]}>
            {message}
          </Text>

          <View style={styles.buttonContainer}>
            {/* Only show "Cancel" if there is an Action */}
            {onAction && (
              <TouchableOpacity
                style={[
                  styles.button,
                  styles.cancelButton,
                  { borderColor: activeColors.cardBorder, borderWidth: 1 },
                ]}
                onPress={onClose}
              >
                <Text
                  style={[styles.buttonText, { color: activeColors.subtext }]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, { backgroundColor: iconColor }]}
              onPress={() => {
                onClose();
                if (onAction) onAction();
              }}
            >
              <Text style={styles.buttonTextPrimary}>
                {type === "error" ? "Try Again" : "Continue"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertBox: {
    width: "80%",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  iconContainer: { marginBottom: 16 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: { flexDirection: "row", gap: 12, width: "100%" },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  cancelButton: { backgroundColor: "transparent" },
  buttonText: { fontSize: 16, fontWeight: "600" },
  buttonTextPrimary: { fontSize: 16, fontWeight: "600", color: "#FFF" },
});
