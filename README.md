# hedge-fund — How Hedge Funds Actually Work

An interactive, [roadmap.sh](https://roadmap.sh)-style educational website that explains how
quantitative hedge funds (including high-frequency trading) work, structured after
**_Inside the Black Box: A Simple Guide to Quantitative and High-Frequency Trading_ (2nd ed.)
by Rishi K. Narang** (Wiley, 2013).

## Concept

The site walks the reader linearly through five parts, mirroring the book's progression and
centered on its famous five-module schematic (Exhibits 2.1 / 2.3):

1. **The Quant Universe** — what hedge funds are and a map of the "black box"
2. **Inside the Black Box** — the five modules: Alpha → Risk → Transaction Cost → Portfolio Construction → Execution
3. **The Foundation** — Data & Research
4. **A Practical Guide for Investors** — risks, criticisms, evaluating quant managers
5. **High-Speed Trading** — how HFT works and the controversy around it

Each topic page has a hand-built SVG diagram, a plain-language summary, key takeaways,
and references (book chapters + papers/further reading). Progress is tracked in
`localStorage`, roadmap.sh-style.

## Stack

- **Frontend:** React 18 + TypeScript + Vite, `react-router-dom` (hash routing, so it
  deploys to any static host without server config). No UI framework — custom CSS.
- **Backend:** none needed — the site is fully static. All content lives in
  `src/data/topics.ts`.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
```

## Project layout

```
src/
  data/topics.ts        # all content: parts, topics, sections, takeaways, references
  diagrams/index.tsx    # 12 hand-built SVG diagrams + shared Box/Arrow primitives
  components/
    Home.tsx            # hero + black-box diagram + the roadmap
    TopicPage.tsx       # diagram, summary, takeaways, references, prev/next
    useProgress.ts      # localStorage progress tracking
```

## Disclaimer

This is an independent educational summary inspired by Narang's book — not a substitute
for it, and not investment advice.
