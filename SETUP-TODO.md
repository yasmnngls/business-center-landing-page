# Centri landing page — Before launch

Things **a person** must do or decide before this page goes public. An agent cannot do these.
Each links to its row in [`TASK-TRACKER.md`](TASK-TRACKER.md). Tick an item only when it is
actually done.

## Content that needs real sources

- [ ] **Real testimonials** (`LN-01`, `LN-02`). Collect quotes from real customers, with
      written permission for their name, role, quote, and photo. Replace the ten placeholders
      in §10 and the AI-generated portraits in `img/people/`. If none are ready, decide whether
      §10 ships at all (`LN-03`).
- [ ] **FAQ: "What does this cost?"** (`LN-04`). The product owner writes the answer. The PRD
      has no commercial model.
- [ ] **FAQ: "How is my data handled?"** (`LN-04`). Security and Legal write and approve the
      answer.
- [ ] **Privacy and Terms pages** (`LN-05`). Legal supplies them. The footer links point to `#`
      today.
- [ ] **Copy sign-off** (`CP-01`). The product owner approves the final headline and CTA.
      `Landing-Page-Copy.md` says its own headline is not final.

## Product decisions the page is waiting on

- [ ] **Automate triggers and dry run** (`CC-02`, `CC-03`, `CP-03`). Which triggers may the
      mock show, and how is the Phase 2 status shown?
- [ ] **Connect logo set** (`CC-05`, `CP-04`). Which sources may the page name?

## Infrastructure

- [ ] **Where access requests go** (`LN-06`). The Request a demo form shows a thank-you but
      sends nothing. Choose a destination (form service, email, CRM). Any new third-party
      script needs approval under `CLAUDE.md` rule 22.
- [ ] **Hosting and domain.** Choose where the static site is served and point the domain at
      it.
- [ ] **Intro video music** (`VID-01`). License or commission a track. See
      `video/MUSIC_CUE.md`.

## Final checks

- [ ] Run the `preflight` skill on the release commit.
- [ ] Search the page for `PLACEHOLDER`. Nothing marked placeholder is shown as real.
