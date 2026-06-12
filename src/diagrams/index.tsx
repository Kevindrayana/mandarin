import { ReactNode } from "react";

/* ── Shared primitives ───────────────────────────────────────── */

const YELLOW = "#ffe620";
const INK = "#1a1a1a";
const BLUE = "#dbeafe";
const GREEN = "#dcfce7";
const RED = "#fee2e2";
const GREY = "#f3f4f6";

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  lines: string[];
  fill?: string;
  fontSize?: number;
  bold?: boolean;
  dashed?: boolean;
  rx?: number;
}

function Box({ x, y, w, h, lines, fill = YELLOW, fontSize = 13, bold = true, dashed = false, rx = 8 }: BoxProps) {
  const lineHeight = fontSize * 1.25;
  const startY = y + h / 2 - ((lines.length - 1) * lineHeight) / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        fill={fill}
        stroke={INK}
        strokeWidth={2}
        strokeDasharray={dashed ? "6 4" : undefined}
      />
      {lines.map((line, i) => (
        <text
          key={i}
          x={x + w / 2}
          y={startY + i * lineHeight}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={fontSize}
          fontWeight={bold && i === 0 ? 700 : 400}
          fill={INK}
        >
          {line}
        </text>
      ))}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, dashed = false }: { x1: number; y1: number; x2: number; y2: number; dashed?: boolean }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={INK}
      strokeWidth={2}
      strokeDasharray={dashed ? "5 4" : undefined}
      markerEnd="url(#arrowhead)"
    />
  );
}

function Label({ x, y, text, size = 12, anchor = "middle", italic = false }: { x: number; y: number; text: string; size?: number; anchor?: "middle" | "start" | "end"; italic?: boolean }) {
  return (
    <text x={x} y={y} textAnchor={anchor} fontSize={size} fill={INK} fontStyle={italic ? "italic" : undefined}>
      {text}
    </text>
  );
}

function Svg({ viewBox, title, children }: { viewBox: string; title: string; children: ReactNode }) {
  return (
    <svg viewBox={viewBox} role="img" aria-label={title} className="diagram-svg">
      <defs>
        <marker id="arrowhead" markerWidth="9" markerHeight="7" refX="8" refY="3.5" orient="auto">
          <polygon points="0 0, 9 3.5, 0 7" fill={INK} />
        </marker>
      </defs>
      {children}
    </svg>
  );
}

/* ── Exhibit 2.3 — The Black Box Revealed ────────────────────── */

function BlackBoxDiagram() {
  return (
    <Svg viewBox="0 0 760 420" title="The black box revealed: five modules on a foundation of data and research">
      {/* foundation columns */}
      <Box x={20} y={40} w={110} h={300} lines={["Data"]} fill={BLUE} fontSize={15} />
      <Box x={630} y={40} w={110} h={300} lines={["Research"]} fill={BLUE} fontSize={15} />
      {/* dashed black box boundary */}
      <rect x={150} y={20} width={460} height={340} rx={12} fill="none" stroke={INK} strokeWidth={2} strokeDasharray="8 6" />
      <Label x={380} y={44} text="THE BLACK BOX" size={13} />
      {/* three analysis modules */}
      <Box x={168} y={64} w={130} h={56} lines={["Alpha Model", "the optimist"]} fontSize={12} />
      <Box x={315} y={64} w={130} h={56} lines={["Risk Model", "the pessimist"]} fontSize={12} />
      <Box x={462} y={64} w={130} h={56} lines={["Transaction", "Cost Model"]} fontSize={12} />
      {/* arrows to portfolio construction */}
      <Arrow x1={233} y1={120} x2={330} y2={182} />
      <Arrow x1={380} y1={120} x2={380} y2={182} />
      <Arrow x1={527} y1={120} x2={430} y2={182} />
      <Box x={270} y={186} w={220} h={54} lines={["Portfolio Construction", "Model"]} fontSize={13} />
      <Arrow x1={380} y1={240} x2={380} y2={288} />
      <Label x={392} y={268} text="target portfolio − current = trades" size={11} anchor="start" italic />
      <Box x={290} y={292} w={180} h={50} lines={["Execution Model"]} fontSize={13} />
      {/* foundation arrows */}
      <Arrow x1={130} y1={190} x2={150} y2={190} />
      <Arrow x1={630} y1={190} x2={610} y2={190} />
      {/* market */}
      <Arrow x1={380} y1={342} x2={380} y2={380} />
      <Label x={380} y={400} text="⇅ orders to the market" size={13} />
    </Svg>
  );
}

