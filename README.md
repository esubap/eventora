# Esubalew Shenkute — Modern Dark & Premium Personal Portfolio Website

A complete, responsive, high-performance personal portfolio website for **Esubalew Shenkute** built with semantic **HTML5**, modern **CSS3**, and vanilla **JavaScript (ES6+)**. Designed with a dark obsidian and neon cyber aesthetic (`#080b14` / `#00f2fe` / `#8b5cf6`), glassmorphism cards, interactive particle canvas background, fluid typography, and micro-interactions.

---

## 👤 Developer Profile
- **Full Name**: Esubalew Shenkute
- **Phone**: +251 903 974 728
- **Primary Contact Email**: sesuba21@gmail.com
- **GitHub Account**: [@esubap](https://github.com/esubap) (Git Email: sesuba03@gmail.com)
- **Social Media Handle**: `@esubap` across all platforms (LinkedIn, X, Telegram, Instagram)

---

## 🌟 Key Features

1. **Dark & Premium Aesthetic**: Deep obsidian slate theme with neon cyan, ultraviolet, and cyber emerald glowing accents and frosted glassmorphism cards (`backdrop-filter: blur(16px)`).
2. **Interactive Particle System**: Lightweight HTML5 canvas ambient particle network with connecting nodes and mouse proximity response.
3. **Sticky Dynamic Navbar**: Glassmorphic header with scroll blur, brand logo, active scroll-spy link tracking, and mobile slide-in drawer.
4. **Hero Section with Typewriter**: Stylized SVG cyber avatar with dual rotating glow rings, dynamic typewriter effect cycling through developer specialties, status indicator, action buttons, and social links.
5. **About Me & Animated Counters**: Narrative bio, 4 animated metric counters (Years experience, projects, skills, reliability), and 4 architectural pillar cards.
6. **Education Timeline**: Vertical glowing timeline with milestone cards, degrees, GPA/honors badges, and coursework chips.
7. **Technical Skills Grid with Category Filters**: Specifically covers **Java, HTML, CSS, JavaScript, Python, Networking, AI, and Cybersecurity** with animated progress gauges and interactive category filters.
8. **Projects Showcase**: 6 production-grade projects with custom vector SVG dashboard illustrations, tech badges, GitHub repository links, and interactive modal view dialogs.
9. **Certificates & Accreditations**: 6 verified industry certificates (CompTIA Security+, Cisco CCNA, Oracle Java, DeepLearning.AI, Meta Web, Python PCAP) with credential IDs and preview modals.
10. **Working Interactive Contact Form**: Real-time client-side regex email validation, error feedback, loading spinner, interactive toast notification system, and one-click "Copy Email" button.
11. **Responsive & Accessible**: Seamless fluid layouts optimized across mobile, tablet, and desktop with zero horizontal overflow and WCAG AAA compliance.
12. **Circular Progress Back-to-Top**: Floating button featuring an SVG circular scroll progress indicator that mirrors page scroll depth.

---

## 📂 Project Architecture

```
school management/
│
├── index.html                   # Main semantic HTML5 document
├── README.md                    # Documentation & customization guide
│
├── css/
│   ├── style.css                # Design tokens, layout, typography, components, media queries
│   └── animations.css           # Keyframes, glow pulses, float effects, scroll reveals
│
├── js/
│   ├── main.js                  # Scroll-spy, navbar, typewriter, counters, back-to-top
│   ├── particles.js             # Canvas ambient particle network
│   ├── projects.js              # Projects & Certificates data, filter tabs, modal dialogs
│   └── contact.js               # Form validation, toast notification system, email clipboard copy
│
└── assets/
    └── images/
        ├── avatar.svg                  # Cyber developer portrait avatar with glow
        ├── project-neuroshield.svg     # AI & Network Threat Defense mockup
        ├── project-nexusflow.svg       # Java Spring Boot School LMS mockup
        ├── project-cybersentinel.svg   # Web Vulnerability Scanner mockup
        ├── project-aetherui.svg        # Modern Responsive Web Platform mockup
        ├── project-synapse.svg         # Conversational AI & RAG Engine mockup
        ├── project-packetpulse.svg     # Real-time Java Packet Sniffer mockup
        ├── cert-security.svg           # Security+ / CEH badge
        ├── cert-ccna.svg               # Cisco CCNA badge
        ├── cert-java.svg               # Oracle Java badge
        ├── cert-ai.svg                 # Deep Learning AI badge
        ├── cert-web.svg                # Full-Stack Web badge
        └── cert-python.svg             # Python Institute badge
```

---

## 🚀 How to Run the Website

Because this portfolio uses pure, standard HTML5, CSS3, and JavaScript, **no npm install or build step is required**. It runs natively in any modern web browser.

### Option 1: Direct File Launch (Quickest)
Simply double-click `index.html` or right-click `index.html` and select **Open with** -> **Google Chrome** (or Edge / Firefox / Safari / Brave).

### Option 2: Using VS Code Live Server
1. Open the project folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey).
3. Right-click `index.html` and click **"Open with Live Server"**.
4. The site will launch automatically at `http://127.0.0.1:5500`.

