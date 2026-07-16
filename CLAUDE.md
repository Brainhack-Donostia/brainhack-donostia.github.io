# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

The static website for Brainhack Donostia, an annual neuroscience "brainhack" event in San Sebastián. Built with **Jekyll** (Ruby) using a customized "Agency" Bootstrap theme. It is a single-page site (`index.html`) assembled from `_includes` partials, plus a standalone `registration.html` page and per-speaker `_posts`.

## Commands

Requires Ruby >= 2.5, GCC, and Make (see Jekyll's install docs — the OS-preinstalled Ruby on macOS does not work).

```bash
bundle install                       # install gems (run after any Gemfile change)
bundle update                        # if gems are out of sync with the Gemfile
bundle exec jekyll serve --trace     # serve locally with live reload (preferred)
jekyll serve                         # alternative if jekyll is on PATH
```

There is no test suite, linter, or build step beyond the Jekyll build itself. Verify changes by running `jekyll serve` and checking the page in a browser.

Do not commit `Gemfile.lock` changes from `bundle update` to `master` unless intentional (see README).

## Branching model

- `master` is the production branch (deployed via GitHub Pages).
- Year-specific work happens on a branch like `BHD2025`, with personal sub-branches created off of it (`git checkout -b YourSubbranch`).
- Workflow: commit to your sub-branch → push → open a PR into the year branch (e.g. `BHD2025`) → that branch is eventually merged to `master`.
- Always `git pull` before starting local work.

## Architecture

**Page assembly**: `index.html` sets `layout: default` and is just a sequence of `{% include %}` calls. `_layouts/default.html` wraps the whole page (`head`, `header`, then all section includes, `footer`, `modals`, `js`). To change a section of the page, edit the corresponding file in `_includes/`, not `index.html`/`default.html` directly (unless reordering or adding/removing whole sections).

Key includes and what they render:
- `head.html` — `<head>`, CSS/font links, page title/meta.
- `header.html` — nav bar and hero.
- `services.html` — "About us" section (edit paragraphs here for the about text).
- `program.html` — the event schedule table (hardcoded HTML `<table>`, not data-driven — edit cell-by-cell each year).
- `portfolio_grid.html` — keynote speaker grid, iterates over `site.posts` (see Posts/speakers below).
- `projects.html` — hardcoded per-project write-ups for the current year (goals, links, descriptions) — edit directly each year, not data-driven.
- `about.html`, `team.html`, `conduct.html`, `contact.html`, `clients.html` (sponsors), `footer.html`, `modals.html`, `js.html`, `social.html`.
- `registration_main.html` exists but its include/nav link are currently commented out (registration is handled by the standalone `registration.html` page instead).

**Site data / config (`_config.yml`)**:
- `people:` — organizing team list (name, `pic`, `position`, `social` links). Consumed by `team.html`, expects `img/team/{{ pic }}.jpg`.
- `social:` — footer/global social links.
- `address:` — postal address lines.
- Also holds `url`, `title`, `description`, and Jekyll build settings (`markdown: kramdown`, `permalink: pretty`).

**Speakers/talks as posts (`_posts/`)**: Each keynote/talk is a Jekyll post named `yyyy-mm-dd-project-n.markdown` with front matter: `title`, `subtitle`, `layout: default`, `modal-id` (unique int, wired to the Bootstrap modal it opens), `date`, `img`, `thumbnail`, `project-date`, `category`, `description` (long-form HTML/text, rendered inside a modal). `portfolio_grid.html` and `modals.html` both iterate `site.posts` — `modal-id` must be unique and consistent between the two.

**Custom Liquid plugin**: `_plugins/hex_to_rgb.rb` adds a `hex_to_rgb` filter (hex string → RGB decimal array) used for theming from `_data/template.yml` (`color:` hex values without leading `#`).

**Images** (`img/`), sized per README convention — keep new assets consistent:
- `img/team/*` — 620×820, organizing team headshots referenced by `people[].pic` in `_config.yml`.
- `img/portfolio/*` — thumbnails 400×289, expanded/modal images 600×450.
- `img/about/*` — 200×200, BHD timeline images.
- `img/logos/*` — header background 1900×1250; contact/register 1469×725; sponsor logos 295×86.

## Conventions/gotchas

- Sections like `program.html` and `projects.html` are edited by hand each year with hardcoded HTML rather than being data-driven — expect to rewrite their contents wholesale for a new event edition, not just append.
- `modal-id` values in post front matter must stay unique and are the link between `portfolio_grid.html`'s trigger and `modals.html`'s modal markup — check both when adding/removing a speaker.
- `_site/` is the Jekyll build output and is gitignored; never edit it directly.
