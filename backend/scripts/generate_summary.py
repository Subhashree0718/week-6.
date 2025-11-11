# #!/usr/bin/env python3
# """Generate an OKR summary using Gemini via Python, with local fallbacks."""

# import json
# import os
# import sys
# from datetime import datetime

# PLACEHOLDER_KEY_HINTS = {
#     "your-gemini-api-key",
#     "your-openai-api-key",
#     "replace-me",
#     "example-key",
# }


# def read_payload():
#     raw = sys.stdin.read()
#     if not raw.strip():
#         return {}
#     return json.loads(raw)


# def is_usable_key(key: str | None) -> bool:
#     if not key:
#         return False
#     normalized = key.strip().lower()
#     if any(hint in normalized for hint in PLACEHOLDER_KEY_HINTS):
#         return False
#     return len(key.strip()) >= 20


# def format_date(value):
#     if not value:
#         return "N/A"
#     try:
#         return datetime.fromisoformat(value.replace("Z", "+00:00")).strftime("%Y-%m-%d")
#     except Exception:
#         try:
#             return value.split("T")[0]
#         except Exception:
#             return str(value)


# def build_prompt(updates, objective):
#     updates_text = ""
#     if updates:
#         lines = []
#         for index, update in enumerate(updates, start=1):
#             created_at = format_date(update.get("createdAt"))
#             content = update.get("content") or "No content provided."
#             progress = update.get("progress")
#             if progress is None:
#                 progress_str = "N/A"
#             else:
#                 progress_str = f"{progress}%"
#             blockers = update.get("blockers") or "None"
#             user = update.get("user") or {}
#             author = user.get("name") or user.get("email") or "Unknown member"
#             lines.append(
#                 f"Update {index} ({created_at}):\n"
#                 f"- Content: {content}\n"
#                 f"- Progress: {progress_str}\n"
#                 f"- Blockers: {blockers}\n"
#                 f"- By: {author}\n"
#             )
#         updates_text = "\n".join(lines)

#     key_results_text = ""
#     if objective:
#         key_results = objective.get("keyResults") or []
#         if key_results:
#             parts = ["Key Results:"]
#             for index, kr in enumerate(key_results, start=1):
#                 target = kr.get("target")
#                 current = kr.get("current")
#                 unit = kr.get("unit") or ""
#                 progress = 0
#                 if target and target not in (0, "0", "0.0"):
#                     try:
#                         progress = int(round((float(current or 0) / float(target)) * 100))
#                     except Exception:
#                         progress = 0
#                 parts.append(
#                     f"{index}. {kr.get('title', 'Untitled KR')}\n"
#                     f"   - Target: {target} {unit}\n"
#                     f"   - Current: {current} {unit}\n"
#                     f"   - Progress: {progress}%"
#                 )
#             key_results_text = "\n".join(parts)

#     objective_context = ""
#     if objective:
#         title = objective.get("title", "Untitled Objective")
#         progress = objective.get("progress", "N/A")
#         status = objective.get("status", "Unknown")
#         start_date = format_date(objective.get("startDate"))
#         end_date = format_date(objective.get("endDate"))
#         objective_context = (
#             f"Objective: {title}\n"
#             f"Overall Progress: {progress}%\n"
#             f"Status: {status}\n"
#             f"Timeline: {start_date} - {end_date}\n"
#         )

#     return updates_text, key_results_text, objective_context


# def fallback_summary(updates, objective, reason=None):
#     sections = []
#     if reason:
#         sections.append(reason)

#     if objective:
#         title = objective.get("title", "Untitled Objective")
#         status = objective.get("status", "Unknown")
#         progress = objective.get("progress", "N/A")
#         start_date = format_date(objective.get("startDate"))
#         end_date = format_date(objective.get("endDate"))
#         sections.append(
#             "\n".join(
#                 [
#                     f"Objective: {title}",
#                     f"Status: {status}",
#                     f"Overall Progress: {progress}%",
#                     f"Timeline: {start_date} - {end_date}",
#                 ]
#             )
#         )

#     key_results = (objective or {}).get("keyResults") or []
#     if key_results:
#         kr_lines = []
#         for index, kr in enumerate(key_results, start=1):
#             target = kr.get("target") or 0
#             current = kr.get("current") or 0
#             unit = kr.get("unit") or ""
#             progress = 0
#             try:
#                 target_val = float(target)
#                 if target_val > 0:
#                     progress = int(round((float(current) / target_val) * 100))
#             except Exception:
#                 progress = 0
#             kr_lines.append(f"{index}. {kr.get('title', 'Untitled KR')} — {progress}% towards {target} {unit}")
#         sections.append("Key Results Snapshot:\n" + "\n".join(kr_lines))

