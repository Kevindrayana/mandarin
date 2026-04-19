import type { CSSProperties } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { Navigate, useBeforeUnload, useLocation, useNavigate } from 'react-router-dom'
import {
  startQuiz,
  submitAnswer,
  type QuizQuestion,
  type QuizSource,
  type VocabCard,
} from '../api'
import { IconChevronRight, IconResults } from '../components/icons'

export type QuizLocationState = {
  mode: QuizSource
  hskLevel: number
}

function typeLabel(t: QuizQuestion['question_type']) {
  switch (t) {
    case 'hanzi_meaning':
      return 'Choose the English meaning'
    case 'hanzi_pinyin':
      return 'Choose the pinyin'
    case 'meaning_hanzi':
      return 'Choose the Chinese word'
    default:
      return ''
  }
}

export function Quiz() {
  const location = useLocation()
  const navigate = useNavigate()
  const [quizParams] = useState<QuizLocationState | null>(() => {
    const s = location.state as QuizLocationState | null
    if (!s || (s.mode !== 'all' && s.mode !== 'review')) return null
    if (typeof s.hskLevel !== 'number' || s.hskLevel < 1) return null
    return s
  })

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<{
    correct: boolean
    correct_index: number
    vocab: VocabCard | null
  } | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [animatedPercent, setAnimatedPercent] = useState(0)
  const total = questions.length
  const scoreMeterStyle = {
    ['--score-percent']: `${animatedPercent}%`,
  } as CSSProperties

  const shouldWarnOnLeave = !!sessionId && !done && questions.length > 0
  const scorePercent = total > 0 ? Math.round((score / total) * 100) : 0

  const load = useCallback(async () => {
    if (!quizParams) return
    setLoading(true)
    setError(null)
    setFeedback(null)
    setSelected(null)
    setIndex(0)
    setScore(0)
    setDone(false)
    setAnimatedPercent(0)
    try {
      const data = await startQuiz(quizParams.hskLevel, quizParams.mode)
      setSessionId(data.session_id)
      setQuestions(data.questions)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start quiz')
    } finally {
      setLoading(false)
    }
  }, [quizParams])

  useEffect(() => {
    void load()
  }, [load])

  const q = questions[index]

  useBeforeUnload(
    useCallback(
      (event) => {
        if (!shouldWarnOnLeave) return
        event.preventDefault()
        event.returnValue = ''
      },
      [shouldWarnOnLeave],
    ),
  )

  useEffect(() => {
    if (!shouldWarnOnLeave) return

    function onDocumentClick(event: MouseEvent) {
      if (event.defaultPrevented) return
      const target = event.target
      if (!(target instanceof Element)) return

      const link = target.closest('a')
      if (!(link instanceof HTMLAnchorElement)) return
      if (link.target && link.target !== '_self') return
      if (link.hasAttribute('download')) return

      const href = link.getAttribute('href')
      if (!href || href.startsWith('#')) return

      const nextUrl = new URL(link.href, window.location.href)
      const currentUrl = new URL(window.location.href)
      const isSamePage =
        nextUrl.pathname === currentUrl.pathname &&
        nextUrl.search === currentUrl.search &&
        nextUrl.hash === currentUrl.hash
      if (isSamePage) return
      if (nextUrl.origin !== currentUrl.origin) return

      const confirmed = window.confirm(
        'Are you sure you want to quit this quiz? Your progress will be lost.',
      )
      if (!confirmed) {
        event.preventDefault()
        return
      }

      event.preventDefault()
      navigate(`${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`)
    }

    document.addEventListener('click', onDocumentClick, true)
    return () => document.removeEventListener('click', onDocumentClick, true)
  }, [navigate, shouldWarnOnLeave])

  useEffect(() => {
    if (!done) {
      setAnimatedPercent(0)
      return
    }
    let frame = 0
    let start = 0
    const duration = 900
    const tick = (timestamp: number) => {
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - (1 - progress) * (1 - progress)
      setAnimatedPercent(Math.round(scorePercent * eased))
      if (progress < 1) frame = window.requestAnimationFrame(tick)
    }
    frame = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(frame)
  }, [done, scorePercent])

  const onChoose = useCallback(
    async (choiceIndex: number) => {
      if (!sessionId || !q || feedback) return
      setSelected(choiceIndex)
      try {
        const res = await submitAnswer(sessionId, q.question_index, choiceIndex)
        setFeedback({
          correct: res.correct,
          correct_index: res.correct_index,
          vocab: res.vocab,
        })
        if (res.correct) setScore((s) => s + 1)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not submit answer')
      }
    },
    [sessionId, q, feedback],
  )

  const next = useCallback(() => {
    if (index + 1 >= total) {
      setDone(true)
      return
    }
    setIndex((i) => i + 1)
    setSelected(null)
    setFeedback(null)
  }, [index, total])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const t = e.target as HTMLElement | null
      if (
        t &&
        (t.tagName === 'INPUT' ||
          t.tagName === 'TEXTAREA' ||
          t.isContentEditable)
      ) {
        return
      }

      if (feedback) {
        if (e.key === 'Enter') {
          e.preventDefault()
          next()
        }
        return
      }

      if (!q) return
      if (e.key < '1' || e.key > '4') return
      const idx = Number(e.key) - 1
      if (idx >= q.choices.length) return
      e.preventDefault()
      void onChoose(idx)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [feedback, q, onChoose, next])

  if (!quizParams) {
    return <Navigate to="/" replace />
  }

  if (loading) {
    return (
      <div className="page">
        <p className="muted">Loading quiz…</p>
      </div>
    )
  }

  if (error && !sessionId) {
    return (
      <div className="page">
        <p className="error-msg">{error}</p>
        <button type="button" className="btn primary" onClick={() => void load()}>
          Retry
        </button>
      </div>
    )
  }

  if (done) {
    return (
      <div className="page quiz-done">
        <h1 className="page-title">Quiz complete</h1>
        <p className="score-line">
          You got <strong>{score}</strong> out of <strong>{total}</strong> correct.
        </p>
        <div
          className="score-meter"
          style={scoreMeterStyle}
          aria-label={`Score ${scorePercent} out of 100`}
        >
          <div className="score-meter-ring">
            <div className="score-meter-inner">
              <strong>{animatedPercent}</strong>
              <span>/ 100</span>
            </div>
          </div>
        </div>
        <button type="button" className="btn primary" onClick={() => void load()}>
          Try again
        </button>
      </div>
    )
  }

  if (!q) {
    return (
      <div className="page">
        <p className="muted">No questions available.</p>
        <button type="button" className="btn" onClick={() => void load()}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="page quiz">
      <div className="quiz-meta">
        <span className="progress">
          {index + 1} / {total}
        </span>
        <span className="task">{typeLabel(q.question_type)}</span>
      </div>

      <div className="prompt-block">
        <p className="prompt-label">Question</p>
        <p className="prompt" lang="zh-Hans">
          {q.prompt}
        </p>
      </div>

      <ul className="choices" role="list">
        {q.choices.map((c, i) => {
          const isSel = selected === i
          const show =
            feedback &&
            (i === feedback.correct_index || (isSel && !feedback.correct))
          const wrongPick = feedback && isSel && !feedback.correct
          return (
            <li key={i}>
              <button
                type="button"
                className={`choice${show ? ' choice--revealed' : ''}${wrongPick ? ' choice--wrong' : ''}${feedback && i === feedback.correct_index ? ' choice--correct' : ''}`}
                onClick={() => void onChoose(i)}
                disabled={!!feedback}
                lang={q.question_type === 'meaning_hanzi' ? 'zh-Hans' : undefined}
              >
                <span className="choice-key">{i + 1}</span>
                <span className="choice-text">{c}</span>
              </button>
            </li>
          )
        })}
      </ul>

      {feedback && (
        <div className="feedback-block">
          <p className={feedback.correct ? 'ok' : 'bad'}>
            {feedback.correct ? 'Correct.' : 'Incorrect.'}
          </p>
          {feedback.vocab && (
            <div className="answer-card" lang="zh-Hans">
              <p className="answer-card-label">Answer</p>
              <p className="answer-hanzi">{feedback.vocab.hanzi}</p>
              <p className="answer-pinyin">{feedback.vocab.pinyin}</p>
              <p className="answer-meaning">{feedback.vocab.meaning}</p>
            </div>
          )}
          <button type="button" className="btn primary btn-with-icon" onClick={next}>
            {index + 1 >= total ? (
              <IconResults className="btn-icon" />
            ) : (
              <IconChevronRight className="btn-icon" />
            )}
            <span>{index + 1 >= total ? 'See results' : 'Next'}</span>
          </button>
        </div>
      )}

      {error && <p className="error-msg">{error}</p>}
    </div>
  )
}
