# Mila Potapova — personal brand website

Static one-page portfolio site. No build step: plain HTML, CSS and a small JS file.
Hosted on GitHub Pages from the `gh-pages` branch, which mirrors `main` (see Deploy below).

## Structure

| Section (id)   | Languages | Content source |
|----------------|-----------|----------------|
| Header / nav   | UA + EN   | — |
| Hero (`#top`)  | UA + EN   | Portrait from CV; positioning line written from CV + interviews |
| About (`#about`) | UA + EN | CV (EN + UA), Inweb interview quote, AIN.UA / ТиКиїв facts, Second investors deck (1.5M reach) |
| Projects (`#projects`) | **UA only** | 4 featured cases (Second × OLX, Respublika Park + «Храми», «Жінки в мистецтві», KYIVNESS) + 11 window/installation cards from the «Вітрини В.С.» deck |
| Media (`#media`) | UA + EN labels, UA titles | 7 verified links: 2 interviews, 1 teaching mention, 4 features |
| Services (`#services`) | UA + EN | Derived from CV competencies and public roles (consulting, KAMA intensive, partnerships) |
| Contact (`#contact`) | UA + EN | Email and phone from CV; mailto-based form (no backend) |
| Footer         | UA + EN   | — |

Language switching: every bilingual element exists twice, marked `lang="uk"` and `lang="en"`.
CSS hides the inactive language via `html[data-lang]`. The choice is stored in `localStorage`
and can be forced with `?lang=en`. Portfolio cards carry no `lang` attribute, so they show in
both modes; the EN mode adds a one-line note that project stories are in Ukrainian.

## Design system (assets/css/styles.css, section 1 “Tokens”)

- **Type**: Cormorant Garamond (display, 500) + Manrope (body). Google Fonts, Cyrillic subsets.
  Scale: display `clamp(2.75rem, 7vw, 5.5rem)`, h2 `clamp(2rem, 4.2vw, 3.25rem)`, body 17px / 1.65.
- **Colour**: warm off-white background `#F6F2EC`, tint `#EDE6DC`, ink `#1F1B17`, secondary ink
  `#5E574F`, line `#DCD3C7`, accent bronze `#8B6A3E`, olive `#6D765E` (media labels, KYIVNESS tile).
- **Spacing**: 4 / 8 / 16 / 24 / 40 / 64 / 96 px scale; section padding `clamp(4rem, 9vw, 7rem)`.
- **Shape**: radius 6 px (inputs, chips) and 10 px (photos, cards); one soft shadow.
- **Components**: `.btn` / `.btn--ghost`, `.chip`, `.eyebrow`, `.media-frame--43|--45`, `.stat`,
  `.case` (featured project row, alternating), `.card` (grid project), `.tile` (typographic case
  without photo), `.press` (media list), `.service`, `.form`.
- **Breakpoints**: 600, 720, 860 (mobile nav), 900, 960, 1000 px. Container 1200 px, 16px+ gutters.
- **Motion**: `.reveal` fade-up on scroll, disabled under `prefers-reduced-motion`.

## Editing content

- Texts live directly in `index.html`. Keep the UA/EN pairs together.
- Photos: `assets/img/projects/<slug>.jpg` (≤1600 px) plus `<slug>-800.jpg` for small screens.
  Re-export with the same names to swap an image.
- To add a media item, copy one `<li>` inside `ul.press`.
- To add a window project, copy one `article.card` inside the `.grid--3`.

## Local preview

```bash
python3 -m http.server 8765 --directory .
```

Then open http://localhost:8765/.

## Deploy to GitHub Pages

Live site: https://oleksii-lunkov.github.io/mila-website/

GitHub Pages serves the `gh-pages` branch of `oleksii-lunkov/mila-website`. The workflow in
`.github/workflows/pages.yml` mirrors `main` into `gh-pages` on every push, so publishing is:

```bash
git push origin main
```

The site updates about a minute later. `deploy.sh` is only needed to recreate the setup in a new
repo (it requires a signed-in GitHub CLI).
