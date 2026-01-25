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
import { Colors } from "../../constants/theme"; // 👈 Added
import { commonStyles } from "../../styles/common_style";

export default function SignUpScreen() {
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  // 🎨 Theme Hooks
  const theme = useColorScheme() ?? "light";
  const activeColors = Colors[theme];
  const isDark = theme === "dark";

  const [name, setName] = useState("");
  const [phNo, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info",
    onAction: null,
  });

  const dynamicPadding = width * 0.08;

  const handleCreateAccount = () => {
    // ... (Validation logic remains the same)
    if (
      !name.trim() ||
      !email.trim() ||
      !phNo.trim() ||
      !password ||
      !confirmPassword
    ) {
      setAlertConfig({
        visible: true,
        title: "Missing Fields",
        message: "Please fill in all the details.",
        type: "warning",
      });
      return;
    }
    // ... (Add other validations here as in your original file)

    setAlertConfig({
      visible: true,
      title: "Success",
      message: "Account created successfully!",
      type: "success",
      onAction: () => router.replace("auth/login"),
    });
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
            <Text style={[commonStyles.backIcon, { color: activeColors.text }]}>
              ‹
            </Text>
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
              <Text
                style={[
                  commonStyles.welcomeText,
                  { color: activeColors.subtext },
                ]}
              >
                Join Now
              </Text>
              <Text style={commonStyles.brandText}>Welcome to E-Parchi</Text>
              <View style={commonStyles.accentBar} />
            </View>

            {fields.map((field, index) => (
              <View key={field.key} style={{ marginTop: index > 0 ? 15 : 0 }}>
                <Text
                  style={[commonStyles.label, { color: activeColors.text }]}
                >
                  {field.label} *
                </Text>
                <View
                  style={[
                    commonStyles.inputWrapper,
                    focusedField === field.key && commonStyles.inputFocused,
                    {
                      backgroundColor: activeColors.inputBackground,
                      borderColor:
                        focusedField === field.key
                          ? activeColors.tint
                          : activeColors.cardBorder,
                    },
                  ]}
                >
                  <TextInput
                    style={[commonStyles.input, { color: activeColors.text }]}
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
                    placeholderTextColor={activeColors.inputPlaceholder} // 👈 Dynamic Placeholder
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
              <Text
                style={[commonStyles.linkText, { color: activeColors.subtext }]}
              >
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
              ]}
              onPress={handleCreateAccount}
              activeOpacity={0.8}
            >
              <Text style={commonStyles.primaryButtonText}>Create Account</Text>
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
        onAction={alertConfig.onAction}
      />
    </SafeAreaProvider>
  );
}
