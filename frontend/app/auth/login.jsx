import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomAlert from "../../components/custom_alert";
import { Colors } from "../../constants/theme"; // Import Colors
import { commonStyles } from "../../styles/common_style";

export default function HealthcareLoginScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  // Theme
  const theme = useColorScheme() ?? "light";
  const activeColors = Colors[theme];
  const isDark = theme === "dark";

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const dynamicPadding = width * 0.08;

  const handleLogin = () => {
    if (!phoneNumber.trim() || phoneNumber.length !== 10) {
      setAlertConfig({
        visible: true,
        title: "Invalid Number",
        message: "Please enter a valid 10-digit phone number.",
        type: "warning",
      });
      return;
    }
    router.push("auth/otp");
  };

  return (
    <SafeAreaProvider
      style={[
        commonStyles.container,
        { backgroundColor: activeColors.background },
      ]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <View
        style={[
          commonStyles.bgDecoration,
          { top: -height * 0.1, right: -width * 0.2 },
        ]}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={commonStyles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[commonStyles.header, { paddingHorizontal: dynamicPadding }]}
          >
            <TouchableOpacity
              style={commonStyles.backButton}
              onPress={() => router.back()}
            >
              <Text
                style={[commonStyles.backIcon, { color: activeColors.text }]}
              >
                ‹
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={[
              commonStyles.content,
              { paddingHorizontal: dynamicPadding },
            ]}
          >
            <View style={commonStyles.titleSection}>
              <Text
                style={[
                  commonStyles.welcomeText,
                  { color: activeColors.subtext },
                ]}
              >
                Welcome to
              </Text>
              <Text style={commonStyles.brandText}>Login to E-parchi</Text>
              <View style={commonStyles.accentBar} />
              <Text
                style={[commonStyles.subtitle, { color: activeColors.subtext }]}
              >
                Your health, just a tap away. Log in to book consultations and
                get expert care instantly.
              </Text>
            </View>

            <Text style={[commonStyles.label, { color: activeColors.text }]}>
              Phone Number
            </Text>
            <View
              style={[
                commonStyles.inputWrapper,
                isFocused && commonStyles.inputFocused,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  paddingLeft: 15,
                  backgroundColor: activeColors.inputBackground,
                  borderColor: isFocused
                    ? activeColors.tint
                    : activeColors.cardBorder,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "600",
                  marginRight: 10,
                  paddingRight: 10,
                  borderRightWidth: 1,
                  borderRightColor: activeColors.cardBorder,
                  color: activeColors.text,
                }}
              >
                +91
              </Text>
              <TextInput
                style={[
                  commonStyles.input,
                  { flex: 1, paddingHorizontal: 0, color: activeColors.text },
                ]}
                placeholder="Enter 10-digit number"
                value={phoneNumber}
                onChangeText={(text) =>
                  setPhoneNumber(text.replace(/[^0-9]/g, ""))
                }
                keyboardType="number-pad"
                maxLength={10}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholderTextColor={activeColors.inputPlaceholder}
              />
            </View>
          </View>

          <View
            style={[
              commonStyles.bottomSection,
              { paddingHorizontal: dynamicPadding },
            ]}
          >
            <View style={commonStyles.linkRow}>
              <Text
                style={[commonStyles.linkText, { color: activeColors.subtext }]}
              >
                New here?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("auth/signup")}>
                <Text style={commonStyles.linkAction}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                commonStyles.primaryButton,
                { height: Math.max(55, height * 0.07) },
              ]}
              onPress={handleLogin}
            >
              <Text style={commonStyles.primaryButtonText}>Login Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
    </SafeAreaProvider>
  );
}
