// api.js
const BASE_URL = 'http://0.232.60.168:8000'; 

export const api = {
  // 1. Upload Parchi (Now supports Patient ID!)
  uploadImage: async (imageUri, patientId) => {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    // Send patient_id so we can group pages
    if (patientId) {
        formData.append('patient_id', patientId);
    }

    try {
      const response = await fetch(`${BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return await response.json();
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  },

  // 2. Chat with History
  askQuestion: async (query, patientId) => {
    try {
      const response = await fetch(`${BASE_URL}/analyze/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            query: query, 
            patient_id: patientId // <--- Chat knows who we are talking about
        }),
      });
      return await response.json();
    } catch (error) {
      console.error("Chat failed:", error);
      return null;
    }
  },

  // 3. X-Ray Scanner
  scanXray: async (imageUri) => {
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'xray.jpg',
    });

    try {
      const response = await fetch(`${BASE_URL}/analyze/xray`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return await response.json();
    } catch (error) {
      console.error("X-Ray failed:", error);
      return null;
    }
  }
};