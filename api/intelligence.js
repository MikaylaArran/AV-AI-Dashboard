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

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "https://gwunhnjbfqxwjtpqjged.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const CACHE_HOURS = 24;

async function getFromSupabase(id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/intelligence_cache?id=eq.${id}&select=data,cached_at`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    }
  });
  const rows = await res.json();
  if (!rows?.length) return null;
  const row = rows[0];
  const age = (Date.now() - new Date(row.cached_at).getTime()) / 1000 / 60 / 60;
  if (age > CACHE_HOURS) return null;
  return row.data;
}

async function saveToSupabase(id, data) {
  await fetch(`${SUPABASE_URL}/rest/v1/intelligence_cache`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify({ id, data, cached_at: new Date().toISOString() })
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: "API key not configured" });

  const { label, query, force } = req.body;
  const id = req.body.id;

  try {
    // Check Supabase cache first
    if (!force && SUPABASE_KEY) {
      const cached = await getFromSupabase(id);
      if (cached) return res.status(200).json({ ...cached, fromCache: true });
    }

    // Fetch from Claude
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

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Claude API ${response.status}: ${err.slice(0, 300)}`);
    }

    const raw = await response.json();
    const textBlocks = (raw.content || []).filter(b => b.type === "text");
    if (!textBlocks.length) throw new Error("No text response from Claude");
    const fullText = textBlocks.map(b => b.text).join("\n");
    const match = fullText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON found in response");
    const parsed = JSON.parse(match[0]);
    const result = { ...parsed, cachedAt: new Date().toISOString() };

    // Save to Supabase
    if (SUPABASE_KEY) await saveToSupabase(id, result);

    return res.status(200).json({ ...result, fromCache: false });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}