# Centri landing page

The public marketing page for **Centri**, an AI-powered Business Command Center. Centri connects your spreadsheets and systems, answers business questions in plain language, and shows the definition and source rows behind every number.

This repository holds the **landing page only**. It is not the product. It is a static site: plain HTML, CSS and JavaScript, with no framework and no build step.

> **Heads up:** The page is a work in progress. The product screens on it are interactive mock-ups. All sample data (the *Retail Sales* Dataset, store names, amounts) is illustrative. Testimonials and some FAQ answers are labelled placeholders until real, approved content replaces them.

## View the page

You need nothing installed except a web browser.

**Option 1: open the file.** Open `index.html` in any modern browser.

**Option 2: use a local server.** From the project root, with Python 3:

```sh
python -m http.server 8080 --bind 127.0.0.1
```

Then open <http://127.0.0.1:8080>. Any other static file server works as well.

The page loads fonts from Google Fonts and makes no other outside requests. There is no analytics or tracking.

## What to try

The mock-ups on the page are interactive:

- **Hero:** Ask a question in the app window. Pick a suggested question, then use the **Rows** toggle to see the source rows. A question the sample data cannot answer gets an honest "can't answer" reply.
- **Dashboard:** Watch a guided cursor build a Dashboard from empty, or click around it yourself.
- **Sharing:** Open the read-only viewer and use **Ask this Dashboard**.
- **Automate:** Pick a trigger or template to build a Workflow, then run it. The run pauses at **You review** until you click **Approve**. Nothing is sent without a person approving it.

Press **Escape** to close any open layer. Every demo works with the keyboard.

## Page sections

| # | Section | What it shows |
|---|---|---|
| 01 | Hero | App window mock with a working Ask view |
| 02 | Introducing | The problem, and what Centri is |
| 03 | Connect | Logo wall of data sources, in three marquee rows |
| 04 | Trust | The definition and source rows behind every answer |
| 05 | Ask | A demo of asking questions |
| 06 | How it works | Connect, Understand, Decide, Act |
| 07 | Dashboard | An interactive Dashboard with a guided demo |
| 08 | Sharing | Share settings and a read-only viewer |
| 08b | Automate | The Workflow builder |
| 09 | Human review | A person approves before anything leaves Centri |
| 10 | Why Centri | Testimonials (placeholders) |
| 11–13 | FAQ, final call to action, footer | Cost and data-handling answers are placeholders |

## Project structure

```
index.html        The whole page, plus the SVG icon sprite
css/style.css     Marketing shell: tokens, layout, sections, marquees
css/app.css       Product UI mock-ups (all scoped to .app-ui)
js/script.js      All interactivity, in one file
img/              Logos, and img/people/ for testimonial portraits
favicon.svg
video/            Separate Remotion project for the intro video (see video/README.md)
```

## Design notes

- **No build step.** Edit a file, refresh the browser.
- **Motion** only changes `transform` and `opacity`, and UI transitions stay under 300ms. With `prefers-reduced-motion`, marquees become scrollable rows, demos do not autoplay, and runs jump to their end state.
- **Hover effects** apply only on devices with a real pointer.
- **Accessibility:** controls are real buttons and links, and changing mock regions announce their state with `aria-live`.
- **Mobile:** no horizontal scroll down to 320px wide.

## Placeholder content

Please do not treat these as real:

- The testimonial names, roles and quotes in section 10.
- The portraits in `img/people/`. They are AI-generated faces, not real people.
- The sample data in the mock-ups.
- The FAQ answers about cost and data handling.

Each one is labelled on the page or in the HTML. Real content needs approval first.

## Contributing

Read [`context.md`](context.md) first, then use the terms in [`glossary.md`](glossary.md). The copy and the mock-ups may only claim what the product requirements define, and the page stays plain HTML, CSS and JavaScript with no build step.

When you change a file in `css/` or `js/`, bump the `?v=N` number on all three `<link>` and `<script>` tags in `index.html`. The three numbers must match. The current value is `?v=35`.

Check the JavaScript before you commit:

```sh
node --check js/script.js
```

## Intro video

`video/` is a separate Remotion (React and TypeScript) project. It is the only part of the repository with a build. The site does not depend on it. See [`video/README.md`](video/README.md).

## More documents

- [`context.md`](context.md): what this repository is, and the page map
- [`glossary.md`](glossary.md): the Centri terms to use on the page
- [`TASK-TRACKER.md`](TASK-TRACKER.md): what is built, and what is open
- [`SETUP-TODO.md`](SETUP-TODO.md): what a person must do before launch

Product requirements and approved copy live in the sibling repository `internal-marketing`, which is not part of this one.
