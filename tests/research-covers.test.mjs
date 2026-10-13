import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../js/app.js", import.meta.url), "utf8");

async function renderCard(item, lang = "uk") {
  const grid = { innerHTML: "" };
  const context = {
    document: { getElementById: () => grid, addEventListener: () => {} },
    I18N: { lang, t: () => "Читати" },
    window: { location: { origin: "https://research.promedia.report" } },
    URL,
    fetch: async () => ({ json: async () => [item] }),
  };
  runInNewContext(source, context);
  await new Promise((resolve) => setImmediate(resolve));
  return grid.innerHTML;
}

const record = {
  id: "test", date: "2026-10-01", year: 2026,
  title: { uk: "Тест", en: "Test" },
  summary: { uk: "Опис", en: "Description" },
  tags: { uk: [], en: [] }, authors: { uk: [], en: [] },
  languages: { uk: { url: "/research/test-uk.html" }, en: { url: "/research/test.html" } },
  coverImageUrl: "https://news.promedia.report/img-storage/research/uk.jpg",
  coverImageUrlEn: "https://news.promedia.report/img-storage/research/en.jpg",
  coverCropData: { feed: { x: 40, y: 65 } },
  coverCropDataEn: { feed: { x: 70, y: 25 } }
};

test("Ukrainian research card displays its cover and focal point", async () => {
  const html = await renderCard(record, "uk");
  assert.match(html, /research-card-image/);
  assert.match(html, /research\/uk.jpg/);
  assert.match(html, /object-position:40% 65%/);
});

test("English research card uses separate English cover and focal point", async () => {
  const html = await renderCard(record, "en");
  assert.match(html, /research\/en.jpg/);
  assert.match(html, /object-position:70% 25%/);
});

test("Legacy research entries without covers keep working", async () => {
  const html = await renderCard({ ...record, coverImageUrl: undefined, coverImageUrlEn: undefined }, "uk");
  assert.doesNotMatch(html, /research-card-image/);
  assert.match(html, /Тест/);
});

test("Untrusted URL schemes are not embedded as images", async () => {
  const html = await renderCard({ ...record, coverImageUrl: "javascript:alert(1)", coverImageUrlEn: undefined }, "uk");
  assert.doesNotMatch(html, /research-card-image/);
});
