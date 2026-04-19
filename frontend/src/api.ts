const base =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://127.0.0.1:5000'
const REVIEW_USER_STORAGE_KEY = 'mandarin-review-user-id'

function getReviewUserId() {
  if (typeof window === 'undefined') return 'legacy'
  const existing = window.sessionStorage.getItem(REVIEW_USER_STORAGE_KEY)
  if (existing) return existing
  const next =
    typeof window.crypto?.randomUUID === 'function'
      ? window.crypto.randomUUID()
      : `review-${Date.now()}-${Math.random().toString(16).slice(2)}`
  window.sessionStorage.setItem(REVIEW_USER_STORAGE_KEY, next)
  return next
}

function withReviewUser(headers?: HeadersInit) {
  return {
    ...(headers ?? {}),
    'X-Review-User': getReviewUserId(),
  }
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text()
  let data: unknown
  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    throw new Error(`Invalid JSON (${res.status})`)
  }
  if (!res.ok) {
    const err = (data as { error?: string })?.error ?? res.statusText
    throw new Error(err)
  }
  return data as T
}

export type QuestionType = 'hanzi_meaning' | 'hanzi_pinyin' | 'meaning_hanzi'

export type QuizSource = 'all' | 'review'

export interface QuizQuestion {
  question_index: number
  question_type: QuestionType
  prompt: string
  choices: string[]
}

export interface VocabCard {
  hanzi: string
  pinyin: string
  meaning: string
}

export async function startQuiz(hskLevel: number, source: QuizSource = 'all') {
  const res = await fetch(`${base}/api/quiz/start`, {
    method: 'POST',
    headers: withReviewUser({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ hsk_level: hskLevel, source }),
  })
  return parseJson<{
    session_id: string
    hsk_level: number
    source: QuizSource
    questions: QuizQuestion[]
  }>(res)
}

export async function submitAnswer(
  sessionId: string,
  questionIndex: number,
  selectedIndex: number,
) {
  const res = await fetch(`${base}/api/quiz/answer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sessionId,
      question_index: questionIndex,
      selected_index: selectedIndex,
    }),
  })
  return parseJson<{
    correct: boolean
    correct_index: number
    vocab: VocabCard | null
  }>(res)
}

export interface ReviewItem {
  review_id: number
  vocab_id: number
  hanzi: string
  pinyin: string
  meaning: string
}

export async function fetchReview(hskLevel?: number) {
  const q = hskLevel != null ? `?hsk_level=${hskLevel}` : ''
  const res = await fetch(`${base}/api/review${q}`, {
    headers: withReviewUser(),
  })
  return parseJson<{ items: ReviewItem[] }>(res)
}

export async function clearReview(hskLevel?: number) {
  const q = hskLevel != null ? `?hsk_level=${hskLevel}` : ''
  const res = await fetch(`${base}/api/review${q}`, {
    method: 'DELETE',
    headers: withReviewUser(),
  })
  return parseJson<{ deleted: number }>(res)
}
