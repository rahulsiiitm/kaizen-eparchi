import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
    useColorScheme,
} from "react-native";

import CustomAlert from "../../components/custom_alert";
import DateFilter from "../../components/DateFilter";
import SearchBar from "../../components/SearchBar";
import { Colors } from "../../constants/theme";
import { usePatients } from "../../hooks/useAppData";

export default function PatientScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const activeColors = Colors[theme];

  const { patients, loading, error, refetch, selectedDate, setSelectedDate } =
    usePatients();

  const [searchText, setSearchText] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [alertConfig, setAlertConfig] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info",
  });

  useEffect(() => {
    if (searchText) {
      handleSearch(searchText);
    } else {
      setFilteredPatients(patients);
    }
  }, [patients]);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const newData = patients.filter((item) => {
        const itemData = item.name ? item.name.toUpperCase() : "";
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      setFilteredPatients(newData);
    } else {
      setFilteredPatients(patients);
    }
  };

  const renderPatient = ({ item }) => {
    // ⚡ 1. DATE LOGIC: Use 'created_at' since 'last_visit_date' is missing in your JSON
    const rawDate = item.last_visit_date || item.updated_at || item.created_at;
    const dateObj = rawDate ? new Date(rawDate) : null;
    const dateStr = dateObj
      ? dateObj.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "New";

    // ⚡ 2. COUNT LOGIC: Use 'total_visits' from your JSON
    const visitCount =
      item.total_visits !== undefined
        ? item.total_visits
        : item.visits
          ? item.visits.length
          : 0;

    return (
      <TouchableOpacity
        style={[
          styles.patientCard,
          {
            backgroundColor: activeColors.card,
            borderColor: activeColors.cardBorder,
          },
        ]}
        onPress={() =>
          router.push({
            pathname: "/doctor/patient/[id]",
            params: { id: item._id, ...item },
          })
        }
      >
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.name ? item.name[0].toUpperCase() : "?"}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.patientName, { color: activeColors.text }]}>
              {item.name}
            </Text>
            <Text style={[styles.patientId, { color: activeColors.subtext }]}>
              ID: {item._id ? item._id.slice(-6).toUpperCase() : "---"}
            </Text>
          </View>

          {/* 📅 Date Badge */}
          <View style={styles.dateBadge}>
            <Ionicons name="calendar-outline" size={12} color="#005EB8" />
            <Text style={styles.dateText}>{dateStr}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <View style={styles.infoTag}>
            <Ionicons
              name="person-outline"
              size={14}
              color={activeColors.subtext}
            />
            <Text style={[styles.infoText, { color: activeColors.subtext }]}>
              {item.age} yrs • {item.gender}
            </Text>
          </View>

          <View style={styles.infoTag}>
            <Ionicons
              name="medkit-outline"
              size={14}
              color={activeColors.subtext}
            />
            <Text style={[styles.infoText, { color: activeColors.subtext }]}>
              {visitCount} Visits
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={[
            styles.container,
            { backgroundColor: activeColors.background },
          ]}
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: activeColors.text }]}>
              Patient Registry
            </Text>
            <TouchableOpacity onPress={refetch}>
              <Ionicons name="refresh" size={24} color={activeColors.tint} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchRow}>
            <SearchBar
              value={searchText}
              onChangeText={handleSearch}
              onClear={() => handleSearch("")}
              placeholder="Search by name..."
              containerStyle={{ flex: 1 }}
            />
            <DateFilter
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </View>

          {selectedDate && (
            <View style={styles.filterChipContainer}>
              <View
                style={[
                  styles.filterChip,
                  { backgroundColor: activeColors.tint },
                ]}
              >
                <Text style={styles.filterText}>
                  Date: {selectedDate.toLocaleDateString()}
                </Text>
                <TouchableOpacity
                  onPress={() => setSelectedDate(null)}
                  style={{ marginLeft: 8 }}
                >
                  <Ionicons name="close-circle" size={18} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {loading ? (
            <ActivityIndicator
              size="large"
              color={activeColors.tint}
              style={{ marginTop: 50 }}
            />
          ) : (
            <FlatList
              data={filteredPatients}
              keyExtractor={(item) => item._id || Math.random().toString()}
              renderItem={renderPatient}
              onRefresh={refetch}
              refreshing={loading}
              contentContainerStyle={{ paddingBottom: 100 }}
              ListEmptyComponent={
                <View style={{ alignItems: "center", marginTop: 50 }}>
                  <Ionicons
                    name="people-outline"
                    size={48}
                    color={activeColors.subtext}
                  />
                  <Text
                    style={[styles.emptyText, { color: activeColors.subtext }]}
                  >
                    {selectedDate
                      ? "No visits found for this date."
                      : searchText
                        ? "No patient found."
                        : "Registry is empty."}
                  </Text>
                </View>
              }
            />
          )}

          <TouchableOpacity
            style={styles.fab}
            onPress={() => router.push("/addPatient")}
          >
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>

          <CustomAlert
            visible={alertConfig.visible}
            title={alertConfig.title}
            message={alertConfig.message}
            type={alertConfig.type}
            onClose={() => setAlertConfig({ ...alertConfig, visible: false })}
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 15,
  },
  title: { fontSize: 26, fontWeight: "bold" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 15,
  },
  filterChipContainer: { flexDirection: "row", marginBottom: 15 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  filterText: { color: "white", fontWeight: "600", fontSize: 13 },

  // ⚡ UPDATED CARD STYLES
  patientCard: {
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E1E1E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { color: "#636366", fontWeight: "700", fontSize: 18 },
  patientName: { fontSize: 17, fontWeight: "700" },
  patientId: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },

  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F7FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    marginLeft: "auto",
  },
  dateText: { fontSize: 12, color: "#005EB8", fontWeight: "600" },

  cardFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    paddingTop: 12,
    gap: 16,
  },
  infoTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoText: { fontSize: 13, fontWeight: "500" },

  emptyText: { textAlign: "center", marginTop: 10, fontSize: 16 },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    backgroundColor: "#005EB8",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#005EB8",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