/* ── Hedge fund structure ────────────────────────────────────── */

function HedgeFundStructureDiagram() {
  return (
    <Svg viewBox="0 0 760 380" title="Hedge fund structure: LPs invest in the fund run by the GP, surrounded by service providers">
      <Box x={270} y={20} w={220} h={56} lines={["Investors (LPs)", "pensions · endowments · wealthy"]} fill={GREEN} fontSize={12} />
      <Arrow x1={380} y1={76} x2={380} y2={130} />
      <Label x={392} y={106} text="capital in · fees out (2 & 20)" size={11} anchor="start" italic />
      <Box x={250} y={134} w={260} h={88} lines={["THE HEDGE FUND", "run by the manager (GP)", "long/short · leverage · derivatives"]} fontSize={13} />
      <Arrow x1={380} y1={222} x2={380} y2={282} />
      <Label x={392} y={255} text="trades" size={11} anchor="start" italic />
      <Box x={255} y={286} w={250} h={54} lines={["Markets", "stocks · bonds · futures · FX"]} fill={GREY} fontSize={12} />
      {/* service providers */}
      <Box x={20} y={140} w={180} h={76} lines={["Prime Broker", "leverage · stock loan", "custody"]} fill={BLUE} fontSize={12} />
      <Arrow x1={200} y1={178} x2={250} y2={178} dashed />
      <Box x={560} y={120} w={180} h={56} lines={["Administrator", "independent NAV"]} fill={BLUE} fontSize={12} />
      <Arrow x1={560} y1={150} x2={510} y2={160} dashed />
      <Box x={560} y={192} w={180} h={56} lines={["Auditor", "annual verification"]} fill={BLUE} fontSize={12} />
      <Arrow x1={560} y1={216} x2={510} y2={200} dashed />
    </Svg>
  );
}

/* ── Alpha model taxonomy ────────────────────────────────────── */

function AlphaDiagram() {
  return (
    <Svg viewBox="0 0 760 400" title="Taxonomy of alpha models: theory-driven (price and fundamental) and data-driven">
      <Box x={290} y={16} w={180} h={48} lines={["Alpha Models"]} fontSize={15} />
      <Arrow x1={330} y1={64} x2={220} y2={110} />
      <Arrow x1={430} y1={64} x2={560} y2={110} />
      <Box x={90} y={114} w={260} h={48} lines={["Theory-Driven", "an economic story first"]} fill={GREEN} fontSize={12} />
      <Box x={460} y={114} w={220} h={48} lines={["Data-Driven", "ML / data mining"]} fill={RED} fontSize={12} />
      <Arrow x1={160} y1={162} x2={120} y2={208} />
      <Arrow x1={280} y1={162} x2={320} y2={208} />
      <Arrow x1={570} y1={162} x2={570} y2={208} />
      <Box x={30} y={212} w={185} h={44} lines={["Price-Based"]} fill={GREY} fontSize={12} />
      <Box x={235} y={212} w={185} h={44} lines={["Fundamental-Based"]} fill={GREY} fontSize={12} />
      <Box x={470} y={212} w={200} h={64} lines={["Pattern Recognition", "no story required —", "higher overfitting risk"]} fontSize={11} fill={GREY} />
      <Arrow x1={122} y1={256} x2={122} y2={296} />
      <Arrow x1={327} y1={256} x2={327} y2={296} />
      <Box x={22} y={300} w={95} h={64} lines={["Trend", "Following"]} fontSize={11} />
      <Box x={127} y={300} w={95} h={64} lines={["Mean", "Reversion"]} fontSize={11} />
      <Box x={232} y={300} w={62} h={64} lines={["Value /", "Yield"]} fontSize={11} />
      <Box x={302} y={300} w={62} h={64} lines={["Growth"]} fontSize={11} />
      <Box x={372} y={300} w={62} h={64} lines={["Quality"]} fontSize={11} />
      <Label x={570} y={310} text="implementation choices:" size={12} />
      <Label x={570} y={330} text="horizon · bet structure · universe" size={11} italic />
      <Label x={570} y={348} text="specification · signal blending" size={11} italic />
    </Svg>
  );
}

/* ── Risk model ──────────────────────────────────────────────── */

