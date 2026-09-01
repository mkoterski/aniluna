/* ============================================================================
   smoke-test.mjs - Aniluna smoke test, command line - v0.11
   ============================================================================
   Purpose    : Run the smoke checks from a terminal and exit non-zero if any
                of them fail, so a shell or a hook can gate on it.
   Status     : DEVELOPMENT
   Author     : Matthias Koterski / Data & IT
   Date       : 2026-08-24
   Context    : node test/smoke-test.mjs [path-to-index.html]
   Versioning : v0.x = development. Tracks itself, not the app.
   ----------------------------------------------------------------------------
   The checks live in smoke-checks.mjs, which knows nothing about files or
   pages. This file only reads and prints; smoke-test.html does the same job in
   a browser, which is what makes it work on GitHub Pages. One copy of the
   checks, two runners, so they cannot drift.

   Paths resolve against this file rather than the working directory, so the
   command works from the repository root as well as from inside test/.
   ========================================================================== */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runSmokeChecks, VERSION } from "./smoke-checks.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const target = process.argv[2] || join(here, "..", "index.html");
const source = readFileSync(target, "utf8");

/* The changelog beside the target, not beside this script: the version check
   compares an app against its own changelog. */
let changelog = null;
try {
  changelog = readFileSync(join(dirname(target) || ".", "CHANGELOG.md"), "utf8");
} catch {
  changelog = null;
}

const { results, passed, failed } = runSmokeChecks({ source, changelog });

const pad = Math.max(...results.map((r) => r.name.length));
console.log("");
console.log(`  Aniluna smoke test ${VERSION} - ${target}`);
console.log("  " + "-".repeat(pad + 12));
for (const r of results) {
  const mark = r.ok ? "ok  " : (r.detail.startsWith("skipped") ? "skip" : "FAIL");
  console.log(`  ${mark}  ${r.name.padEnd(pad)}  ${r.detail}`);
}
console.log("  " + "-".repeat(pad + 12));
console.log(`  ${passed} passed, ${failed} failed`);
console.log("");

process.exit(failed ? 1 : 0);
