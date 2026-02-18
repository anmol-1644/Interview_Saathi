"""
Interview Saathi - Whisper Speech-to-Text Module
Uses OpenAI Whisper (small model) to transcribe audio recordings
"""

import whisper
import os

# Load model once at module import time (avoids reloading per request)
# "small" balances speed and accuracy; supports multilingual input including Hindi
print("[Whisper] Loading model... (first load may take a moment)")
_model = whisper.load_model("small")
print("[Whisper] Model loaded successfully.")


def transcribe_audio(audio_path: str) -> str:
    """
    Transcribe an audio file to text using Whisper.

    Args:
        audio_path: Path to the audio file (webm, wav, mp3, etc.)

    Returns:
        Transcribed text as a string.

    Notes:
        - Whisper auto-detects language; it handles Hinglish naturally.
        - We set language=None to let Whisper auto-detect, which helps
          with code-mixed Hindi-English speech common among our users.
    """
    if not os.path.exists(audio_path):
        raise FileNotFoundError(f"Audio file not found: {audio_path}")

    try:
        # fp16=False for CPU compatibility (most local setups won't have GPU)
        result = _model.transcribe(
            audio_path,
            fp16=False,
            language=None,       # Auto-detect (English + Hinglish supported)
            task="transcribe",   # "transcribe" keeps original language; use "translate" for English output
            verbose=False
        )
        transcript = result.get("text", "").strip()
        return transcript

    except Exception as e:
        raise RuntimeError(f"Whisper transcription failed: {e}")
