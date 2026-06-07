"""SQLite schema and connection helpers."""

import sqlite3
from pathlib import Path


def get_db_path() -> Path:
    base = Path(__file__).resolve().parent
    instance = base / "instance"
    instance.mkdir(parents=True, exist_ok=True)
    return instance / "app.db"


def connect() -> sqlite3.Connection:
    conn = sqlite3.connect(get_db_path())
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def _review_items_has_user_id(conn: sqlite3.Connection) -> bool:
    rows = conn.execute("PRAGMA table_info(review_items)").fetchall()
    return any(row["name"] == "user_id" for row in rows)


def _create_review_items_table(conn: sqlite3.Connection) -> None:
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS review_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            vocab_id INTEGER NOT NULL REFERENCES vocabulary(id) ON DELETE CASCADE,
            question_type TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            UNIQUE (user_id, vocab_id, question_type)
        )
        """
    )
    conn.execute("CREATE INDEX IF NOT EXISTS idx_review_user ON review_items(user_id)")
    conn.execute("CREATE INDEX IF NOT EXISTS idx_review_vocab ON review_items(vocab_id)")


def _migrate_review_items_table(conn: sqlite3.Connection) -> None:
    if not conn.execute(
        """
        SELECT name FROM sqlite_master
        WHERE type = 'table' AND name = 'review_items'
        """
    ).fetchone():
        _create_review_items_table(conn)
        return

    if _review_items_has_user_id(conn):
        _create_review_items_table(conn)
        return

    conn.execute("ALTER TABLE review_items RENAME TO review_items_legacy")
    _create_review_items_table(conn)
    conn.execute(
        """
        INSERT INTO review_items (id, user_id, vocab_id, question_type, created_at)
        SELECT id, 'legacy', vocab_id, question_type, created_at
        FROM review_items_legacy
        """
    )
    conn.execute("DROP TABLE review_items_legacy")


def init_schema(conn: sqlite3.Connection) -> None:
    conn.executescript(
        """
        CREATE TABLE IF NOT EXISTS vocabulary (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            hsk_level INTEGER NOT NULL DEFAULT 3,
            hanzi TEXT NOT NULL,
            pinyin TEXT NOT NULL,
            meaning TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            UNIQUE (hsk_level, hanzi)
        );

        CREATE TABLE IF NOT EXISTS quiz_sessions (
            id TEXT PRIMARY KEY,
            hsk_level INTEGER NOT NULL,
            payload_json TEXT NOT NULL,
            created_at TEXT NOT NULL DEFAULT (datetime('now')),
            expires_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS sd_topics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug TEXT UNIQUE NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            chapter_num INTEGER NOT NULL,
            part_num INTEGER NOT NULL,
            position_order INTEGER NOT NULL,
            prerequisites TEXT DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS sd_questions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            topic_id INTEGER NOT NULL REFERENCES sd_topics(id) ON DELETE CASCADE,
            prompt TEXT NOT NULL,
            explanation TEXT NOT NULL DEFAULT ''
        );

        CREATE TABLE IF NOT EXISTS sd_choices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question_id INTEGER NOT NULL REFERENCES sd_questions(id) ON DELETE CASCADE,
            text TEXT NOT NULL,
            is_correct INTEGER NOT NULL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS sd_progress (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            topic_id INTEGER NOT NULL REFERENCES sd_topics(id) ON DELETE CASCADE,
            score INTEGER NOT NULL DEFAULT 0,
            total INTEGER NOT NULL DEFAULT 0,
            completed INTEGER NOT NULL DEFAULT 0,
            last_attempted TEXT DEFAULT (datetime('now')),
            UNIQUE(user_id, topic_id)
        );
        """
    )
    _migrate_review_items_table(conn)
    conn.commit()