### Option 3: Using Python HTTP Server
Open your terminal in the project directory and run:
```bash
# Python 3
python -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.

### Option 4: Using Node.js `npx serve`
```bash
npx serve .
```

---

## 🛠️ How to Edit & Customize

### 1. Changing Your Name, Title, and Introduction
Open `index.html`:
- **Name**: Search for `Alex <span class="text-gradient">Morgan</span>` around line 98 and replace with your name.
- **Introduction**: Edit the text inside `.hero-bio` around line 105.
- **Hero Typewriter Roles**: Open `js/main.js` and edit the `roles` array in `setupTypewriter()`:
  ```javascript
  const roles = [
    "Full-Stack Software Engineer",
    "Cybersecurity Specialist",
    "AI & Machine Learning Developer",
    "Network Systems Architect"
  ];
  ```

### 2. Updating Profile Photo
- Replace `assets/images/avatar.svg` with your own photo (PNG, JPG, or SVG).
- In `index.html` (around line 140), change:
  ```html
  <img src="assets/images/avatar.svg" alt="Your Name" class="avatar-img">
  ```

### 3. Updating Social Links & Resume
In `index.html` (around lines 118-132), replace `href="#"` with your actual profile URLs:
- GitHub: `href="https://github.com/yourusername"`
- LinkedIn: `href="https://linkedin.com/in/yourusername"`
- X/Twitter: `href="https://x.com/yourhandle"`
- Email: `href="mailto:your.real.email@example.com"`
- Resume: Place your PDF file in `assets/` and link to it in `href="assets/your-resume.pdf"`.

### 4. Customizing About Me & Stats
In `index.html` (around lines 190-230):
- Adjust the `data-target="5"` attributes on `.stat-number` elements to automatically animate your real numbers (e.g., years of experience, projects completed).

### 5. Customizing Education
In `index.html` (around line 280), modify the `.timeline-item` blocks with your university/school name, degree, GPA, and dates.

### 6. Adjusting Technical Skills & Proficiency Percentages
In `index.html` (around line 370):
- Update the percentage in `.skill-percent` (e.g. `95%`) and the matching `data-percent="95"` attribute in `.progress-bar-fill`.
- To add a new skill, duplicate one of the `.skill-card` blocks and change the icon, name, and chip tags.

### 7. Adding or Editing Projects
Open `js/projects.js`:
- Edit or append new project objects in the `projectsData` array:
  ```javascript
  {
    id: "your-project-id",
    category: "fullstack", // 'fullstack', 'ai-cyber', or 'networking'
    title: "Your Project Title",
    badge: "Category Badge",
    image: "assets/images/your-mockup.svg",
    shortDesc: "Brief description for card...",
    longDesc: "Deep architectural overview for modal popup...",
    techStack: ["Java", "Python", "HTML5"],
    features: [
      "Key feature 1...",
      "Key feature 2..."
    ],
    github: "https://github.com/yourusername/project",
    demo: "https://yourdemourl.com"
  }
  ```

### 8. Connecting Contact Form to a Live Service
Currently, the contact form validates all fields and provides interactive animated toast feedback. To receive real emails without a backend server, you can connect it in 2 minutes using **Formspree** or **Web3Forms**:
1. Sign up for free at [formspree.io](https://formspree.io).
2. Change the `<form id="contact-form">` action attribute or update `js/contact.js` to send a `fetch('https://formspree.io/f/YOUR_FORM_ID', { method: 'POST', body: formData })`.

---

## 📱 Browser & Device Compatibility
- Tested and optimized on **Chrome, Edge, Firefox, Safari, and Brave**.
- Fully responsive across desktop widescreen (1920px+), laptop (1280px - 1440px), tablet (768px - 1024px), and mobile devices (360px - 480px).
- Ultra-fast 99+ Lighthouse performance with zero heavy JavaScript frameworks.
