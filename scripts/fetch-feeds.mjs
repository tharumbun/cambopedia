import Parser from "rss-parser";
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { parse } from "yaml"; // npm install yaml
import path from "path";

const parser = new Parser();
const sources = parse(readFileSync("src/data/sources.yaml", "utf8"));

const OUT_DIR = "src/data/items";
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

// load existing items so we can dedupe across runs
const indexPath = path.join(OUT_DIR, "index.json");
const existing = existsSync(indexPath)
  ? JSON.parse(readFileSync(indexPath, "utf8"))
  : [];
const seen = new Set(existing.map((i) => i.link));

const newItems = [];

for (const src of sources) {
  try {
    const feed = await parser.parseURL(src.url);
    for (const item of feed.items) {
      if (seen.has(item.link)) continue;
      seen.add(item.link);
      newItems.push({
        title: item.title,
        link: item.link,
        date: item.isoDate || item.pubDate || new Date().toISOString(),
        source: src.name,
        sourceId: src.id,
        lang: src.lang,
        snippet: (item.contentSnippet || "").slice(0, 240),
      });
    }
  } catch (err) {
    console.error(`Failed to fetch ${src.name}:`, err.message);
  }
}

const all = [...newItems, ...existing]
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 2000); // cap so the file doesn't grow forever

writeFileSync(indexPath, JSON.stringify(all, null, 2));
console.log(`Added ${newItems.length} new items. Total: ${all.length}`);