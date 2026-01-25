
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

    const responseText = await response.text();

    if (!response.ok) {
      console.log(`❌ API Error [${response.status}] ${url}`);
      return null;
    }

    try {
      return JSON.parse(responseText);
    } catch (e) {
      console.log(`⚠️ Parse Error on ${url}: Response was not JSON.`);
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

  getPatients: async (date = null) => {
    let url = `${BASE_URL}/patients`;
    if (date) {
      url += `?visit_date=${date}`;
    }
    return await safeFetch(url);
  },

  // --- B. CLINIC VISIT FLOW ---

  // Get Single Visit Details (For Chat History)
  getVisit: async (visitId) => {
    return await safeFetch(`${BASE_URL}/visits/${visitId}`);
  },

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

  // ⚡ FIX: 'docType' parameter renamed to 'type' for backend compatibility
  uploadFile: async (visitId, imageUri, docType = "prescription") => {
    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "upload.jpg",
    });
    // ⚡ CRITICAL FIX: The backend looks for 'type', not 'docType'
    formData.append("type", docType);

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
