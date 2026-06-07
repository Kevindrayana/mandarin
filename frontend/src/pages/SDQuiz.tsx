import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  completeSDQuiz,
  startSDQuiz,
  submitSDAnswer,
  type SDQuestion,
} from '../api'

type Feedback = {
  correct: boolean
  correct_index: number
  explanation: string
}

export function SDQuiz() {
  const { slug } = useParams<{ slug: string }>()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [topicTitle, setTopicTitle] = useState('')
  const [questions, setQuestions] = useState<SDQuestion[]>([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const progressSaved = useRef(false)

  const total = questions.length
  const q = questions[index]

  const load = useCallback(async () => {
    if (!slug) return
    setLoading(true)
    setError(null)
    setIndex(0)
    setScore(0)
    setDone(false)
    setSelected(null)
    setFeedback(null)
    progressSaved.current = false
    try {
      const data = await startSDQuiz(slug)
      setSessionId(data.session_id)
      setTopicTitle(data.topic_title)
      setQuestions(data.questions)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to start quiz')
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    void load()
  }, [load])

  // Save progress once when quiz completes
  useEffect(() => {
    if (!done || progressSaved.current || !sessionId) return
    progressSaved.current = true
    void completeSDQuiz(sessionId, score, total)
  }, [done, sessionId, score, total])

  // Keyboard: 1-4 select, Enter / Space advance
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const num = parseInt(e.key)
      if (!isNaN(num) && num >= 1 && num <= 4 && !feedback && q) {
        void handleSelect(num - 1)
      }
      if ((e.key === 'Enter' || e.key === ' ') && feedback) {
        advance()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  async function handleSelect(idx: number) {
    if (!sessionId || selected !== null || !q) return
    setSelected(idx)
    try {
      const res = await submitSDAnswer(sessionId, q.question_index, idx)
      setFeedback({
        correct: res.correct,
        correct_index: res.correct_index,
        explanation: res.explanation,
      })
      if (res.correct) setScore((s) => s + 1)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error submitting answer')
    }
  }

  function advance() {
    if (index + 1 >= total) {
      setDone(true)
    } else {
      setIndex((i) => i + 1)
      setSelected(null)
      setFeedback(null)
    }
  }

  if (loading) {
    return (
      <div className="page sd-quiz">
        <div className="loading-state">Loading quiz…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page sd-quiz">
        <p className="error-msg">{error}</p>
        <Link to="/roadmap" className="btn btn--secondary">
          ← Back to roadmap
        </Link>
      </div>
    )
  }

  if (done) {
    const pct = total > 0 ? Math.round((score / total) * 100) : 0
    const passed = pct >= 80
    return (
      <div className="page sd-quiz">
        <div className="quiz-results">
          <div className={`results-icon ${passed ? 'results-icon--pass' : 'results-icon--fail'}`}>
            {passed ? '✓' : '✗'}
          </div>
          <h2 className="results-title">{topicTitle}</h2>
          <p className="results-score">
            {score} / {total} correct &mdash; {pct}%
          </p>
          {passed ? (
            <p className="results-msg results-msg--pass">Chapter complete!</p>
          ) : (
            <p className="results-msg results-msg--fail">
              Score 80% or higher to mark this chapter complete.
            </p>
          )}
          <div className="results-actions">
            <button className="btn btn--primary" onClick={load}>
              Retake quiz
            </button>
            <Link to="/roadmap" className="btn btn--secondary">
              ← Roadmap
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (!q) return null

  return (
    <div className="page sd-quiz">
      <div className="sd-quiz-header">
        <Link to="/roadmap" className="back-link">
          ← Roadmap
        </Link>
        <span className="sd-quiz-topic">{topicTitle}</span>
        <span className="sd-quiz-counter">
          {index + 1} / {total}
        </span>
      </div>

      <div className="quiz-progress-track">
        <div
          className="quiz-progress-fill"
          style={{ width: `${((index) / total) * 100}%` }}
        />
      </div>

      <div className="sd-question-card">
        <p className="sd-question-prompt">{q.prompt}</p>

        <ol className="sd-choices" type="A">
          {q.choices.map((choice, i) => {
            let cls = 'sd-choice'
            if (feedback) {
              if (i === feedback.correct_index) cls += ' sd-choice--correct'
              else if (i === selected) cls += ' sd-choice--wrong'
            } else if (i === selected) {
              cls += ' sd-choice--selected'
            }
            return (
              <li key={i}>
                <button
                  className={cls}
                  disabled={!!feedback}
                  onClick={() => void handleSelect(i)}
                >
                  <span className="choice-key">{i + 1}</span>
                  {choice}
                </button>
              </li>
            )
          })}
        </ol>

        {feedback && (
          <div className={`sd-explanation ${feedback.correct ? 'sd-explanation--correct' : 'sd-explanation--wrong'}`}>
            <p className="sd-explanation-verdict">
              {feedback.correct ? '✓ Correct' : '✗ Incorrect'}
            </p>
            {feedback.explanation && (
              <p className="sd-explanation-text">{feedback.explanation}</p>
            )}
            <button className="btn btn--primary sd-next-btn" onClick={advance}>
              {index + 1 >= total ? 'See results' : 'Next →'}
              <span className="kbd-hint">(Enter)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
