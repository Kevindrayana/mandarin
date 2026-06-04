import { Link } from 'react-router-dom'

type Props = {
  /** `null` while the review count is still loading. */
  count: number | null
}

export function ReviewMistakesSection({ count }: Props) {
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
        <Link to="/review" className="review-cta">
          Go to review ({count} word{count === 1 ? '' : 's'})
        </Link>
      )}
    </section>
  )
}
