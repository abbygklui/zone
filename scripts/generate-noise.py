#!/usr/bin/env python3
"""
Generate seamless white, pink, and brown noise loops for Zone app.
Output: 30-second stereo WAV files at 44100 Hz / 16-bit
"""

import numpy as np
import wave
import struct
import os

SAMPLE_RATE = 44100
DURATION = 30  # seconds — long enough that looping isn't noticeable
NUM_SAMPLES = SAMPLE_RATE * DURATION
OUT_DIR = os.path.join(os.path.dirname(__file__), '..', 'assets', 'audio')

def write_wav(filename, left, right):
    """Write stereo 16-bit WAV."""
    path = os.path.join(OUT_DIR, filename)
    # Interleave channels
    stereo = np.empty(len(left) * 2, dtype=np.int16)
    stereo[0::2] = (left * 32767).astype(np.int16)
    stereo[1::2] = (right * 32767).astype(np.int16)

    with wave.open(path, 'w') as f:
        f.setnchannels(2)
        f.setsampwidth(2)
        f.setframerate(SAMPLE_RATE)
        f.writeframes(stereo.tobytes())
    print(f'  wrote {path}')

def fade_ends(signal, fade_samples=4410):
    """Apply short fade-in and fade-out for seamless looping."""
    out = signal.copy()
    fade = np.linspace(0, 1, fade_samples)
    out[:fade_samples] *= fade
    out[-fade_samples:] *= fade[::-1]
    return out

def normalize(signal, peak=0.88):
    m = np.max(np.abs(signal))
    return signal / m * peak if m > 0 else signal


# ── White Noise ─────────────────────────────────────────────────────────────
def gen_white():
    print('Generating white noise...')
    rng = np.random.default_rng(42)
    L = rng.standard_normal(NUM_SAMPLES)
    R = rng.standard_normal(NUM_SAMPLES)
    L = fade_ends(normalize(L))
    R = fade_ends(normalize(R))
    write_wav('white-noise.wav', L, R)


# ── Pink Noise (Voss-McCartney algorithm) ───────────────────────────────────
def gen_pink():
    print('Generating pink noise...')
    rng = np.random.default_rng(43)

    def pink_channel():
        n = NUM_SAMPLES
        # IIR filter approximating 1/f spectrum
        white = rng.standard_normal(n)
        b = np.array([0.049922035, -0.095993537, 0.050612699, -0.004408786])
        a = np.array([1, -2.494956002, 2.017265875, -0.522189400])
        from scipy.signal import lfilter
        pink = lfilter(b, a, white)
        return pink

    L = fade_ends(normalize(pink_channel()))
    R = fade_ends(normalize(pink_channel()))
    write_wav('pink-noise.wav', L, R)


# ── Brown Noise (integrated white noise) ────────────────────────────────────
def gen_brown():
    print('Generating brown noise...')
    rng = np.random.default_rng(44)

    def brown_channel():
        white = rng.standard_normal(NUM_SAMPLES)
        brown = np.cumsum(white)
        # High-pass to remove DC drift
        from scipy.signal import butter, sosfilt
        sos = butter(2, 20.0 / (SAMPLE_RATE / 2), btype='high', output='sos')
        brown = sosfilt(sos, brown)
        return brown

    L = fade_ends(normalize(brown_channel()))
    R = fade_ends(normalize(brown_channel()))
    write_wav('brown-noise.wav', L, R)


if __name__ == '__main__':
    os.makedirs(OUT_DIR, exist_ok=True)
    gen_white()
    gen_pink()
    gen_brown()
    print('Done! All noise files generated.')
