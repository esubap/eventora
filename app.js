/**
 * Papi English (ፓፒ እንግሊዝኛ)
 * AI English Teacher for Amharic Speakers
 * Core Application Engine
 */

// ==========================================================================
// 1. App State & Storage Keys
// ==========================================================================
// Safe localStorage wrapper to prevent crashes in private mode or restrictive browsers
const safeStorage = {
  getItem(key) {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  },
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch (e) {}
  }
};

const STORAGE_KEYS = {
  API_KEY: 'papi_gemini_api_key',
  API_PROVIDER: 'papi_api_provider',
  THEME: 'papi_theme',
  FAVORITES: 'papi_starred_phrases',
  QUIZ_HIGHSCORE: 'papi_quiz_highscore',
  VOICE_RATE: 'papi_voice_rate',
  VOICE_ACCENT: 'papi_voice_accent',
  STREAK: 'papi_streak_days',
  LAST_LOGIN: 'papi_last_login_date'
};

const state = {
  currentTab: 'chat',
  theme: safeStorage.getItem(STORAGE_KEYS.THEME) || 'dark',
  apiKey: safeStorage.getItem(STORAGE_KEYS.API_KEY) || '',
  apiProvider: safeStorage.getItem(STORAGE_KEYS.API_PROVIDER) || 'gemini',
  voiceRate: parseFloat(safeStorage.getItem(STORAGE_KEYS.VOICE_RATE)) || 1.0,
  voiceAccent: safeStorage.getItem(STORAGE_KEYS.VOICE_ACCENT) || 'en-US',
  starredPhrases: (() => {
    try {
      return JSON.parse(safeStorage.getItem(STORAGE_KEYS.FAVORITES) || '[]');
    } catch (e) {
      return [];
    }
  })(),
  chatHistory: [],
  isRecording: false,
  recognition: null,
  currentCategory: 'all',
  searchQuery: '',
  // Quiz state
  quizCurrentIndex: 0,
  quizScore: 0,
  quizStreak: 0,
  quizAnswered: false,
  // Streak tracker
  streakDays: parseInt(safeStorage.getItem(STORAGE_KEYS.STREAK) || '3', 10)
};

// ==========================================================================
// 2. Synthesized Audio Engine (Web Audio API & Speech Synthesis)
// ==========================================================================
let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      audioCtx = new AudioContext();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Gentle sound effects using Web Audio API (zero external assets needed)
const SoundEffects = {
  playSuccess() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'triangle';
      osc2.type = 'sine';
      
      // Melody: C5 -> E5 -> G5
      osc1.frequency.setValueAtTime(523.25, now);
      osc1.frequency.setValueAtTime(659.25, now + 0.1);
      osc1.frequency.setValueAtTime(783.99, now + 0.2);
      
      osc2.frequency.setValueAtTime(1046.5, now + 0.2);
      
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start(now);
      osc2.start(now + 0.2);
      osc1.stop(now + 0.5);
      osc2.stop(now + 0.5);
    } catch (e) {
      console.warn('Audio synthesis note:', e);
    }
  },

  playError() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(180, now + 0.25);
      
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Audio synthesis note:', e);
    }
  },

  playPop() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {
      console.warn('Audio synthesis note:', e);
    }
  }
};

// Web Speech Synthesis (Text-to-Speech)
const TTSEngine = {
  voices: [],

  init() {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        try {
          this.voices = window.speechSynthesis.getVoices().filter(v => v && v.lang && v.lang.startsWith('en'));
          this.populateVoiceSelect();
        } catch (e) {
          console.warn('TTS voice load warning:', e);
        }
      };
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  },

  populateVoiceSelect() {
    const select = document.getElementById('voice-accent-select');
    if (!select) return;
    select.innerHTML = '';

    const defaultOptions = [
      { code: 'en-US', label: 'US English (አሜሪካዊ ለዛ)' },
      { code: 'en-GB', label: 'British English (ብሪታንያዊ ለዛ)' },
      { code: 'en-AU', label: 'Australian English (አውስትራሊያዊ ለዛ)' }
    ];

    defaultOptions.forEach(opt => {
      const optionEl = document.createElement('option');
      optionEl.value = opt.code;
      optionEl.textContent = opt.label;
      if (opt.code === state.voiceAccent) optionEl.selected = true;
      select.appendChild(optionEl);
    });
  },

  speak(text, buttonEl = null) {
    if (!('speechSynthesis' in window)) {
      alert('ይቅርታ! የእርስዎ ብሮውዘር የድምፅ ንባብ (Speech Synthesis) አይደግፍም።');
      return;
    }

    window.speechSynthesis.cancel(); // Cancel any ongoing speech

    const cleanText = text.replace(/[*_#`]/g, '').trim();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = state.voiceRate;
    utterance.lang = state.voiceAccent;

    // Pick best matching English voice
    if (this.voices.length > 0) {
      const matched = this.voices.find(v => v.lang === state.voiceAccent) || this.voices[0];
      if (matched) utterance.voice = matched;
    }

    if (buttonEl) {
      buttonEl.classList.add('playing');
      utterance.onend = () => buttonEl.classList.remove('playing');
      utterance.onerror = () => buttonEl.classList.remove('playing');
    }

    window.speechSynthesis.speak(utterance);
  }
};

// Web Speech Recognition (Speech-to-Text)
const STTEngine = {
  init() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      state.isRecording = true;
      const micBtn = document.getElementById('mic-btn');
      if (micBtn) micBtn.classList.add('recording');
      const input = document.getElementById('chat-input');
      if (input) input.placeholder = 'እየሰማሁ ነው... Speak now in English...';
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      const input = document.getElementById('chat-input');
      if (input) {
        input.value = transcript;
        input.focus();
      }
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition error:', event.error);
      this.stop();
    };

    recognition.onend = () => {
      this.stop();
    };

    state.recognition = recognition;
  },

  toggle() {
    if (!state.recognition) {
      alert('የእርስዎ ብሮውዘር ማይክሮፎን በቀጥታ ማንበብ አልደገፈም (Web Speech Recognition is not supported). በምትኩ በፅሁፍ ይተይቡ!');
      return;
    }

    if (state.isRecording) {
      this.stop();
    } else {
      try {
        state.recognition.start();
      } catch (err) {
        console.error(err);
      }
    }
  },

  stop() {
    state.isRecording = false;
    const micBtn = document.getElementById('mic-btn');
    if (micBtn) micBtn.classList.remove('recording');
    const input = document.getElementById('chat-input');
    if (input) input.placeholder = 'በእንግሊዝኛ ወይም በአማርኛ ይጠይቁ... Type in English or Amharic';
  }
};

