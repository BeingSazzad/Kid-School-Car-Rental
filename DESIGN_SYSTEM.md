# 🎨 Home2School — Global Product Design System & UI/UX Guidelines

> **Permanent Design Memory & Architecture Reference**  
> This document defines the single source of truth for the Home2School application design system, visual hierarchy, color psychology, iconography, and spatial rhythm. Any contributor, agent, or developer must strictly adhere to these specifications.

---

## 🧠 1. Color Psychology & Behavioral UX Foundations

Home2School is a high-trust child transportation and school ride-booking platform. Parents trust the platform with their children's daily safety. Every color choice is mathematically tuned for emotional reassurance, cognitive ease, and safety.

### 🎯 Locked Core Palette Tokens

| Token Name | Hex Code | Role & Color Psychology | Visual Application |
|---|---|---|---|
| **`--color-primary`** | `#1B2B68` | **Parental Trust, Security & Stability**<br>Deep royal navy evokes institutional reliability, safety verification, and protective authority. Avoids near-black coldness while commanding respect. | All 48px primary action buttons, dark featured cards (`New Booking`), active focus rings, splash screen background, brand accents. |
| **`--color-secondary`** | `#F2600C` | **Safety, High-Visibility Alertness & Warmth**<br>Directly derived from school bus safety orange and crossing guard warmth. Triggers quick visual orientation for forward actions and urgent trip statuses without anxiety-inducing emergency red. | Circular forward action buttons (`→`), active navigation tabs, unread notification badges, pickup timeline markers, *"Brighter Future"* highlights. |
| **`--color-fade`** | `#F0F3FA` | **Cognitive Calm & Soft Surface Reassurance**<br>A soft, light blue-gray tint that prevents harsh white glare while maintaining high contrast. Creates clear spatial modularity without visual clutter. | Form inputs, light quick-action cards (`My Children`, `My Bookings`, `Safety & Help`), calendar date boxes, security cards. |
| **`--color-title`** | `#1A1D24` | **Readability & High-Contrast Anchoring**<br>Deep obsidian dark tone providing WCAG AAA contrast ratio on light backgrounds. Eliminates harsh `#000000` glare while delivering strong editorial hierarchy. | Page headers (`h1`, `h2`, `h3`), card titles, user greetings (`Hello, John 👋`), form input labels. |
| **`--color-body`** | `#6B7280` | **Visual Scannability & Reduced Fatigue**<br>Balanced neutral slate gray for supporting metadata. Ensures secondary information remains legible without competing for parent attention. | Subtitles, descriptions, placeholder texts, timeline route details, repeat frequency notes. |
| **`--color-stroke`** | `#ECECF0` | **Clean Modular Scaffolding**<br>Soft structural borders separating interactive zones without creating rigid, claustrophobic boxes. | Input field borders, card borders, route connecting lines, bottom navigation top divider. |

---

## 📐 2. Spatial Grid & Layout Rhythm (8-Point System)

To ensure visual consistency across all screens, all spacing, margins, and component heights adhere to an 8-point spatial grid:

- **Reference Canvas**: `430px` width × `932px` height (iPhone 14/15 Pro reference viewport).
- **Horizontal Margins**: Exactly **`20px`** on both left and right sides, giving **`390px`** usable content width.
- **Micro Spacing (`4px`)**: Spacing between icon and label, badge internal spacing.
- **Compact Spacing (`8px`)**: Spacing between input label and field, list item gaps, pill padding.
- **Medium Spacing (`12px`)**: Grid gap in 2×2 Quick Actions, header avatar-to-text gap.
- **Component Padding (`16px`)**: Padding inside cards, form group margins.
- **Section Rhythm (`20px – 24px`)**: Vertical distance between major visual blocks.
- **Scroll Breathing Room (`96px`)**: Bottom padding on scrollable containers to ensure the fixed navigation bar never obscures content.

---

## 🔤 3. Typography Hierarchy (Manrope)

Home2School exclusively uses **Manrope** (Google Fonts), selected for its open counters, clean geometric sans-serif clarity, and superior legibility at small sizes.

| Level | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| **Display Title** | `26px` | ExtraBold (800) | `1.2` | Splash & Welcome headlines |
| **Screen Title (`h1`)** | `22px` | ExtraBold (800) | `1.25` | Auth screen headings ("Verify Your Number", "Let's get to know you") |
| **Section Title (`h3`)** | `17px – 18px` | Bold / ExtraBold (700/800) | `1.25` | "Quick Actions", "Upcoming Trips", User greeting |
| **Card Header (`h4`)** | `15px` | Bold (700) | `1.3` | "New Booking", "My Children", "My Bookings" |
| **Button Text** | `18px` | **ExtraBold (800)** | `1.0` | 48px Primary Action Buttons (`Continue`, `Get Started`) |
| **Body / Subtitle** | `13.5px – 14px` | Medium / Regular (500/400) | `1.4` | Explanatory subtext, descriptions, form guidance |
| **Metadata / Microcopy** | `11px – 12px` | SemiBold (600) | `1.3` | Date badges, repeat info, tab labels, tags |

