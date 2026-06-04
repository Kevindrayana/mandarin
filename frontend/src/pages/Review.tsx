import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { clearReview, fetchReview, type ReviewItem } from '../api'

type GroupedItems = Map<number, ReviewItem[]>

function groupByLevel(items: ReviewItem[]): GroupedItems {
  const map: GroupedItems = new Map()
  for (const item of items) {
    const group = map.get(item.hsk_level) ?? []
    group.push(item)
    map.set(item.hsk_level, group)
  }
  return map
}

export function Review() {
  const [items, setItems] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clearing, setClearing] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchReview()
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
      await clearReview()
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

  const grouped = groupByLevel(items)
  const levels = Array.from(grouped.keys()).sort((a, b) => a - b)

  return (
    <div className="page review">
      <div className="review-head">
        <h1 className="page-title">Review</h1>
        <p className="lede">
          Words from recent mistakes across all HSK levels. Study them and run another quiz.
        </p>
      </div>

      {levels.length > 0 && (
        <section className="review-mistakes-section" aria-labelledby="review-quiz-heading">
          <h2 id="review-quiz-heading" className="section-title">Quiz from mistakes</h2>
          <div className="level-grid">
            {levels.map((lv) => {
              const count = grouped.get(lv)!.length
              return (
                <Link
                  key={lv}
                  to="/quiz"
                  state={{ mode: 'review' as const, hskLevel: lv }}
                  className="level-card level-card--active"
                >
                  <span className="level-num">HSK {lv}</span>
                  <span className="level-note">{count} word{count === 1 ? '' : 's'}</span>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      <div className="review-toolbar">
        <button
          type="button"
          className="btn danger"
          onClick={() => void onClear()}
          disabled={!items.length || clearing}
        >
          {clearing ? 'Clearing…' : 'Clear all mistakes'}
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
                <th>HSK</th>
                <th>Hanzi</th>
                <th>Pinyin</th>
                <th>Meaning</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r) => (
                <tr key={r.review_id}>
                  <td>{r.hsk_level}</td>
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
