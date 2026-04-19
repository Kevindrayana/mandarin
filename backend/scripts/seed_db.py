#!/usr/bin/env python3
"""Load curated vocabulary CSVs from data/ into SQLite."""

import csv
import sys
from pathlib import Path
from typing import List, Optional

# Allow running as script: python backend/scripts/seed_db.py
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from models import connect, init_schema  # noqa: E402


def default_seed_root() -> Path:
    return ROOT / "data"

def infer_hsk_level(csv_path: Path) -> Optional[int]:
    folder = csv_path.parent.name.lower()
    if folder.startswith("hsk") and folder[3:].isdigit():
        return int(folder[3:])
    return None

def iter_seed_files(path: Path) -> List[Path]:
    if path.is_file():
        return [path]
    return sorted(path.glob("hsk*/vocabulary.csv"))


def seed_from_csv(csv_path: Path, default_hsk_level: Optional[int] = None) -> int:
    if not csv_path.is_file():
        raise FileNotFoundError(f"Seed file not found: {csv_path}")

    conn = connect()
    init_schema(conn)
    count = 0
    with csv_path.open(encoding="utf-8", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            row_hsk = (row.get("hsk_level") or "").strip()
            hsk_level = int(row_hsk) if row_hsk else default_hsk_level or infer_hsk_level(csv_path)
            hanzi = (row.get("hanzi") or "").strip()
            pinyin = (row.get("pinyin") or "").strip()
            meaning = (row.get("meaning") or "").strip()
            if hsk_level is None or not hanzi or not pinyin or not meaning:
                continue
            conn.execute(
                """
                INSERT INTO vocabulary (hsk_level, hanzi, pinyin, meaning)
                VALUES (?, ?, ?, ?)
                ON CONFLICT(hsk_level, hanzi) DO UPDATE SET
                    pinyin = excluded.pinyin,
                    meaning = excluded.meaning
                """,
                (hsk_level, hanzi, pinyin, meaning),
            )
            count += 1
    conn.commit()
    conn.close()
    return count


def main() -> None:
    path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else default_seed_root()
    files = iter_seed_files(path)
    if not files:
        raise FileNotFoundError(f"No vocabulary.csv files found under: {path}")

    total = 0
    for csv_path in files:
        n = seed_from_csv(csv_path)
        total += n
        print(f"Upserted {n} vocabulary rows from {csv_path}")
    print(f"Total upserted rows: {total}")


if __name__ == "__main__":
    main()
