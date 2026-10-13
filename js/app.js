// Renders the research card grid on index.html from data/research.json.
(function () {
  const grid = document.getElementById("research-grid");
  if (!grid) return;

  let items = [];

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[ch]));
  }

  function primaryEntry(item, lang) {
    const langs = item.languages || {};
    const entry = langs[lang] || langs.uk || langs.en;
    if (!entry) return null;
    // Відносні адреси рахуються від кореня сайту, щоб вони працювали і з /en/, /crh/.
    const url = /^(https?:)?\//.test(entry.url) ? entry.url : "/" + entry.url;
    return { ...entry, url, matchesLang: !!langs[lang] };
  }

  function localizedList(field, lang) {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    return field[lang] || field.uk || [];
  }

  function coverHtml(item, lang, href, title) {
    const isEnglishCover = lang === "en" && item.coverImageUrlEn;
    const raw = isEnglishCover ? item.coverImageUrlEn : item.coverImageUrl;
    if (!raw) return "";
    let url;
    try {
      url = new URL(raw, window.location.origin);
      if (!["https:", "http:"].includes(url.protocol)) return "";
    } catch (_) { return ""; }
    const data = isEnglishCover ? item.coverCropDataEn : item.coverCropData;
    const point = data && (data.feed || data.desktop);
    const x = point && Number.isFinite(Number(point.x)) ? Math.min(100, Math.max(0, Number(point.x))) : 50;
    const y = point && Number.isFinite(Number(point.y)) ? Math.min(100, Math.max(0, Number(point.y))) : 50;
    const image = '<img class="research-card-image" src="' + escapeHtml(url.href) +
      '" alt="' + escapeHtml(title) + '" loading="lazy" style="object-position:' + x + '% ' + y + '%" />';
    return href ? '<a class="research-card-cover-link" href="' + escapeHtml(href) + '">' + image + '</a>' : image;
  }

  function renderCard(item) {
    const lang = I18N.lang;
    const title = (item.title && (item.title[lang] || item.title.uk)) || "";
    const summary = (item.summary && (item.summary[lang] || item.summary.uk)) || "";
    const tags = localizedList(item.tags, lang);
    const authors = localizedList(item.authors, lang);
    const entry = primaryEntry(item, lang);
    const href = entry ? entry.url : null;
    const titleHtml = href
      ? `<a href="${escapeHtml(href)}">${escapeHtml(title)}</a>`
      : escapeHtml(title);
    const readLink = entry
      ? `<a class="research-link primary" href="${escapeHtml(entry.url)}"${entry.matchesLang ? "" : ' target="_blank" rel="noopener"'}>${escapeHtml(I18N.t("links.readFull"))}</a>`
      : "";

    return `
      <article class="research-card">
        ${coverHtml(item, lang, href, title)}
        <div class="research-card-meta">
          <span class="research-card-year">${escapeHtml(item.year)}</span>
          <span>${escapeHtml(authors.join(", "))}</span>
        </div>
        <h2>${titleHtml}</h2>
        <p>${escapeHtml(summary)}</p>
        ${tags.length ? `<div class="research-card-tags">${tags.map((tag) => `<span class="research-tag">${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
        <div class="research-card-links">${readLink}</div>
      </article>
    `;
  }

  function render() {
    if (!items.length) {
      grid.innerHTML = `<p class="research-empty">${escapeHtml(I18N.t("list.empty"))}</p>`;
      return;
    }
    grid.innerHTML = items
      .slice()
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
      .map(renderCard)
      .join("");
  }

  async function load() {
    try {
      const res = await fetch("/data/research.json", { cache: "no-store" });
      items = await res.json();
    } catch (error) {
      items = [];
    }
    render();
  }

  document.addEventListener("i18n:change", render);
  load();
})();
