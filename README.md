# Home2School — Child Transportation & Car Booking App

A pixel-faithful, responsive mobile web application for **Home2School**, reproducing the design from Figma:
- **Onboarding Section** (Node `21010-5789`)
- **Authentication Section** (Node `21010-5905`)
- **Home Screen** (Node `21008-3626`)

---

## 🎨 Global Design System Specifications

| Token | Specification | Figma Value |
|---|---|---|
| **Reference Viewport** | 430 × 932 px | Centered desktop preview & responsive mobile |
| **Horizontal Content Padding** | 20 px on each side | 390 px usable content width |
| **Typography** | Font Family | **Manrope** (Google Fonts: 400, 500, 600, 700, 800) |
| **Action Buttons** | Height & Typography | **48 px height**, **18 px ExtraBold (font-weight 800)** |
| **Border Radii** | Small / Medium / Large / Pill | `8px`, `12px`, `16px`, `9999px` |
| **Brand Colors** | Deep Navy | `#1B2B68` (Splash) & `#1B2B68` (Primary Action & Card) |
| **Accent Colors** | Vibrant Orange | `#F2600C` / `#F2600C` |
| **Status Bar** | iOS Native | 9:41, Cellular, Wi-Fi, Battery |

---

## 📱 Implemented Screens

1. **Splash Screen**: Deep Navy branding (`#1B2B68`), centered Home2School circular emblem with gentle pulse animation, tap-to-enter hint.
2. **Onboarding 1 (Verified & Trusted)**: Authentic driver, parent and student photo, feature copy, 3-dot pagination, skip, circular orange next button.
3. **Onboarding 2 (Real-time Tracking)**: 3D route map on smartphone visual, copy, pagination, orange arrow button.
4. **Onboarding 3 (Stay Connected)**: Parent holding smartphone with live driver chat & pickup status chips ("Provider is on the way", "Ethan has been picked up", "Ethan has arrived at school").
5. **Auth 1 (Welcome & Phone Entry)**: Curved hero image with white school van & children waving, country code selector (🇨🇦 +1), 48px navy Continue button, and bottom privacy security badge.
6. **Auth 2 (Verify Your Number - OTP)**: +1 (416) *******2 target, 4-box OTP input with auto-advance and keyboard support, countdown resend timer (`00:25`).
7. **Auth 3 (Let's get to know you - Profile)**: Full Name, Email Address, Relationship selector ("Mother", "Father", "Guardian", etc.), 48px Continue button.
8. **Auth 4 (Add Your Photo)**: Dashed circular avatar ring, silhouette, camera badge, real image file picker & live preview, "Skip for now" link.
9. **Auth 5 (Success Celebration)**: Colorful celebration confetti particles with canvas-confetti blast, checkmark badge, "Welcome, Sadia!", and "Get Started" action button.
10. **Home Screen**:
    - Header with John's avatar, greeting (`Hello, John 👋`), subtitle (`Where would you like to go?`), and notification bell with unread indicator.
    - Hero Card: `Safe Ride` & `Brighter Future` text with white school van background.
    - Quick Actions Grid (2x2):
      - `New Booking` (Deep Navy card with calendar icon & subtext)
      - `My Children` (Soft light card with two kids icon & subtext)
      - `My Bookings` (Red calendar icon card)
      - `Safety & Help` (Orange shield icon card)
    - Upcoming Trips:
      - Date box (`May 22 Wed`)
      - Vertical timeline: Drop-off (07:45 AM Home → Dhanmondi Tutorial) and Pick-up (01:15 PM Dhanmondi Tutorial → Home)
      - Bottom bar: `Repeats: Mon, Tue, Wed, Thu, Sun` and `Both-way` badge.
    - Floating Bottom Navigation Bar (Home, Trips, Inbox, Profile) & Home indicator line.

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```

Visit the local live link in your browser:
**`http://localhost:5173/`**
