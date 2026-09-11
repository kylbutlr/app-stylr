import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { hexToRgb, readJson, readTokens, repoRoot } from "./token-utils.mjs";

const errors = [];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function validateRelativeLinks(filePath, pattern) {
  const source = await readFile(filePath, "utf8");
  const matches = [...source.matchAll(pattern)];

  for (const match of matches) {
    const reference = match[1].split("#")[0].split("?")[0];
    if (!reference || reference.startsWith("http") || reference.startsWith("mailto:")) continue;

    const targetPath = path.resolve(path.dirname(filePath), reference);
    assert(
      await exists(targetPath),
      `${path.relative(repoRoot, filePath)} references missing file ${reference}.`
    );
  }
}

const tokens = await readTokens();
const packageJson = await readJson(path.join(repoRoot, "package.json"));
const packageLock = await readJson(path.join(repoRoot, "package-lock.json"));
const readmePath = path.join(repoRoot, "README.md");
const referencePath = path.join(repoRoot, "reference", "index.html");
const referenceCssPath = path.join(repoRoot, "reference", "styles.css");
const retiredStyleGuidePath = path.join(repoRoot, "reference", "style-guide.html");
const retiredStyleGuideCssPath = path.join(repoRoot, "reference", "style-guide.css");
const browserExtensionGuidePath = path.join(repoRoot, "docs", "browser-extensions.md");
const platformIconGuidePath = path.join(repoRoot, "docs", "platform-icons.md");
const chromeThemeGuidePath = path.join(repoRoot, "docs", "chrome-theme.md");
const deploymentGuidePath = path.join(repoRoot, "docs", "deployment.md");
const gameInterfaceGuidePath = path.join(repoRoot, "docs", "games.md");
const releaseGuidePath = path.join(repoRoot, "docs", "releases.md");
const packageInterfaceGuidePath = path.join(repoRoot, "docs", "package-interface.md");
const cliGuidePath = path.join(repoRoot, "docs", "cli.md");
const compatibilityGuidePath = path.join(repoRoot, "docs", "compatibility.md");
const conventionsGuidePath = path.join(repoRoot, "docs", "conventions.md");
const generatedFilesGuidePath = path.join(repoRoot, "docs", "generated-files.md");
const privacyGuidePath = path.join(repoRoot, "docs", "privacy.md");
const publicBoundaryGuidePath = path.join(repoRoot, "docs", "public-boundary.md");
const publicReadmeGuidePath = path.join(repoRoot, "docs", "public-readmes.md");
const migrationGuideRelativePath = `docs/migrations/v${tokens.version}.md`;
const migrationGuidePath = path.join(repoRoot, migrationGuideRelativePath);
const chromeThemeRoot = path.join(repoRoot, "chrome-theme");
const chromeThemeManifestPath = path.join(chromeThemeRoot, "manifest.json");
const netlifyConfigPath = path.join(repoRoot, "netlify.toml");
const retiredPagesWorkflowPath = path.join(repoRoot, ".github", "workflows", "pages.yml");
const siteBuildScriptPath = path.join(repoRoot, "scripts", "build-site.mjs");
const siteOutputPath = path.join(repoRoot, ".site");
const publishedReferenceDirectoryPath = path.join(siteOutputPath, "reference");
const publishedGameInterfaceGuidePath = path.join(siteOutputPath, "docs", "games.md");
const consumerTemplatePath = path.join(repoRoot, "templates", "app-stylr.json");
const consumerSchemaPath = path.join(repoRoot, "templates", "app-stylr.schema.json");
const consumerAgentInstructionsPath = path.join(repoRoot, "templates", "consumer-agents.md");
const publicReadmeTemplatePath = path.join(repoRoot, "templates", "public-product-readme.md");
const chromeIconTemplatePath = path.join(repoRoot, "templates", "chrome-extension-icons.json");
const webIconTemplatePath = path.join(repoRoot, "templates", "web-app-icons.json");
const appleIconTemplatePath = path.join(repoRoot, "templates", "apple-touch-icons.html");
const fontsCssPath = path.join(repoRoot, "adapters", "css", "fonts.css");

