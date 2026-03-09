[PROMPT.md](https://github.com/user-attachments/files/25846518/PROMPT.md)
# Zone — Claude Code Prompt

Paste everything below the line into Claude Code.

---

Build a React Native iOS app called **Zone** — a study-focused ambient noise app. Bundle ID: `com.silly.zone`. Use Expo bare workflow with TypeScript.

---

## What the App Does

Zone plays ambient noise (white, pink, or brown noise) to help users focus while studying. Users choose from built-in presets or blend noise types with sliders, and can layer ambient sounds (rain, café, fireplace, library) on top. When playing, the screen displays a slowly animated full-screen gradient that reflects the active noise type. **Audio must continue playing when the phone is locked or when the user switches to another app — this is a core requirement.**

---

## Tech Stack

Install and use these exact packages:

- `react-native-track-player` — audio playback + iOS background audio session
- `react-native-reanimated` v3 — all animations
- `expo-linear-gradient` — gradient backgrounds
- `zustand` — state management
- `@react-native-async-storage/async-storage` — persist preferences and custom scenes
- `expo-font` — load Fraunces and Source Sans 3
- `expo-haptics` — haptic feedback
- `@react-navigation/native` + `@react-navigation/bottom-tabs` — navigation
- `phosphor-react-native` — icons (thin weight, 1.5 stroke)
- `react-native-safe-area-context` — safe area insets

---

## iOS Background Audio — Critical Setup

1. In `ios/Zone/Info.plist`, add `UIBackgroundModes` array with string value `audio`
2. Configure `react-native-track-player` with `AVAudioSession` category: `playback`
3. Create a `service.ts` file for the track player background service
4. Audio must continue when: screen is locked, user swipes to another app, Control Center is open
5. Populate Control Center now-playing: title = active scene name, artist = "Zone"

---

## Design System

### Fonts
- **Fraunces** (Regular 400, SemiBold 600) — app name, screen titles, noise labels, timer digits, scene names only
- **Source Sans 3** (Regular 400, Medium 500) — all buttons, sliders, labels, body text, tab bar

Load both fonts in `App.tsx` before rendering anything.

### Colors
```ts
// constants/colors.ts
export const colors = {
  background:    '#0D0D0F',
  surface:       '#161618',
  surfaceHigh:   '#1F1F22',
  border:        '#2A2A2E',
  textPrimary:   '#F2F2F5',
  textSecondary: '#8E8E99',
  textTertiary:  '#52525C',
  accentDefault: '#7A7AE8',
  accentSuccess: '#5ABFA0',
  noise: {
    white:  { primary: '#A8C8F8', secondary: '#D0DCF0', accent: '#EEF2FA', glow: 'rgba(168,200,248,0.3)' },
    pink:   { primary: '#E882A8', secondary: '#C07098', accent: '#F2BFDA', glow: 'rgba(232,130,168,0.3)' },
    brown:  { primary: '#E8924A', secondary: '#C0622A', accent: '#F2C48A', glow: 'rgba(232,146,74,0.3)'  },
  }
}
```

### Spacing
4px base unit — use 4, 8, 12, 16, 20, 24, 32, 48px

### Border Radius
- 8px: chips/tags
- 16px: cards
- 24px: bottom sheets
- 9999px: pills, circular buttons

### Animation Rules
- All transitions: `easeInOutCubic`, 300ms default
- Gradient pulse cycle: 12–16 seconds (very slow, organic)
- Gradient bloom on play: 600ms ease-out (scale 0.8→1.0, opacity 0.4→1.0)
- Crossfade between noise types: 1200ms
- No box shadows — use glow effects (noise accent color at 30–40% opacity)

---

## Built-in Presets

Define in `src/constants/presets.ts`:

```ts
export const NOISE_PRESETS = [
  { id: 'white-pure',  name: 'Pure White',  noiseType: 'white', volumes: { white: 1.0, pink: 0.0, brown: 0.0 }, ambientLayer: null },
  { id: 'pink-focus',  name: 'Pink Focus',  noiseType: 'pink',  volumes: { white: 0.0, pink: 1.0, brown: 0.0 }, ambientLayer: null },
  { id: 'brown-deep',  name: 'Brown Deep',  noiseType: 'brown', volumes: { white: 0.0, pink: 0.0, brown: 1.0 }, ambientLayer: null },
  { id: 'rain-study',  name: 'Rain Study',  noiseType: 'pink',  volumes: { white: 0.0, pink: 0.7, brown: 0.0 }, ambientLayer: 'rain' },
  { id: 'cafe-flow',   name: 'Café Flow',   noiseType: 'brown', volumes: { white: 0.0, pink: 0.0, brown: 0.6 }, ambientLayer: 'cafe' },
  { id: 'fireplace',   name: 'Fireplace',   noiseType: 'brown', volumes: { white: 0.0, pink: 0.0, brown: 0.5 }, ambientLayer: 'fireplace' },
  { id: 'library',     name: 'Library',     noiseType: 'white', volumes: { white: 0.6, pink: 0.0, brown: 0.0 }, ambientLayer: 'library' },
]
```

---

## Screens & Navigation

Bottom tab navigator with 4 tabs. Tab bar: floating, semi-transparent dark background (`rgba(22,22,24,0.9)`), active tab uses noise accent color.

### Tab 1 — Home (Main Experience)

Full-screen immersive layout. Background gradient covers entire screen including status bar area.

**Layout top to bottom:**
1. Full-screen animated gradient background — tied to active noise type. Use Reanimated `withRepeat` + `withTiming` for slow organic drift. Two or three soft radial color blobs that slowly move. On play: bloom (scale 0.8→1.0, opacity 0.4→1.0). On pause: dim (opacity 0.4).
2. "Zone" wordmark — Fraunces SemiBold 14px, `textSecondary`, top center, below safe area top
3. Active scene name — center of screen, Fraunces Regular 28px, `textPrimary`
4. Play/pause button — 80px circle, `surface` background with 2px `border` border, phosphor `Play`/`Pause` icon 32px white. When playing: add a glow ring using `expo-linear-gradient` or a shadow with noise accent color.
5. Noise type chips — three pills: "White" / "Pink" / "Brown" horizontally centered. Source Sans 3 Medium 14px. Active: noise accent border + `surfaceHigh` tint. Inactive: `surfaceHigh` background, `textSecondary` text.
6. Master volume slider — full-width custom slider, 80% screen width, centered.
7. "Change scene →" — Source Sans 3 14px `textSecondary`, navigates to Scenes tab.
8. Timer pill — top-right when timer is active. Shows remaining time e.g. "23:45" in Fraunces 16px. Taps to open timer bottom sheet.

### Tab 2 — Scenes

2-column grid of scene cards. Each card: 160×100px, gradient thumbnail using scene noise palette, scene name Fraunces Regular 15px below, `radiusMd` corners. Active scene has glowing border. Sections: "Built-in" and "My Scenes" (if any custom saved). Tap to activate scene. Long press on custom scene to show delete option.

### Tab 3 — Customize

Build a custom noise mix.
1. Three sliders: White / Pink / Brown — each with label, current percentage, and noise color accent
2. Live gradient preview orb — 120px circle that updates in real time from slider values
3. Ambient layer row — horizontal chip scroll: None / Rain / Café / Fireplace / Library
4. "Save Scene" button — opens bottom sheet with a name text input and confirm button, saves to AsyncStorage
5. Small play button to preview the current mix without saving

### Tab 4 — Settings

Minimal grouped list:
- Pomodoro: focus duration picker (default 25, range 5–90 min), break duration picker (default 5, range 1–30 min)
- End chime toggle (default on)
- Auto-pause on break toggle (default off)
- App version
- Rate Zone (opens App Store link)

---

## Timer System

Triggered from Home Screen via floating timer pill or a timer icon in the nav area.

**Timer lives in a bottom sheet (snap to 50% or 85% screen height).**

Bottom sheet layout:
- Handle bar at top (4×36px, `border` color, pill shaped)
- Mode selector tabs: "Pomodoro" | "Countdown"
- Large circular progress ring (stroke only, not fill) — centered, ~240px diameter, noise accent color stroke
- Remaining time inside ring: Fraunces SemiBold 48px `textPrimary`
- Phase label under ring: "Focus" or "Break", Source Sans 3 Medium 15px `textSecondary`
- Control buttons: Reset (ghost) — Pause/Resume (filled) — (space for future skip)
- Session counter: "Session 2" caption below controls

Timer must keep running in the background. Fire a local push notification when a phase ends (request permission on first use). Auto-transition between focus and break phases.

---

## Zustand Stores

**`src/store/useAudioStore.ts`**
```ts
{
  isPlaying: boolean
  activePresetId: string | null
  volumes: { white: number; pink: number; brown: number }
  masterVolume: number
  activeAmbientLayer: string | null
  // actions
  setPlaying(v: boolean): void
  setPreset(id: string): void
  setVolumes(v: Partial<{white:number;pink:number;brown:number}>): void
  setMasterVolume(v: number): void
  setAmbientLayer(layer: string | null): void
}
```

**`src/store/useTimerStore.ts`**
```ts
{
  mode: 'pomodoro' | 'countdown' | 'off'
  focusDuration: number     // minutes
  breakDuration: number     // minutes
  phase: 'focus' | 'break'
  remaining: number         // seconds
  isRunning: boolean
  sessionsCompleted: number
  // actions
  startTimer(): void
  pauseTimer(): void
  resetTimer(): void
  tickTimer(): void
  setMode(m: TimerMode): void
  setFocusDuration(min: number): void
  setBreakDuration(min: number): void
}
```

**`src/store/useSceneStore.ts`**
```ts
{
  presets: Scene[]
  custom: Scene[]
  activeSceneId: string | null
  setActiveScene(id: string): void
  saveCustomScene(scene: Scene): void
  deleteCustomScene(id: string): void
}
```

---

## Haptics

```ts
// Play/pause tap:      Haptics.impactAsync(ImpactFeedbackStyle.Medium)
// Noise chip tap:      Haptics.impactAsync(ImpactFeedbackStyle.Light)
// Scene select:        Haptics.impactAsync(ImpactFeedbackStyle.Light)
// Save scene:          Haptics.impactAsync(ImpactFeedbackStyle.Medium)
// Timer start:         Haptics.impactAsync(ImpactFeedbackStyle.Medium)
// Timer phase end:     Haptics.notificationAsync(NotificationFeedbackType.Success)
// Slider moving:       Haptics.selectionAsync()
```

---

## Folder Structure

```
zone/
├── assets/
│   ├── fonts/          ← Fraunces-Regular.ttf, Fraunces-SemiBold.ttf, SourceSans3-Regular.ttf, SourceSans3-Medium.ttf
│   └── audio/          ← white-noise.mp3, pink-noise.mp3, brown-noise.mp3, rain.mp3, cafe.mp3, fireplace.mp3, library.mp3
├── src/
│   ├── components/
│   │   ├── noise/      ← NoiseCard, NoiseMixer, NoisePlayer, WaveformVisual
│   │   ├── ambient/    ← GradientBackground, SceneCard, SceneList
│   │   ├── timer/      ← PomodoroTimer, CountdownTimer, TimerRing
│   │   └── ui/         ← Slider, IconButton, Tag, BottomSheet
│   ├── screens/        ← HomeScreen, ScenesScreen, CustomizeScreen, SettingsScreen
│   ├── store/          ← useAudioStore, useTimerStore, useSceneStore
│   ├── hooks/          ← useAudioEngine, useGradientAnimation, useHaptics
│   ├── constants/      ← colors.ts, fonts.ts, presets.ts, layout.ts
│   ├── utils/          ← audio.ts, time.ts
│   └── navigation/     ← RootNavigator.tsx, TabNavigator.tsx
├── service.ts          ← react-native-track-player background service
├── App.tsx
└── app.json
```

---

## Build Order

Build strictly in this order and verify each step works before moving on:

1. Expo bare init, TypeScript config, all packages installed
2. `constants/` — colors, fonts, spacing, presets defined
3. Font loading — both fonts loaded in App.tsx, verified in a test component
4. Navigation shell — 4 empty tab screens, tab bar styled correctly
5. Audio engine — track player configured, background audio verified (lock screen test), play/pause working
6. All three Zustand stores wired up
7. Home Screen — gradient, play button, noise chips, volume slider, all connected to store
8. Gradient animation — Reanimated pulse and bloom fully working
9. Scenes Screen — preset grid, tap-to-activate with audio crossfade
10. Customize Screen — sliders, live preview, ambient layer, save scene
11. Timer bottom sheet — circular ring, pomodoro + countdown, background timer
12. Settings Screen
13. Haptics pass — add all haptic feedback
14. Final polish — safe area handling, tab bar, spacing, test on multiple screen sizes

---

## Critical Rules

- Root background is always `#0D0D0F` — never white or system default
- Never use system/platform default colors — always use the Zone color system defined above
- Gradient on Home Screen must extend behind the status bar (use safe area for content insets, not background)
- Fraunces is display-only: titles, noise names, timer digits. Never use for body text or small UI labels
- Source Sans 3 for all interactive UI and body text
- Minimal text everywhere — if something can be removed, remove it
- The app should feel premium and calm, not utilitarian
- Test audio background behavior before calling any screen "done"
