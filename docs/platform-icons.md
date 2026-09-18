# Platform icon exports

App Stylr generates browser-extension and installable-site icons from one square product master. The included charcoal-to-mint base is an optional brand recipe, not a requirement for using the generator.

## Generate the assets

Install the pinned App Stylr release, then run the packaged generator from the consuming app root:

```sh
npx app-stylr-icons --source assets/app-icon.svg --output public/icons
```

The source may be SVG, PNG, or another format supported by Sharp. It must be square because every generated target is square. A product may start from [`app-icon-gradient-base.svg`](../assets/app-icon-gradient-base.svg) or supply its own artwork. Keep any intentional transparent space consistent across exports.

The generator creates:

```text
chrome/
  icon-16.png
  icon-32.png
  icon-48.png
  icon-128.png
web/
  favicon-32.png
  apple-touch-icon-152.png
  apple-touch-icon-167.png
  apple-touch-icon-180.png
  apple-touch-icon.png
  icon-192.png
  icon-512.png
```

The `chrome/` and `web/` subdirectories are stable parts of the interface. Keep them intact so the supplied templates work without path edits.

## Chrome browser extensions

Chrome requires square raster extension icons and does not support SVGs in manifest icon declarations. The standard set is `16`, `32`, `48`, and `128` pixels. Generate into the extension's `icons` directory, then merge [`chrome-extension-icons.json`](../templates/chrome-extension-icons.json) into the extension manifest:

```sh
npx app-stylr-icons --source assets/app-icon.svg --output icons
```

- Use the 16px and 32px files for the toolbar action.
- Use the complete set for the top-level manifest `icons` field.
- Inspect 16px and 32px manually. If the product symbol disappears, simplify the master symbol instead of introducing unrelated artwork.

See Chrome's official [extension icon configuration](https://developer.chrome.com/docs/extensions/develop/ui/configure-icons) and [`icons` manifest reference](https://developer.chrome.com/docs/extensions/reference/manifest/icons).

## Apple and iOS Home Screen

Generate into the deployed site's public icon directory, then add the links in [`apple-touch-icons.html`](../templates/apple-touch-icons.html) to the document `<head>`. The unsuffixed `apple-touch-icon.png` is the 180px iPhone asset.

The included `152`, `167`, and `180` pixel files cover the iPad and iPhone sizes documented by Apple. Use PNG and let the operating system apply its platform presentation. Products using the optional App Stylr rounded-square recipe should preserve its transparent outer space.

See Apple's official [web application configuration](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/ConfiguringWebApplications/ConfiguringWebApplications.html).

## Installable sites and PWAs

Merge [`web-app-icons.json`](../templates/web-app-icons.json) into the site's web app manifest. The generated 192px and 512px PNGs are the general installable-site icons. The template declares `purpose: "any"`; do not change it to `maskable` until the product master has been tested against maskable-icon safe zones.

For Netlify, Vercel, or another static host, these are ordinary committed public assets. Hosting does not generate them automatically.

## Verification

- Confirm every exported file has the dimensions encoded in its filename.
- Confirm transparent corners remain intact.
- Load an unpacked Chrome extension and inspect the toolbar and `chrome://extensions` presentation.
- Add the deployed site to an iPhone or iPad Home Screen and confirm the icon and title.
- Keep all exports pinned to the same App Stylr release and source master.
