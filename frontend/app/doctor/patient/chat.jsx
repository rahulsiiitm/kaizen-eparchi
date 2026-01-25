import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
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

// --- ⚡ COMPACT REPORT COMPONENT ---
const MedicalReportView = ({ data, colors }) => {
  return (
    <View style={styles.reportContainer}>
      {data.summary && (
        <View style={styles.summaryBox}>
          <View style={styles.summaryHeader}>
            <Ionicons name="document-text" size={12} color={colors.tint} />
            <Text style={[styles.summaryTitle, { color: colors.tint }]}>
              Analysis
            </Text>
          </View>
          <Text style={[styles.summaryText, { color: colors.text }]}>
            {data.summary}
          </Text>
        </View>
      )}

      {data.diagnosis && (
        <View
          style={[
            styles.diagnosisBox,
            { backgroundColor: colors.inputBackground },
          ]}
        >
          <View style={styles.summaryHeader}>
            <Ionicons name="medkit" size={12} color="#0284C7" />
            <Text style={[styles.summaryTitle, { color: "#0284C7" }]}>
              Diagnosis
            </Text>
          </View>
          <Text
            style={{
              color: colors.text,
              fontWeight: "600",
              fontSize: 14,
              marginTop: 2,
            }}
          >
            {data.diagnosis}
          </Text>
        </View>
      )}

      {data.medicines && data.medicines.length > 0 && (
        <View style={styles.medList}>
          <View style={[styles.summaryHeader, { marginBottom: 4 }]}>
            <Ionicons name="bandage" size={12} color="#10B981" />
            <Text style={[styles.summaryTitle, { color: "#10B981" }]}>
              Prescription
            </Text>
          </View>
          {data.medicines.map((med, index) => (
            <View key={index} style={styles.medItem}>
              <View
                style={[styles.bullet, { backgroundColor: colors.subtext }]}
              />
              <Text style={[styles.medText, { color: colors.text }]}>
                {med}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// --- Helper Functions ---
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

const FormattedText = ({ text, style }) => {
  if (!text) return null;
  const lines = text.split("\n");
  return (
    <View>
      {lines.map((line, index) => {
        const parts = line.split(/(\*\*.*?\*\*)/g);
        return (
          <Text key={index} style={[style, { marginBottom: 2 }]}>
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
  const { visitId, patientId, patientName, visitNumber } =
    useLocalSearchParams();
  const scrollViewRef = useRef(null);
  const theme = useColorScheme() ?? "light";
  const activeColors = Colors[theme];

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Load History Logic
  useEffect(() => {
    const loadHistory = async () => {
      if (!patientId || !visitId) {
        setLoadingHistory(false);
        return;
      }
      try {
        const allVisits = await api.getHistory(patientId);
        const currentVisit = allVisits.find((v) => v._id === visitId);
        if (currentVisit && currentVisit.messages?.length > 0) {
          const history = currentVisit.messages.map((msg, index) => ({
            id: index + Date.now(),
            text: msg.text || msg.message || msg.content || "",
            sender: msg.sender || (msg.role === "user" ? "doctor" : "ai"),
            files: msg.files || [],
          }));
          setMessages(history);
        } else {
          setMessages([
            {
              id: 1,
              text: "👋 Hello! Dr. AI here.\n\nReady to analyze reports or answer medical questions.",
              sender: "ai",
            },
          ]);
        }
      } catch (e) {
        console.log("History error:", e);
      } finally {
        setLoadingHistory(false);
      }
    };
    loadHistory();
  }, [visitId, patientId]);

  useFocusEffect(
    useCallback(() => {
      if (global.tempUploadFiles && global.tempUploadFiles.length > 0) {
        global.tempUploadFiles.forEach((file) => {
          handleFileUpload(file);
        });
        global.tempUploadFiles = [];
      }
    }, []),
  );

  const handleFileUpload = async (file) => {
    const userMsgId = Date.now();
    const typeToSend = file.docType || "prescription";

    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        text: `Uploading ${typeToSend === "xray" ? "X-Ray" : "Rx"}...`,
        sender: "doctor",
        files: [{ name: file.name }],
      },
    ]);

    setLoading(true);
    const response = await api.uploadFile(visitId, file.uri, typeToSend);
    setLoading(false);

    let responseText = response?.chat_message;
    if (typeof responseText === "object")
      responseText = JSON.stringify(responseText);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + 1,
        text: responseText || (response ? "✅ Done." : "❌ Failed."),
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
        text: responseText || "???",
        sender: "ai",
      },
    ]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: activeColors.background }]}
      edges={["top"]}
    >
      {/* ⚡ UPDATED HEADER */}
      <View
        style={[styles.header, { borderBottomColor: activeColors.cardBorder }]}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={activeColors.tint} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: activeColors.text }]}>
            {patientName || "Consultation"}
          </Text>
          <Text
            style={[styles.headerSubtitle, { color: activeColors.subtext }]}
          >
            Visit #{visitNumber || (visitId ? visitId.slice(-4) : "...")} •{" "}
            <Text style={{ fontWeight: "700", color: activeColors.tint }}>
              Dr. AI
            </Text>
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.chatArea}
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {loadingHistory && (
            <ActivityIndicator
              size="small"
              color={activeColors.tint}
              style={{ marginVertical: 10 }}
            />
          )}

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
                  <View style={[styles.botAvatar]}>
                    {/* Bot Icon */}
                    <Ionicons name="medical" size={14} color="#666" />
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
                          size={10}
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
            <View style={{ marginLeft: 40, marginBottom: 10 }}>
              <Text
                style={{
                  fontSize: 11,
                  color: activeColors.subtext,
                  fontStyle: "italic",
                }}
              >
                Dr. AI is typing...
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
              size={30}
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
            placeholder="Ask Dr. AI..."
            value={inputText}
            onChangeText={setInputText}
            multiline
            placeholderTextColor={activeColors.inputPlaceholder}
          />
          <TouchableOpacity
            style={[
              styles.sendBtn,
              !inputText.trim() && {
                backgroundColor: activeColors.cardBorder,
                elevation: 0,
              },
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
