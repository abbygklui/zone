# Zone — Project Status

**Version:** 0.1.0
**Status:** 🟡 In Development
**Platform:** iOS
**Bundle:** com.silly.zone

---

## Phase 1 — Foundation 🟢 Complete

### Project Setup
- [x] Initialize Expo bare workflow project
- [x] Configure `app.json` with bundle ID `com.silly.zone`
- [x] Set up TypeScript (`tsconfig.json`, strict mode)
- [x] Configure Babel (`babel.config.js`) — uses `babel-preset-expo` + `react-native-reanimated/plugin`
- [ ] Set up ESLint + Prettier
- [x] Install and configure Zustand
- [x] Install and configure React Navigation v6
- [x] Load Fraunces and Source Sans 3 via `expo-font`
- [x] Define color tokens, spacing, and font constants

### iOS Configuration
- [ ] Configure `Info.plist` — `UIBackgroundModes: audio`
- [ ] Configure `AVAudioSession` category to `.playback`
- [ ] Test audio continues on lock screen
- [ ] Test audio continues when app is backgrounded (swiped away)
- [ ] Configure Control Center now-playing card

---

## Phase 2 — Noise Engine ⬜ Not Started

### Audio Files
- [ ] Source or generate white noise loop (seamless, 320kbps mp3)
- [ ] Source or generate pink noise loop
- [ ] Source or generate brown noise loop
- [ ] Source or generate rain ambience loop
- [ ] Source or generate café murmur loop
- [ ] Source or generate fireplace crackle loop
- [ ] Source or generate library ambience loop

### Audio Engine
- [ ] Install and configure `react-native-track-player`
- [ ] Implement `useAudioEngine` hook
- [ ] Implement three-channel mixing (white, pink, brown)
- [ ] Implement master volume control
- [ ] Implement fade-in (800ms) and fade-out (500ms) envelopes
- [ ] Implement crossfade between noise types (500ms on swipe)
- [ ] Implement scene layer mixing (ambient on top of noise)
- [x] Build `useAudioStore` with Zustand

### Presets
- [x] Define 3 built-in noise presets (Pure White, Pink Focus, Brown Deep)
- [ ] Define 4 built-in ambient scenes (Rain Study, Café Flow, Fireplace, Library)
- [ ] Persist active scene/preset to AsyncStorage

---

## Phase 3 — Core UI 🟡 In Progress

### Home Screen
- [x] Full-screen animated gradient background (`GradientBackground`)
  - 6 animated blobs, staggered color cycling per noise type
  - Fast cycle (6s) when playing, slow (22s) when idle
- [x] Gradient palette mapped to active noise type (white=pastel rainbow, pink=pinks, brown=earthy)
- [x] Gradient bloom animation on play / fade on pause
- [x] Slow organic idle pulse animation (11s loop)
- [x] Central play/pause orb (SVG radial gradient, aura + glow + body layers, specular highlight)
- [x] Swipeable noise type carousel (GestureDetector pan gesture)
- [x] Left/right ghost arrow buttons for noise navigation
- [x] Noise name label (Fraunces italic 34px) with fade-slide transition on change
- [x] Page dot indicators (pill/circle)
- [x] Master volume slider
- [x] "Scenes →" link to Scenes tab
- [x] Timer pill (compact, opens bottom sheet)
- [ ] Peeking adjacent orbs in carousel (full SVG orbs partially visible at screen edges)
- [ ] Audio crossfade triggered on noise type change

### Scenes Screen
- [ ] Horizontal preset scene cards with gradient thumbnail
- [ ] User saved custom scenes section
- [ ] Tap to activate scene (with crossfade)
- [ ] Long press to delete custom scene

### Customize Screen
- [ ] Three channel sliders (White / Pink / Brown volumes)
- [ ] Live preview of resulting gradient from mix weights
- [ ] Optional ambient layer toggle (Rain, Café, Fireplace, Library)
- [ ] Save custom mix as named scene
- [ ] Haptic feedback on slider interaction

### Settings Screen
- [ ] Pomodoro focus duration picker (5–90 min)
- [ ] Pomodoro break duration picker (1–30 min)
- [ ] Timer chime toggle
- [ ] App version display
- [ ] Feedback / rate app link

---

## Phase 4 — Timer System ⬜ Not Started

- [x] Build `useTimerStore` with Zustand (schema defined)
- [ ] Implement Pomodoro timer (focus → break cycle)
- [ ] Implement countdown timer (single custom duration)
- [ ] Circular progress ring (`TimerRing`)
- [ ] Timer persists across lock screen
- [ ] Soft chime notification at session end
- [ ] Auto-pause noise option at break
- [ ] Session counter display

---

## Phase 5 — Polish ⬜ Not Started

- [ ] Haptic feedback on play/pause (medium impact)
- [ ] Haptic feedback on scene switch (light impact)
- [ ] Haptic feedback on timer complete (notification)
- [ ] Smooth tab navigation transitions
- [ ] Splash screen with Zone wordmark (Fraunces)
- [ ] App icon (dark background, gradient orb)
- [ ] TestFlight build
- [ ] App Store screenshots

---

## Known Issues

- Audio files not yet sourced — `react-native-track-player` setup pending
- Adjacent orb peek in carousel is simplified (color dots) — full SVG orb peek not yet implemented
- Fraunces italic is synthesized (no italic font file loaded) — may want to add `Fraunces-Italic.ttf`

---

## Notes

- **SDK:** Expo SDK 54, React Native 0.76.9, React 18.3.2
- Babel preset: `babel-preset-expo` + `react-native-reanimated/plugin`
- Reanimated v3 (downgraded from v4 — all APIs compatible, no code changes needed)
- If New Architecture causes issues with track-player, add `RCTNewArchEnabled = false` to Info.plist
- Brown noise uses vivid earthy palette: burnt orange, amber, rust, terracotta — NOT muddy browns
- Fraunces used for wordmark (26px SemiBold), noise label (34px italic), timer digits only
