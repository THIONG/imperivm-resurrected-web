# AGENTS.md

Rules for agents and contributors working on this repo. See [CONTRIBUTING.md](CONTRIBUTING.md) and [README.md](README.md) for the full picture.

## Stack

Plain HTML, CSS and vanilla JavaScript in `src/`. No framework, no dependencies, no bundler. Don't add one.

## Code conventions

- Names are in English: files, classes, ids, variables, translation keys.
- No comments in the code. `tools/check.js` fails if there are any.
- Colors and spacing come from the variables at the top of `src/css/styles.css`.
- Reveal animations go through `src/js/motion.js` with `data-reveal`.
- Everything must work in light and dark mode, with reduced motion, and on a phone.
- Menu items added from JavaScript (Donations, Discord) live in `src/js/support.js`, so they show up on every page and language without regenerating anything.

## Generated files

- `src/en/` and `src/it/` are generated from the Spanish pages. Never edit them by hand.
- `src/sdk/` is generated from the SDK docs, which live elsewhere. Never edit it by hand.
- After changing any text or HTML in the Spanish pages, run `node tools/build-languages.js` and commit the result with the change.

## Translations

Spanish, English and Italian. Spanish lives in the HTML, the rest in `src/js/i18n*.js` and `src/js/dictionary.js`, keyed by `data-i18n`. A new key goes into every language.

## Checks

Run before every commit:

```sh
npm install --no-save acorn@8.14.0
node tools/check.js
node tools/build-languages.js --check
```

To preview locally: `npx http-server src -c-1` and open `http://localhost:8080`.
For visual changes, look at light and dark, the three languages and a narrow window (360 px). Responsive breakpoints are 960 px (hamburger menu), 900 px, 820 px, 700 px and 480 px.

## Commits

Conventional Commits, in English, imperative mood, lowercase after the type, no trailing period.

```text
<type>(<scope>): <short summary>
```

- Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.
- Scopes (optional): `header`, `footer`, `menu`, `support`, `i18n`, `sdk`, `css`, `ci`, `tools`.
- Keep the summary under about 72 characters. Add a body only when the why isn't obvious.
- One logical change per commit. Generated files go in the same commit as their source.
- Breaking changes: `!` after the type or a `BREAKING CHANGE:` footer.

Examples:

```text
feat(header): add Discord link with blue glow sweep
fix(menu): move the hamburger breakpoint to 960px
docs: add AGENTS.md with repo conventions
```

## Workflow

- `main` deploys to Vercel on every push, so don't push anything that fails the checks.
- Don't commit `node_modules/`.
- Images and logos in `src/img/` aren't open for reuse. Don't swap them, and never add anything taken from the game itself.
