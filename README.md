# martin-krutsky.github.io

Personal academic website of Martin Krutský, built with [Jekyll](https://jekyllrb.com/) and hosted on GitHub Pages.
GitHub Pages builds the site automatically on every push to `master`; no build step or workflow is needed.

## Editing content

All content lives in `_data/` as JSON:

| File | What it holds |
| --- | --- |
| `profile.json` | Name, role, photo, contact links, About Me paragraphs |
| `news.json` | Dated news items on the homepage (newest first) |
| `research.json` | The three research areas on the homepage |
| `papers.json` | Publications; `"selected": true` puts a paper on the homepage. `type` decides the section on the Publications page (Conference/Journal/Workshop, Preprint, \*Thesis) |
| `talks.json` | Talks and events (newest first) |
| `experience.json` | Research, industry, and education entries on the homepage |

The CV download is `assets/files/cv.pdf`.

## Structure

```
_config.yml          site title, description, URL
_data/               content (see above)
_layouts/default.html  page shell: head/meta tags, header, footer
_includes/           small templates (paper entry, authors, links, CV list, inline SVG icons)
index.html           homepage
publications.html    all publications
talks.html           all talks
assets/css/style.css styles (light + automatic dark mode), @font-face rules
assets/fonts/        self-hosted Lora + Source Sans 3 (SIL OFL), latin + latin-ext subsets
sw.js                retires the service worker used by the old site; safe to delete later
```

## Local preview

With Docker:

```bash
docker run --rm -p 4000:4000 -v "$PWD:/srv/jekyll" jekyll/jekyll:4.2.2 jekyll serve
```

Then open http://localhost:4000.

## Credits

- Fonts: [Lora](https://fonts.google.com/specimen/Lora) and [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3), SIL Open Font License 1.1.
- Icons in `_includes/icon.html`: [Font Awesome Free 6.4.0](https://fontawesome.com) (envelope, file-pdf, github, linkedin; icons licensed CC BY 4.0) and [Academicons 1.9.2](https://jpswalsh.github.io/academicons/) (google-scholar, orcid; SIL OFL 1.1).
