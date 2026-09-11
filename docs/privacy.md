# Public-surface and privacy audit

The public-product conversion removed application-family registries, consumer inventories, sibling-checkout audit tooling, app-specific authentication guidance, unpublished product metadata, local directory assumptions, and app-specific release examples from the public tree.

Automated validation now checks the tracked public text, npm package manifest, packed npm file list, and built reference site for:

- absolute local user paths and local file-scheme URLs;
- private registry directories and exports;
- sibling-repository audit commands;
- known application-specific metadata that was removed during the conversion;
- files outside the documented package and site allowlists.

No secret values were found in the current tracked tree during the September 10, 2026 audit. This is a source audit, not a substitute for GitHub secret scanning or a full history review.

## History warning

Deleting private metadata from the current tree does not remove it from existing Git history, tags, or remote branches. Before changing repository visibility, either publish a new repository from the sanitized tree or complete an approved history rewrite and verify every remaining ref. The repository must stay private until that separate operation is complete.
