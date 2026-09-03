/* ==========================================================
   Home2School Interactive Controller & Navigation Logic
   ========================================================== */

const screens = [
  'splash',
  'onboarding1',
  'onboarding2',
  'onboarding3',
  'authWelcome',
  'authOtp',
  'authProfile',
  'authPhoto',
  'authSuccess',
  'home'
];

let currentScreen = 'splash';

// Navigation router
window.navigateTo = function(screenName) {
  if (!screens.includes(screenName)) return;

  currentScreen = screenName;

  // Hide all screens, show target screen
  document.querySelectorAll('.screen-view').forEach(el => {
    el.classList.remove('active');
  });

  const targetEl = document.getElementById(`screen-${screenName}`);
  if (targetEl) {
    targetEl.classList.add('active');
  }

  // Update desktop showcase tabs
  document.querySelectorAll('.tab-btn').forEach(btn => {
    if (btn.dataset.screen === screenName) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  // Screen specific triggers
  if (screenName === 'authSuccess') {
    triggerCelebrationConfetti();
  } else if (screenName === 'authOtp') {
    focusFirstEmptyOtp();
  }
};

// Desktop tabs click handling
document.getElementById('screenTabs')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-btn');
  if (btn && btn.dataset.screen) {
    window.navigateTo(btn.dataset.screen);
  }
});

// OTP Input Logic
function focusFirstEmptyOtp() {
  const inputs = document.querySelectorAll('.otp-box');
  for (const input of inputs) {
    if (!input.value) {
      input.focus();
      break;
    }
  }
}

document.querySelectorAll('.otp-box').forEach((box, idx, list) => {
  box.addEventListener('input', (e) => {
    if (box.value.length > 1) {
      box.value = box.value.slice(-1);
    }
    if (box.value) {
      box.classList.add('active');
      if (idx < list.length - 1) {
        list[idx + 1].focus();
      } else {
        // Auto continue on 4th digit entered
        setTimeout(() => {
          window.navigateTo('authProfile');
        }, 300);
      }
    } else {
      box.classList.remove('active');
    }
  });

  box.addEventListener('keydown', (e) => {
    if (e.key === 'Backspace' && !box.value && idx > 0) {
      list[idx - 1].focus();
    }
  });
});

// Confetti burst for Success Screen
function triggerCelebrationConfetti() {
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.45 },
      colors: ['var(--color-secondary)', 'var(--color-primary)', '#0284C7', '#F59E0B', '#10B981']
    });
  }
}

// Photo upload trigger & handler
window.triggerPhotoUpload = function() {
  document.getElementById('photoFileInput')?.click();
};

window.handlePhotoUpload = function(event) {
  const file = event.target.files?.[0];
  if (file) {
    const url = URL.createObjectURL(file);
    const container = document.getElementById('avatarPreviewContainer');
    if (container) {
      container.innerHTML = `<img src="${url}" alt="Uploaded Avatar" style="width:100%;height:100%;object-fit:cover;" />`;
    }
  }
};

// Bottom tabs interaction on Home screen
document.querySelectorAll('.bottom-tab-bar .tab-item').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.bottom-tab-bar .tab-item').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
  });
});

// Auto advance from splash after 2.5 seconds if untouched
let splashTimer = setTimeout(() => {
  if (currentScreen === 'splash') {
    window.navigateTo('onboarding1');
  }
}, 3000);

document.getElementById('screen-splash')?.addEventListener('click', () => {
  clearTimeout(splashTimer);
});
