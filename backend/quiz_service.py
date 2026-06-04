"""Build MCQ quizzes and grade answers."""

from __future__ import annotations

import json
import random
import uuid
from datetime import datetime, timedelta, timezone
from typing import Any

from models import connect

QUIZ_SIZE = 20
MIN_VOCAB_FOR_QUIZ = 4
SESSION_TTL_HOURS = 24

QUESTION_TYPES = ("hanzi_meaning", "hanzi_pinyin", "meaning_hanzi")


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


def _expires_at() -> str:
    return (_utcnow() + timedelta(hours=SESSION_TTL_HOURS)).isoformat()


def _load_vocab_rows(hsk_level: int) -> list[dict[str, Any]]:
    conn = connect()
    rows = conn.execute(
        """
        SELECT id, hanzi, pinyin, meaning FROM vocabulary
        WHERE hsk_level = ?
        """,
        (hsk_level,),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def _load_review_vocab_rows(hsk_level: int, user_id: str) -> list[dict[str, Any]]:
    """Distinct vocabulary rows that appear in the review queue for this HSK level."""
    conn = connect()
    rows = conn.execute(
        """
        SELECT DISTINCT v.id, v.hanzi, v.pinyin, v.meaning
        FROM vocabulary v
        INNER JOIN review_items r ON r.vocab_id = v.id
        WHERE v.hsk_level = ? AND r.user_id = ?
        """,
        (hsk_level, user_id),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def get_vocab_by_id(vocab_id: int) -> dict[str, Any] | None:
    conn = connect()
    row = conn.execute(
        """
        SELECT id, hanzi, pinyin, meaning FROM vocabulary WHERE id = ?
        """,
        (vocab_id,),
    ).fetchone()
    conn.close()
    return dict(row) if row else None


def _pick_distractors(
    pool: list[dict[str, Any]],
    correct: dict[str, Any],
    key: str,
    n: int,
) -> list[str]:
    others = [r for r in pool if r["id"] != correct["id"]]
    random.shuffle(others)
    out: list[str] = []
    for r in others:
        val = (r[key] or "").strip()
        if val and val not in out:
            out.append(val)
        if len(out) >= n:
            break
    while len(out) < n and others:
        pick = random.choice(others)
        val = (pick[key] or "").strip()
        out.append(val)
    return out[:n]


def build_quiz_payload(
    hsk_level: int, source: str = "all", user_id: str = "legacy"
) -> tuple[list[dict[str, Any]], str | None]:
    """
    Returns (questions_with_secrets, error_message).
    Each question: vocab_id, question_type, prompt, choices, correct_index (server-only).

    source:
      - "all": random words from the full level pool
      - "review": only words currently in the review queue (distractors still from full pool)
    """
    full_pool = _load_vocab_rows(hsk_level)
    if len(full_pool) < MIN_VOCAB_FOR_QUIZ:
        return [], f"Need at least {MIN_VOCAB_FOR_QUIZ} vocabulary rows for this level."

    if source == "review":
        pool = _load_review_vocab_rows(hsk_level, user_id)
        if not pool:
            return [], "Review list is empty. Miss some questions in a regular quiz first."
        distractor_pool = full_pool
    else:
        pool = full_pool
        distractor_pool = full_pool

    n = min(QUIZ_SIZE, len(pool))
    picked = random.sample(pool, n)
    questions: list[dict[str, Any]] = []

    for row in picked:
        qtype = random.choice(QUESTION_TYPES)
        if qtype == "hanzi_meaning":
            prompt = row["hanzi"]
            correct_text = row["meaning"].strip()
            wrong = _pick_distractors(distractor_pool, row, "meaning", 3)
            choices = [correct_text] + wrong
        elif qtype == "hanzi_pinyin":
            prompt = row["hanzi"]
            correct_text = row["pinyin"].strip()
            wrong = _pick_distractors(distractor_pool, row, "pinyin", 3)
            choices = [correct_text] + wrong
        else:  # meaning_hanzi
            prompt = row["meaning"].strip()
            correct_text = row["hanzi"].strip()
            wrong = _pick_distractors(distractor_pool, row, "hanzi", 3)
            choices = [correct_text] + wrong

        random.shuffle(choices)
        correct_index = choices.index(correct_text)

        questions.append(
            {
                "vocab_id": row["id"],
                "question_type": qtype,
                "prompt": prompt,
                "choices": choices,
                "correct_index": correct_index,
            }
        )

    return questions, None


def strip_secrets(questions: list[dict[str, Any]]) -> list[dict[str, Any]]:
    out = []
    for i, q in enumerate(questions):
        out.append(
            {
                "question_index": i,
                "question_type": q["question_type"],
                "prompt": q["prompt"],
                "choices": q["choices"],
            }
        )
    return out


def save_session(hsk_level: int, questions: list[dict[str, Any]], user_id: str) -> str:
    session_id = str(uuid.uuid4())
    payload = {"questions": questions, "user_id": user_id}
    conn = connect()
    conn.execute(
        """
        INSERT INTO quiz_sessions (id, hsk_level, payload_json, expires_at)
        VALUES (?, ?, ?, ?)
        """,
        (session_id, hsk_level, json.dumps(payload), _expires_at()),
    )
    conn.commit()
    conn.close()
    return session_id


def load_session(session_id: str) -> dict[str, Any] | None:
    conn = connect()
    row = conn.execute(
        """
        SELECT payload_json, expires_at FROM quiz_sessions WHERE id = ?
        """,
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
    return data


def record_wrong_answer(vocab_id: int, question_type: str, user_id: str) -> None:
    conn = connect()
    conn.execute(
        """
        INSERT INTO review_items (user_id, vocab_id, question_type)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id, vocab_id, question_type) DO UPDATE SET
            created_at = datetime('now')
        """,
        (user_id, vocab_id, question_type),
    )
    conn.commit()
    conn.close()


def grade_answer(
    session_id: str, question_index: int, selected_index: int
) -> tuple[bool, int | None, dict[str, Any] | None, str | None]:
    data = load_session(session_id)
    if not data:
        return False, None, None, "invalid_or_expired_session"
    questions = data["questions"]
    if question_index < 0 or question_index >= len(questions):
        return False, None, None, "bad_question_index"
    q = questions[question_index]
    correct = q["correct_index"] == selected_index
    if not correct:
        record_wrong_answer(q["vocab_id"], q["question_type"], data.get("user_id", "legacy"))
    vocab = get_vocab_by_id(q["vocab_id"])
    vocab_out = None
    if vocab:
        vocab_out = {
            "hanzi": vocab["hanzi"],
            "pinyin": vocab["pinyin"],
            "meaning": vocab["meaning"],
        }
    return correct, q["correct_index"], vocab_out, None


def fetch_review(hsk_level: int | None, user_id: str) -> list[dict[str, Any]]:
    conn = connect()
    if hsk_level is None:
        rows = conn.execute(
            """
            SELECT MAX(r.id) AS review_id, MAX(r.created_at) AS created_at,
                   v.id AS vocab_id, v.hsk_level, v.hanzi, v.pinyin, v.meaning
            FROM review_items r
            JOIN vocabulary v ON v.id = r.vocab_id
            WHERE r.user_id = ?
            GROUP BY v.id, v.hsk_level, v.hanzi, v.pinyin, v.meaning
            ORDER BY v.hsk_level, created_at DESC
            """,
            (user_id,),
        ).fetchall()
    else:
        rows = conn.execute(
            """
            SELECT MAX(r.id) AS review_id, MAX(r.created_at) AS created_at,
                   v.id AS vocab_id, v.hsk_level, v.hanzi, v.pinyin, v.meaning
            FROM review_items r
            JOIN vocabulary v ON v.id = r.vocab_id
            WHERE v.hsk_level = ? AND r.user_id = ?
            GROUP BY v.id, v.hsk_level, v.hanzi, v.pinyin, v.meaning
            ORDER BY created_at DESC
            """,
            (hsk_level, user_id),
        ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


def clear_review(hsk_level: int | None, user_id: str) -> int:
    conn = connect()
    if hsk_level is None:
        cur = conn.execute("DELETE FROM review_items WHERE user_id = ?", (user_id,))
    else:
        cur = conn.execute(
            """
            DELETE FROM review_items WHERE user_id = ? AND vocab_id IN (
                SELECT id FROM vocabulary WHERE hsk_level = ?
            )
            """,
            (user_id, hsk_level),
        )
    n = cur.rowcount
    conn.commit()
    conn.close()
    return n
