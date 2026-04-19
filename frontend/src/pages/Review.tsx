import { useCallback, useEffect, useState } from 'react'
import { ReviewMistakesSection } from '../components/ReviewMistakesSection'
import { clearReview, fetchReview, type ReviewItem } from '../api'

const HSK = 3

export function Review() {
  const [items, setItems] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clearing, setClearing] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchReview(HSK)
      setItems(data.items)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load review list')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  async function onClear() {
    if (!items.length) return
    setClearing(true)
    setError(null)
    try {
      await clearReview(HSK)
      setItems([])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not clear list')
    } finally {
      setClearing(false)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p className="muted">Loading review…</p>
      </div>
    )
  }

  return (
    <div className="page review">
      <div className="review-head">
        <h1 className="page-title">Review</h1>
        <p className="lede">
          Words and question types from recent mistakes (HSK {HSK}). Study them and run
          another quiz.
        </p>
      </div>

      <ReviewMistakesSection count={items.length} hskLevel={HSK} />

      <div className="review-toolbar">
        <button
          type="button"
          className="btn danger"
          onClick={() => void onClear()}
          disabled={!items.length || clearing}
        >
          {clearing ? 'Clearing…' : 'Clear review list'}
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {!items.length ? (
        <p className="muted empty-hint">Nothing to review yet. Miss a few questions in the quiz and they will show up here.</p>
      ) : (
        <div className="table-wrap">
          <table className="review-table">
            <thead>
              <tr>
                <th>Hanzi</th>
                <th>Pinyin</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.review_id}>
                  <td lang="zh-Hans">{r.hanzi}</td>
                  <td>{r.pinyin}</td>
                  <td>{r.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
