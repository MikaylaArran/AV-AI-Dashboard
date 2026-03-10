import { kv } from "@vercel/kv";

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

  return JSON.parse(match[0]);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: "API key not configured" });

  const { id, label, query, force } = req.body;

  try {
    if (!force) {
      const cached = await kv.get(`intel_${id}`);
      if (cached) return res.status(200).json({ ...cached, fromCache: true });
    }

    const data = await fetchFromClaude(label, query);
    await kv.set(`intel_${id}`, { ...data, cachedAt: new Date().toISOString() });
    return res.status(200).json({ ...data, fromCache: false });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
