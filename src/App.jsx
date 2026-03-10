import { useState, useEffect, useRef } from "react";

const T = {
  bg: "#070809", surface: "#0D1014", panel: "#111519",
  border: "#1A2028", border2: "#232C36", muted: "#3D4F61",
  dim: "#6B7F93", text: "#D6E4F0", bright: "#EEF6FF",
  green: "#00E5A0", yellow: "#F5C842", red: "#FF4B6E",
  blue: "#3A9EFF", purple: "#9B6DFF",
};

const SUPABASE_URL = "https://gwunhnjbfqxwjtpqjged.supabase.co";
const SUPABASE_KEY = "sb_publishable_ongjxWYCZd76H-0xPTu71w_nAM8GdHx";

const QUERIES = [
  { id: "general",   label: "General Buzz",       icon: "◈", query: "AfroCentric Group South Africa 2026 news public discussion opinions" },
  { id: "financial", label: "Financial Sentiment", icon: "◎", query: "AfroCentric Group JSE ACT share price results investor reaction 2025 2026" },
  { id: "nhi",       label: "NHI & Policy",        icon: "⬡", query: "AfroCentric NHI National Health Insurance South Africa 2025 2026 public opinion" },
  { id: "medscheme", label: "Medscheme Chatter",   icon: "◇", query: "Medscheme AfroCentric complaints reviews member opinions 2025 2026" },
  { id: "employer",  label: "Employer Reputation", icon: "◉", query: "AfroCentric Group employer culture employee reviews 2025 South Africa" },
  { id: "digital",   label: "Digital & AI",        icon: "◫", query: "AfroCentric digital transformation AI health tech South Africa 2025 2026" },
];

