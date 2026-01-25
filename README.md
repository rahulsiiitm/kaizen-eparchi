# E-parchi (Clinic AI EMR)

**E-parchi** is an intelligent Electronic Medical Record (EMR) system designed to streamline the doctor-patient workflow using Generative AI. It enables doctors to manage patients, digitize prescriptions via OCR/LLM, analyze X-rays using Computer Vision, and chat with a patient’s longitudinal medical history through Retrieval-Augmented Generation (RAG).

**Author:** Rahul (IIIT Manipur)  
**Batch:** 2023–2027

---

## Key Features

### AI and Automation

- Prescription digitization via OCR + LLM
- Automated X-ray analysis
- Longitudinal RAG chat over patient history using Pinecone

### Frontend (Mobile App)

- Doctor dashboard for patient management
- Digital timeline of visits and reports
- Built using Expo (React Native)

### Backend

- High-performance FastAPI server
- LangChain + Gemini for LLM processing
- Pinecone for vector search
- MongoDB for record management

---

## Tech Stack

### Frontend

- React Native (Expo)
- Expo Router
- Reanimated
- Lottie
- JavaScript / TypeScript

### Backend

- FastAPI (Python)
- LangChain + Gemini
- Pinecone
- MongoDB (Motor)
- Pillow
- Pytesseract

---

## Project Structure

```
kaizen-eparchi/
├── backend/ 
│   ├── app/
│   │   ├── services/       # AI logic (RAG, Vision, Ingest)
│   │   ├── models.py       # Pydantic / DB models
│   │   └── main.py         # API entry point
│   ├── uploads/            # Local storage for images
│   └── requirements.txt    # Python dependencies
└── frontend/
    ├── app/                # Expo Router screens
    ├── assets/             # Images and animations
    └── package.json        # JS dependencies
```

---

## Getting Started

### Prerequisites

- Node.js
- Python 3.9+
- MongoDB (local or Atlas)
- API keys:
  - Google Gemini API
  - Pinecone API

---

## Backend Setup

Navigate to backend:

```
cd backend
```

Create and activate virtual environment:

```
python -m venv venv
```

Windows:

```
venv\Scripts\activate
```

Mac/Linux:

```
source venv/bin/activate
```

Install dependencies:

```
pip install -r requirements.txt
```

Create `.env` file in backend directory:

```
GOOGLE_API_KEY=your_gemini_api_key
PINECONE_API_KEY=your_pinecone_key
PINECONE_ENV=your_env
MONGO_URI=mongodb://localhost:27017
```

Run server:

```
python -m app.main
```

or:

```
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API URL:

```
http://localhost:8000
```

---

## Frontend Setup

Navigate to frontend:

```
cd frontend
```

Install dependencies:

```
npm install
```

Start Expo:

```
npx expo start
```

Open on device via Expo Go.

---

## API Endpoints

| Method | Endpoint                | Description                                  |
|--------|-------------------------|----------------------------------------------|
| POST   | /patients/create        | Register a new patient                       |
| GET    | /patients               | List all patients                            |
| POST   | /visits/create          | Create a visit session                       |
| POST   | /visits/{id}/upload     | Upload prescription or X-ray for AI analysis |
| POST   | /visits/{id}/chat       | Query patient history using RAG              |

---

## Future Roadmap

- Voice transcription for notes
- Appointment scheduling
- Offline rural mode with caching

---

## License

Project intended for educational and hackathon usage.
