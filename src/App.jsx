import { useState } from "react";

const DARK = {
  bg: "#07080F",
  surface: "#0D0F1E",
  panel: "#111428",
  border: "#1A1F3A",
  border2: "#222845",
  muted: "#3D4F6B",
  dim: "#6B7F9E",
  text: "#C8D4E8",
  bright: "#EEF2FF",
  green: "#00C853",
  yellow: "#F5A623",
  red: "#E63946",
  blue: "#2B4EFF",
  purple: "#1E3FD8",
};

const LIGHT = {
  bg: "#EDF0F4",
  surface: "#F5F7FA",
  panel: "#FFFFFF",
  border: "#D6DCE8",
  border2: "#C2CBDA",
  muted: "#8A97AD",
  dim: "#5A6882",
  text: "#1A2340",
  bright: "#0D0F2D",
  green: "#00A846",
  yellow: "#D4880A",
  red: "#C92F3A",
  blue: "#2B4EFF",
  purple: "#1E3FD8",
};

const QUERIES = [
  { id: "news",     label: "AI News & Buzz",          icon: "◈" },
  { id: "ethics",   label: "Responsible AI",           icon: "◎" },
  { id: "tools",    label: "AI Tools & Models",        icon: "⬡" },
  { id: "policy",   label: "AI Policy & Regulation",   icon: "◇" },
  { id: "business", label: "AI in Business",           icon: "◉" },
  { id: "research", label: "Research Breakthroughs",   icon: "◫" },
];