assert(packageLock.version === packageJson.version, "Package lock and package versions must match.");
assert(packageLock.packages?.[""]?.version === packageJson.version, "Package lock root version is stale.");

await validateRelativeLinks(readmePath, /\]\(([^)]+)\)/g);
await validateRelativeLinks(referencePath, /(?:href|src)="([^"]+)"/g);
await validateRelativeLinks(browserExtensionGuidePath, /\]\(([^)]+)\)/g);
await validateRelativeLinks(platformIconGuidePath, /\]\(([^)]+)\)/g);
await validateRelativeLinks(chromeThemeGuidePath, /\]\(([^)]+)\)/g);
await validateRelativeLinks(deploymentGuidePath, /\]\(([^)]+)\)/g);
await validateRelativeLinks(gameInterfaceGuidePath, /\]\(([^)]+)\)/g);
await validateRelativeLinks(releaseGuidePath, /\]\(([^)]+)\)/g);
await validateRelativeLinks(packageInterfaceGuidePath, /\]\(([^)]+)\)/g);
await validateRelativeLinks(cliGuidePath, /\]\(([^)]+)\)/g);
await validateRelativeLinks(compatibilityGuidePath, /\]\(([^)]+)\)/g);
await validateRelativeLinks(conventionsGuidePath, /\]\(([^)]+)\)/g);
await validateRelativeLinks(generatedFilesGuidePath, /\]\(([^)]+)\)/g);
await validateRelativeLinks(privacyGuidePath, /\]\(([^)]+)\)/g);
await validateRelativeLinks(publicBoundaryGuidePath, /\]\(([^)]+)\)/g);
await validateRelativeLinks(publicReadmeGuidePath, /\]\(([^)]+)\)/g);
await validateRelativeLinks(publicReadmeTemplatePath, /\]\(([^)]+)\)/g);
await validateRelativeLinks(path.join(repoRoot, "examples", "web", "README.md"), /\]\(([^)]+)\)/g);
await validateRelativeLinks(path.join(repoRoot, "examples", "migration", "README.md"), /\]\(([^)]+)\)/g);
await validateRelativeLinks(migrationGuidePath, /\]\(([^)]+)\)/g);

const consumerTemplate = await readJson(consumerTemplatePath);
const consumerSchema = await readJson(consumerSchemaPath);
const consumerAgentInstructions = await readFile(consumerAgentInstructionsPath, "utf8");
const publicReadmeGuide = await readFile(publicReadmeGuidePath, "utf8");
const publicReadmeTemplate = await readFile(publicReadmeTemplatePath, "utf8");
const expectedRelease = `https://github.com/kylbutlr/app-stylr/tree/v${tokens.version}`;

assert(publicReadmeGuide.includes("## Standard section order"), "Public README guide must define the standard section order.");
assert(publicReadmeGuide.includes("## Verification checklist"), "Public README guide must include a verification checklist.");
for (const heading of ["Status", "Highlights", "Quick start", "Privacy and permissions", "Known limitations", "Development", "App Stylr", "Support", "License"]) {
  assert(publicReadmeTemplate.includes(`## ${heading}`), `Public README template must include the ${heading} section.`);
}

