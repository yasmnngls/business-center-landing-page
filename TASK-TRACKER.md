# Centri landing page — Task Tracker

> **Working tracker for this repository only.** It records what is built on the page and what
> is open. It states no product requirement. Product truth is
> `../internal-marketing/docs/PRD.md`; approved copy is
> `../internal-marketing/docs/Landing-Page-Copy.md`; terms are [`glossary.md`](glossary.md).
> Where this file disagrees with those, **they win and this file is stale.**

**Last reconciled:** 2026-09-29, on `main` at `248d547`.

---

## How to read a row

Each task has four columns: **Task**, **Status**, **Remarks**, and **Estimate Effort**.

| Status | Means |
|---|---|
| `To Do` | Not started. |
| `In Progress` | Being worked on now. |
| `Review` | Built. The author says it works. **Nobody else has checked it yet.** |
| `Done` | Built **and** checked by someone other than the author. The checker is named in Remarks. |
| `Blocked` | Waits on a person or a decision. The blocker is named in Remarks. |
| `Won't Do` | Dropped, with the reason in Remarks. |

Rules for this file:

- **`Review` is an honest value, not a waiting room.** Do not move a row to `Done` because the
  code exists. Move it when a second person (or the `frontend-reviewer` / `spec-guard` agent,
  run by someone other than the author) has checked it, and name them.
- **When torn between two states, record the worse one.**
- **A failed check is written down.** The row stays open and the failure goes in Remarks.
- **Update this file in the same push as the change.** Never "later".

**Estimate Effort** uses a fixed scale: `15 Minutes · 30 Minutes · 1 Hour · 2 Hours · 4 Hours ·
1 Day · 2 Days`. `Review` and `Done` rows show `—`.

---

## 1. Built so far

Everything below is in `main`. None of it has had an independent check, so every row is
`Review`.

| Task | Status | Remarks | Estimate Effort |
|---|---|---|---|
| `PG-01` Static page shell: tokens, layout, sticky nav, mobile menu | Review | `css/style.css`, `index.html`. No build step. Commit `d2b5b08`. | — |
| `PG-02` Hero with working Ask view (§01) | Review | Recent and suggested questions swap answers. Rows toggle shows source rows. Free text is keyword-matched; unmatched questions get a refusal. | — |
| `PG-03` Introducing, Trust, Ask, How it works (§02, §04–§06) | Review | Trust uses segmented tabs: answer, definition, source rows. | — |
| `PG-04` Connect logo wall (§03) | Review | Three marquee rows, each pauses on its own. Logo set not yet checked against the PRD — see `CC-05`. | — |
| `PG-05` Interactive Dashboard with guided demo cursor (§07) | Review | Builds from empty, then hands over. Chart/Table switch, Refresh, remove, re-add from Pinned insights, rename, Tidy layout, Export menu. | — |
| `PG-06` Sharing dialog and read-only viewer (§08) | Review | Visibility, people and groups, link sharing with expiry, restriction and password, Comments toggle, follow-up questions toggle. Copy taken from the product's ShareDialog. | — |
| `PG-07` Automate workflow builder (§08b) | Review | Trigger panel with search and Ask AI, three templates, six-node flow, run pauses at "You review" until Approve, undo/redo, zoom, minimap. Glossary and PRD mismatches — see `CC-01`–`CC-04`, `CC-08`, `CC-09`. | — |
| `PG-08` Automate guided demo | Review | Plays once in view. Any click or key stops it. Replay demo restarts it. | — |
| `PG-09` Human review section (§09) | Review | Static dark card of the Monday revenue report run. | — |
| `PG-10` Two-row testimonial marquee with AI portraits (§10) | Review | Ten placeholder quotes. Portraits in `img/people/` are StyleGAN faces. Rows scroll in opposite directions and pause one at a time. Clones hidden from assistive tech. **Placeholder** — see `LN-01`. | — |
| `PG-11` FAQ, final CTA, footer, request-access modal (§11–§13) | Review | Two FAQ answers are visible placeholders. The form shows a thank-you and sends nothing — see `SETUP-TODO.md`. | — |
| `PG-12` Motion and reduced-motion pass | Review | Transform and opacity only, custom easings, hover gated by `(hover: hover) and (pointer: fine)`. Reduced motion: marquees scroll, demos do not autoplay, runs jump to the end. Not checked on a real device — see `QA-01`. | — |
| `PG-13` Cache-busting on CSS and JS links | Review | `?v=16` on all three tags. | — |
| `PG-16` Design-feedback pass and review fixes (§01, §06–§08) | Review | Logo + "Centri" lockups in the hero app, Dashboard rail and shared viewer. Removed the hero audience note, the share-CTA note and the Dashboard "Try it" hint (only Replay demo remains). Captions end with a full stop. Hero title held to two lines at 700px and up. Ask panel matches the Pinned insights height side by side. Demo captions use Insight/Dashboard. `frontend-reviewer` fixes: no layout-property animation, touch scroll no longer stops the demo, no toasts during the demo, inert drag copy, stable bar column. **Open:** the hero "Q2 orders vs plan" answer uses plan figures no Dataset holds — see `CC-10`. | — |
| `PG-15` Ask section build-in (§05) | Review | Plays once in view, in the order Centri builds an answer: Dataset rows are read, steps run, bars sweep, then the AI's sentence, then provenance. CSS only, keyed off `.ask__stage.is-in`. Reduced motion shows everything at once. | — |
| `PG-14` Remotion intro video project (`video/`) | Review | 60s, 1920×1080. Music bed is a silent placeholder (`video/MUSIC_CUE.md`). | — |
| `DOC-01` README | Review | Commit `248d547`. Says the Connect wall has two rows; it has three. Fix with the next README change. | — |
| `DOC-02` CLAUDE.md, context.md, glossary.md, this tracker, SETUP-TODO.md | Review | Modelled on `../internal-marketing`. | — |

