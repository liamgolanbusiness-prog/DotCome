"""Original score + SFX for the Danny promo, synthesized from scratch (no samples, no licensing).

Usage:  python3 audio/synth.py <mode>          (mode: text | vo)
Reads   build/cues.<mode>.json   (scene timing + SFX cues, dumped from the timeline)
        build/vo.wav             (vo mode only: full-length narration bed)
Writes  build/music.<mode>.wav, build/sfx.<mode>.wav, assets/audio/mix-<mode>.m4a
"""
import json
import subprocess
import sys
from pathlib import Path

import numpy as np
import pyloudnorm as pyln
import soundfile as sf
from pedalboard import Compressor, Delay, HighpassFilter, Limiter, LowpassFilter, Pedalboard, Reverb
from scipy.signal import butter, sosfilt, stft, istft

SR = 44100
BPM = 120.0
BEAT = 60.0 / BPM
BAR = BEAT * 4
ROOT = Path(__file__).resolve().parent.parent

mode = sys.argv[1] if len(sys.argv) > 1 else "text"
data = json.loads((ROOT / f"build/cues.{mode}.json").read_text())
T = data["T"]
CUES = data["cues"]
TOTAL = float(T["total"])
N = int(TOTAL * SR)
S = {k: v[0] for k, v in T["scenes"].items()}
E = {k: v[0] + v[1] for k, v in T["scenes"].items()}
rng = np.random.default_rng(20261021)


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def track():
    return np.zeros((2, N))


def place(buf, sig, t, gain=1.0, pan=0.0):
    """Add mono (n,) or stereo (2,n) `sig` at time t (seconds)."""
    i = int(round(t * SR))
    if i >= N:
        return
    if sig.ndim == 1:
        l = np.cos((pan + 1) * np.pi / 4)
        r = np.sin((pan + 1) * np.pi / 4)
        sig = np.vstack([sig * l * 1.414, sig * r * 1.414])
    j = min(N, i + sig.shape[1])
    if i < 0:
        sig = sig[:, -i:]
        i = 0
    buf[:, i:j] += sig[:, : j - i] * gain


def env(n, a=0.005, d=0.2, s=0.0, r=0.0, hold=None):
    t = np.arange(n) / SR
    e = np.minimum(1.0, t / max(a, 1e-4))
    if hold is None:
        e = e * (s + (1 - s) * np.exp(-np.maximum(0, t - a) / max(d, 1e-4)))
    else:
        e = e * (s + (1 - s) * np.exp(-np.maximum(0, t - a) / max(d, 1e-4)))
        rel = np.clip(1 - (t - hold) / max(r, 1e-4), 0, 1)
        e = e * np.where(t > hold, rel, 1)
    return e


def noise(n):
    return rng.standard_normal(n)


def bp(x, lo, hi, order=2):
    sos = butter(order, [lo, hi], btype="band", fs=SR, output="sos")
    return sosfilt(sos, x)


def hp(x, f, order=2):
    return sosfilt(butter(order, f, btype="high", fs=SR, output="sos"), x)


def lp(x, f, order=2):
    return sosfilt(butter(order, f, btype="low", fs=SR, output="sos"), x)


def saw_add(f, n, harm=30, detune=0.0, phase=0.0):
    t = np.arange(n) / SR
    out = np.zeros(n)
    f = f * 2 ** (detune / 1200)
    for k in range(1, harm + 1):
        if f * k > SR / 2 - 1000:
            break
        out += np.sin(2 * np.pi * f * k * t + phase * k) / k
    return out


def sweep_noise(dur, f0, f1, width=0.5, rise=True):
    """Noise whose spectral centre glides f0→f1 (STFT mask)."""
    n = int(dur * SR)
    x = noise(n)
    f, tt, Z = stft(x, fs=SR, nperseg=1024)
    prog = np.linspace(0, 1, Z.shape[1])
    centre = f0 * (f1 / f0) ** prog
    logf = np.log2(np.maximum(f, 1)[:, None])
    mask = np.exp(-((logf - np.log2(centre)[None, :]) ** 2) / (2 * width**2))
    _, y = istft(Z * mask, fs=SR, nperseg=1024)
    y = y[:n]
    if len(y) < n:
        y = np.pad(y, (0, n - len(y)))
    return y / (np.max(np.abs(y)) + 1e-9)