function RiskDiagram() {
  return (
    <Svg viewBox="0 0 760 360" title="Risk models limit the amount and the types of risk">
      <Box x={290} y={16} w={180} h={48} lines={["Risk Model"]} fontSize={15} />
      <Arrow x1={330} y1={64} x2={210} y2={110} />
      <Arrow x1={430} y1={64} x2={550} y2={110} />
      <Box x={70} y={114} w={280} h={50} lines={["Limit the AMOUNT of risk", "how big can any exposure be?"]} fill={GREEN} fontSize={12} />
      <Box x={420} y={114} w={280} h={50} lines={["Limit the TYPES of risk", "which exposures are allowed at all?"]} fill={BLUE} fontSize={12} />
      <Arrow x1={140} y1={164} x2={120} y2={210} />
      <Arrow x1={280} y1={164} x2={300} y2={210} />
      <Arrow x1={490} y1={164} x2={470} y2={210} />
      <Arrow x1={630} y1={164} x2={650} y2={210} />
      <Box x={30} y={214} w={180} h={66} lines={["Hard constraints", "position ≤ 3% · sector ±5%", "leverage ≤ 8×"]} fontSize={11} fill={GREY} />
      <Box x={228} y={214} w={150} h={66} lines={["Penalties", "bigger bets must", "earn their size"]} fontSize={11} fill={GREY} />
      <Box x={396} y={214} w={160} h={66} lines={["Theory-driven", "named factors:", "market · sector · style"]} fontSize={11} fill={GREY} />
      <Box x={574} y={214} w={160} h={66} lines={["Empirical", "statistical factors", "(e.g. PCA)"]} fontSize={11} fill={GREY} />
      <Label x={380} y={320} text="Goal: take only the risks your alpha model is actually paid to take — sized in dollars or volatility" size={12} italic />
    </Svg>
  );
}

/* ── Transaction cost model ──────────────────────────────────── */

function TCostDiagram() {
  const x0 = 90, y0 = 280, x1 = 480, yTop = 60;
  return (
    <Svg viewBox="0 0 760 340" title="Transaction cost as a function of trade size: flat, linear, piecewise-linear and quadratic models">
      {/* axes */}
      <line x1={x0} y1={y0} x2={x1} y2={y0} stroke={INK} strokeWidth={2} markerEnd="url(#arrowhead)" />
      <line x1={x0} y1={y0} x2={x0} y2={yTop} stroke={INK} strokeWidth={2} markerEnd="url(#arrowhead)" />
      <Label x={x1 - 10} y={y0 + 24} text="trade size" size={12} anchor="end" />
      <Label x={x0 - 14} y={yTop + 4} text="cost" size={12} anchor="end" />
      {/* flat */}
      <line x1={x0} y1={240} x2={440} y2={240} stroke="#9ca3af" strokeWidth={2.5} strokeDasharray="2 4" />
      <Label x={448} y={244} text="flat" size={11} anchor="start" />
      {/* linear */}
      <line x1={x0} y1={y0} x2={440} y2={170} stroke="#60a5fa" strokeWidth={2.5} strokeDasharray="7 4" />
      <Label x={448} y={172} text="linear" size={11} anchor="start" />
      {/* piecewise */}
      <polyline points={`${x0},${y0} 280,225 440,120`} fill="none" stroke="#34d399" strokeWidth={2.5} />
      <Label x={448} y={120} text="piecewise-linear" size={11} anchor="start" />
      {/* quadratic */}
      <path d={`M ${x0} ${y0} Q 300 270 440 80`} fill="none" stroke={INK} strokeWidth={3} />
      <Label x={448} y={80} text="quadratic (closest to reality)" size={11} anchor="start" />
      {/* components */}
      <Box x={600} y={70} w={140} h={50} lines={["Market impact", "your order moves price"]} fill={RED} fontSize={10.5} />
      <Box x={600} y={132} w={140} h={50} lines={["Slippage", "price drifts before fill"]} fill={BLUE} fontSize={10.5} />
      <Box x={600} y={194} w={140} h={50} lines={["Commissions & fees", "visible, roughly fixed"]} fill={GREEN} fontSize={10.5} />
      <Label x={670} y={270} text="the three components" size={11} italic />
    </Svg>
  );
}

/* ── Portfolio construction ──────────────────────────────────── */

