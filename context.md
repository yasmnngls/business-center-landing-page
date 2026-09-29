# Centri landing page — What this repository is

This repository is the **public marketing page for Centri**. It is one static page, in plain
HTML, CSS, and JavaScript, with no build step.

**Centri** is an AI-powered Business Command Center: the operational layer where an
organisation connects its information, understands what is happening, and automates the work
that follows. It has four pillars — **Connect, Ask, Dashboard, Automate** — over one workflow:
**Connect → Understand → Decide → Act**.

> **This repository is not the product.** Centri is built in the sibling repository
> `../internal-marketing` (named that for historical reasons; Centri is not a marketing
> product). The app windows on this page are hand-built mocks of that product, with sample
> data. Nothing on this page talks to a Centri server.

New here? Read this file, then [`glossary.md`](glossary.md), then [`CLAUDE.md`](CLAUDE.md).

> **This document owns:** nothing. It is the orientation layer: the shortest path from "I have
> never seen this repository" to knowing where to look.
>
> **This document does not own:** product truth (`../internal-marketing/docs/PRD.md`), approved
> copy (`../internal-marketing/docs/Landing-Page-Copy.md`), vocabulary
> (`../internal-marketing/docs/Glossary.md`, mirrored in [`glossary.md`](glossary.md)), the
> guardrails ([`CLAUDE.md`](CLAUDE.md)), or task state ([`TASK-TRACKER.md`](TASK-TRACKER.md)).
> **Where this file and an owning document disagree, the owning document is right.**

---

## 1. How the two repositories relate

| | `business-center-landing-page` (this repo) | `../internal-marketing` |
|---|---|---|
| What it is | The public page that explains Centri and collects access requests | The Centri product: API, web app, and all product docs |
| Audience | Visitors who have never used Centri | People who build Centri |
| Source of truth for | Nothing about the product | The product: `docs/PRD.md` |
| Stack | Static HTML, CSS, JS. Remotion for the video only | Node, TypeScript, React, Postgres |

The direction of truth is one way. The PRD and the landing copy flow **from**
`internal-marketing` **into** this page. The page never defines a product fact of its own.

The mock styles in `css/app.css` were taken from the product's
`frontend/src/styles.css`, so the mocks look like the real app. The sharing dialog copies the
product's `ShareDialog` text. If the product changes these, the mocks can drift. That is a
tracker item, not a reason to change the product.

---

## 2. What this repository owns, and what it does not

| Owns | Does not own |
|---|---|
| The page's layout, visual design, and motion | What Centri does, or will do |
| The mock app windows and their sample data | Product terms (the glossary owns them) |
| The interactive demos (hero Ask, Dashboard, Sharing, Automate) | Approved marketing copy (`Landing-Page-Copy.md` owns it) |
| The request-access form's front end | Where access requests go (no backend exists yet) |
| The 60-second intro video project in `video/` | Pricing, security, privacy, or legal statements |
| Placeholder labels and their removal | Real customer quotes, names, and photos |

---

## 3. Page map

All markup is in `index.html`. Each section starts with an HTML comment such as
`<!-- 07 Dashboard (interactive) -->`. The anchor is the `id` you can link to.

| # | Section | Anchor | Purpose | Where its code lives |
|---|---|---|---|---|
| — | Sticky nav | `#stickyNav` | Nav that appears after the hero nav scrolls away | `style.css` `.nav`; `script.js` "Sticky nav", "Mobile menu" |
| 01 | Hero | `#top` | Headline, Request a demo, and an app window with a working Ask view. Recent and suggested questions swap in answers. **Rows** shows the source rows. Free text is keyword-matched; an unmatched question gets a refusal | `app.css` `.c-sidebar`, `.c-card`, `.c-composer`; `script.js` "Hero chat", "Hero source rows toggle" |
| 02 | Introducing | `#introducing` | The problem, and what Centri is | `style.css` `.intro` |
| 03 | Connect | `#product` | Three-row logo wall of data sources. Each row pauses on its own on hover or press | `style.css` `.tile-wall`; `script.js` "Connections marquee" |
| 04 | Trust | `#trust` | One number shown three ways: the answer, the definition, the source rows | `style.css` `.trust`; `script.js` "Segmented tabs" |
| 05 | Ask | `#ask` | A static example of a question, the steps taken, and the answer with provenance | `style.css` `.ask`; `app.css` `.reply` |
| 06 | How it works | `#how` | Connect → Understand → Decide → Act, one card each | `style.css` `.cards-4`, `.use-card`; `script.js` "Scroll reveals" |
| 07 | Dashboard | `#dashboard` | Interactive Dashboard. A guided demo cursor builds it from empty, then hands control to the visitor | `app.css` `.dash`, `.c-grid`, `.c-lib`, `.demo-cursor`; `script.js` "Dashboard", "Dashboard demo" |
| 08 | Sharing | `#share` | Share settings dialog and a read-only viewer with "Ask this Dashboard" | `app.css` `.c-dialog`, `.viewer`, `.c-askpanel`; `script.js` "Share dialog", "Viewer" |
| 08b | Automate | `#automate` | Workflow builder mock. See §4 | `app.css` `.au-*`, `.flow*`; `script.js` "Automate section" |
| 09 | Human review | — | Nothing leaves Centri without a person approving it | `style.css` `.review`, `.dark-card` |
| 10 | Why Centri | — | Two-row testimonial marquee. **Placeholder content** | `style.css` `.why`; `script.js` "Testimonial marquee"; photos in `img/people/` |
| 11 | FAQ | `#faq` | Four questions. Two answers are visible placeholders | `style.css` `.faq`; `script.js` "FAQ accordion" |
| 12 | Final CTA | — | Closing headline and Request a demo | `style.css` `.final` |
| 13 | Footer | — | Links. Privacy and Terms point to `#` today | `style.css` `.footer` |
| — | Request a demo modal | `#modalOverlay` | Name, email, company, role, report. Submitting shows a thank-you only; it sends nothing | `style.css` `.modal`; `script.js` "Request a demo modal" |
| — | Toasts | `#toasts` | Short status messages from the mocks | `app.css` `.c-toasts`; `script.js` "Toasts" |