assert(consumerTemplate.name === "App Stylr", "Consumer template must use the App Stylr name.");
assert(
  consumerTemplate.version === tokens.version,
  "Consumer template version must match the canonical token version."
);
assert(
  consumerTemplate.release === expectedRelease,
  "Consumer template release must point to the current version tag."
);
assert(
  ["dark", "light"].includes(consumerTemplate.theme),
  "Consumer template theme must be dark or light."
);
assert(
  consumerTemplate.exceptions === "docs/app-stylr-exceptions.md",
  "Consumer template must use the standard exceptions path."
);
assert(
  consumerSchema.required?.every((field) => Object.hasOwn(consumerTemplate, field)),
  "Consumer template must include every field required by its schema."
);
assert(
  consumerAgentInstructions.includes("https://app-stylr.netlify.app/") &&
    !consumerAgentInstructions.includes("https://app-stylr.netlify.app/reference/"),
  "Consumer agent instructions must link the root Visual Reference."
);
assert(
  consumerAgentInstructions.includes("Before interface work"),
  "Consumer agent instructions must require visual review before UI work."
);
assert(
  consumerAgentInstructions.includes("Compare affected viewports and interaction states against the reference"),
  "Consumer agent instructions must require comparison before completion."
);
assert(
  consumerAgentInstructions.includes("Do not silently follow `main` or mix files from different releases"),
  "Consumer agent instructions must preserve the pinned-release boundary."
);
assert(
  consumerAgentInstructions.includes("docs/app-stylr-exceptions.md"),
  "Consumer agent instructions must route intentional differences to the exceptions file."
);
assert(
  consumerAgentInstructions.includes("Game Interface profile"),
  "Consumer agent instructions must describe the optional Game Interface profile."
);
assert(
  consumerAgentInstructions.includes(`App Stylr v${tokens.version}`),
  "Consumer agent instructions must reference the current release."
);
assert(
  consumerSchema.$id === `https://github.com/kylbutlr/app-stylr/blob/v${tokens.version}/templates/app-stylr.schema.json`,
  "Consumer schema ID must reference the current release."
);
const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

async function validatePng(relativePath, expectedWidth, expectedHeight, requireAlpha = false) {
  const png = await readFile(path.join(repoRoot, relativePath));
  assert(png.subarray(0, 8).equals(pngSignature), `${relativePath} must be a PNG file.`);
  if (!png.subarray(0, 8).equals(pngSignature) || png.length < 26) return;

  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  const colorType = png.readUInt8(25);
  assert(width === expectedWidth, `${relativePath} must be ${expectedWidth}px wide, received ${width}px.`);
  assert(height === expectedHeight, `${relativePath} must be ${expectedHeight}px high, received ${height}px.`);
  if (requireAlpha) assert([4, 6].includes(colorType), `${relativePath} must preserve an alpha channel.`);
}

assert(!(await exists(retiredStyleGuidePath)), "The retired standalone Style Guide HTML must remain removed.");
assert(!(await exists(retiredStyleGuideCssPath)), "The retired standalone Style Guide CSS must remain removed.");
assert(!(await exists(publishedReferenceDirectoryPath)), "The deployed Reference must render at the site root, not under /reference.");
assert(!(await exists(publishedGameInterfaceGuidePath)), "The scoped reference site must exclude game-specific documentation.");

const trackedTextFiles = [
  "README.md",
  "AGENTS.md",
  "CHANGELOG.md",
  "Package.swift",
  "package.json",
  "adapters/css/fonts.css",
  "docs/browser-extensions.md",
  "docs/cli.md",
  "docs/chrome-theme.md",
  "docs/compatibility.md",
  "docs/conventions.md",
  "docs/deployment.md",
  "docs/generated-files.md",
  "docs/package-interface.md",
  "docs/privacy.md",
  "docs/public-boundary.md",
  "docs/public-readmes.md",
  migrationGuideRelativePath,
  "docs/platform-icons.md",
  "docs/releases.md",
  "netlify.toml",
  "reference/index.html",
  "reference/styles.css",
  "scripts/audit-public-surface.mjs",
  "scripts/build-chrome-theme.mjs",
  "scripts/build-site.mjs",
  "scripts/verify-package.mjs",
  "templates/app-stylr.json",
  "templates/app-stylr.schema.json",
  "templates/apple-touch-icons.html",
  "templates/chrome-extension-icons.json",
  "templates/consumer-agents.md",
  "templates/public-product-readme.md",
  "templates/app-stylr-exceptions.md",
  "templates/web-app-icons.json",
  "tokens/app-stylr.json"
];

for (const relativePath of trackedTextFiles) {
  const content = await readFile(path.join(repoRoot, relativePath), "utf8");
  assert(!content.includes("App Design System"), `${relativePath} contains the retired App Design System name.`);
  assert(!content.includes("app-design-system"), `${relativePath} contains the retired app-design-system slug.`);
}

const changelog = await readFile(path.join(repoRoot, "CHANGELOG.md"), "utf8");
assert(changelog.includes(`## [${tokens.version}]`), `CHANGELOG.md must include version ${tokens.version}.`);

