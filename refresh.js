const QUERIES = [
  { id: "general",   label: "General Buzz",       query: "AfroCentric Group South Africa 2026 news public discussion opinions" },
  { id: "financial", label: "Financial Sentiment", query: "AfroCentric Group JSE ACT share price results investor reaction 2025 2026" },
  { id: "nhi",       label: "NHI & Policy",        query: "AfroCentric NHI National Health Insurance South Africa 2025 2026 public opinion" },
  { id: "medscheme", label: "Medscheme Chatter",   query: "Medscheme AfroCentric complaints reviews member opinions 2025 2026" },
  { id: "employer",  label: "Employer Reputation", query: "AfroCentric Group employer culture employee reviews 2025 South Africa" },
  { id: "digital",   label: "Digital & AI",        query: "AfroCentric digital transformation AI health tech South Africa 2025 2026" },
];

const SYSTEM_PROMPT = `You are a professional social and media intelligence analyst specialising in South African healthcare. Search the web for recent public conversations, news, social media posts, reviews, and commentary about AfroCentric Group (JSE:ACT).

Return ONLY a valid JSON object with NO markdown, NO backticks, NO preamble. Exactly this structure:

{
  "overallSentiment": "POSITIVE" or "MIXED" or "NEGATIVE" or "CAUTIOUS",
  "sentimentScore": integer 0-100,
  "volumeSignal": "HIGH" or "MEDIUM" or "LOW",
  "oneLiner": "one sharp sentence summarising what people are saying right now",
  "themes": [
    {
      "theme": "theme name",
      "sentiment": "POSITIVE" or "NEGATIVE" or "NEUTRAL" or "MIXED",
      "what": "2-3 sentences describing what people are saying",
      "sources": ["source1", "source2"],
      "representative_voice": "paraphrased example of real sentiment found"
    }
  ],
  "topVoices": [
    {
      "type": "Investor" or "Employee" or "Member" or "Media" or "Analyst" or "Regulator",
      "sentiment": "positive" or "negative" or "neutral",
      "quote": "paraphrased sentiment from this type of voice"
    }
  ],
  "watchPoints": ["point1", "point2", "point3"],
  "dataQuality": "HIGH" or "MEDIUM" or "LOW",
  "sourceCount": integer
}`;

async function redisSet(key, value) {
  const url = process.env.STORAGE_URL;
  const token = process.env.STORAGE_TOKEN;
  await fetch(`${url}/set/${key}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(JSON.stringify(value))
  });
}

async function fetchFromClaude(label, query) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system: SYSTEM_PROMPT,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{
        role: "user",
        content: `Search the web and analyse public conversations about AfroCentric Group for this topic: "${label}". Search query: "${query}". Focus on results from 2025-2026. Return only the JSON object.`
      }]
    })
  });

  if (!response.ok) throw new Error(`Claude API ${response.status}`);
  const raw = await response.json();
  const textBlocks = (raw.content || []).filter(b => b.type === "text");
  const fullText = textBlocks.map(b => b.text).join("\n");
  const match = fullText.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON in response");
  return JSON.parse(match[0]);
}

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: "Unauthorised" });
  }

  const results = [];
  for (const q of QUERIES) {
    try {
      const data = await fetchFromClaude(q.label, q.query);
      await redisSet(`intel_${q.id}`, { ...data, cachedAt: new Date().toISOString() });
      results.push({ id: q.id, status: "ok" });
      await new Promise(r => setTimeout(r, 3000));
    } catch (e) {
      results.push({ id: q.id, status: "error", error: e.message });
    }
  }

  return res.status(200).json({ message: "Refresh complete", completedAt: new Date().toISOString(), results });
}
