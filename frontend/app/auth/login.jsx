import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ScrollView, useWindowDimensions } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { commonStyles } from "../../styles/common_style";

export default function HealthcareLoginScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const dynamicPadding = width * 0.08;

  const handleLogin = () => {
    if (phoneNumber.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }
    router.push("auth/otp");
  };

  return (
    <SafeAreaProvider style={commonStyles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={[commonStyles.bgDecoration, { top: -height * 0.1, right: -width * 0.2 }]} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={commonStyles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={[commonStyles.header, { paddingHorizontal: dynamicPadding }]}>
            <TouchableOpacity style={commonStyles.backButton} onPress={() => router.back()}>
              <Text style={commonStyles.backIcon}>‹</Text>
            </TouchableOpacity>
          </View>

          <View style={[commonStyles.content, { paddingHorizontal: dynamicPadding }]}>
            <View style={commonStyles.titleSection}>
              <Text style={commonStyles.welcomeText}>Welcome to</Text>
              <Text style={commonStyles.brandText}>Login to E-parchi</Text>
              <View style={commonStyles.accentBar} />
              <Text style={commonStyles.subtitle}>
                Your health, just a tap away. Log in to book consultations and get expert care instantly.
              </Text>
            </View>

            <Text style={commonStyles.label}>Phone Number</Text>
            <View style={[commonStyles.inputWrapper, isFocused && commonStyles.inputFocused, { flexDirection: 'row', alignItems: 'center', paddingLeft: 15 }]}>
              <Text style={{ fontSize: 16, fontWeight: "600", marginRight: 10, paddingRight: 10, borderRightWidth: 1, borderRightColor: "#EEE" }}>+91</Text>
              <TextInput
                style={[commonStyles.input, { flex: 1, paddingHorizontal: 0 }]}
                placeholder="Enter 10-digit number"
                value={phoneNumber}
                onChangeText={(text) => setPhoneNumber(text.replace(/[^0-9]/g, ""))}
                keyboardType="number-pad"
                maxLength={10}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholderTextColor="#AAA"
              />
            </View>
          </View>

          <View style={[commonStyles.bottomSection, { paddingHorizontal: dynamicPadding }]}>
            <View style={commonStyles.linkRow}>
              <Text style={commonStyles.linkText}>New here? </Text>
              <TouchableOpacity onPress={() => router.push("auth/signup")}>
                <Text style={commonStyles.linkAction}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity 
              style={[commonStyles.primaryButton, { height: Math.max(55, height * 0.07) }]} 
              onPress={handleLogin}
            >
              <Text style={commonStyles.primaryButtonText}>Login Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}