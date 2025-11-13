
"""AI OKR Summarizer using Gemini (self-contained, no .env needed)."""

import json
import sys
from datetime import datetime

GEMINI_API_KEY = "AIzaSyC2BjCOYY-Fx0Ghbf2GP4-uEgEG7tI6AAY"


def read_payload():
    try:
        raw = sys.stdin.read()
        return json.loads(raw.strip() or "{}")
    except Exception:
        return {}

def format_date(value):
    if not value:
        return "N/A"
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00")).strftime("%Y-%m-%d")
    except Exception:
        return str(value).split("T")[0] if "T" in str(value) else str(value)

def fallback_summary(updates, objective, reason):
    sections = [reason]

    if objective:
        sections.append(
            f"Objective: {objective.get('title', 'Untitled')}\n"
            f"Status: {objective.get('status', 'Unknown')}\n"
            f"Progress: {objective.get('progress', 0)}%\n"
            f"Timeline: {format_date(objective.get('startDate'))} → {format_date(objective.get('endDate'))}"
        )

    key_results = (objective or {}).get("keyResults") or []
    if key_results:
        lines = []
        for i, kr in enumerate(key_results, start=1):
            t = kr.get("target") or 0
            c = kr.get("current") or 0
            u = kr.get("unit") or ""
            try:
                pct = round((float(c) / float(t)) * 100, 1) if float(t) > 0 else 0
            except Exception:
                pct = 0
            lines.append(f"{i}. {kr.get('title', 'KR')} — {pct}% of {t}{u}")
        sections.append("Key Results:\n" + "\n".join(lines))

    if updates:
        latest = sorted(updates, key=lambda x: x.get("createdAt", ""), reverse=True)[0]
        author = (latest.get("user") or {}).get("name") or "Unknown"
        date = format_date(latest.get("createdAt"))
        sections.append(f"Latest update ({date} by {author}): {latest.get('content','No content')}")

    return "\n\n".join(sections)


def generate_gemini_summary(payload):
    try:
        import google.generativeai as genai
    except ImportError:
        return {"summary": fallback_summary([], None, "google-generativeai not installed in container.")}

    if not GEMINI_API_KEY or len(GEMINI_API_KEY) < 20:
        return {"summary": fallback_summary([], None, "Gemini API key missing or invalid.")}

    genai.configure(api_key=GEMINI_API_KEY)

    updates = payload.get("updates") or []
    objective = payload.get("objective") or {}
    objective_title = objective.get("title", "Unnamed Objective")

    prompt = f"""
You are an OKR Assistant AI. Analyze the following information and write a clear, professional summary.

Objective: {objective_title}
Status: {objective.get('status')}
Progress: {objective.get('progress')}%
Start Date: {format_date(objective.get('startDate'))}
End Date: {format_date(objective.get('endDate'))}

Key Results:
{json.dumps(objective.get('keyResults') or [], indent=2)}

Recent Updates:
{json.dumps(updates or [], indent=2)}

Write a concise, insightful summary that includes:
- Overall progress & momentum
- Key achievements & challenges
- Blockers or delays
- Recommended next steps
Limit to 3–4 short paragraphs.
    """.strip()

    try:
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        text = getattr(response, "text", None)
        if callable(text):
            text = text()
        if not text:
            raise ValueError("Gemini returned empty response.")
        return {"summary": text}
    except Exception as e:
        return {"summary": fallback_summary(updates, objective, f"Gemini failed: {e}")}


def main():
    payload = read_payload()
    if not payload:
        print(json.dumps({"summary": "No data provided for AI summary."}))
        return

    result = generate_gemini_summary(payload)
    print(json.dumps(result, ensure_ascii=False))

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(json.dumps({"summary": f"AI summarizer crashed: {e}"}))