# ---------------------------------------------------------------- instruments
def kick():
    n = int(0.5 * SR)
    t = np.arange(n) / SR
    f = 46 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * np.exp(-t * 6.5)
    click = hp(noise(n), 2000) * np.exp(-t * 400) * 0.35
    return np.tanh((body + click) * 1.6) * 0.9


def clap():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    x = noise(n)
    e = np.zeros(n)
    for o in (0.0, 0.011, 0.022):
        e += np.where(t >= o, np.exp(-(t - o) / 0.008), 0) * 0.6
    e += np.where(t >= 0.03, np.exp(-(t - 0.03) / 0.11), 0)
    return bp(x, 900, 3200) * e * 0.9


def hat(open_=False):
    n = int((0.25 if open_ else 0.06) * SR)
    t = np.arange(n) / SR
    return hp(noise(n), 7500, 3) * np.exp(-t / (0.11 if open_ else 0.022)) * 0.5


def tick_click(f=3200, dec=0.012):
    n = int(0.06 * SR)
    t = np.arange(n) / SR
    return (np.sin(2 * np.pi * f * t) * 0.7 + hp(noise(n), 4000) * 0.3) * np.exp(-t / dec)


def bass_note(m, dur):
    n = int(dur * SR)
    f = mtof(m)
    x = saw_add(f, n, harm=14) + 0.6 * np.sin(2 * np.pi * f * np.arange(n) / SR)
    x = lp(x, 520)
    return np.tanh(x * 1.4) * env(n, a=0.004, d=dur * 0.6, s=0.55, r=0.03, hold=dur - 0.03) * 0.55


def pad_chord(notes, dur, bright=1800):
    n = int((dur + 0.8) * SR)
    L = np.zeros(n)
    R = np.zeros(n)
    for m in notes:
        f = mtof(m)
        for d, pan in ((-9, -0.8), (-3, -0.3), (0, 0), (4, 0.35), (10, 0.85)):
            v = saw_add(f, n, harm=24, detune=d, phase=rng.random() * 6.28) * 0.12
            L += v * (1 - pan) / 2
            R += v * (1 + pan) / 2
    e = env(n, a=0.35, d=10, s=1.0, r=0.8, hold=dur)
    return np.vstack([lp(L, bright) * e, lp(R, bright) * e])


def pluck(m, dur=0.4, bright=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mtof(m)
    x = np.zeros(n)
    for k in range(1, 12):
        if f * k > 16000:
            break
        x += np.sin(2 * np.pi * f * k * t) / k * np.exp(-t * (6 + k * 5 / bright))
    return x * np.minimum(1, t / 0.002) * 0.35


def bell(m, dur=2.2, gain=1.0):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mtof(m)
    x = np.zeros(n)
    for ratio, amp, dec in ((1, 1, 1.4), (2, 0.45, 0.9), (2.76, 0.35, 0.6), (5.4, 0.2, 0.3), (8.93, 0.1, 0.18)):
        x += amp * np.sin(2 * np.pi * f * ratio * t) * np.exp(-t / dec)
    return x * np.minimum(1, t / 0.003) * 0.3 * gain


def marimba(m, dur=0.6):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = mtof(m)
    x = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.28) + 0.35 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.05)
    x += 0.12 * np.sin(2 * np.pi * f * 9.9 * t) * np.exp(-t / 0.02)
    return x * np.minimum(1, t / 0.002) * 0.45


def impact(dur=2.5):
    n = int(dur * SR)
    t = np.arange(n) / SR
    f = 32 + 60 * np.exp(-t * 10)
    boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.9)
    crash = hp(noise(n), 3000) * np.exp(-t / 0.7) * 0.25
    return np.tanh((boom + crash) * 1.3) * 0.9


def riser(dur):
    n = int(dur * SR)
    t = np.arange(n) / SR
    x = sweep_noise(dur, 250, 9000, width=0.6) * (t / dur) ** 2
    f = 180 * (8 ** (t / dur))
    tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / dur) ** 3 * 0.15
    return (x * 0.5 + tone) * 0.8


