import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ReviewMistakesSection } from '../components/ReviewMistakesSection'
import { fetchReview } from '../api'

const levels = [1, 2, 3, 4, 5, 6] as const

export function QuizHome() {
  const [reviewCount, setReviewCount] = useState<number | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const data = await fetchReview()
        if (!cancelled) setReviewCount(data.items.length)
      } catch {
        if (!cancelled) setReviewCount(0)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="page home">
      <h1 className="page-title">Quiz</h1>
      <p className="lede">
        Pick an HSK level, then answer 20 multiple-choice questions: Hanzi to meaning, Hanzi
        to pinyin, or meaning to Hanzi. Keys <kbd className="kbd">1</kbd>–
        <kbd className="kbd">4</kbd> select answers.
      </p>

      <h2 className="section-title">HSK level</h2>
      <div className="level-grid">
        {levels.map((lv) => (
          <Link
            key={lv}
            to="/quiz"
            state={{ mode: 'all' as const, hskLevel: lv }}
            className="level-card level-card--active"
          >
            <span className="level-num">HSK {lv}</span>
            <span className="level-note">Start quiz</span>
          </Link>
        ))}
      </div>

      <ReviewMistakesSection count={reviewCount} />
    </div>
  )
}
