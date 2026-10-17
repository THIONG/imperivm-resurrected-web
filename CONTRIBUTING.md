# Contributing

This is the website of a small community mod, so there's no heavy process. If you spot a typo, a broken link or a bad translation, just send a pull request.

For anything bigger, open an issue first so we don't both waste time on something that doesn't fit.

## Running it

There's no build step. Serve the `src` folder with any static server:

```
npx http-server src
```

## What I'd like to keep

The site is plain HTML, CSS and JavaScript. No framework, no dependencies, no bundler. If a change needs one of those, it probably needs a different approach.

A few habits in the code:

- Names are in English (files, classes, ids, variables, translation keys).
- No comments in the code.
- Colors and spacing come from the variables at the top of `css/styles.css`.
- Reveal animations all go through `js/motion.js` with `data-reveal`. Please don't add one-off animations to a single page.
- It has to work in light and dark mode, with reduced motion, and on a phone.

## Translations

The site is in Spanish, English and Italian. Spanish is written in the HTML. English and Italian are in the `js/i18n*.js` files, keyed by the `data-i18n` attributes. If you add a key, add it to every language.

Native speakers fixing wording are the most useful contribution here, Italian especially.

After editing text, run `node tools/build-languages.js` to regenerate the English and Italian pages (`src/en/` and `src/it/`), and commit them together with your change. Do not edit those folders by hand.

## SDK guides

Everything in `src/sdk/` is generated from the SDK docs, which live elsewhere, so edits there get overwritten. If a guide has a mistake, open an issue with the guide name and the line.

## Before opening the pull request

Open the pages yourself: light and dark, the three languages, and a narrow window around 360 px wide. Check the console for errors. Add a screenshot if the change is visual.

## Licenses

Code you send is MIT, text and guides are CC BY-SA 4.0 (see [LICENSE-CONTENT.md](LICENSE-CONTENT.md)). Only send things you wrote or have the right to share. The images and logos in `src/img/` aren't open for reuse, so don't swap them without talking to me first.

And don't add anything taken from the game itself.
