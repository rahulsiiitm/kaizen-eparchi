import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from "react-native";
import CustomAlert from "../components/custom_alert";
import { Colors } from "../constants/theme";
import { api } from "../services/api";

export default function AddPatient() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const activeColors = Colors[theme];

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [loading, setLoading] = useState(false);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info",
    onAction: null,
  });

  const handleSave = async () => {
    if (!name.trim()) {
      setAlertConfig({
        visible: true,
        title: "Missing Name",
        message: "Enter name.",
        type: "warning",
      });
      return;
    }
    if (!age.trim()) {
      setAlertConfig({
        visible: true,
        title: "Missing Age",
        message: "Enter age.",
        type: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await api.createPatient(name, age, gender);

      if (result && result.status === "success" && result.patient) {
        // ⚡ SUCCESS: Show Alert & Setup Redirect
        setAlertConfig({
          visible: true,
          title: "Success",
          message: `${name} registered successfully.`,
          type: "success",
          onAction: () => {
            // 1. Close the 'Add Patient' Modal
            router.dismiss();

            // 2. Redirect straight to the Visit History Page.jsx]
            router.push({
              pathname: "/doctor/patient/[id]",
              params: {
                id: result.patient._id,
                name: result.patient.name,
                age: result.patient.age,
                gender: result.patient.gender,
                total_visits: 0,
              },
            });
          },
        });
      } else {
        throw new Error(result?.message || "Registration failed");
      }
    } catch (error) {
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Server connection failed.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.overlay}>
      <TouchableWithoutFeedback onPress={() => router.back()}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardContainer}
      >
        <View
          style={[
            styles.dialogContainer,
            {
              backgroundColor: activeColors.background,
              borderColor: activeColors.cardBorder,
              borderWidth: 1,
            },
          ]}
        >
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: activeColors.text }]}>
              Add New Patient
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.closeBtn}
            >
              <Ionicons name="close" size={24} color={activeColors.subtext} />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          <View style={styles.form}>
            <Text style={[styles.label, { color: activeColors.subtext }]}>
              Full Name
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: activeColors.inputBackground,
                  color: activeColors.text,
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Sita Verma"
              placeholderTextColor={activeColors.inputPlaceholder}
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={[styles.label, { color: activeColors.subtext }]}>
                  Age
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: activeColors.inputBackground,
                      color: activeColors.text,
                    },
                  ]}
                  value={age}
                  onChangeText={setAge}
                  keyboardType="numeric"
                  placeholder="45"
                  placeholderTextColor={activeColors.inputPlaceholder}
                />
              </View>

              <View style={{ flex: 2 }}>
                <Text style={[styles.label, { color: activeColors.subtext }]}>
                  Gender
                </Text>
                <View style={styles.genderContainer}>
                  {["Male", "Female"].map((item) => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.genderOption,
                        { borderColor: activeColors.cardBorder },
                        gender === item && styles.genderSelected,
                      ]}
                      onPress={() => setGender(item)}
                    >
                      <Text
                        style={[
                          styles.genderText,
                          { color: activeColors.subtext },
                          gender === item && styles.genderTextSelected,
                        ]}
                      >
                        {item}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, loading && { opacity: 0.7 }]}
              onPress={handleSave}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.saveButtonText}>Register Patient</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
        onAction={alertConfig.onAction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  keyboardContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "box-none",
  },
  dialogContainer: {
    width: "85%",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeBtn: {
    padding: 4,
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E5EA",
    marginBottom: 16,
    opacity: 0.5,
  },
  form: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    padding: 12,
    borderRadius: 10,
    fontSize: 15,
  },
  genderContainer: {
    flexDirection: "row",
    gap: 8,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  genderSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  genderText: {
    fontSize: 14,
    fontWeight: "500",
  },
  genderTextSelected: {
    color: "white",
    fontWeight: "600",
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
