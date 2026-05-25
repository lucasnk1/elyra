import { fetchRss } from "@/lib/collectors/rss";
import type { ElyraStory } from "@/lib/elyra-data";

const LIVE_RSS_SOURCES = [
  "https://feeds.feedburner.com/TechCrunch/",
  "https://www.theverge.com/rss/index.xml",
  "https://www.wired.com/feed/rss",
  "https://feeds.arstechnica.com/arstechnica/index",
  "https://venturebeat.com/category/ai/feed/",
];

const TECH_KEYWORDS = [
  "ai",
  "artificial intelligence",
  "startup",
  "software",
  "developer",
  "programming",
  "cloud",
  "open source",
  "cyber",
  "security",
  "robot",
  "chip",
  "gpu",
  "apple",
  "google",
  "microsoft",
  "meta",
  "openai",
  "anthropic",
  "github",
  "tech",
  "api",
  "saas",
  "data",
  "infra",
  "windows",
  "linux",
  "quantum",
  "code",
];

const NON_TECH_KEYWORDS = [
  "memorial day",
  "sale",
  "deals",
  "discount",
  "promo code",
  "coupon code",
  "gift guide",
  "coupon",
  "shopping",
  "dating",
  "pope",
  "celebrity",
  "fashion",
  "recipe",
  "movie",
  "music",
  "sports",
  "travel",
  "camping",
  "barbecue",
  "book review",
];

type RssItem = Record<string, unknown> & {
  title?: string;
  link?: string;
  content?: string;
  contentSnippet?: string;
  pubDate?: string;
  isoDate?: string;
  categories?: string[];
  creator?: string;
  author?: string;
};

