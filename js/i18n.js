// Minimal UA/EN/QT (crh, Crimean Tatar Latin) dictionary + content/site.json overlay, shared by every page.
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
      title: "Дослідження у сфері медіа та комунікацій",
      lede: "У цьому розділі публікуємо дослідження, аналітичні роботи та практичні посібники як авторства громадської організації \"ПроМедіа\", так й організацій-партнерів.",
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
      title: "Media and Communications Research",
      lede: "In this section, we publish research, analytical work, and practical guides authored by ProMedia NGO as well as by partner organizations.",
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
  crh: {
    nav: { promedia: "← ProMedia", research: "← Tedqiqatlar" },
    meta: {
      indexTitle: "ProMedia tedqiqatları",
      indexDesc: "ProMedia ekibi ve ortaqlarınıñ Ukraina mediya bazarı aqqında tedqiqatları.",
    },
    hero: {
      eyebrow: "Tedqiqatlar kitaphanesi",
      title: "Mediya ve kommunikatsiyalar saasında tedqiqatlar",
      lede: "Bu bölükte \"ProMedia\" içtimaiy teşkilâtı ve ortaq teşkilâtlarnıñ tedqiqatlarını, analitik işlerini ve ameliy qılavuzlarını derc etemiz.",
    },
    list: { sectionLabel: "Episi tedqiqatlar", empty: "Tedqiqatlar yaqında peyda olacaq." },
    links: {
      readFull: "Tolu oqumaq",
      readUk: "Читати українською",
      readEn: "Read in English",
      original: "Neşirniñ asılı",
      pdf: "PDF",
    },
    footer: { initiative: "Tesebbüs" },
  },
};

const I18N_LANGS = ["uk", "en", "crh"];
const I18N_ROOTS = { uk: "/", en: "/en/", crh: "/crh/" };

// Адреси сайтів мережі ПроМедіа для кожної мови; сайти без crh-версії
// (promedia.report) отримують українську адресу.
const NETWORK_URLS = {
  home: { uk: "https://promedia.report", en: "https://promedia.report/en", crh: "https://promedia.report" },
  news: { uk: "https://news.promedia.report/", en: "https://news.promedia.report/en/", crh: "https://news.promedia.report/crh/" },
  communities: { uk: "https://communities.promedia.report/", en: "https://communities.promedia.report/en/", crh: "https://communities.promedia.report/crh/" },
  ratings: { uk: "https://ratings.promedia.report/", en: "https://ratings.promedia.report/en/", crh: "https://ratings.promedia.report/crh/" },
  research: { uk: "https://research.promedia.report/", en: "https://research.promedia.report/en/", crh: "https://research.promedia.report/crh/" },
  atlas: { uk: "https://atlas.promedia.report/", en: "https://atlas.promedia.report/en/", crh: "https://atlas.promedia.report/crh/" },
};
const NETWORK_ARIA = { uk: "Проєкти ПроМедіа", en: "ProMedia projects", crh: "ProMedia loyihaları" };

function i18nRootLang(path) {
  if (path === "/" || path === "/index.html") return "uk";
  if (path === "/en/" || path === "/en/index.html") return "en";
  if (path === "/crh/" || path === "/crh/index.html") return "crh";
  return null;
}

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

  // Мова — корінь сторінки: / (uk), /en/, /crh/. Старі адреси з ?lang=
  // переводимо на відповідний корінь.
  detect() {
    const rootLang = i18nRootLang(location.pathname);
    const urlLang = new URLSearchParams(location.search).get("lang");
    if (rootLang && I18N_LANGS.includes(urlLang) && urlLang !== rootLang) {
      location.replace(I18N_ROOTS[urlLang] + location.hash);
    }
    if (rootLang) {
      localStorage.setItem(I18N_STORAGE_KEY, rootLang);
      return rootLang;
    }
    const saved = localStorage.getItem(I18N_STORAGE_KEY);
    return I18N_LANGS.includes(saved) ? saved : "uk";
  },

  // Посилання на інші сайти мережі ведуть на їхню версію тією самою мовою.
  syncUrl() {
    const url = new URL(location.href);
    if (url.searchParams.has("lang")) {
      url.searchParams.delete("lang");
      history.replaceState(null, "", url);
    }
    document.querySelectorAll("a[data-network]").forEach((a) => {
      const urls = NETWORK_URLS[a.dataset.network];
      if (urls) a.setAttribute("href", urls[this.lang] || urls.uk);
    });
    document.querySelectorAll("nav.network-nav, nav.network-footer").forEach((nav) => {
      nav.setAttribute("aria-label", NETWORK_ARIA[this.lang] || NETWORK_ARIA.uk);
    });
    document.querySelectorAll("a.home-btn").forEach((a) => {
      a.setAttribute("href", NETWORK_URLS.home[this.lang] || NETWORK_URLS.home.uk);
    });
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
          crh: i18nMerge(I18N_BASE.crh, data.i18n.crh),
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
    this.syncUrl();
    document.dispatchEvent(new CustomEvent("i18n:change", { detail: { lang: this.lang } }));
  },

  setLang(lang) {
    if (!I18N_LANGS.includes(lang)) return;
    this.lang = lang;
    localStorage.setItem(I18N_STORAGE_KEY, lang);
    this.apply();
  },

  async init() {
    this.lang = this.detect();
    await this.loadOverrides();
    this.apply();
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.dataset.lang === this.lang) return;
        const rootLang = i18nRootLang(location.pathname);
        if (rootLang && I18N_ROOTS[btn.dataset.lang]) {
          localStorage.setItem(I18N_STORAGE_KEY, btn.dataset.lang);
          location.href = I18N_ROOTS[btn.dataset.lang];
          return;
        }
        this.setLang(btn.dataset.lang);
      });
    });
  },
};

document.addEventListener("DOMContentLoaded", () => I18N.init());
