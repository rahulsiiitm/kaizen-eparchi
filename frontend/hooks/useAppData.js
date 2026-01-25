import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { api } from "../services/api";

// 🪝 HOOK 1: Manages Patient List & Auto-Refresh
export const usePatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getPatients();
      if (data === null) {
        setPatients([]);
        setError("Could not connect to server.");
      } else {
        setPatients(data);
      }
    } catch (err) {
      console.error(err);
      setPatients([]);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ⚡ Auto-Fetch when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchPatients();
    }, [fetchPatients]),
  );

  return { patients, loading, error, refetch: fetchPatients };
};

// 🪝 HOOK 2: Manages Visit History & Auto-Refresh
export const useVisitHistory = (patientId) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    if (!patientId) return;
    // Don't set loading true on *every* refocus to avoid flickering,
    // but useful for first load.
    // setLoading(true);

    const data = await api.getHistory(patientId);

    // Sort by timestamp
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
