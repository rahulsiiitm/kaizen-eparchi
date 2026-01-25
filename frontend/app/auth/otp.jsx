import { useRouter } from "expo-router";
import { useRef, useState } from "react";
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
import { Colors } from "../../constants/theme"; // 👈 Added
import { commonStyles } from "../../styles/common_style";

export default function OTPScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  // 🎨 Theme Hooks
  const theme = useColorScheme() ?? "light";
  const activeColors = Colors[theme];
  const isDark = theme === "dark";

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputs = useRef([]);

  const dynamicPadding = width * 0.08;

  const handleOtpChange = (text, index) => {
    const cleanText = text.replace(/[^0-9]/g, "");
    if (cleanText.length === 0) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }
    const lastChar = cleanText.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = lastChar;
    setOtp(newOtp);
    if (index < 3) {
      inputs.current[index + 1].focus();
    } else {
      inputs.current[index].blur();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      if (!otp[index] && index > 0) {
        inputs.current[index - 1].focus();
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
      }
    }
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
          { top: -width * 0.2, right: -width * 0.2, opacity: 0.05 },
        ]}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={commonStyles.scrollContent}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[commonStyles.header, { paddingHorizontal: width * 0.05 }]}
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
            <View
              style={[commonStyles.titleSection, { alignItems: "flex-start" }]}
            >
              <Text
                style={[
                  commonStyles.welcomeText,
                  { color: activeColors.subtext },
                ]}
              >
                Welcome to
              </Text>
              <Text style={[commonStyles.brandText, { textAlign: "left" }]}>
                All In One{"\n"}Healthcare
              </Text>
              <View
                style={[commonStyles.accentBar, { alignSelf: "flex-start" }]}
              />
              <Text
                style={[
                  commonStyles.subtitle,
                  { textAlign: "left", color: activeColors.subtext },
                ]}
              >
                Your health, just a tap away. Log in to book consultations and
                get expert care instantly.
              </Text>
            </View>

            <View style={{ marginTop: height * 0.05 }}>
              <Text
                style={[
                  commonStyles.label,
                  { fontSize: 18, color: activeColors.text },
                ]}
              >
                Verification Code
              </Text>
              <Text style={{ color: activeColors.subtext, marginBottom: 20 }}>
                Please enter the 4-digit code sent to you.
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {otp.map((digit, index) => (
                  <View
                    key={index}
                    style={[
                      commonStyles.inputWrapper,
                      {
                        width: width * 0.17,
                        height: width * 0.17,
                        backgroundColor: activeColors.inputBackground,
                        borderColor:
                          focusedIndex === index
                            ? activeColors.tint
                            : activeColors.cardBorder,
                      },
                      focusedIndex === index && commonStyles.inputFocused,
                    ]}
                  >
                    <TextInput
                      ref={(el) => (inputs.current[index] = el)}
                      style={[
                        commonStyles.input,
                        {
                          flex: 1,
                          textAlign: "center",
                          fontSize: 24,
                          fontWeight: "700",
                          color: "#007AFF", // Keep the blue color for OTP digits, it pops nicely on dark too
                        },
                      ]}
                      maxLength={1}
                      value={digit}
                      onFocus={() => setFocusedIndex(index)}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="number-pad"
                      selectTextOnFocus={true}
                    />
                  </View>
                ))}
              </View>
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
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={commonStyles.linkAction}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[commonStyles.primaryButton, { height: 60 }]}
              activeOpacity={0.8}
              onPress={() => router.push("../(tabs)/home")}
            >
              <Text style={commonStyles.primaryButtonText}>Verify & Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}
