import { useState, useEffect } from "react";

const DARK = {
  bg: "#07080F", surface: "#0D0F1E", panel: "#111428",
  border: "#1A1F3A", border2: "#222845", muted: "#3D4F6B",
  dim: "#6B7F9E", text: "#C8D4E8", bright: "#EEF2FF",
  green: "#00C853", yellow: "#F5A623", red: "#E63946",
  blue: "#2B4EFF", purple: "#1E3FD8",
};

const LIGHT = {
  bg: "#EDF0F4", surface: "#F5F7FA", panel: "#FFFFFF",
  border: "#D6DCE8", border2: "#C2CBDA", muted: "#8A97AD",
  dim: "#5A6882", text: "#1A2340", bright: "#0D0F2D",
  green: "#00A846", yellow: "#D4880A", red: "#C92F3A",
  blue: "#2B4EFF", purple: "#1E3FD8",
};

const font = "'Inter','Helvetica Neue',Arial,sans-serif";

const QUERIES = [
  { id: "news",     label: "AI News & Buzz",        icon: "◈", rss: "https://news.google.com/rss/search?q=artificial+intelligence+AI+news&hl=en-US&gl=US&ceid=US:en" },
  { id: "ethics",   label: "Responsible AI",         icon: "◎", rss: "https://news.google.com/rss/search?q=responsible+AI+ethics+bias&hl=en-US&gl=US&ceid=US:en" },
  { id: "tools",    label: "AI Tools & Models",      icon: "⬡", rss: "https://news.google.com/rss/search?q=AI+tools+models+LLM+ChatGPT+Claude&hl=en-US&gl=US&ceid=US:en" },
  { id: "policy",   label: "AI Policy & Regulation", icon: "◇", rss: "https://news.google.com/rss/search?q=AI+policy+regulation+governance+law&hl=en-US&gl=US&ceid=US:en" },
  { id: "business", label: "AI in Business",         icon: "◉", rss: "https://news.google.com/rss/search?q=AI+enterprise+business+ROI+adoption&hl=en-US&gl=US&ceid=US:en" },
  { id: "research", label: "Research Breakthroughs", icon: "◫", rss: "https://news.google.com/rss/search?q=AI+research+breakthrough+science&hl=en-US&gl=US&ceid=US:en" },
];