function PortfolioDiagram() {
  return (
    <Svg viewBox="0 0 760 400" title="Portfolio construction balances alpha, risk and cost into a target portfolio and trade list">
      <Box x={30} y={24} w={200} h={50} lines={["Alpha forecasts", "expected returns"]} fill={GREEN} fontSize={12} />
      <Box x={280} y={24} w={200} h={50} lines={["Risk limits", "constraints & penalties"]} fill={RED} fontSize={12} />
      <Box x={530} y={24} w={200} h={50} lines={["Cost estimates", "the toll for trading"]} fill={BLUE} fontSize={12} />
      <Arrow x1={130} y1={74} x2={300} y2={130} />
      <Arrow x1={380} y1={74} x2={380} y2={130} />
      <Arrow x1={630} y1={74} x2={460} y2={130} />
      <Box x={230} y={134} w={300} h={78} lines={["Portfolio Construction Model", "rule-based  ·  or  ·  optimizer", "(equal weight, equal risk, alpha-driven | mean-variance & refinements)"]} fontSize={11} />
      <Arrow x1={380} y1={212} x2={380} y2={258} />
      <Box x={270} y={262} w={220} h={48} lines={["Target Portfolio"]} fontSize={13} />
      <Arrow x1={380} y1={310} x2={380} y2={350} />
      <Label x={392} y={334} text="minus current portfolio" size={11} anchor="start" italic />
      <Box x={250} y={352} w={260} h={42} lines={["Trade list → Execution Model"]} fontSize={12} fill={GREY} />
    </Svg>
  );
}

/* ── Execution / order book ──────────────────────────────────── */

function ExecutionDiagram() {
  const rows = [
    { side: "ask", price: "10.04", size: 900, w: 90 },
    { side: "ask", price: "10.03", size: 1400, w: 140 },
    { side: "ask", price: "10.02", size: 2200, w: 220 },
    { side: "bid", price: "10.00", size: 1800, w: 180 },
    { side: "bid", price: "9.99", size: 1500, w: 150 },
    { side: "bid", price: "9.98", size: 1000, w: 100 },
  ];
  return (
    <Svg viewBox="0 0 760 360" title="A limit order book: resting bids and asks around the spread, worked by execution algorithms">
      <Label x={210} y={28} text="THE LIMIT ORDER BOOK" size={13} />
      {rows.map((r, i) => {
        const y = i < 3 ? 44 + i * 38 : 196 + (i - 3) * 38;
        return (
          <g key={i}>
            <rect x={120} y={y} width={r.w} height={28} fill={r.side === "ask" ? RED : GREEN} stroke={INK} strokeWidth={1.5} rx={4} />
            <Label x={108} y={y + 18} text={r.price} size={12} anchor="end" />
            <Label x={128 + r.w} y={y + 18} text={`${r.size}`} size={11} anchor="start" />
          </g>
        );
      })}
      <line x1={60} y1={172} x2={420} y2={172} stroke={INK} strokeWidth={1.5} strokeDasharray="5 4" />
      <Label x={360} y={166} text="the spread (10.00 / 10.02)" size={11} anchor="end" italic />
      <Label x={170} y={52} text="" size={10} />
      {/* right side: algos */}
      <Box x={480} y={44} w={250} h={58} lines={["Parent order", "“buy 500,000 shares”"]} fontSize={12} />
      <Arrow x1={605} y1={102} x2={605} y2={140} />
      <Box x={480} y={144} w={250} h={66} lines={["Execution algorithm", "TWAP · VWAP · arrival price", "participation caps"]} fontSize={11} fill={BLUE} />
      <Arrow x1={605} y1={210} x2={605} y2={248} />
      <Box x={480} y={252} w={250} h={58} lines={["Smart order router", "exchanges · dark pools"]} fontSize={11} fill={GREY} />
      <Arrow x1={480} y1={281} x2={350} y2={281} />
      <Label x={415} y={272} text="child orders" size={10.5} italic />
      <Label x={240} y={340} text="aggressive = take the spread now · passive = post and wait" size={12} italic />
    </Svg>
  );
}

/* ── Data ────────────────────────────────────────────────────── */

