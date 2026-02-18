"""
Interview Saathi - Flask Backend
AI-powered mock interview platform for Hindi/Awadhi/Bhojpuri speakers
"""

import os
import json
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# from whisper_logic import transcribe_audio
from groq_logic import analyze_interview_response, generate_interview_question

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# Allow frontend dev server and production to connect
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Run server
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)


# ─────────────────────────────────────────────
# Health check
# ─────────────────────────────────────────────
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Interview Saathi backend running!"})


# ─────────────────────────────────────────────
# Generate interview question based on role
# ─────────────────────────────────────────────
@app.route("/api/question", methods=["POST"])
def get_question():
    """
    Expects: { "role": "Software Engineer" | "HR Interview" | "MBA Interview" }
    Returns: { "question": "..." }
    """
    data = request.get_json()
    if not data or "role" not in data:
        return jsonify({"error": "Missing 'role' in request body"}), 400

    role = data["role"]
    try:
        question = generate_interview_question(role)
        return jsonify({"question": question})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ─────────────────────────────────────────────
# Transcribe audio + Analyze response
# ─────────────────────────────────────────────
@app.route("/api/analyze", methods=["POST"])
def analyze():
    """
    Expects: multipart/form-data with:
      - audio: audio file (webm/wav/mp3)
      - role: interview role string
      - question: the interview question asked

    Returns: structured JSON with scores, feedback, rewritten answer
    """
    # Validate inputs
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    role = request.form.get("role", "Software Engineer")
    question = request.form.get("question", "Tell me about yourself.")
    audio_file = request.files["audio"]

    # Save audio to a temp file for Whisper
    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp:
        audio_file.save(tmp.name)
        tmp_path = tmp.name

    try:
        # Step 1: Transcribe audio → text
        print(f"[Transcribing audio] file: {tmp_path}")
        transcript = transcript = "This is a temporary test answer for debugging."
        print(f"[Transcript] {transcript}")

        if not transcript or len(transcript.strip()) < 3:
            return jsonify({"error": "Could not transcribe audio. Please speak clearly and try again."}), 422

        # Step 2: Analyze transcript with Groq LLM
        print(f"[Analyzing response with Groq]")
        analysis = analyze_interview_response(
            transcript=transcript,
            role=role,
            question=question
        )

        # Step 3: Calculate overall Interview Readiness Score
        grammar = analysis.get("grammar_score", 5)
        structure = analysis.get("structure_score", 5)
        tone = analysis.get("professional_tone_score", 5)
        filler_count = len(analysis.get("filler_words", []))

        # Confidence score: penalize filler words (max penalty at 5+ fillers)
        confidence_raw = max(0, 10 - (filler_count * 1.5))
        confidence = min(10, confidence_raw)

        readiness_score = (
            (grammar * 0.3) +
            (structure * 0.3) +
            (tone * 0.2) +
            (confidence * 0.2)
        ) * 10  # Scale to 100

        readiness_score = round(min(100, max(0, readiness_score)), 1)

        # Step 4: Build final response
        response = {
            "transcript": transcript,
            "grammar_score": grammar,
            "structure_score": structure,
            "professional_tone_score": tone,
            "confidence_score": round(confidence, 1),
            "filler_words": analysis.get("filler_words", []),
            "star_method_detected": analysis.get("star_method_detected", False),
            "improvement_suggestions": analysis.get("improvement_suggestions", []),
            "rewritten_professional_answer": analysis.get("rewritten_professional_answer", ""),
            "readiness_score": readiness_score,
            "xp_earned": 50
        }

        return jsonify(response)

    except Exception as e:
        print(f"[Error in /api/analyze] {e}")
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500
    finally:
        # Clean up temp audio file
        if os.path.exists(tmp_path):
            os.remove(tmp_path)


# ─────────────────────────────────────────────
# Run server
# ─────────────────────────────────────────────
if __name__ == "__main__":
    print("🎤 Interview Saathi backend starting on http://localhost:5000")
    app.run(debug=True, port=5000, host="0.0.0.0")