const STATIC_DATA = {
  news:     { oneLiner: "The AI news cycle in early 2026 is dominated by GPT-5 and Gemini Ultra 2 launches, open-source momentum from Meta and Mistral, and a wave of multimodal breakthroughs reshaping how the world interacts with AI.", topVoices: [ { type: "Researcher", sentiment: "positive", quote: "2026 is the year AI moves from impressive demos to genuinely indispensable infrastructure." }, { type: "Investor", sentiment: "mixed", quote: "The AI investment cycle is maturing — we're moving from fear-of-missing-out to show-me-the-numbers." }, { type: "Media", sentiment: "positive", quote: "Every week there's a new benchmark shattered — the pace of progress is genuinely unprecedented." } ], watchPoints: ["GPT-5 enterprise adoption rates — early signals suggest faster uptake than GPT-4", "Open-source vs closed model debate — regulatory pressure may favour open approaches", "AI bubble concerns — several analysts flagging overvaluation in AI infrastructure plays"] },
  ethics:   { oneLiner: "Responsible AI discourse in 2026 is intense and increasingly urgent — bias incidents, deepfake proliferation, and workforce displacement concerns are driving calls for binding standards beyond voluntary commitments.", topVoices: [ { type: "Regulator", sentiment: "cautious", quote: "Voluntary AI ethics commitments have not been sufficient — binding standards with real enforcement are now necessary." }, { type: "Researcher", sentiment: "mixed", quote: "The safety research is promising but it's outpaced by capabilities development by a significant margin." }, { type: "Analyst", sentiment: "negative", quote: "Deepfake proliferation is the most immediate societal harm from AI and it is largely unaddressed." } ], watchPoints: ["EU AI Act enforcement — first major fines expected in mid-2026", "Synthetic media labelling standards — ISO and W3C working groups expected to publish drafts Q2 2026", "AI bias litigation — several class action suits progressing through US courts"] },
  tools:    { oneLiner: "The AI tools landscape in 2026 is exploding — coding assistants, AI agents, and multimodal platforms are reshaping developer and knowledge worker productivity, with agentic AI emerging as the defining paradigm shift.", topVoices: [ { type: "Developer", sentiment: "positive", quote: "Claude Code and Cursor together have made me at least 3x more productive — that's not hyperbole, I've measured it." }, { type: "Analyst", sentiment: "positive", quote: "The AI tools market is the fastest-growing software category in history — and it's still early innings." }, { type: "Researcher", sentiment: "cautious", quote: "Agentic AI is exciting but the failure modes at scale are not well understood yet." } ], watchPoints: ["Agent reliability benchmarks — industry standards being developed by MLCommons", "AI coding tool enterprise security — supply chain concerns over AI-generated code", "Model commoditisation — margin pressure on API providers as costs collapse"] },
  policy:   { oneLiner: "AI regulation is diverging sharply in 2026 — the EU is enforcing the AI Act, the US is pursuing a lighter federal touch, China is tightening content controls, and a global governance gap is widening.", topVoices: [ { type: "Regulator", sentiment: "cautious", quote: "The EU AI Act is not perfect but it is the most comprehensive attempt yet to govern AI in the public interest." }, { type: "Analyst", sentiment: "mixed", quote: "Regulatory fragmentation is creating real competitive distortions — a global AI governance framework is urgently needed." }, { type: "Media", sentiment: "negative", quote: "Without international coordination, AI regulation risks being a race to the bottom on safety and a race to the top on protectionism." } ], watchPoints: ["First EU AI Act enforcement actions — expected Q2/Q3 2026", "US federal AI legislation — bipartisan bills stalled but pressure mounting after 2026 election cycle", "Copyright cases — NY Times v OpenAI ruling expected to set industry precedent"] },
  business: { oneLiner: "Enterprise AI adoption is crossing the chasm in 2026 — from pilot projects to core infrastructure. ROI is becoming measurable in specific verticals, but integration complexity and change management remain significant barriers.", topVoices: [ { type: "Investor", sentiment: "positive", quote: "Companies that deploy AI at scale in the next 24 months will have a structural cost advantage that latecomers cannot close." }, { type: "Analyst", sentiment: "mixed", quote: "The AI ROI story is real but uneven — winners are in specific verticals, not across the board." }, { type: "Employee", sentiment: "mixed", quote: "AI has made parts of my job disappear and other parts more interesting — the net effect depends entirely on your manager's vision." } ], watchPoints: ["AI energy consumption — data centre power demand becoming a regulatory and ESG issue", "AI SaaS displacement — traditional software vendors facing existential competitive pressure", "Enterprise AI governance frameworks — boards increasingly demanding AI risk management structures"] },
  research: { oneLiner: "AI research in early 2026 is producing breakthroughs at an accelerating pace — from protein structure prediction to mathematical reasoning — with the boundaries between AI research and scientific discovery increasingly blurred.", topVoices: [ { type: "Researcher", sentiment: "positive", quote: "The convergence of AI and biology is producing discoveries at a rate that would have taken decades by traditional methods." }, { type: "Analyst", sentiment: "positive", quote: "AI research is no longer a subfield of computer science — it is the engine of progress across all of science." }, { type: "Media", sentiment: "cautious", quote: "Every week brings a new 'breakthrough' — separating genuine advances from benchmarking theatre requires deep expertise most journalists lack." } ], watchPoints: ["AlphaFold 3 drug discovery pipeline — first AI-native FDA-approved drug expected 2027-2028", "AGI timeline debate — leading labs diverging sharply on definitions and estimates", "AI research reproducibility crisis — many benchmark claims failing independent verification"] },
};

const voiceColor = (type, T) => {
  const m = { Investor: T.blue, Employee: T.green, Developer: T.green, Member: T.purple, Media: T.yellow, Analyst: T.blue, Regulator: T.red, Researcher: T.purple };
  return m[type] || T.dim;
};

