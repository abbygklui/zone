# Zone — Architecture

## Overview

Zone is a React Native iOS application for study-focused ambient noise. It generates and layers white, pink, and brown noise with visual ambiance, a Pomodoro timer, and preset/custom scene management. Audio continues during lock screen and background app states via native iOS audio sessions.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native (Expo bare workflow) |
| Language | TypeScript |
| Navigation | React Navigation v6 (bottom tabs) |
| Audio Engine | `react-native-track-player` |
| Background Audio | `react-native-track-player` (AVAudioSession, iOS `playback` category) |
| Animations | React Native Reanimated v4 + `expo-linear-gradient` + `react-native-svg` |
| State | Zustand |
| Storage | `@react-native-async-storage/async-storage` |
| Fonts | `expo-font` — Fraunces, Source Sans 3 |
| Haptics | `expo-haptics` |
| Bundle ID | `com.silly.zone` |
| Platform | iOS first (iPhone) |

---

## Directory Structure

```
zone/
├── app.json
├── babel.config.js
├── tsconfig.json
├── assets/
│   ├── fonts/
│   │   ├── Fraunces-Regular.ttf
│   │   ├── Fraunces-SemiBold.ttf
│   │   ├── SourceSans3-Regular.ttf
│   │   └── SourceSans3-Medium.ttf
│   └── audio/
│       ├── white-noise.mp3
│       ├── pink-noise.mp3
│       ├── brown-noise.mp3
│       ├── rain.mp3
│       ├── cafe.mp3
│       ├── fireplace.mp3
│       └── library.mp3
├── src/
│   ├── components/
│   │   ├── noise/
│   │   │   ├── NoiseCard.tsx           # Noise type chip (used in Customize/Scenes)
│   │   │   ├── NoiseMixer.tsx          # Blend sliders for custom mix
│   │   │   ├── NoisePlayer.tsx         # Glowing SVG orb — play/pause button + radial gradient sphere
│   │   │   └── WaveformVisual.tsx      # Animated visualizer orb
│   │   ├── ambient/
│   │   │   ├── GradientBackground.tsx  # Full-screen animated gradient
│   │   │   ├── SceneCard.tsx           # Preset scene card
│   │   │   └── SceneList.tsx           # Horizontal scene scroller
│   │   ├── timer/
│   │   │   ├── PomodoroTimer.tsx       # 25/5 focus-break cycle
│   │   │   ├── CountdownTimer.tsx      # Custom duration countdown
│   │   │   └── TimerRing.tsx           # Circular progress ring
│   │   └── ui/
│   │       ├── Slider.tsx              # Custom styled range slider
│   │       ├── IconButton.tsx          # Pill/ghost icon buttons
│   │       ├── Tag.tsx                 # Rounded pill tag
│   │       └── BottomSheet.tsx         # Reusable snap bottom sheet
│   ├── screens/
│   │   ├── HomeScreen.tsx             # Main player + gradient + timer
│   │   ├── ScenesScreen.tsx           # Browse & select scenes/presets
│   │   ├── CustomizeScreen.tsx        # Build a custom noise mix
│   │   └── SettingsScreen.tsx         # Timer, audio, preferences
│   ├── store/
│   │   ├── useAudioStore.ts           # Playback state
│   │   ├── useTimerStore.ts           # Pomodoro/countdown state
│   │   └── useSceneStore.ts           # Preset + saved custom scenes
│   ├── hooks/
│   │   ├── useAudioEngine.ts          # Audio init + background session
│   │   ├── useGradientAnimation.ts    # Reanimated gradient controller
│   │   └── useHaptics.ts              # Consistent haptic patterns
│   ├── constants/
│   │   ├── colors.ts                  # Full color token system
│   │   ├── fonts.ts                   # Font family constants
│   │   ├── presets.ts                 # Built-in noise scenes & mixes
│   │   └── layout.ts                  # Spacing, radii, screen dims
│   ├── utils/
│   │   ├── audio.ts                   # Volume helpers, fade utilities
│   │   └── time.ts                    # Timer formatting
│   └── navigation/
│       ├── RootNavigator.tsx
│       └── TabNavigator.tsx
└── ios/
    └── Zone/
        └── Info.plist                 # UIBackgroundModes: audio
```

---

## Audio Architecture

### Background Audio
- `react-native-track-player` configures iOS `AVAudioSession` with `.playback` category
- Audio continues uninterrupted on lock screen, Control Center, and when app is swiped away
- `Info.plist` declares `UIBackgroundModes: [audio]`
- Now-playing metadata (title: active scene name) appears in Control Center

### Noise Channels
- Three independent audio channels: white, pink, brown noise (pre-rendered seamless loops)
- Each channel has its own volume (0.0–1.0)
- A master volume sits on top
- Scene presets layer ambient tracks (rain, café, fireplace, library) behind the noise mix
- Crossfade between noise types: 1200ms smooth transition

### Volume Envelope
- Fade-in on play: 800ms
- Fade-out on pause: 500ms
- Scene switch crossfade: 1000ms

---

## State Architecture (Zustand)

```ts
// useAudioStore
{
  isPlaying: boolean
  activeNoiseType: 'white' | 'pink' | 'brown' | 'custom'
  volumes: { white: number; pink: number; brown: number }
  activeScene: Scene | null
  masterVolume: number
}

// useTimerStore
{
  mode: 'pomodoro' | 'countdown' | 'off'
  focusDuration: number        // minutes
  breakDuration: number        // minutes
  phase: 'focus' | 'break'
  remaining: number            // seconds
  isRunning: boolean
  sessionsCompleted: number
}

// useSceneStore
{
  presets: Scene[]
  custom: Scene[]
  activeSceneId: string | null
}
```

---

## Screen Map

```
RootNavigator
└── TabNavigator
    ├── HomeScreen        ← Full-screen gradient + player + timer overlay
    ├── ScenesScreen      ← Preset and saved custom scene browser
    ├── CustomizeScreen   ← Noise mixer with channel sliders
    └── SettingsScreen    ← Timer config, preferences
```

---

## Gradient Animation System

### Background (`GradientBackground`)
6 animated blobs, each a different color from the active noise type's palette:

| Noise | Palette |
|---|---|
| White | Pastel rainbow — yellow, sky blue, baby pink, mint, lavender, soft green |
| Pink | Hot pink, rose, deep magenta, blush, fuchsia, medium pink |
| Brown | Vivid orange, burnt orange-red, amber, deep red-orange, golden amber, terracotta |

- Each blob cycles opacity using `(1 - cos(phase * 2π)) / 2` with 1/6 offset per blob
- When playing: 6s full color cycle, bloom opacity 1.0
- When idle: 22s slow cycle, bloom opacity 0.28
- Blob positions spread across full screen, slow organic movement via `pulseProgress` (11s loop)

### Orb (`NoisePlayer`)
Layered SVG sphere with radial gradients (react-native-svg):
1. **Outer aura** — 300px radial gradient, `orbOuter` → transparent, opacity breathes 0.32–0.88
2. **Mid glow** — 220px radial gradient, denser inner glow
3. **Orb body** — 170px radial gradient from `orbInner` (top-left highlight) → `orbOuter` (edge)
4. **Specular highlight** — small white ellipse, opacity 0.3, simulates 3D sphere
5. **Tap target** — 170px TouchableOpacity floated on top

- Pulse: scale 1.0 → 1.05 (3s loop) when playing
- Glow breathe: 0.32 → 0.88 (8s loop) when playing