#     if updates:
#         sorted_updates = sorted(
#             updates,
#             key=lambda item: item.get("createdAt") or "",
#             reverse=True,
#         )
#         latest = sorted_updates[0]
#         author_info = latest.get("user") or {}
#         latest_author = author_info.get("name") or author_info.get("email") or "Unknown member"
#         latest_date = format_date(latest.get("createdAt"))
#         sections.append(
#             f"Most Recent Update ({latest_date} by {latest_author}):\n{latest.get('content') or 'No content provided.'}"
#         )

#         progress_updates = [
#             update for update in sorted_updates if isinstance(update.get("progress"), (int, float))
#         ]
#         if progress_updates:
#             latest_progress = progress_updates[0].get("progress", 0)
#             avg_progress = int(
#                 round(
#                     sum(update.get("progress", 0) for update in progress_updates)
#                     / len(progress_updates)
#                 )
#             )
#             sections.append(
#                 "Progress signals: latest reported progress is "
#                 f"{latest_progress}%, with an average of {avg_progress}% across "
#                 f"{len(progress_updates)} update{'s' if len(progress_updates) > 1 else ''}."
#             )

#         blockers = {
#             (update.get("blockers") or "").strip()
#             for update in sorted_updates
#             if (update.get("blockers") or "").strip()
#         }
#         if blockers:
#             sections.append("Blockers to watch:\n" + "\n".join(f"- {blocker}" for blocker in blockers))
#     else:
#         sections.append(
#             "No progress updates have been logged yet. Encourage the team to share updates "
#             "to enrich future summaries."
#         )

#     return "\n\n".join(sections)


# def main():
#     try:
#         payload = read_payload()
#     except Exception as exc:
#         summary = fallback_summary([], None, f"Summary generated locally because input payload was invalid. {exc}")
#         print(json.dumps({"summary": summary}))
#         return 0

#     updates = payload.get("updates") or []
#     objective = payload.get("objective")

#     updates_text, key_results_text, objective_context = build_prompt(updates, objective)
#     if not any([updates_text.strip(), key_results_text.strip(), objective_context.strip()]):
#         print(
#             json.dumps(
#                 {
#                     "summary": "No data available for summary generation. Please add key results or progress updates to generate insights.",
#                 }
#             )
#         )
#         return 0

#     api_key = os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")
#     if not is_usable_key(api_key):
#         summary = fallback_summary(
#             updates,
#             objective,
#             "Summary generated using available data because the AI service is not configured.",
#         )
#         print(json.dumps({"summary": summary}))
#         return 0

#     try:
#         import google.generativeai as genai

#         genai.configure(api_key=api_key)
#         model = genai.GenerativeModel("gemini-pro")
#         prompt = (
#             "You are an AI assistant helping teams track their OKRs (Objectives and Key Results).\n\n"
#             f"{objective_context}\n\n"
#             f"{'Recent Updates:\n' + updates_text if updates_text else ''}\n\n"
#             f"{key_results_text}\n\n"
#             "Based on the above information, provide a concise summary that includes:\n"
#             "1. Overall progress and current status\n"
#             "2. Key highlights and achievements (based on key results progress)\n"
#             "3. Potential blockers or areas needing attention\n"
#             "4. Recommended next steps to achieve the objective\n\n"
#             "Please provide a professional, actionable summary in 3-4 paragraphs."
#         )
#         response = model.generate_content(prompt)
#         text_response = getattr(response, "text", None)
#         if callable(text_response):
#             text_response = text_response()
#         if not text_response:
#             raise ValueError("Empty response from Gemini model")
#         print(json.dumps({"summary": text_response}))
#     except Exception as exc:
#         summary = fallback_summary(
#             updates,
#             objective,
#             "Summary generated using available data because the AI service is currently unavailable.",
#         )
#         print(json.dumps({"summary": summary, "error": str(exc)}))

#     return 0


# if __name__ == "__main__":
#     sys.exit(main())

#!/usr/bin/env python3
"""AI OKR Summarizer using Gemini (self-contained, no .env needed)."""

import json
import sys
from datetime import datetime

# --- 🔑 Explicit Gemini API key (directly embedded here) ---
GEMINI_API_KEY = "AIzaSyC2BjCOYY-Fx0Ghbf2GP4-uEgEG7tI6AAY"

# --- Utility functions --------------------------------------------------------

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

# --- Main AI summarization ----------------------------------------------------

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

    # Build a structured prompt
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

# --- Entrypoint ---------------------------------------------------------------

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