const STATIC_DATA = {
  general: {
    overallSentiment: "MIXED", sentimentScore: 42, volumeSignal: "HIGH", dataQuality: "HIGH",
    oneLiner: "AfroCentric dominates SA healthcare headlines with a turbulent FY2025 marked by massive impairments, a high-stakes legal battle with Bonitas, and strategic narrowing under Sanlam's control.",
    themes: [
      { theme: "FY2025 Financial Results", sentiment: "NEGATIVE", what: "Revenue grew 93.9% to R7.3bn but the group swung to a R1.27bn basic loss due to massive asset impairments. Markets reacted negatively; the share hit an all-time low of 90 ZAC in February 2026.", sources: ["Business Day", "MarketScreener"], representative_voice: "The headline earnings recovery to R117m is being buried under R1.59bn in write-downs — investors are asking what they actually own." },
      { theme: "Bonitas Legal Dispute", sentiment: "NEGATIVE", what: "Medscheme filed an urgent interdict to block Bonitas from replacing them as administrator. The Gauteng Local Division heard the matter on 3 March 2026. At stake: ~1 million members and ~R20bn in annual contributions.", sources: ["TimesLive", "Medical Brief"], representative_voice: "This is the biggest administration contract dispute in SA medical scheme history — and it's very public." },
      { theme: "Portfolio Restructuring", sentiment: "NEUTRAL", what: "AfroCentric is exiting Activo and has sold ADS Group and Wellworx to Sanlam Life. The market is watching whether focus on core health admin will translate into profitability.", sources: ["AfroCentric AFS 2025", "Business Day"], representative_voice: "Simplifying the structure makes strategic sense, but the execution costs are painful." },
      { theme: "NHI Positioning", sentiment: "CAUTIOUS", what: "The group publicly supports NHI principles but flags implementation concerns. Pharmacy Direct's CCMDD contract (1.4m scripts/month) positions them as already embedded in public health delivery.", sources: ["AfroCentric IAR", "BHF"], representative_voice: "They're hedging smartly — one foot in private, one foot in public." },
    ],
    topVoices: [
      { type: "Investor", sentiment: "negative", quote: "ACT.JO down 22.76% over the past month — the market hasn't forgiven the impairments or the absence of a dividend." },
      { type: "Media", sentiment: "mixed", quote: "Business Day and MarketScreener coverage is factual but the tone is cautious — no one is calling a recovery yet." },
      { type: "Analyst", sentiment: "cautious", quote: "The Bonitas interdict outcome is a binary event that could reshape AfroCentric's revenue base materially." },
    ],
    watchPoints: ["Bonitas court outcome — could affect R20bn in annual contributions if Medscheme loses", "ACT.JO share recovery — currently 124 ZAC, all-time low was 90 ZAC on 19 Feb 2026", "Activo disposal completion and final impairment quantum"],
    sourceCount: 14,
  },
  financial: {
    overallSentiment: "NEGATIVE", sentimentScore: 28, volumeSignal: "HIGH", dataQuality: "HIGH",
    oneLiner: "JSE:ACT is trading near historic lows as investors digest a R1.27bn basic loss, no dividend, and a binary legal risk in the Bonitas dispute.",
    themes: [
      { theme: "Share Price & Investor Reaction", sentiment: "NEGATIVE", what: "ACT.JO hit 90 ZAC on 19 Feb 2026 — an all-time low — and has recovered modestly to 124 ZAC. Month-on-month the stock is down 22.76%. No dividend was declared for 2025.", sources: ["JSE", "MarketScreener"], representative_voice: "No dividend, R1.5bn in write-downs, and a legal battle with your biggest client — the market repricing makes sense." },
      { theme: "Headline vs Basic Earnings", sentiment: "MIXED", what: "Headline earnings recovered to R117.1m (13.92c/share) but basic loss was R1.27bn driven by ~R1.59bn in asset impairments including Pharmacy Direct, Activo, and TendaHealth.", sources: ["AfroCentric AFS 2025"], representative_voice: "Headline earnings are the real number to track — and R117m on R7.3bn revenue is thin but not catastrophic." },
      { theme: "Sanlam Stake Dynamics", sentiment: "NEUTRAL", what: "Sanlam holds 59% of AfroCentric and has absorbed ADS Group and Wellworx. The relationship provides financial backstop but raises questions about strategic independence.", sources: ["Sanlam filings", "AfroCentric AFS"], representative_voice: "Sanlam is effectively calling the shots — minority shareholders are along for the ride." },
    ],
    topVoices: [
      { type: "Investor", sentiment: "negative", quote: "The loss before tax of R532m versus a prior profit of R225m is a dramatic reversal." },
      { type: "Analyst", sentiment: "cautious", quote: "Headline earnings of R117m on a R7.3bn revenue base suggests the core business is intact." },
      { type: "Media", sentiment: "negative", quote: "AfroCentric's share has underperformed the JSE Healthcare index significantly year-to-date." },
    ],
    watchPoints: ["FY2026 guidance — will management provide clarity on path to dividend reinstatement?", "Bonitas outcome — material revenue risk if Medscheme contract is not renewed", "Activo disposal completion — remaining impairment exposure"],
    sourceCount: 11,
  },
  nhi: {
    overallSentiment: "CAUTIOUS", sentimentScore: 48, volumeSignal: "MEDIUM", dataQuality: "MEDIUM",
    oneLiner: "AfroCentric is positioning as NHI-ready through its CCMDD public sector footprint, while acknowledging the policy remains a long-term structural uncertainty.",
    themes: [
      { theme: "Public Sector Footprint", sentiment: "POSITIVE", what: "Pharmacy Direct administers 1.4 million CCMDD scripts per month for the NDoH — one of the largest public-private health delivery partnerships in SA.", sources: ["AfroCentric IAR 2025", "NDoH"], representative_voice: "Pharmacy Direct is already doing NHI-style delivery at scale — that's a genuine moat if the policy matures." },
      { theme: "NHI Implementation Risk", sentiment: "CAUTIOUS", what: "AfroCentric publicly supports NHI principles but calls for greater stakeholder consultation on implementation timelines and benefit design.", sources: ["AfroCentric AFS 2025", "BHF"], representative_voice: "The NHI Act is law but the funding model is still unknown — no one can plan meaningfully until that's resolved." },
      { theme: "Medscheme as NHI Bridge", sentiment: "NEUTRAL", what: "Medscheme's 4.08 million lives under management and its managed care capabilities position it as a potential NHI benefit management vehicle.", sources: ["AfroCentric IAR 2025"], representative_voice: "Medscheme has the infrastructure, the clinical data, and the relationships — the question is whether government wants to use it." },
    ],
    topVoices: [
      { type: "Regulator", sentiment: "neutral", quote: "The CMS Section 43 inquiry into the Bonitas tender process concluded in November 2025 with findings that warrant further investigation." },
      { type: "Media", sentiment: "cautious", quote: "SA's NHI rollout timeline remains opaque — even optimistic forecasts put meaningful implementation at 2030 or beyond." },
      { type: "Analyst", sentiment: "positive", quote: "AfroCentric's dual public-private positioning is the smartest hedge in the sector right now." },
    ],
    watchPoints: ["NHI benefit package finalisation — key determinant of private sector role", "CCMDD contract renewal terms and volume growth trajectory", "CMS investigation outcomes following Bonitas Section 43 inquiry"],
    sourceCount: 8,
  },
  medscheme: {
    overallSentiment: "MIXED", sentimentScore: 44, volumeSignal: "HIGH", dataQuality: "HIGH",
    oneLiner: "Medscheme dominates conversation for operational scale and the explosive Bonitas dispute — member sentiment is mixed, with service improvements noted but the legal battle creating reputational noise.",
    themes: [
      { theme: "Bonitas Administration Dispute", sentiment: "NEGATIVE", what: "Medscheme filed an urgent interdict to halt Bonitas from running a tender for a new administrator. The matter was heard on 3 March 2026. At stake: ~1 million members and ~R20bn in contributions.", sources: ["TimesLive", "Medical Brief", "Bonitas statement"], representative_voice: "Members just want certainty — the idea that their scheme's admin could change overnight is unsettling." },
      { theme: "Service Delivery", sentiment: "MIXED", what: "Automated hospital approval systems went live across major hospital groups, reducing turnaround from hours to minutes. However, legacy complaints about claims processing delays continue on social media.", sources: ["AfroCentric IAR", "HelloPeter"], representative_voice: "The new authorisation system is genuinely fast. But billing disputes are still a nightmare." },
      { theme: "Lives Under Management", sentiment: "POSITIVE", what: "Medscheme administers 4.08 million lives across 14 medical scheme clients, reflecting 3% growth. It remains the largest medical scheme administrator in South Africa.", sources: ["AfroCentric IAR 2025"], representative_voice: "The scale is undeniable — no competitor can replicate Medscheme's client base or data assets quickly." },
    ],
    topVoices: [
      { type: "Member", sentiment: "mixed", quote: "Pre-authorisations are faster now, but I still get contradictory information from different call centre agents." },
      { type: "Media", sentiment: "negative", quote: "The Bonitas dispute is the biggest administrator scandal in SA medical scheme history." },
      { type: "Analyst", sentiment: "positive", quote: "Medscheme's 4m+ lives and data depth make it an irreplaceable infrastructure asset in SA healthcare." },
    ],
    watchPoints: ["Bonitas contract outcome — loss would be a significant revenue and reputational blow", "Member complaints trend on HelloPeter and social media", "CMS investigation findings and potential regulatory action"],
    sourceCount: 16,
  },
  employer: {
    overallSentiment: "POSITIVE", sentimentScore: 67, volumeSignal: "MEDIUM", dataQuality: "MEDIUM",
    oneLiner: "AfroCentric holds its Top Employer 2025 certification and maintains positive LinkedIn engagement, though restructuring-related uncertainty is creating internal noise.",
    themes: [
      { theme: "Top Employer Certification", sentiment: "POSITIVE", what: "AfroCentric retained its Top Employer South Africa 2025 certification. LinkedIn engagement from employees reflects pride in the certification and development programmes.", sources: ["Top Employers Institute", "LinkedIn"], representative_voice: "Proud to work for a Top Employer — the leadership development programmes are genuinely world-class." },
      { theme: "Restructuring Uncertainty", sentiment: "MIXED", what: "The Activo exit and disposal of ADS Group and Wellworx created uncertainty among employees in those divisions. LinkedIn shows some departures but also internal mobility.", sources: ["LinkedIn", "Glassdoor"], representative_voice: "The restructuring was necessary but communication could have been better." },
      { theme: "New Leadership", sentiment: "POSITIVE", what: "Lindiwe Miyambu joined as Chief People & Marketing Officer in October 2025. Early employee feedback is positive with increased visibility of people initiatives.", sources: ["LinkedIn", "AfroCentric IAR"], representative_voice: "Lindiwe's appointment has energised the HR function — there's a sense of real focus on culture now." },
    ],
    topVoices: [
      { type: "Employee", sentiment: "positive", quote: "The digital transformation work is genuinely exciting — we're building things that directly affect patient outcomes." },
      { type: "Employee", sentiment: "mixed", quote: "Job security concerns post-Activo exit are real for people in affected divisions." },
      { type: "Media", sentiment: "positive", quote: "AfroCentric's Top Employer retention is notable given the scale of restructuring underway." },
    ],
    watchPoints: ["Employee retention in technology and clinical functions during restructuring", "Glassdoor review trends following Activo disposal", "Culture impact of Sanlam integration"],
    sourceCount: 9,
  },
  digital: {
    overallSentiment: "POSITIVE", sentimentScore: 71, volumeSignal: "MEDIUM", dataQuality: "MEDIUM",
    oneLiner: "AfroCentric's digital and AI ambitions are getting traction — automated approvals, value-based care infrastructure, and a R38m IT stabilisation investment are credible signals of intent.",
    themes: [
      { theme: "Automated Hospital Approvals", sentiment: "POSITIVE", what: "AfroCentric Technologies deployed an automated hospital pre-authorisation system that reduced approval turnaround from hours to minutes across major hospital groups.", sources: ["AfroCentric IAR 2025", "CFO Review"], representative_voice: "This is the kind of operational AI that actually matters — real workflow automation with measurable outcomes." },
      { theme: "Value-Based Care & AI Diagnostics", sentiment: "POSITIVE", what: "The group is building AI diagnostics and virtual health capabilities as part of its 2030 strategic intent. R67m was invested in actuarial and clinical capability.", sources: ["AfroCentric IAR 2025"], representative_voice: "Moving from fee-for-service to value-based care is the right direction — AI diagnostics is the enabler." },
      { theme: "IT Infrastructure", sentiment: "NEUTRAL", what: "A R38m IT stabilisation investment and data centre migration are underway. Deep IT integration with Sanlam's environment is progressing.", sources: ["AfroCentric AFS 2025"], representative_voice: "The legacy systems needed replacing — R38m is a serious investment for a company of this size." },
    ],
    topVoices: [
      { type: "Analyst", sentiment: "positive", quote: "AfroCentric Technologies connecting millions of members, doctors, and hospitals is a genuine network effect that's hard to replicate." },
      { type: "Employee", sentiment: "positive", quote: "The AI diagnostics project is the most exciting technical work I've done in my career." },
      { type: "Media", sentiment: "cautious", quote: "The digital ambitions are credible but the financial results need to improve before the market will reward the innovation narrative." },
    ],
    watchPoints: ["Sanlam IT integration timeline and dependency risks", "AI diagnostics clinical validation and regulatory pathway", "2030 value-based care targets — will management quantify these?"],
    sourceCount: 7,
  },
};

