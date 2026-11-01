/**
 * Main Controller & UI Interactions
 * Scroll-spy, sticky navigation, typewriter, animated counters, mobile drawer
 */

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupScrollProgress();
  setupTypewriter();
  setupScrollReveal();
  setupStatsCounter();
  setupSkillProgressBars();
  setupBackToTop();
  updateCurrentYear();
});

// Navigation Controller: Sticky Navbar, Scroll-Spy, Mobile Drawer
function setupNavigation() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileOverlay = document.getElementById('mobile-overlay');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('section[id]');

  // Navbar Scroll Visual State
  const handleScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll Spy: Detect active section
    let currentSection = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentSection = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile Drawer Toggle
  const toggleMobileNav = () => {
    hamburger.classList.toggle('active');
    mobileNav.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
    document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : 'auto';
  };

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileNav);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', toggleMobileNav);
  }

  // Close mobile drawer upon clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (mobileNav && mobileNav.classList.contains('active')) {
        toggleMobileNav();
      }
    });
  });
}

// Reading Scroll Progress Bar at the top of the viewport
function setupScrollProgress() {
  const progressBar = document.getElementById('scroll-progress-bar');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }, { passive: true });
}

// Dynamic Hero Typewriter Effect
function setupTypewriter() {
  const targetElement = document.getElementById('typewriter-output');
  if (!targetElement) return;

  const roles = [
    "Full-Stack Software Engineer",
    "Cybersecurity Specialist",
    "AI & Machine Learning Developer",
    "Network Systems Architect"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      targetElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      targetElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full word
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

// Scroll Reveal Animations via IntersectionObserver
function setupScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-init');

  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('reveal-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

// Stats Numbers Animated Counter on Scroll Reveal
function setupStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let hasAnimated = false;

  const animateCounters = () => {
    statNumbers.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target'));
      const suffix = stat.getAttribute('data-suffix') || '';
      const decimals = parseInt(stat.getAttribute('data-decimals') || '0', 10);
      const duration = 1800; // ms
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Easing out cubic
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentValue = target * easeOut;

        stat.textContent = `${currentValue.toFixed(decimals)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          stat.textContent = `${target.toFixed(decimals)}${suffix}`;
        }
      }

      requestAnimationFrame(update);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        animateCounters();
      }
    });
  }, { threshold: 0.25 });

  const statsSection = document.getElementById('about');
  if (statsSection) observer.observe(statsSection);
}

// Technical Skills Progress Bar Animation on View
function setupSkillProgressBars() {
  const skillBars = document.querySelectorAll('.progress-bar-fill');
  if (!skillBars.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillBars.forEach(bar => {
          const percent = bar.getAttribute('data-percent');
          bar.style.width = `${percent}%`;
        });
        obs.disconnect();
      }
    });
  }, { threshold: 0.15 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) observer.observe(skillsSection);
}

// Back-to-Top Floating Button with Circular SVG Scroll Progress
function setupBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  const progressCircle = document.querySelector('.progress-circle');

  if (!backToTopBtn) return;

  const circumference = 2 * Math.PI * 25; // r=25 => 157.08
  if (progressCircle) {
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;
  }

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Toggle button visibility
    if (scrollPos > 350) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }

    // Update circular SVG progress
    if (progressCircle && totalHeight > 0) {
      const progress = scrollPos / totalHeight;
      const offset = circumference - (progress * circumference);
      progressCircle.style.strokeDashoffset = offset;
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Auto update current year in footer
function updateCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
