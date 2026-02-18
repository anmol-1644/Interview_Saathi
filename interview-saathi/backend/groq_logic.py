"""
Interview Saathi - Groq LLM Analysis Module
Uses Groq API (LLaMA 3) for interview response analysis and question generation
"""

import os
import json
import re
from groq import Groq
from dotenv import load_dotenv
load_dotenv()
# Initialize Groq client using API key from environment
_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

# Model to use - llama-3.3-70b-versatile is fast and capable on Groq
MODEL = "llama-3.3-70b-versatile"


# ─────────────────────────────────────────────
# Question Generation
# ─────────────────────────────────────────────

# Curated question banks per role for fallback + diversity
QUESTION_BANKS = {
    "Software Engineer": [
        "Tell me about yourself and why you're interested in this role.",
        "What is your greatest weakness, and how are you working to improve it?",
        "Describe a conflict you had with a colleague and how you resolved it.",
        "Where do you see yourself in five years?",
        "Why do you want to leave your current job?",
    ],
    "HR Interview": [
        "Tell me about yourself and why you're interested in this role.",
        "What is your greatest weakness, and how are you working to improve it?",
        "Describe a conflict you had with a colleague and how you resolved it.",
        "Where do you see yourself in five years?",
        "Why do you want to leave your current job?",
    ],
    "MBA Interview": [
        "Why do you want to pursue an MBA, and why at this institution?",
        "Describe a leadership experience where you drove significant change.",
        "How would you handle a situation where your team disagrees with your decision?",
        "Tell me about a failure in your career and what you learned from it.",
        "What is your post-MBA career goal and how does this program help you achieve it?",
    ],
}


def generate_interview_question(role: str) -> str:
    """
    Generate a contextual interview question for the given role using Groq.
    Falls back to a question bank if the API call fails.

    Args:
        role: One of "Software Engineer", "HR Interview", "MBA Interview"

    Returns:
        A single interview question as a string.
    """
    import random

    prompt = f"""You are an expert interviewer. Generate ONE challenging, realistic interview question 
for a {role} candidate. The question should test both technical knowledge and communication skills.
Return ONLY the question text, nothing else. No preamble, no numbering."""

    try:
        response = _client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=150,
            temperature=0.9,  # High temperature for diverse questions
        )
        question = response.choices[0].message.content.strip()
        # Clean up any quotes the model may add
        question = question.strip('"').strip("'")
        return question

    except Exception as e:
        print(f"[Groq] Question generation failed, using fallback: {e}")
        # Fallback to curated question bank
        bank = QUESTION_BANKS.get(role, QUESTION_BANKS["HR Interview"])
        return random.choice(bank)


# ─────────────────────────────────────────────
# Interview Response Analysis
# ─────────────────────────────────────────────

ANALYSIS_SYSTEM_PROMPT = """You are Interview Saathi, an expert AI interview coach specializing in 
helping Hindi, Awadhi, and Bhojpuri speaking students improve their professional English communication.

You analyze interview responses and provide structured, actionable feedback.
You are warm, encouraging, and culturally aware. You understand that users may mix Hindi/English 
(Hinglish) in their responses and you help them improve toward professional English.

Always respond with valid JSON only. No markdown, no explanation outside the JSON."""

ANALYSIS_USER_PROMPT_TEMPLATE = """Analyze this interview response from a {role} candidate.

INTERVIEW QUESTION: {question}

CANDIDATE'S RESPONSE (may be in Hinglish or broken English):
"{transcript}"

Evaluate and return a JSON object with EXACTLY these fields:
{{
  "grammar_score": <integer 0-10, where 10 is perfect grammar>,
  "structure_score": <integer 0-10, where 10 means well-organized with clear beginning/middle/end>,
  "professional_tone_score": <integer 0-10, where 10 is fully professional and confident>,
  "filler_words": <array of filler words/phrases found, e.g. ["um", "basically", "you know", "acha"]>,
  "star_method_detected": <boolean, true if response follows Situation-Task-Action-Result pattern>,
  "improvement_suggestions": <array of 3-5 specific, actionable improvement tips as strings>,
  "rewritten_professional_answer": <string: a professional, polished version of their answer in fluent English, maintaining their core points but improving clarity, structure, and tone>
}}

Rules:
- Be encouraging but honest with scores
- improvement_suggestions should be specific, not generic
- rewritten_professional_answer should sound natural, not robotic
- Detect Hindi/Hinglish filler words too (like "matlab", "basically", "accha", "toh")
- If the answer uses STAR method elements, mark star_method_detected as true
- Return ONLY valid JSON, nothing else"""


def analyze_interview_response(transcript: str, role: str, question: str) -> dict:
    """
    Analyze an interview response transcript using Groq LLM.

    Args:
        transcript: The transcribed text of the candidate's response
        role: The interview role (e.g., "Software Engineer")
        question: The interview question that was asked

    Returns:
        Dict with analysis fields (grammar_score, suggestions, etc.)
    """
    user_prompt = ANALYSIS_USER_PROMPT_TEMPLATE.format(
        role=role,
        question=question,
        transcript=transcript
    )

    try:
        response = _client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": ANALYSIS_SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            max_tokens=1500,
            temperature=0.3,  # Low temperature for consistent structured output
        )

        raw_content = response.choices[0].message.content.strip()

        # Extract JSON from response (handle cases where model wraps in markdown)
        json_match = re.search(r'\{.*\}', raw_content, re.DOTALL)
        if json_match:
            raw_content = json_match.group(0)

        analysis = json.loads(raw_content)

        # Validate and clamp scores to 0-10 range
        for score_field in ["grammar_score", "structure_score", "professional_tone_score"]:
            if score_field in analysis:
                analysis[score_field] = max(0, min(10, int(analysis[score_field])))

        # Ensure required fields exist with defaults
        analysis.setdefault("filler_words", [])
        analysis.setdefault("star_method_detected", False)
        analysis.setdefault("improvement_suggestions", ["Focus on clear structure.", "Reduce filler words.", "Use professional vocabulary."])
        analysis.setdefault("rewritten_professional_answer", transcript)

        return analysis

    except json.JSONDecodeError as e:
        print(f"[Groq] JSON parse error: {e}\nRaw: {raw_content}")
        # Return a safe fallback
        return _fallback_analysis(transcript)

    except Exception as e:
        print(f"[Groq] Analysis failed: {e}")
        return _fallback_analysis(transcript)


def _fallback_analysis(transcript: str) -> dict:
    """
    Returns a safe fallback analysis when the Groq API fails.
    Provides basic heuristic analysis.
    """
    # Simple heuristic: detect common filler words
    filler_patterns = ["um", "uh", "basically", "you know", "like", "actually", "so", "acha", "matlab", "toh"]
    words_lower = transcript.lower().split()
    found_fillers = [f for f in filler_patterns if f in words_lower]

    return {
        "grammar_score": 6,
        "structure_score": 5,
        "professional_tone_score": 6,
        "filler_words": found_fillers,
        "star_method_detected": False,
        "improvement_suggestions": [
            "Try to structure your answer with a clear beginning, middle, and end.",
            "Reduce filler words like 'um', 'basically', or 'you know'.",
            "Use the STAR method: Situation, Task, Action, Result.",
            "Practice speaking slowly and confidently.",
            "Focus on using professional vocabulary appropriate for interviews."
        ],
        "rewritten_professional_answer": f"[Auto-rewrite unavailable] Original response: {transcript}"
    }
