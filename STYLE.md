# Zone — Style Guide v2

## Design Philosophy

Zone uses a **"deep glass bloom"** aesthetic. The interface is a near-black void with luminous, glowing orbs that feel like light sources — intensely lit at their core, bleeding softly into the dark. The background is almost black but never dead; gradient color spills from the orb and bleeds across the whole screen. When noise plays, the entire environment comes alive with color.

**Key principles:**
- Dark shell, radiant core — dramatic contrast between the dark chrome and brilliant orbs
- The orb *is* the app — it dominates the screen and does the talking
- Color does all the emotional heavy lifting, not text or layout
- Every noise type has its own vivid color world — the screen transforms completely when you swipe
- Brighter and more saturated than a typical dark app — this is not muted dark mode, it is a living environment

---

## Typography

### Fonts

| Role | Font | Weights |
|---|---|---|
| Display / Headings | Fraunces | Regular (400), Italic, SemiBold (600) |
| Body / UI | Source Sans 3 | Light (300), Regular (400), SemiBold (600) |

### Usage Rules
- **Fraunces** → App wordmark, noise type name, timer numerals, scene names, preset names
- **Source Sans 3** → All controls, labels, captions, nav items, buttons, settings

### Type Scale

| Token | Size | Font | Weight | Usage |
|---|---|---|---|---|
| `wordmark` | 26px | Fraunces | SemiBold | "Zone" top left |
| `noise-label` | 34px | Fraunces | 300 Italic | "Brown Noise", "White Noise" |
| `timer` | 68px | Fraunces | 300 | Countdown digits |
| `section` | 18px | Fraunces | SemiBold | Section headings |
| `body` | 15px | Source Sans 3 | 400 | Body copy |
| `control-label` | 12px | Source Sans 3 | 600 | UPPERCASE nav, tags |
| `caption` | 11px | Source Sans 3 | 300 | Metadata, hints |

---

## Color System

### Base (dark shell — never changes)

```ts
background:    '#08080A'                    // Near-black — the void
surface:       '#0F0F12'                    // Slightly lifted
surfaceRaised: '#16161A'                    // Cards, sheets
border:        'rgba(255,255,255,0.07)'
textPrimary:   '#F6F5F0'                    // Warm off-white
textSecondary: '#8A8896'
textMuted:     '#44424F'
accent:        '#A08CFF'                    // Purple accent for UI chrome
```

---

## Noise Color Worlds

Each noise type owns a complete color world. When the user swipes to a noise type, the entire visual environment transforms — orb colors, ambient gradient, screen glow, all change together.

---

### White Noise — "Pastel Aurora"

Feeling: Airy, electric, creative. Like northern lights rendered in candy.
Palette: Multi-hue pastels cycling through soft yellows, sky blues, lilacs, mint greens, coral pinks.

```ts
whiteNoise: {
  orbColors: [
    '#FFE8A3',  // pastel yellow
    '#A8DFFF',  // sky blue
    '#FFB5D8',  // baby pink
    '#A3F0E8',  // mint turquoise
    '#C5B8FF',  // soft lavender
    '#B8F0A3',  // soft green
  ],
  ambientA: 'rgba(168, 223, 255, 0.35)',
  ambientB: 'rgba(255, 181, 216, 0.28)',
  ambientC: 'rgba(163, 240, 232, 0.22)',
  glowColor: 'rgba(200, 220, 255, 0.5)',
  orbInner: '#FFFFFF',
  orbOuter: '#A8DFFF',
}
```

Animation: Orb slowly cycles hue through the full pastel spectrum (~20s full rotation). Ambient background pulses with matching hue shifts. Feels like a prism spinning in gentle light. Most "rainbow" of the three noise types.

---

### Pink Noise — "Rose Depth"

Feeling: Warm, intimate, focused. Deep magentas and hot pinks fading into soft blush.
Palette: Rich pinks, hot magenta, rose, fuchsia — vivid but warm.

```ts
pinkNoise: {
  orbColors: [
    '#FF4D8F',  // hot pink
    '#FF80B0',  // rose pink
    '#E8336D',  // deep magenta
    '#FF9CC2',  // blush
    '#CC2266',  // dark magenta
    '#FF6BA8',  // medium pink
  ],
  ambientA: 'rgba(255, 77, 143, 0.40)',
  ambientB: 'rgba(232, 51, 109, 0.28)',
  ambientC: 'rgba(255, 156, 194, 0.20)',
  glowColor: 'rgba(255, 100, 160, 0.55)',
  orbInner: '#FFB0CC',
  orbOuter: '#E8336D',
}
```

Animation: Orb pulses between blush and deep magenta with a warm, intense heartbeat feel. Ambient background blooms hot pink from behind the orb.

---

### Brown Noise — "Ember Earth"

Feeling: Grounded, deep, warm. Volcanic oranges, burnt siennas, golden amber — NOT muddy. Think glowing embers, desert sunrise.
Palette: Rich earthy brights — vivid orange, terracotta, amber, deep red-orange.