---

## 🔘 4. Standard Component Specifications

### 1. Primary Action Buttons
- **Height**: Exactly **`48px`**
- **Border Radius**: `12px` (`--radius-md`)
- **Background**: `var(--color-primary)` (`#1B2B68`)
- **Typography**: `18px`, `font-weight: 800` (ExtraBold), `#FFFFFF`
- **Hover/Active**: Lightens to `#263C8C` / darkens to `#152254`, with subtle elevation shadow.

### 2. Forward Action Circle Button (Onboarding)
- **Dimensions**: `52px × 52px` circular (`border-radius: 50%`)
- **Background**: `var(--color-secondary)` (`#F2600C`)
- **Icon**: White `arrow-right` Lucide icon (22px, `stroke-width: 2.6`)
- **Glow Shadow**: `0 6px 18px rgba(242, 96, 12, 0.4)`

### 3. Quick Action Cards (2×2 Grid)
- **Dimensions**: 2 columns, `1fr 1fr`, gap `12px`
- **Border Radius**: `16px` (`--radius-lg`)
- **Featured Card (New Booking)**: `background-color: var(--color-primary)` (`#1B2B68`), white icon in translucent glass circle, white text.
- **Secondary Cards (My Children, My Bookings, Safety & Help)**: `background-color: var(--color-fade)` (`#F0F3FA`), `border: 1px solid var(--color-stroke)`.

### 4. Input Fields
- **Height**: `48px – 52px`
- **Border Radius**: `12px`
- **Background**: `var(--color-fade)` (`#F0F3FA`)
- **Border**: `1.5px solid var(--color-stroke)` (`#ECECF0`)
- **Focus Ring**: Border becomes `var(--color-primary)` (`#1B2B68`) with subtle 3px focus glow.

### 5. Fixed Bottom Navigation Bar
- **Position**: `position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);`
- **Width**: `100%; max-width: 430px;`
- **Background**: `#FFFFFF` with `border-top: 1px solid var(--color-stroke)`
- **Z-Index**: `100` (always floats cleanly over content)
- **Active State**: Tab icon and text illuminate in `var(--color-secondary)` (`#F2600C`).

---

## ⚡ 5. Iconography Standard (Lucide Icons)

All iconography across Home2School uses standard **Lucide vector icons** with uniform geometric stroke metrics:
- **Default Grid**: `24 × 24 px` viewbox
- **Stroke Width**: `2.0` (standard) or `2.2` – `2.6` (for micro/prominent actions)
- **Caps & Joins**: `stroke-linecap="round"`, `stroke-linejoin="round"`
- **Color**: Inherits `currentColor` or maps strictly to design tokens:
  - Header Bell: `bell` (20px) + unread indicator dot (`#F2600C`)
  - New Booking: `calendar-plus` (22px, `#FFFFFF`)
  - My Children: `users` (22px, `#2563EB`)
  - My Bookings: `calendar-days` (20px, `#EF4444`)
  - Safety & Help: `shield-check` (20px, `#F2600C`)
  - Repeat Indicator: `repeat` (13px, `var(--color-body)`)
  - Both-way Route: `arrow-left-right` (11px, `#2563EB`)
  - Bottom Tabs: `home`, `clock`, `message-square`, `user` (22px)

---

## 📱 6. Screen Flow Architecture

```
[Splash Screen]
      │ (Tap or Auto)
      ▼
[Onboarding 1: Verified & Trusted]
      │ (Next →)
      ▼
[Onboarding 2: Real-time Tracking]
      │ (Next →)
      ▼
[Onboarding 3: Stay Connected]
      │ (Next → or Skip)
      ▼
[Auth 1: Welcome & Phone Input]
      │ (Continue)
      ▼
[Auth 2: OTP Verification (4 Digits)]
      │ (Continue)
      ▼
[Auth 3: Profile Info (Name, Email, Relation)]
      │ (Continue)
      ▼
[Auth 4: Add Photo (Upload & Preview)]
      │ (Continue or Skip)
      ▼
[Auth 5: Success Celebration (Confetti Blast)]
      │ (Get Started)
      ▼
[Home Screen (Full Simul Car Rental Experience)]
```

---

## 🔒 7. Absolute Rules (Do Not Break)
1. **Never alter the 6 locked color tokens** without explicit approval:
   - Primary `#1B2B68`
   - Secondary `#F2600C`
   - Fade `#F0F3FA`
   - Title `#1A1D24`
   - Body `#6B7280`
   - Stroke `#ECECF0`
2. **Never add external heavy phone mockups or frame borders**. The layout is designed to render directly as a clean 430px centered mobile application.
3. **Always preserve the 48px height and 18px ExtraBold button specifications**.
4. **Never hardcode arbitrary hex colors** in component stylesheets; always bind to `var(--color-*)`.