const STATIC_DATA = {
  news: {
    overallSentiment: "POSITIVE", sentimentScore: 74,
    oneLiner: "The AI news cycle in early 2026 is dominated by GPT-5 and Gemini Ultra 2 launches, open-source momentum from Meta and Mistral, and a wave of multimodal breakthroughs reshaping how the world interacts with AI.",
    themes: [
      { theme: "GPT-5 & Frontier Model Race", sentiment: "POSITIVE", what: "OpenAI's GPT-5 launched in February 2026 with significantly improved reasoning, coding, and multimodal capabilities. Google responded with Gemini Ultra 2. The frontier race is accelerating with 6-month release cycles now the norm.", sources: ["The Verge", "TechCrunch", "Ars Technica"], representative_voice: "GPT-5 isn't just an upgrade — it feels like a generational leap in how the model reasons through ambiguous problems." },
      { theme: "Open-Source AI Surge", sentiment: "POSITIVE", what: "Meta's Llama 4 and Mistral Large 3 have closed much of the gap with closed frontier models. Open-source AI adoption in enterprises is up 3x year-on-year as teams seek cost control and customisation.", sources: ["Hugging Face Blog", "VentureBeat"], representative_voice: "We switched our internal tooling to Llama 4 fine-tuned on our data — the performance difference vs GPT-4 is negligible at 10% of the cost." },
      { theme: "Multimodal AI Goes Mainstream", sentiment: "POSITIVE", what: "Voice, video, and image understanding are now standard features across leading models. Real-time voice assistants powered by GPT-4o successors are replacing traditional IVR systems across industries.", sources: ["MIT Technology Review", "Wired"], representative_voice: "The multimodal demos are impressive but the real story is how fast this is moving into production pipelines." },
      { theme: "AI Hype vs Reality Debate", sentiment: "MIXED", what: "A growing chorus of researchers and investors is questioning whether AI revenue growth justifies current valuations. Several high-profile AI startups have quietly downgraded their AGI timelines.", sources: ["Bloomberg", "Financial Times"], representative_voice: "The demos are stunning. The enterprise ROI numbers are still being written — and that's a problem for a market pricing in perfection." },
    ],
    topVoices: [
      { type: "Researcher", sentiment: "positive", quote: "2026 is the year AI moves from impressive demos to genuinely indispensable infrastructure." },
      { type: "Investor", sentiment: "mixed", quote: "The AI investment cycle is maturing — we're moving from fear-of-missing-out to show-me-the-numbers." },
      { type: "Media", sentiment: "positive", quote: "Every week there's a new benchmark shattered — the pace of progress is genuinely unprecedented." },
    ],
    watchPoints: ["GPT-5 enterprise adoption rates — early signals suggest faster uptake than GPT-4", "Open-source vs closed model debate — regulatory pressure may favour open approaches", "AI bubble concerns — several analysts flagging overvaluation in AI infrastructure plays"],
    sourceCount: 22,
  },
  ethics: {
    overallSentiment: "CAUTIOUS", sentimentScore: 45,
    oneLiner: "Responsible AI discourse in 2026 is intense and increasingly urgent — bias incidents, deepfake proliferation, and workforce displacement concerns are driving calls for binding standards beyond voluntary commitments.",
    themes: [
      { theme: "AI Bias & Fairness Incidents", sentiment: "NEGATIVE", what: "Multiple high-profile cases of AI hiring tools and lending algorithms demonstrating racial and gender bias were documented in Q1 2026. The EU AI Act's bias testing requirements are exposing gaps in model development practices.", sources: ["AI Now Institute", "Reuters"], representative_voice: "These aren't edge cases — they're systemic failures baked into training data that no one is being held accountable for." },
      { theme: "Deepfakes & Synthetic Media", sentiment: "NEGATIVE", what: "Deepfake detection is losing the arms race against generation. Election-related synthetic media incidents across multiple countries in 2025-2026 have accelerated calls for mandatory provenance labelling on AI-generated content.", sources: ["Stanford Internet Observatory", "BBC"], representative_voice: "We can no longer assume any video or voice recording is authentic without independent verification. That's a civilisational problem." },
      { theme: "AI Safety Research Momentum", sentiment: "POSITIVE", what: "Anthropic, DeepMind, and a new wave of academic labs are publishing interpretability and alignment research at record pace. Constitutional AI and RLHF advances are making models measurably safer and more honest.", sources: ["Anthropic Research", "DeepMind Blog"], representative_voice: "The alignment field has matured dramatically — we have actual techniques now, not just theoretical frameworks." },
      { theme: "Workforce Displacement Debate", sentiment: "MIXED", what: "Studies conflict on AI's net employment effect. White-collar automation is accelerating in legal, finance, and customer service. Retraining initiatives from governments and tech firms are struggling to match the pace of displacement.", sources: ["McKinsey Global Institute", "ILO"], representative_voice: "The jobs aren't disappearing overnight — they're being hollowed out gradually, which is harder to see and harder to respond to." },
    ],
    topVoices: [
      { type: "Regulator", sentiment: "cautious", quote: "Voluntary AI ethics commitments have not been sufficient — binding standards with real enforcement are now necessary." },
      { type: "Researcher", sentiment: "mixed", quote: "The safety research is promising but it's outpaced by capabilities development by a significant margin." },
      { type: "Analyst", sentiment: "negative", quote: "Deepfake proliferation is the most immediate societal harm from AI and it is largely unaddressed." },
    ],
    watchPoints: ["EU AI Act enforcement — first major fines expected in mid-2026", "Synthetic media labelling standards — ISO and W3C working groups expected to publish drafts Q2 2026", "AI bias litigation — several class action suits progressing through US courts"],
    sourceCount: 18,
  },
  tools: {
    overallSentiment: "POSITIVE", sentimentScore: 81,
    oneLiner: "The AI tools landscape in 2026 is exploding — coding assistants, AI agents, and multimodal platforms are reshaping developer and knowledge worker productivity, with agentic AI emerging as the defining paradigm shift.",
    themes: [
      { theme: "Agentic AI & Autonomous Workflows", sentiment: "POSITIVE", what: "AI agents that can browse the web, write and execute code, manage files, and chain complex multi-step tasks are moving from research demos to production tools.", sources: ["Anthropic Blog", "OpenAI Research", "The Verge"], representative_voice: "Agents aren't just chatbots with tools — they're the first genuine AI coworkers, and the productivity delta is staggering." },
      { theme: "Coding Assistants Dominate Developer Workflow", sentiment: "POSITIVE", what: "GitHub Copilot, Cursor, and Claude Code now handle 40-60% of code written in enterprise environments according to multiple surveys.", sources: ["GitHub Octoverse 2025", "Stack Overflow Survey"], representative_voice: "I genuinely cannot imagine going back to coding without AI assistance — it's not about replacing me, it's about removing the boring parts." },
      { theme: "AI Model Cost Collapse", sentiment: "POSITIVE", what: "Inference costs have dropped 90%+ over the past 18 months. GPT-4-level capability is now available for under $1/million tokens, democratising AI access for startups and individual developers.", sources: ["a16z AI Report", "Artificial Analysis"], representative_voice: "The cost curve is following a path even more aggressive than Moore's Law — what costs $100 today will cost $1 in 18 months." },
      { theme: "Hallucination & Reliability Challenges", sentiment: "MIXED", what: "Despite significant advances, hallucination remains a persistent challenge for production AI deployments. RAG and grounding techniques are mitigating but not eliminating the problem.", sources: ["HELM Benchmark", "Scale AI"], representative_voice: "RAG gets you 80% of the way there. The last 20% — high-stakes decisions where errors have real consequences — is still a human job." },
    ],
    topVoices: [
      { type: "Developer", sentiment: "positive", quote: "Claude Code and Cursor together have made me at least 3x more productive — that's not hyperbole, I've measured it." },
      { type: "Analyst", sentiment: "positive", quote: "The AI tools market is the fastest-growing software category in history — and it's still early innings." },
      { type: "Researcher", sentiment: "cautious", quote: "Agentic AI is exciting but the failure modes at scale are not well understood yet." },
    ],
    watchPoints: ["Agent reliability benchmarks — industry standards being developed by MLCommons", "AI coding tool enterprise security — supply chain concerns over AI-generated code", "Model commoditisation — margin pressure on API providers as costs collapse"],
    sourceCount: 19,
  },
  policy: {
    overallSentiment: "MIXED", sentimentScore: 50,
    oneLiner: "AI regulation is diverging sharply in 2026 — the EU is enforcing the AI Act, the US is pursuing a lighter federal touch, China is tightening content controls, and a global governance gap is widening.",
    themes: [
      { theme: "EU AI Act Enforcement Begins", sentiment: "CAUTIOUS", what: "The EU AI Act's high-risk provisions took effect in February 2026. Companies deploying AI in hiring, credit, healthcare, and law enforcement must now comply with mandatory audits, documentation, and bias testing.", sources: ["European Commission", "IAPP"], representative_voice: "The compliance burden is real but manageable for large enterprises. It's the SMEs building on top of foundation models that face the biggest challenge." },
      { theme: "US Federal AI Policy Fragmentation", sentiment: "MIXED", what: "The US has no comprehensive federal AI law. State-level legislation is proliferating — California, Texas, and Colorado have passed conflicting AI bills creating a patchwork compliance environment.", sources: ["Congressional Research Service", "NIST"], representative_voice: "American companies are managing 12 different state AI compliance frameworks while competitors in Europe deal with one. That's a real cost." },
      { theme: "China AI Governance Tightening", sentiment: "NEGATIVE", what: "China has implemented mandatory registration for generative AI services and strict content controls. International AI companies face significant barriers to the Chinese market.", sources: ["CSET Georgetown", "South China Morning Post"], representative_voice: "We're watching the internet split in two happen again — but with AI, the implications for geopolitics and science are far more profound." },
      { theme: "AI & Intellectual Property", sentiment: "NEGATIVE", what: "Landmark copyright cases in the US and UK involving AI training data are progressing through courts. The outcomes will define the legal basis for training foundation models on web-scraped content.", sources: ["Reuters", "IPO UK"], representative_voice: "Every major AI company has existential copyright exposure right now. The legal industry is going to feast on this for a decade." },
    ],
    topVoices: [
      { type: "Regulator", sentiment: "cautious", quote: "The EU AI Act is not perfect but it is the most comprehensive attempt yet to govern AI in the public interest." },
      { type: "Analyst", sentiment: "mixed", quote: "Regulatory fragmentation is creating real competitive distortions — a global AI governance framework is urgently needed." },
      { type: "Media", sentiment: "negative", quote: "Without international coordination, AI regulation risks being a race to the bottom on safety and a race to the top on protectionism." },
    ],
    watchPoints: ["First EU AI Act enforcement actions — expected Q2/Q3 2026", "US federal AI legislation — bipartisan bills stalled but pressure mounting after 2026 election cycle", "Copyright cases — NY Times v OpenAI ruling expected to set industry precedent"],
    sourceCount: 15,
  },
  business: {
    overallSentiment: "POSITIVE", sentimentScore: 69,
    oneLiner: "Enterprise AI adoption is crossing the chasm in 2026 — from pilot projects to core infrastructure. ROI is becoming measurable in specific verticals, but integration complexity and change management remain significant barriers.",
    themes: [
      { theme: "Enterprise AI ROI Emerges", sentiment: "POSITIVE", what: "Financial services, healthcare, and legal sectors are reporting measurable AI ROI — 20-40% productivity gains in specific workflows.", sources: ["McKinsey", "Gartner"], representative_voice: "We've moved past the pilot phase. AI is now in our core workflows and the productivity data is unambiguous — it works." },
      { theme: "AI Infrastructure Investment Boom", sentiment: "POSITIVE", what: "Global AI infrastructure spend is projected at $300bn in 2026 — data centres, GPU clusters, and energy infrastructure. Power consumption concerns are becoming a board-level issue.", sources: ["IDC", "Bloomberg Intelligence"], representative_voice: "The AI infrastructure buildout is the largest capital expenditure cycle since the internet — and it's happening in 5 years, not 20." },
      { theme: "AI Startups & VC Landscape", sentiment: "MIXED", what: "AI startup funding hit $85bn in 2025 but Q1 2026 shows signs of cooling. Investors are demanding clearer paths to profitability.", sources: ["PitchBook", "Crunchbase"], representative_voice: "The AI wrapper startup era is ending — differentiated data, proprietary workflows, and defensible distribution are what investors want now." },
      { theme: "Change Management & AI Adoption", sentiment: "MIXED", what: "The biggest barrier to enterprise AI adoption is not technology — it's people. Fear of job displacement, lack of AI literacy, and cultural resistance are slowing deployment even where ROI is proven.", sources: ["Deloitte AI Survey 2026", "HBR"], representative_voice: "We have the technology deployed. Getting people to actually use it consistently is a harder problem than building it." },
    ],
    topVoices: [
      { type: "Investor", sentiment: "positive", quote: "Companies that deploy AI at scale in the next 24 months will have a structural cost advantage that latecomers cannot close." },
      { type: "Analyst", sentiment: "mixed", quote: "The AI ROI story is real but uneven — winners are in specific verticals, not across the board." },
      { type: "Employee", sentiment: "mixed", quote: "AI has made parts of my job disappear and other parts more interesting — the net effect depends entirely on your manager's vision." },
    ],
    watchPoints: ["AI energy consumption — data centre power demand becoming a regulatory and ESG issue", "AI SaaS displacement — traditional software vendors facing existential competitive pressure", "Enterprise AI governance frameworks — boards increasingly demanding AI risk management structures"],
    sourceCount: 20,
  },
  research: {
    overallSentiment: "POSITIVE", sentimentScore: 88,
    oneLiner: "AI research in early 2026 is producing breakthroughs at an accelerating pace — from protein structure prediction to mathematical reasoning — with the boundaries between AI research and scientific discovery increasingly blurred.",
    themes: [
      { theme: "AI for Scientific Discovery", sentiment: "POSITIVE", what: "AlphaFold 3 has expanded beyond proteins to predict the structure of DNA, RNA, and small molecules. AI-driven drug discovery has produced three FDA-approved candidates identified entirely by AI systems.", sources: ["Nature", "DeepMind Research"], representative_voice: "AlphaFold changed biology. AlphaFold 3 changes chemistry. We're watching AI eat the scientific method in real time." },
      { theme: "Mathematical Reasoning Breakthroughs", sentiment: "POSITIVE", what: "AI systems are now solving International Mathematical Olympiad problems at gold medal level. DeepMind's AlphaProof and OpenAI's o3 successors have demonstrated formal mathematical reasoning that has surprised even pure mathematicians.", sources: ["DeepMind Blog", "arXiv"], representative_voice: "When I saw the IMO proofs, I had to verify them manually. They were correct and elegant. That was a profound moment for me professionally." },
      { theme: "Scaling Laws & Model Architecture", sentiment: "POSITIVE", what: "Researchers are exploring the limits of transformer scaling and finding new architectures — state space models, mixture-of-experts, and hybrid approaches — that offer better efficiency at scale.", sources: ["Anthropic Research", "Meta AI", "arXiv"], representative_voice: "The next breakthrough won't come from a bigger transformer — it'll come from a fundamentally different approach to how models store and retrieve knowledge." },
      { theme: "AI Consciousness & Interpretability", sentiment: "MIXED", what: "Mechanistic interpretability research is revealing how AI models process information internally. No evidence of consciousness has been found, but the field is forcing philosophers and scientists to sharpen definitions of cognition.", sources: ["Anthropic Interpretability Team", "Consciousness Research Journal"], representative_voice: "We can now trace specific circuits in large language models and understand what they're doing. What we find is fascinating and deeply strange." },
    ],
    topVoices: [
      { type: "Researcher", sentiment: "positive", quote: "The convergence of AI and biology is producing discoveries at a rate that would have taken decades by traditional methods." },
      { type: "Analyst", sentiment: "positive", quote: "AI research is no longer a subfield of computer science — it is the engine of progress across all of science." },
      { type: "Media", sentiment: "cautious", quote: "Every week brings a new 'breakthrough' — separating genuine advances from benchmarking theatre requires deep expertise most journalists lack." },
    ],
    watchPoints: ["AlphaFold 3 drug discovery pipeline — first AI-native FDA-approved drug expected 2027-2028", "AGI timeline debate — leading labs diverging sharply on definitions and estimates", "AI research reproducibility crisis — many benchmark claims failing independent verification"],
    sourceCount: 13,
  },
};