function DataDiagram() {
  return (
    <Svg viewBox="0 0 760 380" title="Price and fundamental data flow through cleaning into the black box">
      <Box x={60} y={24} w={290} h={92} lines={["PRICE DATA", "trades · quotes · volume", "order-book depth", "monthly bars → nanosecond ticks"]} fill={GREEN} fontSize={11.5} />
      <Box x={410} y={24} w={290} h={92} lines={["FUNDAMENTAL DATA", "financial statements · estimates", "macro releases · news · sentiment", "alternative data"]} fill={BLUE} fontSize={11.5} />
      <Arrow x1={205} y1={116} x2={310} y2={170} />
      <Arrow x1={555} y1={116} x2={450} y2={170} />
      <Box x={210} y={174} w={340} h={92} lines={["CLEANING", "missing data · bad prints", "splits & dividends · identifier changes", "point-in-time storage (no look-ahead)"]} fontSize={11.5} />
      <Arrow x1={380} y1={266} x2={380} y2={308} />
      <Box x={250} y={312} w={260} h={48} lines={["→ fuels every module of the box"]} fontSize={12} fill={GREY} />
      <Label x={120} y={300} text="beware:" size={12} />
      <Label x={120} y={318} text="look-ahead bias" size={11.5} italic />
      <Label x={120} y={336} text="survivorship bias" size={11.5} italic />
    </Svg>
  );
}

/* ── Research loop ───────────────────────────────────────────── */

function ResearchDiagram() {
  const cx = 380, cy = 195, r = 135;
  const steps = ["Idea", "Hypothesis", "Backtest", "Out-of-sample", "Deploy", "Monitor & retire"];
  return (
    <Svg viewBox="0 0 760 390" title="The research loop: idea, hypothesis, backtest, out-of-sample test, deployment, monitoring">
      {steps.map((s, i) => {
        const a = (i / steps.length) * 2 * Math.PI - Math.PI / 2;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        const a2 = ((i + 0.5) / steps.length) * 2 * Math.PI - Math.PI / 2;
        return (
          <g key={s}>
            <Box x={x - 75} y={y - 24} w={150} h={48} lines={[s]} fontSize={12.5} fill={i === 2 || i === 3 ? BLUE : YELLOW} />
            <Arrow
              x1={cx + (r + 6) * Math.cos(a2 - 0.16)}
              y1={cy + (r + 6) * Math.sin(a2 - 0.16)}
              x2={cx + (r + 6) * Math.cos(a2 + 0.16)}
              y2={cy + (r + 6) * Math.sin(a2 + 0.16)}
            />
          </g>
        );
      })}
      <Label x={cx} y={cy - 18} text="the scientific method," size={13} italic />
      <Label x={cx} y={cy + 2} text="applied to markets" size={13} italic />
      <Label x={cx} y={cy + 34} text="judge on: Sharpe · drawdown ·" size={11} />
      <Label x={cx} y={cy + 50} text="turnover · hit rate · capacity" size={11} />
    </Svg>
  );
}

/* ── Risks ───────────────────────────────────────────────────── */

function RisksDiagram() {
  return (
    <Svg viewBox="0 0 760 360" title="Four risks aimed at the quant strategy: model risk, regime change, contagion, exogenous shocks">
      <Box x={280} y={150} w={200} h={64} lines={["THE QUANT", "STRATEGY"]} fontSize={13} />
      <Box x={40} y={40} w={240} h={64} lines={["Model risk", "the model itself is wrong:", "bugs · bad assumptions"]} fill={RED} fontSize={11.5} />
      <Box x={480} y={40} w={240} h={64} lines={["Regime change", "the world shifts and history", "stops being a guide"]} fill={RED} fontSize={11.5} />
      <Box x={40} y={256} w={240} h={64} lines={["Contagion / crowding", "others hold your trade and", "deleverage (Aug 2007)"]} fill={RED} fontSize={11.5} />
      <Box x={480} y={256} w={240} h={64} lines={["Exogenous shocks", "events outside the data:", "bans · outages · wars"]} fill={RED} fontSize={11.5} />
      <Arrow x1={250} y1={104} x2={310} y2={150} />
      <Arrow x1={510} y1={104} x2={450} y2={150} />
      <Arrow x1={250} y1={256} x2={310} y2={214} />
      <Arrow x1={510} y1={256} x2={450} y2={214} />
    </Svg>
  );
}

/* ── HFT ─────────────────────────────────────────────────────── */

