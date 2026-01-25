
// 🚀 CONNECTED TO: Rahul's Backend via Ngrok
// UPDATE THIS IF NGROK RESTARTS
const BASE_URL = "https://semimythic-cosmographic-sherika.ngrok-free.dev";

// Helper to handle response safely
const safeFetch = async (url, options = {}) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    console.log(`📡 Requesting: ${url}`);
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // 1. Read raw text first to debug "Unexpected character" errors
    const responseText = await response.text();

    // 2. Log error if status is not OK (200-299)
    if (!response.ok) {
      console.log(`❌ API Error [${response.status}] ${url}`);
      console.log(`   Server Response: ${responseText}`); // <--- THIS WILL SHOW YOU THE REAL ERROR
      return null;
    }

    // 3. Try parsing JSON
    try {
      return JSON.parse(responseText);
    } catch (e) {
      console.log(`⚠️ Parse Error on ${url}: Response was not JSON.`);
      console.log(`   Raw Body: ${responseText}`);
      return null;
    }
  } catch (error) {
    console.log(`🚫 Connection Failed [${url}]:`, error.message);
    return null;
  }
};

export const api = {
  // --- A. PATIENT REGISTRY ---

  createPatient: async (name, age, gender) => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("age", age.toString());
    formData.append("gender", gender);

    return await safeFetch(`${BASE_URL}/patients/create`, {
      method: "POST",
      body: formData,
    });
  },

  getPatients: async () => {
    return await safeFetch(`${BASE_URL}/patients`);
  },

  // --- B. CLINIC VISIT FLOW ---

  startVisit: async (patientId) => {
    const formData = new FormData();
    formData.append("patient_id", patientId);
    formData.append("doctor_id", "dr_hackathon");

    return await safeFetch(`${BASE_URL}/visits/create`, {
      method: "POST",
      body: formData,
    });
  },

  getHistory: async (patientId) => {
    const result = await safeFetch(`${BASE_URL}/visits/history/${patientId}`);
    return result || [];
  },

  // --- C. AI TOOLS ---

  uploadFile: async (visitId, imageUri, type = "prescription") => {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "upload.jpg",
    });
    formData.append("type", type);

    return await safeFetch(`${BASE_URL}/visits/${visitId}/upload`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });
  },

  chatWithVisit: async (visitId, query) => {
    const formData = new FormData();
    formData.append("query", query);

    return await safeFetch(`${BASE_URL}/visits/${visitId}/chat`, {
      method: "POST",
      body: formData,
    });
  },
};
