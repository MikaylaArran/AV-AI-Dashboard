import { useState, useEffect, useRef } from "react";

const T = {
  bg:      "#070809",
  surface: "#0D1014",
  panel:   "#111519",
  border:  "#1A2028",
  border2: "#232C36",
  muted:   "#3D4F61",
  dim:     "#6B7F93",
  text:    "#D6E4F0",
  bright:  "#EEF6FF",
  green:   "#00E5A0",
  yellow:  "#F5C842",
  red:     "#FF4B6E",
  blue:    "#3A9EFF",
  purple:  "#9B6DFF",
};

const QUERIES = [
  { id: "general",   label: "General Buzz",       icon: "◈", query: "AfroCentric Group South Africa 2026 news public discussion opinions" },
  { id: "financial", label: "Financial Sentiment", icon: "◎", query: "AfroCentric Group JSE ACT share price results investor reaction 2025 2026" },
  { id: "nhi",       label: "NHI & Policy",        icon: "⬡", query: "AfroCentric NHI National Health Insurance South Africa 2025 2026 public opinion" },
  { id: "medscheme", label: "Medscheme Chatter",   icon: "◇", query: "Medscheme AfroCentric complaints reviews member opinions 2025 2026" },
  { id: "employer",  label: "Employer Reputation", icon: "◉", query: "AfroCentric Group employer culture employee reviews 2025 South Africa" },
  { id: "digital",   label: "Digital & AI",        icon: "◫", query: "AfroCentric digital transformation AI health tech South Africa 2025 2026" },
];

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

function ScoreBar({ score, color }) {
  return (
    <div style={{ position: "relative", height: 4, background: T.border2, width: "100%", marginTop: 8 }}>
      <div style={{
        position: "absolute", left: 0, top: 0, height: "100%",
        width: `${Math.min(100, Math.max(0, score || 0))}%`,
        background: color,
        transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: `0 0 8px ${color}66`,
      }} />
    </div>
  );
}

function Spinner() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20, padding: "80px 0" }}>
      <div style={{
        width: 36, height: 36,
        border: `2px solid ${T.border2}`,
        borderTop: `2px solid ${T.green}`,
        borderRadius: "50%",
        animation: "spin 0.9s linear infinite",
      }} />
      <div style={{ fontSize: 10, letterSpacing: "3px", color: T.dim }}>SCANNING LIVE DATA</div>
      <div style={{ fontSize: 10, color: T.muted }}>Searching web for recent conversations...</div>
    </div>
  );
}

function Tag({ label, color }) {
  return (
    <span style={{
      fontSize: 9, letterSpacing: "1.5px", padding: "2px 8px",
      border: `1px solid ${color}44`, color,
      background: `${color}11`, display: "inline-block",
      fontFamily: "inherit",
    }}>
      {label}
    </span>
  );
}

