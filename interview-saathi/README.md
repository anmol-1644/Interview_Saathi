# 🎤 Interview Saathi

> AI-powered mock interview platform for Hindi, Awadhi, and Bhojpuri speaking students.
> Practice interviews. Get instant AI feedback. Ace your dream job.

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Python | 3.9+ |
| Node.js | 18+ |
| npm | 9+ |
| ffmpeg | any (for Whisper audio processing) |

**Install ffmpeg:**
```bash
# macOS
brew install ffmpeg

# Ubuntu/Debian
sudo apt install ffmpeg

# Windows
winget install Gyan.FFmpeg
```

---

## 📁 Project Structure

```
interview-saathi/
├── backend/
│   ├── app.py              # Flask server (routes & orchestration)
│   ├── whisper_logic.py    # Whisper speech-to-text module
│   ├── groq_logic.py       # Groq LLM question gen + analysis
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx   # Hero + features
│   │   │   ├── InterviewPage.jsx # Role select + record
│   │   │   └── ResultsPage.jsx   # Full analysis dashboard
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── RecordingButton.jsx
│   │   │   ├── ScoreRing.jsx
│   │   │   └── LoadingOverlay.jsx
│   │   └── utils/
│   │       ├── useAudioRecorder.js  # Microphone hook
│   │       └── gamification.js      # XP/level system
│   ├── index.html
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## ⚙️ Setup

### Step 1: Clone & Configure Environment

```bash
git clone <repo-url>
cd interview-saathi

# Create your .env file
cp .env.example .env
```

Edit `.env`:
```env
GROQ_API_KEY=your_groq_api_key_here
```

**Get a free Groq API key:** https://console.groq.com/

---

### Step 2: Backend Setup

```bash
cd backend

# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate      # Mac/Linux
# OR: venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# The first time you run, Whisper will download the model (~460MB)
# This is a one-time download
```

**Start the backend:**
```bash
python app.py
```

Backend runs at: `http://localhost:5000`

---

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: `http://localhost:5173`

The Vite dev server automatically proxies `/api` requests to Flask.

---

## 🎯 How to Use

1. Open `http://localhost:5173` in your browser
2. Click **"Start Interview"**
3. Choose your interview type:
   - 💻 **Software Engineer** – Technical + behavioral
   - 🤝 **HR Interview** – Soft skills & personality
   - 🎓 **MBA Interview** – Leadership & strategy
4. Read the AI-generated question
5. Click the **microphone button** to start recording
6. Speak your answer (Hinglish is perfectly fine!)
7. Click **Stop**, then **"Analyze My Answer"**
8. View your full analysis report with:
   - Interview Readiness Score (0-100)
   - Grammar, Structure, Tone, Confidence scores
   - STAR method detection
   - Filler word detection
   - Professional rewritten answer
   - Improvement suggestions
   - XP earned & level progress

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/question` | Generate interview question |
| POST | `/api/analyze` | Transcribe + analyze response |

### POST `/api/question`
```json
Request:  { "role": "Software Engineer" }
Response: { "question": "Tell me about a challenging project..." }
```

### POST `/api/analyze`
```
Content-Type: multipart/form-data
Fields:
  - audio: audio file (webm/wav/mp3)
  - role: string
  - question: string
```

---

## 📊 Scoring Formula

```
Interview Readiness Score (0-100) =
  (grammar_score × 0.3) +
  (structure_score × 0.3) +
  (professional_tone × 0.2) +
  (confidence_score × 0.2)
  × 10
```

Where `confidence_score = max(0, 10 - filler_count × 1.5)`

---

## 🏆 Gamification

| XP Range | Level | Badge |
|----------|-------|-------|
| 0 – 100 | 🌱 Beginner | – |
| 101 – 300 | 📈 Improving Communicator | – |
| 301+ | 🏆 Interview Ready | ⭐ |

Each interview session earns **50 XP**. Score ≥ 75 earns the **Interview Ready Badge**.

---

## 🛠 Tech Stack

**Backend:**
- Flask + Flask-CORS
- OpenAI Whisper (small model) for STT
- Groq API (LLaMA 3.3 70B) for LLM analysis
- python-dotenv

**Frontend:**
- React 18 + Vite
- React Router v6
- Tailwind CSS
- Axios
- MediaRecorder API (native browser)

---

## 🔒 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | ✅ | Your Groq API key |

---

## 🚢 Production Deployment

**Backend (Gunicorn):**
```bash
pip install gunicorn
gunicorn -w 2 -b 0.0.0.0:5000 app:app
```

**Frontend (Build):**
```bash
cd frontend
npm run build
# Serve the dist/ folder with nginx or any static host
```

---

## ❓ Troubleshooting

**Whisper download slow?**
First-run downloads `~460MB` model. Run `python -c "import whisper; whisper.load_model('small')"` separately to predownload.

**Microphone not working?**
Make sure your browser has microphone permissions. HTTPS is required in production (localhost is exempt).

**Groq API errors?**
Verify your `GROQ_API_KEY` in `.env`. Free tier has generous rate limits.

**ffmpeg not found?**
Whisper requires ffmpeg. Install it as shown in Prerequisites.

---

## 📝 License

MIT License — Built for hackathon · Open source · Community friendly

---

*Interview Saathi — Because every student deserves a fair shot at their dream job.* 🚀
