import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomAlert from "../../../components/custom_alert";
import { Colors } from "../../../constants/theme";
import { useVisitHistory } from "../../../hooks/useAppData";
import { api } from "../../../services/api";
import { recordStyles as styles } from "../../../styles/patient_style";

export default function PatientRecordScreen() {
  const { id, name, age, gender, total_visits } = useLocalSearchParams();
  const router = useRouter();

  const { history, loading, refetch } = useVisitHistory(id);

  const [createLoading, setCreateLoading] = useState(false);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  const theme = useColorScheme() ?? "light";
  const activeColors = Colors[theme];

  const handleNewConsultation = async () => {
    setCreateLoading(true);
    const result = await api.startVisit(id);
    setCreateLoading(false);
    if (result && result.status === "started") {
      router.push({
        pathname: "/doctor/patient/chat",
        // ⚡ Updated: Pass patientName and visitNumber
        params: {
          visitId: result.visit._id,
          patientId: id,
          patientName: name,
          visitNumber: history.length + 1, // Newest visit
          mode: "new",
        },
      });
    } else {
      setAlertConfig({
        visible: true,
        title: "Error",
        message: "Could not start session.",
        type: "error",
      });
    }
  };

  const renderVisitItem = ({ item, index }) => {
    const visitNumber = history.length - index;
    const rawDate =
      item.timestamp || item.created_at || item.createdAt || item.date;
    const dateObj = rawDate ? new Date(rawDate) : null;

    let dateString = "Unknown Date";
    let timeString = "--:--";
    if (dateObj && !isNaN(dateObj.getTime())) {
      dateString = dateObj.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
      timeString = dateObj.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return (
      <TouchableOpacity
        style={[
          styles.visitCard,
          {
            backgroundColor: activeColors.card,
            borderColor: activeColors.cardBorder,
          },
        ]}
        onPress={() =>
          router.push({
            pathname: "/doctor/patient/chat",
            // ⚡ Updated: Pass patientName and visitNumber
            params: {
              visitId: item._id,
              patientId: id,
              patientName: name,
              visitNumber: visitNumber,
              previousContext: "Review Mode",
            },
          })
        }
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <Text
              style={[
                styles.visitSummary,
                { color: activeColors.tint, fontWeight: "bold" },
              ]}
            >
              Visit #{visitNumber}
            </Text>
            <Text style={{ color: activeColors.subtext, fontSize: 12 }}>
              {dateString}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="time-outline"
              size={14}
              color={activeColors.subtext}
              style={{ marginRight: 4 }}
            />
            <Text
              style={{
                color: activeColors.subtext,
                fontSize: 13,
                marginRight: 10,
              }}
            >
              {timeString}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={activeColors.icon} />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: activeColors.background }]}
    >
      <View style={[styles.header, { backgroundColor: activeColors.tint }]}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Patient Record</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.patientInfoContainer}>
            <Text style={styles.patientName}>{name}</Text>
            <Text style={styles.patientDetails}>
              {age} Years • {gender}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 8,
                backgroundColor: "rgba(255,255,255,0.2)",
                alignSelf: "flex-start",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <Ionicons
                name="medical"
                size={14}
                color="white"
                style={{ marginRight: 6 }}
              />
              <Text style={{ color: "white", fontWeight: "600", fontSize: 13 }}>
                Total Visits:{" "}
                {history.length > 0 ? history.length : total_visits || 0}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, { color: activeColors.text }]}>
          Visit History
        </Text>
        <FlatList
          data={history}
          renderItem={renderVisitItem}
          keyExtractor={(item) => item._id}
          refreshing={loading}
          onRefresh={refetch}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 40, opacity: 0.6 }}>
              <Ionicons
                name="calendar-outline"
                size={48}
                color={activeColors.subtext}
              />
              <Text style={{ color: activeColors.subtext, marginTop: 10 }}>
                No visits recorded yet.
              </Text>
            </View>
          }
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.newConsultBtn}
          onPress={handleNewConsultation}
          disabled={createLoading}
        >
          {createLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="add" size={24} color="white" />
              <Text style={styles.btnText}>Start New Visit</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        type={alertConfig.type}
        onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
      />
    </View>
  );
}
