import Parser from "rss-parser";

const parser = new Parser({ timeout: 15000 });

export async function fetchRss(url: string) {
  try {
    const feed = await parser.parseURL(url);
    return feed.items || [];
  } catch (err) {
    console.error("RSS fetch error", url, err);
    return [];
  }
}
