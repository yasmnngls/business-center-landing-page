# Centri landing page — Glossary

This file lists the Centri terms that appear on the landing page, or that the page's copy and
mocks should use. It is a mirror, for page work. New to the project? Read
[`context.md`](context.md) first.

> **`../internal-marketing/docs/Glossary.md` is authoritative.** This file copies its terms and
> its _Avoid_ lines. It adds no term of its own. A new term is added **there** first, then
> mirrored here. If the two ever disagree, `docs/Glossary.md` wins and this file is a bug.

**How to use this file.** Use each term exactly as written, with its capital letter, in page
copy, mock labels, alt text, and commit messages. Never use a word from an _Avoid_ line to name
a Centri object. Each one was rejected for a reason.

A plain English word is fine when it describes the visitor's world, not a Centri object. "The
spreadsheet you're tired of rebuilding" is fine. "Upload a spreadsheet to Centri" is not — the
Centri object is a Dataset.

---

## The product

**Centri**
The product: an AI-powered Business Command Center.
_Avoid_: the platform, the app, the tool (in user-facing copy)

**Business Command Center**
Centri's product category — the operational layer on which a business is run. Not a dashboard
product, not a BI tool, not an assistant.
_Avoid_: business OS, command centre (use US spelling in product terms)

**Pillar**
One of Centri's four top-level product areas: Connect, Ask, Dashboard, Automate.
_Avoid_: section, area, feature group

**Workspace**
The container for everything, and the trust boundary. Every object belongs to exactly one.
_Avoid_: account, organisation, tenant, team, company

**Project**
An optional container that groups Conversations, Dashboards, Workflows, Knowledge Sources,
Documents, Assets, and Members. A lens over things, never a filing step required before value.
_Avoid_: folder, workspace (unqualified), mandatory project

---

## People and access

**Member**
A person's participation in a Workspace. Also the name of the lowest role.
_Avoid_: user, seat, account

**Owner** / **Operator**
The roles above Member. The Owner is accountable for the workspace. The Operator runs it:
connects data, defines metrics, publishes workflows.
_Avoid_: admin, administrator, superuser (Owner); editor, manager, power user (Operator)

**Group**
An organisational unit used for routing work and sharing resources. It carries no permissions.
_Avoid_: team, department, unit, squad

**Visibility**
Whether one specific resource is reachable by one specific person: private, workspace,
restricted, or link.
_Avoid_: permission, access

**Link share**
A signed, revocable, optionally expiring URL granting read access to a Dashboard.
_Avoid_: public link, share URL

---

## Connect — bringing information in

**Connect**
The pillar covering all information entering Centri.
_Avoid_: integrations, imports, data sources (as a pillar name)

**Data Connection**
A live, read-only link to an external system that Centri synchronises and normalises. It
reads. It never acts.
_Avoid_: integration, source, connector (unqualified)

**Managed Connection**
A Data Connection to a known system whose meaning Centri understands at build time.
_Avoid_: native integration, official integration

**Dataset**
Structured data the user provides directly: a CSV or Excel upload, or a connected Google
Sheet. Its meaning is inferred, not known in advance.
_Avoid_: file, upload, table, spreadsheet, data source

**Knowledge Source**
Unstructured company context: PDF, Markdown, plain text, or pasted text. It produces Answers,
never Insights.
_Avoid_: context, context file, document, attachment, knowledge base

**Sync**
Retrieving new or changed data from a Data Connection. Not the same as Refresh.
_Avoid_: update, import, pull

**Profiling**
Automatic, deterministic inspection of a Dataset to detect its structure, types, grain,
measures, dimensions, and data-quality risks.
_Avoid_: scan, analyse, parse, inspect

**Ambiguity confirmation**
Asking the user to confirm an inferred meaning — only where the answer would change a number,
and never more than three questions per Dataset.
_Avoid_: onboarding, setup, configuration, mapping

**Stale**
An Insight whose result is no longer known to be current. Always shown with its cause, never
corrected automatically.
_Avoid_: outdated, expired, invalid, broken

---

## Meaning — the Semantic Catalog

**Semantic Catalog**
The organisation's machine-readable understanding of its own data: entities, fields,
relationships, terminology, and metrics, in business language. "AI Catalog" is an approved
nickname in the product interface; the canonical term stays Semantic Catalog.
_Avoid_: schema, data model, metadata, data dictionary, semantic layer

**Metric**
A named, reusable, versioned business calculation that must carry its provenance. A Measure
is a field; a Metric is a definition.
_Avoid_: KPI, measure, formula, calculation