function HFTDiagram() {
  return (
    <Svg viewBox="0 0 760 400" title="HFT strategy families above the latency stack from strategy code to matching engine">
      <Label x={380} y={28} text="STRATEGY FAMILIES (the same black box, compressed in time)" size={12.5} />
      <Box x={30} y={44} w={225} h={66} lines={["Market making", "contractual & noncontractual", "earn the spread + rebates"]} fontSize={11} />
      <Box x={270} y={44} w={220} h={66} lines={["Arbitrage", "same thing, two venues,", "two prices — race to it"]} fontSize={11} />
      <Box x={505} y={44} w={225} h={66} lines={["Fast alpha", "order-flow prediction", "seconds ahead"]} fontSize={11} />
      <Arrow x1={380} y1={110} x2={380} y2={148} />
      <Label x={380} y={172} text="THE SPEED STACK — attacking every microsecond of latency" size={12.5} />
      {/* pipeline */}
      <Box x={26} y={190} w={150} h={60} lines={["Strategy logic", "FPGA / kernel bypass"]} fill={GREEN} fontSize={11} />
      <Arrow x1={176} y1={220} x2={206} y2={220} />
      <Box x={210} y={190} w={150} h={60} lines={["Co-located server", "inside the exchange DC"]} fill={GREEN} fontSize={11} />
      <Arrow x1={360} y1={220} x2={390} y2={220} />
      <Box x={394} y={190} w={150} h={60} lines={["Cross-connect", "equal-length cables"]} fill={GREEN} fontSize={11} />
      <Arrow x1={544} y1={220} x2={574} y2={220} />
      <Box x={578} y={190} w={156} h={60} lines={["Matching engine", "price-time priority"]} fill={BLUE} fontSize={11} />
      <Box x={120} y={290} w={520} h={56} lines={["Between cities: microwave beats fiber — light travels ~50% faster through air", "Chicago ↔ New York: milliseconds saved = the whole edge"]} fill={GREY} fontSize={11.5} />
      <Label x={380} y={380} text="flat at the close · tiny edge × millions of trades · capacity is small" size={12} italic />
    </Svg>
  );
}

/* ── Controversy ─────────────────────────────────────────────── */

function ControversyDiagram() {
  return (
    <Svg viewBox="0 0 760 400" title="The HFT debate: the case against versus the evidence, and the regulatory response">
      <Box x={40} y={24} w={320} h={48} lines={["THE CASE AGAINST"]} fill={RED} fontSize={13} />
      <Box x={400} y={24} w={320} h={48} lines={["THE EVIDENCE FOR"]} fill={GREEN} fontSize={13} />
      <Box x={40} y={84} w={320} h={42} lines={["“an unfair race for the rich”"]} fontSize={11.5} fill={GREY} />
      <Box x={40} y={134} w={320} h={42} lines={["“front-running / manipulation”"]} fontSize={11.5} fill={GREY} />
      <Box x={40} y={184} w={320} h={42} lines={["“phantom liquidity, flash crashes”"]} fontSize={11.5} fill={GREY} />
      <Box x={40} y={234} w={320} h={42} lines={["“no social value”"]} fontSize={11.5} fill={GREY} />
      <Box x={400} y={84} w={320} h={42} lines={["speed is openly purchasable, like a floor seat"]} fontSize={11.5} fill={GREY} />
      <Box x={400} y={134} w={320} h={42} lines={["reacting to public data ≠ front-running;", "spoofing is illegal & prosecuted"]} fontSize={10.5} fill={GREY} />
      <Box x={400} y={184} w={320} h={42} lines={["real fragility in stress → circuit breakers,", "limit-up/limit-down, kill switches"]} fontSize={10.5} fill={GREY} />
      <Box x={400} y={234} w={320} h={42} lines={["spreads tightened, trading costs fell", "vs. the human market makers HFT replaced"]} fontSize={10.5} fill={GREY} />
      <Arrow x1={380} y1={300} x2={380} y2={330} />
      <Box x={140} y={334} w={480} h={52} lines={["Narang's synthesis: police the behavior (manipulation), not the speed —", "and keep fixing stress-time market structure"]} fontSize={11.5} />
    </Svg>
  );
}

/* ── Registry ────────────────────────────────────────────────── */

export const diagrams: Record<string, () => ReactNode> = {
  blackBox: BlackBoxDiagram,
  hedgeFundStructure: HedgeFundStructureDiagram,
  alpha: AlphaDiagram,
  risk: RiskDiagram,
  tcost: TCostDiagram,
  portfolio: PortfolioDiagram,
  execution: ExecutionDiagram,
  data: DataDiagram,
  research: ResearchDiagram,
  risks: RisksDiagram,
  hft: HFTDiagram,
  controversy: ControversyDiagram,
};
