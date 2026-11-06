/**
 * In-Process Verification Script for Dating Proposal Web Application
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('--- RUNNING DATING PROPOSAL APP VALIDATION TEST ---');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passed++;
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// 1. Check File Existence
assert(fs.existsSync(path.join(__dirname, 'index.html')), 'index.html exists');
assert(fs.existsSync(path.join(__dirname, 'css', 'dating.css')), 'css/dating.css exists');
assert(fs.existsSync(path.join(__dirname, 'js', 'dating.js')), 'js/dating.js exists');
assert(fs.existsSync(path.join(__dirname, 'assets', 'images', 'cute-pug.svg')), 'cute-pug.svg exists');
assert(fs.existsSync(path.join(__dirname, 'assets', 'images', 'happy-pug.svg')), 'happy-pug.svg exists');

// 2. Read and Validate HTML Content
const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');

// Step 1 Validation
assert(html.includes('🌸 Will you go on a date with me? 🌸') || (html.includes('Will you go on a date with me?') && html.includes('🌸')), 'Step 1: Heading present with flower emojis');
assert(html.includes('id="btn-yes"') && html.includes('YES') && html.includes('🤍'), 'Step 1: "YES 🤍" button present');
assert(html.includes('id="btn-no"') && html.includes('NO') && html.includes('🤍'), 'Step 1: "NO 🤍" button present');
assert(html.includes('cute-pug.svg') || html.includes('avatar-img'), 'Step 1: Dog/pug avatar image present');

// Step 2 Validation
assert(html.includes('WAIT YOU ACTUALLY SAID YES?! 🥹'), 'Step 2: "WAIT YOU ACTUALLY SAID YES?! 🥹" heading present');
assert(html.includes('I was so ready for you to say no 😭'), 'Step 2: "I was so ready for you to say no 😭" subtext present');
assert(html.includes('okay okay!') && html.includes('→'), 'Step 2: "okay okay! →" button present');

// Step 3 Validation
assert(html.includes('So... when are you free?'), 'Step 3: "So... when are you free?" header present');
assert(html.includes('Pick a Day (mm/dd/yyyy)'), 'Step 3: "Pick a Day (mm/dd/yyyy)" input label present');
assert(html.includes('What Time?'), 'Step 3: "What Time?" input label present');
assert(html.includes('set the date! ♡'), 'Step 3: "set the date! ♡" button present');

// Step 4 Validation
assert(html.includes('What are we feeling? ✨'), 'Step 4: "What are we feeling? ✨" heading present');
assert(html.includes('pick your vibe'), 'Step 4: "pick your vibe" subtext present');
assert(html.includes('Pizza') && html.includes('🍕'), 'Step 4: Pizza 🍕 option present');
assert(html.includes('Sushi') && html.includes('🍣'), 'Step 4: Sushi 🍣 option present');
assert(html.includes('Burgers') && html.includes('🍔'), 'Step 4: Burgers 🍔 option present');
assert(html.includes('Pasta') && html.includes('🍝'), 'Step 4: Pasta 🍝 option present');
assert(html.includes('Tacos') && html.includes('🌮'), 'Step 4: Tacos 🌮 option present');
assert(html.includes('Ramen') && html.includes('🍜'), 'Step 4: Ramen 🍜 option present');

// Step 5 Validation
assert(html.includes("glad you didn't say no. be ready by 6, I'm coming to get you 🚗"), 'Step 5: "glad you didn\'t say no..." heading present');
assert(html.includes("P.S. normal people text. I made a website on Replit, during lunch, for you. no big deal. ♡♡♡♡♡"), 'Step 5: Sarcastic P.S. note present');
assert(html.includes('ok I accept 🥂'), 'Step 5: "ok I accept 🥂" button present');

// Step 6 Validation
assert(html.includes('one small fee'), 'Step 6: "one small fee" heading present');
assert(html.includes('to confirm your acceptance of this date, please complete the following transaction. totally normal, everyone does this.'), 'Step 6: Subtext present');
assert(html.includes('Date Agreement™'), 'Step 6: "Date Agreement™" box present');
assert(html.includes('$499'), 'Step 6: "$499" price tag present');
assert(html.includes('one-time fee · non-refundable · absolutely worth it'), 'Step 6: Price description present');
assert(html.includes('pay $499 & confirm ♡'), 'Step 6: "pay $499 & confirm ♡" button present');
assert(html.includes('go back'), 'Step 6: "go back" link present');

// 3. Validate JS Syntax & Logic
const js = fs.readFileSync(path.join(__dirname, 'js', 'dating.js'), 'utf-8');
assert(js.includes('dodgeNoButton') || js.includes('teleport'), 'JS includes NO button dodge/teleport logic');
assert(js.includes('triggerConfetti'), 'JS includes Confetti engine');
assert(js.includes('AudioContext'), 'JS includes Web Audio synthesizer');
assert(js.includes('generateIcsFile'), 'JS includes Calendar .ics export');

// Verify JS syntax parses cleanly with no syntax errors
try {
  new vm.Script(js);
  assert(true, 'js/dating.js is valid JavaScript syntax');
} catch (e) {
  assert(false, `js/dating.js syntax error: ${e.message}`);
}

// 4. Validate CSS Content
const css = fs.readFileSync(path.join(__dirname, 'css', 'dating.css'), 'utf-8');
assert(css.includes('--bg-gradient') && css.includes('--card-bg'), 'CSS includes color tokens');
assert(css.includes('.btn-no.teleporting') || css.includes('@keyframes teleportPop'), 'CSS includes teleport animations');
assert(css.includes('.step-view'), 'CSS includes step-view transitions');

console.log(`\n================================`);
console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
console.log(`================================`);
process.exit(failed > 0 ? 1 : 0);