# ---------------------------------------------------------------- score
CHORDS = [  # (pad notes, bass midi)  Am  F  C  G
    ([57, 60, 64, 69], 33),
    ([53, 57, 60, 65], 29),
    ([55, 60, 64, 67], 36),
    ([55, 59, 62, 67], 31),
]
ARP = [0, 1, 2, 3, 2, 1, 2, 3]


def section(t):
    """Arrangement flags for time t (seconds)."""
    if t < S["intro"]:
        return "hook"
    if t < S["agent"]:
        return "full"
    if t < S["agent"] + 4.5:
        return "noarp"
    if t < S["demo"]:
        return "full"
    if t < S["leads"]:
        return "light"
    if t < S["integrations"]:
        return "build"
    if t < S["value"]:
        return "full+"
    if t < S["value"] + 3.2:
        return "break"
    if t < S["cta"]:
        return "full"
    return "outro"


def score():
    drums = track()
    bass = track()
    pads = track()
    arps = track()
    fx = track()
    K, C, Hc, Ho = kick(), clap(), hat(), hat(True)
    kick_times = []

    nbars = int(np.ceil(TOTAL / BAR))
    for b in range(nbars):
        t0 = b * BAR
        sec = section(t0 + 0.01)
        notes, broot = CHORDS[b % 4]
        if sec == "hook":
            continue
        if sec == "outro":
            continue
        pad_gain = {"light": 0.55, "break": 0.9}.get(sec, 0.75)
        place(pads, pad_chord(notes, BAR, bright=2400 if sec in ("full+", "build") else 1700), t0, pad_gain)
        if sec != "break":
            for q in range(4):
                tk = t0 + q * BEAT
                place(drums, K, tk, 0.95)
                kick_times.append(tk)
                if sec != "light" and q in (1, 3):
                    place(drums, C, tk, 0.55, pan=0.05)
                place(drums, Ho if (sec == "full+" and q % 2) else Hc, tk + BEAT / 2, 0.38, pan=-0.25)
                if sec in ("full", "full+", "build", "noarp"):
                    place(drums, Hc, tk + BEAT * 0.25, 0.16, pan=0.3)
                    place(drums, Hc, tk + BEAT * 0.75, 0.16, pan=0.3)
            for e8 in range(8):
                m = broot + (12 if e8 in (3, 6) else 0)
                place(bass, bass_note(m, BEAT / 2 * 0.92), t0 + e8 * BEAT / 2, 0.85)
        if sec in ("full", "full+", "build", "break"):
            for s16 in range(16):
                m = notes[ARP[s16 % 8]] + 12
                g = 0.55 if s16 % 4 == 0 else 0.38
                if sec == "build":
                    g *= 0.6 + 0.4 * ((t0 - S["leads"]) / max(1, E["leads"] - S["leads"]))
                place(arps, pluck(m), t0 + s16 * BEAT / 4, g, pan=0.35 if s16 % 2 else -0.35)
        if sec == "light":
            for s8 in (0, 3, 6):
                place(arps, pluck(notes[ARP[s8]] + 12, bright=0.6), t0 + s8 * BEAT / 2, 0.28, pan=0.2)

    # --- hook: tension bed
    h0, h1 = 0.0, S["intro"]
    n = int((h1 - h0) * SR)
    t = np.arange(n) / SR
    drone = (np.sin(2 * np.pi * 55 * t) * 0.5 + np.sin(2 * np.pi * 82.4 * t) * 0.25 + np.sin(2 * np.pi * 110 * t) * 0.15)
    drone *= (0.55 + 0.25 * np.sin(2 * np.pi * 0.25 * t)) * np.minimum(1, t / 1.5)
    place(pads, np.vstack([drone, drone]), h0, 0.55)
    place(pads, pad_chord([57, 60, 64], h1 - 1.5, bright=900), h0, 0.45)
    tick_end = S["hook"] + 10.2
    k = 0
    while k * BEAT / 2 < tick_end:
        tt = k * BEAT / 2
        place(drums, tick_click(3600 if k % 2 == 0 else 2700), tt, 0.22 if k % 2 == 0 else 0.12, pan=0.3 if k % 2 else -0.3)
        if k % 4 == 0 and tt > 1.5:
            place(drums, K, tt, 0.35)  # heartbeat
        k += 1
    place(fx, riser(4.0), h1 - 4.0, 0.7)
    for i in range(16):  # snare roll into the drop
        tt = h1 - 2.0 + i * BEAT / 4
        place(drums, C, tt, 0.12 + 0.4 * i / 15, pan=0)
    place(fx, impact(), h1, 0.9)
    place(fx, hp(noise(int(2.5 * SR)), 5000) * np.exp(-np.arange(int(2.5 * SR)) / SR / 0.8) * 0.18, h1, 1.0)

    # risers into integrations + final
    place(fx, riser(2.0), S["integrations"] - 2.0, 0.55)
    place(fx, impact(1.8), S["integrations"], 0.5)
    place(fx, riser(1.6), S["value"] + 3.2 - 1.6, 0.4)

    # --- outro: final chord + logo bell
    c0 = S["cta"]
    place(fx, impact(3.0), c0, 0.7)
    place(pads, pad_chord([48, 55, 60, 64, 67], TOTAL - c0 - 1.0, bright=2600), c0, 0.8)
    place(bass, bass_note(36, 4.0), c0, 0.9)
    for q in range(8):  # gentle pulse while the logo builds
        place(drums, K, c0 + q * BEAT, 0.5 if q < 4 else 0.3)
        kick_times.append(c0 + q * BEAT)
        place(drums, Hc, c0 + q * BEAT + BEAT / 2, 0.25)
    for i, m in enumerate([72, 76, 79, 84]):
        place(arps, bell(m, 3.0), c0 + 1.85 + i * 0.09, 0.45, pan=-0.4 + i * 0.27)

    # sidechain duck on bass + pads
    duck = np.ones(N)
    L = int(0.25 * SR)
    shape = 1 - 0.55 * np.exp(-np.arange(L) / SR / 0.09)
    for tk in kick_times:
        i = int(tk * SR)
        j = min(N, i + L)
        if i < N:
            duck[i:j] = np.minimum(duck[i:j], shape[: j - i])
    bass *= duck
    pads *= duck

    verb = Pedalboard([Reverb(room_size=0.75, damping=0.4, wet_level=0.33, dry_level=0.75, width=1.0)])
    pads = verb(pads.astype(np.float32), SR)
    arp_chain = Pedalboard([Delay(delay_seconds=BEAT * 0.75, feedback=0.32, mix=0.28), Reverb(room_size=0.6, wet_level=0.25, dry_level=0.8)])
    arps = arp_chain(arps.astype(np.float32), SR)
    fx = Pedalboard([Reverb(room_size=0.85, wet_level=0.25, dry_level=0.85)])(fx.astype(np.float32), SR)
    drums = Pedalboard([Compressor(threshold_db=-12, ratio=3, attack_ms=5, release_ms=80)])(drums.astype(np.float32), SR)

    mix = drums * 0.9 + bass * 0.9 + pads * 0.55 + arps * 0.6 + fx * 0.8
    # section automation: sit back under the chat demo so its message sounds read clearly
    auto = np.ones(N)
    a, b = int(S["demo"] * SR), int(E["demo"] * SR)
    ramp = int(0.5 * SR)
    auto[a:b] = 0.68
    auto[a : a + ramp] = np.linspace(1, 0.68, ramp)
    auto[b - ramp : b] = np.linspace(0.68, 1, ramp)
    mix *= auto
    # fade the tail
    tail = int(1.2 * SR)
    mix[:, -tail:] *= np.linspace(1, 0, tail) ** 1.5
    mix = Pedalboard([HighpassFilter(28), Compressor(threshold_db=-14, ratio=2.2, attack_ms=20, release_ms=200)])(mix.astype(np.float32), SR)
    return mix


