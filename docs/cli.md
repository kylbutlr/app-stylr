# CLI reference

## `app-stylr-icons`

```sh
app-stylr-icons --source <square-image> --output <directory> [--check]
```

The source may be any square format supported by Sharp. The command writes deterministic Chrome extension, favicon, Apple touch, and PWA PNGs below the output directory. `--check` compares expected bytes without writing and fails when any file is missing or stale.

## `app-stylr-chrome-theme`

```sh
app-stylr-chrome-theme --output <directory> [--check]
```

The command creates an unpacked Manifest V3 Chrome theme from the package’s canonical dark tokens. It writes only inside the chosen output directory. `--check` verifies that an existing output matches the current generator.

Repository maintainers may omit `--output`; the default is the checked-in `chrome-theme/` directory.

## `app-stylr-macos-release-check`

```sh
app-stylr-macos-release-check \
  --info-plist path/to/Info.plist \
  --appcast path/to/appcast.xml \
  --archive path/to/App-1.2.3.zip \
  [--root path/to/project]
```

The command checks semantic and numeric versions, HTTPS feed configuration, the Sparkle public key, signed-feed requirements, archive name and signature metadata, and ZIP integrity. It validates local release artifacts only. It does not sign, upload, deploy, or fetch a public feed.
