# Lumina

A clean, minimal Hugo theme for photography portfolios.

**Features**
- Album grid on the homepage with cover images
- Per-album thumbnail grid with smooth lightbox
- Keyboard, touch/swipe, and mouse navigation in lightbox
- Sticky frosted-glass header with Work + About navigation
- Hugo image processing — automatic WebP thumbnails, zero manual resizing
- Zero JavaScript dependencies (vanilla JS, ~3KB minified)
- Cloudflare Pages `_headers` for caching and security
- GitHub Actions workflow for automatic deploys

---

## Quick start

### 1. Create a new Hugo site

```bash
hugo new site my-portfolio
cd my-portfolio
```

### 2. Add the theme

**Option A — copy the theme folder** (simplest)

Copy the `lumina/` directory into your site's `themes/` folder:

```
my-portfolio/
└── themes/
    └── lumina/
```

**Option B — Git submodule** (recommended for keeping up to date)

```bash
git init
git submodule add https://github.com/yourusername/lumina themes/lumina
```

### 3. Configure your site

Copy `themes/lumina/exampleSite/hugo.toml` to your site root and edit it:

```toml
baseURL = "https://yoursite.com/"
title   = "Your Name"
theme   = "lumina"

[params]
  author      = "Your Name"
  tagline     = "Photographer"
  aboutPage   = "/about/"
  heroTitle   = "Selected Work"
  heroSubtitle = "Photography from around the world"
```

---

## Adding albums

Albums use **Hugo page bundles** — each album is a folder containing
`index.md` and your image files.

```
content/
└── albums/
    ├── scotland/
    │   ├── index.md
    │   ├── DSC_001.jpg
    │   ├── DSC_002.jpg
    │   └── DSC_003.jpg
    └── portraits/
        ├── index.md
        ├── portrait-01.jpg
        └── portrait-02.jpg
```

### Album front matter (`index.md`)

```yaml
---
title: "Scotland"
location: "Scottish Highlands"
date: 2024-09-01
description: "Autumn in the Cairngorms."
draft: false
---

Optional longer description shown on the album page.
```

### Create a new album with Hugo

```bash
hugo new albums/tokyo/index.md
```

Then drop your `.jpg`, `.jpeg`, `.png`, or `.webp` files into the
`content/albums/tokyo/` folder alongside `index.md`.

**Hugo handles all resizing automatically.** No manual thumbnail
creation needed — the theme generates WebP thumbnails at build time.

---

## Image tips

- **Any resolution works** — Hugo resizes on first build and caches results
- **Naming matters for captions** — `misty-morning-loch.jpg` becomes
  "Misty Morning Loch" in the lightbox caption automatically
- **Add explicit titles** in front matter for precise captions:

  ```yaml
  # Not supported in page bundle images directly —
  # use descriptive filenames instead, or add a
  # data file for metadata (see Advanced section)
  ```

- **Cover image** — the first image in the folder is used as the album
  cover. To choose a specific cover, add it to `index.md`:

  ```yaml
  cover: "/albums/scotland/DSC_007.jpg"
  ```

---

## About page

Create `content/about/index.md`:

```yaml
---
title: "Jane Doe"
subtitle: "Photographer & Visual Storyteller"
portrait: "/images/portrait.jpg"
contact:
  - label: "Email"
    url: "mailto:hello@example.com"
  - label: "Instagram"
    url: "https://instagram.com/yourhandle"
    external: true
---

Your bio text here. Markdown supported.
```

Place your portrait image in `static/images/portrait.jpg`.

---

## Deployment: GitHub → Cloudflare Pages

### Option A — Cloudflare Pages direct Git integration (easiest)

1. Push your site to a GitHub repository
2. Log in to [Cloudflare Pages](https://pages.cloudflare.com)
3. Click **Create a project → Connect to Git**
4. Select your repository
5. Set build settings:
   - **Framework preset**: Hugo
   - **Build command**: `hugo --minify --gc`
   - **Build output directory**: `public`
   - **Environment variable**: `HUGO_VERSION` = `0.140.0` (or latest)
6. Click **Save and Deploy**

Every push to `main` will trigger an automatic rebuild.

### Option B — GitHub Actions (included workflow)

The file `.github/workflows/deploy.yml` is included in the theme.
Copy it to your site repo's `.github/workflows/` folder, then:

1. Get your Cloudflare API token:
   - Cloudflare Dashboard → My Profile → API Tokens
   - Create token with **Cloudflare Pages: Edit** permission

2. Get your Account ID:
   - Cloudflare Dashboard → right sidebar on any domain page

3. Add secrets to your GitHub repo:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`

4. Edit the workflow file — replace `your-project-name` with your
   Cloudflare Pages project name.

---

## Customisation

### Colours

Override any CSS variable in your own `assets/css/custom.css`
(add it after the theme's CSS is loaded), or edit
`themes/lumina/assets/css/main.css` directly:

```css
:root {
  --c-bg:      #FFFFFF;   /* page background */
  --c-text:    #0A0A0A;   /* primary text */
  --c-border:  #E0DDD8;   /* subtle borders */
  --c-accent:  #2A5C8F;   /* if you want a colour accent */
}
```

### Fonts

The theme uses **Cormorant Garamond** (display) and **Jost** (UI)
from Google Fonts. To change them, edit the `<link>` in
`layouts/partials/head.html` and update the `--f-display` / `--f-ui`
variables in the CSS.

### Grid columns

The photo grid is `auto-fill minmax(240px, 1fr)` — it automatically
adapts to screen width. To force a fixed column count, override:

```css
.photo-grid {
  grid-template-columns: repeat(3, 1fr);
}
```

---

## Directory structure

```
lumina/
├── archetypes/
│   └── albums.md           # template for hugo new
├── assets/
│   ├── css/main.css        # all styles
│   └── js/main.js          # lightbox + UI
├── layouts/
│   ├── _default/
│   │   ├── baseof.html     # base template
│   │   ├── single.html     # generic single page
│   │   └── list.html       # generic list page
│   ├── partials/
│   │   ├── head.html       # <head> content
│   │   ├── header.html     # site header + nav
│   │   └── footer.html     # site footer
│   ├── index.html          # homepage album grid
│   ├── albums/
│   │   ├── single.html     # individual album view
│   │   └── list.html       # albums section list
│   ├── about/
│   │   └── single.html     # about page
│   └── 404.html            # custom 404
├── static/
│   ├── _headers            # Cloudflare Pages headers
│   └── _redirects          # Cloudflare Pages redirects
├── exampleSite/            # reference site to copy from
└── theme.toml
```

---

## Requirements

- Hugo **0.110.0** or later (extended edition recommended)
- Images in `.jpg`, `.jpeg`, `.png`, or `.webp` format
- No Node.js, no npm, no build tools beyond Hugo itself

---

## Licence

MIT — use freely, attribution appreciated.