# ---------------------------------------------------------------- SFX
def add(*xs):
    """Sum mono signals of different lengths (zero-padded)."""
    n = max(len(x) for x in xs)
    out = np.zeros(n)
    for x in xs:
        out[: len(x)] += x
    return out


def sfx_sound(c):
    ty = c["type"]
    if ty == "notif":
        v = c.get("v", 0)
        base = [83, 85, 88, 81][v]
        a = np.concatenate([marimba(base, 0.09)[: int(0.07 * SR)], marimba(base + 7, 0.4)])
        return a * 0.9, 0.55, (v - 1.5) * 0.3
    if ty == "msg_in":
        n = int(0.16 * SR)
        t = np.arange(n) / SR
        f = 520 + 420 * (t / t[-1]) ** 0.6
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.05) * 0.6, 0.6, 0.15
    if ty == "msg_out":
        n = int(0.22 * SR)
        t = np.arange(n) / SR
        sw = sweep_noise(0.22, 1500, 6000, 0.5) * np.sin(np.pi * t / t[-1]) * 0.25
        f = 900 + 600 * (t / t[-1])
        tone = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-np.maximum(0, t - 0.06) / 0.04) * (t > 0.06) * 0.5
        return sw + tone, 0.6, -0.15
    if ty == "bot":
        n = int(0.12 * SR)
        t = np.arange(n) / SR
        return lp(np.sign(np.sin(2 * np.pi * 260 * t)), 1500) * np.exp(-t / 0.05) * 0.3, 0.5, 0
    if ty in ("tick", "tick_soft", "fill"):
        g = {"tick": 0.45, "tick_soft": 0.22, "fill": 0.3}[ty]
        return tick_click(2400 + rng.random() * 1800, 0.01), g, (rng.random() - 0.5) * 0.8
    if ty == "tick_big":
        return add(tick_click(1500, 0.03), 0.4 * marimba(64, 0.3)), 0.6, 0
    if ty in ("whoosh", "whoosh_soft", "fall"):
        dur = {"whoosh": 0.55, "whoosh_soft": 0.4, "fall": 1.0}[ty]
        n = int(dur * SR)
        t = np.arange(n) / SR
        f0, f1 = (5000, 300) if ty == "fall" else (400, 4500)
        x = sweep_noise(dur, f0, f1, 0.7) * np.sin(np.pi * t / dur) ** 2
        return x, {"whoosh": 0.42, "whoosh_soft": 0.25, "fall": 0.45}[ty], 0
    if ty == "slam":
        n = int(0.9 * SR)
        t = np.arange(n) / SR
        f = 40 + 80 * np.exp(-t * 18)
        boom = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.35)
        cl = clap()
        cl = np.pad(cl, (0, max(0, n - len(cl))))[:n]
        return np.tanh(boom * 2 + cl * 0.8) * 0.8, 0.75, 0
    if ty == "pop":
        n = int(0.12 * SR)
        t = np.arange(n) / SR
        f = 380 * (2.2 ** (t / t[-1]))
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.035), 0.55, 0
    if ty in ("reveal", "reveal_small", "hot"):
        notes = {"reveal": [79, 83, 86, 91, 95], "reveal_small": [84, 88, 91], "hot": [76, 79, 84]}[ty]
        out = np.zeros(int(2.6 * SR))
        for i, m in enumerate(notes):
            b = bell(m, 2.0, 0.8)
            o = int(i * 0.06 * SR)
            out[o : o + len(b)] += b[: len(out) - o]
        if ty == "hot":
            w = sweep_noise(0.5, 300, 5000, 0.6) * np.sin(np.pi * np.arange(int(0.5 * SR)) / (0.5 * SR)) * 0.4
            out[: len(w)] += w
        return out, {"reveal": 0.55, "reveal_small": 0.45, "hot": 0.55}[ty], 0
    if ty == "name":
        dur = 0.6
        n = int(dur * SR)
        t = np.arange(n) / SR
        return sweep_noise(dur, 300, 3000, 0.5) * (t / dur) ** 1.5 * 0.6, 0.3, 0
    if ty == "glitch":
        n = int(0.38 * SR)
        t = np.arange(n) / SR
        sq = np.sign(np.sin(2 * np.pi * 110 * t)) * (np.floor(t * 40) % 2)
        x = np.round((noise(n) * 0.4 + sq * 0.6) * 6) / 6
        return lp(x, 4000) * np.exp(-t / 0.2) * 0.6, 0.55, 0
    if ty == "absorb":
        return add(bell(88, 1.0), bell(91, 1.0) * 0.6), 0.5, 0
    if ty == "ding":
        return add(bell(84, 1.8), bell(88, 1.8) * 0.7), 0.6, 0
    if ty == "check":
        a = marimba(79, 0.12)[: int(0.08 * SR)]
        return np.concatenate([a, marimba(84, 0.5)]), 0.5, 0.1
    if ty == "station":
        m = [72, 74, 76, 79, 81][c.get("n", 0)]
        return add(marimba(m, 0.7), bell(m + 12, 1.0) * 0.4), 0.6, 0
    if ty == "rule":
        return add(marimba(76 if rng.random() > 0.5 else 79, 0.5), tick_click(3000) * 0.4), 0.42, 0.2
    if ty == "rewind":
        dur = 1.6
        n = int(dur * SR)
        t = np.arange(n) / SR
        f = 900 + 500 * np.sin(2 * np.pi * 9 * t)
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.pi * t / dur) * 0.2
        return x + sweep_noise(dur, 4000, 800, 0.6) * np.sin(np.pi * t / dur) * 0.15, 0.35, 0
    if ty == "land":
        n = int(0.6 * SR)
        t = np.arange(n) / SR
        f = 60 + 90 * np.exp(-t * 25)
        thump = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.18)
        return thump, 0.8, 0
    if ty == "click":
        return add(tick_click(1800, 0.008), tick_click(900, 0.02) * 0.6), 0.6, 0
    if ty == "typing":
        dur = c.get("dur", 0.7)
        out = np.zeros(int((dur + 0.1) * SR))
        tt = 0.0
        while tt < dur:
            k = tick_click(1800 + rng.random() * 1400, 0.006) * (0.5 + rng.random() * 0.5)
            o = int(tt * SR)
            out[o : o + len(k)] += k[: len(out) - o]
            tt += 0.055 + rng.random() * 0.05
        return out, 0.22, -0.2
    return None


