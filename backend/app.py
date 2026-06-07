"""Flask API for HSK vocabulary quiz."""

from __future__ import annotations

import os
import sys
from pathlib import Path

_BACKEND = Path(__file__).resolve().parent
if str(_BACKEND) not in sys.path:
    sys.path.insert(0, str(_BACKEND))

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

from models import connect, init_schema
from quiz_service import (
    build_quiz_payload,
    clear_review,
    fetch_review,
    grade_answer,
    save_session,
    strip_secrets,
)
from sd_service import (
    get_topics_with_progress,
    grade_sd_answer,
    save_sd_progress,
    start_sd_quiz,
)


def _review_user_id() -> str:
    return (request.headers.get("X-Review-User") or "legacy").strip() or "legacy"


def create_app() -> Flask:
    static_folder = Path(__file__).resolve().parents[1] / "frontend" / "dist"
    app = Flask(__name__, static_folder=str(static_folder), static_url_path="")
    origins = os.environ.get(
        "CORS_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    CORS(app, resources={r"/api/*": {"origins": [o.strip() for o in origins if o.strip()]}})

    @app.route("/api/health")
    def health():
        return jsonify({"ok": True})

    @app.route("/api/quiz/start", methods=["POST"])
    def quiz_start():
        body = request.get_json(silent=True) or {}
        hsk_level = int(body.get("hsk_level", 3))
        source = (body.get("source") or "all").strip().lower()
        user_id = _review_user_id()
        if source not in ("all", "review"):
            return jsonify({"error": 'source must be "all" or "review"'}), 400
        questions, err = build_quiz_payload(hsk_level, source=source, user_id=user_id)
        if err:
            return jsonify({"error": err}), 400
        session_id = save_session(hsk_level, questions, user_id)
        return jsonify(
            {
                "session_id": session_id,
                "hsk_level": hsk_level,
                "source": source,
                "questions": strip_secrets(questions),
            }
        )

    @app.route("/api/quiz/answer", methods=["POST"])
    def quiz_answer():
        body = request.get_json(silent=True) or {}
        session_id = body.get("session_id")
        question_index = body.get("question_index")
        selected_index = body.get("selected_index")
        if session_id is None or question_index is None or selected_index is None:
            return jsonify({"error": "session_id, question_index, selected_index required"}), 400
        try:
            qi = int(question_index)
            si = int(selected_index)
        except (TypeError, ValueError):
            return jsonify({"error": "invalid indices"}), 400
        correct, correct_index, vocab, err = grade_answer(session_id, qi, si)
        if err == "invalid_or_expired_session":
            return jsonify({"error": err}), 410
        if err == "bad_question_index":
            return jsonify({"error": err}), 400
        return jsonify(
            {
                "correct": correct,
                "correct_index": correct_index,
                "vocab": vocab,
            }
        )

    @app.route("/api/review", methods=["GET"])
    def review_get():
        hsk = request.args.get("hsk_level", type=int)
        rows = fetch_review(hsk, _review_user_id())
        return jsonify({"items": rows})

    @app.route("/api/review", methods=["DELETE"])
    def review_delete():
        hsk = request.args.get("hsk_level", type=int)
        n = clear_review(hsk, _review_user_id())
        return jsonify({"deleted": n})

    # ── System Design (DDIA) routes ──────────────────────────────────────────

    @app.route("/api/sd/topics", methods=["GET"])
    def sd_topics():
        topics = get_topics_with_progress(_review_user_id())
        return jsonify({"topics": topics})

    @app.route("/api/sd/quiz/start", methods=["POST"])
    def sd_quiz_start():
        body = request.get_json(silent=True) or {}
        slug = (body.get("topic_slug") or "").strip()
        if not slug:
            return jsonify({"error": "topic_slug required"}), 400
        data, err = start_sd_quiz(slug, _review_user_id())
        if err:
            return jsonify({"error": err}), 400 if err == "Topic not found" else 404
        return jsonify(data)

    @app.route("/api/sd/quiz/answer", methods=["POST"])
    def sd_quiz_answer():
        body = request.get_json(silent=True) or {}
        session_id = body.get("session_id")
        question_index = body.get("question_index")
        selected_index = body.get("selected_index")
        if session_id is None or question_index is None or selected_index is None:
            return jsonify({"error": "session_id, question_index, selected_index required"}), 400
        try:
            qi = int(question_index)
            si = int(selected_index)
        except (TypeError, ValueError):
            return jsonify({"error": "invalid indices"}), 400
        correct, correct_index, explanation, err = grade_sd_answer(session_id, qi, si)
        if err == "invalid_or_expired_session":
            return jsonify({"error": err}), 410
        if err == "bad_question_index":
            return jsonify({"error": err}), 400
        return jsonify({"correct": correct, "correct_index": correct_index, "explanation": explanation})

    @app.route("/api/sd/quiz/complete", methods=["POST"])
    def sd_quiz_complete():
        body = request.get_json(silent=True) or {}
        session_id = body.get("session_id")
        score = body.get("score")
        total = body.get("total")
        if session_id is None or score is None or total is None:
            return jsonify({"error": "session_id, score, total required"}), 400
        save_sd_progress(session_id, int(score), int(total), _review_user_id())
        return jsonify({"ok": True})

    conn = connect()
    init_schema(conn)
    conn.close()

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def spa_index(path):
        index = Path(app.static_folder) / "index.html"
        if index.exists():
            return send_from_directory(app.static_folder, "index.html")
        return jsonify({"error": "Frontend not built"}), 404

    return app


def init_db_command():
    conn = connect()
    init_schema(conn)
    conn.close()


app = create_app()


if __name__ == "__main__":
    init_db_command()
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=False)
