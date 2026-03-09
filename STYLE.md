# Zone — Style Guide

---

## Philosophy

Zone's design language is **quiet, immersive, and intentional**. The interface steps back so the audio experience can step forward. Every visual choice should feel like it belongs in the background — functional, never distracting, always beautiful.

---

## Typography

### Fonts

| Role | Font | Weights Used |
|---|---|---|
| Display / Headings | Fraunces | Regular (400), SemiBold (600) |
| Body / UI | Source Sans 3 | Regular (400), Medium (500) |

### Usage Rules

- **Fraunces** → App name, screen titles, noise type labels, timer digits, scene names
- **Source Sans 3** → Buttons, sliders, captions, settings labels, tab bar items, all interactive UI

### Type Scale

| Token | Size | Font | Weight | Usage |
|---|---|---|---|---|
| `display-xl` | 48px | Fraunces | SemiBold | Timer countdown |
| `display-lg` | 36px | Fraunces | Regular | Screen title |
| `display-md` | 28px | Fraunces | Regular | Noise type label |
| `title` | 20px | Fraunces | SemiBold | Section heading |
| `body-lg` | 17px | Source Sans 3 | Regular | Primary body |
| `body-md` | 15px | Source Sans 3 | Regular | Secondary body |
| `label` | 13px | Source Sans 3 | Medium | Caps label, tag |
| `caption` | 11px | Source Sans 3 | Regular | Fine print |

---

## Color System

### Base

```ts
background:     '#0D0D0F'   // Almost-black, cool dark
surface:        '#161618'   // Slightly lifted surface
surfaceHigh:    '#1F1F22'   // Card / sheet surfaces
border:         '#2A2A2E'   // Subtle separator
```

### Text

```ts
textPrimary:    '#F2F2F5'   // Almost white
textSecondary:  '#8E8E99'   // Muted label
textTertiary:   '#52525C'   // Placeholder / disabled
```

### Noise Gradient Palettes

Each noise type owns a gradient palette used for both background and accent:

```ts
white: {
  primary:   '#A8C8F8',   // Ice blue
  secondary: '#D0DCF0',   // Silver blue
  accent:    '#EEF2FA',   // Near white
  glow:      'rgba(168, 200, 248, 0.3)',
}

pink: {
  primary:   '#E882A8',   // Rose
  secondary: '#C07098',   // Mauve
  accent:    '#F2BFDA',   // Blush
  glow:      'rgba(232, 130, 168, 0.3)',
}

brown: {
  primary:   '#E8924A',   // Amber
  secondary: '#C0622A',   // Burnt orange
  accent:    '#F2C48A',   // Warm gold
  glow:      'rgba(232, 146, 74, 0.3)',
}
```

### UI Accents

```ts
accentDefault:  '#7A7AE8'   // Soft indigo — selected states, CTA
accentSuccess:  '#5ABFA0'   // Teal — timer complete
accentWarning:  '#E8B95A'   // Amber — break phase
```

---

## Spacing

Based on a 4px base unit:

```ts
space1:   4px
space2:   8px
space3:  12px
space4:  16px
space5:  20px
space6:  24px
space8:  32px
space10: 40px
space12: 48px
space16: 64px
```

---

## Border Radius

```ts
radiusSm:   8px    // Tags, chips
radiusMd:   16px   // Cards, inputs
radiusLg:   24px   // Sheets, modals
radiusXl:   32px   // Player card
radiusFull: 9999px // Pills, circular buttons
```

---

## Shadows / Glow

No traditional box shadows — use color glow effects to match the gradient aesthetic:

```ts
// Glow under active noise orb
glowWhite:  '0 0 60px rgba(168, 200, 248, 0.4)'
glowPink:   '0 0 60px rgba(232, 130, 168, 0.4)'
glowBrown:  '0 0 60px rgba(232, 146, 74, 0.4)'
```

---

## Icons

- Use `phosphor-react-native` — thin weight (1.5px stroke) for all icons
- Icon size: 24px standard, 20px in tight contexts, 28px for primary actions
- Color: always `textSecondary` unless active/selected (then use noise accent color)

---

## Animation Principles

| Principle | Value |
|---|---|
| Easing | `easeInOutCubic` for all transitions |
| Default duration | 300ms |
| Gradient bloom | 600ms ease-out |
| Gradient pulse cycle | ~12s (very slow) |
| Crossfade between noise types | 1200ms |
| Tab navigation | 250ms slide |
| Bottom sheet snap | 350ms spring |

---

## Component Patterns

### Noise Type Chip
- Pill shape, `radiusFull`
- Inactive: `surfaceHigh` background, `textSecondary` text
- Active: noise gradient as border + background tint, `textPrimary` text + glow

### Play Button
- 80px circular, `surfaceHigh` background
- Active state: gradient ring border (3px), inner glow
- Icon: phosphor `Play` / `Pause`, 32px, white

### Slider
- Track: `border` color (2px height)
- Fill: noise gradient color (left of thumb)
- Thumb: 20px circle, white, subtle shadow

### Scene Card
- 160 × 100px, `radiusMd`
- Gradient thumbnail top half
- Scene name in Fraunces Regular 15px below
- Active: glowing border in noise accent color

### Bottom Sheet
- Background: `surface`
- Handle bar: `border` color, 4px × 36px, `radiusFull`
- Snap points: 40%, 80% of screen height

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| Use gradients generously for atmosphere | Use flat solid accent colors as primary UI |
| Keep Fraunces to display-only roles | Use Fraunces for body text or small labels |
| Let the gradient breathe with negative space | Crowd the home screen with too many controls |
| Use glow over shadows | Use hard drop shadows |
| Animate slowly — everything in Zone is calm | Use snappy, energetic transitions |
| Use opacity for hierarchy | Use many different text colors |
