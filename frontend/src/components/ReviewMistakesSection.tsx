import { Link } from 'react-router-dom'

const DEFAULT_HSK = 3

type Props = {
  /** `null` while the review count is still loading (Quiz home only). */
  count: number | null
  hskLevel?: number
}

export function ReviewMistakesSection({ count, hskLevel = DEFAULT_HSK }: Props) {
  return (
    <section className="review-mistakes-section" aria-labelledby="review-mistakes-heading">
      <h2 id="review-mistakes-heading" className="section-title">
        Review mistakes
      </h2>
      <p className="lede small">
        Practice only words you have missed (same question types). Fewer than 20 questions if
        your review list is short.
      </p>
      {count === null ? (
        <p className="muted">Checking review list…</p>
      ) : count === 0 ? (
        <p className="muted">No review items yet. Complete a quiz and miss a few questions.</p>
      ) : (
        <Link
          to="/quiz"
          state={{ mode: 'review' as const, hskLevel }}
          className="review-cta"
        >
          Quiz from review ({count} word{count === 1 ? '' : 's'})
        </Link>
      )}
    </section>
  )
}
