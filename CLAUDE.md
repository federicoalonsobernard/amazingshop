# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Server

This is a static site — no build step required.

```bash
# Start the dev server (from the project root)
python -m http.server 5501
```

Then open http://localhost:5501/ in a browser.  
Any file change is reflected immediately on the next page reload (no hot-reload).

## Project Structure

```
amazingshop/
├── index.html          # Homepage: hero banner + 6-card product grid
├── product.html        # Product detail page (main UI)
├── css/styles.css      # All styles — single file, no preprocessor
├── js/main.js          # All interactivity — vanilla JS, no framework
└── assets/
    └── amazinglogo.jpg # Site logo (copied from Downloads)
```

## Architecture

The site is **two-page static HTML** with shared header and footer markup duplicated across both files. There is no templating engine or component system — changes to the header or footer must be applied to both `index.html` and `product.html` manually.

**CSS layout** (`css/styles.css`):
- The header is built entirely with flexbox inside `#header-main` and `#header-nav`.
- The product page uses a **3-column CSS Grid** (`#product-page`: `430px 1fr 260px`). The left image column, centre info column, and right buy-box collapse responsively at 1100 px and 720 px breakpoints.
- All colours match Amazon's palette: `#131921` (dark header), `#232f3e` (nav), `#febd69` / `#ffd814` / `#ff9900` (action yellows/oranges).

**JS interactivity** (`js/main.js`):
- `initGallery()` — swaps `#main-img` src when a `.thumbnail` is clicked; tracks `.active` class.
- `initVariants()` — toggles `.selected` class within each `.variant-options` group.
- `initCart()` — increments `#cart-count`, animates the badge, calls `showToast()`.
- `showToast()` — creates/reuses a fixed toast element; auto-hides after 2 s.
- All initialisation is wired in a single `DOMContentLoaded` listener.

**Gallery images** currently use `https://placehold.co` placeholder URLs. Replace the `data-full` attributes on `.thumbnail` elements and the initial `src` of `#main-img` in `product.html` with real image paths when adding actual products.

## Key Conventions

- **English is the default language** — `<html lang="en">` on both pages; the language selector button calls `showToast` as a no-op mock.
- **No external JS dependencies** — everything is vanilla ES6; no npm, no bundler.
- **Single CSS file** — add new styles to `css/styles.css`; do not create additional stylesheets.
- The logo `assets/amazinglogo.jpg` is referenced as a relative path — keep it in `assets/` alongside any future product images.