const sentimentColor = (s, T) => {
  if (!s) return T.muted;
  const u = s.toUpperCase();
  if (u === "POSITIVE") return T.green;
  if (u === "NEGATIVE") return T.red;
  return T.yellow;
};

const sentimentBg = (s) => {
  if (!s) return "transparent";
  const u = s.toUpperCase();
  if (u === "POSITIVE") return "rgba(0,168,70,0.07)";
  if (u === "NEGATIVE") return "rgba(201,47,58,0.07)";
  return "rgba(212,136,10,0.08)";
};

const voiceColor = (type, T) => {
  const m = { Investor: T.blue, Employee: T.green, Developer: T.green, Member: T.purple, Media: T.yellow, Analyst: T.blue, Regulator: T.red, Researcher: T.purple };
  return m[type] || T.dim;
};

const font = "'Inter','Helvetica Neue',Arial,sans-serif";

function ScoreBar({ score, color, T }) {
  return (
    <div style={{ position:"relative", height:4, background:T.border2, width:"100%", marginTop:8 }}>
      <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${Math.min(100,Math.max(0,score||0))}%`, background:color, transition:"width 1.2s cubic-bezier(0.4,0,0.2,1)", boxShadow:`0 0 8px ${color}66` }} />
    </div>
  );
}

function Tag({ label, color }) {
  return (
    <span style={{ fontSize:9, letterSpacing:"1.5px", padding:"2px 8px", border:`1px solid ${color}55`, color, background:`${color}12`, display:"inline-block", fontFamily:font }}>
      {label}
    </span>
  );
}

function ThemeToggle({ isDark, onToggle, T }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display:"flex", alignItems:"center", gap:6,
        background: isDark ? T.panel : T.border,
        border:`1px solid ${T.border2}`,
        borderRadius:2,
        padding:"5px 10px",
        cursor:"pointer",
        fontFamily:font,
        fontSize:9,
        letterSpacing:"1.5px",
        color: T.dim,
        transition:"all 0.2s",
        flexShrink:0,
      }}
    >
      <span style={{ fontSize:12 }}>{isDark ? "☀" : "☾"}</span>
      {isDark ? "LIGHT" : "DARK"}
    </button>
  );
}

export default function App() {
  const [activeId, setActiveId] = useState("news");
  const [isDark, setIsDark] = useState(true);

  const T = isDark ? DARK : LIGHT;
  const activeQuery = QUERIES.find(q => q.id === activeId);
  const data = STATIC_DATA[activeId];

  return (
    <div style={{ background:T.bg, minHeight:"100vh", fontFamily:font, color:T.text, fontSize:12, transition:"background 0.3s, color 0.3s" }}>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        ::-webkit-scrollbar { width:4px; background:${T.bg}; }
        ::-webkit-scrollbar-thumb { background:${T.border2}; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade { animation:fadeUp 0.4s ease forwards; }
        .tab-btn:hover { background:${T.border} !important; color:${T.bright} !important; }
        .stat-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:1px; }
        .main-grid { display:grid; grid-template-columns:1fr 320px; gap:16px; }
        .header-subtitle { display:block; }
        .header-title { font-size:18px; }
        @media (max-width: 768px) {
          .stat-grid { grid-template-columns:repeat(2,1fr) !important; }
          .main-grid { grid-template-columns:1fr !important; }
          .header-subtitle { display:none !important; }
          .header-title { font-size:14px !important; }
          .header-inner { gap:8px !important; }
        }
      `}</style>

      {/* HEADER */}
      <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", boxShadow: isDark ? "none" : "0 1px 4px rgba(13,15,45,0.08)", transition:"background 0.3s" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }} className="header-inner">
          <div style={{ background:T.blue, color:"#fff", fontSize:9, letterSpacing:"2.5px", fontWeight:700, padding:"4px 10px", flexShrink:0 }}>
            LIVE
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <img src="/Algoviva White logo.png" alt="Algoviva" style={{ height:28, filter: isDark ? "none" : "invert(1) sepia(1) saturate(2) hue-rotate(190deg)" }} />
            <div className="header-title" style={{ fontWeight:700, color:T.bright, letterSpacing:"2px", fontFamily:font }}>◈ AI INTELLIGENCE</div>
            <div className="header-subtitle" style={{ fontSize:9, color:T.muted, letterSpacing:"1.5px" }}>GLOBAL AI MONITOR · NEWS · ETHICS · TOOLS · POLICY · BUSINESS · RESEARCH</div>
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12, flexShrink:0 }}>
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} T={T} />
          <div style={{ fontSize:9, color:T.muted, letterSpacing:"1.5px" }}>MAR 2026</div>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, display:"flex", overflowX:"auto", transition:"background 0.3s" }}>
        {QUERIES.map(q => (
          <button key={q.id} className="tab-btn" onClick={() => setActiveId(q.id)} style={{
            background:activeId===q.id ? (isDark ? T.panel : T.bg) : "transparent",
            color:activeId===q.id ? T.bright : T.muted,
            border:"none", borderBottom:activeId===q.id ? `2px solid ${T.blue}` : "2px solid transparent",
            borderRight:`1px solid ${T.border}`, padding:"12px 18px", cursor:"pointer",
            fontFamily:font, fontSize:10, letterSpacing:"1.5px", whiteSpace:"nowrap",
            display:"flex", alignItems:"center", gap:7, transition:"all 0.15s",
          }}>
            <span style={{ color:activeId===q.id ? T.blue : T.muted, fontSize:13 }}>{q.icon}</span>
            {q.label.toUpperCase()}
            <span style={{ width:5, height:5, borderRadius:"50%", background:sentimentColor(STATIC_DATA[q.id]?.overallSentiment, T), flexShrink:0 }} />
          </button>
        ))}
      </div>

      {/* BODY */}
      <div style={{ padding:"16px", maxWidth:1200, margin:"0 auto" }}>
        {data && (
          <div className="fade" key={activeId + String(isDark)}>
            {/* STAT CARDS */}
            <div className="stat-grid" style={{ marginBottom:16, background:T.border }}>
              {[
                { label:"OVERALL SENTIMENT", value:data.overallSentiment, color:sentimentColor(data.overallSentiment, T) },
                { label:"SENTIMENT SCORE", value:`${data.sentimentScore}/100`, color:sentimentColor(data.overallSentiment, T), bar:true },
              ].map((s,i) => (
                <div key={i} style={{ background: isDark ? T.surface : T.panel, padding:"16px 20px", boxShadow: isDark ? "none" : "0 1px 3px rgba(13,15,45,0.06)", transition:"background 0.3s" }}>
                  <div style={{ fontSize:9, letterSpacing:"2px", color:T.muted, marginBottom:8 }}>{s.label}</div>
                  <div style={{ fontSize:22, fontWeight:700, color:s.color }}>{s.value}</div>
                  {s.bar && <ScoreBar score={data.sentimentScore} color={s.color} T={T} />}
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div style={{ background: isDark ? T.surface : T.panel, borderLeft:`3px solid ${T.blue}`, border:`1px solid ${T.border}`, padding:"14px 20px", marginBottom:16, boxShadow: isDark ? "none" : "0 1px 3px rgba(13,15,45,0.06)", transition:"background 0.3s" }}>
              <div style={{ fontSize:9, letterSpacing:"2px", color:T.muted, marginBottom:6 }}>INTELLIGENCE SUMMARY</div>
              <div style={{ fontSize:14, color:T.bright, lineHeight:1.65 }}>{data.oneLiner}</div>
            </div>

            {/* MAIN GRID */}
            <div className="main-grid">
              <div>
                <div style={{ fontSize:9, letterSpacing:"2px", color:T.muted, marginBottom:10 }}>CONVERSATION THEMES · {data.themes?.length||0} FOUND</div>
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {(data.themes||[]).map((t,i) => (
                    <div key={i} style={{ background: isDark ? T.surface : T.panel, border:`1px solid ${T.border}`, borderLeft:`3px solid ${sentimentColor(t.sentiment, T)}`, padding:"14px 16px", boxShadow: isDark ? "none" : "0 1px 3px rgba(13,15,45,0.05)", transition:"background 0.3s" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
                        <span style={{ fontWeight:700, color:T.bright, fontSize:12 }}>{t.theme}</span>
                        <Tag label={t.sentiment} color={sentimentColor(t.sentiment, T)} />
                      </div>
                      <p style={{ color:T.dim, lineHeight:1.7, marginBottom:10, fontSize:11 }}>{t.what}</p>
                      {t.representative_voice && (
                        <div style={{ background:sentimentBg(t.sentiment), border:`1px solid ${sentimentColor(t.sentiment, T)}33`, padding:"9px 12px", fontSize:11, color:T.text, lineHeight:1.6, fontStyle:"italic", marginBottom:t.sources?.length?10:0 }}>
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
                {/* VOICES */}
                <div style={{ background: isDark ? T.surface : T.panel, border:`1px solid ${T.border}`, padding:16, boxShadow: isDark ? "none" : "0 1px 3px rgba(13,15,45,0.05)", transition:"background 0.3s" }}>
                  <div style={{ fontSize:9, letterSpacing:"2px", color:T.muted, marginBottom:12 }}>VOICE BREAKDOWN</div>
                  {(data.topVoices||[]).map((v,i) => (
                    <div key={i} style={{ paddingBottom:12, marginBottom:12, borderBottom:i<(data.topVoices.length-1)?`1px solid ${T.border}`:"none" }}>
                      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                        <span style={{ fontSize:10, fontWeight:700, color:voiceColor(v.type, T), letterSpacing:"1px" }}>{v.type?.toUpperCase()}</span>
                        <span style={{ fontSize:9, color:sentimentColor(v.sentiment, T), letterSpacing:"1px" }}>{v.sentiment?.toUpperCase()}</span>
                      </div>
                      <p style={{ fontSize:11, color:T.dim, lineHeight:1.6 }}>{v.quote}</p>
                    </div>
                  ))}
                </div>

                {/* WATCH POINTS */}
                <div style={{ background: isDark ? T.surface : T.panel, border:`1px solid ${T.border}`, padding:16, boxShadow: isDark ? "none" : "0 1px 3px rgba(13,15,45,0.05)", transition:"background 0.3s" }}>
                  <div style={{ fontSize:9, letterSpacing:"2px", color:T.muted, marginBottom:12 }}>WATCH POINTS</div>
                  {(data.watchPoints||[]).map((w,i) => (
                    <div key={i} style={{ display:"flex", gap:10, alignItems:"flex-start", marginBottom:10 }}>
                      <span style={{ color:T.yellow, flexShrink:0 }}>▲</span>
                      <span style={{ fontSize:11, color:T.dim, lineHeight:1.6 }}>{w}</span>
                    </div>
                  ))}
                </div>

                {/* SOURCE COUNT */}
                <div style={{ background: isDark ? T.surface : T.panel, border:`1px solid ${T.border}`, padding:16, display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow: isDark ? "none" : "0 1px 3px rgba(13,15,45,0.05)", transition:"background 0.3s" }}>
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

      {/* FOOTER */}
      <div style={{ borderTop:`1px solid ${T.border}`, padding:"10px 24px", display:"flex", justifyContent:"space-between", fontSize:9, color:T.muted, letterSpacing:"1px", background: isDark ? T.surface : T.panel, marginTop:24, transition:"background 0.3s" }}>
        <span>AI INTELLIGENCE MONITOR · </span>
        <span>MARCH 2026</span>
      </div>
    </div>
  );
}