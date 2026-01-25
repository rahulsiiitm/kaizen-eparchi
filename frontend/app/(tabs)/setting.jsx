import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const CLINICAL_BLUE = "#005EB8";

  // Mock States
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => router.replace("/"),
      },
    ]);
  };

  const SettingItem = ({
    icon,
    label,
    value,
    type = "link",
    color = "#1C1C1E",
  }) => (
    <TouchableOpacity
      style={styles.itemRow}
      activeOpacity={type === "link" ? 0.7 : 1}
      onPress={type === "link" ? () => {} : null}
    >
      <View
        style={[
          styles.iconBox,
          { backgroundColor: type === "logout" ? "#FF3B3015" : "#F2F2F7" },
        ]}
      >
        <Ionicons
          name={icon}
          size={20}
          color={type === "logout" ? "#FF3B30" : CLINICAL_BLUE}
        />
      </View>
      <Text style={[styles.itemLabel, { color }]}>{label}</Text>

      {type === "toggle" && (
        <Switch
          trackColor={{ false: "#E5E5EA", true: CLINICAL_BLUE }}
          thumbColor={"white"}
          ios_backgroundColor="#E5E5EA"
          onValueChange={() => value && value(!biometrics)} // Toggle logic mock
          value={biometrics}
        />
      )}

      {type === "toggle_notif" && (
        <Switch
          trackColor={{ false: "#E5E5EA", true: CLINICAL_BLUE }}
          thumbColor={"white"}
          ios_backgroundColor="#E5E5EA"
          onValueChange={setNotifications}
          value={notifications}
        />
      )}

      {type === "link" && (
        <Ionicons name="chevron-forward" size={18} color="#C7C7CC" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: "#F2F2F7" }]}>
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={CLINICAL_BLUE} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* PROFILE CARD */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>DH</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.profileName}>Dr. Hackathon</Text>
              <Text style={styles.profileEmail}>dr.hackathon@clinic.com</Text>
              <Text style={styles.profileRole}>Chief Medical Officer</Text>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Ionicons name="pencil" size={16} color="white" />
            </TouchableOpacity>
          </View>

          {/* SECTION 1: ACCOUNT */}
          <Text style={styles.sectionHeader}>Account</Text>
          <View style={styles.sectionContainer}>
            <SettingItem icon="person" label="Personal Information" />
            <View style={styles.divider} />
            <SettingItem icon="medical" label="Clinic Profile" />
            <View style={styles.divider} />
            <SettingItem
              icon="finger-print"
              label="Biometric Login"
              type="toggle"
              value={setBiometrics}
            />
          </View>

          {/* SECTION 2: PREFERENCES */}
          <Text style={styles.sectionHeader}>Preferences</Text>
          <View style={styles.sectionContainer}>
            <SettingItem
              icon="notifications"
              label="Push Notifications"
              type="toggle_notif"
            />
            <View style={styles.divider} />
            <SettingItem icon="globe" label="Language" />
            <View style={styles.divider} />
            <SettingItem icon="moon" label="Dark Mode (System)" />
          </View>

          {/* SECTION 3: SUPPORT */}
          <Text style={styles.sectionHeader}>Support</Text>
          <View style={styles.sectionContainer}>
            <SettingItem icon="help-circle" label="Help Center" />
            <View style={styles.divider} />
            <SettingItem icon="document-text" label="Terms of Service" />
          </View>

          {/* LOGOUT */}
          <View style={[styles.sectionContainer, { marginTop: 24 }]}>
            <TouchableOpacity style={styles.itemRow} onPress={handleLogout}>
              <View style={[styles.iconBox, { backgroundColor: "#FF3B3015" }]}>
                <Ionicons name="log-out" size={20} color="#FF3B30" />
              </View>
              <Text style={[styles.itemLabel, { color: "#FF3B30" }]}>
                Log Out
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.versionText}>Version 1.0.2 (Build 2024)</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backBtn: { padding: 8, marginLeft: -8 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#1C1C1E" },
  scrollContent: { padding: 16, paddingBottom: 50 },

  // Profile Card
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E1E1E6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarText: { fontSize: 20, fontWeight: "700", color: "#636366" },
  profileName: { fontSize: 18, fontWeight: "700", color: "#1C1C1E" },
  profileEmail: { fontSize: 14, color: "#8E8E93", marginBottom: 2 },
  profileRole: {
    fontSize: 12,
    color: "#005EB8",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#005EB8",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  // Settings List
  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
    marginLeft: 4,
    textTransform: "uppercase",
  },
  sectionContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  itemLabel: { flex: 1, fontSize: 16, fontWeight: "500", color: "#1C1C1E" },
  divider: { height: 1, backgroundColor: "#F2F2F7", marginLeft: 60 },

  versionText: {
    textAlign: "center",
    color: "#C7C7CC",
    fontSize: 13,
    marginTop: -10,
    marginBottom: 20,
  },
});
