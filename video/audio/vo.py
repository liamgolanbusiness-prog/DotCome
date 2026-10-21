"""Hebrew narration: fetch (ElevenLabs) or adopt per-segment takes, retime scenes around them, assemble build/vo.wav.

Usage:  python3 audio/vo.py
Env:    ELEVENLABS_API_KEY   needed only for segments that have no take in build/vo/ yet
        ELEVENLABS_VOICE_ID  voice to use (default: premade "Adam"; a native Hebrew voice from the Voice Library sounds better)
        ELEVENLABS_MODEL     default eleven_v3 (Hebrew-capable)
Takes:  build/vo/<segment-id>.mp3|.wav — drop your own recordings here (same ids as src/vo-script.json) to skip TTS.
Writes: src/timing.vo.json (scene lengths stretched to fit the voice) and build/vo.wav (44.1 kHz stereo, full length).
"""
import json
import os
import subprocess
import sys
import urllib.request
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from pedalboard import Compressor, HighpassFilter, Pedalboard

SR = 44100
ROOT = Path(__file__).resolve().parent.parent
TAKES = ROOT / "build/vo"
script = json.loads((ROOT / "src/vo-script.json").read_text())["segments"]
base = json.loads((ROOT / "src/timing.text.json").read_text())


def tts(seg, dest):
    key = os.environ.get("ELEVENLABS_API_KEY")
    if not key:
        sys.exit(f"missing take {seg['id']} and no ELEVENLABS_API_KEY set")
    voice = os.environ.get("ELEVENLABS_VOICE_ID", "pNInz6obpgDQGcFmaJgB")
    model = os.environ.get("ELEVENLABS_MODEL", "eleven_v3")
    body = json.dumps({
        "text": seg["text"],
        "model_id": model,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.8, "style": 0.35, "use_speaker_boost": True},
    }).encode()
    req = urllib.request.Request(
        f"https://api.elevenlabs.io/v1/text-to-speech/{voice}?output_format=mp3_44100_192",
        data=body,
        headers={"xi-api-key": key, "Content-Type": "application/json", "Accept": "audio/mpeg"},
    )
    with urllib.request.urlopen(req, timeout=120) as r:
        dest.write_bytes(r.read())
    print("tts", seg["id"])


def load(path):
    raw = subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-i", str(path), "-ac", "1", "-ar", str(SR), "-f", "f32le", "-"],
        check=True, capture_output=True,
    ).stdout
    x = np.frombuffer(raw, dtype=np.float32).astype(np.float64)
    # trim silence (-45 dBFS) with a little air
    thr = 10 ** (-45 / 20)
    idx = np.where(np.abs(x) > thr)[0]
    if len(idx):
        x = x[max(0, idx[0] - int(0.03 * SR)) : idx[-1] + int(0.08 * SR)]
    return x


TAKES.mkdir(parents=True, exist_ok=True)
clips = {}
for seg in script:
    take = next((p for p in (TAKES / f"{seg['id']}.wav", TAKES / f"{seg['id']}.mp3") if p.exists()), None)
    if take is None:
        take = TAKES / f"{seg['id']}.mp3"
        tts(seg, take)
    clips[seg["id"]] = load(take)

# scene lengths: never shorter than the text cut, long enough for the voice + 0.7 s breath
order = list(base["scenes"].keys())
need = {k: base["scenes"][k][1] for k in order}
for seg in script:
    end = seg["at"] + len(clips[seg["id"]]) / SR + 0.7
    need[seg["scene"]] = max(need[seg["scene"]], end)
# whole beats (120 BPM) keep every scene cut on the music grid
need = {k: float(np.ceil(v * 2 - 1e-6) / 2) for k, v in need.items()}
# within-scene collisions: warn so the offsets in vo-script.json can be nudged
for a, b in zip(script, script[1:]):
    if a["scene"] == b["scene"] and a["at"] + len(clips[a["id"]]) / SR > b["at"] - 0.15:
        print(f"warning: {a['id']} runs into {b['id']} — move {b['id']}.at later")

t = 0.0
scenes = {}
for k in order:
    scenes[k] = [round(t, 2), round(need[k], 2)]
    t += need[k]
timing = {"total": round(t, 2), "scenes": scenes}
(ROOT / "src/timing.vo.json").write_text(json.dumps(timing, indent=2) + "\n")
print("vo timing:", json.dumps(timing))

n = int(round(timing["total"] * SR))
vo = np.zeros(n)
for seg in script:
    x = clips[seg["id"]]
    i = int((scenes[seg["scene"]][0] + seg["at"]) * SR)
    j = min(n, i + len(x))
    vo[i:j] += x[: j - i]
chain = Pedalboard([HighpassFilter(80), Compressor(threshold_db=-20, ratio=3, attack_ms=8, release_ms=120)])
vo = chain(vo.astype(np.float32)[None, :], SR)[0].astype(np.float64)
vo *= 10 ** ((-16.0 - pyln.Meter(SR).integrated_loudness(vo)) / 20)
sf.write(ROOT / "build/vo.wav", np.vstack([vo, vo]).T, SR)
print("wrote build/vo.wav", f"{timing['total']}s")
