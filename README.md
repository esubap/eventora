# ⚡ Squad & Friendship Hub

A modern, responsive, ultra-slick web application for friend groups, gaming squads, and tight-knit crews built with **React**, **Vite**, and **Tailwind CSS**.

---

## 🌟 Features Included

1. **Hero Section**:
   - Dynamic crew branding (`The Chaos Syndicate`), active streak counter (`584 Days Active 🔥`), live voice chat status pill, and animated rotating catchphrases.
   - High-impact bold group banner with stacked member avatars, real-time presence indicators (online/idle/dnd), and key stats (pizza eaten, lag excuses, 3 AM voice calls).

2. **Squad Roster**:
   - Character/RPG trading card-style member profiles.
   - Includes real photo avatars, role badges (e.g. *The Tactician*, *The Chaos Gremlin*, *The Silent Carry*), nicknames, iconic quotes, special perks, and funny stat meters (Clutch Potential, Coffee Dependency, Punctuality, Voice Volume).
   - Click any card to open a full **Dossier Modal** with lore, loadouts, and an interactive **Hype Member** button with confetti effects!

3. **The Quote Wall**:
   - Searchable and filterable archive of legendary squad moments.
   - Filter by category (*Gaming Rage*, *3 AM Epiphanies*, *Food Debates*, *Famous Last Words*, *Out of Context*, *Pure Wisdom*) and by squad member.
   - Interactive reactions (🔥, 😂, 💀, 🧢) with live counters.
   - One-click copy quote button with instant feedback.
   - **+ Add Iconic Quote** modal to record new moments in real-time.

4. **The Decision Wheel**:
   - Interactive HTML5 canvas spinning wheel with realistic physics and deceleration.
   - Pre-loaded dispute presets:
     - *Where Are We Eating? 🌮*
     - *What Game To Play? 🎮*
     - *Who Takes The Blame / Pays? 💳*
     - *Weekend Quest 🍿*
   - Add custom slices on the fly, remove slices, spin with sound effects, and celebrate with a confetti explosion upon picking a winner!
   - Saves recent decision history.

5. **Soundboard**:
   - Grid of styled sound buttons with gradients, emojis, and keyboard shortcuts (`1` to `9`, `0`, `G`, `B`).
   - Powered by an instant zero-dependency **Web Audio API synthesizer** (airhorns, sad trombone, bonk, 8-bit victory, laser, coin ping, level up fanfare, dramatic sub-bass boom, and crowd cheer).
   - Includes custom audio file uploader to test your squad's personal voice memos or MP3 clips live!
   - Master volume slider and live animated waveform bars.

---

## 📁 How To Swap In Your Real Data

All mock data is cleanly separated in:
```
src/data/squadData.json
```

### 1. Swapping Photos
- **Option A (Local images):** Put your image files (e.g. `alex.jpg`, `crew-banner.jpg`) in the `public/` folder, then set:
  ```json
  "avatar": "/alex.jpg"
  ```
- **Option B (Direct URLs):** Paste any direct image link from Discord, Imgur, Google Drive, or Unsplash:
  ```json
  "avatar": "https://i.imgur.com/your-image.jpg"
  ```

### 2. Changing Names, Roles & Stats
Open `src/data/squadData.json` and edit each member:
```json
{
  "id": "member-1",
  "name": "Your Friend's Name",
  "nickname": "Their Nickname",
  "role": "The Tactician",
  "avatar": "/photo.jpg",
  "quote": "Their favorite line...",
  "stats": [
    { "name": "Coffee Dependency", "value": 95, "rating": "Lethal" },
    { "name": "Punctuality", "value": 12, "rating": "Never On Time" }
  ]
}
```

### 3. In-App Data Manager
You can also click the **"Swap Data / JSON"** button in the top navigation bar to view, edit, or copy the entire squad JSON live right inside the web app!

---

## 🚀 Running the Project

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the local development server:
   ```bash
   npm run dev
   ```

3. Open your browser at:
   ```
   http://localhost:3000
   ```
