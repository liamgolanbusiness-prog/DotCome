# Danny promo video (HyperFrames)

A brand promo for DotCome's AI agent "דני", built as HTML + GSAP and rendered with
[HyperFrames](https://hyperframes.heygen.com). Script and storyboard: [SCRIPT.md](SCRIPT.md).

Variants: `{land,port}-{text,vo}` → 16:9 / 9:16 × music + on-screen text / Hebrew narration.

## Layout

| Path | What |
|---|---|
| `src/scenes.mjs` | Markup for all 9 scenes (rendered per format) |
| `src/styles.css` | Brand styles; `.fmt-port` overrides for 9:16 |
| `src/timeline.js` | The single paused GSAP timeline; emits SFX cues via `cue()` |
| `src/timing.text.json` | Scene starts/lengths for the text cut (`timing.vo.json` is generated) |
| `src/vo-script.json` | Narration segments (scene + offset + TTS text) |
| `build.mjs` | Writes `builds/<variant>/index.html` (+ a root `index.html` for preview) |
| `tools/extract-cues.mjs` | Loads a build headlessly and dumps `window.__cues` → `build/cues.<mode>.json` |
| `audio/synth.py` | Original score + SFX from the cue list, mixed to −14 LUFS → `assets/audio/mix-<mode>.m4a` |
| `audio/vo.py` | ElevenLabs TTS (or your own takes in `build/vo/`), stretches scenes to fit, writes `build/vo.wav` |

## Setup

```bash
cd video
npm install
pip install numpy scipy pedalboard soundfile pyloudnorm pillow
export HYPERFRAMES_BROWSER_PATH=/path/to/chrome-headless-shell   # or: npx hyperframes browser ensure
```

## Text + music version

```bash
npm run audio      # build → cues → synthesize score/SFX → rebuild with the mix
npm run preview    # optional: Studio preview of index.html
npm run render     # out/dani-16x9-text.mp4, out/dani-9x16-text.mp4
```

## Narrated version (Hebrew AI voice)

Needs `api.elevenlabs.io` allowed in the environment's network settings and `ELEVENLABS_API_KEY`
set (optionally `ELEVENLABS_VOICE_ID` for a native Hebrew voice from the ElevenLabs Voice Library).
Alternatively drop recorded takes into `build/vo/<segment-id>.mp3` and no API call is made.

```bash
npm run vo         # TTS → timing.vo.json → cues → mix with ducked music → rebuild
npm run render:vo  # out/dani-16x9-vo.mp4, out/dani-9x16-vo.mp4
```

Scenes are only ever lengthened to fit the voice (never shortened), so every animation keeps its
place; a scene that runs long simply holds its final state a little longer.
