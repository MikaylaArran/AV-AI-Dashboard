const SYSTEM_PROMPT = `You are a professional technology and AI industry intelligence analyst. Search the web for recent news, research, social media discussions, expert commentary, and public conversations about artificial intelligence.

Return ONLY a valid JSON object with NO markdown, NO backticks, NO preamble. Exactly this structure:

{
  "overallSentiment": "POSITIVE" or "MIXED" or "NEGATIVE" or "CAUTIOUS",
  "sentimentScore": integer 0-100,
  "volumeSignal": "HIGH" or "MEDIUM" or "LOW",
  "oneLiner": "one sharp sentence summarising the current state of conversation on this AI topic",
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
      "type": "Researcher" or "Developer" or "Investor" or "Regulator" or "Media" or "Analyst",
      "sentiment": "positive" or "negative" or "neutral" or "cautious",
      "quote": "paraphrased sentiment from this type of voice"
    }
  ],
  "watchPoints": ["point1", "point2", "point3"],
  "dataQuality": "HIGH" or "MEDIUM" or "LOW",
  "sourceCount": integer
}`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "ANTHROPIC_API_KEY not set" });

  const { id, label, query } = req.body;
  if (!id || !label || !query) return res.status(400).json({ error: "Missing id, label or query" });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: [{
          role: "user",
          content: `Search the web and analyse current global conversations, news, and expert opinion about this AI topic: "${label}". Search query: "${query}". Focus on results from 2025-2026. Return only the JSON object.`
        }]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      return res.status(500).json({ error: `Claude API ${response.status}: ${err.slice(0, 500)}` });
    }

    const raw = await response.json();
    const textBlocks = (raw.content || []).filter(b => b.type === "text");
    if (!textBlocks.length) return res.status(500).json({ error: "No text in Claude response" });

    const fullText = textBlocks.map(b => b.text).join("\n");
    const match = fullText.match(/\{[\s\S]*\}/);
    if (!match) return res.status(500).json({ error: "No JSON in Claude response" });

    const parsed = JSON.parse(match[0]);
    return res.status(200).json({ ...parsed, cachedAt: new Date().toISOString() });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}