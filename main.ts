// news-image-20261118 v3 — "THE NIGHT THE GULF BURNED, IN PIXEL ART"
// SPDX-License-Identifier: MIT
//
// Entry program: copies the pre-composed front page (entry.png) into
// the output directory. The image was composed offline with PIL from
// verified 18 Nov 2026 reporting; every word on the page is
// code-rendered text, and all 11 illustrations are 16-bit pixel art
// with no model-drawn text. This program is deterministic: the same
// input file always produces the same bytes in the output.
//
// v3 vs v2: presentation-first rebuild — dark navy masthead band,
// three heroes (tankers, Kerch arch collapse, Nvidia) with location
// captions, eight icon-based secondaries, a BY THE NUMBERS strip,
// and a bigger map. 30 stories (v2's 26 + Kerch collapse, Peltola,
// Xavier, Pope Leo).

import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1_048_576; // 1 MiB output cap for this bounty

function main(): void {
  const here = dirname(fileURLToPath(import.meta.url));
  const source = join(here, "entry.png");

  const size = statSync(source).size;
  if (size <= 0 || size > MAX_BYTES) {
    throw new Error(`entry.png is ${size} bytes; must be 1..${MAX_BYTES}`);
  }

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  copyFileSync(source, join(outDir, "entry.png"));
}

main();