function RateLimitCountdown({ seconds, onDone }) {
  const [rem, setRem] = useState(seconds);
  useEffect(() => {
    if (rem <= 0) { onDone(); return; }
    const t = setTimeout(() => setRem(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [rem]);
  return (
    <div style={{ background: "rgba(245,200,66,0.06)", border: `1px solid ${T.yellow}44`, padding: "16px 20px", marginBottom: 16 }}>
      <div style={{ color: T.yellow, fontSize: 11, marginBottom: 6 }}>⏱ RATE LIMIT — COOLING DOWN</div>
      <div style={{ color: T.dim, fontSize: 11, lineHeight: 1.7, marginBottom: 10 }}>
        Too many requests. Auto-retrying in <span style={{ color: T.yellow, fontWeight: 700 }}>{rem}s</span>...
      </div>
      <div style={{ position: "relative", height: 3, background: T.border2 }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${(rem / seconds) * 100}%`, background: T.yellow, transition: "width 1s linear" }} />
      </div>
    </div>
  );
}

export default function App() {
  const [activeId, setActiveId]       = useState("general");
  const [results, setResults]         = useState({});
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [fetchedAt, setFetchedAt]     = useState({});
  const cache    = useRef({});
  const timerRef = useRef(null);

  const activeQuery = QUERIES.find(q => q.id === activeId);
  const data = results[activeId] || null;

  const CACHE_DURATION_MS = 6 * 60 * 60 * 1000; // 6 hours

  function loadFromStorage(id) {
    try {
      const raw = sessionStorage.getItem(`intel_${id}`);
      if (!raw) return null;
      const { data, timestamp } = JSON.parse(raw);
      if (Date.now() - timestamp > CACHE_DURATION_MS) return null;
      return { data, timestamp };
    } catch { return null; }
  }

  function saveToStorage(id, data) {
    try {
      sessionStorage.setItem(`intel_${id}`, JSON.stringify({ data, timestamp: Date.now() }));
    } catch {}
  }

  async function fetchIntelligence(queryObj, force = false) {
    // Check session storage cache first (persists across tab switches)
    if (!force) {
      const cached = loadFromStorage(queryObj.id);
      if (cached) {
        setResults(r => ({ ...r, [queryObj.id]: cached.data }));
        const age = new Date(cached.timestamp).toLocaleTimeString();
        setFetchedAt(f => ({ ...f, [queryObj.id]: age }));
        return;
      }
    }

    setLoading(true);
    setError(null);
    setRateLimited(false);

    try {
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: queryObj.label, query: queryObj.query }),
      });

      if (res.status === 429) { setRateLimited(true); setLoading(false); return; }
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const parsed = await res.json();
      saveToStorage(queryObj.id, parsed);
      setResults(r => ({ ...r, [queryObj.id]: parsed }));
      setFetchedAt(f => ({ ...f, [queryObj.id]: new Date().toLocaleTimeString() }));

    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!results[activeId] && !loading && !rateLimited) {
      timerRef.current = setTimeout(() => fetchIntelligence(activeQuery), 800);
    }
    return () => clearTimeout(timerRef.current);
  }, [activeId]);

  useEffect(() => {
    fetchIntelligence(QUERIES[0]);
  }, []);

  return (
    <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "'IBM Plex Mono','Fira Code','Courier New',monospace", color: T.text, fontSize: 12 }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.border2}; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade { animation: fadeUp 0.4s ease forwards; }
        .tab:hover { background: ${T.panel} !important; color: ${T.bright} !important; }
        .btn:hover { border-color: ${T.green} !important; color: ${T.green} !important; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: T.green, color: "#000", fontSize: 9, letterSpacing: "2.5px", fontWeight: 700, padding: "4px 10px" }}>LIVE</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="/logo.png" alt="AfroCentric Group" style={{ height: 36 }} />
            <div style={{ fontSize: 9, color: T.muted, letterSpacing: "1.5px" }}>SOCIAL & MEDIA INTELLIGENCE MONITOR — JSE:ACT</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {fetchedAt[activeId] && <span style={{ fontSize: 9, color: T.muted }}>CACHED · UPDATES EVERY 6H · LAST {fetchedAt[activeId]}</span>}
          <button className="btn" onClick={() => fetchIntelligence(activeQuery, true)} disabled={loading || rateLimited}
            style={{ background: "transparent", border: `1px solid ${T.border2}`, color: T.dim, fontSize: 9, letterSpacing: "1.5px", padding: "5px 14px", cursor: (loading || rateLimited) ? "not-allowed" : "pointer", fontFamily: "inherit", opacity: (loading || rateLimited) ? 0.4 : 1, transition: "all 0.15s" }}>
            ↻ REFRESH
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, display: "flex", overflowX: "auto" }}>
        {QUERIES.map(q => (
          <button key={q.id} className="tab" onClick={() => { if (!loading) setActiveId(q.id); }} style={{
            background: activeId === q.id ? T.panel : "transparent",
            color: activeId === q.id ? T.bright : T.muted,
            border: "none", borderBottom: activeId === q.id ? `2px solid ${T.green}` : "2px solid transparent",
            borderRight: `1px solid ${T.border}`, padding: "12px 18px",
            cursor: loading ? "not-allowed" : "pointer", fontFamily: "inherit",
            fontSize: 10, letterSpacing: "1.5px", whiteSpace: "nowrap",
            display: "flex", alignItems: "center", gap: 7, transition: "all 0.15s",
            opacity: loading && activeId !== q.id ? 0.5 : 1,
          }}>
            <span style={{ color: activeId === q.id ? T.green : T.muted, fontSize: 13 }}>{q.icon}</span>
            {q.label.toUpperCase()}
            {results[q.id] && <span style={{ width: 5, height: 5, borderRadius: "50%", background: sentimentColor(results[q.id].overallSentiment), flexShrink: 0 }} />}
          </button>
        ))}
      </div>

      {/* BODY */}
      <div style={{ padding: "20px 24px", maxWidth: 1200, margin: "0 auto" }}>

        {rateLimited && (
          <RateLimitCountdown seconds={60} onDone={() => { setRateLimited(false); fetchIntelligence(activeQuery, true); }} />
        )}

        {error && !rateLimited && (
          <div style={{ background: "rgba(255,75,110,0.08)", border: `1px solid ${T.red}55`, padding: "14px 18px", marginBottom: 16 }}>
            <div style={{ color: T.red, fontSize: 11, marginBottom: 6 }}>⚠ ERROR</div>
            <div style={{ color: T.dim, fontSize: 11, lineHeight: 1.7 }}>{error}</div>
          </div>
        )}

        {loading && !data && <Spinner />}

        {data && !loading && (
          <div className="fade">

            {/* STATS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, marginBottom: 16, background: T.border }}>
              {[
                { label: "OVERALL SENTIMENT", value: data.overallSentiment, color: sentimentColor(data.overallSentiment) },
                { label: "SENTIMENT SCORE",   value: `${data.sentimentScore}/100`, color: sentimentColor(data.overallSentiment), bar: true },
                { label: "MEDIA VOLUME",      value: data.volumeSignal, color: data.volumeSignal === "HIGH" ? T.green : data.volumeSignal === "MEDIUM" ? T.yellow : T.muted },
                { label: "DATA QUALITY",      value: data.dataQuality, color: data.dataQuality === "HIGH" ? T.green : data.dataQuality === "MEDIUM" ? T.yellow : T.red },
              ].map((s, i) => (
                <div key={i} style={{ background: T.surface, padding: "16px 20px" }}>
                  <div style={{ fontSize: 9, letterSpacing: "2px", color: T.muted, marginBottom: 8 }}>{s.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                  {s.bar && <ScoreBar score={data.sentimentScore} color={s.color} />}
                </div>
              ))}
            </div>

            {/* ONE-LINER */}
            <div style={{ background: T.surface, borderLeft: `3px solid ${T.green}`, border: `1px solid ${T.border}`, padding: "14px 20px", marginBottom: 16 }}>
              <div style={{ fontSize: 9, letterSpacing: "2px", color: T.muted, marginBottom: 6 }}>INTELLIGENCE SUMMARY</div>
              <div style={{ fontSize: 14, color: T.bright, lineHeight: 1.65 }}>{data.oneLiner}</div>
            </div>

            {/* MAIN GRID */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>

              {/* Themes */}
              <div>
                <div style={{ fontSize: 9, letterSpacing: "2px", color: T.muted, marginBottom: 10 }}>
                  CONVERSATION THEMES · {data.themes?.length || 0} FOUND
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(data.themes || []).map((t, i) => (
                    <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderLeft: `3px solid ${sentimentColor(t.sentiment)}`, padding: "14px 16px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                        <span style={{ fontWeight: 700, color: T.bright, fontSize: 12 }}>{t.theme}</span>
                        <Tag label={t.sentiment} color={sentimentColor(t.sentiment)} />
                      </div>
                      <p style={{ color: T.dim, lineHeight: 1.7, marginBottom: t.representative_voice ? 10 : 0, fontSize: 11 }}>{t.what}</p>
                      {t.representative_voice && (
                        <div style={{ background: sentimentBg(t.sentiment), border: `1px solid ${sentimentColor(t.sentiment)}22`, padding: "9px 12px", fontSize: 11, color: T.text, lineHeight: 1.6, fontStyle: "italic", marginBottom: t.sources?.length ? 10 : 0 }}>
                          "{t.representative_voice}"
                        </div>
                      )}
                      {t.sources?.length > 0 && (
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                          {t.sources.map((s, j) => <Tag key={j} label={s} color={T.muted} />)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: 16 }}>
                  <div style={{ fontSize: 9, letterSpacing: "2px", color: T.muted, marginBottom: 12 }}>VOICE BREAKDOWN</div>
                  {(data.topVoices || []).map((v, i) => (
                    <div key={i} style={{ paddingBottom: 12, marginBottom: 12, borderBottom: i < (data.topVoices.length - 1) ? `1px solid ${T.border}` : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: voiceColor(v.type), letterSpacing: "1px" }}>{v.type?.toUpperCase()}</span>
                        <span style={{ fontSize: 9, color: sentimentColor(v.sentiment), letterSpacing: "1px" }}>{v.sentiment?.toUpperCase()}</span>
                      </div>
                      <p style={{ fontSize: 11, color: T.dim, lineHeight: 1.6 }}>{v.quote}</p>
                    </div>
                  ))}
                </div>

                <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: 16 }}>
                  <div style={{ fontSize: 9, letterSpacing: "2px", color: T.muted, marginBottom: 12 }}>WATCH POINTS</div>
                  {(data.watchPoints || []).map((w, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 10 }}>
                      <span style={{ color: T.yellow, flexShrink: 0 }}>▲</span>
                      <span style={{ fontSize: 11, color: T.dim, lineHeight: 1.6 }}>{w}</span>
                    </div>
                  ))}
                </div>

                <div style={{ background: T.surface, border: `1px solid ${T.border}`, padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 9, letterSpacing: "2px", color: T.muted, marginBottom: 4 }}>SOURCES</div>
                    <div style={{ fontSize: 26, fontWeight: 700, color: T.blue }}>{data.sourceCount || "—"}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 9, letterSpacing: "2px", color: T.muted, marginBottom: 4 }}>TOPIC</div>
                    <div style={{ fontSize: 11, color: T.text }}>{activeQuery.label}</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {!data && !loading && !error && !rateLimited && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, padding: "80px 0", color: T.muted }}>
            <div style={{ fontSize: 24, color: T.border2 }}>◈</div>
            <div style={{ fontSize: 10, letterSpacing: "2px" }}>LOADING INTELLIGENCE...</div>
          </div>
        )}

      </div>

      {/* FOOTER */}
      <div style={{ borderTop: `1px solid ${T.border}`, padding: "10px 24px", display: "flex", justifyContent: "space-between", fontSize: 9, color: T.muted, letterSpacing: "1px", background: T.surface, marginTop: 24 }}>
        <span>AFROCENTRIC GROUP · SOCIAL & MEDIA INTELLIGENCE · CLAUDE AI + WEB SEARCH</span>
        <span>LIVE DATA · MARCH 2026</span>
      </div>
    </div>
  );
}
