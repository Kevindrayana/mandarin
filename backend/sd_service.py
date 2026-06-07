"""System design quiz service (DDIA roadmap)."""

from __future__ import annotations

import json
import random
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from models import connect

SD_QUIZ_SIZE = 5
SESSION_TTL_HOURS = 24


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _expires_at() -> str:
    return (_utcnow() + timedelta(hours=SESSION_TTL_HOURS)).isoformat()


def get_topics_with_progress(user_id: str) -> list[dict[str, Any]]:
    conn = connect()
    rows = conn.execute(
        """
        SELECT t.id, t.slug, t.title, t.description, t.chapter_num,
               t.part_num, t.position_order, t.prerequisites,
               COALESCE(p.score, 0) AS score,
               COALESCE(p.total, 0) AS total,
               COALESCE(p.completed, 0) AS completed,
               p.last_attempted,
               (SELECT COUNT(*) FROM sd_questions q WHERE q.topic_id = t.id) AS question_count
        FROM sd_topics t
        LEFT JOIN sd_progress p ON p.topic_id = t.id AND p.user_id = ?
        ORDER BY t.part_num, t.position_order
        """,
        (user_id,),
    ).fetchall()
    conn.close()
    result = []
    for r in rows:
        d = dict(r)
        d["completed"] = bool(d["completed"])
        result.append(d)
    return result


def get_topic_by_slug(slug: str) -> dict[str, Any] | None:
    conn = connect()
    row = conn.execute("SELECT * FROM sd_topics WHERE slug = ?", (slug,)).fetchone()
    conn.close()
    return dict(row) if row else None


def start_sd_quiz(topic_slug: str, user_id: str) -> tuple[dict[str, Any] | None, str | None]:
    topic = get_topic_by_slug(topic_slug)
    if not topic:
        return None, "Topic not found"

    conn = connect()
    questions_raw = conn.execute(
        "SELECT id, prompt, explanation FROM sd_questions WHERE topic_id = ?",
        (topic["id"],),
    ).fetchall()

    if not questions_raw:
        conn.close()
        return None, "No questions available for this topic"

    all_q = [dict(q) for q in questions_raw]
    for q in all_q:
        choices = conn.execute(
            "SELECT id, text, is_correct FROM sd_choices WHERE question_id = ?",
            (q["id"],),
        ).fetchall()
        q["choices"] = [dict(c) for c in choices]
    conn.close()

    n = min(SD_QUIZ_SIZE, len(all_q))
    picked = random.sample(all_q, n)

    quiz_questions: list[dict[str, Any]] = []
    for q in picked:
        shuffled = q["choices"][:]
        random.shuffle(shuffled)
        correct_index = next(i for i, c in enumerate(shuffled) if c["is_correct"])
        quiz_questions.append(
            {
                "question_id": q["id"],
                "prompt": q["prompt"],
                "explanation": q["explanation"],
                "choices": [c["text"] for c in shuffled],
                "correct_index": correct_index,
            }
        )

    session_id = str(uuid.uuid4())
    payload = {
        "type": "sd",
        "topic_id": topic["id"],
        "topic_slug": topic_slug,
        "user_id": user_id,
        "questions": quiz_questions,
    }

    conn = connect()
    conn.execute(
        "INSERT INTO quiz_sessions (id, hsk_level, payload_json, expires_at) VALUES (?, 0, ?, ?)",
        (session_id, json.dumps(payload), _expires_at()),
    )
    conn.commit()
    conn.close()

    client_questions = [
        {"question_index": i, "prompt": q["prompt"], "choices": q["choices"]}
        for i, q in enumerate(quiz_questions)
    ]

    return {
        "session_id": session_id,
        "topic_slug": topic_slug,
        "topic_title": topic["title"],
        "questions": client_questions,
    }, None


def _load_sd_session(session_id: str) -> dict[str, Any] | None:
    conn = connect()
    row = conn.execute(
        "SELECT payload_json, expires_at FROM quiz_sessions WHERE id = ?",
        (session_id,),
    ).fetchone()
    conn.close()
    if not row:
        return None
    expires = datetime.fromisoformat(row["expires_at"])
    if expires.tzinfo is None:
        expires = expires.replace(tzinfo=timezone.utc)
    if _utcnow() > expires:
        return None
    data = json.loads(row["payload_json"])
    if data.get("type") != "sd":
        return None
    return data


def grade_sd_answer(
    session_id: str, question_index: int, selected_index: int
) -> tuple[bool, int | None, str | None, str | None]:
    """Returns (correct, correct_index, explanation, error)."""
    data = _load_sd_session(session_id)
    if not data:
        return False, None, None, "invalid_or_expired_session"

    questions = data["questions"]
    if question_index < 0 or question_index >= len(questions):
        return False, None, None, "bad_question_index"

    q = questions[question_index]
    correct = q["correct_index"] == selected_index
    return correct, q["correct_index"], q.get("explanation", ""), None


def save_sd_progress(session_id: str, score: int, total: int, user_id: str) -> None:
    data = _load_sd_session(session_id)
    if not data:
        return

    topic_id = data.get("topic_id")
    if not topic_id:
        return

    completed = 1 if total > 0 and score >= total * 0.8 else 0

    conn = connect()
    conn.execute(
        """
        INSERT INTO sd_progress (user_id, topic_id, score, total, completed, last_attempted)
        VALUES (?, ?, ?, ?, ?, datetime('now'))
        ON CONFLICT(user_id, topic_id) DO UPDATE SET
            score = excluded.score,
            total = excluded.total,
            completed = MAX(completed, excluded.completed),
            last_attempted = datetime('now')
        """,
        (user_id, topic_id, score, total, completed),
    )
    conn.commit()
    conn.close()