const sentimentColor = (s, T) => {
  if (!s) return T.muted;
  const u = s.toUpperCase();
  if (u === "POSITIVE") return T.green;
  if (u === "NEGATIVE") return T.red;
  return T.yellow;
};

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function cleanTitle(title) {
  // Google News appends " - Source Name" to titles
  return title ? title.replace(/ - [^-]+$/, "") : "";
}

function extractSource(title) {
  const match = title && title.match(/ - ([^-]+)$/);
  return match ? match[1].trim() : "";
}

async function fetchRSS(rssUrl) {
  const res = await fetch(`/api/rss?url=${encodeURIComponent(rssUrl)}`);
  if (!res.ok) throw new Error("RSS fetch failed");
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.items.map(item => ({
    title: item.title,
    source: item.source,
    link: item.link,
    date: formatDate(item.pubDate),
    description: item.description,
  }));
}

function ThemeToggle({ isDark, onToggle, T }) {
  return (
    <button onClick={onToggle} style={{ display:"flex", alignItems:"center", gap:6, background: isDark ? T.panel : T.border, border:`1px solid ${T.border2}`, borderRadius:2, padding:"5px 10px", cursor:"pointer", fontFamily:font, fontSize:11, color:T.dim, transition:"all 0.2s", flexShrink:0 }}>
      <span style={{ fontSize:13 }}>{isDark ? "☀" : "☾"}</span>
      {isDark ? "Light" : "Dark"}
    </button>
  );
}

function ArticleCard({ article, T, isDark }) {
  return (
    <a href={article.link} target="_blank" rel="noopener noreferrer" style={{ display:"block", textDecoration:"none", background: isDark ? T.surface : T.panel, border:`1px solid ${T.border}`, borderLeft:`3px solid ${T.blue}`, padding:"14px 16px", transition:"border-color 0.15s, background 0.3s", cursor:"pointer" }}
      onMouseEnter={e => e.currentTarget.style.borderLeftColor = T.purple}
      onMouseLeave={e => e.currentTarget.style.borderLeftColor = T.blue}
    >
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12, marginBottom:6 }}>
        <span style={{ fontWeight:600, color:T.bright, fontSize:13, lineHeight:1.4 }}>{article.title}</span>
        <span style={{ fontSize:10, color:T.muted, whiteSpace:"nowrap", flexShrink:0, marginTop:2 }}>{article.date}</span>
      </div>
      {article.description && (
        <p style={{ fontSize:12, color:T.dim, lineHeight:1.6, marginBottom:8 }}>{article.description}</p>
      )}
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        {article.source && (
          <span style={{ fontSize:10, color:T.blue, fontWeight:500 }}>{article.source}</span>
        )}
        <span style={{ fontSize:10, color:T.muted }}>↗ Read article</span>
      </div>
    </a>
  );
}

