# Zone — Project Status

**Version:** 0.1.0  
**Status:** 🟡 In Development  
**Platform:** iOS  
**Bundle:** com.silly.zone

---

## Phase 1 — Foundation ⬜ Not Started

### Project Setup
- [ ] Initialize Expo bare workflow project
- [ ] Configure `app.json` with bundle ID `com.silly.zone`
- [ ] Set up TypeScript (`tsconfig.json`, strict mode)
- [ ] Configure Babel (`babel.config.js`)
- [ ] Set up ESLint + Prettier
- [ ] Install and configure Zustand
- [ ] Install and configure React Navigation v6
- [ ] Load Fraunces and Source Sans 3 via `expo-font`
- [ ] Define color tokens, spacing, and font constants

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
- [ ] Implement crossfade between noise types (1200ms)
- [ ] Implement scene layer mixing (ambient on top of noise)
- [ ] Build `useAudioStore` with Zustand

### Presets
- [ ] Define 3 built-in noise presets (Pure White, Pink Focus, Brown Deep)
- [ ] Define 4 built-in ambient scenes (Rain Study, Café Flow, Fireplace, Library)
- [ ] Persist active scene/preset to AsyncStorage

---

## Phase 3 — Core UI ⬜ Not Started

### Home Screen
- [ ] Full-screen animated gradient background (`GradientBackground`)
- [ ] Gradient mapped to active noise type
- [ ] Gradient bloom animation on play
- [ ] Slow organic idle pulse animation
- [ ] Central play/pause button
- [ ] Noise type selector (White / Pink / Brown chips)
- [ ] Master volume slider
- [ ] Active scene label + quick-switch button
- [ ] Timer overlay (compact, dismissible)

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

- [ ] Implement Pomodoro timer (focus → break cycle)
- [ ] Implement countdown timer (single custom duration)
- [ ] Circular progress ring (`TimerRing`)
- [ ] Timer persists across lock screen
- [ ] Soft chime notification at session end
- [ ] Auto-pause noise option at break
- [ ] Session counter display
- [ ] Build `useTimerStore` with Zustand

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

_None yet — project not started._

---

## Notes

- Audio files must loop seamlessly — test for click/pop at loop point
- Brown noise gradient uses warm amber tones to match the "cozy, deep" feel
- Fraunces should only be used for display text — headings, noise labels, timer digits
- Source Sans 3 for all UI controls, labels, captions
