import { Link } from "react-router-dom";
import { parts, topics } from "../data/topics";
import { diagrams } from "../diagrams";
import { useProgress } from "./useProgress";

const BlackBox = diagrams.blackBox;

export default function Home() {
  const { done, isDone } = useProgress();
  const pct = Math.round((done.filter((d) => topics.some((t) => t.slug === d)).length / topics.length) * 100);

  return (
    <div className="page">
      <header className="hero">
        <div className="hero-badge">A VISUAL ROADMAP</div>
        <h1>
          How Hedge Funds <span className="accent">Actually</span> Work
        </h1>
        <p className="hero-sub">
          A step-by-step guide to quantitative trading and the hedge fund industry — from your first
          long/short portfolio to high-frequency trading — built on the five-module framework of{" "}
          <em>Inside the Black Box</em> by Rishi K. Narang.
        </p>
        <div className="hero-diagram">
          <BlackBox />
          <p className="hero-diagram-caption">
            Every quant trading system, whatever its speed or style, decomposes into these five modules
            resting on data and research. This roadmap opens each box, one at a time.
          </p>
        </div>
        {pct > 0 && (
          <div className="progress-bar-wrap" aria-label={`Progress: ${pct}%`}>
            <div className="progress-bar" style={{ width: `${pct}%` }} />
            <span className="progress-label">{pct}% complete</span>
          </div>
        )}
      </header>

      <main className="roadmap">
        <div className="spine" aria-hidden="true" />
        {parts.map((part) => (
          <section key={part.number} className="part">
            <div className="part-header">
              <div className="part-number">Part {part.number}</div>
              <h2 className="part-title">{part.title}</h2>
              <p className="part-desc">{part.description}</p>
            </div>
            <ol className="part-topics">
              {topics
                .filter((t) => t.part === part.number)
                .map((t) => (
                  <li key={t.slug}>
                    <Link
                      to={`/topic/${t.slug}`}
                      className={`node ${isDone(t.slug) ? "node-done" : ""}`}
                    >
                      {t.moduleNumber && <span className="node-module">module {t.moduleNumber} of 5</span>}
                      <span className="node-title">
                        {isDone(t.slug) && <span className="tick" aria-label="completed">✓</span>}
                        {t.title}
                      </span>
                      <span className="node-tagline">{t.tagline}</span>
                    </Link>
                  </li>
                ))}
            </ol>
          </section>
        ))}
      </main>

      <footer className="footer">
        <p>
          Inspired by and structured after <em>Inside the Black Box: A Simple Guide to Quantitative and
          High-Frequency Trading</em> (2nd ed.), Rishi K. Narang, Wiley 2013. This site is an independent
          educational summary — read the book for the full treatment.
        </p>
      </footer>
    </div>
  );
}
