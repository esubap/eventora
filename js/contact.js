/**
 * Contact Form Controller & Toast Notification System
 * Client-side validation, clipboard copy, and interactive feedback
 */

document.addEventListener('DOMContentLoaded', () => {
  setupContactForm();
  setupCopyEmail();
});

// Toast Notification Engine
function showToast(title, message, type = 'success') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconClass = type === 'success' 
    ? 'fa-solid fa-circle-check' 
    : 'fa-solid fa-triangle-exclamation';

  toast.innerHTML = `
    <div class="toast-icon">
      <i class="${iconClass}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;

  container.appendChild(toast);

  // Auto remove after 4.5 seconds
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(15px)';
    setTimeout(() => {
      toast.remove();
    }, 350);
  }, 4500);
}

// Contact Form Handler with Validation
function setupContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const subjectInput = document.getElementById('form-subject');
  const messageInput = document.getElementById('form-message');
  const submitBtn = document.getElementById('form-submit-btn');

  // Email regex validator
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Helper to mark validation error
  const setError = (input, message) => {
    input.classList.add('is-invalid');
    const feedback = input.parentElement.querySelector('.form-feedback');
    if (feedback) feedback.textContent = message;
  };

  // Helper to clear validation error
  const clearError = (input) => {
    input.classList.remove('is-invalid');
    const feedback = input.parentElement.querySelector('.form-feedback');
    if (feedback) feedback.textContent = '';
  };

  // Live input error clearing on typing
  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => clearError(input));
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasErrors = false;

    // Validate Name
    if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
      setError(nameInput, 'Please enter your full name (at least 2 characters).');
      hasErrors = true;
    } else {
      clearError(nameInput);
    }

    // Validate Email
    if (!emailInput.value.trim() || !isValidEmail(emailInput.value.trim())) {
      setError(emailInput, 'Please provide a valid email address (e.g. name@domain.com).');
      hasErrors = true;
    } else {
      clearError(emailInput);
    }

    // Validate Subject
    if (!subjectInput.value.trim() || subjectInput.value.trim().length < 3) {
      setError(subjectInput, 'Please specify a subject for your inquiry.');
      hasErrors = true;
    } else {
      clearError(subjectInput);
    }

    // Validate Message
    if (!messageInput.value.trim() || messageInput.value.trim().length < 10) {
      setError(messageInput, 'Please enter a detailed message (at least 10 characters).');
      hasErrors = true;
    } else {
      clearError(messageInput);
    }

    if (hasErrors) {
      showToast('Validation Error', 'Please check the highlighted fields above.', 'error');
      return;
    }

    // Enter loading state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending Transmission...`;

    // Simulate Network API Transmission
    setTimeout(() => {
      const senderName = nameInput.value.trim();
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      showToast(
        'Message Sent Successfully!',
        `Thank you ${senderName}. Your transmission has been received. I will reply within 24 hours.`,
        'success'
      );
    }, 1200);
  });
}

// Setup Copy Email to Clipboard
function setupCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailTextEl = document.getElementById('my-email-address');

  if (!copyBtn || !emailTextEl) return;

  copyBtn.addEventListener('click', () => {
    const email = emailTextEl.textContent.trim();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email).then(() => {
        handleCopySuccess(copyBtn);
      }).catch(() => {
        fallbackCopy(email, copyBtn);
      });
    } else {
      fallbackCopy(email, copyBtn);
    }
  });

  function fallbackCopy(text, btn) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      handleCopySuccess(btn);
    } catch (err) {
      showToast('Copy Failed', 'Please manually copy the email address.', 'error');
    }
    document.body.removeChild(textArea);
  }

  function handleCopySuccess(btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = `<i class="fa-solid fa-check"></i> Copied!`;
    btn.style.borderColor = 'var(--accent-emerald)';
    btn.style.color = 'var(--accent-emerald)';

    showToast('Copied to Clipboard', 'Email address copied to your clipboard.', 'success');

    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 2500);
  }
}