```ts
brownNoise: {
  orbColors: [
    '#FF6B2B',  // vivid orange
    '#E8480A',  // burnt orange-red
    '#FF9A3C',  // amber
    '#CC3300',  // deep red-orange
    '#FFB347',  // golden amber
    '#D45500',  // terracotta
  ],
  ambientA: 'rgba(255, 107, 43, 0.42)',
  ambientB: 'rgba(232, 72, 10, 0.30)',
  ambientC: 'rgba(255, 179, 71, 0.22)',
  glowColor: 'rgba(255, 120, 50, 0.55)',
  orbInner: '#FFB347',
  orbOuter: '#CC3300',
}
```

Animation: Slow pulsing like embers breathing. Colors shift between amber and deep red. The ambient background radiates warm heat outward from the orb center.

---

## Orb Design

The orb is the center of the app — it should look like a glowing sphere, not a flat circle. Reference: the orange orb in the design reference image.

### Layers (back to front):
1. **Outer aura** — 440–500px diameter, extremely soft radial gradient, very low opacity (0.15–0.2), the color spill into the void
2. **Mid glow** — 300–320px, soft blurred circle, medium opacity (0.4), noise palette outer color
3. **Orb body** — 220px solid circle, radial gradient from `orbInner` (center) to `orbOuter` (edge)
4. **Surface highlight** — small bright ellipse top-left (~40px), near-white, low opacity — fakes a light source reflection
5. **Label** — noise name (Fraunces italic) or play icon centered, in white

### Orb states:
- **Idle:** Static, ambient glow dim (~0.3 opacity)
- **Playing:** Scale pulses 1.0 → 1.05 every 3s; hue shifts slowly through palette; glow breathes 0.5 → 0.85 every 8s
- **Tap:** Quick compress to 0.93, spring back with overshoot

---

## Home Screen — Swipeable Carousel

The home screen is a **full-screen horizontal swipe carousel**. One page per noise type. User swipes or uses arrows to navigate White → Pink → Brown.

```
[Safe Area Top Inset]
  "Zone"  (wordmark, top-left)              ⚙ (settings, top-right)

[Carousel Hero — ~58% of screen height]
  ←                  [CURRENT ORB]                   →
       [PREV ORB                        NEXT ORB]
       (peeking at edge, 0.5 opacity)

  [Noise type name — Fraunces italic, below orb]
  [Subtitle: "Tap to play" or animated waveform if playing]
  [• • •  page dots]

[Controls below carousel]
  [Volume slider — full width]

  [Preset pills — horizontal scroll]
    Deep Focus   Light Study   Alert Mode   Evening Blend   + New

[Quick Timer Row]
  [compact timer ring]  25:00  [Start]

[Tab Bar: Home · Timer · Scenes · Settings]
```

### Carousel peek behavior:
- Current orb: 220px, full opacity, centered
- Adjacent orbs: peek ~90px in from screen edge, 50% opacity, scaled to 0.65
- Swipe physics: spring animation, slight resistance at ends (no wrap-around — stops at White and Brown)
- Arrow buttons: 36px circles, `rgba(255,255,255,0.1)` fill, positioned at mid-orb height

### Swipe transition (all happen together, 400ms spring):
1. Current orb slides and scales down as it exits
2. New orb slides in and scales up to full size
3. Full-screen ambient gradient cross-fades to new noise color world
4. If playing: audio crossfades to new noise type (500ms)
5. Haptic: `ImpactFeedbackStyle.Light` on each page change

---

## Ambient Background (Playing State)

When noise plays, the full-screen background transforms into a living gradient environment.

**Structure:**
- 3 large radial gradient blobs, positioned off-center, independently animated
- Blob 1: top-left, 580px, slow drift path
- Blob 2: top-right, 420px, slightly faster drift
- Blob 3: bottom-center, 500px, slowest drift
- Each blob is heavily blurred (Gaussian blur ~80px) — they are clouds, not shapes

**Opacity:** 0 at rest → 0.85 on play (600ms ease-in). Reverse on stop.

**Motion (Reanimated loops):**
- Each blob translates on a slow looping path: ±40px X, ±30px Y over 12–18s
- Each blob scales gently: 1.0 → 1.15 loop (desynchronized across blobs)
- White noise blobs: also slowly hue-rotate through the pastel palette (~25s)

**Important:** This layer is `position: absolute`, covers 100% of screen, `pointerEvents: 'none'` — never blocks touches.

---

## Motion Reference

```
tap feedback:     80ms ease-out
state change:     200ms ease-out
carousel swipe:   spring { damping: 18, stiffness: 200 }
sheet open:       spring { damping: 20, stiffness: 180 }
gradient fade:    600ms ease-in-out
orb pulse:        3000ms ease-in-out, looping
glow breathe:     8000ms ease-in-out, looping
blob drift:       12000–18000ms ease-in-out, looping, desync per blob
hue cycle:        20000ms linear, looping (white noise only)
```

---

## Accessibility

- **Reduce Motion:** All looping animations disabled; color remains; gradient is static
- **VoiceOver:** Orb = "Brown Noise, double-tap to play"; arrows = "Next noise: Pink Noise"
- **Touch targets:** Minimum 44×44px everywhere
- **Contrast:** Minimum 4.5:1 for all text against surface backgrounds
- **Dynamic Type:** Source Sans 3 body text scales; Fraunces display text fixed size