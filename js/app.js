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

  function languageLink(item, lang) {
    const entry = item.languages && item.languages[lang];
    if (!entry) return null;
    const isFull = entry.type === "full";
    const label = lang === "uk" ? I18N.t("links.readUk") : I18N.t("links.readEn");
    const cls = isFull ? "research-link primary" : "research-link secondary";
    const target = isFull ? "" : ' target="_blank" rel="noopener"';
    return `<a class="${cls}" href="${escapeHtml(entry.url)}"${target}>${escapeHtml(label)}</a>`;
  }

  function renderCard(item) {
    const lang = I18N.lang;
    const title = (item.title && (item.title[lang] || item.title.uk)) || "";
    const summary = (item.summary && (item.summary[lang] || item.summary.uk)) || "";
    const tags = (item.tags && (item.tags[lang] || item.tags.uk)) || [];
    const links = [languageLink(item, "uk"), languageLink(item, "en")].filter(Boolean).join("");

    return `
      <article class="research-card">
        <div class="research-card-meta">
          <span class="research-card-year">${escapeHtml(item.year)}</span>
          <span>${escapeHtml((item.authors || []).join(", "))}</span>
        </div>
        <h2>${escapeHtml(title)}</h2>
        <p>${escapeHtml(summary)}</p>
        ${tags.length ? `<div class="research-card-tags">${tags.map((tag) => `<span class="research-tag">${escapeHtml(tag)}</span>`).join("")}</div>` : ""}
        <div class="research-card-links">${links}</div>
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
