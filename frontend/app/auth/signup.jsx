import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { commonStyles } from "../../styles/common_style";

export default function SignUpScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  const [name, setName] = useState("");
  const [phNo, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const isFormValid = name && phNo && email && password && confirmPassword;
  const dynamicPadding = width * 0.08;

  const handleCreateAccount = () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !phNo.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Required", "All fields are mandatory.");
      return;
    }
    if (phNo.length !== 10) {
      Alert.alert("Invalid Input", "Phone number must be 10 digits.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Mismatch", "Passwords do not match.");
      return;
    }
    Alert.alert("Success", "Account created successfully!");
  };

  const fields = [
    { label: "Name", val: name, set: setName, key: "name", kb: "default" },
    {
      label: "Email",
      val: email,
      set: setEmail,
      key: "email",
      kb: "email-address",
    },
    {
      label: "Phone Number",
      val: phNo,
      set: setPhoneNumber,
      key: "phone",
      kb: "number-pad",
      max: 10,
    },
    {
      label: "Password",
      val: password,
      set: setPassword,
      key: "pass",
      kb: "default",
      secure: true,
    },
    {
      label: "Confirm Password",
      val: confirmPassword,
      set: setConfirmPassword,
      key: "confirm",
      kb: "default",
      secure: true,
    },
  ];

  return (
    <SafeAreaProvider style={commonStyles.container}>
      <StatusBar barStyle="dark-content" />
      <View
        style={[
          commonStyles.bgDecoration,
          { top: -height * 0.05, right: -width * 0.15 },
        ]}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View
          style={[commonStyles.header, { paddingHorizontal: dynamicPadding }]}
        >
          <TouchableOpacity
            style={commonStyles.backButton}
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/onboarding")
            }
          >
            <Text style={commonStyles.backIcon}>‹</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={commonStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={[
              commonStyles.content,
              { paddingHorizontal: dynamicPadding },
            ]}
          >
            <View style={commonStyles.titleSection}>
              <Text style={commonStyles.welcomeText}>Join Now</Text>
              <Text style={commonStyles.brandText}>Welcome to E-Parchi</Text>
              <View style={commonStyles.accentBar} />
            </View>

            {fields.map((field, index) => (
              <View key={field.key} style={{ marginTop: index > 0 ? 15 : 0 }}>
                <Text style={commonStyles.label}>{field.label} *</Text>
                <View
                  style={[
                    commonStyles.inputWrapper,
                    focusedField === field.key && commonStyles.inputFocused,
                  ]}
                >
                  <TextInput
                    style={commonStyles.input}
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    value={field.val}
                    onFocus={() => setFocusedField(field.key)}
                    onBlur={() => setFocusedField(null)}
                    onChangeText={(text) =>
                      field.key === "phone"
                        ? field.set(text.replace(/[^0-9]/g, ""))
                        : field.set(text)
                    }
                    keyboardType={field.kb}
                    maxLength={field.max}
                    secureTextEntry={field.secure}
                    autoCapitalize="none"
                    placeholderTextColor="#AAA"
                  />
                </View>
              </View>
            ))}
          </View>

          <View
            style={[
              commonStyles.bottomSection,
              { paddingHorizontal: dynamicPadding },
            ]}
          >
            <View style={commonStyles.linkRow}>
              <Text style={commonStyles.linkText}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("auth/login")}>
                <Text style={commonStyles.linkAction}>Login</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={[
                commonStyles.primaryButton,
                { height: Math.max(55, height * 0.07) },
                !isFormValid && commonStyles.disabledButton,
              ]}
              onPress={handleCreateAccount}
              activeOpacity={0.8}
            >
              <Text style={commonStyles.primaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}
