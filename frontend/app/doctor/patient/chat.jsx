import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../../../constants/theme";
import { api } from "../../../services/api";
import { chatStyles as styles } from "../../../styles/patient_style";

const tryParseReport = (text) => {
  if (!text || typeof text !== "string") return null;
  try {
    if (text.trim().startsWith("{") && text.trim().endsWith("}")) {
      const parsed = JSON.parse(text);
      if (parsed.summary || parsed.diagnosis || parsed.medicines) return parsed;
    }
  } catch (e) {
    return null;
  }
  return null;
};

const MedicalReportView = ({ data, colors }) => {
  return (
    <View style={{ marginTop: 5 }}>
      {data.summary && (
        <View style={{ marginBottom: 12 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Ionicons name="document-text" size={16} color={colors.tint} />
            <Text
              style={{ fontWeight: "700", color: colors.tint, marginLeft: 6 }}
            >
              Analysis Summary
            </Text>
          </View>
          <Text style={{ color: colors.text, lineHeight: 20 }}>
            {data.summary}
          </Text>
        </View>
      )}
      {data.diagnosis && (
        <View
          style={{
            marginBottom: 12,
            backgroundColor: colors.inputBackground,
            padding: 10,
            borderRadius: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Ionicons name="medkit" size={16} color="#0284C7" />
            <Text
              style={{ fontWeight: "700", color: "#0284C7", marginLeft: 6 }}
            >
              Potential Diagnosis
            </Text>
          </View>
          <Text style={{ color: colors.text, fontWeight: "500" }}>
            {data.diagnosis}
          </Text>
        </View>
      )}
      {data.medicines && data.medicines.length > 0 && (
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Ionicons name="bandage" size={16} color="#10B981" />
            <Text
              style={{ fontWeight: "700", color: "#10B981", marginLeft: 6 }}
            >
              Suggested Medicines
            </Text>
          </View>
          {data.medicines.map((med, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 2,
              }}
            >
              <View
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: colors.subtext,
                  marginRight: 8,
                }}
              />
              <Text style={{ color: colors.text }}>{med}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const FormattedText = ({ text, style }) => {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <View>
      {lines.map((line, index) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <Text key={index} style={[style, { marginBottom: 4 }]}>
            {parts.map((part, partIndex) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return (
                  <Text key={partIndex} style={{ fontWeight: "bold" }}>
                    {part.slice(2, -2)}
                  </Text>
                );
              }
              return part;
            })}
          </Text>
        );
      })}
    </View>
  );
};

export default function ChatScreen() {
  const router = useRouter();
  const { visitId } = useLocalSearchParams();
  const scrollViewRef = useRef(null);

  const theme = useColorScheme() ?? "light";
  const activeColors = Colors[theme];

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "👋 Session Started.\n\nI am ready to analyze reports. Upload an X-Ray or Prescription to begin.",
      sender: "ai",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if (global.tempUploadFiles && global.tempUploadFiles.length > 0) {
        const file = global.tempUploadFiles[0];
        handleFileUpload(file);
        global.tempUploadFiles = [];
      }
    }, []),
  );

  const handleFileUpload = async (file) => {
    const userMsgId = Date.now();
    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        text: `Uploading ${file.docType || "File"}...`,
        sender: "doctor",
        files: [{ name: file.name }],
      },
    ]);
    setLoading(true);
    const response = await api.uploadFile(visitId, file.uri, file.docType);
    setLoading(false);

    let responseText = response?.chat_message;
    if (typeof responseText === "object")
      responseText = JSON.stringify(responseText);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        text:
          responseText ||
          (response ? "✅ Analysis Complete." : "SYSTEM ERROR: Upload Failed."),
        sender: "ai",
      },
    ]);
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText("");
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: text, sender: "doctor" },
    ]);
    setLoading(true);
    const response = await api.chatWithVisit(visitId, text);
    setLoading(false);

    let responseText = response?.response;
    if (typeof responseText === "object")
      responseText = JSON.stringify(responseText);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        text: responseText || "I didn't understand that.",
        sender: "ai",
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: activeColors.background }]}
      edges={["top"]}
    >
      <View
        style={[styles.header, { borderBottomColor: activeColors.cardBorder }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={activeColors.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: activeColors.text }]}>
            Consultation AI
          </Text>
          <Text style={{ fontSize: 12, color: activeColors.subtext }}>
            Visit #{visitId ? visitId.slice(-4) : "..."}
          </Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatArea}
          contentContainerStyle={{ paddingBottom: 40 }}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.map((msg) => {
            const reportData = tryParseReport(msg.text);
            return (
              <View
                key={msg.id}
                style={[
                  styles.messageRow,
                  msg.sender === "doctor" ? styles.doctorRow : styles.aiRow,
                ]}
              >
                {msg.sender === "ai" && (
                  <View
                    style={[
                      styles.botAvatar,
                      { backgroundColor: activeColors.text },
                    ]}
                  >
                    <Ionicons
                      name="medical"
                      size={16}
                      color={activeColors.background}
                    />
                  </View>
                )}
                <View
                  style={[
                    styles.bubble,
                    msg.sender === "doctor"
                      ? styles.doctorBubble
                      : [
                          styles.aiBubble,
                          { backgroundColor: activeColors.card },
                        ],
                  ]}
                >
                  {msg.files &&
                    msg.files.map((f, i) => (
                      <View key={i} style={styles.fileTag}>
                        <Ionicons
                          name="document-text"
                          size={14}
                          color="white"
                        />
                        <Text style={styles.fileTagText}>{f.name}</Text>
                      </View>
                    ))}
                  {reportData ? (
                    <MedicalReportView
                      data={reportData}
                      colors={activeColors}
                    />
                  ) : (
                    <FormattedText
                      text={msg.text}
                      style={[
                        styles.msgText,
                        msg.sender === "doctor"
                          ? styles.doctorText
                          : [styles.aiText, { color: activeColors.text }],
                        msg.text?.startsWith("SYSTEM ERROR:") && {
                          color: "#FF4444",
                          fontWeight: "bold",
                        },
                      ]}
                    />
                  )}
                </View>
              </View>
            );
          })}
          {loading && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 16,
                marginBottom: 20,
              }}
            >
              <ActivityIndicator size="small" color={activeColors.tint} />
              <Text
                style={{
                  color: activeColors.subtext,
                  marginLeft: 8,
                  fontSize: 12,
                }}
              >
                Analyzing...
              </Text>
            </View>
          )}
        </ScrollView>

        <View
          style={[
            styles.inputContainer,
            {
              backgroundColor: activeColors.background,
              borderTopColor: activeColors.cardBorder,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.attachBtn}
            onPress={() => router.push("/doctor/patient/upload")}
          >
            <Ionicons
              name="add-circle"
              size={32}
              color={activeColors.subtext}
            />
          </TouchableOpacity>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: activeColors.inputBackground,
                color: activeColors.text,
              },
            ]}
            placeholder="Type your question..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            placeholderTextColor={activeColors.inputPlaceholder}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              !inputText.trim() && { backgroundColor: activeColors.cardBorder },
            ]}
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <Ionicons name="arrow-up" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
