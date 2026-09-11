# Guide deployment

The rendered App Stylr Reference deploys to [app-stylr.netlify.app](https://app-stylr.netlify.app/) from `main`.

## Version-controlled configuration

[`netlify.toml`](../netlify.toml) is the deployment source of truth:

- Base directory: `reference`
- Build command: `cd .. && npm ci && npm run site`
- Publish directory: `../.site`

The subdirectory base prevents Netlify from treating the repository's Swift package as a build-time dependency. The build command moves to the repository root, installs the Node dependencies, and prepares a deliberately scoped static artifact.

Netlify documents that the base directory controls where dependency files are detected and where the build runs, and that root `netlify.toml` settings override corresponding UI values. See the official [monorepo configuration](https://docs.netlify.com/build/configure-builds/monorepos/) and [file-based configuration](https://docs.netlify.com/build/configure-builds/file-based-configuration/) documentation.

## Local verification

```sh
npm run site
find .site -maxdepth 2 -type f | sort
```

Only `.site/index.html`, `reference/`, `adapters/`, and `assets/` are published. Package documentation, maintenance files, and repository-only tooling remain outside the artifact.

After Netlify deploys, verify the [single-page Visual Reference](https://app-stylr.netlify.app/).

The retired `/reference/` and `/reference/style-guide.html` URLs permanently redirect to the root Reference page so existing bookmarks do not break.
