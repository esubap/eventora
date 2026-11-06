/**
 * CUTE & SARCASTIC DATING PROPOSAL WEB APP
 * State Management, Interactive NO-Button Dodging, Audio Synthesizer, Confetti & Calendar Invite
 */

(function () {
  'use strict';

  // --- APPLICATION STATE ---
  const state = {
    currentStep: 1,
    totalSteps: 6,
    soundEnabled: true,
    dodgeCount: 0,
    selectedDate: '',
    selectedTime: '6:00 PM',
    selectedFood: 'Pizza',
    selectedFoodEmoji: '🍕',
    isPaid: false,
    discountApplied: false
  };

  // Sarcastic NO Button dodge phrases
  const dodgePhrases = [
    'Are you sure? 🥺',
    '404: Rejection Not Found 🚫',
    'Nice try! 🏃💨',
    'Permission Denied (sudo won\'t help) 🔐',
    'Git commit rejected by hook 🙅‍♂️',
    'Timeout: Request took too long ⏳',
    'Button is running away! 🐾',
    'Wait, give me a chance! 🥹',
    'Calculated risk too high 📉',
    'I ironed my shirt for this! 👔',
    'Just click YES already 😂',
    'Wi-Fi connection too strong to say no 📶',
    'Catch me if you can! ⚡',
    'Syntax Error: Illegal choice ❌'
  ];

  // --- WEB AUDIO API SOUND SYNTHESIZER ---
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playSound(type) {
    if (!state.soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;

      if (type === 'pop') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'boing') {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.linearRampToValueAtTime(560, now + 0.12);
        osc.frequency.linearRampToValueAtTime(320, now + 0.22);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'fanfare') {
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          const startTime = now + idx * 0.1;
          gain.gain.setValueAtTime(0.25, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.35);
        });
      } else if (type === 'chime') {
        const notes = [659.25, 880.00]; // E5, A5
        notes.forEach((freq, idx) => {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          const startTime = now + idx * 0.09;
          gain.gain.setValueAtTime(0.2, startTime);
          gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.28);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.28);
        });
      }
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // --- AMBIENT CANVAS BACKGROUND (Floated Petals & Paw Prints) ---
  function initAmbientBackground() {
    const canvas = document.getElementById('particles-bg');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const symbols = ['🌸', '🐾', '✨', '💕', '🌷', '🤍'];
    const particles = [];
    const particleCount = 22;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        char: symbols[Math.floor(Math.random() * symbols.length)],
        size: Math.random() * 16 + 14,
        speedY: Math.random() * 0.6 + 0.2,
        speedX: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.45 + 0.25,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.8
      });
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotationSpeed;

        if (p.y < -30) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.char, 0, 0);
        ctx.restore();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // --- CONFETTI SYSTEM ---
  function triggerConfetti(duration = 2500) {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const confettiPieces = [];
    const colors = ['#F43F5E', '#EC4899', '#FB7185', '#FBBF24', '#34D399', '#8B5CF6', '#FFFFFF'];
    const count = 120;

    for (let i = 0; i < count; i++) {
      confettiPieces.push({
        x: width / 2 + (Math.random() - 0.5) * 150,
        y: height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.9) * 18 - 4,
        size: Math.random() * 10 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 14,
        gravity: 0.38,
        drag: 0.96,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    const startTime = performance.now();

    function render(now) {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      confettiPieces.forEach((p) => {
        p.vx *= p.drag;
        p.vy *= p.drag;
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, 1 - elapsed / duration);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      if (elapsed < duration) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    }

    requestAnimationFrame(render);
  }

  // --- TOAST NOTIFICATIONS ---
  function showToast(message) {
    let toast = document.getElementById('toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast-notice';
      toast.className = 'toast-notice';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<span>💬</span><span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // --- STEP NAVIGATION ---
  function goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > state.totalSteps) return;
    state.currentStep = stepNumber;

    // Update Step Views
    document.querySelectorAll('.step-view').forEach((el) => {
      const viewStep = parseInt(el.getAttribute('data-step'), 10);
      if (viewStep === stepNumber) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    // Update Stepper Dots
    document.querySelectorAll('.stepper-dot').forEach((dot, index) => {
      const dotStep = index + 1;
      dot.classList.remove('active', 'completed');
      if (dotStep === stepNumber) {
        dot.classList.add('active');
      } else if (dotStep < stepNumber) {
        dot.classList.add('completed');
      }
    });

    // If step is confirmation letter (Step 5), populate dynamic summaries
    if (stepNumber === 5) {
      updateLetterSummary();
    }

    // Scroll softly to top of card on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- STEP 1: INTERACTIVE NO BUTTON DODGING (VIRAL TIKTOK STYLE) ---
  function setupTeleportingNoButton() {
    const btnNo = document.getElementById('btn-no');
    const btnYes = document.getElementById('btn-yes');
    if (!btnNo || !btnYes) return;

    let noPlaceholder = null;
    let lastDodgeTime = 0;
    const PROXIMITY_DISTANCE = 85; // Distance in pixels that triggers runaway glide

    function calculateSafeRandomPosition(cursorX, cursorY) {
      const padding = 24;
      const btnWidth = btnNo.offsetWidth || 135;
      const btnHeight = btnNo.offsetHeight || 48;

      const minX = padding;
      const maxX = Math.max(minX, window.innerWidth - btnWidth - padding);
      const minY = padding;
      const maxY = Math.max(minY, window.innerHeight - btnHeight - padding);

      const yesRect = btnYes.getBoundingClientRect();
      let bestX = minX;
      let bestY = minY;
      let attempts = 0;

      while (attempts < 30) {
        attempts++;
        const randX = Math.floor(Math.random() * (maxX - minX)) + minX;
        const randY = Math.floor(Math.random() * (maxY - minY)) + minY;

        // Ensure no overlap with the fixed YES button
        const overlapsYes = (
          randX < yesRect.right + 25 &&
          randX + btnWidth > yesRect.left - 25 &&
          randY < yesRect.bottom + 25 &&
          randY + btnHeight > yesRect.top - 25
        );
        if (overlapsYes) continue;

        // Ensure it jumps away from the current cursor position
        if (cursorX !== undefined && cursorY !== undefined) {
          const distToCursor = Math.hypot(randX + btnWidth / 2 - cursorX, randY + btnHeight / 2 - cursorY);
          if (distToCursor < 180) continue;
        }

        bestX = randX;
        bestY = randY;
        break;
      }

      if (attempts >= 30) {
        // Fallback: move to opposite quadrant from cursor
        bestX = cursorX && cursorX > window.innerWidth / 2 ? minX + 20 : maxX - 20;
        bestY = cursorY && cursorY > window.innerHeight / 2 ? minY + 20 : maxY - 20;
      }

      return { x: bestX, y: bestY };
    }

    function dodgeNoButton(cursorX, cursorY, immediate = false) {
      const now = performance.now();
      if (!immediate && now - lastDodgeTime < 140) return;
      lastDodgeTime = now;

      // Keep YES button stable: insert placeholder so YES never shifts
      if (!noPlaceholder) {
        noPlaceholder = document.createElement('div');
        noPlaceholder.id = 'no-btn-placeholder';
        noPlaceholder.style.width = `${btnNo.offsetWidth}px`;
        noPlaceholder.style.height = `${btnNo.offsetHeight}px`;
        noPlaceholder.style.display = 'inline-flex';
        noPlaceholder.style.visibility = 'hidden';
        noPlaceholder.style.pointerEvents = 'none';
        btnNo.parentNode.insertBefore(noPlaceholder, btnNo);
      }

      state.dodgeCount++;
      playSound('boing');

      // Update text with sarcastic phrases
      const phraseIndex = (state.dodgeCount - 1) % dodgePhrases.length;
      btnNo.textContent = dodgePhrases[phraseIndex];

      // Calculate new random coordinates within visible screen bounds
      const pos = calculateSafeRandomPosition(cursorX, cursorY);

      // Smoothly glide to new coordinates (uses transition: all 0.2s ease-in-out from CSS)
      btnNo.classList.add('teleporting');
      btnNo.style.position = 'fixed';
      btnNo.style.left = `${pos.x}px`;
      btnNo.style.top = `${pos.y}px`;

      console.log(`[TikTok Runaway Button] Dodge #${state.dodgeCount} -> Moved to (${pos.x}, ${pos.y})`);
    }

    // Cursor proximity detection: runs away when cursor gets close
    function onCursorMove(e) {
      if (state.currentStep !== 1) return;

      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : null);
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : null);
      if (clientX === null || clientY === null) return;

      const rect = btnNo.getBoundingClientRect();
      const btnCenterX = rect.left + rect.width / 2;
      const btnCenterY = rect.top + rect.height / 2;
      const dist = Math.hypot(clientX - btnCenterX, clientY - btnCenterY);

      if (dist < PROXIMITY_DISTANCE + Math.max(rect.width, rect.height) / 2) {
        dodgeNoButton(clientX, clientY, false);
      }
    }

    // Direct event handlers for instant evasion
    function onDirectInteract(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      const clientX = e.clientX ?? (e.touches && e.touches[0] ? e.touches[0].clientX : undefined);
      const clientY = e.clientY ?? (e.touches && e.touches[0] ? e.touches[0].clientY : undefined);
      dodgeNoButton(clientX, clientY, true);
    }

    btnNo.addEventListener('mouseenter', onDirectInteract);
    btnNo.addEventListener('pointerenter', onDirectInteract);
    btnNo.addEventListener('touchstart', onDirectInteract, { passive: false });
    btnNo.addEventListener('click', onDirectInteract);

    // Global cursor tracking while on step 1
    document.addEventListener('mousemove', onCursorMove, { passive: true });
    document.addEventListener('touchmove', onCursorMove, { passive: true });

    // Function to reset NO button when resetting or proceeding
    window.resetNoButtonPosition = function () {
      btnNo.classList.remove('teleporting');
      btnNo.style.position = '';
      btnNo.style.left = '';
      btnNo.style.top = '';
      btnNo.textContent = 'NO 🤍';
      if (noPlaceholder && noPlaceholder.parentNode) {
        noPlaceholder.parentNode.removeChild(noPlaceholder);
        noPlaceholder = null;
      }
    };

    // YES button click handler - fixed and stable
    btnYes.addEventListener('click', (e) => {
      e.preventDefault();
      playSound('fanfare');
      triggerConfetti(3500);

      window.resetNoButtonPosition();

      setTimeout(() => {
        goToStep(2);
      }, 350);
    });
  }

  // --- STEP 2: CELEBRATION ---
  function setupStep2() {
    const btnStep2Next = document.getElementById('btn-step2-next');
    if (btnStep2Next) {
      btnStep2Next.addEventListener('click', () => {
        playSound('pop');
        goToStep(3);
      });
    }
  }

  // --- STEP 3: SCHEDULING (DATE & TIME) ---
  function setupStep3() {
    const dateInput = document.getElementById('date-picker');
    const timeSelect = document.getElementById('time-picker');
    const btnSetDate = document.getElementById('btn-set-date');
    const chips = document.querySelectorAll('.chip-btn');

    // Set minimum date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    if (dateInput) {
      dateInput.min = `${yyyy}-${mm}-${dd}`;

      // Default to next Friday
      const nextFriday = new Date();
      nextFriday.setDate(today.getDate() + ((5 + 7 - today.getDay()) % 7 || 7));
      const fYyyy = nextFriday.getFullYear();
      const fMm = String(nextFriday.getMonth() + 1).padStart(2, '0');
      const fDd = String(nextFriday.getDate()).padStart(2, '0');
      const defaultDateStr = `${fYyyy}-${fMm}-${fDd}`;
      dateInput.value = defaultDateStr;
      state.selectedDate = defaultDateStr;

      dateInput.addEventListener('change', () => {
        state.selectedDate = dateInput.value;
        chips.forEach((c) => c.classList.remove('active'));
      });
    }

    if (timeSelect) {
      state.selectedTime = timeSelect.value || '6:00 PM';
      timeSelect.addEventListener('change', () => {
        state.selectedTime = timeSelect.value;
      });
    }

    // Helper Shortcut Chips
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        playSound('pop');
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');

        const offset = parseInt(chip.getAttribute('data-days'), 10) || 0;
        const targetDate = new Date();
        targetDate.setDate(today.getDate() + offset);

        const tY = targetDate.getFullYear();
        const tM = String(targetDate.getMonth() + 1).padStart(2, '0');
        const tD = String(targetDate.getDate()).padStart(2, '0');
        const targetStr = `${tY}-${tM}-${tD}`;

        if (dateInput) {
          dateInput.value = targetStr;
          state.selectedDate = targetStr;
        }
      });
    });

    if (btnSetDate) {
      btnSetDate.addEventListener('click', () => {
        if (!state.selectedDate && dateInput) {
          state.selectedDate = dateInput.value;
        }
        if (!state.selectedTime && timeSelect) {
          state.selectedTime = timeSelect.value;
        }

        playSound('chime');
        goToStep(4);
      });
    }
  }

  // --- STEP 4: FOOD SELECTION ---
  function setupStep4() {
    const foodCards = document.querySelectorAll('.food-card');
    const btnFoodNext = document.getElementById('btn-food-next');

    foodCards.forEach((card) => {
      card.addEventListener('click', () => {
        foodCards.forEach((c) => c.classList.remove('selected'));
        card.classList.add('selected');

        state.selectedFood = card.getAttribute('data-food') || 'Pizza';
        state.selectedFoodEmoji = card.getAttribute('data-emoji') || '🍕';

        playSound('pop');

        if (btnFoodNext) {
          btnFoodNext.textContent = `lock in ${state.selectedFood}! ${state.selectedFoodEmoji} ♡`;
        }
      });
    });

    if (btnFoodNext) {
      btnFoodNext.addEventListener('click', () => {
        playSound('chime');
        goToStep(5);
      });
    }
  }

  // --- STEP 5: CONFIRMATION LETTER ---
  function updateLetterSummary() {
    // Format friendly date string
    let displayDate = state.selectedDate;
    if (state.selectedDate) {
      try {
        const parts = state.selectedDate.split('-');
        if (parts.length === 3) {
          const dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
          displayDate = dateObj.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'short',
            day: 'numeric'
          });
        }
      } catch (e) {
        displayDate = state.selectedDate;
      }
    } else {
      displayDate = 'This Friday';
    }

    const pillDate = document.getElementById('summary-date');
    const pillTime = document.getElementById('summary-time');
    const pillFood = document.getElementById('summary-food');

    if (pillDate) pillDate.innerHTML = `📅 <strong>Date:</strong> ${displayDate}`;
    if (pillTime) pillTime.innerHTML = `⏰ <strong>Time:</strong> ${state.selectedTime || '6:00 PM'}`;
    if (pillFood) pillFood.innerHTML = `🍽️ <strong>Cuisine:</strong> ${state.selectedFood} ${state.selectedFoodEmoji}`;
  }

  function setupStep5() {
    const btnAcceptLetter = document.getElementById('btn-accept-letter');
    if (btnAcceptLetter) {
      btnAcceptLetter.addEventListener('click', () => {
        playSound('fanfare');
        goToStep(6);
      });
    }
  }

  // --- STEP 6: JOKE PAYWALL & FINAL RECEIPT MODAL ---
  function setupStep6() {
    const btnPay = document.getElementById('btn-pay');
    const linkGoBack = document.getElementById('link-go-back');
    const promoBtn = document.getElementById('btn-apply-promo');
    const promoInput = document.getElementById('promo-code-input');
    const priceDisplay = document.getElementById('price-display');
    const modalOverlay = document.getElementById('receipt-modal');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnDownloadIcs = document.getElementById('btn-download-ics');
    const btnCopyScreenshot = document.getElementById('btn-copy-screenshot');
    const btnRestart = document.getElementById('btn-restart-app');

    // Promo code handler
    function applyDiscount() {
      const code = (promoInput.value || '').trim().toUpperCase();
      if (code === 'UR_CUTE' || code === 'FREE' || code === 'DISCOUNT' || code === 'LOVE' || code === 'IT') {
        state.discountApplied = true;
        playSound('fanfare');
        triggerConfetti(1500);

        if (priceDisplay) {
          priceDisplay.innerHTML = `<span class="strikethrough">$499</span> <span class="currency">$</span>0.00`;
          priceDisplay.classList.add('discounted');
        }
        if (btnPay) {
          btnPay.innerHTML = `pay $0.00 & confirm ♡`;
        }
        showToast('Promo code applied! 100% OFF for being exceptionally cute 🎉');
      } else {
        playSound('boing');
        showToast('Invalid code! Try "UR_CUTE" or "FREE" 😉');
      }
    }

    if (promoBtn) {
      promoBtn.addEventListener('click', applyDiscount);
    }
    if (promoInput) {
      promoInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') applyDiscount();
      });
    }

    // Go Back Link Playful Joke
    if (linkGoBack) {
      linkGoBack.addEventListener('click', (e) => {
        e.preventDefault();
        playSound('boing');
        showToast('🔒 403 Forbidden: Contract is legally binding! No takebacks allowed 😉');
      });
    }

    // Pay Button Click
    if (btnPay) {
      btnPay.addEventListener('click', () => {
        playSound('fanfare');
        triggerConfetti(4000);

        // Populate Receipt Modal
        const receiptDate = document.getElementById('receipt-date');
        const receiptTime = document.getElementById('receipt-time');
        const receiptFood = document.getElementById('receipt-food');

        if (receiptDate) receiptDate.textContent = state.selectedDate || 'Upcoming Friday';
        if (receiptTime) receiptTime.textContent = state.selectedTime || '6:00 PM';
        if (receiptFood) receiptFood.textContent = `${state.selectedFood} ${state.selectedFoodEmoji}`;

        if (modalOverlay) {
          modalOverlay.classList.add('active');
        }
      });
    }

    if (btnCloseModal) {
      btnCloseModal.addEventListener('click', () => {
        playSound('pop');
        if (modalOverlay) modalOverlay.classList.remove('active');
      });
    }

    // Download .ics Calendar File
    if (btnDownloadIcs) {
      btnDownloadIcs.addEventListener('click', () => {
        playSound('pop');
        generateIcsFile();
      });
    }

    // Copy Screenshot / Text message
    if (btnCopyScreenshot) {
      btnCopyScreenshot.addEventListener('click', () => {
        playSound('pop');
        const msg = `Hey! I just officially accepted your date on that website you made 🚗💕 Date: ${state.selectedDate || 'This Friday'} at ${state.selectedTime || '6:00 PM'} for ${state.selectedFood} ${state.selectedFoodEmoji}! Don't be late! ♡`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(msg).then(() => {
            showToast('Copied confirmation text to clipboard! Paste it to him 📲');
          }).catch(() => {
            prompt('Copy this confirmation text to send to him:', msg);
          });
        } else {
          prompt('Copy this confirmation text to send to him:', msg);
        }
      });
    }

    // Restart Application
    if (btnRestart) {
      btnRestart.addEventListener('click', () => {
        playSound('pop');
        if (modalOverlay) modalOverlay.classList.remove('active');
        state.dodgeCount = 0;
        state.discountApplied = false;
        if (priceDisplay) {
          priceDisplay.innerHTML = `<span class="currency">$</span>499`;
          priceDisplay.classList.remove('discounted');
        }
        if (btnPay) {
          btnPay.innerHTML = `pay $499 & confirm ♡`;
        }
        if (window.resetNoButtonPosition) {
          window.resetNoButtonPosition();
        }
        goToStep(1);
      });
    }
  }

  // --- CALENDAR .ICS FILE GENERATOR ---
  function generateIcsFile() {
    let dateStr = state.selectedDate ? state.selectedDate.replace(/-/g, '') : '20261113';
    let startHour = 18;
    let startMin = 0;

    if (state.selectedTime) {
      const match = state.selectedTime.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (match) {
        let h = parseInt(match[1], 10);
        let m = parseInt(match[2], 10);
        let meridiem = match[3] ? match[3].toUpperCase() : 'PM';
        if (meridiem === 'PM' && h < 12) h += 12;
        if (meridiem === 'AM' && h === 12) h = 0;
        startHour = h;
        startMin = m;
      }
    }

    const pad = (n) => String(n).padStart(2, '0');
    const dtStart = `${dateStr}T${pad(startHour)}${pad(startMin)}00`;
    const dtEnd = `${dateStr}T${pad(startHour + 3)}${pad(startMin)}00`;

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//IT Guy Dating Proposal//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:date-${Date.now()}@dating-proposal.local`,
      `DTSTAMP:${dateStr}T000000Z`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:🌸 The Official Date with IT Guy 🚗`,
      `DESCRIPTION:Menu: ${state.selectedFood} ${state.selectedFoodEmoji}\\nNote: Aux cord privileges granted. Wi-Fi warranty included.\\nStatus: Highly anticipated! ♡`,
      'LOCATION:Your Doorstep (Car arriving at specified time)',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'official-date-invitation.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('Downloaded calendar invite (.ics)! 🗓️');
  }

  // --- SOUND TOGGLE ---
  function setupSoundToggle() {
    const soundBtn = document.getElementById('sound-toggle');
    if (!soundBtn) return;

    soundBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      soundBtn.textContent = state.soundEnabled ? '🔊' : '🔇';
      soundBtn.title = state.soundEnabled ? 'Sound On' : 'Muted';
      if (state.soundEnabled) {
        playSound('pop');
        showToast('Sound effects enabled 🎵');
      } else {
        showToast('Sound muted 🔇');
      }
    });
  }

  // --- INITIALIZATION ---
  document.addEventListener('DOMContentLoaded', () => {
    initAmbientBackground();
    setupSoundToggle();
    setupTeleportingNoButton();
    setupStep2();
    setupStep3();
    setupStep4();
    setupStep5();
    setupStep6();

    // DevTools Sarcastic IT Guy Message
    console.log(
      '%c🌸 DATING PROPOSAL PROTOCOL LOADED 🌸\n%cStatus: 200 OK | Nervousness: 100% | Latency: 0ms\nIf you are inspecting this in DevTools, say YES already! 💻♡',
      'color: #F43F5E; font-size: 16px; font-weight: bold;',
      'color: #4A3B3D; font-size: 12px;'
    );
  });
})();
