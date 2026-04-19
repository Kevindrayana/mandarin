#!/usr/bin/env python3
"""
Build data/hsk3/vocabulary.csv from open sources (network required):
- Hanzi + pinyin: ivankra/hsk30 hsk30-expanded.csv (Level == 3)
- English: clem109/hsk-vocabulary hsk-level-1..6.json (first translation), then CC-CEDICT (MDBG) fallback

Run from repo root: python3 backend/scripts/generate_hsk3_seed.py
"""

from __future__ import annotations

import csv
import gzip
import io
import json
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "data" / "hsk3" / "vocabulary.csv"

IVANKRA = "https://raw.githubusercontent.com/ivankra/hsk30/master/hsk30-expanded.csv"
CLEM_BASE = "https://raw.githubusercontent.com/clem109/hsk-vocabulary/master/hsk-vocab-json/hsk-level-{}.json"
CEDICT_GZ = "https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.txt.gz"


def fetch_text(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "mandarin-quiz-seed/1.0"})
    with urllib.request.urlopen(req, timeout=120) as r:
        return r.read().decode("utf-8")


def fetch_bytes(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "mandarin-quiz-seed/1.0"})
    with urllib.request.urlopen(req, timeout=300) as r:
        return r.read()


def load_clem_glosses() -> dict[str, str]:
    out: dict[str, str] = {}
    for lv in range(1, 7):
        url = CLEM_BASE.format(lv)
        data = json.loads(fetch_text(url))
        for w in data:
            h = w.get("hanzi", "").strip()
            if not h or h in out:
                continue
            tr = w.get("translations")
            if isinstance(tr, list) and tr:
                gloss = tr[0].strip()
            else:
                gloss = str(tr).strip()
            if gloss:
                out[h] = gloss
    return out


_LINE_RE = re.compile(r"^(\S+)\s+(\S+)\s+\[([^\]]+)\]\s+/(.*)/\s*$")


def load_cedict_map() -> dict[str, str]:
    raw = fetch_bytes(CEDICT_GZ)
    text = gzip.decompress(raw).decode("utf-8", errors="replace")
    mp: dict[str, str] = {}
    for line in text.splitlines():
        if not line or line.startswith("#"):
            continue
        m = _LINE_RE.match(line)
        if not m:
            continue
        simp = m.group(2)
        defs = m.group(4).split("/")
        gloss = defs[0].strip() if defs else ""
        if simp and simp not in mp and gloss:
            mp[simp] = gloss
    return mp


def main() -> None:
    clem = load_clem_glosses()
    print(f"Clem glosses: {len(clem)}", file=sys.stderr)
    cedict = load_cedict_map()
    print(f"CC-CEDICT entries: {len(cedict)}", file=sys.stderr)

    text = fetch_text(IVANKRA)
    f = io.StringIO(text)
    rows = [r for r in csv.DictReader(f) if r.get("Level") == "3"]
    print(f"ivankra Level 3: {len(rows)}", file=sys.stderr)

    seen: set[str] = set()
    out_rows: list[tuple[str, str, str]] = []
    for r in rows:
        hz = (r.get("Simplified") or "").strip()
        py = (r.get("Pinyin") or "").strip()
        if not hz or not py:
            continue
        if hz in seen:
            continue
        seen.add(hz)
        meaning = clem.get(hz) or cedict.get(hz) or ""
        if not meaning:
            meaning = "(add English gloss)"
        meaning = meaning.replace("\n", " ").strip()
        out_rows.append((hz, py, meaning))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    with OUT.open("w", encoding="utf-8", newline="") as fp:
        w = csv.writer(fp)
        w.writerow(["hsk_level", "hanzi", "pinyin", "meaning"])
        for hz, py, meaning in out_rows:
            w.writerow([3, hz, py, meaning])

    print(f"Wrote {len(out_rows)} rows to {OUT}", file=sys.stderr)


if __name__ == "__main__":
    main()