const cssAdapter = await readFile(path.join(repoRoot, "adapters", "css", "app-stylr.css"), "utf8");
const fontsCss = await readFile(fontsCssPath, "utf8");
const swiftAdapter = await readFile(
  path.join(repoRoot, "adapters", "swift", "AppStylrTokens.swift"),
  "utf8"
);
assert(swiftAdapter.includes("public struct Theme: Sendable"), "Swift theme values must be Swift 6 concurrency-safe.");
assert(swiftAdapter.includes("public struct TypeStyle: Sendable"), "Swift type styles must be Swift 6 concurrency-safe.");

const fontFiles = [
  "assets/fonts/Geist-Variable.woff2",
  "assets/fonts/GeistMono-Variable.woff2"
];

for (const relativePath of fontFiles) {
  const font = await readFile(path.join(repoRoot, relativePath));
  assert(font.subarray(0, 4).toString("ascii") === "wOF2", `${relativePath} must be a WOFF2 font.`);
}

const fontLicense = await readFile(path.join(repoRoot, "assets", "fonts", "LICENSE-GEIST.txt"), "utf8");
assert(fontLicense.includes("SIL OPEN FONT LICENSE Version 1.1"), "Bundled Geist fonts need their OFL license.");

const reference = await readFile(referencePath, "utf8");
const referenceCss = await readFile(referenceCssPath, "utf8");
assert(reference.includes("Three qualities to preserve"), "Reference must include the consolidated design principles.");
assert(reference.includes("Geist Sans"), "Reference must identify Geist Sans as the interface typeface.");
assert(reference.includes("Geist Mono"), "Reference must identify Geist Mono as the technical typeface.");
assert(reference.includes("Canonical tokens in practice"), "Reference must include the consolidated system specimen.");
assert(reference.includes("One recognizable system across every small product"), "Reference must include the consolidated design direction.");
assert(!/game interface|course builder|game profile/iu.test(reference), "Reference must not contain game-specific content.");
assert(
  reference.includes('<span class="task-check is-complete" aria-hidden="true"></span>'),
  "Visual contract completed checkbox must not depend on a font glyph."
);
assert(
  /\.creator-signature\s*\{[^}]*text-transform:\s*none;/s.test(referenceCss),
  "Visual contract must preserve the creator-signature text casing."
);
assert(
  /\.task-check\.is-complete::after\s*\{[^}]*content:\s*"";[^}]*transform:\s*translateY\(-1px\) rotate\(45deg\);/s.test(referenceCss),
  "Visual contract completed checkbox must draw an optically centered checkmark."
);
assert(
  reference.includes('class="task-check is-complete"'),
  "Visual contract must distinguish the completed task checkbox in its markup."
);
assert(
  /\.task-check\s*\{[^}]*border-radius:\s*50%;/s.test(referenceCss),
  "Visual contract task checkboxes must use the canonical circular shape."
);
assert(
  /\.task-check\.is-complete\s*\{[^}]*background:\s*var\(--ui-success\);/s.test(referenceCss),
  "Visual contract completed checkbox must use the semantic success fill."
);
assert(
  reference.includes('class="select-field"'),
  "Visual contract selects must include the padded caret wrapper."
);
assert(
  /\.select-field::after\s*\{[^}]*right:\s*var\(--space-16\);/s.test(referenceCss),
  "Visual contract select caret must keep a 16px inset from the right edge."
);
assert(
  /\.select-field select\s*\{[^}]*padding-right:\s*44px;/s.test(referenceCss),
  "Visual contract select text must reserve space for the padded caret."
);
assert(fontsCss.includes('font-family: "Geist Sans"'), "Font adapter must define Geist Sans.");
assert(fontsCss.includes('font-family: "Geist Mono"'), "Font adapter must define Geist Mono.");
assert(
  fontsCss.includes('../../assets/fonts/Geist-Variable.woff2'),
  "Font adapter must load the bundled Geist Sans asset."
);
assert(
  fontsCss.includes('../../assets/fonts/GeistMono-Variable.woff2'),
  "Font adapter must load the bundled Geist Mono asset."
);
assert(packageJson.files.includes("assets"), "Package files must include the bundled fonts and icon assets.");
assert(packageJson.files.includes("docs"), "Package files must include adoption guides linked from the README.");
assert(packageJson.files.includes("examples"), "Package files must include public examples.");
assert(packageJson.files.includes("templates"), "Package files must include every consumer template.");
assert(packageJson.files.includes("scripts/generate-icons.mjs"), "Package files must include the icon generator.");
assert(packageJson.files.includes("chrome-theme"), "Package files must include the installable Chrome theme.");
assert(packageJson.files.includes("scripts/build-chrome-theme.mjs"), "Package files must include the Chrome theme generator.");
assert(packageJson.files.includes("scripts/token-utils.mjs"), "Package files must include command implementation utilities.");
assert(packageJson.exports?.["./fonts.css"] === "./adapters/css/fonts.css", "Package must export fonts.css.");
assert(!Object.hasOwn(packageJson.exports ?? {}, "./family"), "Package must not export private family data.");
assert(packageJson.exports?.["./tokens"] === "./tokens/app-stylr.json", "Package must export canonical tokens.");
assert(packageJson.exports?.["./package.json"] === "./package.json", "Package must export package metadata.");
assert(packageJson.bin?.["app-stylr-icons"] === "./scripts/generate-icons.mjs", "Package must expose the icon generator command.");
assert(packageJson.bin?.["app-stylr-chrome-theme"] === "./scripts/build-chrome-theme.mjs", "Package must expose the Chrome theme command.");
assert(packageJson.bin?.["app-stylr-macos-release-check"] === "./scripts/validate-macos-release.mjs", "Package must expose the macOS release checker.");
assert(packageJson.license === "MIT", "Package must declare the MIT license.");
assert(packageJson.publishConfig?.access === "public", "Package must declare public npm access.");
assert(packageJson.dependencies?.sharp, "Icon generation requires Sharp as a runtime dependency.");
assert(packageJson.scripts?.["chrome-theme"] === "node scripts/build-chrome-theme.mjs", "Package must expose the Chrome theme generator.");
assert(
  packageJson.scripts?.["chrome-theme:check"] === "node scripts/build-chrome-theme.mjs --check",
  "Package must expose the Chrome theme currentness check."
);
assert(packageJson.scripts?.check?.includes("chrome-theme:check"), "The repository check must verify Chrome theme currentness.");
assert(packageJson.scripts?.site === "node scripts/build-site.mjs", "Package must expose the Netlify site artifact builder.");
assert(packageJson.scripts?.check?.includes("npm run site"), "The repository check must build the scoped Netlify artifact.");
assert(packageJson.scripts?.["privacy:check"] === "node scripts/audit-public-surface.mjs", "Package must expose the public privacy audit.");
assert(packageJson.scripts?.["package:check"] === "node scripts/verify-package.mjs", "Package must expose clean package verification.");
assert(
  (await readFile(referencePath, "utf8")).includes(`v${tokens.version}`),
  "Reference page must display the current App Stylr version."
);

