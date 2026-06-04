#!/usr/bin/env python3
"""Build textbook-aligned HSK 1-6 vocabulary CSVs from the 2012 official lists."""

from __future__ import annotations

import csv
import io
import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DATA_ROOT = ROOT / "data"
SOURCE_URL = (
    "https://raw.githubusercontent.com/glxxyz/hskhsk.com/main/data/lists/"
    "HSK%20Official%20With%20Definitions%202012%20L{level}.txt"
)


def fetch_text(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "mandarin-hsk-seed/1.0"})
    with urllib.request.urlopen(req, timeout=120) as response:
        return response.read().decode("utf-8-sig")


def normalize_meaning(text: str) -> str:
    text = re.sub(r"\([^)]*Kangxi radical[^)]*\)", "", text)
    text = text.replace("|", ";")
    text = " ".join(text.replace("\r", " ").replace("\n", " ").split())
    parts = [part.strip(" .,;") for part in text.split(";")]
    parts = [part for part in parts if part]
    deduped: list[str] = []
    seen: set[str] = set()
    for part in parts:
        lowered = part.lower()
        if lowered in seen:
            continue
        seen.add(lowered)
        deduped.append(part)
    return "; ".join(deduped[:3])


def rows_for_level(level: int) -> list[tuple[int, str, str, str]]:
    text = fetch_text(SOURCE_URL.format(level=level))
    reader = csv.reader(io.StringIO(text), delimiter="\t")
    rows: list[tuple[int, str, str, str]] = []
    seen: set[str] = set()
    for fields in reader:
        if len(fields) < 5:
            continue
        hanzi, _traditional, _numeric_pinyin, pinyin, meaning = (field.strip() for field in fields[:5])
        if not hanzi or not pinyin or not meaning or hanzi in seen:
            continue
        seen.add(hanzi)
        rows.append((level, hanzi, pinyin, normalize_meaning(meaning)))
    return rows


def write_level(level: int, rows: list[tuple[int, str, str, str]]) -> None:
    out = DATA_ROOT / f"hsk{level}" / "vocabulary.csv"
    out.parent.mkdir(parents=True, exist_ok=True)
    with out.open("w", encoding="utf-8", newline="") as fp:
        writer = csv.writer(fp)
        writer.writerow(["hsk_level", "hanzi", "pinyin", "meaning"])
        writer.writerows(rows)


def main() -> None:
    for level in range(1, 7):
        rows = rows_for_level(level)
        write_level(level, rows)
        print(f"Wrote {len(rows)} rows to data/hsk{level}/vocabulary.csv")


if __name__ == "__main__":
    main()
