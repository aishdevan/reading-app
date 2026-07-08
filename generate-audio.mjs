// Generates audio/a.mp3 ... audio/z.mp3 using ElevenLabs.
// Run from the phonics-az project root:
//
//   ELEVENLABS_API_KEY=your_key node generate-audio.mjs
//
// Optional: pick a different voice with VOICE_ID=xxxx (default: Rachel).
// Then: git add audio && git commit -m "natural voice" && git push
// Vercel auto-deploys.

import { writeFile, mkdir } from "node:fs/promises";

const API_KEY = process.env.ELEVENLABS_API_KEY;
const VOICE_ID = process.env.VOICE_ID || "21m00Tcm4TlvDq8ikWAM"; // Rachel — clear, warm
const MODEL = "eleven_multilingual_v2";

if (!API_KEY) {
  console.error("Set ELEVENLABS_API_KEY first.");
  process.exit(1);
}

// Text tuned so a natural voice reads the phonics sound, not the letter name.
// <break> tags give the child time to hear each part separately.
const LETTERS = {
  a: 'A. <break time="0.4s"/> ah. <break time="0.3s"/> ah. <break time="0.4s"/> Apple.',
  b: 'B. <break time="0.4s"/> buh. <break time="0.3s"/> buh. <break time="0.4s"/> Ball.',
  c: 'C. <break time="0.4s"/> kuh. <break time="0.3s"/> kuh. <break time="0.4s"/> Cat.',
  d: 'D. <break time="0.4s"/> duh. <break time="0.3s"/> duh. <break time="0.4s"/> Dog.',
  e: 'E. <break time="0.4s"/> eh. <break time="0.3s"/> eh. <break time="0.4s"/> Egg.',
  f: 'F. <break time="0.4s"/> ff. <break time="0.3s"/> ff. <break time="0.4s"/> Fish.',
  g: 'G. <break time="0.4s"/> guh. <break time="0.3s"/> guh. <break time="0.4s"/> Goat.',
  h: 'H. <break time="0.4s"/> hh. <break time="0.3s"/> hh. <break time="0.4s"/> Hat.',
  i: 'I. <break time="0.4s"/> ih. <break time="0.3s"/> ih. <break time="0.4s"/> Igloo.',
  j: 'J. <break time="0.4s"/> juh. <break time="0.3s"/> juh. <break time="0.4s"/> Jam.',
  k: 'K. <break time="0.4s"/> kuh. <break time="0.3s"/> kuh. <break time="0.4s"/> Kite.',
  l: 'L. <break time="0.4s"/> ll. <break time="0.3s"/> ll. <break time="0.4s"/> Lion.',
  m: 'M. <break time="0.4s"/> mm. <break time="0.3s"/> mm. <break time="0.4s"/> Moon.',
  n: 'N. <break time="0.4s"/> nn. <break time="0.3s"/> nn. <break time="0.4s"/> Nest.',
  o: 'O. <break time="0.4s"/> oh. <break time="0.3s"/> oh. <break time="0.4s"/> Octopus.',
  p: 'P. <break time="0.4s"/> puh. <break time="0.3s"/> puh. <break time="0.4s"/> Pig.',
  q: 'Q. <break time="0.4s"/> kwuh. <break time="0.3s"/> kwuh. <break time="0.4s"/> Queen.',
  r: 'R. <break time="0.4s"/> rr. <break time="0.3s"/> rr. <break time="0.4s"/> Rain.',
  s: 'S. <break time="0.4s"/> ss. <break time="0.3s"/> ss. <break time="0.4s"/> Sun.',
  t: 'T. <break time="0.4s"/> tuh. <break time="0.3s"/> tuh. <break time="0.4s"/> Top.',
  u: 'U. <break time="0.4s"/> uh. <break time="0.3s"/> uh. <break time="0.4s"/> Umbrella.',
  v: 'V. <break time="0.4s"/> vv. <break time="0.3s"/> vv. <break time="0.4s"/> Van.',
  w: 'W. <break time="0.4s"/> wuh. <break time="0.3s"/> wuh. <break time="0.4s"/> Water.',
  x: 'X. <break time="0.4s"/> ks. <break time="0.3s"/> ks. <break time="0.4s"/> Fox.',
  y: 'Y. <break time="0.4s"/> yuh. <break time="0.3s"/> yuh. <break time="0.4s"/> Yes.',
  z: 'Z. <break time="0.4s"/> zz. <break time="0.3s"/> zz. <break time="0.4s"/> Zebra.',
};

async function generate(letter, text) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_22050_32`,
    {
      method: "POST",
      headers: { "xi-api-key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: MODEL,
        voice_settings: { stability: 0.6, similarity_boost: 0.8, speed: 0.85 },
      }),
    }
  );
  if (!res.ok) throw new Error(`${letter}: ${res.status} ${await res.text()}`);
  await writeFile(`audio/${letter}.mp3`, Buffer.from(await res.arrayBuffer()));
  console.log(`✓ ${letter}.mp3`);
}

await mkdir("audio", { recursive: true });
for (const [letter, text] of Object.entries(LETTERS)) {
  await generate(letter, text);
  await new Promise(r => setTimeout(r, 400)); // gentle on rate limits
}
console.log("\nDone. Play a couple of files to check, then commit and push.");
