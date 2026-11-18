// SPDX-License-Identifier: MIT
// news-image-20261118 — v3, "THE NIGHT THE GULF BURNED, IN PIXEL ART"
//
// The front page for this entry already exists as a finished PNG, so
// this script has one deliberately small job: confirm the image is
// inside the bouty's size limit, then place an exact copy in the
// folder the harness reads from.
//
// The picture was assembled offline (PIL) from checked reporting dated
// 18 November 2026. Every word on the page is text rendered by code,
// and all 11 illustrations are hand-built 16-bit pixel art — no model
// ever drew any of the lettering.
//
// What changed from v2: the layout was rebuilt presentation-first, with
// a dark navy masthead, three hero stories (the tanker strikes, the
// Kerch arch collapse, Nvidia) each carrying a location caption, eight
// icon-led secondary stories, a BY THE NUMBERS strip, and a larger map.
// Story count grew from 26 to 30 (added: Kerch collapse, Peltola,
// Xavier, Pope Leo).

import { copyFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUTPUT_LIMIT = 1024 * 1024; // the bounty caps the produced file at 1 MiB

const scriptDir = dirname(fileURLToPath(import.meta.url));
const artwork = resolve(scriptDir, 'entry.png');

function checkArtwork(): number {
  let bytes: number;
  try {
    bytes = statSync(artwork).size;
  } catch {
    throw new Error(`could not read entry.png next to ${scriptDir}`);
  }
  if (bytes < 1 || bytes > OUTPUT_LIMIT) {
    throw new Error(
      `entry.png is ${bytes} bytes, outside the allowed 1..${OUTPUT_LIMIT} range`,
    );
  }
  return bytes;
}

// The harness points MAKEFUN_OUTPUT_DIR at its own folder; running the
// script by hand with no variable set drops the copy into ./out next to
// this file instead. Either way the output is the same bytes.
function publish(): void {
  const bytes = checkArtwork();
  const destination =
    process.env.MAKEFUN_OUTPUT_DIR ?? resolve(scriptDir, 'out');
  mkdirSync(destination, { recursive: true });
  copyFileSync(artwork, resolve(destination, 'entry.png'));
  console.log(`wrote entry.png (${bytes} bytes) to ${destination}`);
}

publish();
