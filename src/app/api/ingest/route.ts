import { NextResponse } from "next/server";
import { DEFAULT_RSS_SOURCES } from "@/lib/collectors/sources";
import { fetchRss } from "@/lib/collectors/rss";
import { extractMainContent } from "@/lib/scraper/extract";
import { summarizeText } from "@/lib/summarize/openai";
import { getRedisClient } from "@/lib/cache/redis-client";
import { randomUUID } from "crypto";

async function fetchHtml(url: string) {
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!resp.ok) return null;
    const text = await resp.text();
    return text;
  } catch (err) {
    console.error("fetchHtml error", url, err);
    return null;
  }
}

export async function GET() {
  const rssSources = DEFAULT_RSS_SOURCES;
  const redis = getRedisClient();
  const collected: any[] = [];

  for (const src of rssSources) {
    const items = await fetchRss(src);
    for (const item of items.slice(0, 6)) {
      const title = item.title || item.contentSnippet || "";
      const link = item.link || item.guid || "";
      const id = randomUUID();

      const cachedKey = `elyra:story:${Buffer.from(link).toString("base64")}`;
      const exists = await redis.get(cachedKey);
      if (exists) continue;

      let html = null;
      if (link) html = await fetchHtml(link);
      let article = null;
      if (html) article = extractMainContent(html, link);
      const content = (article && article.textContent) || item.contentSnippet || item.content || "";

      const summary = await summarizeText(content || title || "");

      const story = {
        id,
        title,
        link,
        source: src,
        published: item.isoDate || item.pubDate || new Date().toISOString(),
        summary: summary.short,
        summaryFull: summary.full,
      };

      await redis.set(cachedKey, JSON.stringify(story), "EX", 60 * 60 * 6);
      collected.push(story);
    }
  }

  return NextResponse.json({ ok: true, collected, generatedAt: new Date().toISOString() });
}
