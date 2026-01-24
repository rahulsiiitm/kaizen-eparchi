import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { commonStyles } from "../../styles/common_style";

export default function OTPScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputs = useRef([]);

  const dynamicPadding = width * 0.08;

  const handleOtpChange = (text, index) => {
    const newOtp = [...otp];
    const cleanText = text.replace(/[^0-9]/g, "");
    newOtp[index] = cleanText;
    setOtp(newOtp);
    if (cleanText && index < 3) inputs.current[index + 1].focus();
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <SafeAreaProvider style={commonStyles.container}>
      <StatusBar barStyle="dark-content" />
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
              <Text style={commonStyles.backIcon}>‹</Text>
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
              <Text style={commonStyles.welcomeText}>Welcome to</Text>
              <Text style={[commonStyles.brandText, { textAlign: "left" }]}>
                All In One{"\n"}Healthcare
              </Text>
              <View
                style={[commonStyles.accentBar, { alignSelf: "flex-start" }]}
              />
              <Text style={[commonStyles.subtitle, { textAlign: "left" }]}>
                Your health, just a tap away. Log in to book consultations and
                get expert care instantly.
              </Text>
            </View>

            <View style={{ marginTop: height * 0.05 }}>
              <Text style={[commonStyles.label, { fontSize: 18 }]}>
                Verification Code
              </Text>
              <Text style={{ color: "#999", marginBottom: 20 }}>
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
                      { width: width * 0.17, height: width * 0.17 },
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
                          color: "#007AFF",
                        },
                      ]}
                      maxLength={10} // Just for safety
                      value={digit}
                      onFocus={() => setFocusedIndex(index)}
                      onChangeText={(text) => handleOtpChange(text, index)}
                      onKeyPress={(e) => handleKeyPress(e, index)}
                      keyboardType="number-pad"
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
              <Text style={commonStyles.linkText}>New here? </Text>
              <TouchableOpacity onPress={() => router.push("/signup")}>
                <Text style={commonStyles.linkAction}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[commonStyles.primaryButton, { height: 60 }]}
              activeOpacity={0.8}
              // ✅ FIXED: Wrap in an arrow function
              onPress={() => router.push("../doctor/patient/upload")}
            >
              <Text style={commonStyles.primaryButtonText}>Verify & Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}
