# HSK vocabulary quiz

Flask + SQLite backend and React (Vite) frontend. The seed data is organized as `data/hsk1` through `data/hsk6`, using textbook-aligned old HSK (2012) vocabulary lists. The current frontend flow still focuses on HSK 3 practice, with multiple-choice questions (Hanzi → meaning, Hanzi → pinyin, meaning → Hanzi). Wrong answers are stored in SQLite for the Review tab. You can run a **review-only quiz** that draws only words currently in your mistake list.

## Prerequisites

- Python 3.10+
- Node.js 18+ (for the frontend)

## Setup

### 1. Backend

```bash
python3 -m pip install -r requirements.txt
python3 backend/scripts/seed_db.py
```

This creates `backend/instance/app.db` and loads vocabulary CSVs from `data/hsk*/vocabulary.csv`. Re-run the script any time you change a CSV. The seeder replaces each level's rows before inserting the fresh file, so old vocabulary does not linger in SQLite.

The bundled seeds are textbook-aligned old HSK (2012) lists:

- HSK 1: 150 rows
- HSK 2: 151 rows from the upstream source file
- HSK 3: 300 rows
- HSK 4: 600 rows
- HSK 5: 1300 rows
- HSK 6: 2500 rows

They are generated from the `HSK Official With Definitions 2012` source files in [glxxyz/hskhsk.com](https://github.com/glxxyz/hskhsk.com) via [`backend/scripts/generate_hsk_legacy_seeds.py`](backend/scripts/generate_hsk_legacy_seeds.py). Regenerating requires network access:

```bash
python3 backend/scripts/generate_hsk_legacy_seeds.py
```

### 2. Run the API

```bash
python3 backend/app.py
```

By default the server listens on `http://127.0.0.1:5000`. CORS allows `http://localhost:5173` and `http://127.0.0.1:5173`. Override with the `CORS_ORIGINS` environment variable (comma-separated list) if your dev URL differs.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

### API base URL

The React app calls the backend at `http://127.0.0.1:5000` by default. To change that, set `VITE_API_BASE_URL` in `frontend/.env` or `frontend/.env.local`, for example:

```bash
VITE_API_BASE_URL=http://127.0.0.1:5000
```

Restart `npm run dev` after changing env vars.

### Quiz API

- `POST /api/quiz/start` with `{ "hsk_level": 3, "source": "all" }` (default) uses the full vocabulary pool for that level.
- `POST /api/quiz/start` with `{ "hsk_level": 3, "source": "review" }` uses only words in the review queue (up to 20 questions; fewer if the review list is short). Returns `400` if the review list is empty.

### Production build (frontend)

```bash
cd frontend
npm run build
```

Serve the `frontend/dist` folder with any static host; configure it to proxy `/api` to the Flask app, or set `VITE_API_BASE_URL` to the public API URL at build time.

## Project layout

- [`data/hsk1/`](data/hsk1/) … [`data/hsk6/`](data/hsk6/) — per-level vocabulary directories.
- [`data/hsk3/vocabulary.csv`](data/hsk3/vocabulary.csv) — textbook-aligned HSK 3 vocabulary seed.
- [`backend/`](backend/) — Flask app, SQLite schema, quiz logic.
- [`frontend/`](frontend/) — React UI (Quiz landing with level + review modes, active quiz, Review list).