def sfx_track():
    buf = track()
    for c in CUES:
        r = sfx_sound(c)
        if r is None:
            print("no sfx for", c["type"])
            continue
        sig, gain, pan = r
        place(buf, sig, c["t"], gain, pan)
    return Pedalboard([Reverb(room_size=0.35, wet_level=0.12, dry_level=0.95)])(buf.astype(np.float32), SR)


# ---------------------------------------------------------------- mix
def lufs(x):
    return pyln.Meter(SR).integrated_loudness(x.T)


def main():
    out = ROOT / "build"
    out.mkdir(exist_ok=True)
    music = score()
    sfx = sfx_track()
    sf.write(out / f"music.{mode}.wav", music.T, SR)
    sf.write(out / f"sfx.{mode}.wav", sfx.T, SR)

    vo_path = out / "vo.wav"
    if mode == "vo" and vo_path.exists():
        vo, vsr = sf.read(vo_path, always_2d=True)
        assert vsr == SR, "vo.wav must be 44.1 kHz"
        vo = vo.T
        if vo.shape[0] == 1:
            vo = np.vstack([vo[0], vo[0]])
        vo = np.pad(vo, ((0, 0), (0, max(0, N - vo.shape[1]))))[:, :N]
        # duck the bed under the voice (≈ -9 dB), smooth 120 ms
        lvl = np.abs(vo).mean(axis=0)
        k = int(0.12 * SR)
        lvl = np.convolve(lvl, np.ones(k) / k, mode="same")
        gate = np.clip(lvl / 0.02, 0, 1)
        duck = 1 - 0.65 * gate
        bed = music * 0.75 * duck + sfx * 0.7
        mix = bed + vo * 1.0
    else:
        mix = music * 0.85 + sfx * 0.85

    # loudness: push into a limiter, then trim to -14 LUFS (streaming/social target), peaks ≤ -1 dBFS
    mix = mix * (10 ** ((-12.0 - lufs(mix)) / 20))
    mix = Pedalboard([Limiter(threshold_db=-2.0, release_ms=150)])(mix.astype(np.float32), SR)
    mix = mix * (10 ** ((-14.0 - lufs(mix)) / 20))
    peak = np.max(np.abs(mix))
    if peak > 0.89:
        mix = mix * (0.89 / peak)
    print(f"[{mode}] LUFS {lufs(mix):.1f}  peak {20*np.log10(np.max(np.abs(mix))+1e-9):.1f} dBFS")
    wav = out / f"mix.{mode}.wav"
    sf.write(wav, mix.T, SR)
    m4a = ROOT / f"assets/audio/mix-{mode}.m4a"
    m4a.parent.mkdir(parents=True, exist_ok=True)
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", str(wav), "-c:a", "aac", "-b:a", "256k", str(m4a)], check=True)
    print("wrote", m4a)


if __name__ == "__main__":
    main()
