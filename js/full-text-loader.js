// Optional: if a research article page provides a plain-text file with the
// verbatim article text, load it and show it instead of the editorial
// summary. Lets the rights holder add the full text later by editing a
// plain .txt file on GitHub, with no HTML knowledge required.
(function () {
  var container = document.querySelector("[data-full-text-src]");
  if (!container) return;

  var src = container.getAttribute("data-full-text-src");

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch];
    });
  }

  fetch(src, { cache: "no-store" })
    .then(function (res) { return res.ok ? res.text() : ""; })
    .then(function (text) {
      var trimmed = text.trim();
      if (!trimmed) return;

      var summary = document.getElementById("article-summary-body");
      var note = document.getElementById("article-summary-note");
      if (summary) summary.hidden = true;
      if (note) note.hidden = true;

      container.innerHTML = trimmed
        .split(/\n\s*\n/)
        .map(function (paragraph) {
          return "<p>" + escapeHtml(paragraph.trim()).replace(/\n/g, "<br>") + "</p>";
        })
        .join("");
      container.hidden = false;
    })
    .catch(function () {
      // No full text yet, or it failed to load — the summary stays visible.
    });
})();
