# Imperivm Resurrected – website

The website for **Imperivm Resurrected**, a community mod for *Imperivm III: Great Battles of Rome HD* on Steam. It's an unofficial fan project.

It's just HTML, CSS and a bit of vanilla JavaScript. No framework, no build step, nothing to install.

## What's in it

Everything lives in `src/`:

- `index.html`, `guide.html`, `sdk.html` and `credits.html` are the pages. Downloads link to the releases page on GitHub.
- `css/styles.css` holds all the styles.
- `js/` has the scripts: language and theme switching, the scroll animations, the donation dialog, and the download button that reads the latest GitHub release.
- `img/` has the images and logos.
- `sdk/` has the modding guides in Spanish, English and Italian, plus the SDK zip. These are generated, so don't edit them by hand.

The site is available in Spanish, English and Italian and picks the language from your browser. Light or dark follows your system, and you can switch it from the header.

## Run it locally

Any static server works:

```
npx http-server src
```

Then open `http://localhost:8080`.

## Deploying

The site is hosted on Vercel, which deploys the `src/` folder (see `vercel.json`) on every push to `main`. Pull requests get a preview deployment. All links are relative, so the site also works under a sub-path.

## Contributing

Fixes and translations are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) first, it's short.

## License

The code is MIT, see [LICENSE](LICENSE). Text, guides, images and logos have different terms, explained in [LICENSE-CONTENT.md](LICENSE-CONTENT.md). The mod itself is a separate project and isn't covered by either file.
