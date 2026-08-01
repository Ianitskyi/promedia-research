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
    return { ...entry, matchesLang: !!langs[lang] };
  }

  function renderCard(item) {
    const lang = I18N.lang;
    const title = (item.title && (item.title[lang] || item.title.uk)) || "";
    const summary = (item.summary && (item.summary[lang] || item.summary.uk)) || "";
    const tags = (item.tags && (item.tags[lang] || item.tags.uk)) || [];
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
        <div class="research-card-meta">
          <span class="research-card-year">${escapeHtml(item.year)}</span>
          <span>${escapeHtml((item.authors || []).join(", "))}</span>
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
      const res = await fetch("data/research.json", { cache: "no-store" });
      items = await res.json();
    } catch (error) {
      items = [];
    }
    render();
  }

  document.addEventListener("i18n:change", render);
  load();
})();