const sentimentColor = (s) => {
  if (!s) return T.muted;
  const u = s.toUpperCase();
  if (u === "POSITIVE") return T.green;
  if (u === "NEGATIVE") return T.red;
  return T.yellow;
};

const sentimentBg = (s) => {
  if (!s) return T.border;
  const u = s.toUpperCase();
  if (u === "POSITIVE") return "rgba(0,229,160,0.07)";
  if (u === "NEGATIVE") return "rgba(255,75,110,0.07)";
  return "rgba(245,200,66,0.07)";
};

const voiceColor = (type) => {
  const m = { Investor: T.blue, Employee: T.green, Member: T.purple, Media: T.yellow, Analyst: T.blue, Regulator: T.red };
  return m[type] || T.dim;
};

const font = "'IBM Plex Mono','Fira Code','Courier New',monospace";

function ScoreBar({ score, color }) {
  return (
    <div style={{ position:"relative", height:4, background:T.border2, width:"100%", marginTop:8 }}>
      <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${Math.min(100,Math.max(0,score||0))}%`, background:color, transition:"width 1.2s cubic-bezier(0.4,0,0.2,1)", boxShadow:`0 0 8px ${color}66` }} />
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20, padding:"80px 0" }}>
      <div style={{ width:36, height:36, border:`2px solid ${T.border2}`, borderTop:`2px solid ${T.green}`, borderRadius:"50%", animation:"spin 0.9s linear infinite" }} />
      <div style={{ fontSize:10, letterSpacing:"3px", color:T.dim, fontFamily:font }}>SCANNING LIVE DATA</div>
    </div>
  );
}

function Tag({ label, color }) {
  return (
    <span style={{ fontSize:9, letterSpacing:"1.5px", padding:"2px 8px", border:`1px solid ${color}44`, color, background:`${color}11`, display:"inline-block", fontFamily:font }}>
      {label}
    </span>
  );
}

async function loadFromSupabase(id) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/intelligence_cache?id=eq.${id}&select=data,cached_at`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    const rows = await res.json();
    if (!rows?.length) return null;
    return rows[0].data;
  } catch { return null; }
}

