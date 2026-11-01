const http = require('http');

console.log('--- RUNNING AUTOMATED PORTFOLIO HEALTH & RESPONSIVENESS CHECKS ---');

function fetch(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body: data }));
    }).on('error', reject);
  });
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  function assert(condition, testName) {
    if (condition) {
      console.log(`[PASS] ${testName}`);
      passed++;
    } else {
      console.error(`[FAIL] ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Check Server Response
    const home = await fetch('http://localhost:3000/');
    assert(home.status === 200, 'Home page returns HTTP 200');
    assert(home.headers['content-type'].includes('text/html'), 'Content-Type is text/html');

    // 2. Validate HTML Structure & Required Sections
    const html = home.body;
    assert(html.includes('Esubalew <span class="text-gradient">Shenkute</span>'), 'Hero developer name present');
    assert(html.includes('id="hero"'), 'Hero section present');
    assert(html.includes('id="about"'), 'About Me section present');
    assert(html.includes('id="education"'), 'Education timeline present');
    assert(html.includes('id="skills"'), 'Technical skills section present');
    assert(html.includes('id="projects"'), 'Projects section present');
    assert(html.includes('id="certificates"'), 'Certificates section present');
    assert(html.includes('id="contact"'), 'Contact section present');
    assert(html.includes('id="contact-form"'), 'Working contact form present');
    assert(html.includes('sesuba21@gmail.com'), 'User contact email present');
    assert(html.includes('+251903974728'), 'User phone number present');
    assert(html.includes('esubap'), 'User social media username esubap present');
    assert(html.includes('assets/images/profile.jpg'), 'User real profile photo present');

    // 3. Validate All 8 User Requested Skills in HTML
    assert(html.includes('Java'), 'Skill: Java present');
    assert(html.includes('HTML / HTML5'), 'Skill: HTML5 present');
    assert(html.includes('CSS / CSS3'), 'Skill: CSS3 present');
    assert(html.includes('JavaScript (ES6+)'), 'Skill: JavaScript present');
    assert(html.includes('Python'), 'Skill: Python present');
    assert(html.includes('Networking'), 'Skill: Networking present');
    assert(html.includes('Artificial Intelligence (AI)'), 'Skill: AI present');
    assert(html.includes('Cybersecurity'), 'Skill: Cybersecurity present');

    // 4. Validate CSS Files & Media Queries
    const css = (await fetch('http://localhost:3000/css/style.css')).body;
    assert(css.includes('@media (max-width: 1024px)'), 'Tablet breakpoint (1024px) configured');
    assert(css.includes('@media (max-width: 768px)'), 'Mobile landscape/tablet breakpoint (768px) configured');
    assert(css.includes('@media (max-width: 480px)'), 'Mobile portrait breakpoint (480px) configured');
    assert(css.includes('--header-height: 68px;'), 'Mobile navbar optimization configured');
    assert(css.includes('.hamburger {'), 'Mobile hamburger drawer configured');
    assert(css.includes('.mobile-nav {'), 'Mobile nav drawer sliding panel configured');

    // 5. Validate JavaScript Modules
    const mainJs = (await fetch('http://localhost:3000/js/main.js')).body;
    assert(mainJs.includes('setupTypewriter'), 'Dynamic Typewriter effect script present');
    assert(mainJs.includes('setupScrollProgress'), 'Reading progress bar script present');
    assert(mainJs.includes('setupStatsCounter'), 'Metric number counter script present');
    assert(mainJs.includes('setupSkillProgressBars'), 'Skill animated progress bars script present');
    assert(mainJs.includes('setupBackToTop'), 'Circular progress back-to-top script present');

    const contactJs = (await fetch('http://localhost:3000/js/contact.js')).body;
    assert(contactJs.includes('isValidEmail'), 'Regex email validator configured');
    assert(contactJs.includes('showToast'), 'Toast notification feedback system configured');
    assert(contactJs.includes('setupCopyEmail'), 'Clipboard one-click copy configured');

    const projectsJs = (await fetch('http://localhost:3000/js/projects.js')).body;
    assert(projectsJs.includes('setupProjectFiltering'), 'Project filtering logic configured');
    assert(projectsJs.includes('setupSkillsFiltering'), 'Skills filtering logic configured');
    assert(projectsJs.includes('openProjectModal'), 'Project modal popup engine configured');
    assert(projectsJs.includes('openCertModal'), 'Certificate modal popup engine configured');

    console.log(`\n========================================`);
    console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================`);
    process.exit(failed > 0 ? 1 : 0);
  } catch (err) {
    console.error('Fatal test error:', err);
    process.exit(1);
  }
}

runTests();
