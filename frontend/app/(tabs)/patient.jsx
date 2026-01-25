import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react"; // Added useEffect for search logic
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

import SearchBar from "../../components/SearchBar";
import { Colors } from "../../constants/theme";
// 👇 Import your new Hook
import { usePatients } from "../../hooks/useAppData";

export default function PatientScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const activeColors = Colors[theme];

  // ⚡ USE THE HOOK
  const { patients, loading, error, refetch } = usePatients();

  // Local Search State
  const [searchText, setSearchText] = useState("");
  const [filteredPatients, setFilteredPatients] = useState([]);

  // Sync filtered list with fetched patients
  useEffect(() => {
    if (searchText) {
      handleSearch(searchText);
    } else {
      setFilteredPatients(patients);
    }
  }, [patients]); // Runs whenever the hook updates 'patients'

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

  // Render Item Logic...
  const renderPatient = ({ item }) => (
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
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name ? item.name[0].toUpperCase() : "?"}
        </Text>
      </View>
      <View>
        <Text style={[styles.patientName, { color: activeColors.text }]}>
          {item.name}
        </Text>
        <Text style={[styles.patientInfo, { color: activeColors.subtext }]}>
          {item.age} years • {item.gender}
        </Text>
      </View>
      <Ionicons
        name="chevron-forward"
        size={20}
        color={activeColors.icon}
        style={{ marginLeft: "auto" }}
      />
    </TouchableOpacity>
  );

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
            {/* Manual Refresh Trigger */}
            <TouchableOpacity onPress={refetch}>
              <Ionicons name="refresh" size={24} color={activeColors.tint} />
            </TouchableOpacity>
          </View>

          <SearchBar
            value={searchText}
            onChangeText={handleSearch}
            onClear={() => handleSearch("")}
            placeholder="Search patients..."
          />

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
                    name={searchText ? "search" : "cloud-offline-outline"}
                    size={48}
                    color={activeColors.subtext}
                  />
                  <Text
                    style={[styles.emptyText, { color: activeColors.subtext }]}
                  >
                    {error
                      ? error
                      : searchText
                        ? "No matches found."
                        : "No patients available."}
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
  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: { color: "white", fontWeight: "bold", fontSize: 18 },
  patientName: { fontSize: 17, fontWeight: "600" },
  patientInfo: { fontSize: 14, marginTop: 2 },
  emptyText: { textAlign: "center", marginTop: 10, fontSize: 16 },
  fab: {
    position: "absolute",
    bottom: 110,
    right: 30,
    backgroundColor: "#007AFF",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },
});