// ==========================================================================
// 3. Database: Curated Flashcards & Phrases for Amharic Speakers
// ==========================================================================
const PHRASES_DATA = [
  // Basics
  {
    id: 'ph-1',
    category: 'basics',
    categoryAm: 'መሰረታዊ',
    english: 'How have you been doing lately?',
    amharic: 'ሰሞኑን እንዴት ነህ? / እንዴት አሳለፍክ?',
    phonetic: 'ሃው ሃቭ ዩ ቢን ዱዪንግ ሌትሊ?',
    example: 'Great to see you! How have you been doing lately? (አንተን በማየቴ ደስ ብሎኛል! ሰሞኑን እንዴት ነህ?)'
  },
  {
    id: 'ph-2',
    category: 'basics',
    categoryAm: 'መሰረታዊ',
    english: 'Could you please speak a bit slower?',
    amharic: 'እባክዎን ትንሽ ቀስ ብለው ሊያናግሩኝ ይችላሉ?',
    phonetic: 'ኩድ ዩ ፕሊዝ ስፒክ ኤ ቢት ስሎወር?',
    example: 'I am still practicing my English, could you please speak a bit slower?'
  },
  {
    id: 'ph-3',
    category: 'basics',
    categoryAm: 'መሰረታዊ',
    english: 'It was very nice meeting you!',
    amharic: 'አንተን / እርሶን በማግኘቴ በጣም ደስ ብሎኛል!',
    phonetic: 'ኢት ዋዝ ቬሪ ናይስ ሚቲንግ ዩ!',
    example: 'Thank you for the conversation. It was very nice meeting you!'
  },
  {
    id: 'ph-4',
    category: 'basics',
    categoryAm: 'መሰረታዊ',
    english: 'I completely agree with you.',
    amharic: 'ሀሳብህ ከእኔ ጋር ሙሉ በሙሉ ይስማማል።',
    phonetic: 'አይ ኮምፕሊትሊ አግሪ ዊዝ ዩ።',
    example: '⚠️ ማስታወሻ: "I am agree" አንበል! "I agree" ትክክለኛ አገላለጽ ነው።'
  },
  {
    id: 'ph-5',
    category: 'basics',
    categoryAm: 'መሰረታዊ',
    english: 'What does this word mean?',
    amharic: 'ይህ ቃል ትርጉሙ ምንድን ነው?',
    phonetic: 'ዋት ዳዝ ዚስ ወርድ ሚን?',
    example: 'I have never heard that expression, what does this word mean?'
  },

  // Restaurant & Shopping
  {
    id: 'ph-6',
    category: 'restaurant',
    categoryAm: 'ምግብ ቤት እና ገበያ',
    english: 'Could I get the check, please?',
    amharic: 'እባክዎን ሂሳቡን ሊያመጡልኝ ይችላሉ? (ካፌ/ሬስቶራንት)',
    phonetic: 'ኩድ አይ ጌት ዘ ቼክ, ፕሊዝ?',
    example: 'We are done eating. Could I get the check, please?'
  },
  {
    id: 'ph-7',
    category: 'restaurant',
    categoryAm: 'ምግብ ቤት እና ገበያ',
    english: 'I would like a medium-roast black coffee.',
    amharic: 'መካከለኛ የተጠበሰ ጥቁር ቡና እፈልግ ነበር።',
    phonetic: 'አይ ውድ ላይክ ኤ ሚዲየም-ሮስት ብላክ ኮፊ።',
    example: 'Good morning! I would like a medium-roast black coffee with no sugar.'
  },
  {
    id: 'ph-8',
    category: 'restaurant',
    categoryAm: 'ምግብ ቤት እና ገበያ',
    english: 'Is this table available or reserved?',
    amharic: 'ይህ ጠረጴዛ ነፃ ነው ወይስ ተይዟል?',
    phonetic: 'ኢዝ ዚስ ቴብል አቬይለብል ኦር ሪዘርቭድ?',
    example: 'Excuse me waiter, is this table available or reserved?'
  },
  {
    id: 'ph-9',
    category: 'restaurant',
    categoryAm: 'ምግብ ቤት እና ገበያ',
    english: 'Can I pay by card or only cash?',
    amharic: 'በካርድ መክፈል እችላለሁ ወይስ በጥሬ ገንዘብ ብቻ ነው?',
    phonetic: 'ካን አይ ፔይ ባይ ካርድ ኦር ኦንሊ ካሽ?',
    example: 'Before I order, can I pay by card or only cash?'
  },
  {
    id: 'ph-10',
    category: 'restaurant',
    categoryAm: 'ምግብ ቤት እና ገበያ',
    english: 'Do you offer any discounts for students?',
    amharic: 'ለተማሪዎች የሚሰጡት ቅናሽ አለዎት?',
    phonetic: 'ዱ ዩ ኦፈር ኤኒ ዲዝካውንትስ ፎር ስቱደንትስ?',
    example: 'I have my student ID with me, do you offer any discounts?'
  },

  // Travel & Directions
  {
    id: 'ph-11',
    category: 'travel',
    categoryAm: 'ጉዞ እና አቅጣጫ',
    english: 'Excuse me, how can I get to the airport?',
    amharic: 'ይቅርታ፣ ወደ ኤርፖርት እንዴት መድረስ እችላለሁ?',
    phonetic: 'ኤክስኪውዝ ሚ፣ ሃው ካን አይ ጌት ቱ ዘ ኤርፖርት?',
    example: 'Excuse me, how can I get to Bole International Airport from here?'
  },
  {
    id: 'ph-12',
    category: 'travel',
    categoryAm: 'ጉዞ እና አቅጣጫ',
    english: 'Could you drop me off right at the corner?',
    amharic: 'እባክዎን እዚያ ጥግ ጋ ሊያወርዱኝ ይችላሉ? (ለታክሲ ሹፌር)',
    phonetic: 'ኩድ ዩ ድሮፕ ሚ ኦፍ ራይት አት ዘ ኮርነር?',
    example: 'I see my office building now, could you drop me off right at the corner?'
  },
  {
    id: 'ph-13',
    category: 'travel',
    categoryAm: 'ጉዞ እና አቅጣጫ',
    english: 'Is it within walking distance?',
    amharic: 'በእግር የሚያደርስ እርቀት ነው?',
    phonetic: 'ኢዝ ኢት ዊዚን ዎኪንግ ዲስታንስ?',
    example: 'Is the museum far, or is it within walking distance?'
  },
  {
    id: 'ph-14',
    category: 'travel',
    categoryAm: 'ጉዞ እና አቅጣጫ',
    english: 'Where is the baggage claim area?',
    amharic: 'የሻንጣ መቀበያው ቦታ የት ጋ ነው ያለው?',
    phonetic: 'ዌር ኢዝ ዘ ባጌጅ ክሌይም ኤሪያ?',
    example: 'My flight just landed, where is the baggage claim area?'
  },

  // Career & Job Interviews
  {
    id: 'ph-15',
    category: 'career',
    categoryAm: 'ስራ እና ቃለ መጠይቅ',
    english: 'I have five years of hands-on experience.',
    amharic: 'የአምስት አመታት የተግባር ስራ ልምድ አለኝ።',
    phonetic: 'አይ ሃቭ ፋይቭ ይርስ ኦፍ ሃንድስ-ኦን ኤክስፒርየንስ።',
    example: 'In my previous position, I developed five years of hands-on experience.'
  },
  {
    id: 'ph-16',
    category: 'career',
    categoryAm: 'ስራ እና ቃለ መጠይቅ',
    english: 'My biggest strength is problem-solving under pressure.',
    amharic: 'ዋነኛው ጠንካራ ጎኔ በስራ ጫና ውስጥ ችግሮችን በፍጥነት መፍታት ነው።',
    phonetic: 'ማይ ቢገስት ስትሬንግዝ ኢዝ ፕሮብለም-ሶልቪንግ አንደር ፕሬሸር።',
    example: 'When unexpected challenges arise, my biggest strength is problem-solving.'
  },
  {
    id: 'ph-17',
    category: 'career',
    categoryAm: 'ስራ እና ቃለ መጠይቅ',
    english: 'I am eager to contribute to your team.',
    amharic: 'የድርጅታችሁን የስራ ቡድን ለማገልገል እና ውጤታማ ለማድረግ ከፍተኛ ጉጉት አለኝ።',
    phonetic: 'አይ አም ኢገር ቱ ኮንትሪብዩት ቱ ዩር ቲም።',
    example: 'Given my background, I am eager to contribute to your team.'
  },
  {
    id: 'ph-18',
    category: 'career',
    categoryAm: 'ስራ እና ቃለ መጠይቅ',
    english: 'Could you tell me more about this role?',
    amharic: 'ስለዚህ የስራ መደብ ተጨማሪ ዝርዝር ሊነግሩኝ ይችላሉ?',
    phonetic: 'ኩድ ዩ ቴል ሚ ሞር አባውት ዚስ ሮል?',
    example: 'Towards the end of the interview: Could you tell me more about this role?'
  },

  // Emergency & Health
  {
    id: 'ph-19',
    category: 'emergency',
    categoryAm: 'ጤና እና ድንገተኛ',
    english: 'I need to see a doctor immediately.',
    amharic: 'በአስቸኳይ ዶክተር ማየት / መገናኘት አለብኝ።',
    phonetic: 'አይ ኒድ ቱ ሲ ኤ ዶክተር ኢሚዲየትሊ።',
    example: 'I am experiencing severe chest pain, I need to see a doctor immediately.'
  },
  {
    id: 'ph-20',
    category: 'emergency',
    categoryAm: 'ጤና እና ድንገተኛ',
    english: 'I am allergic to penicillin.',
    amharic: 'ፔኒሲሊን መድኃኒት አለርጂክ አለብኝ።',
    phonetic: 'አይ አም አሌርጂክ ቱ ፔኒሲሊን።',
    example: 'Before you prescribe any medication, please note I am allergic to penicillin.'
  }
];

// ==========================================================================
// 4. Database: Comprehensive Quiz Arena Questions for Amharic Learners
// ==========================================================================
const QUIZ_QUESTIONS = [
  {
    id: 'q-1',
    category: 'Grammar Trap',
    questionEn: 'I ______ with your suggestion. It makes a lot of sense.',
    contextAm: 'በአማርኛ "እስማማለሁ" ስንል በእንግሊዝኛ ትክክለኛው አጠቃቀም የትኛው ነው?',
    hintAm: 'በአማርኛ "እኔ እስማማለሁ" ወደ እንግሊዝኛ ቀጥታ ሲተረጎም "I am agree" የሚለው የተለመደ ስህተት እንዳይሆን ተጠንቀቁ!',
    options: [
      'am agree',
      'agree',
      'agreed to be',
      'am agreeing'
    ],
    correctIndex: 1,
    explanationAm: 'ትክክለኛው መልስ "agree" ነው። በአማርኛ "እኔ እስማማለሁ" ስንል ብዙ ኢትዮጵያውያን "I am agree" ይላሉ፤ ነገር ግን "agree" ራሱ ግስ (Verb) ስለሆነ "am" አያስፈልገውም። ትክክለኛው "I agree with you" ነው።'
  },
  {
    id: 'q-2',
    category: 'Prepositions',
    questionEn: 'She has been married ______ an engineer for ten years.',
    contextAm: '"ተጋብታለች / አግብቷል" ሲባል ከየትኛው መስተዋድድ (preposition) ጋር አብሮ ይገባል?',
    hintAm: 'በአማርኛ "ከእርሱ ጋር ተጋባች" ስለምንል "with" እንዳይመስልዎት!',
    options: [
      'with',
      'to',
      'by',
      'for'
    ],
    correctIndex: 1,
    explanationAm: 'ትክክለኛው መልስ "to" ነው። በእንግሊዝኛ ቋንቋ "married to someone" ይባላል እንጂ "married with" አይባልም። ለምሳሌ: "He is married to Helen."'
  },
  {
    id: 'q-3',
    category: 'Common Confusion',
    questionEn: 'Could you please ______ me twenty dollars until tomorrow?',
    contextAm: 'ገንዘብ ለጊዜው "አበድረኝ" ስንል የምንጠቀመው ቃል የትኛው ነው?',
    hintAm: '"መበደር" (Borrow) እና "ማበደር" (Lend) ልዩነት አላቸው።',
    options: [
      'borrow',
      'lend',
      'rent',
      'lease'
    ],
    correctIndex: 1,
    explanationAm: 'ትክክለኛው መልስ "lend" (ማበደር) ነው። "Lend me money" ማለት "ገንዘብ አበድረኝ" ማለት ሲሆን፤ "Can I borrow?" ማለት ደግሞ "ልበደር?" ማለት ነው። ሌላ ሰው እንዲያበድረን ስንጠይቅ "Could you lend me..." እንላለን።'
  },
  {
    id: 'q-4',
    category: 'Past Tense Rules',
    questionEn: 'I searched everywhere, but I didn\'t ______ my keys.',
    contextAm: '"Didn\'t" ከገባ በኋላ የሚመጣው ግስ (verb) ቅርጽ ምን መሆን አለበት?',
    hintAm: '"Didn\'t" ቀድሞውኑ የሃላፊ ጊዜ (Past tense) ስለሚያሳይ ቀጣዩ ግስ ወደ መደበኛ መልክ (Base form) ይመለሳል።',
    options: [
      'found',
      'find',
      'finded',
      'finding'
    ],
    correctIndex: 1,
    explanationAm: 'ትክክለኛው መልስ "find" ነው። በእንግሊዝኛ ሰዋሰው "did" ወይም "didn\'t" ከተጠቀሙ በኋላ ግሱ ሁልጊዜ የመጀመሪያው መደበኛ ቅርጽ (Base Form) መሆን አለበት። "I didn\'t saw" ወይም "I didn\'t found" ማለት ስህተት ነው፤ ትክክለኛው "I didn\'t find" ነው።'
  },
  {
    id: 'q-5',
    category: 'Time Prepositions',
    questionEn: 'Dawit has lived in Addis Ababa ______ six years.',
    contextAm: 'የአንድን ድርጊት ቆይታ (Duration of time) ለመግለጽ የትኛው ቃል ያገለግላል?',
    hintAm: 'ለተወሰነ የጊዜ ቆይታ (ቆጠራ) "For"፤ ክስተቱ ለጀመረበት የተወሰነ ነጥብ ደግሞ "Since" ያገለግላል።',
    options: [
      'since',
      'for',
      'from',
      'during'
    ],
    correctIndex: 1,
    explanationAm: 'ትክክለኛው መልስ "for" ነው። "For six years" (ለስድስት አመታት) አጠቃላይ የጊዜ ቆይታን ያሳያል። "Since" የሚያገለግለው መነሻ አመትን ለመጥቀስ ብቻ ነው (ለምሳሌ: "Since 2018")።'
  },
  {
    id: 'q-6',
    category: 'Subject-Verb Agreement',
    questionEn: 'Neither of the students ______ ready for the final exam.',
    contextAm: '"Neither of..." ሲባል ግሱ ነጠላ (Singular) ወይስ ብዙ (Plural) ይሆናል?',
    hintAm: '"Neither" ሁለቱንም የሚያጠቃልል ነጠላ (singular) ፅንሰ ሀሳብ ነው።',
    options: [
      'were',
      'is',
      'are',
      'have been'
    ],
    correctIndex: 1,
    explanationAm: 'ትክክለኛው መልስ "is" ነው። "Neither of the..." የሚለው ሀረግ ሁልጊዜ እንደ ነጠላ (singular subject) ስለሚቆጠር "is" ወይም "was" ይወስዳል።'
  },
  {
    id: 'q-7',
    category: 'Polite Expressions',
    questionEn: '______ you like some traditional freshly brewed Ethiopian coffee?',
    contextAm: 'ለእንግዳ በትህትና እና በአክብሮት ቡና ለማቅረብ የምንጠቀመው ምርጥ አገላለጽ የትኛው ነው?',
    hintAm: 'ትህትና የተሞላበት ግብዣ (Polite Offer) ለማድረግ የሚጠቅመውን ረዳት ግስ ይምረጡ።',
    options: [
      'Do',
      'Would',
      'Are',
      'Can'
    ],
    correctIndex: 1,
    explanationAm: 'ትክክለኛው መልስ "Would" ነው። "Would you like...?" በጣም የተለመደና ጨዋነት የተሞላበት የእንግዳ ግብዣ ጥያቄ ነው።'
  },
  {
    id: 'q-8',
    category: 'Idiomatic Phrases',
    questionEn: 'I am really looking forward ______ you at the conference next week.',
    contextAm: '"በጉጉት እጠብቃለሁ" (Look forward to) ከሚለው ሀረግ በኋላ ግሱ ምን አይነት ቅርጽ ይይዛል?',
    hintAm: 'ይህ በጣም አስቸጋሪ ጥያቄ ነው! ከ"to" በኋላ -ing ቅጥያ የሚወስዱ ጥቂት ልዩ ሀረጎች አሉ።',
    options: [
      'to meet',
      'to meeting',
      'for meeting',
      'meeting'
    ],
    correctIndex: 1,
    explanationAm: 'ትክክለኛው መልስ "to meeting" ነው። "Look forward to" በሚለው ሀረግ ውስጥ "to" እንደ መስተዋድድ (preposition) ስለሚያገለግል ከእርሱ በኋላ የሚመጣው ግስ የ-ing ቅርጽ (gerund) መውሰድ አለበት። "I look forward to meeting you" ትክክለኛ ነው።'
  }
];

