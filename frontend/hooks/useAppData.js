import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";

// 🪝 HOOK 1: Manages Patient List & Auto-Refresh with Date Filter
export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const fetchPatients = useCallback(
    async (date = selectedDate) => {
      setLoading(true);
      setError(null);
      try {
        // 1. Prepare Date String (YYYY-MM-DD)
        const dateString = date ? date.toISOString().split("T")[0] : null;

        // 2. Fetch Data from Backend
        const data = await api.getPatients(dateString);

        if (data === null) {
          setPatients([]);
          setError("Could not connect to server.");
        } else {
          let filteredData = data;

          // ⚡ CLIENT-SIDE FILTERING FALLBACK
          // If the backend returns ALL patients despite the date param, we filter here manually.
          if (dateString) {
            filteredData = data.filter((patient) => {
              // Check if patient has a 'last_visit' or 'visits' field matching the date
              // Note: Adjust 'last_visit_date' to match your actual backend property name!
              const visitDate =
                patient.last_visit_date ||
                patient.updated_at ||
                patient.created_at;

              if (!visitDate) return false;

              // Compare YYYY-MM-DD strings
              return visitDate.startsWith(dateString);
            });
          }

          // 3. SORTING: Alphabetical (A-Z)
          const sortedData = filteredData.sort((a, b) => {
            const nameA = a.name ? a.name.toUpperCase() : "";
            const nameB = b.name ? b.name.toUpperCase() : "";
            return nameA.localeCompare(nameB);
          });

          setPatients(sortedData);
        }
      } catch (err) {
        console.error(err);
        setPatients([]);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    },
    [selectedDate],
  );

  // Auto-Fetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchPatients();
    }, [fetchPatients]),
  );

  // Auto-Fetch when Date Changes
  useEffect(() => {
    fetchPatients(selectedDate);
  }, [selectedDate]);

  return {
    patients,
    loading,
    error,
    refetch: () => fetchPatients(selectedDate),
    selectedDate,
    setSelectedDate,
  };
};

// ... (Keep useVisitHistory unchanged)
export const useVisitHistory = (patientId) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!patientId) return;

    const data = await api.getHistory(patientId);

    const sortedData = (data || []).sort((a, b) => {
      const dateA = new Date(a.timestamp || a.created_at || a.date || 0);
      const dateB = new Date(b.timestamp || b.created_at || b.date || 0);
      return dateB - dateA;
    });

    setHistory(sortedData);
    setLoading(false);
  }, [patientId]);

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [fetchHistory]),
  );

  return { history, loading, refetch: fetchHistory };
};
