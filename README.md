# 🤖 Papi English: AI English Teacher for Amharic Speakers
### (ፓፒ እንግሊዝኛ - የእንግሊዝኛ ቋንቋ አሰልጣኝ)

A modern, responsive single-page web application designed specifically to empower native Amharic speakers to master conversational everyday English through intelligent interactive AI feedback, Amharic translations, Ge'ez phonetic guides, voice pronunciation practice, interactive 3D flashcards, and a gamified quiz arena.

---

## 🌟 Key Features

### 1. 🤖 Papi AI Conversational Assistant (Main Engine)
- **4-Part Structured AI Feedback:**
  1. 🎯 **Corrected English Sentence** (*ትክክለኛ አገላለጽ*)
  2. 📖 **Amharic Explanation** (*ትርጉም እና ሰዋስዋዊ ማብራሪያ*)
  3. 🗣️ **Ge'ez Phonetic Guide** (*የአነባበብ ድምፅ በግዕዝ ፊደላት*)
  4. 💬 **Follow-up Conversational Question** (*የቀጣይ ልምምድ ጥያቄ*)
- **Amharic-Specific Error Detection:** Specially programmed to catch and correct the most common English hurdles made by Habesha speakers:
  - *"I am agree"* ➔ *"I agree"*
  - *"Married with"* ➔ *"Married to"*
  - *"He don't"* ➔ *"He doesn't"*
  - *"Didn't saw"* ➔ *"Didn't see"*
  - *"Borrow me"* ➔ *"Lend me"*
  - *"I student"* ➔ *"I am a student"*
- **Two AI Operational Modes:**
  - **100% Offline Intelligent Simulation Engine:** Zero API key required, immediate responses, pre-loaded with rich contextual rules for greetings, job interviews, ordering food, directions, and grammar corrections.
  - **Live Gemini API Integration:** Insert your own Gemini API key via the settings modal to unlock dynamic generative AI conversations while preserving the structured Amharic bilingual format.

### 2. 🎙️ Voice & Audio Synthesis Practice
- **Text-to-Speech (TTS):** Integrated with the Web Speech Synthesis API (`window.speechSynthesis`). Listen to clear, native pronunciation on every English sentence and flashcard with a single click.
- **Speech Speed Control:** Adjustable speech rate (0.6x to 1.4x) with accent selection (US, British, Australian).
- **Speech-to-Text (STT):** Tap the microphone button to practice speaking English with live transcription into the chat.
- **Synthesized UI Sound Effects:** Zero external sound files needed; utilizes the Web Audio API for feedback chimes, pops, and buzzes.

### 3. 🃏 3D Bilingual Flashcards & Phrasebook
- **Interactive 3D Flip Animation:** Click to smoothly flip cards between Amharic and English.
- **Categorized Phrases:**
  - 🌟 Everyday Basics (*መሰረታዊ*)
  - ☕ Restaurant & Food (*ምግብና ገበያ*)
  - 🚕 Travel & Directions (*ጉዞና ታክሲ*)
  - 💼 Job Interview & Career (*ስራና ኢንተርቪው*)
  - 🏥 Health & Emergency (*ጤናና ድንገተኛ*)
- **Search & Bookmark:** Real-time search across Amharic, English, and phonetic text, plus a favorite/starring system stored in `localStorage`.

### 4. 🎯 Grammar & Vocabulary Quiz Arena
- **Targeted Challenge Questions:** Multi-choice questions focused on specific English traps for Amharic speakers.
- **Instant Visual & Audio Feedback:** Green glowing states with success chimes, or red shake animations with explanatory Amharic notes on why each distractor is incorrect.
- **Dynamic Score & Streak Counter:** Real-time progress bar, question counter, and streak counter.
- **Celebration Modal:** Score tiers, performance ratings in Amharic, and a one-click restart option.

### 5. 📚 Daily Bite-Sized Lessons
- *Lesson 1:* The Verb "To Be" (am, is, are) in Amharic vs English.
- *Lesson 2:* Asking Questions: "Do" vs "Are".
- *Lesson 3:* 5 Pronunciation Pitfalls for Habesha Speakers (P vs B, F vs V, TH sounds).
- *Lesson 4:* How to Pitch Yourself in a 60-Second Job Interview.

---

## 🎨 Design & Typography
- **Ge'ez Typography Support:** Custom rendering with `'Noto Sans Ethiopic'` and fallback to system fonts (`'Nyala'`, `'Abyssinica SIL'`, `'Kefa'`).
- **Dark & Light Mode:** Default dark glassmorphic design (`#0a0f1d`) with vibrant emerald (`#10b981`) and teal (`#06b6d4`) accents, with a one-click light theme toggle.
- **Mobile First Responsive:** Fluid layouts designed for smartphones, tablets, and desktop displays.

---

## 🚀 How to Run

Because **Papi English** is built with clean semantic HTML5, modern CSS3, and vanilla JavaScript without heavy build-step requirements, you can run it in multiple ways:

### Option 1: Direct Browser Launch
Simply double-click or open `index.html` in any modern web browser (Google Chrome, Microsoft Edge, Safari, Firefox).

### Option 2: Local Static Server (Node / Vite / Python)
```bash
# Using python
python -m http.server 3000

# Or using npx
npx serve .
```
Then visit `http://localhost:3000` in your browser.