**Provenance**
Where a piece of meaning came from, and who defined it. A required property, never optional
metadata.
_Avoid_: origin, source (unqualified), lineage

**Metric version**
An immutable revision of a Metric definition. Redefining a Metric creates a version; it never
rewrites what has already been computed.
_Avoid_: revision, edit, update

---

## Insight — the primary object

**Insight**
The primary object of Centri. A unit of business understanding — a chart, a KPI, a table, or a
stated finding — carrying its definition, its result, and its provenance.
_Avoid_: widget, card, chart, report, tile, artifact

**Insight Definition**
The durable, inspectable, plain-language statement of what an Insight measures: over what
population, in what window, at what grain, presented how. It executes without the AI.
_Avoid_: query, spec, QuerySpec, SQL, config

**Result**
The values produced by executing an Insight Definition. Results are append-only.
_Avoid_: data, output, value, snapshot

**Refresh**
Re-executing an Insight Definition to append a new Result. Distinct from Sync, which fetches
source data.
_Avoid_: reload, sync, update, recalculate

**Drill to detail**
Expanding a number to the rows that produced it, alongside the filters, window, and metric
definition applied. The primary trust mechanism.
_Avoid_: export rows, view data, inspect, debug, view source

**Auto-refresh**
An optional per-Insight property causing it to refresh without user action. The exception —
manual refresh is the default.
_Avoid_: live, real-time, streaming

**Freeze**
Permanently fixing a Result as a historical record and detaching that Insight from refresh.
_Avoid_: snapshot, lock, pin, archive

---

## Ask — understanding

**Ask**
The pillar, and the act of asking a business question in natural language.
_Avoid_: chat, query, prompt, search, copilot

**Conversation**
A natural-language exchange in which Insights and Answers are produced.
_Avoid_: chat, thread, session, history

**Answer**
A cited, qualitative response drawn from Knowledge Sources. It cannot be refreshed into a
number.
_Avoid_: response, result, summary

**Citation**
A reference to the source and location of a passage an Answer relied on.
_Avoid_: source link, footnote, reference

---

## Dashboard — deciding

**Dashboard**
A user-curated collection of Insights, arranged deliberately. Centri's only collection
surface. Not an always-live BI grid.
_Avoid_: Pin Board (superseded name), canvas, page, workspace

**Pin**
The act of placing an Insight on a Dashboard.
_Avoid_: save, add, bookmark, favourite, star

**Export**
Producing a portable copy of an Insight or a Dashboard.
_Avoid_: download, share, print

**Comment**
A plain-text remark left on a Dashboard by anyone with access, once its owner has turned
Comments on. Always written by a person, never by the model.
_Avoid_: note, annotation, feedback (unqualified)

---

## Signals — operating

**Signals**
The workspace landing page, and the only surface on which the product asks for a person's
attention.
_Avoid_: home, feed, inbox, notifications, activity, dashboard

**Starter Insight**
An Insight generated from the user's real data immediately after the first structured
ingestion. Never hardcoded, never demo data.
_Avoid_: sample, example, demo, default insight

---

## Automate — acting

**Automate**
The pillar covering workflows. The continuation of Ask into action, not a separate product.
_Avoid_: automation, integrations, pipelines, orchestration

**Workflow**
A versioned sequence of nodes performing recurring work. Published versions are immutable.
_Avoid_: automation, flow, recipe, job, pipeline, sequence

**Node**
One step in a Workflow. Five types exist: Trigger, AI Agent, Human Review, Action, Insight.
_Avoid_: step (that word means something else), block, task, action (unqualified)

**Trigger**
The node that starts a Workflow: manual or scheduled.
_Avoid_: event, hook, schedule

**Run**
One execution of one published Workflow version.
_Avoid_: execution, job, instance, invocation

**Draft**
An unpublished Workflow. Editable, dry-runnable, and never externally effective.
_Avoid_: unsaved, WIP, test

**Publish**
Making a Workflow version live. Only Owners and Operators may do it.
_Avoid_: activate, enable, deploy, turn on

**Dry run**
Executing a Workflow with external actions stubbed, reporting what would have happened.
Required before scheduling anything that reaches the outside world.
_Avoid_: test, preview, simulate, trial

**Action Connector**
An authorised ability to perform an action in an external system. Never the same
authorisation as a Data Connection to the same provider.
_Avoid_: integration, app, connector (unqualified), destination