const platformIcons = [
  ["assets/platform-icons/reference/chrome/icon-16.png", 16],
  ["assets/platform-icons/reference/chrome/icon-32.png", 32],
  ["assets/platform-icons/reference/chrome/icon-48.png", 48],
  ["assets/platform-icons/reference/chrome/icon-128.png", 128],
  ["assets/platform-icons/reference/web/favicon-32.png", 32],
  ["assets/platform-icons/reference/web/apple-touch-icon-152.png", 152],
  ["assets/platform-icons/reference/web/apple-touch-icon-167.png", 167],
  ["assets/platform-icons/reference/web/apple-touch-icon-180.png", 180],
  ["assets/platform-icons/reference/web/apple-touch-icon.png", 180],
  ["assets/platform-icons/reference/web/icon-192.png", 192],
  ["assets/platform-icons/reference/web/icon-512.png", 512]
];

for (const [relativePath, expectedSize] of platformIcons) {
  await validatePng(relativePath, expectedSize, expectedSize, true);
}

const chromeThemeManifest = await readJson(chromeThemeManifestPath);
const asRgb = (hex) => {
  const { red, green, blue } = hexToRgb(hex);
  return [red, green, blue];
};
const expectedChromeThemeColors = {
  background_tab: asRgb(tokens.brand.charcoal),
  background_tab_inactive: asRgb(tokens.themes.dark.sidebar),
  background_tab_incognito: asRgb(tokens.themes.dark.selected),
  background_tab_incognito_inactive: asRgb(tokens.themes.dark.sidebar),
  bookmark_text: asRgb(tokens.themes.dark.textMuted),
  button_background: asRgb(tokens.themes.dark.selected),
  frame: asRgb(tokens.themes.dark.surfaceRaised),
  frame_inactive: asRgb(tokens.themes.dark.sidebar),
  frame_incognito: asRgb(tokens.themes.dark.selected),
  frame_incognito_inactive: asRgb(tokens.themes.dark.sidebar),
  ntp_background: asRgb(tokens.themes.dark.canvas),
  ntp_header: asRgb(tokens.themes.dark.textMuted),
  ntp_link: asRgb(tokens.themes.dark.link),
  ntp_text: asRgb(tokens.themes.dark.text),
  omnibox_background: asRgb(tokens.themes.dark.surfaceRaised),
  omnibox_text: asRgb(tokens.themes.dark.text),
  tab_background_text: asRgb(tokens.themes.dark.textMuted),
  tab_background_text_inactive: asRgb(tokens.brand.sage),
  tab_background_text_incognito: asRgb(tokens.themes.dark.textMuted),
  tab_background_text_incognito_inactive: asRgb(tokens.brand.sage),
  tab_text: asRgb(tokens.themes.dark.text),
  toolbar: asRgb(tokens.themes.dark.surface),
  toolbar_button_icon: asRgb(tokens.themes.dark.accent),
  toolbar_text: asRgb(tokens.themes.dark.text)
};

