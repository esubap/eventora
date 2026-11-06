# 🌸 The IT Guy's Dating Proposal Web Application ♡

A cute, slightly funny, and sarcastic dating proposal website crafted with a soft aesthetic, modern glassmorphism, delightful animations, and IT guy humor.

Built with **HTML5**, **Tailwind CSS**, modern **CSS3**, and vanilla **JavaScript (ES6+)**.

---

## ✨ Features & Multi-Step Flow

### 1. Step 1: The Question ("Will you go on a date with me?")
- **Centered Glassmorphic Card Container**: Soft pink/beige gradient background, smooth drop shadows, and subtle floating blossoms & paw prints.
- **Picture/Avatar**: Adorable vector pug avatar wearing nerdy wireframe glasses, bowtie, and blush cheeks.
- **Heading**: `"🌸 Will you go on a date with me? 🌸"`
- **Buttons**:
  - `YES 🤍`: Glowing, pulsing rose button that expands as attempts are made.
  - `NO 🤍`: **Interactive Runaway Feature**! Hovering over or tapping the "NO" button makes it instantly teleport to random screen coordinates, cycling through sarcastic developer excuses (`"404: Rejection Not Found"`, `"Permission Denied (sudo won't help)"`, `"Git commit rejected by hook"`, etc.), making it practically impossible to decline.

### 2. Step 2: Celebration Page
- **Trigger**: Activated immediately upon clicking `YES 🤍`.
- **Effects**: Full-screen colorful confetti burst & celebration chime fanfare.
- **Visual**: Ecstatic pug wearing a party hat with tears of pure joy 🥹.
- **Heading**: `"WAIT YOU ACTUALLY SAID YES?! 🥹"`
- **Subtext**: `"I was so ready for you to say no 😭"`
- **Sarcastic IT Note**: Canceling 8 hours of video games and rehearsing normal human conversation.
- **Button**: `"okay okay! →"` smoothly transitions to Step 3.

### 3. Step 3: Date Scheduling ("So... when are you free?")
- **Header**: Calendar icon with paw prints: `"🗓️ So... when are you free? 🐾"`.
- **Date Picker**: Custom-styled input (`Pick a Day (mm/dd/yyyy)`) with minimum date restricted to today, plus quick-selection chips (`This Friday 🌙`, `This Saturday ✨`, `Tomorrow! ⚡`, `Next Weekend 🌷`).
- **Time Picker**: Dropdown with options (`6:00 PM (Prime Dinner Time 🚗)`, `6:30 PM`, `7:00 PM (Candlelight Atmosphere 🕯️)`, etc.).
- **Button**: `"set the date! ♡"`

### 4. Step 4: Food Selection ("What are we feeling?")
- **Heading**: `"What are we feeling? ✨"` with subtext `"pick your vibe"`.
- **Food Grid**: Interactive, bounce-animated food cards with sarcastic IT commentary:
  - 🍕 **Pizza 🍕** (*"Classic. 0% chance of failure"*)
  - 🍣 **Sushi 🍣** (*"High luxury bandwidth"*)
  - 🍔 **Burgers 🍔** (*"Messy, honest comfort food"*)
  - 🍝 **Pasta 🍝** (*"Lady & The Tramp simulation"*)
  - 🌮 **Tacos 🌮** (*"Guac is 100% sponsored"*)
  - 🍜 **Ramen 🍜** (*"Warm soup, glasses fogged"*)
- **Interactive State**: Highlights with checkmark badge, soft glow, and click sound.
- **Button**: Dynamic button (e.g. `"lock in Pizza! 🍕 ♡"`).

### 5. Step 5: The Confirmation Letter
- **Heading**: `"glad you didn't say no. be ready by 6, I'm coming to get you 🚗"`
- **Card Design**: Vintage love memo complete with washi tape, live date/time/food pills, and IT boyfriend guarantees (e.g., zero Linux talk for the first 45 minutes, root Bluetooth aux cord privileges, free lifetime Wi-Fi troubleshooting).
- **Handwritten P.S. Note**:
  > *"P.S. normal people text. I made a website on Replit, during lunch, for you. no big deal. ♡♡♡♡♡"*
- **Button**: `"ok I accept 🥂"`

### 6. Step 6: The Joke Paywall & Final Screen
- **Heading**: `"one small fee"`
- **Subtext**: `"to confirm your acceptance of this date, please complete the following transaction. totally normal, everyone does this."`
- **Fake Transaction Box**:
  - Item: `Date Agreement™`
  - Price: `$499`
  - Description: `one-time fee · non-refundable · absolutely worth it`
  - Itemized Breakdown: Seat reservation, boyfriend tech support warranty, and snack buffer protocol.
  - Sarcastic Promo Code field: enter `UR_CUTE` or `FREE` for 100% discount!
- **Prominent Button**: `"pay $499 & confirm ♡"`
- **Go Back Link**: Clicking `"go back"` triggers a humorous toast: *"403 Forbidden: Contract is legally binding! No takebacks allowed 😉"*.
- **Post-Payment Modal & Extras**:
  - Official Date Ticket Receipt (`PAID $0.00`).
  - **Download Calendar Invite (.ics)**: Generates a genuine `.ics` calendar invitation file.
  - **Copy Confirmation Text**: Copies a playful text message to clipboard for easy texting.
  - **Replay Demo**: Resets the app to watch the IT guy panic all over again.

---

## 🚀 How to Run Locally

### Option 1: Direct File Opening
Double-click `index.html` in file explorer or open it directly in any modern browser (Chrome, Edge, Safari, Firefox).

### Option 2: Node.js Local Server
```bash
node server.js
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📂 File Structure

```
├── index.html                   # Main multi-step application
├── README.md                    # Documentation
├── server.js                    # Lightweight static file server
├── test-dating-app.js           # Automated verification test suite
├── assets/
│   └── images/
│       ├── cute-pug.svg         # Animated avatar with glasses and rose
│       └── happy-pug.svg        # Celebration avatar with party hat
├── css/
│   └── dating.css               # Design tokens, soft shadows, keyframe animations
└── js/
    └── dating.js                # State management, runaway NO button, audio synth, confetti, .ics export
```