---

## 2. Copy and claim conflicts

Places where the page does not match the PRD or the glossary. Each one needs a fix or a product
decision. None is fixed yet.

| # | Conflict | Where | Source | State |
|---|---|---|---|---|
| `CC-01` | The builder says **Activate** / **Active**. The glossary term is **Publish**, and "activate" is on its _Avoid_ line. | §08b `#flowRun`, `#auState`; `script.js` `setActivated` | Glossary: Publish | open |
| `CC-02` | The trigger panel offers event triggers (new sheet row, new email, new payment, deal closed, new ticket, new table rows, Webhook). PRD Phase 1 triggers are manual and scheduled only (`FR-162`). Event and webhook triggers are Phase 2 (`FR-189`). The "Metric alert" trigger may fit "the trigger is a Signal" (`FR-322`) — check. | §08b trigger panel and templates | PRD `FR-162`, `FR-189`, `FR-322` | open — product decision |
| `CC-03` | The run goes from Draft straight to running. The PRD requires a **Dry run** before a workflow that reaches the outside world is published. | §08b run | Product guardrail 20; glossary: Dry run | open |
| `CC-04` | Step "Refresh Retail Sales" fetches source data. That is a **Sync**. Step "Recompute Insights" is a **Refresh**. | §06 Act card, §08b flow, §09 dark card | Glossary: Sync, Refresh | open |
| `CC-05` | The Connect wall and body name Gmail and Meta Ads as data sources, and the wall also shows Telegram, Bluesky, and MailerSend logos. The PRD names Google Sheets, CSV and Excel, BigQuery (Phase 1), and HubSpot, Stripe, Zendesk, Intercom (`FR-373`, Phase 2). The others are not defined as Data Connections. The Phase 2 set must not read as available today. | §03 | PRD §10.1, `FR-368`, `FR-373` | open — product decision |
| `CC-06` | FAQ placeholders cite "PRD Q-7" (cost) and "PRD Q-4" (data handling). In the PRD, `Q-04` is the first automation target and `Q-07` is the first Action Connector. Commercial model is out of scope (`D-020`, §6.2). | §11 FAQ | PRD §17 open questions, `D-020` | open |
| `CC-07` | Copy calls an Insight a "card" ("Every card keeps its definition", "Switch a card between Chart and Table"). "Pinned insights" is lower case. | §07 lead and demo hint, Dashboard library | Glossary: Insight | open |
| `CC-08` | The builder header says **Automation**. The pillar is **Automate**; "automation" is on its _Avoid_ line. | §08b `.au-head` | Glossary: Automate | open |
| `CC-09` | "Ask AI" suggests a trigger ("Centri AI suggests …"). No PRD requirement found for AI-suggested triggers. | §08b trigger panel | Rule 0 | open — check PRD |
| `CC-10` | The hero "Q2 orders vs plan" answer shows plan figures (1,250 / 1,250 / 1,300) that no Dataset holds, under source *Retail Sales*. The PRD supports actuals against targets only across two Datasets. | §01 hero Ask `heroAnswers.q2`, the chip and the Recent item | Guardrails 4, 5, 9 | open — product decision: drop the answer, or add a named sample plan Dataset |
| `CC-10` | Hero headline, subhead, and CTA ("Request Access") differ from `Landing-Page-Copy.md` ("Connect what you know…", "Get started"). The copy doc's headline itself still needs product sign-off. | §01, §12 | `Landing-Page-Copy.md` | open — see `CP-01` |
| `CC-11` | The hero sidebar's first item is "Home". The glossary lists "home" on the _Avoid_ line for Signals. The product's own app also uses "Home", so this may be accepted UI microcopy. | §01 sidebar | Glossary: Signals | open — ask |
| `CC-12` | Footer "Workflows" links to `#how`, not `#automate`. The top nav has no Automate link. | §13, nav | — | open |

