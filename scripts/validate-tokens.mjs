import path from "node:path";
import {
  contrastRatio,
  getPath,
  readJson,
  readTokens,
  repoRoot
} from "./token-utils.mjs";

const errors = [];
const report = [];
const hexPattern = /^#[0-9A-Fa-f]{6}$/;
const requiredThemeRoles = [
  "canvas",
  "sidebar",
  "surface",
  "surfaceRaised",
  "border",
  "borderStrong",
  "text",
  "textMuted",
  "accent",
  "accentText",
  "accentStrong",
  "link",
  "focus",
  "selected",
  "selectedText",
  "success",
  "successSurface",
  "warning",
  "warningSurface",
  "danger",
  "dangerSurface",
  "info",
  "infoSurface"
];

function assert(condition, message) {
  if (!condition) errors.push(message);
}

function validateColorMap(name, colors) {
  assert(colors && typeof colors === "object", `${name} must be an object.`);
  if (!colors || typeof colors !== "object") return;

  for (const [tokenName, value] of Object.entries(colors)) {
    assert(hexPattern.test(value), `${name}.${tokenName} must be a six-digit hex color.`);
  }
}

const tokens = await readTokens();
const packageJson = await readJson(path.join(repoRoot, "package.json"));

assert(tokens.name === "App Stylr", "Token name must be App Stylr.");
assert(tokens.version === packageJson.version, "Token and package versions must match.");
assert(packageJson.private !== true, "The public package must not be marked private.");
assert(packageJson.publishConfig?.access === "public", "The public package must declare public npm access.");

validateColorMap("brand", tokens.brand);
validateColorMap("themes.light", tokens.themes?.light);
validateColorMap("themes.dark", tokens.themes?.dark);

for (const themeName of ["light", "dark"]) {
  const theme = tokens.themes?.[themeName] ?? {};
  for (const role of requiredThemeRoles) {
    assert(role in theme, `themes.${themeName}.${role} is required.`);
  }

  const extraRoles = Object.keys(theme).filter((role) => !requiredThemeRoles.includes(role));
  assert(extraRoles.length === 0, `themes.${themeName} has unknown roles: ${extraRoles.join(", ")}`);
}

for (const [name, value] of Object.entries(tokens.spacing ?? {})) {
  assert(Number(name) === value, `spacing.${name} must equal its pixel value.`);
  assert(value > 0, `spacing.${name} must be positive.`);
}

for (const [name, value] of Object.entries(tokens.radius ?? {})) {
  assert(value > 0, `radius.${name} must be positive.`);
}

for (const [name, value] of Object.entries(tokens.motion ?? {})) {
  assert(Number.isInteger(value) && value > 0, `motion.${name} must be a positive integer in milliseconds.`);
}

for (const [name, style] of Object.entries(tokens.typography?.styles ?? {})) {
  assert(style.size > 0, `typography.styles.${name}.size must be positive.`);
  assert(style.lineHeight >= style.size, `typography.styles.${name}.lineHeight must not be below its size.`);
  assert(style.weight >= 100 && style.weight <= 900, `typography.styles.${name}.weight must be between 100 and 900.`);
}

const gameProfile = tokens.profiles?.game ?? {};
assert(gameProfile.minimumViewportWidth >= 1024, "profiles.game.minimumViewportWidth must support at least 1024px desktop layouts.");
assert(gameProfile.controlHeight >= tokens.size.control, "profiles.game.controlHeight must not be smaller than the standard control.");
assert(gameProfile.primaryControlHeight > gameProfile.controlHeight, "profiles.game.primaryControlHeight must be larger than the standard game control.");
assert(gameProfile.readingLineHeight >= gameProfile.readingTextSize, "profiles.game reading line height must not be below its text size.");
assert(gameProfile.labelLineHeight >= gameProfile.labelTextSize, "profiles.game label line height must not be below its text size.");
assert(gameProfile.disclosureSummaryHeight >= gameProfile.primaryControlHeight, "profiles.game disclosures must be at least as tall as primary controls.");
assert(gameProfile.disclosureToggleSize >= 32, "profiles.game disclosure toggles must remain visibly actionable.");

assert(
  tokens.icon.square + tokens.icon.inset * 2 === tokens.icon.canvas,
  "The icon square and insets must exactly fill the icon canvas."
);

const gradientStops = tokens.icon.gradient.stops;
assert(gradientStops[0]?.offset === 0, "The icon gradient must begin at 0%.");
assert(gradientStops.at(-1)?.offset === 100, "The icon gradient must end at 100%.");
for (let index = 1; index < gradientStops.length; index += 1) {
  assert(
    gradientStops[index - 1].offset < gradientStops[index].offset,
    "Icon gradient offsets must be strictly increasing."
  );
}

assert(gradientStops[0]?.color === "#0D0D0D", "The icon gradient must begin with Evening charcoal.");
assert(gradientStops[1]?.offset === 48 && gradientStops[1]?.color === "#3B4145", "The icon gradient midpoint must use Evening slate at 48%.");
assert(gradientStops.at(-1)?.color === "#899F98", "The icon gradient must end with Evening mint.");

for (const pair of tokens.accessibility?.contrastPairs ?? []) {
  const foreground = getPath(tokens, pair.foreground);
  const background = getPath(tokens, pair.background);
  assert(hexPattern.test(foreground ?? ""), `${pair.name} has an invalid foreground reference.`);
  assert(hexPattern.test(background ?? ""), `${pair.name} has an invalid background reference.`);
  if (!hexPattern.test(foreground ?? "") || !hexPattern.test(background ?? "")) continue;

  const ratio = contrastRatio(foreground, background);
  assert(ratio >= pair.minimum, `${pair.name} is ${ratio.toFixed(2)}:1, below ${pair.minimum}:1.`);
  report.push(`${pair.name}: ${ratio.toFixed(2)}:1`);
}

if (errors.length > 0) {
  console.error("App Stylr token validation failed:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Validated App Stylr ${tokens.version}.`);
  for (const line of report) console.log(`- ${line}`);
}