// ==========================================================================
// 5. Intelligent NLP & Papi AI Fallback Knowledge Engine
// ==========================================================================
const PapiAIEngine = {
  // Comprehensive irregular past tense dictionary
  pastTenseMap: {
    'go': { past: 'went', am: 'ሄደ (go ➔ went)', ex: 'I went to the market yesterday.' },
    'eat': { past: 'ate', am: 'በላ (eat ➔ ate)', ex: 'We ate delicious dinner together.' },
    'see': { past: 'saw', am: 'አየ (see ➔ saw)', ex: 'I saw my teacher at the bookstore.' },
    'buy': { past: 'bought', am: 'ገዛ (buy ➔ bought)', ex: 'She bought a new laptop last week.' },
    'come': { past: 'came', am: 'መጣ (come ➔ came)', ex: 'They came to visit us yesterday.' },
    'take': { past: 'took', am: 'ወሰደ (take ➔ took)', ex: 'He took a taxi to the airport.' },
    'write': { past: 'wrote', am: 'ፃፈ (write ➔ wrote)', ex: 'I wrote an email to my manager.' },
    'speak': { past: 'spoke', am: 'ተናገረ (speak ➔ spoke)', ex: 'We spoke in English for one hour.' },
    'sleep': { past: 'slept', am: 'ተኛ (sleep ➔ slept)', ex: 'I slept for eight hours last night.' },
    'drink': { past: 'drank', am: 'ጠጣ (drink ➔ drank)', ex: 'He drank a cup of fresh coffee.' },
    'know': { past: 'knew', am: 'አወቀ (know ➔ knew)', ex: 'I already knew the correct answer.' },
    'make': { past: 'made', am: 'ሰራ (make ➔ made)', ex: 'She made a wonderful traditional dish.' },
    'give': { past: 'gave', am: 'ሰጠ (give ➔ gave)', ex: 'He gave me helpful career advice.' },
    'find': { past: 'found', am: 'አገኘ (find ➔ found)', ex: 'I found my missing house keys.' },
    'think': { past: 'thought', am: 'አሰበ (think ➔ thought)', ex: 'I thought about your recommendation.' },
    'bring': { past: 'brought', am: 'አመጣ (bring ➔ brought)', ex: 'She brought traditional gifts.' },
    'run': { past: 'ran', am: 'ሮጠ (run ➔ ran)', ex: 'He ran fast to catch the city bus.' },
    'drive': { past: 'drove', am: 'ነዳ (drive ➔ drove)', ex: 'We drove from Addis to Hawassa.' },
    'read': { past: 'read (ድምፁ "ሬድ")', am: 'አነበበ (read ➔ read)', ex: 'I read an insightful book.' },
    'meet': { past: 'met', am: 'ተገናኘ (meet ➔ met)', ex: 'We met at the coffee shop.' },
    'pay': { past: 'paid', am: 'ከፈለ (pay ➔ paid)', ex: 'I paid the restaurant bill in cash.' },
    'choose': { past: 'chose', am: 'መረጠ (choose ➔ chose)', ex: 'She chose the best learning program.' },
    'break': { past: 'broke', am: 'ሰበረ (break ➔ broke)', ex: 'The glass broke into small pieces.' },
    'build': { past: 'built', am: 'ገነባ (build ➔ built)', ex: 'They built a modern high school.' },
    'teach': { past: 'taught', am: 'አስተማረ (teach ➔ taught)', ex: 'The instructor taught us English grammar.' },
    'learn': { past: 'learned / learnt', am: 'ተማረ (learn ➔ learned)', ex: 'I learned ten new English words today.' },
    'tell': { past: 'told', am: 'ነገረ (tell ➔ told)', ex: 'She told me an inspiring story.' },
    'leave': { past: 'left', am: 'ለቆ ሄደ (leave ➔ left)', ex: 'The flight left on schedule.' },
    'feel': { past: 'felt', am: 'ተሰማው (feel ➔ felt)', ex: 'I felt confident during the presentation.' },
    'hear': { past: 'heard', am: 'ሰማ (hear ➔ heard)', ex: 'I heard good news this morning.' }
  },

  // Common grammatical error detectors tailored for Habesha learners
  detectGrammarIssues(text) {
    const lower = text.toLowerCase().trim();

    if (/\bi\s+am\s+agree\b/.test(lower)) {
      return {
        hasError: true,
        corrected: text.replace(/\b(i|I)\s+am\s+agree\b/g, 'I agree'),
        explanation: 'በአማርኛ "እኔ እስማማለሁ" ስለምንል "I am agree" ማለት የተለመደ ስህተት ነው። ነገር ግን "agree" ራሱ ግስ (verb) ስለሆነ "am" አያስፈልገውም። "I agree" ወይም "I agree with you" ይበሉ።',
        phonetic: 'አይ አግሪ ዊዝ ዩ',
        followupEn: 'Do you usually agree with your friends when making group plans?',
        followupAm: 'ከጓደኞችህ ጋር እቅድ ስታወጣ በአብዛኛው ትስማማለህ?'
      };
    }

    if (/\b(he|she|it)\s+don'?t\b/.test(lower)) {
      return {
        hasError: true,
        corrected: text.replace(/\b(he|she|it)\s+don'?t\b/gi, (match) => {
          const subj = match.split(/\s+/)[0];
          return `${subj} doesn't`;
        }),
        explanation: 'ለነጠላ ሶስተኛ መደብ (He, She, It) ሁልጊዜ "doesn\'t" እንጂ "don\'t" አንጠቀምም። "Don\'t" የሚያገለግለው ለ I, You, We, They ብቻ ነው።',
        phonetic: 'ዳዝንት (Doesn\'t)',
        followupEn: 'What is something she doesn\'t like to eat?',
        followupAm: 'እርሷ መብላት የማትወደው ነገር ምንድን ነው?'
      };
    }

    if (/\bdidn'?t\s+(saw|went|ate|knew|bought|took)\b/.test(lower)) {
      const pastToBaseMap = { saw: 'see', went: 'go', ate: 'eat', knew: 'know', bought: 'buy', took: 'take' };
      const corrected = text.replace(/\bdidn'?t\s+(saw|went|ate|knew|bought|took)\b/gi, (match, verb) => {
        return `didn't ${pastToBaseMap[verb.toLowerCase()] || verb}`;
      });
      return {
        hasError: true,
        corrected,
        explanation: '"Didn\'t" አስቀድሞ የሃላፊ ጊዜን (past tense) ስለሚያሳይ ቀጣዩ ግስ ወደ መደበኛ የመጀመሪያው ቅርጽ (base form) መመለስ አለበት። ለምሳሌ: "didn\'t see" እንጂ "didn\'t saw" አንበል!',
        phonetic: 'ዲድንት ሲ / ዲድንት ጎ',
        followupEn: 'What didn\'t you do yesterday?',
        followupAm: 'ትላንት ያላደረግከው ነገር ምን ነበር?'
      };
    }

    if (/\bmarried\s+with\b/.test(lower)) {
      return {
        hasError: true,
        corrected: text.replace(/\bmarried\s+with\b/gi, 'married to'),
        explanation: 'በእንግሊዝኛ "ተጋብቷል / አግብቷል" ሲባል "married with" አይባልም፤ "married to" ነው የሚባለው።',
        phonetic: 'ማሪድ ቱ (Married to)',
        followupEn: 'How long have they been married?',
        followupAm: 'ከተጋቡ ምን ያህል ጊዜ ሆናቸው?'
      };
    }

    if (/\bborrow\s+me\b/.test(lower)) {
      return {
        hasError: true,
        corrected: text.replace(/\bborrow\s+me\b/gi, 'lend me'),
        explanation: '"Borrow" ማለት መበደር (መውሰድ) ሲሆን "Lend" ማለት ደግሞ ማበደር (መስጠት) ነው። ሌላ ሰው እንዲያበድርህ ስትጠይቅ "Can you lend me...?" ወይም "Can I borrow...?" ማለት አለብህ።',
        phonetic: 'ሌንድ ሚ (Lend me)',
        followupEn: 'Can you lend me your favorite book for a week?',
        followupAm: 'የምትወደውን መጽሐፍ ለአንድ ሳምንት ልታበድረኝ ትችላለህ?'
      };
    }

    if (/\b(i|he|she)\s+(is|am)\s+student\b/.test(lower)) {
      return {
        hasError: true,
        corrected: text.replace(/\b(is|am)\s+student\b/gi, (m) => m.replace('student', 'a student')),
        explanation: 'በእንግሊዝኛ ሙያዎችንና ማንነቶችን ስንጠቅስ ነጠላ ከሆነ "a" ወይም "an" ያስፈልጋል። ስለዚህ "I am a student" እንላለን።',
        phonetic: 'አይ አም ኤ ስቱደንት',
        followupEn: 'What subject are you studying as a student?',
        followupAm: 'እንደ ተማሪነትህ ምን ትምህርት እያጠናህ ነው?'
      };
    }

    return null;
  },

  // Generates smart contextual response based on the user's specific question
  generateResponse(userMsg) {
    const raw = userMsg.trim();
    const lower = raw.toLowerCase();

    // 1. Check for specific grammar error patterns first
    const grammarCheck = this.detectGrammarIssues(raw);
    if (grammarCheck) {
      return {
        correctedText: grammarCheck.corrected,
        explanation: grammarCheck.explanation,
        phonetic: grammarCheck.phonetic,
        followupEn: grammarCheck.followupEn,
        followupAm: grammarCheck.followupAm
      };
    }

    // 2. Identity & About Papi
    if (/who\s+are\s+you|what\s+is\s+your\s+name|who\s+made\s+you|tell\s+me\s+about\s+yourself|ስምህ|ማን\s+ነህ|ራስህን/i.test(lower)) {
      return {
        correctedText: 'My name is Papi. I am your dedicated AI English tutor for Amharic speakers.',
        explanation: 'ስሜ ፓፒ ይባላል። ለኢትዮጵያውያን ተማሪዎች እንግሊዝኛን በቀላሉ፣ በሰዋሰው እርማት እና በአነባበብ ድምፅ ለማስተማር የተዘጋጀሁ የእርስዎ የግል ኤአይ አሰልጣኝ ነኝ።',
        phonetic: 'ማይ ኔም ኢዝ ፓፒ። አይ አም ዩር ዲዲኬትድ ኤአይ ኢንግሊሽ ቲዩተር።',
        followupEn: 'What is your name, and where in Ethiopia or abroad are you currently located?',
        followupAm: 'ስምህ ማን ይባላል? በአሁኑ ሰዓት የት ሀገር ወይም ከተማ ነው ያለኸው?'
      };
    }

    if (/where\s+are\s+you\s+from|where\s+do\s+you\s+live|የት\s+ነው\s+የምትኖረው|ከየት\s+መጣህ/i.test(lower)) {
      return {
        correctedText: 'I live directly in your browser, built to serve students in Addis Ababa and around the globe.',
        explanation: '"የት ነው የምትኖረው?" ለሚለው ጥያቄ "I live in..." (እኖራለሁ) የሚለውን አገላለጽ እንጠቀማለን። እኔ እዚሁ በስልክዎ ወይም በኮምፒውተርዎ ውስጥ አብሬዎት እገኛለሁ!',
        phonetic: 'አይ ሊቭ ዳይሬክትሊ ኢን ዩር ብሮውዘር።',
        followupEn: 'Do you live in Addis Ababa or another beautiful region?',
        followupAm: 'የምትኖረው በአዲስ አበባ ነው ወይስ በሌላ ውብ ክልል?'
      };
    }

    if (/how\s+old\s+are\s+you|እድሜህ|ስንት\s+አመትህ/i.test(lower)) {
      return {
        correctedText: 'I am a timeless AI teacher, always energized and ready to practice English with you!',
        explanation: 'የእድሜ ጥያቄ ሲጠየቅ "I am ... years old" እንላለን። ለምሳሌ: "I am 24 years old" (የ24 አመት ወጣት ነኝ)።',
        phonetic: 'አይ አም ኤ ታይምለስ ኤአይ ቲቸር።',
        followupEn: 'How old are you, if you do not mind me asking?',
        followupAm: 'የእድሜህ መጠን ስንት ነው? (ልጠይቅህ ከፈቀድክልኝ)'
      };
    }

    // 3. How are you / Well-being
    if (/how\s+are\s+you|how\s+r\s+u|how\s+do\s+you\s+do|how\s+is\s+it\s+going|እንዴት\s+ነህ|እንዴት\s+ነሽ|ደህና\s+ነህ|እንደምን\s+አለህ/i.test(lower)) {
      return {
        correctedText: 'I am doing wonderful, thank you for asking! How about you?',
        explanation: '"እንዴት ነህ?" ሲባል "I am fine" ብቻ ከማለት "I am doing great / wonderful, thank you for asking!" ማለት የበለጠ ማራኪ እና የተሟላ የእንግሊዝኛ አገላለጽ ነው።',
        phonetic: 'አይ አም ዱዪንግ ወንደርፉል፣ ቴንክ ዩ ፎር አስኪንግ! ሃው አባውት ዩ?',
        followupEn: 'How has your day been going so far?',
        followupAm: 'የዛሬው ውሎህ እስከ አሁን እንዴት እያለፈ ነው?'
      };
    }

    // 4. Good morning / afternoon / evening / night
    if (/good\s+morning|እንደምን\s+አደርክ|ደህና\s+አደርክ/i.test(lower)) {
      return {
        correctedText: 'Good morning! I wish you a very productive and blessed day ahead.',
        explanation: '"Good morning" ማለት "እንደምን አደርክ / አደራችሁ" ማለት ሲሆን እስከ ቀኑ 6:00 ሰዓት (12:00 PM) ድረስ ያገለግላል።',
        phonetic: 'ጉድ ሞርኒንግ! አይ ዊሽ ዩ ኤ ቬሪ ፕሮዳክቲቭ ዴይ።',
        followupEn: 'Did you have a good night of sleep and enjoy breakfast?',
        followupAm: 'ጥሩ እንቅልፍ ተኝተህ ቆንጆ ቁርስ በላህ?'
      };
    }

    if (/good\s+afternoon|እንደምን\s+ዋልክ|ደህና\s+ዋልክ/i.test(lower)) {
      return {
        correctedText: 'Good afternoon! How is your day proceeding so far?',
        explanation: '"Good afternoon" ማለት "እንደምን ዋልክ / ዋላችሁ" ማለት ሲሆን ከቀኑ 6:00 (12:00 PM) እስከ ምሽቱ 12:00 (6:00 PM) ድረስ ያገለግላል።',
        phonetic: 'ጉድ አፍተርኑን! ሃው ኢዝ ዩር ዴይ ፕሮሲዲንግ ሶ ፋር?',
        followupEn: 'Are you working, studying, or relaxing this afternoon?',
        followupAm: 'በዚህ ከሰዓት በኋላ ስራ ላይ ነህ፣ ትምህርት ወይስ እያረፍክ?'
      };
    }

    if (/good\s+night|sweet\s+dreams|ደህና\s+እደር|መልካም\s+ሌሊት/i.test(lower)) {
      return {
        correctedText: 'Good night! Have peaceful rest and sweet dreams.',
        explanation: '"Good night" የሚያገለግለው ለመተኛት ስንሰናበት ብቻ ነው። ገና ምሽት ላይ ስንገናኝ ሰላምታ ለመስጠት "Good evening" እንላለን።',
        phonetic: 'ጉድ ናይት! ሃቭ ፒስፉል ሬስት ኤንድ ስዊት ድሪምስ።',
        followupEn: 'What time do you usually wake up in the morning?',
        followupAm: 'በተለምዶ ጠዋት በስንት ሰዓት ነው ከእንቅልፍህ የምትነሳው?'
      };
    }

    // 5. Gratitude / Thanks
    if (/thank\s+you|thanks|አመሰግናለሁ|እግዚአብሔር\s+ይስጥልኝ/i.test(lower)) {
      return {
        correctedText: 'You are most welcome! It is truly my pleasure to support your English journey.',
        explanation: 'አንድ ሰው "Thank you" ሲለን መልሳችን "You are welcome!" (ምንም አይደል / የበኩሌ ነው) ወይም "My pleasure!" መሆን አለበት።',
        phonetic: 'ዩ አር ሞስት ዌልካም! ኢት ኢዝ ትሩሊ ማይ ፕሌዠር።',
        followupEn: 'Is there any other English phrase or question you would like to explore?',
        followupAm: 'ተጨማሪ ልታውቀው የምትፈልገው ሌላ የእንግሊዝኛ አባባል ወይም ጥያቄ አለ?'
      };
    }

    // 6. Goodbyes
    if (/bye|goodbye|see\s+you|ቻው|ደህና\s+ሁን|እንገናኝ/i.test(lower)) {
      return {
        correctedText: 'Goodbye! Take good care of yourself and see you soon.',
        explanation: 'ስንሰናበት "Goodbye"፣ "See you later!" (በኋላ እንገናኝ) ወይም "Take care!" (ደህና ሁን / ተጠንቀቅ) ማለት የተለመደ ነው።',
        phonetic: 'ጉድባይ! ቴክ ኬር ኦፍ ዩርሰልፍ ኤንድ ሲ ዩ ሱን።',
        followupEn: 'Will we practice together again tomorrow?',
        followupAm: 'ነገም በድጋሚ አብረን እንለማመዳለን አይደል?'
      };
    }

    // 7. Feelings / Emotional States
    if (/tired|exhausted|ደክሞኛል|ድካም/i.test(lower)) {
      return {
        correctedText: 'I feel very exhausted today, so I think I should get some rest.',
        explanation: 'ድካምን ስንገልጽ "I am tired" ወይም የበለጠ ሲበረታ "I am exhausted" (በጣም ደክሞኛል) ማለት እንችላለን።',
        phonetic: 'አይ ፊል ቬሪ ኤግዞስተድ ቱደይ።',
        followupEn: 'Did you have a busy workday or long hours of study?',
        followupAm: 'ዛሬ ብዙ የስራ ጫና ነበረብህ ወይስ የትምህርት ቆይታ?'
      };
    }

    if (/happy|excited|glad|ደስተኛ|ደስ\s+ብሎኛል/i.test(lower)) {
      return {
        correctedText: 'I am feeling very joyful and optimistic today!',
        explanation: 'ደስታን ስንገልጽ "I am happy"፣ "I am thrilled" (በጣም ተደስቻለሁ) ወይም "I am in a great mood" እንላለን።',
        phonetic: 'አይ አም ፊሊንግ ቬሪ ጆይፉል ኤንድ ኦፕቲሚስቲክ ቱደይ!',
        followupEn: 'What wonderful thing made you feel so happy today?',
        followupAm: 'ዛሬ እንዲህ ደስተኛ ያደረገህ አስደሳች ክስተት ምንድን ነው?'
      };
    }

    if (/hungry|starving|ርቦኛል|ራበኝ/i.test(lower)) {
      return {
        correctedText: 'I am starving! I would love to enjoy some fresh Ethiopian food.',
        explanation: '"ርቦኛል" ስንል "I am hungry" እንላለን፤ በጣም ሲርበን ደግሞ "I am starving!" ማለት እንችላለን።',
        phonetic: 'አይ አም ስታርቪንግ! አይ ውድ ላቭ ቱ ኢንጆይ ፍሬሽ ፉድ።',
        followupEn: 'What is your absolute favorite food to eat: Injera with Doro Wat or Tibs?',
        followupAm: 'የምትወደው ምርጥ ምግብ ምንድን ነው: ዶሮ ወጥ ወይስ ጥብስ?'
      };
    }

    // 8. Irregular Past Tense Queries (e.g. "past tense of go", "past of see", "የ go ሀላፊ ጊዜ")
    const pastMatch = lower.match(/(?:past\s+tense\s+of|past\s+of|ሀላፊ\s+ጊዜ\s+የ|የ\s*)(\w+)/i);
    const verbCandidate = pastMatch ? pastMatch[1] : null;
    if (verbCandidate && this.pastTenseMap[verbCandidate]) {
      const info = this.pastTenseMap[verbCandidate];
      return {
        correctedText: `The past tense of "${verbCandidate}" is "${info.past}".`,
        explanation: `የ "${verbCandidate}" ያለፈ ጊዜ (Past Tense) "${info.past}" ነው። ትርጉሙ፡ ${info.am}። ምሳሌ: "${info.ex}"`,
        phonetic: `ዘ ፓስት ቴንስ ኦፍ ${verbCandidate} ኢዝ ${info.past}።`,
        followupEn: `Can you create your own short sentence using the word "${info.past}"?`,
        followupAm: `"${info.past}" የሚለውን ቃል ተጠቅመህ የራስህን አጭር ዓረፍተ ነገር መፃፍ ትችላለህ?`
      };
    }

    // 9. Grammar Comparisons (Difference between X and Y)
    if (/difference\s+between|ልዩነት|ልዩነታቸው/i.test(lower)) {
      if (/make.*do|do.*make/i.test(lower)) {
        return {
          correctedText: 'The difference between "Make" and "Do" in English.',
          explanation: '"Make" አዲስ ነገር ስንፈጥር ወይም ስንሰራ ያገለግላል (Make coffee, Make a decision, Make money)። "Do" ደግሞ ድርጊትን ወይም ግዴታን ስናከናውን ያገለግላል (Do homework, Do your best, Do exercise)።',
          phonetic: 'ዘ ዲፈረንስ ቢትዊን ሜክ ኤንድ ዱ።',
          followupEn: 'Would you say "make homework" or "do homework"?',
          followupAm: '"make homework" ነው ወይስ "do homework" የሚባለው?'
        };
      }
      if (/borrow.*lend|lend.*borrow/i.test(lower)) {
        return {
          correctedText: 'Difference between "Borrow" (to take) and "Lend" (to give).',
          explanation: '"Borrow" ማለት መበደር (ገንዘብ ወይም እቃ ለጊዜው መውሰድ) ሲሆን "Lend" ማለት ደግሞ ማበደር (ለሌላ ሰው መስጠት) ነው። ምሳሌ: "Can I borrow your pen?" vs "Can you lend me ten dollars?"',
          phonetic: 'ቦሮው (መበደር) vs ሌንድ (ማበደር)።',
          followupEn: 'If you need money, do you ask a friend to lend you or borrow you?',
          followupAm: 'ገንዘብ ስትፈልግ ጓደኛህን "lend" ወይስ "borrow" እንዲያደርግህ ነው የምትጠይቀው?'
        };
      }
      if (/see.*look|look.*watch|see.*watch/i.test(lower)) {
        return {
          correctedText: 'Difference between See, Look, and Watch.',
          explanation: '1. "See" = በአይናችን ድንገት ማየት (I see a bird)። 2. "Look" = ትኩረት ሰጥተን ወደ አንድ አቅጣጫ ማየት (Look at this picture!)። 3. "Watch" = የሚንቀሳቀስ ነገርን ተከታትሎ ማየት (Watch a movie / football match)።',
          phonetic: 'ሲ (ማየት), ሉክ (መመልከት), ዋች (ተከታትሎ ማየት)።',
          followupEn: 'Do you say "I watch a movie" or "I see a movie"?',
          followupAm: '"watch a movie" ወይስ "look a movie" ነው የሚባለው?'
        };
      }
      if (/for.*since|since.*for/i.test(lower)) {
        return {
          correctedText: 'Difference between "For" (duration) and "Since" (starting point).',
          explanation: '"For" አጠቃላይ የጊዜ ቆይታን ያሳያል (For 3 years, For two hours)። "Since" ደግሞ ክስተቱ የተጀመረበትን ትክክለኛ መነሻ ቀን ወይም አመት ይጠቅሳል (Since 2020, Since yesterday morning)።',
          phonetic: 'ፎር (የቆይታ ጊዜ) vs ሲንስ (የመነሻ ነጥብ)።',
          followupEn: 'Have you lived in your town for five years, or since five years?',
          followupAm: 'የትኛው ትክክል ነው: "for five years" ወይስ "since five years"?'
        };
      }
    }

    // 10. Translation of Specific Words / Expressions
    if (/water|ውሃ/i.test(lower)) {
      return {
        correctedText: 'Could I please have a glass of fresh drinking water?',
        explanation: '"ውሃ መጠጣት እፈልጋለሁ" ስንል በትህትና "Could I please have a glass of water?" ማለት ይመረጣል።',
        phonetic: 'ኩድ አይ ፕሊዝ ሃቭ ኤ ግላስ ኦፍ ድሪንኪንግ ወተር?',
        followupEn: 'Do you prefer cold water or room temperature water?',
        followupAm: 'ቀዝቃዛ ውሃ ነው የምትወደው ወይስ ለብ ያለ?'
      };
    }

    if (/money|ገንዘብ/i.test(lower)) {
      return {
        correctedText: 'Money management is an essential life skill.',
        explanation: 'ገንዘብ በእንግሊዝኛ "Money" ይባላል። "How much money do you need?" (ምን ያህል ገንዘብ ያስፈልግሃል?)። ማስታወሻ: "Moneys" አይባልም፤ "Money" ነጠላም ብዙም ነው።',
        phonetic: 'መኒ ማኔጅመንት ኢዝ አን ኢሴንሻል ላይፍ ስኪል。',
        followupEn: 'Do you prefer paying for things with paper cash or mobile banking?',
        followupAm: 'በጥሬ ብር መክፈል ትመርጣለህ ወይስ በሞባይል ባንኪንግ?'
      };
    }

    if (/love|i\s+love\s+you|ፍቅር|እወድሻለሁ|እወድሃለሁ/i.test(lower)) {
      return {
        correctedText: 'I love you with all my heart and appreciate your kindness.',
        explanation: '"እወድሃለሁ / እወድሻለሁ" በእንግሊዝኛ "I love you" ይባላል። "ፍቅር" ደግሞ "Love" ነው። "I care about you deeply" ማለትም ትልቅ ፍቅርን ያሳያል።',
        phonetic: 'አይ ላቭ ዩ ዊዝ ኦል ማይ ሃርት።',
        followupEn: 'Who is the most supportive person in your life that you love?',
        followupAm: 'በህይወትህ ውስጥ በጣም የምትወደው እና የሚረዳህ ሰው ማን ነው?'
      };
    }

    if (/bathroom|toilet|restroom|መጸዳጃ|ሽንት\s*ቤት/i.test(lower)) {
      return {
        correctedText: 'Excuse me, could you please tell me where the restroom is?',
        explanation: 'መጸዳጃ ቤት መጠየቅ ሲፈልጉ በጨዋነት "Where is the restroom?" (በአሜሪካ) ወይም "Where is the toilet / washroom?" (በብሪታንያ) ይበሉ።',
        phonetic: 'ኤክስኪውዝ ሚ፣ ኩድ ዩ ፕሊዝ ቴል ሚ ዌር ዘ ሬስትሩም ኢዝ?',
        followupEn: 'Would you like to practice asking for directions to the lobby as well?',
        followupAm: 'ወደ ዋናው አዳራሽ የሚያደርሰውን አቅጣጫ መጠየቅም መለማመድ ትፈልጋለህ?'
      };
    }

    if (/cost|price|how\s+much|ዋጋው\s*ስንት/i.test(lower)) {
      return {
        correctedText: 'How much does this item cost, and do you accept digital payment?',
        explanation: 'ዋጋ ስንጠይቅ "How much is this?" ወይም "How much does it cost?" እንላለን።',
        phonetic: 'ሃው ማች ዳዝ ዚስ አይተም ኮስት?',
        followupEn: 'Do you enjoy bargaining for prices at the local market?',
        followupAm: 'በገበያ ውስጥ እቃ ስትገዛ ዋጋ መደራደር ያስደስትሃል?'
      };
    }

    if (/time|ሰዓት\s*ስንት/i.test(lower)) {
      return {
        correctedText: 'Excuse me, could you please tell me what time it is right now?',
        explanation: 'ሰዓት ስንጠይቅ "What time is it?" ወይም በትህትና "Could you tell me the time?" እንላለን።',
        phonetic: 'ኤክስኪውዝ ሚ፣ ኩድ ዩ ፕሊዝ ቴል ሚ ዋት ታይም ኢት ኢዝ?',
        followupEn: 'What is your most productive hour of the day?',
        followupAm: 'በቀኑ ውስጥ በጣም ውጤታማ የምትሆንበት ሰዓት መቼ ነው?'
      };
    }

    if (/weather|rain|sunny|አየር\s*ሁኔታ|ዝናብ/i.test(lower)) {
      return {
        correctedText: 'The weather today is very pleasant with a gentle breeze.',
        explanation: 'የአየር ሁኔታን ለመጠየቅ "How is the weather today?" እንላለን። መልስ ለመስጠት: "It is sunny" (ፀሀያማ ነው) ወይም "It is raining" (እየዘነበ ነው)።',
        phonetic: 'ዘ ዌዘር ቱደይ ኢዝ ቬሪ ፕሌዛንት።',
        followupEn: 'Do you prefer warm sunny days or rainy cool afternoons?',
        followupAm: 'ሞቃታማ ፀሀያማ ቀናትን ትመርጣለህ ወይስ ቀዝቃዛ የዝናብ አየር?'
      };
    }

    // 11. Dynamic Interrogative Questions (What, Where, When, Why, Who, How, Can, Do, Is)
    if (/^(what|where|when|why|who|how|can|could|do|does|did|is|are|will|would)\b/i.test(lower)) {
      // Clean and capitalize the user's question
      const cleanQ = raw.replace(/[?!.]+$/, '');
      const firstWord = cleanQ.split(/\s+/)[0].toLowerCase();

      let amHelp = '';
      if (firstWord === 'what') amHelp = '"What" የሚያገለግለው ነገሮችን፣ ፅንሰ ሀሳቦችን ወይም ድርጊቶችን (ምን እንደሆኑ) ለመጠየቅ ነው።';
      else if (firstWord === 'where') amHelp = '"Where" የሚያገለግለው ቦታንና አቅጣጫን (የት እንደሆነ) ለመጠየቅ ነው።';
      else if (firstWord === 'when') amHelp = '"When" የሚያገለግለው ጊዜንና ቀጠሮን (መቼ እንደሆነ) ለመጠየቅ ነው።';
      else if (firstWord === 'why') amHelp = '"Why" የሚያገለግለው ምክንያትና ማብራሪያን (ለምን እንደሆነ) ለመጠየቅ ነው። በ"Because..." ይመለሳል።';
      else if (firstWord === 'who') amHelp = '"Who" የሚያገለግለው ሰውን ወይም ማንነትን (ማን እንደሆነ) ለመጠየቅ ነው።';
      else if (firstWord === 'how') amHelp = '"How" የሚያገለግለው ሁኔታን፣ አሰራርን ወይም መጠንን (እንዴት እንደሆነ) ለመጠየቅ ነው።';
      else amHelp = 'ጥያቄ ሲጠይቁ ረዳት ግስ (Auxiliary verb) ከባለቤቱ (Subject) በፊት ይቀድማል።';

      return {
        correctedText: `${cleanQ.charAt(0).toUpperCase() + cleanQ.slice(1)}? Here is how to express that clearly.`,
        explanation: `ጥሩ እና ጠቃሚ ጥያቄ ነው! ${amHelp} እንዲህ አይነት ጥያቄዎችን በንግግር ውስጥ ደጋግሞ መጠቀም ንግግርዎን ያቀላጥፈዋል።`,
        phonetic: 'ኩዌስችን ኤክስፕሬሽን ኢን ኢንግሊሽ።',
        followupEn: 'Can you try rephrasing this question or giving an example answer?',
        followupAm: 'ይህንን ጥያቄ በሌላ አገላለጽ ለመጠየቅ ወይም የራስህን መልስ ለመስጠት ትሞክራለህ?'
      };
    }

    // 12. If user writes in Amharic (Translate & Respond dynamically)
    const hasAmharic = /[\u1200-\u137F]/.test(raw);
    if (hasAmharic) {
      return {
        correctedText: `You asked in Amharic: "${raw}". In English, you can say: "I would like to learn more about this topic."`,
        explanation: `የፃፉት የአማርኛ ሀሳብ ("${raw}") ወደ እንግሊዝኛ ሲተረጎም በግልጽ እና በተፈጥሯዊ አገላለጽ መዋቀር ይችላል። ተጨማሪ ዝርዝር በእንግሊዝኛ ይፃፉልኝ እና አብረን እንለማመድ!`,
        phonetic: 'አይ ውድ ላይክ ቱ ለርን ሞር አባውት ዚስ ቶፒክ።',
        followupEn: 'Can you try writing this idea using simple English words?',
        followupAm: 'ይህንን ሀሳብ በቀላል የእንግሊዝኛ ቃላት ለመፃፍ ትሞክራለህ?'
      };
    }

    // 13. Smart generic fallback tailored to the user's input words
    const words = raw.split(/\s+/);
    const firstFew = words.slice(0, 4).join(' ');
    return {
      correctedText: `Regarding "${firstFew}...", that is an interesting topic to discuss!`,
      explanation: `ጥሩ የውይይት ርዕስ ነው! ስለ "${raw}" ስናወራ የቃላት አመራረጥንና የሰዋሰው ትስስርን ማስተካከል ንግግርዎን የበለጠ የተሟላ ያደርገዋል።`,
      phonetic: 'ዛት ኢዝ አን ኢንተረስቲንግ ቶፒክ ቱ ዲስከስ!',
      followupEn: `Could you tell me a little bit more about what you mean by "${firstFew}"?`,
      followupAm: `ስለዚህ ጉዳይ ተጨማሪ ማብራሪያ በአጭር የእንግሊዝኛ ዓረፍተ ነገር ልትነግረኝ ትችላለህ?`
    };
  },

  // Calls Real Gemini API if user configured key
  async callGeminiAPI(apiKey, userPrompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const systemInstruction = `You are "Papi" (ፓፒ), a warm, encouraging, and expert AI English teacher dedicated to helping native Amharic speakers master everyday conversational English.
When the user sends a message in either English, Amharic, or mixed broken English, respond strictly in valid JSON format with the following keys:
{
  "correctedText": "The refined, natural, correct English expression answering or improving their question directly",
  "explanation": "Clear explanation in Amharic explaining the grammar, word choice, and common mistakes made by Habesha learners",
  "phonetic": "Amharic Ge'ez transliteration of the English pronunciation (e.g. ሃው አር ዩ?)",
  "followupEn": "An engaging follow-up practice question in English directly on the topic",
  "followupAm": "The Amharic translation/prompt for the follow-up question"
}
Ensure the Amharic is natural, fluent, and culturally sensitive. Return ONLY JSON.`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nUser input: "${userPrompt}"` }]
        }
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`API error (${response.status}): ${response.statusText}`);
    }

    const data = await response.json();
    const candidate = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!candidate) throw new Error('Empty response from AI service');
    return JSON.parse(candidate);
  }
};

// ==========================================================================
// 6. UI Renderers: Chat, Flashcards, Quiz, Lessons
// ==========================================================================

// Chat Controller
const ChatController = {
  init() {
    const form = document.getElementById('chat-form');
    const input = document.getElementById('chat-input');
    const clearBtn = document.getElementById('clear-chat-btn');
    const chips = document.querySelectorAll('.chip-btn');

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = input.value.trim();
        if (text) {
          this.sendMessage(text);
          input.value = '';
        }
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('የውይይት ታሪኩን ማጥፋት ይፈልጋሉ? (Clear chat history?)')) {
          const container = document.getElementById('chat-messages');
          if (container) container.innerHTML = '';
          this.addWelcomeMessage();
        }
      });
    }

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        if (prompt) {
          this.sendMessage(prompt);
        }
      });
    });

    this.addWelcomeMessage();
  },

  addWelcomeMessage() {
    const welcome = {
      sender: 'papi',
      time: this.getTime(),
      correctedText: 'Welcome to Papi English! I am your AI English coach.',
      explanation: 'እንኳን ወደ ፓፒ እንግሊዝኛ በደህና መጡ! እኔ የእርስዎ የግል የእንግሊዝኛ ቋንቋ አሰልጣኝ ነኝ። በእንግሊዝኛም ሆነ በአማርኛ የፈለጉትን ይጠይቁኝ፤ ሰዋሰውዎን እያረምኩ፣ ትክክለኛውን አነባበብ እና ትርጉም በግልጽ አስረዳዎታለሁ።',
      phonetic: 'ዌልካም ቱ ፓፒ ኢንግሊሽ! አይ አም ዩር ኤአይ ኢንግሊሽ ኮውች።',
      followupEn: 'What is your primary goal today? (Greetings, Job Interview, or Grammar Check?)',
      followupAm: 'የዛሬው ዋነኛ ግብዎ ምንድን ነው? (ሰላምታ፣ የስራ ቃለ-መጠይቅ፣ ወይስ ሰዋሰው?)'
    };
    this.renderPapiMessage(welcome);
  },

  getTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  },

  async sendMessage(userText) {
    // Render user message
    this.renderUserMessage(userText);
    SoundEffects.playPop();

    // Show typing indicator
    const typingId = this.showTypingIndicator();

    try {
      let aiResult = null;

      // Check if API key is present
      if (state.apiKey && state.apiKey.trim().length > 10) {
        try {
          aiResult = await PapiAIEngine.callGeminiAPI(state.apiKey, userText);
        } catch (apiErr) {
          console.warn('Direct API failed, switching to local offline engine:', apiErr);
          aiResult = PapiAIEngine.generateResponse(userText);
        }
      } else {
        // High fidelity local offline fallback engine
        // Add small realistic delay for natural feeling
        await new Promise(r => setTimeout(r, 650));
        aiResult = PapiAIEngine.generateResponse(userText);
      }

      this.removeTypingIndicator(typingId);
      this.renderPapiMessage({
        sender: 'papi',
        time: this.getTime(),
        ...aiResult
      });
      SoundEffects.playPop();
    } catch (err) {
      this.removeTypingIndicator(typingId);
      this.renderPapiMessage({
        sender: 'papi',
        time: this.getTime(),
        correctedText: 'Let us keep practicing together!',
        explanation: 'ጥሩ ጥረት ነው! በድጋሚ ሌላ ቃል ወይም ዓረፍተ ነገር ይሞክሩ።',
        phonetic: 'ሌት አስ ኪፕ ፕራክቲሲንግ ቱጌዘር!',
        followupEn: 'Can you write another simple sentence in English?',
        followupAm: 'ሌላ አጭር ዓረፍተ ነገር በእንግሊዝኛ መፃፍ ይችላሉ?'
      });
    }
  },

  renderUserMessage(text) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg user-msg';
    msgDiv.innerHTML = `
      <div class="msg-avatar">👤</div>
      <div class="msg-content-wrapper">
        <div class="msg-bubble">
          ${this.escapeHTML(text)}
        </div>
        <div class="msg-timestamp">${this.getTime()} • እርስዎ</div>
      </div>
    `;
    container.appendChild(msgDiv);
    this.scrollToBottom();
  },

  renderPapiMessage(data) {
    const container = document.getElementById('chat-messages');
    if (!container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = 'chat-msg papi-msg';

    const safeCorrected = this.escapeHTML(data.correctedText || '');
    const safeExplanation = this.escapeHTML(data.explanation || '');
    const safePhonetic = this.escapeHTML(data.phonetic || '');
    const safeFollowupEn = this.escapeHTML(data.followupEn || '');
    const safeFollowupAm = this.escapeHTML(data.followupAm || '');

    msgDiv.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="msg-content-wrapper" style="width: 100%;">
        <div class="msg-bubble">
          <div class="feedback-box">
            <!-- 1. Corrected English Sentence -->
            <div class="feedback-row">
              <div class="feedback-label label-corrected">
                <span>🎯 ትክክለኛ አገላለጽ (Corrected English)</span>
                <button class="speech-play-btn tts-btn" title="ድምፁን ያዳምጡ (Listen pronunciation)" data-text="${encodeURIComponent(data.correctedText || '')}">
                  🔊
                </button>
              </div>
              <div class="english-corrected-text">
                <span>${safeCorrected}</span>
              </div>
            </div>

            <!-- 2. Amharic Explanation -->
            <div class="feedback-row">
              <div class="feedback-label label-amharic">
                <span>📖 ትርጉም እና ማብራሪያ (Amharic Explanation)</span>
              </div>
              <div class="amharic-explanation-text">
                ${safeExplanation}
              </div>
            </div>

            <!-- 3. Phonetic Guide in Ge'ez -->
            <div class="feedback-row">
              <div class="feedback-label label-phonetics">
                <span>🗣️ የአነባበብ ድምፅ በግዕዝ (Phonetic Guide)</span>
              </div>
              <div class="phonetic-guide-text">
                <span>${safePhonetic}</span>
                <span style="font-size: 0.72rem; opacity: 0.8;">[ኢትዮ-ፎነቲክስ]</span>
              </div>
            </div>

            <!-- 4. Follow-up Practice Question -->
            <div class="followup-question-box">
              <div class="feedback-label label-question" style="margin-bottom: 0.2rem;">
                <span>💬 የቀጣይ ልምምድ ጥያቄ (Follow-up Challenge)</span>
                <button class="speech-play-btn tts-btn" title="ጥያቄውን ያዳምጡ" data-text="${encodeURIComponent(data.followupEn || '')}">
                  🔊
                </button>
              </div>
              <div class="followup-en">${safeFollowupEn}</div>
              <div class="followup-am">${safeFollowupAm}</div>
            </div>
          </div>
        </div>
        <div class="msg-timestamp">
          <span>${data.time || this.getTime()}</span> • <span>ፓፒ አስተማሪ (Papi AI)</span>
        </div>
      </div>
    `;

    container.appendChild(msgDiv);

    // Attach TTS listeners to speak buttons
    msgDiv.querySelectorAll('.tts-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const textToSpeak = decodeURIComponent(btn.getAttribute('data-text') || '');
        if (textToSpeak) {
          TTSEngine.speak(textToSpeak, btn);
        }
      });
    });

    this.scrollToBottom();
  },

  showTypingIndicator() {
    const container = document.getElementById('chat-messages');
    if (!container) return null;

    const id = 'typing-' + Date.now();
    const typingDiv = document.createElement('div');
    typingDiv.id = id;
    typingDiv.className = 'chat-msg papi-msg';
    typingDiv.innerHTML = `
      <div class="msg-avatar">🤖</div>
      <div class="msg-content-wrapper">
        <div class="msg-bubble" style="display: flex; align-items: center; gap: 6px; padding: 0.8rem 1rem;">
          <span style="font-size: 0.82rem; color: var(--accent-primary); font-weight: 600;">ፓፒ እያሰበ ነው...</span>
          <span class="typing-dot" style="display:inline-block; width:6px; height:6px; border-radius:50%; background:var(--accent-primary); animation: blink 1s infinite alternate;"></span>
        </div>
      </div>
    `;
    container.appendChild(typingDiv);
    this.scrollToBottom();
    return id;
  },

  removeTypingIndicator(id) {
    if (!id) return;
    const el = document.getElementById(id);
    if (el) el.remove();
  },

  scrollToBottom() {
    const container = document.getElementById('chat-messages');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  },

  escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
};

