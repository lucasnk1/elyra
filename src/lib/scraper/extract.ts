import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export function extractMainContent(html: string, url: string) {
  try {
    const dom = new JSDOM(html, { url });
    const reader = new Readability(dom.window.document as any);
    const article = reader.parse();
    return article || null;
  } catch (err) {
    console.error("extractMainContent error", err);
    return null;
  }
}