assert(chromeThemeManifest.manifest_version === 3, "Chrome theme must use Manifest V3.");
assert(chromeThemeManifest.version === "1.0.1", "Chrome theme must use its independent 1.0.1 version.");
assert(chromeThemeManifest.name === "App Stylr Dark", "Chrome theme must use the App Stylr Dark name.");
assert(chromeThemeManifest.author === "App Stylr contributors", "Chrome theme author must use public project attribution.");
for (const forbiddenKey of ["permissions", "background", "content_scripts", "action", "chrome_url_overrides"]) {
  assert(!Object.hasOwn(chromeThemeManifest, forbiddenKey), `Chrome theme must not declare ${forbiddenKey}.`);
}
assert(
  chromeThemeManifest.theme?.images?.theme_ntp_background === "images/theme-ntp-background.png",
  "Chrome theme must use the generated new-tab background."
);
assert(
  JSON.stringify(chromeThemeManifest.theme?.colors) === JSON.stringify(expectedChromeThemeColors),
  "Chrome theme colors must match the canonical token mapping."
);
assert(
  JSON.stringify(chromeThemeManifest.theme?.properties) ===
    JSON.stringify({
      ntp_background_alignment: "center",
      ntp_background_repeat: "no-repeat",
      ntp_logo_alternate: 1
    }),
  "Chrome theme new-tab properties must match the supported contract."
);
assert(
  JSON.stringify(chromeThemeManifest.icons) ===
    JSON.stringify({
      16: "icons/icon-16.png",
      32: "icons/icon-32.png",
      48: "icons/icon-48.png",
      128: "icons/icon-128.png"
    }),
  "Chrome theme must declare every generated theme icon."
);

await validatePng("chrome-theme/images/theme-ntp-background.png", 2560, 1440);
await validatePng("chrome-theme/preview.png", 1440, 900);
for (const size of [16, 32, 48, 128]) {
  await validatePng(`chrome-theme/icons/icon-${size}.png`, size, size, true);
}

const chromeThemeFiles = await readdir(chromeThemeRoot, { recursive: true });
assert(
  !chromeThemeFiles.some((file) => /\.(?:html|js|mjs|cjs)$/i.test(file)),
  "The installable Chrome theme folder must not contain executable code or HTML."
);

