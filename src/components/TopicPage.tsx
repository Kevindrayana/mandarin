import { Link, useParams } from "react-router-dom";
import { getTopic, parts, topicIndex, topics } from "../data/topics";
import { diagrams } from "../diagrams";
import { useProgress } from "./useProgress";

export default function TopicPage() {
  const { slug = "" } = useParams();
  const topic = getTopic(slug);
  const { isDone, toggle } = useProgress();

  if (!topic) {
    return (
      <div className="page">
        <main className="topic">
          <h1>Topic not found</h1>
          <Link to="/" className="btn">← Back to the roadmap</Link>
        </main>
      </div>
    );
  }

  const idx = topicIndex(slug);
  const prev = idx > 0 ? topics[idx - 1] : null;
  const next = idx < topics.length - 1 ? topics[idx + 1] : null;
  const part = parts.find((p) => p.number === topic.part)!;
  const Diagram = diagrams[topic.diagram];
  const done = isDone(slug);

  return (
    <div className="page">
      <main className="topic">
        <nav className="crumbs">
          <Link to="/">Roadmap</Link>
          <span> / </span>
          <span>Part {part.number} — {part.title}</span>
        </nav>

        <div className="topic-badges">
          <span className="badge badge-part">Part {topic.part}</span>
          {topic.moduleNumber && <span className="badge badge-module">Black box module {topic.moduleNumber}/5</span>}
          <span className="badge badge-chapter">{topic.chapterRef}</span>
        </div>

        <h1>{topic.title}</h1>
        <p className="tagline">{topic.tagline}</p>

        {Diagram && (
          <figure className="diagram-card">
            <Diagram />
          </figure>
        )}

        {topic.sections.map((s) => (
          <section key={s.heading} className="topic-section">
            <h2>{s.heading}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        ))}

        <aside className="takeaways">
          <h2>Key takeaways</h2>
          <ul>
            {topic.takeaways.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </aside>

        <section className="references">
          <h2>References & further reading</h2>
          <ul>
            {topic.references.map((r, i) => (
              <li key={i}>
                {r.url ? (
                  <a href={r.url} target="_blank" rel="noreferrer">{r.label}</a>
                ) : (
                  <span className="ref-label">{r.label}</span>
                )}
                <span className="ref-source"> — {r.source}</span>
              </li>
            ))}
          </ul>
        </section>

        <button className={`done-btn ${done ? "done-btn-active" : ""}`} onClick={() => toggle(slug)}>
          {done ? "✓ Completed — click to undo" : "Mark as done"}
        </button>

        <nav className="pager">
          {prev ? (
            <Link to={`/topic/${prev.slug}`} className="pager-link">
              <span className="pager-dir">← Previous</span>
              <span>{prev.title}</span>
            </Link>
          ) : (
            <Link to="/" className="pager-link">
              <span className="pager-dir">← Back</span>
              <span>The Roadmap</span>
            </Link>
          )}
          {next ? (
            <Link to={`/topic/${next.slug}`} className="pager-link pager-next">
              <span className="pager-dir">Next →</span>
              <span>{next.title}</span>
            </Link>
          ) : (
            <Link to="/" className="pager-link pager-next">
              <span className="pager-dir">Finish →</span>
              <span>Back to the Roadmap</span>
            </Link>
          )}
        </nav>
      </main>
    </div>
  );
}
