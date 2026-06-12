export interface Section {
  heading: string;
  paragraphs: string[];
}

export interface Reference {
  label: string;
  source: string;
  url?: string;
}

export interface Topic {
  slug: string;
  title: string;
  part: number;
  chapterRef: string;
  tagline: string;
  diagram: string;
  moduleNumber?: number; // position inside the five-module black box, if applicable
  sections: Section[];
  takeaways: string[];
  references: Reference[];
}

export interface Part {
  number: number;
  title: string;
  description: string;
}

export const parts: Part[] = [
  {
    number: 1,
    title: "The Quant Universe",
    description:
      "What hedge funds are, where quantitative trading fits in, and why a 'black box' is really a glass box once you know its anatomy.",
  },
  {
    number: 2,
    title: "Inside the Black Box",
    description:
      "The five modules of every quant trading system: alpha, risk, transaction costs, portfolio construction, and execution.",
  },
  {
    number: 3,
    title: "The Foundation: Data & Research",
    description:
      "The two pillars underneath the black box — the data that fuels it and the research process that builds and maintains it.",
  },
  {
    number: 4,
    title: "A Practical Guide for Investors",
    description:
      "What can go wrong, the common criticisms of quant trading, and how professionals evaluate quant managers.",
  },
  {
    number: 5,
    title: "High-Speed Trading",
    description:
      "How high-frequency trading actually works, the infrastructure arms race, and the controversy around it.",
  },
];

