import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    Dimensions,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api } from "../../services/api";

const { width } = Dimensions.get("window");

// --- Helper: Simple Bar Chart Component ---
const ActivityChart = ({ data, activeColor }) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Weekly Overview</Text>
        <Text style={styles.chartSubtitle}>Last 7 Days</Text>
      </View>
      <View style={styles.chartArea}>
        {data.map((day, index) => {
          const heightPct = (day.value / maxVal) * 100;
          return (
            <View key={index} style={styles.barGroup}>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    {
                      height: `${heightPct}%`,
                      backgroundColor: day.isToday ? activeColor : "#E1E1E6",
                    },
                  ]}
                />
              </View>
              <Text
                style={[
                  styles.barLabel,
                  day.isToday && { color: activeColor, fontWeight: "700" },
                ]}
              >
                {day.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default function DoctorDashboard() {
  const router = useRouter();
  const theme = useColorScheme() ?? "light";
  const CLINICAL_BLUE = "#005EB8";

  const [stats, setStats] = useState({ today: 0, month: 0, total: 0 });
  const [recentPatients, setRecentPatients] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⚡ FETCH & PROCESS DATA
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const allPatients = await api.getPatients();

      if (allPatients && Array.isArray(allPatients)) {
        const now = new Date();
        const todayStr = now.toISOString().split("T")[0];

        let todayCount = 0;
        let monthCount = 0;
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const processedList = allPatients.map((p) => {
          const dateRaw = p.last_visit_date || p.updated_at || p.created_at;
          return { ...p, dateObj: dateRaw ? new Date(dateRaw) : null };
        });

        processedList.forEach((p) => {
          if (p.dateObj) {
            const pStr = p.dateObj.toISOString().split("T")[0];
            if (pStr === todayStr) todayCount++;
            if (
              p.dateObj.getMonth() === currentMonth &&
              p.dateObj.getFullYear() === currentYear
            )
              monthCount++;
          }
        });

        setStats({
          today: todayCount,
          month: monthCount,
          total: allPatients.length,
        });

        // Prepare Chart Data
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(now.getDate() - i);
          const dStr = d.toISOString().split("T")[0];
          const label = d.toLocaleDateString("en-US", { weekday: "narrow" });

          const count = processedList.filter(
            (p) => p.dateObj && p.dateObj.toISOString().split("T")[0] === dStr,
          ).length;

          last7Days.push({ label, value: count, isToday: i === 0 });
        }
        setChartData(last7Days);

        // Recent Activity List
        const sorted = processedList.sort(
          (a, b) => (b.dateObj || 0) - (a.dateObj || 0),
        );
        setRecentPatients(sorted.slice(0, 5));
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, []),
  );

  const MetricTile = ({ label, value, icon, highlight = false }) => (
    <View
      style={[styles.metricTile, highlight && { borderColor: CLINICAL_BLUE }]}
    >
      <View style={styles.metricHeader}>
        <Text
          style={[styles.metricLabel, highlight && { color: CLINICAL_BLUE }]}
        >
          {label}
        </Text>
        <Ionicons
          name={icon}
          size={16}
          color={highlight ? CLINICAL_BLUE : "#8E8E93"}
        />
      </View>
      <Text style={[styles.metricValue, highlight && { color: CLINICAL_BLUE }]}>
        {value}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: "#F2F2F7" }]}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView edges={["top"]} style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Dr. Hackathon</Text>
            <Text style={styles.headerSubtitle}>
              {new Date().toLocaleDateString(undefined, {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </Text>
          </View>

          {/* ⚡ FIXED: Shows "DH" but links to Settings */}
          <TouchableOpacity
            style={styles.profileIcon}
            onPress={() => router.push("/setting")}
          >
            <Text style={styles.profileInitials}>DH</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={loadDashboardData}
            />
          }
        >
          {/* METRICS GRID */}
          <View style={styles.gridContainer}>
            <View style={styles.row}>
              <MetricTile
                label="Patients Today"
                value={stats.today}
                icon="people"
                highlight
              />
              <MetricTile
                label="Total Registry"
                value={stats.total}
                icon="folder-open"
              />
            </View>
            <View style={styles.row}>
              <MetricTile
                label="Month Visits"
                value={stats.month}
                icon="calendar"
              />
              <MetricTile label="Pending Reports" value="0" icon="time" />
            </View>
          </View>

          {/* ACTIVITY CHART */}
          {chartData.length > 0 && (
            <ActivityChart data={chartData} activeColor={CLINICAL_BLUE} />
          )}

          {/* QUICK ACTIONS BAR */}
          <View style={styles.actionBar}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: CLINICAL_BLUE }]}
              onPress={() => router.push("/addPatient")}
            >
              <Ionicons name="add" size={20} color="white" />
              <Text style={styles.actionBtnText}>New Patient</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButtonOutline}
              onPress={() => router.push("/patient")}
            >
              <Text style={styles.actionBtnTextOutline}>View Registry</Text>
            </TouchableOpacity>
          </View>

          {/* RECENT LIST */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Consultations</Text>
            <TouchableOpacity onPress={() => router.push("/patient")}>
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.tableContainer}>
            {recentPatients.length === 0 ? (
              <Text style={styles.emptyText}>No recent activity.</Text>
            ) : (
              recentPatients.map((item, index) => (
                <TouchableOpacity
                  key={item._id}
                  style={[
                    styles.tableRow,
                    index === recentPatients.length - 1 && {
                      borderBottomWidth: 0,
                    },
                  ]}
                  onPress={() =>
                    router.push({
                      pathname: "/doctor/patient/[id]",
                      params: { id: item._id, ...item },
                    })
                  }
                >
                  <View style={styles.statusDot} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowName}>{item.name}</Text>
                    <Text style={styles.rowDetail}>
                      ID: {item._id.slice(-6).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={styles.rowTime}>
                      {item.dateObj
                        ? item.dateObj.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "--:--"}
                    </Text>
                    <Text style={styles.rowDetail}>
                      {item.gender}, {item.age}y
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color="#C7C7CC"
                    style={{ marginLeft: 10 }}
                  />
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#1C1C1E" },
  headerSubtitle: { fontSize: 13, color: "#8E8E93", marginTop: 2 },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E1E1E6",
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitials: { fontSize: 14, fontWeight: "600", color: "#636366" },

  // Metrics Grid
  gridContainer: { marginTop: 16, gap: 12 },
  row: { flexDirection: "row", gap: 12 },
  metricTile: {
    flex: 1,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    shadowColor: "#000",
    shadowOpacity: 0.02,
    shadowRadius: 5,
    elevation: 1,
  },
  metricHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    textTransform: "uppercase",
  },
  metricValue: { fontSize: 24, fontWeight: "700", color: "#1C1C1E" },

  // Chart
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  chartHeader: { marginBottom: 16 },
  chartTitle: { fontSize: 16, fontWeight: "600", color: "#1C1C1E" },
  chartSubtitle: { fontSize: 12, color: "#8E8E93" },
  chartArea: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 100,
    alignItems: "flex-end",
  },
  barGroup: { alignItems: "center", flex: 1 },
  barTrack: {
    height: "85%",
    width: 8,
    backgroundColor: "#F2F2F7",
    borderRadius: 4,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  barFill: { width: "100%", borderRadius: 4 },
  barLabel: { marginTop: 8, fontSize: 10, color: "#8E8E93", fontWeight: "500" },

  // Action Bar
  actionBar: { flexDirection: "row", gap: 12, marginTop: 16 },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  actionButtonOutline: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D1D6",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  actionBtnText: { color: "white", fontWeight: "600", fontSize: 14 },
  actionBtnTextOutline: { color: "#1C1C1E", fontWeight: "600", fontSize: 14 },

  // Recent List
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#1C1C1E" },
  seeAllLink: { fontSize: 14, color: "#005EB8", fontWeight: "600" },

  tableContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#34C759",
    marginRight: 12,
  },
  rowName: { fontSize: 15, fontWeight: "600", color: "#1C1C1E" },
  rowDetail: { fontSize: 12, color: "#8E8E93", marginTop: 2 },
  rowTime: { fontSize: 12, fontWeight: "600", color: "#1C1C1E" },
  emptyText: { padding: 20, textAlign: "center", color: "#8E8E93" },
});
