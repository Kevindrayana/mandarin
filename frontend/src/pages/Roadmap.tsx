import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchSDTopics, type SDTopic } from '../api'

const PARTS: Record<number, { label: string; color: string }> = {
  1: { label: 'Part I — Foundations', color: 'part-1' },
  2: { label: 'Part II — Distributed Data', color: 'part-2' },
  3: { label: 'Part III — Derived Data', color: 'part-3' },
}

function statusClass(topic: SDTopic): string {
  if (topic.completed) return 'topic-card--done'
  if (topic.total > 0) return 'topic-card--started'
  return ''
}

function StatusBadge({ topic }: { topic: SDTopic }) {
  if (topic.completed) {
    return (
      <span className="status-badge status-badge--done">
        ✓ {topic.score}/{topic.total}
      </span>
    )
  }
  if (topic.total > 0) {
    return (
      <span className="status-badge status-badge--started">
        {topic.score}/{topic.total}
      </span>
    )
  }
  return <span className="status-badge status-badge--new">New</span>
}

export function Roadmap() {
  const [topics, setTopics] = useState<SDTopic[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchSDTopics()
      .then((d) => {
        if (!cancelled) setTopics(d.topics)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to load topics')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const byPart = (part: number) => topics.filter((t) => t.part_num === part)
  const totalCompleted = topics.filter((t) => t.completed).length
  const totalTopics = topics.length

  if (loading) {
    return (
      <div className="page roadmap">
        <div className="loading-state">Loading roadmap…</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page roadmap">
        <p className="error-msg">{error}</p>
      </div>
    )
  }

  return (
    <div className="page roadmap">
      <div className="roadmap-header">
        <h1 className="page-title">DDIA Roadmap</h1>
        <p className="lede">
          Master system design through{' '}
          <em>Designing Data-Intensive Applications</em> by Martin Kleppmann.
          Each node is a chapter quiz — 5 questions, scored immediately.
        </p>
        {totalTopics > 0 && (
          <div className="progress-summary">
            <div className="progress-bar-track">
              <div
                className="progress-bar-fill"
                style={{ width: `${(totalCompleted / totalTopics) * 100}%` }}
              />
            </div>
            <span className="progress-label">
              {totalCompleted} / {totalTopics} chapters completed
            </span>
          </div>
        )}
      </div>

      {[1, 2, 3].map((part) => {
        const partTopics = byPart(part)
        if (!partTopics.length) return null
        const meta = PARTS[part]
        return (
          <section key={part} className={`roadmap-section roadmap-section--${meta.color}`}>
            <h2 className="section-title roadmap-section-title">{meta.label}</h2>
            <div className="topic-list">
              {partTopics.map((topic, idx) => (
                <div key={topic.slug}>
                  <Link
                    to={`/roadmap/quiz/${topic.slug}`}
                    className={`topic-card ${statusClass(topic)}`}
                  >
                    <div className="topic-card-left">
                      <span className="chapter-badge">Ch. {topic.chapter_num}</span>
                      <div className="topic-card-text">
                        <span className="topic-title">{topic.title}</span>
                        <span className="topic-desc">{topic.description}</span>
                      </div>
                    </div>
                    <div className="topic-card-right">
                      <StatusBadge topic={topic} />
                      <span className="topic-cta">
                        {topic.completed ? 'Retake' : topic.total > 0 ? 'Retake' : 'Start →'}
                      </span>
                    </div>
                  </Link>
                  {idx < partTopics.length - 1 && (
                    <div className="topic-connector" aria-hidden="true">↓</div>
                  )}
                </div>
              ))}
            </div>
            {part < 3 && <div className="part-connector" aria-hidden="true">↓</div>}
          </section>
        )
      })}
    </div>
  )
}
