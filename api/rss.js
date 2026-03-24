export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing url param" });

  try {
    const response = await fetch(decodeURIComponent(url), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; RSS Reader/1.0)",
        "Accept": "application/rss+xml, application/xml, text/xml, */*",
      },
    });

    if (!response.ok) return res.status(502).json({ error: `Feed returned ${response.status}` });

    const xml = await response.text();

    const clean = (str) => str
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
      .replace(/\[&hellip;\]/g, "…").replace(/\[…\]/g, "…")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/\s+/g, " ").trim();

    const getRaw = (block, tag) => {
      const cdata = block.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]>`, "i"));
      if (cdata) return cdata[1].trim();
      const plain = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
      if (plain) return plain[1].trim();
      return "";
    };

    const getLink = (block) => {
      const std = block.match(/<link>([^<]+)<\/link>/i);
      if (std) return std[1].trim();
      const guid = block.match(/<guid[^>]*isPermaLink="true"[^>]*>([^<]+)<\/guid>/i);
      if (guid) return guid[1].trim();
      const guid2 = block.match(/<guid[^>]*>([^<]+)<\/guid>/i);
      if (guid2 && guid2[1].startsWith("http")) return guid2[1].trim();
      return "";
    };

    const getSource = (block) => {
      const s = block.match(/<source[^>]*>([^<]*)<\/source>/i);
      return s ? s[1].trim() : "";
    };

    const getExcerpt = (block, title) => {
      const raw = getRaw(block, "description");
      if (!raw) return "";
      const text = clean(raw);
      if (!text || text.length < 15) return "";
      const titleNorm = title.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 50);
      const descNorm  = text.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 50);
      if (titleNorm.length > 20 && descNorm.startsWith(titleNorm.slice(0, 40))) return "";
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
      if (sentences.length >= 2) {
        const excerpt = sentences.slice(0, 3).join(" ").trim();
        return excerpt.length > 220 ? excerpt.slice(0, 220) + "…" : excerpt;
      }
      return text.length > 220 ? text.slice(0, 220) + "…" : text;
    };

    const items = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 20) {
      const block = match[1];
      const rawTitle = getRaw(block, "title");
      const title = clean(rawTitle);
      if (!title) continue;

      const titleMatch = title.match(/^([\s\S]+?)\s+-\s+([^-]+)$/);
      const cleanTitle = titleMatch ? titleMatch[1].trim() : title;
      const pubGuess   = titleMatch ? titleMatch[2].trim() : "";

      const link    = getLink(block);
      const pubDate = clean(getRaw(block, "pubDate") || block.match(/<pubDate>([^<]+)<\/pubDate>/i)?.[1] || "");
      const source  = getSource(block) || pubGuess;
      const excerpt = getExcerpt(block, cleanTitle);

      items.push({ title: cleanTitle, link, pubDate, description: excerpt, source });
    }

    res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate");
    return res.status(200).json({ items });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
