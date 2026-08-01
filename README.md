# ProMedia Research

Статичний сайт `research.promedia.report` — бібліотека досліджень, до яких
причетна команда ГО «ПроМедіа». Розділ задуманий так, щоб нові дослідження
додавалися поступово, без зміни коду сайту.

## Структура

| Файл / папка | Призначення |
|---|---|
| `index.html` | Головна: хіро-блок і сітка карток усіх досліджень |
| `research/*.html` | Повні тексти досліджень, розміщені на сайті (коли є права й текст) |
| `data/research.json` | Каталог досліджень: назва, опис, рік, автори, теги, посилання на UA/EN версії |
| `content/site.json` | Тексти хіро-блоку та SEO (UA/EN), редаговані через адмінку ProMedia без правок коду |
| `css/style.css` | Стилі ПроМедіа: navy `#0d0c5c` + accent `#ffac33`, Playfair Display + Montserrat — узгоджено з `ratings.promedia.report` |
| `js/i18n.js` | UA/EN перемикач мови + накладання `content/site.json` поверх вбудованого словника |
| `js/app.js` | Рендер карток досліджень з `data/research.json` на головній |

## Як додати нове дослідження

1. Додати текст (якщо публікується повністю на сайті) у `research/<slug>.html`
   — за зразком `research/state-membership-models-ukrainian-media.html`.
2. Додати запис у масив `data/research.json`: `id`, `year`, `date`, `authors`,
   `title`/`summary` (uk/en), `tags`, `languages.uk`/`languages.en`
   (`type: "full"` — сторінка на цьому сайті, `type: "external"` — посилання
   на зовнішню публікацію).
3. Commit і push у `main` — GitHub Actions (`deploy-pages.yml`) автоматично
   опублікує зміни через GitHub Pages.

Через адмінку `promedia-subdomains-admin` можна редагувати `content/site.json`
і `data/research.json` без git — там достатньо GitHub-токена з правом запису
в цей репозиторій.

## Перше дослідження

**«Readers' Clubs and Friends: The State of Membership Models in Ukrainian
Media»** (Membership Puzzle Project & Media Development Investment Fund,
2021) — авторське дослідження Андрія Яницького, автора цього розділу. Обидві
версії розміщено повністю на цьому сайті:

- англійська — `research/state-membership-models-ukrainian-media.html`
  (оригінал, Membership Puzzle Project, 30 липня 2021);
- українська — `research/state-membership-models-ukrainian-media-uk.html`
  (переклад, уперше опублікований [VoxUkraine](https://voxukraine.org/stan-klubnyh-modelej-u-media-v-ukrayini/),
  3 листопада 2021; структура розділів відповідає публікації VoxUkraine).

## Деплой і DNS

Сайт — статичні файли, деплоїться GitHub Actions (`actions/deploy-pages`) на
GitHub Pages з гілки `main`. Файл `CNAME` вказує на `research.promedia.report`.

Щоб субдомен запрацював, потрібно (одноразово, поза цим репозиторієм):

1. У налаштуваннях репозиторію на GitHub: **Settings → Pages** — переконатися,
   що джерело деплою `GitHub Actions` (workflow вмикає це автоматично при
   першому запуску, але варто звірити).
2. У DNS-провайдера домену `promedia.report` додати CNAME-запис:
   `research.promedia.report → ianitskyi.github.io` (за тим самим зразком,
   що й для `communities.promedia.report`, `jobs.promedia.report`).