export const topics: Topic[] = [
  // ───────────────────────── PART I ─────────────────────────
  {
    slug: "hedge-funds-101",
    title: "Hedge Funds 101",
    part: 1,
    chapterRef: "Background for Part I",
    tagline:
      "Before opening the black box, understand the vehicle that carries it: what a hedge fund is, who invests in it, and how it makes money.",
    diagram: "hedgeFundStructure",
    sections: [
      {
        heading: "What a hedge fund actually is",
        paragraphs: [
          "A hedge fund is a privately offered, pooled investment vehicle. Unlike mutual funds, hedge funds are lightly regulated because they only accept money from institutions and accredited (wealthy) investors. In exchange for that exclusivity they get flexibility: they can sell short, use leverage, trade derivatives, hold concentrated positions, and move across asset classes.",
          "The name comes from 'hedging' — the original 1949 Alfred Winslow Jones fund bought stocks it liked and shorted stocks it didn't, so the overall market direction was (partly) hedged out. Today 'hedge fund' describes the legal structure and fee model more than any particular strategy; many funds don't hedge much at all.",
        ],
      },
      {
        heading: "The economics: 2-and-20",
        paragraphs: [
          "The classic fee structure is a 2% annual management fee on assets plus a 20% performance fee on profits, usually with a high-water mark (the manager only earns performance fees on net new profits). This structure is why talented traders gravitate to hedge funds: the upside for skill is enormous.",
          "Investors (the limited partners, or LPs) are pension funds, endowments, sovereign wealth funds, funds-of-funds, and wealthy families. The manager is the general partner (GP). Around the fund sits an ecosystem: prime brokers who provide leverage, custody and stock loan; administrators who independently value the fund; and auditors.",
        ],
      },
      {
        heading: "The goal: absolute returns and alpha",
        paragraphs: [
          "Mutual funds are judged against a benchmark — beating the S&P 500 by 1% while losing 30% counts as success. Hedge funds typically target absolute returns: make money in most environments, with returns driven by skill (alpha) rather than market exposure (beta).",
          "Alpha is the holy grail because it is, in principle, uncorrelated with everything else an investor holds. A strategy that returns 8% a year regardless of what markets do is worth far more per unit of return than an index fund — that is what justifies the fees.",
        ],
      },
      {
        heading: "Discretionary vs. systematic",
        paragraphs: [
          "There are two broad ways to run money. Discretionary managers make judgment calls trade-by-trade: they read filings, meet management, build a thesis, and size positions on conviction. Systematic (quantitative) managers encode their investment beliefs into rules and let computers apply those rules consistently across thousands of instruments.",
          "Narang's central point: quants trade the same kinds of ideas as discretionary managers — trends, value, mean reversion, quality. The difference is not what they believe but how they implement it: systematically, repeatably, with disciplined risk and cost control. The rest of this roadmap walks through exactly how that implementation works.",
        ],
      },
    ],
    takeaways: [
      "A hedge fund is a lightly regulated private fund with flexible tools: shorting, leverage, derivatives.",
      "The 2-and-20 fee model attracts top talent; high-water marks align incentives.",
      "The product hedge funds sell is alpha — returns from skill, uncorrelated with markets.",
      "Quants and discretionary managers trade similar ideas; quants implement them systematically.",
    ],
    references: [
      {
        label: "Inside the Black Box (2nd ed.), Ch. 1 — Why Does Quant Trading Matter?",
        source: "Rishi K. Narang, Wiley, 2013",
      },
      {
        label: "Hedge fund — overview of structure, fees and strategies",
        source: "Investopedia",
        url: "https://www.investopedia.com/terms/h/hedgefund.asp",
      },
      {
        label: "More Money Than God: Hedge Funds and the Making of a New Elite",
        source: "Sebastian Mallaby, Penguin, 2010",
      },
    ],
  },
  {
    slug: "the-black-box",
    title: "The Black Box: A Map",
    part: 1,
    chapterRef: "Ch. 2 — An Introduction to Quantitative Trading",
    tagline:
      "The 'black box' is a misnomer. Every quant trading system has the same anatomy: three analysis modules feeding a portfolio builder, which feeds an execution engine — all resting on data and research.",
    diagram: "blackBox",
    sections: [
      {
        heading: "Opening the box",
        paragraphs: [
          "Outsiders call quant systems 'black boxes' because the decisions come from software instead of a person. Narang's book exists to show this is wrong: quant systems are arguably more transparent than human judgment, because every decision rule is written down and testable. You just need a map of the structure.",
          "That structure is remarkably consistent across the industry. Whether the fund is a slow equity value shop or a microsecond market maker, the live trading system decomposes into the same five modules.",
        ],
      },
      {
        heading: "The five modules",
        paragraphs: [
          "Three modules analyze the world independently. The Alpha Model is the optimist: it forecasts which instruments will go up or down and hunts for profit. The Risk Model is the pessimist: it limits how much exposure the system can take to any one bet, factor, or scenario. The Transaction Cost Model is the realist: it estimates what each contemplated trade will cost to do.",
          "Their outputs flow into the Portfolio Construction Model, which weighs profit-seeking against risk and cost — like a mediator between three advisors — and outputs a target portfolio. Comparing the target with the current portfolio yields a list of trades, which the Execution Model then works into the market as cheaply and quietly as possible. This is the book's Exhibit 2.1, and Narang notes it is not universal — some funds skip or merge modules — but it captures the discrete functions of virtually every quant system.",
        ],
      },
      {
        heading: "The foundation underneath",
        paragraphs: [
          "Two things sit beneath the live modules. Data is the fuel: price feeds, financial statements, news, macro releases — without clean data nothing else matters. Research is the factory: the scientific process of designing, testing, and improving each module before (and while) it trades real money.",
          "Keep this picture in mind for the whole roadmap. Parts II and III of this site walk through each box in the diagram, one at a time, in the same order Narang does.",
        ],
      },
    ],
    takeaways: [
      "Quant systems share one anatomy: alpha + risk + transaction cost models → portfolio construction → execution.",
      "Alpha hunts returns, risk limits exposures, the cost model prices the trading itself.",
      "Data and research are the foundation underneath every module.",
      "Because rules are explicit and testable, the box is more glass than black.",
    ],
    references: [
      {
        label: "Inside the Black Box (2nd ed.), Ch. 2 — An Introduction to Quantitative Trading",
        source: "Rishi K. Narang, Wiley, 2013",
      },
      {
        label: "Quantitative trading — primer",
        source: "Investopedia",
        url: "https://www.investopedia.com/terms/q/quantitative-trading.asp",
      },
    ],
  },

  // ───────────────────────── PART II ─────────────────────────
  {
    slug: "alpha-model",
    title: "Alpha Model",
    part: 2,
    moduleNumber: 1,
    chapterRef: "Ch. 3 — Alpha Models: How Quants Make Money",
    tagline:
      "The profit engine. Alpha models forecast returns — and almost every quant forecast descends from a handful of timeless ideas.",
    diagram: "alpha",
    sections: [
      {
        heading: "What alpha models do",
        paragraphs: [
          "An alpha model produces forecasts: which instruments are likely to rise or fall, by how much, over what horizon, and with what confidence. It is the reason the fund exists — everything else in the black box manages or implements what the alpha model wants to do.",
          "Narang's most useful insight is that the universe of alpha ideas is small. Thousands of funds, decades of innovation — and nearly every strategy is a variation, combination, or refinement of a few core phenomena.",
        ],
      },
      {
        heading: "Price-driven strategies",
        paragraphs: [
          "Theory-driven strategies based on price data come in two opposite flavors. Trend following bets that what has been moving keeps moving — it works because information diffuses gradually and investors herd. It powers the giant managed-futures (CTA) industry. Mean reversion bets the opposite: prices that moved too far snap back, because liquidity demands push prices away from fair value temporarily. Statistical arbitrage — betting on the convergence of related stocks — is the classic example.",
          "These two seemingly contradictory ideas coexist because they operate on different horizons and conditions: markets can trend over months while oscillating over days.",
        ],
      },
      {
        heading: "Fundamental-driven strategies",
        paragraphs: [
          "Strategies based on fundamental data come in three families, all familiar from traditional investing. Value/yield: cheap assets (high earnings or carry relative to price) outperform expensive ones. Growth: assets with improving prospects outperform. Quality: safer, well-run, less-levered assets outperform junk, per unit of risk taken. Quants implement these by ranking thousands of instruments on systematic metrics (P/E, earnings revisions, leverage, accruals) and going long the attractive ones, short the unattractive.",
        ],
      },
      {
        heading: "Data-driven strategies",
        paragraphs: [
          "A smaller third group skips economic theory: data-driven (machine learning / data mining) strategies search the data for repeatable patterns without insisting on a story for why they exist. They can find things theory misses, but they risk fitting noise — which is why most quants use them carefully and at shorter horizons, where there is far more data to learn from.",
        ],
      },
      {
        heading: "Implementation: where strategies really differ",
        paragraphs: [
          "If everyone trades the same handful of ideas, why do returns differ so much? Implementation. Key choices: forecast horizon (microseconds to months — the same signal at different speeds is effectively a different strategy); bet structure (intrinsic bets on single instruments vs. relative bets between instruments); instrument universe (liquid futures vs. single stocks vs. FX); model specification (exact formula, parameters, conditioning variables); and run frequency.",
          "Finally, real funds rarely run one alpha. They blend many signals — by averaging, weighting via optimization, or feeding them into a machine-learned combiner. How you mix alphas is itself a major source of edge.",
        ],
      },
    ],
    takeaways: [
      "Alpha models forecast returns; they are the system's reason to exist.",
      "Price-driven alphas: trend following and mean reversion.",
      "Fundamental alphas: value/yield, growth, quality — systematized stock-picking.",
      "Data-driven (ML) alphas find patterns without theory, at higher overfitting risk.",
      "Edge lives in implementation: horizon, bet structure, universe, and how signals are blended.",
    ],
    references: [
      {
        label: "Inside the Black Box (2nd ed.), Ch. 3 — Alpha Models",
        source: "Rishi K. Narang, Wiley, 2013",
      },
      {
        label: "Value and Momentum Everywhere",
        source: "Asness, Moskowitz & Pedersen, Journal of Finance, 2013",
        url: "https://onlinelibrary.wiley.com/doi/10.1111/jofi.12021",
      },
      {
        label: "Two Centuries of Trend Following",
        source: "Lempérière et al., CFM, 2014",
        url: "https://arxiv.org/abs/1404.3274",
      },
      {
        label: "Statistical arbitrage — overview",
        source: "Investopedia",
        url: "https://www.investopedia.com/terms/s/statisticalarbitrage.asp",
      },
    ],
  },
  {
    slug: "risk-model",
    title: "Risk Model",
    part: 2,
    moduleNumber: 2,
    chapterRef: "Ch. 4 — Risk Models",
    tagline:
      "The professional pessimist. Risk models don't try to make money — they deliberately limit the bets the alpha model is allowed to express.",
    diagram: "risk",
    sections: [
      {
        heading: "Risk management ≠ risk reduction",
        paragraphs: [
          "A common misconception is that risk management means minimizing risk. Taking risk is how returns are earned; the job of the risk model is to make risk-taking deliberate: take exposure to the things your alpha actually forecasts, in sizes you choose, and eliminate incidental exposures you never intended to have.",
          "Narang frames it precisely: risk models constrain the size of exposures to sources of return the alpha model is not designed to predict. A stat-arb fund betting on stock-vs-stock convergence has no opinion about the direction of the whole market — so net market exposure is a risk to be limited, not a bet.",
        ],
      },
      {
        heading: "Limiting size: hard constraints vs. penalties",
        paragraphs: [
          "The most basic risk controls limit size. These can be hard constraints (no position exceeds 3% of the book; sector exposure within ±5%; gross leverage below 8×) or penalty functions, which allow larger exposures only if the alpha model's conviction is strong enough to pay an escalating cost. Limits apply at every level: single position, group (sector, country, asset class), and the whole portfolio.",
          "A subtle, important choice is how size is measured: by capital (dollars deployed) or by volatility/risk (dollars × how much the asset moves). Risk-based sizing treats a position in a sleepy utility and a volatile biotech very differently even at equal dollar size.",
        ],
      },
      {
        heading: "Limiting types of risk: theory-driven and empirical models",
        paragraphs: [
          "Beyond size, risk models limit kinds of exposure. Theory-driven approaches use named, economically motivated factors — market, sector, value, momentum, interest-rate sensitivity — and measure the portfolio's exposure to each. Empirical (statistical) approaches let the data speak, using techniques like principal component analysis to discover whatever common movements actually exist in returns, named or not.",
          "Theory-driven factors are interpretable but can miss new risks; statistical factors adapt automatically but can be unstable and hard to explain. Many shops use both.",
        ],
      },
      {
        heading: "Why this module saves funds",
        paragraphs: [
          "The catastrophic quant failures — most famously the August 2007 'quant quake', when crowded equity market-neutral portfolios all deleveraged at once — were not alpha failures so much as exposure failures: portfolios carried huge, unintended common exposures. A good risk model is what keeps a drawdown survivable, which is what allows a strategy with a modest edge to compound for decades.",
        ],
      },
    ],
    takeaways: [
      "Risk models limit exposure to things the alpha model isn't designed to predict.",
      "Controls are hard constraints or penalties, applied to positions, groups, and the whole book.",
      "Size can be measured in dollars or in volatility-adjusted (risk) terms.",
      "Risk types are controlled via theory-driven factors (named, interpretable) or statistical factors (PCA, adaptive).",
      "Surviving drawdowns is what lets a modest edge compound — that's the risk model's real product.",
    ],
    references: [
      {
        label: "Inside the Black Box (2nd ed.), Ch. 4 — Risk Models",
        source: "Rishi K. Narang, Wiley, 2013",
      },
      {
        label: "What Happened to the Quants in August 2007?",
        source: "Khandani & Lo, MIT, 2007",
        url: "https://web.mit.edu/Alo/www/Papers/august07.pdf",
      },
      {
        label: "Factor models in risk management",
        source: "MSCI Barra — Equity Factor Models (overview)",
        url: "https://www.msci.com/factor-models",
      },
    ],
  },
  {
    slug: "transaction-cost-model",
    title: "Transaction Cost Model",
    part: 2,
    moduleNumber: 3,
    chapterRef: "Ch. 5 — Transaction Cost Models",
    tagline:
      "The realist. Trading is never free, and a strategy that ignores costs will happily trade away all of its own profits.",
    diagram: "tcost",
    sections: [
      {
        heading: "Why model costs at all",
        paragraphs: [
          "Every trade has a price beyond the asset itself. An alpha model left alone would trade constantly — every tiny forecast change implies a tiny rebalance. The transaction cost model tells the portfolio constructor what each contemplated trade would cost, so the system only trades when the expected gain exceeds the toll.",
          "Crucially, this module's job is to estimate costs accurately, not to minimize them — minimizing the cost of trades we've decided to do is the execution model's job. Underestimating costs makes you trade too much; overestimating makes you miss profitable trades. Both errors burn money.",
        ],
      },
      {
        heading: "The three components of cost",
        paragraphs: [
          "Commissions and fees: payments to brokers, exchanges, and regulators, plus financing. Small, visible, and roughly fixed per share or per dollar.",
          "Slippage: the price moves between the moment the model decides to trade and the moment the order actually executes. Slippage hurts trend-type strategies most — they buy things that are already rising, so delay is expensive — and matters more the faster the signal decays.",
          "Market impact: your own order moves the price against you. Demanding liquidity costs the spread at minimum, and large orders push prices further. Impact is the dominant cost for big funds and the fundamental reason every strategy has a capacity limit — twice the assets does not mean twice the profits.",
        ],
      },
      {
        heading: "How quants model the cost curve",
        paragraphs: [
          "Cost as a function of trade size is modeled with increasingly refined shapes: flat (every trade costs the same — crude but fast), linear (cost per share rises proportionally with size), piecewise-linear (cheap up to a liquidity threshold, steeper beyond), and quadratic (cost accelerates smoothly with size, closest to observed reality but heaviest to compute and estimate).",
          "Each instrument gets its own curve — impact in a mega-cap stock is nothing like impact in a small-cap — typically re-estimated regularly from the fund's own execution records.",
        ],
      },
    ],
    takeaways: [
      "The cost model estimates what trading costs so portfolio construction can weigh profit against toll.",
      "Three components: commissions/fees, slippage, and market impact.",
      "Market impact dominates at scale and is why strategies have limited capacity.",
      "Cost curves are modeled flat, linear, piecewise-linear, or quadratic — per instrument.",
      "Estimate accurately, don't minimize — minimization belongs to execution.",
    ],
    references: [
      {
        label: "Inside the Black Box (2nd ed.), Ch. 5 — Transaction Cost Models",
        source: "Rishi K. Narang, Wiley, 2013",
      },
      {
        label: "Optimal Execution of Portfolio Transactions",
        source: "Almgren & Chriss, Journal of Risk, 2000",
        url: "https://www.smallake.kr/wp-content/uploads/2016/03/optliq.pdf",
      },
      {
        label: "Slippage and market impact — primers",
        source: "Investopedia",
        url: "https://www.investopedia.com/terms/s/slippage.asp",
      },
    ],
  },
  {
    slug: "portfolio-construction-model",
    title: "Portfolio Construction Model",
    part: 2,
    moduleNumber: 4,
    chapterRef: "Ch. 6 — Portfolio Construction Models",
    tagline:
      "The mediator. It hears the optimist (alpha), the pessimist (risk), and the realist (costs) — and decides what the portfolio should actually look like.",
    diagram: "portfolio",
    sections: [
      {
        heading: "The balancing act",
        paragraphs: [
          "The portfolio construction model takes three inputs — expected returns from the alpha model, limits and penalties from the risk model, cost estimates from the transaction cost model — and produces one output: a target portfolio, the exact desired size of every position. The difference between the target and the current portfolio becomes the trade list sent to execution.",
          "Narang splits the approaches into two families: rule-based models, built on heuristics humans find sensible, and optimizers, which search mathematically for the portfolio with the best risk-adjusted expected outcome.",
        ],
      },
      {
        heading: "Rule-based approaches",
        paragraphs: [
          "Four common heuristics, in rising sophistication: equal position weighting (every bet the same size — maximally humble about your ability to size conviction); equal risk weighting (same idea, but sizes inversely scaled to volatility so each position contributes equal risk); alpha-driven weighting (position size proportional to signal strength, capped by risk limits); and decision-tree approaches (a hierarchy of if-then rules that allocate the book).",
          "Rule-based models are transparent, robust, and hard to game — which is why plenty of highly successful funds use them despite their simplicity.",
        ],
      },
      {
        heading: "Optimizers",
        paragraphs: [
          "Optimizers descend from Markowitz's 1952 mean-variance framework: given expected returns, volatilities, and correlations, find the weights that maximize return per unit of risk. Add real-world constraints (position limits, leverage, turnover, costs) and solve.",
          "The catch: optimizers are 'error maximizers'. They trust their inputs completely, and expected-return inputs are the least reliable numbers in finance — so naive optimizers slam into corners, massively long whatever was overestimated. Refinements address this: constrained optimization, Black-Litterman (blend forecasts with market equilibrium), resampled efficiency (optimize over many perturbed scenarios and average), and robust optimization (optimize against worst-case input error). Some shops even optimize the mix of strategies rather than individual positions.",
        ],
      },
      {
        heading: "Output: the target portfolio",
        paragraphs: [
          "However it gets there, the module ends with the same artifact: a target portfolio that balances hunger, fear, and friction. Rule-based or optimized, the right choice depends on the strategy: optimizers shine when relative-value bets across many correlated instruments matter; rules shine when forecasts are coarse and robustness beats precision.",
        ],
      },
    ],
    takeaways: [
      "Inputs: alpha forecasts + risk limits + cost estimates. Output: a target portfolio → trade list.",
      "Rule-based family: equal weight, equal risk, alpha-driven, decision trees — simple and robust.",
      "Optimizer family: mean-variance descendants with constraints, Black-Litterman, resampling, robust methods.",
      "Optimizers are error maximizers — garbage forecasts in, confident garbage portfolios out.",
      "The famous trio: alpha is the optimist, risk the pessimist, portfolio construction the mediator.",
    ],
    references: [
      {
        label: "Inside the Black Box (2nd ed.), Ch. 6 — Portfolio Construction Models",
        source: "Rishi K. Narang, Wiley, 2013",
      },
      {
        label: "Portfolio Selection",
        source: "Harry Markowitz, Journal of Finance, 1952",
        url: "https://www.jstor.org/stable/2975974",
      },
      {
        label: "Global Portfolio Optimization (Black-Litterman)",
        source: "Black & Litterman, Financial Analysts Journal, 1992",
      },
    ],
  },
  {
    slug: "execution-model",
    title: "Execution Model",
    part: 2,
    moduleNumber: 5,
    chapterRef: "Ch. 7 — Execution",
    tagline:
      "The last mile. Given a list of trades to do, get them done — cheaply, quietly, and without telegraphing your intentions to the market.",
    diagram: "execution",
    sections: [
      {
        heading: "From trade list to filled orders",
        paragraphs: [
          "Portfolio construction says what to trade; execution decides how. Quant funds overwhelmingly execute electronically — via direct market access (DMA) to exchanges or, for the largest orders, broker algorithms. The execution model's mandate is to minimize the all-in cost of completing the trade list: cross the spread only when necessary, slice large orders into small ones, and avoid signaling.",
        ],
      },
      {
        heading: "The order book: where trading actually happens",
        paragraphs: [
          "Modern markets are electronic limit order books. Buyers and sellers post limit orders (a price and a size); the exchange matches them by price-time priority. The gap between the best bid and best offer is the spread. You can trade aggressively — take the posted price immediately and pay the spread — or passively — post your own order and wait to be filled, earning the spread but risking the price running away. That aggressive/passive trade-off (certainty vs. cost) is the fundamental dial in all execution.",
        ],
      },
      {
        heading: "Execution algorithms and order types",
        paragraphs: [
          "Large 'parent' orders are sliced into small 'child' orders by scheduling algorithms: TWAP spreads trading evenly over time; VWAP follows the market's typical volume pattern; implementation-shortfall (arrival price) algorithms balance impact against the risk of drifting from the decision price; participation algorithms cap themselves at a percentage of market volume.",
          "Order types fine-tune behavior: market and limit orders, iceberg orders that show only a sliver of their true size, immediate-or-cancel orders that probe liquidity without resting. Smart order routers split child orders across the venues — multiple exchanges and dark pools — showing the best price and likelihood of fill at that instant.",
        ],
      },
      {
        heading: "Infrastructure: the need for speed",
        paragraphs: [
          "Execution is where quant trading meets engineering. Co-located servers in the exchange's own data center, microwave links between cities, kernel-bypass networking, and FPGA-based feed handlers shave microseconds. How much speed matters depends on the strategy: for a monthly-rebalanced value fund, very little; for strategies whose edge decays in seconds, speed is the strategy. That continuum leads directly to high-frequency trading — Part V of this roadmap.",
        ],
      },
    ],
    takeaways: [
      "Execution minimizes the cost of completing the trade list decided upstream.",
      "Markets are limit order books; the core dial is aggressive (pay spread, certain fill) vs. passive (earn spread, uncertain fill).",
      "Big orders are sliced by algorithms: TWAP, VWAP, implementation shortfall, participation.",
      "Smart order routers spray child orders across lit exchanges and dark pools.",
      "Speed infrastructure (co-location, microwave, FPGA) matters in proportion to how fast the alpha decays.",
    ],
    references: [
      {
        label: "Inside the Black Box (2nd ed.), Ch. 7 — Execution",
        source: "Rishi K. Narang, Wiley, 2013",
      },
      {
        label: "Algorithmic Trading and DMA",
        source: "Barry Johnson, 4Myeloma Press, 2010",
      },
      {
        label: "Limit order book — how matching engines work",
        source: "Investopedia",
        url: "https://www.investopedia.com/terms/l/limitorderbook.asp",
      },
    ],
  },

  // ───────────────────────── PART III ─────────────────────────
  {
    slug: "data",
    title: "Data",
    part: 3,
    chapterRef: "Ch. 8 — Data",
    tagline:
      "Fuel for the machine. Quant systems are only as good as what they're fed — garbage in, garbage out is the industry's oldest law.",
    diagram: "data",
    sections: [
      {
        heading: "Why data comes first",
        paragraphs: [
          "Every module in the black box consumes data: the alpha model forecasts from it, the risk model measures exposures with it, the cost model is calibrated on it, and research validates everything against history. A subtle data error silently corrupts all of them at once, which is why serious quant shops treat data engineering as a first-class discipline, not plumbing.",
        ],
      },
      {
        heading: "Two great families: price and fundamental",
        paragraphs: [
          "Price data covers anything generated by trading itself: trades, quotes, volumes, full order-book depth, at frequencies from monthly bars down to nanosecond ticks. It is high-volume, fast, and relatively standardized.",
          "Fundamental data covers everything about the world outside the tape: financial statements, earnings estimates, macroeconomic releases, news, sentiment, and the modern explosion of alternative data (satellite imagery, credit-card panels, web traffic). It is slower, messier, and richer in unique edge.",
        ],
      },
      {
        heading: "Cleaning: where the real work is",
        paragraphs: [
          "Raw data lies. Routine problems include missing values, bad prints (a fat-fingered tick at 10× the price), unadjusted corporate actions (a 2-for-1 split looks like a 50% crash), and changing identifiers as companies merge and relist. Each needs systematic detection and repair.",
          "The deadliest problems are the historical biases. Look-ahead bias: using information at a point in your backtest before it was actually available (earnings are reported weeks after the quarter ends; databases get revised). Survivorship bias: testing on today's index members, which silently excludes everything that went bankrupt. Either one can make a worthless strategy look brilliant in simulation — hence the gold standard, point-in-time data, which stores what was known exactly when it was known.",
        ],
      },
    ],
    takeaways: [
      "Every module runs on data; a single data flaw corrupts all of them.",
      "Two families: price/market data (fast, standardized) and fundamental data (slow, messy, edge-rich).",
      "Cleaning handles missing data, bad prints, splits/dividends, and identifier changes.",
      "Look-ahead and survivorship bias fabricate fake profits in backtests — use point-in-time data.",
    ],
    references: [
      {
        label: "Inside the Black Box (2nd ed.), Ch. 8 — Data",
        source: "Rishi K. Narang, Wiley, 2013",
      },
      {
        label: "Survivorship bias — why backtests lie",
        source: "Investopedia",
        url: "https://www.investopedia.com/terms/s/survivorshipbias.asp",
      },
      {
        label: "Advances in Financial Machine Learning (Ch. 1-2 on data)",
        source: "Marcos López de Prado, Wiley, 2018",
      },
    ],
  },
  {
    slug: "research",
    title: "Research",
    part: 3,
    chapterRef: "Ch. 9 — Research",
    tagline:
      "The factory that builds the box. Research is the scientific method applied to markets — and the discipline that separates real edge from beautiful overfit nonsense.",
    diagram: "research",
    sections: [
      {
        heading: "The scientific method, applied to money",
        paragraphs: [
          "A quant strategy is born as a hypothesis: 'stocks with improving margins outperform for six months', 'futures trends persist across asset classes'. Research is the loop that turns hypotheses into deployed models: observe markets, form a theory, formalize it as a testable rule, test it on historical data, and only then — if it survives — promote it to live trading with real capital. Live results feed back into the loop, because no model survives contact with markets unchanged.",
        ],
      },
      {
        heading: "Backtesting honestly",
        paragraphs: [
          "A backtest simulates the strategy on history. Done honestly, it must include realistic transaction costs, only use point-in-time data, and reserve out-of-sample data — a slice of history (or live 'paper trading' period) the model never saw during development — as the true exam.",
          "Researchers judge results on multiple dimensions, not just total return: Sharpe ratio (return per unit of volatility), maximum drawdown (worst peak-to-trough loss — can you survive it emotionally and contractually?), turnover (how much trading the profits require), hit rate and skew (many small wins with rare big losses is a very different animal from the reverse), and capacity (how much money the strategy can run before impact eats the edge).",
        ],
      },
      {
        heading: "The enemy: overfitting",
        paragraphs: [
          "Search any dataset hard enough and you will find patterns that are pure luck. Try 200 variations of a signal and the best backtest will look spectacular by chance alone. Defenses: insist on an economic rationale before testing, prefer simple models with few parameters, demand stability across parameter values, markets and time periods, and discount every result by how many things you tried. Narang's rule of thumb: the more beautiful the backtest, the more suspicious you should be.",
        ],
      },
      {
        heading: "Research never stops",
        paragraphs: [
          "Alpha decays. Signals get crowded as others discover them, market structure changes, and regimes shift. A quant fund is therefore better understood as a research organization that happens to trade than a trading firm that happens to research: the durable asset is not any single model but the pipeline that keeps producing and retiring them.",
        ],
      },
    ],
    takeaways: [
      "Research = scientific method: hypothesis → honest backtest → out-of-sample exam → live deployment.",
      "Judge strategies on Sharpe, drawdown, turnover, hit rate/skew, and capacity — not just returns.",
      "Overfitting is the cardinal sin; simplicity, economic rationale, and parameter stability are the defenses.",
      "Alpha decays — the lasting edge is the research pipeline, not any single model.",
    ],
    references: [
      {
        label: "Inside the Black Box (2nd ed.), Ch. 9 — Research",
        source: "Rishi K. Narang, Wiley, 2013",
      },
      {
        label: "Pseudo-Mathematics and Financial Charlatanism (backtest overfitting)",
        source: "Bailey, Borwein, López de Prado & Zhu, AMS Notices, 2014",
        url: "https://www.ams.org/notices/201405/rnoti-p458.pdf",
      },
      {
        label: "The Sharpe ratio",
        source: "Investopedia",
        url: "https://www.investopedia.com/terms/s/sharperatio.asp",
      },
    ],
  },

  // ───────────────────────── PART IV ─────────────────────────
  {
    slug: "risks-and-criticisms",
    title: "Risks & Criticisms",
    part: 4,
    chapterRef: "Ch. 10–12 — Risks, Criticisms, and Evaluating Quants",
    tagline:
      "What can go wrong — and what the standard attacks on quant trading get right and wrong.",
    diagram: "risks",
    sections: [
      {
        heading: "Risks unique to the systematic approach",
        paragraphs: [
          "Model risk: the model is simply wrong — a coding bug, a flawed assumption, an estimation error — and being systematic, it applies its wrongness consistently across thousands of positions.",
          "Regime change: models learn from history; when the world structurally shifts (a currency peg breaks, rates leave a 30-year trend, a pandemic), the past stops being a guide exactly when guidance matters most.",
          "Crowding and contagion: many quants discover similar signals from similar data. When one large player deleverages, it moves prices against everyone holding the cousin portfolio, forcing them to sell too. The August 2007 quant quake is the canonical case: market-neutral funds lost double digits in days while the stock market itself barely moved.",
          "Exogenous shocks: events with no precedent in the data — regulatory bans on short selling, exchange outages, wars — hit systematic and discretionary traders alike, but a machine needs a human hand on the kill switch.",
        ],
      },
      {
        heading: "The standard criticisms, weighed",
        paragraphs: [
          "'Trading can't be reduced to science.' Narang's answer: quants don't claim markets are physics; they claim that explicit, tested rules beat untested intuition on average, across many small decisions — exactly where statistical discipline shines. Humans retain the edge in unique, data-poor situations (and good quant shops keep humans in charge of the models).",
          "'Quants caused crisis X.' Quant strategies have caused sharp episodes among themselves (2007), and execution-layer accidents have caused flash events. But the genuinely catastrophic crises — 2008 — were built on leverage and credit, overwhelmingly by human decisions. Blaming 'the computers' is usually a category error.",
          "'They're all the same trade.' Partly fair — crowding is real (see above) — but the diversity of horizons, universes, and implementations means 'quant' is no more one trade than 'discretionary' is.",
          "'Garbage data mining.' Fair as a description of bad quants. The defense is the research discipline from the previous topic; the criticism is really an argument for evaluating managers carefully — the next section.",
        ],
      },
      {
        heading: "Evaluating a quant manager",
        paragraphs: [
          "Since you cannot read the code, due diligence means evaluating the process: Can the manager explain, in plain language, what they believe and why it makes money? (Real edges have economic stories; 'it's proprietary' is a red flag for the core premise, though details may stay secret.) How do they manage risk, and what happened in their worst drawdown? How do they fight overfitting? How is research industrialized — what's the pipeline from idea to production? And the integrity basics: independent administrators, real audits, infrastructure that matches the claimed strategy.",
        ],
      },
    ],
    takeaways: [
      "Systematic-specific risks: model error, regime change, crowding/contagion, exogenous shocks.",
      "August 2007: crowded quant portfolios deleveraged together — the canonical contagion case study.",
      "Most criticisms conflate bad quants with quant trading; the big crises were human-made.",
      "Manager due diligence = evaluating the process: economic rationale, risk discipline, anti-overfitting culture, operational integrity.",
    ],
    references: [
      {
        label: "Inside the Black Box (2nd ed.), Ch. 10–12",
        source: "Rishi K. Narang, Wiley, 2013",
      },
      {
        label: "What Happened to the Quants in August 2007?",
        source: "Khandani & Lo, MIT, 2007",
        url: "https://web.mit.edu/Alo/www/Papers/august07.pdf",
      },
      {
        label: "When Genius Failed (LTCM — model risk and leverage)",
        source: "Roger Lowenstein, Random House, 2000",
      },
    ],
  },

  // ───────────────────────── PART V ─────────────────────────
  {
    slug: "high-frequency-trading",
    title: "High-Speed & High-Frequency Trading",
    part: 5,
    chapterRef: "Ch. 13–15 — High-Speed Trading; High-Frequency Trading",
    tagline:
      "The black box at light speed: holding periods of seconds, profits of fractions of a cent, and an engineering arms race measured in microseconds.",
    diagram: "hft",
    sections: [
      {
        heading: "What makes a trader 'high-frequency'",
        paragraphs: [
          "HFT is not a different species — it is the same five-module black box run at extreme speed. Defining traits: holding periods from microseconds to minutes, ending the day flat or nearly flat (little overnight risk), tiny profit per trade multiplied across enormous trade counts, and edge that depends partly on reacting faster than competitors. Capacity is small — speed-based edges don't scale to billions — which is why HFT firms are mostly proprietary shops trading their own capital rather than funds gathering outside assets.",
          "Narang distinguishes high-speed trading (any strategy where latency materially affects profits — including the execution layer of slower funds) from high-frequency trading proper, where the entire strategy lives at short horizons. Why does speed matter at all? Because some opportunities are pure races: when new information makes a posted quote stale, the first to react captures the profit and the second gets nothing.",
        ],
      },
      {
        heading: "The HFT strategy families (Ch. 15)",
        paragraphs: [
          "Market making: continuously quote both a bid and an offer, earn the spread (plus exchange rebates) on each round trip, and manage the inventory risk of getting filled on one side. Narang splits it into contractual market making — registered market makers with formal quoting obligations and corresponding privileges — and noncontractual market making, free agents doing the same economic job with no obligation to stay. Either way, this is the descendant of the human floor specialist, automated and at scale; the core skill is pricing adverse selection — the trader who hits your quote may know something you don't.",
          "Arbitrage: the same instrument (or tightly linked ones) trading at different prices in different places — an ETF versus its basket, a future versus its index, the same stock on two venues. The first to see and act captures a nearly riskless spread; speed is the whole game.",
          "Fast alpha: forecasting price moves seconds-to-minutes ahead, often from the order book itself — order-flow imbalance, queue dynamics, the footprints large institutional orders leave as they're sliced into the market. The same alpha taxonomy from Part 2 applies, compressed in time.",
          "HFT risk management and portfolio construction exist too, but compressed: inventory limits enforced in real time, kill switches, and position limits per symbol — decisions that must be made in microseconds are mostly precomputed.",
        ],
      },
      {
        heading: "The speed stack: sources of latency (Ch. 14)",
        paragraphs: [
          "The latency budget gets attacked at every layer: co-location (your server racks meters from the exchange matching engine, with regulated equal cable lengths for fairness); microwave links between cities (light travels ~50% faster through air than through glass fiber — Chicago↔New York by microwave beats fiber by milliseconds); kernel-bypass networking and FPGAs (decision logic burned into hardware, skipping the operating system entirely); and the exchange's own matching engine mechanics — knowing exactly how the price-time priority queue works is itself a form of alpha.",
        ],
      },
    ],
    takeaways: [
      "HFT = the same black box at microsecond speed: flat overnight, tiny edge × huge trade count, limited capacity.",
      "Speed matters because some opportunities are winner-take-all races to react to new information.",
      "Strategy families per Narang: contractual & noncontractual market making, arbitrage, and fast alpha.",
      "The speed stack: co-location, microwave links, kernel bypass, FPGAs, matching-engine mechanics.",
    ],
    references: [
      {
        label: "Inside the Black Box (2nd ed.), Ch. 13–15 — High-Speed and High-Frequency Trading",
        source: "Rishi K. Narang, Wiley, 2013",
      },
      {
        label: "High-Frequency Trading and Price Discovery",
        source: "Brogaard, Hendershott & Riordan, Review of Financial Studies, 2014",
        url: "https://academic.oup.com/rfs/article/27/8/2267/1582754",
      },
      {
        label: "Market making — how liquidity provision earns the spread",
        source: "Investopedia",
        url: "https://www.investopedia.com/terms/m/marketmaker.asp",
      },
    ],
  },
  {
    slug: "hft-controversy",
    title: "The HFT Controversy",
    part: 5,
    chapterRef: "Ch. 16–17 — Controversy Regarding HFT; Looking to the Future",
    tagline:
      "Is high-frequency trading a tax on investors or the best deal liquidity has ever been? The arguments, the evidence, and where quant trading goes next.",
    diagram: "controversy",
    sections: [
      {
        heading: "The four charges",
        paragraphs: [
          "Narang organizes the controversy — sharpened by the 2010 Flash Crash and later by Michael Lewis's 'Flash Boys' — into four questions. Does HFT create unfair competition? Does it amount to front-running or market manipulation? Does it cause volatility or structural instability? And does it lack social value?",
        ],
      },
      {
        heading: "Unfairness, front-running, manipulation",
        paragraphs: [
          "On fairness: speed advantages are real but purchasable by anyone (co-location is sold openly by exchanges, like a faster seat ever was on the floor) — an arms race between professionals more than a tax on the public. Advantages of capital and access have always existed in markets; the relevant question is whether outsiders are worse off, and falling spreads suggest the opposite.",
          "On front-running: true front-running — trading ahead of a client order you were entrusted with — is illegal and is not what HFT market makers do; they react to public information, including the footprints of large orders. That reaction can still raise costs for institutions trying to hide their flow, which is a real tension, but a different one. Genuine manipulation — spoofing (posting orders you never intend to fill to fake supply or demand), quote stuffing, momentum ignition — is illegal, prosecuted, and condemned by legitimate firms; Narang's argument is to police the behavior rather than ban the speed.",
        ],
      },
      {
        heading: "Instability and social value",
        paragraphs: [
          "On instability: the May 6, 2010 Flash Crash showed how quickly electronic liquidity can recede in stress — quotes pulled in seconds, a cascade of stub-quote fills, then an equally fast recovery. The official report found a large institutional sell algorithm at the origin, with HFT liquidity withdrawal amplifying the move. The structural answer has been regulatory: circuit breakers, limit-up/limit-down bands, audit trails, kill switches.",
          "On social value: the measurable record is that explicit trading costs for ordinary investors fell dramatically in the HFT era — spreads tightened and depth improved compared with the human market makers HFT displaced, who enjoyed far fatter margins. Narang's synthesis: most HFT is liquidity-providing market making; market quality has improved on average; stress-time fragility and fairness questions deserve targeted regulation, not nostalgia for the floor.",
        ],
      },
      {
        heading: "Looking to the future",
        paragraphs: [
          "The book closes (Ch. 17) by noting the durable trends: cheaper computing and data keep lowering the barrier to systematic trading; alpha keeps decaying as ideas crowd, pushing research toward new data sources and faster adaptation; and the line between 'quant' and 'discretionary' keeps blurring as everyone adopts the toolkit. The black box framework — alpha, risk, costs, construction, execution, on a foundation of data and research — remains the map for understanding whatever comes next.",
        ],
      },
    ],
    takeaways: [
      "Four charges: unfair competition, front-running/manipulation, instability, no social value.",
      "Speed advantages are openly purchasable; true front-running and spoofing are illegal and distinct from market making.",
      "The Flash Crash showed real stress-time fragility; the fix has been circuit breakers and surveillance, not banning speed.",
      "Measured outcome: spreads and trading costs fell in the HFT era.",
      "The five-module framework remains the map as data, computing, and crowding reshape the industry.",
    ],
    references: [
      {
        label: "Inside the Black Box (2nd ed.), Ch. 16–17",
        source: "Rishi K. Narang, Wiley, 2013",
      },
      {
        label: "Findings Regarding the Market Events of May 6, 2010 (Flash Crash report)",
        source: "SEC & CFTC, 2010",
        url: "https://www.sec.gov/news/studies/2010/marketevents-report.pdf",
      },
      {
        label: "Flash Boys: A Wall Street Revolt",
        source: "Michael Lewis, W. W. Norton, 2014",
      },
    ],
  },
];

export const getTopic = (slug: string): Topic | undefined =>
  topics.find((t) => t.slug === slug);

export const topicIndex = (slug: string): number =>
  topics.findIndex((t) => t.slug === slug);
