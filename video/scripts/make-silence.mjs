// Writes public/music-placeholder.wav: silent 16-bit mono PCM covering the music cue.
// It is a stand-in so the cue render carries an audio track; replace it with the real bed.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const FPS = 30;
const CUE_IN = 420; // keep in sync with MUSIC_CUE in src/timeline.ts
const CUE_OUT = 1740;
const RATE = 48000;

const seconds = (CUE_OUT - CUE_IN) / FPS;
const samples = Math.round(seconds * RATE);
const dataBytes = samples * 2;
const buf = Buffer.alloc(44 + dataBytes);

buf.write("RIFF", 0);
buf.writeUInt32LE(36 + dataBytes, 4);
buf.write("WAVE", 8);
buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16); // PCM chunk size
buf.writeUInt16LE(1, 20); // PCM
buf.writeUInt16LE(1, 22); // mono
buf.writeUInt32LE(RATE, 24);
buf.writeUInt32LE(RATE * 2, 28); // byte rate
buf.writeUInt16LE(2, 32); // block align
buf.writeUInt16LE(16, 34); // bits per sample
buf.write("data", 36);
buf.writeUInt32LE(dataBytes, 40);

const out = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "music-placeholder.wav");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, buf);
console.log(`wrote ${out} (${seconds.toFixed(1)}s silent placeholder)`);