function LoadingSkeleton({ T, isDark }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{ background: isDark ? T.surface : T.panel, border:`1px solid ${T.border}`, borderLeft:`3px solid ${T.border2}`, padding:"14px 16px" }}>
          <div style={{ height:14, background:T.border2, borderRadius:2, width:`${60 + i * 7}%`, marginBottom:10, opacity:0.6 }} />
          <div style={{ height:11, background:T.border2, borderRadius:2, width:"90%", marginBottom:6, opacity:0.4 }} />
          <div style={{ height:11, background:T.border2, borderRadius:2, width:"70%", opacity:0.4 }} />
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [activeId, setActiveId] = useState("news");
  const [isDark, setIsDark] = useState(true);
  const [articles, setArticles] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  const T = isDark ? DARK : LIGHT;
  const activeQuery = QUERIES.find(q => q.id === activeId);
  const staticData = STATIC_DATA[activeId];

  useEffect(() => {
    if (articles[activeId]) return; // already fetched
    setLoading(l => ({ ...l, [activeId]: true }));
    setErrors(e => ({ ...e, [activeId]: null }));
    fetchRSS(activeQuery.rss)
      .then(items => {
        setArticles(a => ({ ...a, [activeId]: items }));
        setLoading(l => ({ ...l, [activeId]: false }));
      })
      .catch(err => {
        setErrors(e => ({ ...e, [activeId]: "Could not load articles. Please try again." }));
        setLoading(l => ({ ...l, [activeId]: false }));
      });
  }, [activeId]);

  const currentArticles = articles[activeId] || [];
  const isLoading = loading[activeId];
  const error = errors[activeId];

  return (
    <div style={{ background:T.bg, minHeight:"100vh", fontFamily:font, color:T.text, fontSize:13, transition:"background 0.3s, color 0.3s" }}>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; background:${T.bg}; }
        ::-webkit-scrollbar-thumb { background:${T.border2}; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade { animation:fadeUp 0.4s ease forwards; }
        .tab-btn:hover { background:${T.border} !important; color:${T.bright} !important; }
        .main-grid { display:grid; grid-template-columns:1fr 300px; gap:16px; }
        .header-subtitle { display:block; }
        .header-title { font-size:17px; }
        @media (max-width: 900px) {
          .main-grid { grid-template-columns:1fr !important; }
          .header-subtitle { display:none !important; }
          .header-title { font-size:14px !important; }
        }
      `}</style>

      {/* HEADER */}
      <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow: isDark ? "none" : "0 1px 4px rgba(13,15,45,0.08)", transition:"background 0.3s" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ background:T.blue, color:"#fff", fontSize:9, letterSpacing:"2px", fontWeight:700, padding:"4px 10px", flexShrink:0 }}>LIVE</div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <img src="/Algoviva White logo.png" alt="Algoviva" style={{ height:28, filter: isDark ? "none" : "invert(1) sepia(1) saturate(2) hue-rotate(190deg)" }} />
            <div className="header-title" style={{ fontWeight:700, color:T.bright, letterSpacing:"1px" }}>◈ AI INTELLIGENCE</div>
            <div className="header-subtitle" style={{ fontSize:10, color:T.muted }}>GLOBAL AI MONITOR · NEWS · ETHICS · TOOLS · POLICY · BUSINESS · RESEARCH</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} T={T} />
          <div style={{ fontSize:10, color:T.muted }}>MAR 2026</div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, display:"flex", overflowX:"auto", transition:"background 0.3s" }}>
        {QUERIES.map(q => (
          <button key={q.id} className="tab-btn" onClick={() => setActiveId(q.id)} style={{
            background: activeId===q.id ? (isDark ? T.panel : T.bg) : "transparent",
            color: activeId===q.id ? T.bright : T.muted,
            border:"none", borderBottom: activeId===q.id ? `2px solid ${T.blue}` : "2px solid transparent",
            borderRight:`1px solid ${T.border}`, padding:"11px 16px", cursor:"pointer",
            fontFamily:font, fontSize:11, whiteSpace:"nowrap",
            display:"flex", alignItems:"center", gap:6, transition:"all 0.15s",
          }}>
            <span style={{ color: activeId===q.id ? T.blue : T.muted, fontSize:13 }}>{q.icon}</span>
            {q.label}
            {loading[q.id] && <span style={{ width:5, height:5, borderRadius:"50%", background:T.yellow, flexShrink:0 }} />}
          </button>
        ))}
      </div>

      {/* BODY */}
      <div style={{ padding:"16px", maxWidth:1300, margin:"0 auto" }}>
        <div className="fade" key={activeId + String(isDark)}>

          {/* SUMMARY */}
          <div style={{ background: isDark ? T.surface : T.panel, borderLeft:`3px solid ${T.blue}`, border:`1px solid ${T.border}`, padding:"14px 20px", marginBottom:16, boxShadow: isDark ? "none" : "0 1px 3px rgba(13,15,45,0.06)", transition:"background 0.3s" }}>
            <div style={{ fontSize:10, letterSpacing:"1.5px", color:T.muted, marginBottom:6, textTransform:"uppercase" }}>Intelligence Summary</div>
            <div style={{ fontSize:14, color:T.bright, lineHeight:1.7 }}>{staticData.oneLiner}</div>
          </div>

          <div className="main-grid">
            {/* ARTICLES */}
            <div>
              <div style={{ fontSize:10, color:T.muted, marginBottom:10, textTransform:"uppercase", letterSpacing:"1.5px" }}>
                {isLoading ? "Loading articles..." : error ? "Error" : `Live Articles · ${currentArticles.length} found`}
              </div>

              {isLoading && <LoadingSkeleton T={T} isDark={isDark} />}

              {error && (
                <div style={{ background: isDark ? T.surface : T.panel, border:`1px solid ${T.border}`, borderLeft:`3px solid ${T.red}`, padding:"16px", color:T.red, fontSize:12 }}>
                  {error}
                </div>
              )}

              {!isLoading && !error && (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {currentArticles.map((article, i) => (
                    <ArticleCard key={i} article={article} T={T} isDark={isDark} />
                  ))}
                </div>
              )}
            </div>

            {/* SIDEBAR */}
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>

              {/* VOICE BREAKDOWN */}
              <div style={{ background: isDark ? T.surface : T.panel, border:`1px solid ${T.border}`, padding:16, boxShadow: isDark ? "none" : "0 1px 3px rgba(13,15,45,0.05)", transition:"background 0.3s" }}>
                <div style={{ fontSize:10, letterSpacing:"1.5px", color:T.muted, marginBottom:12, textTransform:"uppercase" }}>Voice Breakdown</div>
                {staticData.topVoices.map((v, i) => (
                  <div key={i} style={{ paddingBottom:12, marginBottom:12, borderBottom: i < staticData.topVoices.length - 1 ? `1px solid ${T.border}` : "none" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <span style={{ fontSize:11, fontWeight:700, color:voiceColor(v.type, T) }}>{v.type.toUpperCase()}</span>
                      <span style={{ fontSize:10, color:sentimentColor(v.sentiment, T) }}>{v.sentiment.toUpperCase()}</span>
                    </div>
                    <p style={{ fontSize:12, color:T.dim, lineHeight:1.6 }}>{v.quote}</p>
                  </div>
                ))}
              </div>

              {/* WATCH POINTS */}
              <div style={{ background: isDark ? T.surface : T.panel, border:`1px solid ${T.border}`, padding:16, boxShadow: isDark ? "none" : "0 1px 3px rgba(13,15,45,0.05)", transition:"background 0.3s" }}>
                <div style={{ fontSize:10, letterSpacing:"1.5px", color:T.muted, marginBottom:12, textTransform:"uppercase" }}>Watch Points</div>
                {staticData.watchPoints.map((w, i) => (
                  <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
                    <span style={{ color:T.yellow, flexShrink:0 }}>▲</span>
                    <span style={{ fontSize:12, color:T.dim, lineHeight:1.6 }}>{w}</span>
                  </div>
                ))}
              </div>

              {/* ARTICLE COUNT */}
              <div style={{ background: isDark ? T.surface : T.panel, border:`1px solid ${T.border}`, padding:16, display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow: isDark ? "none" : "0 1px 3px rgba(13,15,45,0.05)", transition:"background 0.3s" }}>
                <div>
                  <div style={{ fontSize:10, color:T.muted, marginBottom:4, textTransform:"uppercase", letterSpacing:"1px" }}>Articles</div>
                  <div style={{ fontSize:26, fontWeight:700, color:T.blue }}>{isLoading ? "…" : currentArticles.length}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:10, color:T.muted, marginBottom:4, textTransform:"uppercase", letterSpacing:"1px" }}>Topic</div>
                  <div style={{ fontSize:12, color:T.text }}>{activeQuery.label}</div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop:`1px solid ${T.border}`, padding:"10px 24px", display:"flex", justifyContent:"space-between", fontSize:10, color:T.muted, background: isDark ? T.surface : T.panel, marginTop:24, transition:"background 0.3s" }}>
        <span>AI INTELLIGENCE MONITOR · </span>
        <span>LIVE DATA · {new Date().toLocaleDateString("en-GB", { month:"long", year:"numeric" }).toUpperCase()}</span>
      </div>
    </div>
  );
}