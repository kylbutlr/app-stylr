import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cp, mkdtemp, mkdir, readFile, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { repoRoot } from "../scripts/token-utils.mjs";

async function fixture(run) {
  const root = await mkdtemp(path.join(os.tmpdir(), "app-stylr-output-"));
  try {
    for (const directory of ["scripts", "tokens", "reference", "adapters", "assets"]) {
      await cp(path.join(repoRoot, directory), path.join(root, directory), { recursive: true });
    }
    const build = (output) => spawnSync(process.execPath, ["scripts/build-site.mjs", "--output", output], {
      cwd: root, encoding: "utf8", timeout: 10_000
    });
    await run(root, build);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}

test("Reference builds refuse source directories, project roots, metadata, and dependencies", async () => {
  await fixture(async (root, build) => {
    const source = await readFile(path.join(root, "reference", "index.html"), "utf8");
    for (const output of ["reference", "reference/nested", "assets", "scripts", ".", "..", ".git/generated", "node_modules/generated"]) {
      const result = build(output);
      assert.equal(result.status, 1, `${output}: ${result.stderr}`);
    }
    assert.equal(await readFile(path.join(root, "reference", "index.html"), "utf8"), source);
  });
});

test("Reference builds preserve unrelated files in an existing output directory", async () => {
  await fixture(async (root, build) => {
    await mkdir(path.join(root, "existing"));
    await writeFile(path.join(root, "existing", "notes.txt"), "Keep this file.");
    const result = build("existing");
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Choose an empty output directory/);
    assert.equal(await readFile(path.join(root, "existing", "notes.txt"), "utf8"), "Keep this file.");
  });
});

test("Reference builds allow an empty directory and a repeat build, preserving added files", async () => {
  await fixture(async (root, build) => {
    await mkdir(path.join(root, "output"));
    assert.equal(build("output").status, 0);
    assert.equal(build("output").status, 0);
    await writeFile(path.join(root, "output", "assets", "notes.txt"), "Keep this file.");
    const result = build("output");
    assert.equal(result.status, 1);
    assert.match(result.stderr, /outside the generated Reference/);
    assert.equal(await readFile(path.join(root, "output", "assets", "notes.txt"), "utf8"), "Keep this file.");
  });
});

test("Reference builds reject symlinked source targets and symlinks inside previous output", async () => {
  await fixture(async (root, build) => {
    await symlink(path.join(root, "reference"), path.join(root, "source-link"));
    assert.equal(build("source-link").status, 1);
    assert.equal(build("output").status, 0);
    await symlink(path.join(root, "tokens"), path.join(root, "output", "extra"));
    assert.equal(build("output").status, 1);
    assert.ok(await readFile(path.join(root, "tokens", "app-stylr.json")));
  });
});
