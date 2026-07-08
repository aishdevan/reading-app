# Letter Sounds — Phonics A–Z

Tap (or press) any letter A–Z to hear its name, its phonics sound twice, and an example word. All audio is pre-generated mp3 files in `/audio` — no browser speech APIs, no keys, nothing to break.

## Deploy to Vercel

1. Go to https://vercel.com/new
2. Drag this whole folder (with the `audio` folder inside) onto the page
3. Deploy. Done.

## Test locally

```bash
cd phonics-az
npx serve .
```
Open the printed localhost URL in Chrome or Edge. (Use a local server rather than double-clicking index.html — some browsers restrict loading the audio files from file://.)

## Customizing

- Sounds and example words shown on screen: edit the LETTERS object in index.html.
- To replace the voice with nicer audio (e.g. ElevenLabs), just overwrite the files in /audio — they're named a.mp3 through z.mp3. Nothing else needs to change.
