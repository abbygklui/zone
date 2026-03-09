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
| Animations | React Native Reanimated v3 + `expo-linear-gradient` |
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
│   │   │   ├── NoiseCard.tsx           # Single noise type selector card
│   │   │   ├── NoiseMixer.tsx          # Blend sliders for custom mix
│   │   │   ├── NoisePlayer.tsx         # Main play/pause/volume control
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

Each noise type maps to a distinct gradient palette:

| Noise | Gradient Colors |
|---|---|
| White | Ice blue → Silver → Near-white |
| Pink | Rose → Warm mauve → Soft lavender |
| Brown | Amber → Burnt orange → Deep walnut |
| Custom | Interpolated from channel volume weights |

- Gradient blooms on play (scale + opacity ease-in)
- Idle state: slow organic pulse at ~0.08Hz using Reanimated shared values
- Transition between types: color-interpolated crossfade over 1500ms