// Flashcards & Phrasebook Controller
const FlashcardsController = {
  init() {
    this.renderCards();
    this.attachEvents();
  },

  attachEvents() {
    // Category chips
    const chips = document.querySelectorAll('.filter-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        state.currentCategory = chip.getAttribute('data-category') || 'all';
        this.renderCards();
      });
    });

    // Search input
    const searchInput = document.getElementById('phrase-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        this.renderCards();
      });
    }
  },

  renderCards() {
    const container = document.getElementById('flashcards-container');
    if (!container) return;

    let filtered = PHRASES_DATA.filter(item => {
      const matchCat = (state.currentCategory === 'all') || 
                       (state.currentCategory === 'starred' && state.starredPhrases.includes(item.id)) ||
                       (item.category === state.currentCategory);

      const matchQuery = !state.searchQuery ||
                         item.english.toLowerCase().includes(state.searchQuery) ||
                         item.amharic.toLowerCase().includes(state.searchQuery) ||
                         item.phonetic.toLowerCase().includes(state.searchQuery);

      return matchCat && matchQuery;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
          <h4 style="font-size: 1.1rem; color: var(--text-main); margin-bottom: 0.3rem;">ምንም አገላለጽ አልተገኘም (No phrases found)</h4>
          <p style="font-size: 0.85rem;">እባክዎ የተለየ የፍለጋ ቃል ወይም ካቴጎሪ ይሞክሩ።</p>
        </div>
      `;
      return;
    }

    container.innerHTML = '';
    filtered.forEach(item => {
      const isStarred = state.starredPhrases.includes(item.id);
      const card = document.createElement('div');
      card.className = 'flashcard-item';
      card.setAttribute('data-id', item.id);

      card.innerHTML = `
        <div class="flashcard-inner">
          <!-- Front Side (Amharic) -->
          <div class="flashcard-front">
            <div class="card-top-bar">
              <span class="card-category-badge">${item.categoryAm}</span>
              <div class="card-actions-mini">
                <button class="card-star-btn ${isStarred ? 'starred' : ''}" data-id="${item.id}" title="ኮከብ ያድርጉ (Bookmark)">
                  ${isStarred ? '★' : '☆'}
                </button>
              </div>
            </div>
            
            <div class="card-main-text-amharic">
              ${item.amharic}
            </div>

            <div class="card-hint-text">
              <span>🔄 ለመገልበጥ ካርዱን ይንኩ (Click to flip)</span>
              <span>🇪🇹 ➔ 🇬🇧</span>
            </div>
          </div>

          <!-- Back Side (English + Audio) -->
          <div class="flashcard-back">
            <div class="card-top-bar">
              <span class="card-category-badge" style="background: rgba(16, 185, 129, 0.15); color: var(--accent-primary);">English</span>
              <button class="speech-play-btn card-audio-btn" data-text="${encodeURIComponent(item.english)}" title="አነባበቡን ያዳምጡ">
                🔊
              </button>
            </div>

            <div>
              <div class="card-main-text-english">${item.english}</div>
              <div class="card-phonetic-sub">🗣️ ${item.phonetic}</div>
            </div>

            <div class="card-example-usage">
              💡 <strong>ምሳሌ:</strong> ${item.example}
            </div>
          </div>
        </div>
      `;

      // Click to flip (unless clicking star or audio button)
      card.addEventListener('click', (e) => {
        if (e.target.closest('.card-star-btn') || e.target.closest('.card-audio-btn')) return;
        card.classList.toggle('flipped');
        SoundEffects.playPop();
      });

      // Audio pronounce button
      const audioBtn = card.querySelector('.card-audio-btn');
      if (audioBtn) {
        audioBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const text = decodeURIComponent(audioBtn.getAttribute('data-text') || '');
          TTSEngine.speak(text, audioBtn);
        });
      }

      // Star / Favorite toggle
      const starBtn = card.querySelector('.card-star-btn');
      if (starBtn) {
        starBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const id = starBtn.getAttribute('data-id');
          this.toggleStar(id, starBtn);
        });
      }

      container.appendChild(card);
    });
  },

  toggleStar(id, btn) {
    if (state.starredPhrases.includes(id)) {
      state.starredPhrases = state.starredPhrases.filter(item => item !== id);
      btn.classList.remove('starred');
      btn.textContent = '☆';
    } else {
      state.starredPhrases.push(id);
      btn.classList.add('starred');
      btn.textContent = '★';
      SoundEffects.playSuccess();
    }
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.starredPhrases));
  }
};

// Quiz Arena Controller
const QuizController = {
  init() {
    this.renderQuestion();
    this.attachEvents();
  },

  attachEvents() {
    const nextBtn = document.getElementById('quiz-next-btn');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextQuestion();
      });
    }

    const speakerBtn = document.getElementById('quiz-listen-btn');
    if (speakerBtn) {
      speakerBtn.addEventListener('click', () => {
        const q = QUIZ_QUESTIONS[state.quizCurrentIndex];
        if (q) TTSEngine.speak(q.questionEn, speakerBtn);
      });
    }

    const hintBtn = document.getElementById('quiz-hint-btn');
    if (hintBtn) {
      hintBtn.addEventListener('click', () => {
        const q = QUIZ_QUESTIONS[state.quizCurrentIndex];
        if (q && q.hintAm) {
          alert(`💡 ፍንጭ (Hint):\n${q.hintAm}`);
        }
      });
    }

    const restartBtn = document.getElementById('quiz-restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.restartQuiz();
      });
    }
  },

  renderQuestion() {
    const q = QUIZ_QUESTIONS[state.quizCurrentIndex];
    if (!q) return;

    state.quizAnswered = false;

    // Update Progress
    const total = QUIZ_QUESTIONS.length;
    const currentNum = state.quizCurrentIndex + 1;
    document.getElementById('quiz-question-number').textContent = `ጥያቄ ${currentNum} ከ ${total}`;
    const percent = ((currentNum - 1) / total) * 100;
    document.getElementById('quiz-progress-bar').style.width = `${percent}%`;

    // Update Scores
    document.getElementById('quiz-current-score').textContent = state.quizScore;
    document.getElementById('quiz-current-streak').textContent = state.quizStreak;

    // Render Question Details
    document.getElementById('quiz-category-tag').textContent = q.category;
    document.getElementById('quiz-question-en').textContent = q.questionEn;
    document.getElementById('quiz-context-am').textContent = q.contextAm;

    // Reset Explanation box
    const expBox = document.getElementById('quiz-explanation');
    expBox.style.display = 'none';

    // Render Options
    const optionsContainer = document.getElementById('quiz-options-list');
    optionsContainer.innerHTML = '';

    const letters = ['A', 'B', 'C', 'D'];
    q.options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `
        <span style="display: flex; align-items: center; gap: 0.75rem;">
          <span class="option-marker">${letters[idx]}</span>
          <span>${opt}</span>
        </span>
        <span class="option-status-icon"></span>
      `;

      btn.addEventListener('click', () => {
        if (!state.quizAnswered) {
          this.handleAnswer(idx, btn);
        }
      });

      optionsContainer.appendChild(btn);
    });

    const nextBtn = document.getElementById('quiz-next-btn');
    nextBtn.disabled = true;
    nextBtn.textContent = (currentNum === total) ? 'ውጤት ይመልከቱ (Finish Quiz)' : 'ቀጣይ ጥያቄ (Next Question) ➔';
  },

  handleAnswer(selectedIndex, clickedBtn) {
    state.quizAnswered = true;
    const q = QUIZ_QUESTIONS[state.quizCurrentIndex];
    const isCorrect = selectedIndex === q.correctIndex;

    const allButtons = document.querySelectorAll('.quiz-option-btn');
    allButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correctIndex) {
        btn.classList.add('selected-correct');
        btn.querySelector('.option-status-icon').innerHTML = '✅';
      }
    });

    if (isCorrect) {
      state.quizScore += 10;
      state.quizStreak += 1;
      SoundEffects.playSuccess();
    } else {
      clickedBtn.classList.add('selected-wrong');
      clickedBtn.querySelector('.option-status-icon').innerHTML = '❌';
      state.quizStreak = 0;
      SoundEffects.playError();
    }

    // Update Score Displays
    document.getElementById('quiz-current-score').textContent = state.quizScore;
    document.getElementById('quiz-current-streak').textContent = state.quizStreak;

    // Show Explanation
    const expBox = document.getElementById('quiz-explanation');
    expBox.style.display = 'block';
    expBox.innerHTML = `
      <div class="explanation-title ${isCorrect ? 'success' : 'failure'}">
        ${isCorrect ? '🎉 ትክክል ነው! (Correct!)' : '❌ ተሳስቷል! ትክክለኛውን ማብራሪያ ይመልከቱ:'}
      </div>
      <div class="explanation-body-amharic">
        ${q.explanationAm}
      </div>
    `;

    document.getElementById('quiz-next-btn').disabled = false;
  },

  nextQuestion() {
    if (state.quizCurrentIndex < QUIZ_QUESTIONS.length - 1) {
      state.quizCurrentIndex++;
      this.renderQuestion();
    } else {
      this.finishQuiz();
    }
  },

  finishQuiz() {
    const total = QUIZ_QUESTIONS.length;
    const maxScore = total * 10;
    const pct = Math.round((state.quizScore / maxScore) * 100);

    // Save high score
    const prevHigh = parseInt(localStorage.getItem(STORAGE_KEYS.QUIZ_HIGHSCORE) || '0', 10);
    if (state.quizScore > prevHigh) {
      localStorage.setItem(STORAGE_KEYS.QUIZ_HIGHSCORE, state.quizScore.toString());
    }

    document.getElementById('result-final-score').textContent = `${state.quizScore} / ${maxScore} (${pct}%)`;

    let msgAm = '';
    let msgEn = '';
    let trophy = '🏆';

    if (pct >= 85) {
      trophy = '🌟';
      msgAm = 'ድንቅ ውጤት! እንግሊዝኛዎ በጣም ከፍተኛ ደረጃ ላይ ይገኛል።';
      msgEn = 'Outstanding mastery! Your English understanding is top-notch.';
    } else if (pct >= 60) {
      trophy = '👏';
      msgAm = 'በጣም ጥሩ ጥረት! ተጨማሪ ልምምድ በማድረግ የበለጠ ብቁ መሆን ይችላሉ።';
      msgEn = 'Great effort! With a little more practice, you will be fluent.';
    } else {
      trophy = '💪';
      msgAm = 'ተስፋ አትቁረጡ! ከፓፒ ጋር በየቀኑ ካርዶችን እና ውይይቶችን ይለማመዱ።';
      msgEn = 'Do not give up! Daily practice with Papi will boost your confidence.';
    }

    document.getElementById('celebration-trophy-icon').textContent = trophy;
    document.getElementById('result-message-am').textContent = msgAm;
    document.getElementById('result-message-en').textContent = msgEn;

    const modal = document.getElementById('quiz-result-modal');
    if (modal) modal.classList.add('active');
    SoundEffects.playSuccess();
  },

  restartQuiz() {
    state.quizCurrentIndex = 0;
    state.quizScore = 0;
    state.quizStreak = 0;
    const modal = document.getElementById('quiz-result-modal');
    if (modal) modal.classList.remove('active');
    this.renderQuestion();
  }
};

// ==========================================================================
// 7. Settings Modal, Theme Switcher & Tabs Management
// ==========================================================================
const SettingsManager = {
  init() {
    // Theme setup
    document.body.className = state.theme === 'light' ? 'light-theme' : '';
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.textContent = state.theme === 'light' ? '🌙' : '☀️';
      themeBtn.addEventListener('click', () => {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        document.body.className = state.theme === 'light' ? 'light-theme' : '';
        themeBtn.textContent = state.theme === 'light' ? '🌙' : '☀️';
        localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
      });
    }

    // API Settings Modal
    const apiModalBtn = document.getElementById('open-api-modal-btn');
    const apiModal = document.getElementById('api-settings-modal');
    const closeModalBtn = document.getElementById('close-api-modal');
    const saveApiKeyBtn = document.getElementById('save-api-key-btn');
    const apiKeyInput = document.getElementById('api-key-input');
    const apiStatusDot = document.getElementById('api-status-dot');

    if (apiStatusDot) {
      if (state.apiKey && state.apiKey.length > 10) {
        apiStatusDot.classList.remove('offline');
        apiStatusDot.title = 'Gemini Live AI Connected';
      } else {
        apiStatusDot.classList.add('offline');
        apiStatusDot.title = 'Offline Intelligent AI Mode';
      }
    }

    if (apiModalBtn && apiModal) {
      apiModalBtn.addEventListener('click', () => {
        if (apiKeyInput) apiKeyInput.value = state.apiKey;
        apiModal.classList.add('active');
      });
    }

    if (closeModalBtn && apiModal) {
      closeModalBtn.addEventListener('click', () => {
        apiModal.classList.remove('active');
      });
    }

    if (saveApiKeyBtn && apiKeyInput) {
      saveApiKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        state.apiKey = key;
        localStorage.setItem(STORAGE_KEYS.API_KEY, key);

        if (apiStatusDot) {
          if (key && key.length > 10) {
            apiStatusDot.classList.remove('offline');
            apiStatusDot.title = 'Gemini Live AI Connected';
          } else {
            apiStatusDot.classList.add('offline');
            apiStatusDot.title = 'Offline Intelligent AI Mode';
          }
        }

        alert('የቅንብር መረጃዎ በተሳካ ሁኔታ ተቀምጧል! (Settings saved successfully)');
        apiModal.classList.remove('active');
      });
    }

    // Voice Speed & Accent Controls
    const speedRange = document.getElementById('voice-speed-slider');
    const speedDisplay = document.getElementById('voice-speed-display');
    if (speedRange && speedDisplay) {
      speedRange.value = state.voiceRate;
      speedDisplay.textContent = `${state.voiceRate}x`;
      speedRange.addEventListener('input', (e) => {
        state.voiceRate = parseFloat(e.target.value);
        speedDisplay.textContent = `${state.voiceRate}x`;
        localStorage.setItem(STORAGE_KEYS.VOICE_RATE, state.voiceRate.toString());
      });
    }

    const accentSelect = document.getElementById('voice-accent-select');
    if (accentSelect) {
      accentSelect.addEventListener('change', (e) => {
        state.voiceAccent = e.target.value;
        localStorage.setItem(STORAGE_KEYS.VOICE_ACCENT, state.voiceAccent);
      });
    }

    // Modal close on clicking background
    window.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
      }
    });
  }
};

// Navigation Tabs Switcher
const NavigationManager = {
  init() {
    // Desktop Nav tabs
    const navTabs = document.querySelectorAll('.nav-tab-btn');
    // Mobile bottom nav items
    const mobileItems = document.querySelectorAll('.mobile-nav-item');
    // Mode selector cards
    const modeCards = document.querySelectorAll('.mode-card');

    const switchTab = (tabId) => {
      state.currentTab = tabId;

      // Update desktop tab buttons
      navTabs.forEach(t => {
        t.classList.toggle('active', t.getAttribute('data-tab') === tabId);
      });

      // Update mobile items
      mobileItems.forEach(m => {
        m.classList.toggle('active', m.getAttribute('data-tab') === tabId);
      });

      // Update mode cards
      modeCards.forEach(c => {
        c.classList.toggle('active', c.getAttribute('data-tab') === tabId);
      });

      // Show matching tab pane
      const panes = document.querySelectorAll('.tab-pane');
      panes.forEach(p => {
        p.classList.toggle('active', p.id === `tab-${tabId}`);
      });

      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    navTabs.forEach(t => {
      t.addEventListener('click', () => switchTab(t.getAttribute('data-tab')));
    });

    mobileItems.forEach(m => {
      m.addEventListener('click', () => switchTab(m.getAttribute('data-tab')));
    });

    modeCards.forEach(c => {
      c.addEventListener('click', () => switchTab(c.getAttribute('data-tab')));
    });

    // Mic button
    const micBtn = document.getElementById('mic-btn');
    if (micBtn) {
      micBtn.addEventListener('click', () => {
        STTEngine.toggle();
      });
    }
  }
};

// ==========================================================================
// 8. Bootstrap & Application Initialization
// ==========================================================================
function bootstrapApp() {
  try {
    TTSEngine.init();
  } catch (e) {
    console.warn('TTS init error:', e);
  }

  try {
    STTEngine.init();
  } catch (e) {
    console.warn('STT init error:', e);
  }

  try {
    SettingsManager.init();
  } catch (e) {
    console.warn('Settings init error:', e);
  }

  try {
    NavigationManager.init();
  } catch (e) {
    console.warn('Navigation init error:', e);
  }

  try {
    ChatController.init();
  } catch (e) {
    console.warn('Chat init error:', e);
  }

  try {
    FlashcardsController.init();
  } catch (e) {
    console.warn('Flashcards init error:', e);
  }

  try {
    QuizController.init();
  } catch (e) {
    console.warn('Quiz init error:', e);
  }

  // Streak counter display
  const streakEl = document.getElementById('user-streak-counter');
  if (streakEl) streakEl.textContent = `${state.streakDays} ቀናት (Days Streak)`;

  console.log('✅ Papi English: AI English Teacher for Amharic Speakers initialized.');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapApp);
} else {
  bootstrapApp();
}