function stripHtml(input: string) {
  return input.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function toSummary(input: string, max = 480) {
  const text = stripHtml(input || "");
  if (text.length <= max) return text;
  // Corta na última frase completa dentro do limite
  const trimmed = text.slice(0, max);
  const lastPeriod = Math.max(trimmed.lastIndexOf("."), trimmed.lastIndexOf("!"), trimmed.lastIndexOf("?"));
  if (lastPeriod > max * 0.6) return text.slice(0, lastPeriod + 1);
  return `${trimmed.trimEnd()}...`;
}

function relativeTime(dateInput?: string) {
  if (!dateInput) return "Now";
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return "Now";

  const diffMinutes = Math.max(1, Math.floor((Date.now() - date.getTime()) / 60000));
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function estimateReadTime(text: string) {
  const words = stripHtml(text).split(" ").filter(Boolean).length;
  const minutes = Math.max(2, Math.ceil(words / 220));
  return `${minutes} min`;
}

function categoryFromItem(item: { categories?: string[]; title?: string }) {
  const fromFeed = item.categories?.find(Boolean);
  if (fromFeed) return fromFeed;

  const title = (item.title || "").toLowerCase();
  if (title.includes("ai") || title.includes("artificial")) return "AI";
  if (title.includes("startup")) return "Startups";
  if (title.includes("security") || title.includes("cyber")) return "Security";
  if (title.includes("cloud")) return "Cloud";
  if (title.includes("open source") || title.includes("github")) return "Open Source";
  return "Technology";
}

function hasKeyword(blob: string, keyword: string) {
  if (keyword.includes(" ")) return blob.includes(keyword);
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\b${escaped}\\b`, "i");
  return pattern.test(blob);
}

function sourceFromUrl(link: string) {
  try {
    const url = new URL(link);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return "Source";
  }
}

function getImageUrl(item: RssItem): string | undefined {
  const enclosure = item.enclosure as { url?: string } | undefined;
  if (enclosure?.url) return enclosure.url;

  const mediaContent = item["media:content"] as { $?: { url?: string }; url?: string } | undefined;
  if (mediaContent?.$?.url) return mediaContent.$.url;
  if (mediaContent?.url) return mediaContent.url;

  const mediaThumb = item["media:thumbnail"] as { $?: { url?: string }; url?: string } | undefined;
  if (mediaThumb?.$?.url) return mediaThumb.$.url;
  if (mediaThumb?.url) return mediaThumb.url;

  const rawContent = String(item.content || "");
  const match = rawContent.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match?.[1]) return match[1];

  return undefined;
}

function isTechnologyStory(title: string, summary: string, sourceUrl: string) {
  const blob = `${title} ${summary}`.toLowerCase();
  const hasTechSignal = TECH_KEYWORDS.some((keyword) => hasKeyword(blob, keyword));
  const hasNonTechSignal = NON_TECH_KEYWORDS.some((keyword) => hasKeyword(blob, keyword));

  if (!hasTechSignal || hasNonTechSignal) return false;

  const lowerUrl = sourceUrl.toLowerCase();
  return (
    lowerUrl.includes("techcrunch") ||
    lowerUrl.includes("theverge") ||
    lowerUrl.includes("wired") ||
    lowerUrl.includes("arstechnica") ||
    lowerUrl.includes("venturebeat")
  );
}

function similarityScore(target: ElyraStory, candidate: ElyraStory) {
  let score = 0;
  if (target.category === candidate.category) score += 3;
  if (target.source === candidate.source) score += 1;

  const targetWords = new Set(target.title.toLowerCase().split(/\W+/).filter((word) => word.length > 3));
  for (const word of candidate.title.toLowerCase().split(/\W+/)) {
    if (targetWords.has(word)) score += 0.4;
  }

  return score;
}

export async function getLiveStories(limit = 12): Promise<ElyraStory[]> {
  const allItems = await Promise.all(LIVE_RSS_SOURCES.map((source) => fetchRss(source)));

  const merged = allItems
    .flat()
    .filter((item) => item?.title && item?.link)
    .map((item) => {
      const casted = item as RssItem;
      const baseText = casted.contentSnippet || casted.content || casted.title || "";
      const source = casted.creator || casted.author || String(casted["dc:creator"] || sourceFromUrl(casted.link || ""));
      const category = categoryFromItem({ categories: casted.categories, title: casted.title });

      return {
        id: `live-${Buffer.from(casted.link || casted.title || "story").toString("base64url")}`,
        title: stripHtml(casted.title || "Untitled"),
        summary: toSummary(baseText),
        content: [
          toSummary(baseText, 900),
          ...(baseText.length > 900 ? [toSummary(baseText.slice(400), 700)] : []),
        ],
        imageUrl: getImageUrl(casted),
        source: stripHtml(source),
        sourceUrl: casted.link || "",
        time: relativeTime(casted.isoDate || casted.pubDate),
        readTime: estimateReadTime(baseText),
        tag: "Live",
        impact: "High" as const,
        category,
        publishedAt: new Date(casted.isoDate || casted.pubDate || 0).getTime() || 0,
      };
    })
    .filter((item) => item.sourceUrl)
    .filter((item) => isTechnologyStory(item.title, item.summary, item.sourceUrl))
    .sort((a, b) => b.publishedAt - a.publishedAt);

  const uniqueByLink = merged.filter(
    (story, index, array) => array.findIndex((candidate) => candidate.sourceUrl === story.sourceUrl) === index,
  );

  return uniqueByLink.slice(0, Math.max(10, Math.min(30, limit))).map(({ publishedAt, ...story }) => story);
}

export async function getLiveStoryById(id: string): Promise<ElyraStory | undefined> {
  const stories = await getLiveStories(30);
  return stories.find((story) => story.id === id);
}

export async function getSimilarLiveStories(story: ElyraStory, limit = 4): Promise<ElyraStory[]> {
  const stories = await getLiveStories(30);
  return stories
    .filter((candidate) => candidate.id !== story.id)
    .map((candidate) => ({ candidate, score: similarityScore(story, candidate) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.candidate);
}