const netlifyConfig = await readFile(netlifyConfigPath, "utf8");
const siteBuildScript = await readFile(siteBuildScriptPath, "utf8");
assert(!(await exists(retiredPagesWorkflowPath)), "The obsolete GitHub Pages workflow must remain removed.");
assert(netlifyConfig.includes('base = "reference"'), "Netlify must use reference as its dependency-scanning base.");
assert(
  netlifyConfig.includes('command = "cd .. && npm ci && npm run site"'),
  "Netlify must build the scoped site from the repository root."
);
assert(netlifyConfig.includes('publish = "../.site"'), "Netlify must publish only the scoped .site artifact.");
assert(
  netlifyConfig.includes('from = "/reference/style-guide.html"') &&
    netlifyConfig.includes('from = "/reference"') &&
    netlifyConfig.includes('from = "/reference/"') &&
    (netlifyConfig.match(/to = "\/"/g) ?? []).length === 3 &&
    (netlifyConfig.match(/status = 301/g) ?? []).length === 3,
  "Netlify must redirect every retired Reference URL to the site root."
);
for (const directory of ["adapters", "assets"]) {
  assert(siteBuildScript.includes(`\"${directory}\"`), `Site builder must include ${directory}.`);
}
assert(
  siteBuildScript.includes('path.join(repoRoot, "reference")') &&
    siteBuildScript.includes('referenceHtml.replaceAll("../assets/", "./assets/")') &&
    siteBuildScript.includes('referenceCss.replaceAll("../adapters/", "./adapters/")'),
  "Site builder must place the transformed Reference HTML and CSS at the artifact root."
);

const siteTopLevel = (await readdir(siteOutputPath)).sort();
assert(
  JSON.stringify(siteTopLevel) === JSON.stringify(["adapters", "assets", "index.html", "styles.css"]),
  "The public Netlify artifact must contain only the root Reference and its required assets."
);
await validateRelativeLinks(path.join(siteOutputPath, "index.html"), /(?:href|src)="([^"]+)"/g);
await validateRelativeLinks(path.join(siteOutputPath, "styles.css"), /@import\s+"([^"]+)"/g);

const chromeIconTemplate = await readJson(chromeIconTemplatePath);
assert(
  JSON.stringify(Object.keys(chromeIconTemplate.icons)) === JSON.stringify(["16", "32", "48", "128"]),
  "Chrome manifest template must declare 16, 32, 48, and 128 pixel icons."
);
assert(
  Object.values(chromeIconTemplate.icons).every((iconPath) => iconPath.startsWith("icons/chrome/")),
  "Chrome manifest icon paths must target the generated icons/chrome directory."
);
assert(
  JSON.stringify(Object.keys(chromeIconTemplate.action.default_icon)) === JSON.stringify(["16", "32"]),
  "Chrome action template must declare 16 and 32 pixel toolbar icons."
);

const webIconTemplate = await readJson(webIconTemplatePath);
assert(
  JSON.stringify(webIconTemplate.icons.map((icon) => icon.sizes)) === JSON.stringify(["192x192", "512x512"]),
  "Web app manifest template must declare 192px and 512px icons."
);
assert(
  webIconTemplate.icons.every((icon) => icon.src.startsWith("/icons/web/")),
  "Web app manifest icon paths must target the generated /icons/web directory."
);
assert(
  webIconTemplate.icons.every((icon) => icon.purpose === "any"),
  "Web app manifest icons must remain purpose any until maskable safe zones are verified."
);

const appleIconTemplate = await readFile(appleIconTemplatePath, "utf8");
for (const size of [152, 167, 180]) {
  assert(appleIconTemplate.includes(`sizes="${size}x${size}"`), `Apple touch template must declare ${size}px.`);
}
assert(
  appleIconTemplate.includes('href="/icons/web/apple-touch-icon.png"'),
  "Apple touch template must target the generated 180px default icon."
);

for (const role of Object.keys(tokens.themes.dark)) {
  const cssRole = role.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  assert(cssAdapter.includes(`--ui-${cssRole}:`), `CSS adapter is missing semantic role ${role}.`);
  assert(swiftAdapter.includes(`public let ${role}: Color`), `Swift adapter is missing semantic role ${role}.`);
}

if (errors.length > 0) {
  console.error("App Stylr repository validation failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log("Repository links, artifacts, naming, versions, and adapter roles are valid.");
}