Shared pieces:

- **Icon sprite** — top of `index.html`, `<symbol id="i-…">`. Logos are `lg-…` symbols inside
  the Connect section.
- **Sample data** — `script.js` "Sample data", plus figures written into `index.html`. The
  main illustrative Dataset is *Retail Sales*, with four stores (Airport, Downtown,
  Riverside, Northgate) and May 2023 figures. All of it is placeholder data.
- **Motion helpers** — `script.js` top: `show`, `hide`, `fadeIn`, `shake`, and the
  `reduceMotion` media query.

---

## 4. The Automate builder in short

The Automate section is the largest mock. It copies an n8n-style workflow editor.

- **Empty state:** a dashed Trigger placeholder, a trigger panel (*Recommended*, *All
  triggers*, search, *Ask AI*), and three templates.
- **Workflow:** a trigger or template builds six nodes: trigger → Refresh Retail Sales →
  Recompute Insights → Draft summary (AI) → **You review** → Send to leadership.
- **Run:** **Activate**, then the run moves step by step and pauses at *You review* until
  **Approve** is clicked. Status text is in `#flowStatus` (`aria-live`).
- **Canvas tools:** undo and redo, zoom, and a *Workflow overview* minimap.
- **Guided demo:** plays once when the card scrolls into view. A cursor applies the *Monday
  revenue report* template, activates it, and approves the review. Any click or key press
  stops it. *Replay demo* restarts it.

Some labels in this mock do not yet match the glossary or the PRD's Phase 1 scope. They are
listed in [`TASK-TRACKER.md`](TASK-TRACKER.md) under "Copy and claim conflicts".

---

## 5. Run and verify

**Run.** Any static file server works. From the repository root:

```sh
python -m http.server 8080 --bind 127.0.0.1
```

Open http://127.0.0.1:8080. You can also open `index.html` directly.

**Verify** before you say a change is done. [`CLAUDE.md`](CLAUDE.md) rule 23 owns the full
list. The short form:

1. `node --check js/script.js` exits 0.
2. Take headless screenshots at 1440px and 390px wide, and look at them. Save them outside the
   repository. For example, with Chrome or Edge:

   ```sh
   chrome --headless=new --window-size=390,3000 --screenshot=<outside-repo>/shot.png http://127.0.0.1:8080/
   ```

3. Click through any changed demo in a real browser. Repeat with reduced motion turned on.
4. If `css/` or `js/` changed, bump `?v=N` on the three tags in `index.html`.
5. `git status` shows only the files you meant to change.

The `verify-app` skill in `.claude/skills/` runs these checks.

**Intro video.** `video/` is a separate Remotion project. See
[`video/README.md`](video/README.md). The site does not depend on it.

---

## 6. Where product truth lives

| Need | Document |
|---|---|
| What Centri is and what it must do | `../internal-marketing/docs/PRD.md` ★ |
| Approved landing copy, and its open items | `../internal-marketing/docs/Landing-Page-Copy.md` |
| Canonical and rejected terms | `../internal-marketing/docs/Glossary.md` |
| Plain-language summary of Centri | `../internal-marketing/docs/Centri-Overview.md` |
| Product design system, colour, type, motion | `../internal-marketing/docs/Design-Plan.md` |
| Product guardrails, including the trust rules | `../internal-marketing/CLAUDE.md` |
| What the product can actually do today | `../internal-marketing/docs/HANDOFF.md` |

`Landing-Page-Copy.md` warns that some capabilities it describes are not built yet. Read
`HANDOFF.md` before the page pairs its copy with a live product demo.

---

## 7. Where to find everything in this repository

| Need | Document |
|---|---|
| The rules for working on this page | [`CLAUDE.md`](CLAUDE.md) |
| The words to use | [`glossary.md`](glossary.md) |
| What is done and what is open | [`TASK-TRACKER.md`](TASK-TRACKER.md) |
| What a person must do before launch | [`SETUP-TODO.md`](SETUP-TODO.md) |
| How to run the site, file layout, section notes | [`README.md`](README.md) |
| The intro video | [`video/README.md`](video/README.md), [`video/MUSIC_CUE.md`](video/MUSIC_CUE.md) |
