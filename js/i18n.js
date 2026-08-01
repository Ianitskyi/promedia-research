// Minimal UA/EN dictionary + content/site.json overlay, shared by every page.
const I18N_STORAGE_KEY = "pm_research_lang";

const I18N_BASE = {
  uk: {
    nav: { promedia: "← ПроМедіа", research: "← Дослідження" },
    meta: {
      indexTitle: "Дослідження ПроМедіа",
      indexDesc: "Дослідження медіаринку України від команди ПроМедіа та її партнерів.",
    },
    hero: {
      eyebrow: "Бібліотека досліджень",
      title: "Дослідження ПроМедіа",
      lede: "Тут поступово збираються дослідження, до яких причетна команда ПроМедіа.",
    },
    list: { sectionLabel: "Усі дослідження", empty: "Дослідження скоро з'являться." },
    links: {
      readFull: "Читати повністю",
      readUk: "Читати українською",
      readEn: "Read in English",
      original: "Оригінал публікації",
      pdf: "PDF",
    },
    footer: { initiative: "Ініціатива" },
  },
  en: {
    nav: { promedia: "← ProMedia", research: "← Research" },
    meta: {
      indexTitle: "ProMedia Research",
      indexDesc: "Research on the Ukrainian media market from the ProMedia team and partners.",
    },
    hero: {
      eyebrow: "Research library",
      title: "ProMedia Research",
      lede: "A growing library of research the ProMedia team has been involved in.",
    },
    list: { sectionLabel: "All research", empty: "Research entries are coming soon." },
    links: {
      readFull: "Read in full",
      readUk: "Читати українською",
      readEn: "Read in English",
      original: "Original publication",
      pdf: "PDF",
    },
    footer: { initiative: "Initiative" },
  },
};

function i18nGet(dict, path) {
  return path.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), dict);
}

function i18nMerge(base, overlay) {
  if (!overlay || typeof overlay !== "object") return base;
  const out = Array.isArray(base) ? [...base] : { ...base };
  Object.keys(overlay).forEach((key) => {
    const overlayVal = overlay[key];
    const baseVal = out[key];
    if (overlayVal && typeof overlayVal === "object" && !Array.isArray(overlayVal) && baseVal && typeof baseVal === "object") {
      out[key] = i18nMerge(baseVal, overlayVal);
    } else {
      out[key] = overlayVal;
    }
  });
  return out;
}

const I18N = {
  dict: I18N_BASE,
  lang: "uk",

  detect() {
    const saved = localStorage.getItem(I18N_STORAGE_KEY);
    if (saved === "uk" || saved === "en") return saved;
    return (navigator.language || "uk").toLowerCase().startsWith("en") ? "en" : "uk";
  },

  async loadOverrides() {
    try {
      const base = document.body.dataset.root || "";
      const res = await fetch(`${base}content/site.json`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.i18n) {
        this.dict = {
          uk: i18nMerge(I18N_BASE.uk, data.i18n.uk),
          en: i18nMerge(I18N_BASE.en, data.i18n.en),
        };
      }
    } catch (error) {
      // Overrides are optional; the built-in dictionary keeps the page working.
    }
  },

  t(path) {
    return i18nGet(this.dict[this.lang], path) ?? i18nGet(this.dict.uk, path) ?? path;
  },

  apply() {
    document.documentElement.lang = this.lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = this.t(el.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      el.innerHTML = this.t(el.dataset.i18nHtml);
    });
    document.querySelectorAll("[data-i18n-content]").forEach((el) => {
      el.setAttribute("content", this.t(el.dataset.i18nContent));
    });
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === this.lang);
    });
    document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang: this.lang } }));
  },

  setLang(lang) {
    if (lang !== "uk" && lang !== "en") return;
    this.lang = lang;
    localStorage.setItem(I18N_STORAGE_KEY, lang);
    this.apply();
  },

  async init() {
    this.lang = this.detect();
    await this.loadOverrides();
    this.apply();
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => this.setLang(btn.dataset.lang));
    });
  },
};

document.addEventListener("DOMContentLoaded", () => I18N.init());
