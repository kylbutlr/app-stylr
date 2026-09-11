import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { repoRoot } from "./token-utils.mjs";

const outputRoot = path.join(repoRoot, ".site");

async function main() {
  await rm(outputRoot, { recursive: true, force: true });
  await mkdir(outputRoot, { recursive: true });

  for (const directory of ["adapters", "assets"]) {
    await cp(path.join(repoRoot, directory), path.join(outputRoot, directory), {
      recursive: true
    });
  }

  const referenceRoot = path.join(repoRoot, "reference");
  const [referenceHtml, referenceCss] = await Promise.all([
    readFile(path.join(referenceRoot, "index.html"), "utf8"),
    readFile(path.join(referenceRoot, "styles.css"), "utf8")
  ]);

  await writeFile(
    path.join(outputRoot, "index.html"),
    referenceHtml.replaceAll("../assets/", "./assets/")
  );
  await writeFile(
    path.join(outputRoot, "styles.css"),
    referenceCss.replaceAll("../adapters/", "./adapters/")
  );
  console.log("Prepared the root App Stylr Reference artifact in .site/.");
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