---

## 3. Open work

| Task | Status | Remarks | Estimate Effort |
|---|---|---|---|
| `LN-01` Replace placeholder testimonials with real, approved quotes | Blocked | Needs real customers who give written permission for name, role, quote, and photo. Until then the section stays labelled as placeholder. | 2 Hours |
| `LN-02` Replace AI-generated portraits in `img/people/` | Blocked | Same blocker as `LN-01`. Delete the StyleGAN files once replaced. | 1 Hour |
| `LN-03` Decide whether §10 ships at launch if `LN-01` is not done | To Do | Options: remove the section, or keep it clearly marked as illustrative. Product owner decides. | 15 Minutes |
| `LN-04` Approved answers for FAQ cost and data handling | Blocked | Cost: product owner (PRD has no commercial model). Data handling: Security and Legal. Fix the wrong PRD IDs at the same time (`CC-06`). | 1 Hour |
| `LN-05` Privacy and Terms pages | Blocked | Footer links point to `#`. Needs Legal. | 1 Hour |
| `LN-06` Request-access form backend | Blocked | The form sends nothing today. Needs a decision on where requests go. See `SETUP-TODO.md`. | 4 Hours |
| `CP-01` Check every section's copy against `Landing-Page-Copy.md` and the PRD | To Do | Line by line. Record each gap in §2. Run `spec-guard`. | 4 Hours |
| `CP-02` Fix glossary drift `CC-01`, `CC-04`, `CC-07`, `CC-08` | To Do | Labels only. Bump `?v=` if `script.js` changes. | 1 Hour |
| `CP-03` Resolve Automate scope `CC-02`, `CC-03`, `CC-09` | Blocked | Needs a product decision on which triggers to show and how to show a dry run. | 2 Hours |
| `CP-04` Resolve Connect logo set `CC-05` | Blocked | Needs a product decision. Remove or relabel logos the PRD does not define. | 1 Hour |
| `CP-05` Check the mocks against the current product UI | To Do | `app.css` and the share dialog copy were taken from the product. Check they have not drifted. | 2 Hours |
| `QA-01` Real-device feel check of all demos | To Do | Hero Ask, Dashboard demo, Sharing, Automate demo, marquees. On a phone and a laptop trackpad. Note anything that feels slow or stuck. | 2 Hours |
| `QA-02` 390px phone check of every section | To Do | No horizontal scroll, 16px gutters, mocks readable, dialogs usable. Screenshots outside the repo. | 1 Hour |
| `QA-03` Reduced-motion check of every section | To Do | With `prefers-reduced-motion: reduce` on. Demos must not autoplay; runs must jump to the end. | 30 Minutes |
| `QA-04` Keyboard and screen-reader pass | To Do | Tab order, focus in dialogs, Escape, `aria-live` status text, marquee clones hidden. | 2 Hours |
| `QA-05` Cross-browser check | To Do | Chrome, Safari, Firefox, and iOS Safari. | 1 Hour |
| `QA-06` Page weight and load check | To Do | Fonts, images, and the size of `index.html` (inline SVG). | 1 Hour |
| `DOC-03` Fix the README Connect row count | To Do | Two rows → three rows. | 15 Minutes |
| `VID-01` Music for the intro video | To Do | Silent placeholder today. See `video/MUSIC_CUE.md`. | 2 Hours |
