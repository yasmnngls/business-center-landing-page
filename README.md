# Centri landing page

Marketing site for **Centri**, an AI-powered business command center. Centri connects your spreadsheets and systems, answers business questions in plain language, and shows the exact data and definition behind every number.

It's a static site: plain HTML, CSS and JavaScript, with no framework and no build step.

## Run it locally

Any static file server works. From the project root:

```sh
python -m http.server 8080 --bind 127.0.0.1
```

Then open http://127.0.0.1:8080. You can also open `index.html` directly in a browser.

## Project structure

```
index.html        The whole page, sections 01–13, plus the SVG icon sprite
css/style.css     Marketing shell: tokens, layout, sections, marquees
css/app.css       Product UI mocks (scoped to .app-ui): hero app, dashboard,
                  sharing, the Automate builder, motion helpers
js/script.js      All interactivity, in one file
img/              Logos, and img/people/ for testimonial portraits
favicon.svg
video/            Separate Remotion project for the 60s intro video (see video/README.md)
```

## Page sections

| # | Section | What it does |
|---|---|---|
| 01 | Hero | App window mock with a working Ask view. Recent and suggested questions swap in answers, and the Rows toggle shows the source rows |
| 02 | Introducing | The problem and what Centri is |
| 03 | Connect | Logo wall of data sources. There are three marquee rows, and each pauses on its own when hovered or pressed |
| 04 | Trust | Definitions and source rows behind every answer |
| 05 | Ask | Segmented demo of asking questions |
| 06 | How it works | Connect → Understand → Decide → Act cards |
| 07 | Dashboard | Interactive board with a guided demo cursor that builds it from empty |
| 08 | Sharing | Share settings and a read-only viewer with "Ask this Dashboard" |
| 08b | Automate | Workflow builder (see below) |
| 09 | Human review | Nothing is sent without a person approving it |
| 10 | Why Centri | Two-row testimonial marquee (see below) |
| 11–13 | FAQ, final CTA, footer | |

### Automate builder

This is a mock of the Automation app, with a Workflows tab, a toolbar, a canvas and a trigger panel.

- **Empty state:** a dashed Trigger placeholder, a *Recommended* and *All triggers* panel with search, *Ask AI*, and three **templates**.
- **Workflow:** picking a trigger or template builds a 6-step n8n-style flow: trigger → Refresh Retail Sales → Recompute Insights → Draft summary (AI) → **You review** → Send to leadership.
- **Running it:** **Activate** runs the flow step by step. It pauses at *You review* until **Approve** is clicked.
- **Canvas tools:** undo/redo, zoom, and a *Workflow overview* minimap.
- **Guided demo:** it plays once when the workflow card is in view. A cursor applies the *Monday revenue report* template, activates it and approves the review. Any click or key press stops it, and *Replay demo* restarts it.

### Testimonials

There are two rows of five cards, scrolling in opposite directions. Hovering, pressing or focusing a row pauses only that row.

> **Placeholder content.** The testimonial names, roles and quotes are placeholders. The portraits in `img/people/` are AI-generated faces (StyleGAN, from thispersondoesnotexist.com), not real people. Replace them with real customer quotes and photos, with permission, before launch.

## Motion and accessibility

- Animations only change `transform` and `opacity`, with custom ease-out and ease-in-out curves, and UI transitions under 300ms.
- `prefers-reduced-motion` is respected everywhere:
  - Marquees become scrollable rows.
  - Demos don't autoplay.
  - Runs jump straight to their end state.
- Hover effects only apply on devices with a real pointer, via `@media (hover: hover) and (pointer: fine)`.
- Interactive mocks use real buttons, with `aria-live` status text where state changes.

## Cache busting

The CSS and JS links in `index.html` carry a version query, `?v=14`. Bump it when you change `css/` or `js/` so browsers pick up the new files.

## Intro video

`video/` is a Remotion (React + TypeScript) project for a 60-second 1920×1080 intro. Build commands and structure are in [`video/README.md`](video/README.md). `node_modules/` and the rendered files in `out/` are git-ignored.

## Docs

- [`context.md`](context.md): what this repository is, the page map, and how to run and verify it
- [`CLAUDE.md`](CLAUDE.md): the rules for changing the page, including what the copy may claim
- [`glossary.md`](glossary.md): the Centri terms to use on the page
- [`TASK-TRACKER.md`](TASK-TRACKER.md): what is built, what is open, and known copy conflicts
- [`SETUP-TODO.md`](SETUP-TODO.md): what a person must do before launch

Product truth lives in the sibling repository: `../internal-marketing/docs/PRD.md` and `../internal-marketing/docs/Landing-Page-Copy.md`.