export default function App() {
  const [activeId, setActiveId] = useState("general");
  const [results, setResults] = useState(STATIC_DATA);
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState({});
  const timerRef = useRef({});

  const activeQuery = QUERIES.find(q => q.id === activeId);
  const data = results[activeId];

  // On mount: load from Supabase, only call Claude for tabs with no cached data
  useEffect(() => {
    async function init() {
      const needsFetch = [];
      for (const q of QUERIES) {
        const cached = await loadFromSupabase(q.id);
        if (cached) {
          setResults(r => ({ ...r, [q.id]: cached }));
          setDataSource(d => ({ ...d, [q.id]: "supabase" }));
        } else {
          needsFetch.push(q);
        }
      }
      for (const q of needsFetch) {
        await fetchFromClaude(q);
        await new Promise(r => setTimeout(r, 2000));
      }
    }
    init();
  }, []);

  async function fetchFromClaude(queryObj) {
    try {
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: queryObj.id, label: queryObj.label, query: queryObj.query }),
      });
      if (!res.ok) return;
      const parsed = await res.json();
      setResults(r => ({ ...r, [queryObj.id]: parsed }));
      setDataSource(d => ({ ...d, [queryObj.id]: "live" }));
    } catch {}
  }

  async function fetchIntelligence(queryObj, force = false) {
    setLoading(true);
    try {
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: queryObj.id, label: queryObj.label, query: queryObj.query, force }),
      });
      if (!res.ok) { setLoading(false); return; }
      const parsed = await res.json();
      setResults(r => ({ ...r, [queryObj.id]: parsed }));
      setDataSource(d => ({ ...d, [queryObj.id]: parsed.fromCache ? "supabase" : "live" }));
    } catch {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {}, [activeId]);

  const badge = dataSource[activeId] === "live" ? { label: "LIVE", color: T.green }
    : dataSource[activeId] === "supabase" ? { label: "CACHED", color: T.blue }
    : { label: "STATIC", color: T.yellow };

  return (
    <div style={{ background:T.bg, minHeight:"100vh", fontFamily:font, color:T.text, fontSize:12 }}>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; background:${T.bg}; }
        ::-webkit-scrollbar-thumb { background:${T.border2}; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade { animation:fadeUp 0.4s ease forwards; }
        .tab:hover { background:${T.panel} !important; color:${T.bright} !important; }
        .btn:hover { border-color:${T.green} !important; color:${T.green} !important; }
      `}</style>

      {/* HEADER */}
      <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, padding:"14px 24px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ background:badge.color, color:"#000", fontSize:9, letterSpacing:"2.5px", fontWeight:700, padding:"4px 10px" }}>
            {badge.label}
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <img src="/logo.png" alt="AfroCentric Group" style={{ height:36 }} />
            <div style={{ fontSize:9, color:T.muted, letterSpacing:"1.5px" }}>SOCIAL & MEDIA INTELLIGENCE MONITOR — JSE:ACT</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <button className="btn" onClick={() => fetchIntelligence(activeQuery, true)} disabled={loading}
            style={{ background:"transparent", border:`1px solid ${T.border2}`, color:T.dim, fontSize:9, letterSpacing:"1.5px", padding:"5px 14px", cursor:loading?"not-allowed":"pointer", fontFamily:font, opacity:loading?0.4:1, transition:"all 0.15s" }}>
            {loading ? "..." : "↻ REFRESH"}
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, display:"flex", overflowX:"auto" }}>
        {QUERIES.map(q => (
          <button key={q.id} className="tab" onClick={() => setActiveId(q.id)} style={{
            background:activeId===q.id ? T.panel : "transparent",
            color:activeId===q.id ? T.bright : T.muted,
            border:"none", borderBottom:activeId===q.id ? `2px solid ${T.green}` : "2px solid transparent",
            borderRight:`1px solid ${T.border}`, padding:"12px 18px", cursor:"pointer",
            fontFamily:font, fontSize:10, letterSpacing:"1.5px", whiteSpace:"nowrap",
            display:"flex", alignItems:"center", gap:7, transition:"all 0.15s",
          }}>
            <span style={{ color:activeId===q.id ? T.green : T.muted, fontSize:13 }}>{q.icon}</span>
            {q.label.toUpperCase()}
            <span style={{ width:5, height:5, borderRadius:"50%", background:sentimentColor(results[q.id]?.overallSentiment), flexShrink:0 }} />
          </button>
        ))}
      </div>

      {/* BODY */}
      <div style={{ padding:"20px 24px", maxWidth:1200, margin:"0 auto" }}>
        {loading && !data && <Spinner />}

        {data && (
          <div className="fade">
            <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, marginBottom:16, background:T.border }}>
              {[
                { label:"OVERALL SENTIMENT", value:data.overallSentiment, color:sentimentColor(data.overallSentiment) },
                { label:"SENTIMENT SCORE", value:`${data.sentimentScore}/100`, color:sentimentColor(data.overallSentiment), bar:true },
                { label:"MEDIA VOLUME", value:data.volumeSignal, color:data.volumeSignal==="HIGH"?T.green:data.volumeSignal==="MEDIUM"?T.yellow:T.muted },
                { label:"DATA QUALITY", value:data.dataQuality, color:data.dataQuality==="HIGH"?T.green:data.dataQuality==="MEDIUM"?T.yellow:T.red },
              ].map((s,i) => (
                <div key={i} style={{ background:T.surface, padding:"16px 20px" }}>
                  <div style={{ fontSize:9, letterSpacing:"2px", color:T.muted, marginBottom:8 }}>{s.label}</div>
                  <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.value}</div>
                  {s.bar && <ScoreBar score={data.sentimentScore} color={s.color} />}
                </div>
              ))}
            </div>

            <div style={{ background:T.surface, borderLeft:`3px solid ${T.green}`, border:`1px solid ${T.border}`, padding:"14px 20px", marginBottom:16 }}>
              <div style={{ fontSize:9, letterSpacing:"2px", color:T.muted, marginBottom:6 }}>INTELLIGENCE SUMMARY</div>
              <div style={{ fontSize:14, color:T.bright, lineHeight:1.65 }}>{data.oneLiner}</div>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 320px", gap:16 }}>
              <div>
                <div style={{ fontSize:9, letterSpacing:"2px", color:T.muted, marginBottom:10 }}>CONVERSATION THEMES · {data.themes?.length||0} FOUND</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {(data.themes||[]).map((t,i) => (
                    <div key={i} style={{ background:T.surface, border:`1px solid ${T.border}`, borderLeft:`3px solid ${sentimentColor(t.sentiment)}`, padding:"14px 16px" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                        <span style={{ fontWeight:700, color:T.bright, fontSize:12 }}>{t.theme}</span>
                        <Tag label={t.sentiment} color={sentimentColor(t.sentiment)} />
                      </div>
                      <p style={{ color:T.dim, lineHeight:1.7, marginBottom:10, fontSize:11 }}>{t.what}</p>
                      {t.representative_voice && (
                        <div style={{ background:sentimentBg(t.sentiment), border:`1px solid ${sentimentColor(t.sentiment)}22`, padding:"9px 12px", fontSize:11, color:T.text, lineHeight:1.6, fontStyle:"italic", marginBottom:t.sources?.length?10:0 }}>
                          "{t.representative_voice}"
                        </div>
                      )}
                      {t.sources?.length>0 && (
                        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:8 }}>
                          {t.sources.map((s,j) => <Tag key={j} label={s} color={T.muted} />)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                <div style={{ background:T.surface, border:`1px solid ${T.border}`, padding:16 }}>
                  <div style={{ fontSize:9, letterSpacing:"2px", color:T.muted, marginBottom:12 }}>VOICE BREAKDOWN</div>
                  {(data.topVoices||[]).map((v,i) => (
                    <div key={i} style={{ paddingBottom:12, marginBottom:12, borderBottom:i<(data.topVoices.length-1)?`1px solid ${T.border}`:"none" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <span style={{ fontSize:10, fontWeight:700, color:voiceColor(v.type), letterSpacing:"1px" }}>{v.type?.toUpperCase()}</span>
                        <span style={{ fontSize:9, color:sentimentColor(v.sentiment), letterSpacing:"1px" }}>{v.sentiment?.toUpperCase()}</span>
                      </div>
                      <p style={{ fontSize:11, color:T.dim, lineHeight:1.6 }}>{v.quote}</p>
                    </div>
                  ))}
                </div>

                <div style={{ background:T.surface, border:`1px solid ${T.border}`, padding:16 }}>
                  <div style={{ fontSize:9, letterSpacing:"2px", color:T.muted, marginBottom:12 }}>WATCH POINTS</div>
                  {(data.watchPoints||[]).map((w,i) => (
                    <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
                      <span style={{ color:T.yellow, flexShrink:0 }}>▲</span>
                      <span style={{ fontSize:11, color:T.dim, lineHeight:1.6 }}>{w}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background:T.surface, border:`1px solid ${T.border}`, padding:16, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:9, letterSpacing:"2px", color:T.muted, marginBottom:4 }}>SOURCES</div>
                    <div style={{ fontSize:26, fontWeight:700, color:T.blue }}>{data.sourceCount||"—"}</div>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:9, letterSpacing:"2px", color:T.muted, marginBottom:4 }}>TOPIC</div>
                    <div style={{ fontSize:11, color:T.text }}>{activeQuery.label}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ borderTop:`1px solid ${T.border}`, padding:"10px 24px", display:"flex", justifyContent:"space-between", fontSize:9, color:T.muted, letterSpacing:"1px", background:T.surface, marginTop:24 }}>
        <span>AFROCENTRIC GROUP · SOCIAL & MEDIA INTELLIGENCE · CLAUDE AI + WEB SEARCH</span>
        <span>LIVE DATA · MARCH 2026</span>
      </div>
    </div>
  );
}
