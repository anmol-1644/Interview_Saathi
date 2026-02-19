"""
Interview Saathi - Flask Backend (Fixed Version)
AI-powered mock interview platform
"""

import os
import json
import tempfile
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from groq import Groq

# Logic imports
from groq_logic import analyze_interview_response, generate_interview_question

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Groq Client setup for Transcription
client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Interview Saathi backend running!"})

@app.route("/api/question", methods=["GET", "POST"])
def get_question():
    # Handling both GET and POST to avoid "pending" state in frontend
    role = "Software Engineer" # Default
    if request.method == "POST":
        data = request.get_json()
        if data and "role" in data:
            role = data["role"]
    
    try:
        question = generate_interview_question(role)
        return jsonify({"question": question})
    except Exception as e:
        print(f"Error generating question: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/analyze", methods=["POST"])
def analyze():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    role = request.form.get("role", "Software Engineer")
    question = request.form.get("question", "Tell me about yourself.")
    audio_file = request.files["audio"]

    with tempfile.NamedTemporaryFile(suffix=".webm", delete=False) as tmp:
        audio_file.save(tmp.name)
        tmp_path = tmp.name

    try:
        # Step 1: REAL Transcription using Groq Whisper (Not local model)
        # This prevents Render from crashing due to low RAM (512MB)
        with open(tmp_path, "rb") as file:
            transcription = client.audio.transcriptions.create(
                file=(tmp_path, file.read()),
                model="whisper-large-v3",
                response_format="text",
            )
        transcript = transcription
        
        # Step 2: Analyze transcript with Groq
        analysis = analyze_interview_response(
            transcript=transcript,
            role=role,
            question=question
        )

        # Step 3: Calculate Readiness Score
        grammar = analysis.get("grammar_score", 5)
        structure = analysis.get("structure_score", 5)
        tone = analysis.get("professional_tone_score", 5)
        filler_count = len(analysis.get("filler_words", []))

        confidence_raw = max(0, 10 - (filler_count * 1.5))
        confidence = min(10, confidence_raw)

        readiness_score = ((grammar * 0.3) + (structure * 0.3) + (tone * 0.2) + (confidence * 0.2)) * 10
        readiness_score = round(min(100, max(0, readiness_score)), 1)

        return jsonify({
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
        })

    except Exception as e:
        print(f"[Error in /api/analyze] {e}")
        return jsonify({"error": f"Analysis failed: {str(e)}"}), 500
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 10000))
    app.run(host="0.0.0.0", port=port)