**Human Review**
A point at which a Workflow requires a person's judgement before it continues. Both a node
type and a product concept.
_Avoid_: approval, gate, checkpoint, sign-off

**Workflow Template**
A curated, human-authored Workflow blueprint. Curated, never AI-generated.
_Avoid_: preset, recipe, starter, example

**AI Agent**
A configured AI participant with a defined purpose, instructions, permitted tools, and a
required structured output. It reasons; it never computes.
_Avoid_: assistant, bot, copilot, persona, character, teammate

---

## Words we do not use

`../internal-marketing/docs/Glossary.md` §15 holds the full list of rejected terms, each with
its reason. The ones that most often creep into marketing copy: **widget** and **card** (say
Insight), **Pin Board** (say Dashboard), **chat**, **copilot**, and **assistant** (say Ask),
**inbox** and **feed** (say Signals), **file** and **spreadsheet** as an object name (say
Dataset), **semantic layer** (say Semantic Catalog), **live** and **real-time** (say
Auto-refresh), **report** as a number-bearing object (say Insight), and
**admin/editor/viewer** as role names (say Owner/Operator/Member).

---

## Terms used on this page

Where each term appears today. "Should appear" means the page describes the idea in plain
words and could use the term. Mismatches found in the current page are listed in
[`TASK-TRACKER.md`](TASK-TRACKER.md) under "Copy and claim conflicts".

| Term | Where it appears |
|---|---|
| Centri | Nav, hero, footer, Why Centri, FAQ, final CTA |
| Business Command Center | Hero chip link ("An AI-powered Business Command Center") |
| Connect | Connect section kicker; How it works card; footer |
| Ask | Ask section heading; hero Ask view; footer. The Sharing viewer has "Ask this Dashboard" |
| Dashboard | Dashboard section; Sharing section and dialog ("Share this Dashboard"); hero sidebar; footer |
| Automate | Automate section kicker; hero sidebar link; Human review mock ("Automate / Monday revenue report") |
| Insight | Trust section lead ("Every Insight Centri gives you"); Dashboard toolbar; Sharing viewer ("4 Insights"); Automate step "Recompute Insights" |
| Insight Definition | Should appear. The page says "definition" in plain words (Trust tabs, hero card, FAQ) |
| Metric | Should appear. The Ask reply and hero card show metric definitions without the term |
| Provenance | Shown, not named: the `⟐ Retail Sales · …` line on every mock Insight |
| Drill to detail | Shown, not named: the **Rows** control and the "source rows" tab in Trust |
| Dataset | Shown as "Dataset: Retail Sales" in the Trust definition panel. Copy elsewhere says "spreadsheet" |
| Data Connection | Should appear. The Connect section lists sources in plain words |
| Profiling | Connect body ("Centri profiles it"); How it works "Profile my Retail Sales spreadsheet"; FAQ |
| Ambiguity confirmation | Shown, not named: the "Which one marks when a sale happened?" question in How it works |
| Semantic Catalog | Not on the page. `Landing-Page-Copy.md` uses it in the Connect pillar |
| Refresh | Dashboard toolbar and lead ("refresh them in one click") |
| Sync | Should appear. The Automate step "Refresh Retail Sales" fetches source data, which is a Sync |
| Pin | Hero and Ask cards ("Pin to Dashboard"); Dashboard section ("Pinned insights", "Pin an answer") |
| Export | Dashboard toolbar |
| Comment | Sharing dialog ("Comments & interactions"); viewer meta |
| Link share | Sharing dialog ("Link sharing"); Sharing points ("Secure links") |
| Visibility | Sharing dialog ("Visibility": Private, Workspace, Restricted) |
| Workspace | Hero sidebar label; Sharing dialog and points |
| Project | Hero sidebar ("Projects") |
| Group | Sharing dialog and points ("people or groups") |
| Workflow | Automate builder ("Workflows" tab, trigger panel); How it works Act card; Human review copy |
| Trigger | Automate builder (trigger node and trigger panel) |
| Draft | Automate builder state label |
| Publish | Should appear. The builder says "Activate" |
| Dry run | Should appear. The builder has no dry-run step yet |
| Workflow Template | Automate builder empty state ("templates") |
| Human Review | Human review section heading; Automate "You review" node |
| Action Connector | Should appear. "Send to leadership" is an Action node that needs one |
| Signals | Not on the page. The hero sidebar's first item is "Home" |
| Auto-refresh | Not on the page. Keep it that way unless the copy needs it, and never say "real-time" |
