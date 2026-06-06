/* ═══════════════════════════════════════════════════════════
   INDDA UNALM · Sistema de Gestión Agroindustrial
   script.js — Lógica de login, dashboard y animaciones
═══════════════════════════════════════════════════════════ */

'use strict';

/* ──────────────────────────────────────────
   CREDENTIALS
────────────────────────────────────────── */
const CREDENTIALS = {
  username: 'admin',
  password: 'indda2026'
};

/* ──────────────────────────────────────────
   DOM REFERENCES
────────────────────────────────────────── */
const loginScreen    = document.getElementById('login-screen');
const dashboardScreen= document.getElementById('dashboard-screen');
const loginForm      = document.getElementById('login-form');
const usernameInput  = document.getElementById('username');
const passwordInput  = document.getElementById('password');
const loginError     = document.getElementById('login-error');
const btnLogin       = document.getElementById('btn-login');
const sidebarEl      = document.getElementById('sidebar');
const topbarDate     = document.getElementById('topbar-date');
const lastSync       = document.getElementById('last-sync');

/* ──────────────────────────────────────────
   SESSION CHECK
   Persist session in sessionStorage so que
   al refrescar no se pierde la sesión.
────────────────────────────────────────── */
(function checkSession() {
  if (sessionStorage.getItem('inddaLoggedIn') === 'true') {
    showDashboard(false); // sin animación de transición
  }
})();

/* ──────────────────────────────────────────
   LOGIN
────────────────────────────────────────── */
function attemptLogin() {
  const user = usernameInput.value.trim();
  const pass = passwordInput.value;

  // Validate
  if (!user || !pass) {
    shakeInputs();
    return;
  }

  // Loading state
  btnLogin.classList.add('loading');
  btnLogin.querySelector('.btn-text').textContent = 'Verificando...';
  loginError.classList.add('hidden');

  // Simulate auth delay (200ms)
  setTimeout(() => {
    if (user === CREDENTIALS.username && pass === CREDENTIALS.password) {
      sessionStorage.setItem('inddaLoggedIn', 'true');
      loginSuccess();
    } else {
      loginFailure();
    }
  }, 350);
}

function loginSuccess() {
  // Fade out login
  loginScreen.style.transition = 'opacity 0.5s ease';
  loginScreen.style.opacity = '0';
  setTimeout(() => {
    loginScreen.classList.add('hidden');
    loginScreen.style.opacity = '';
    showDashboard(true);
    resetLoginForm();
  }, 480);
}

function loginFailure() {
  btnLogin.classList.remove('loading');
  btnLogin.querySelector('.btn-text').textContent = 'Ingresar al Sistema';
  loginError.classList.remove('hidden');
  passwordInput.value = '';
  passwordInput.focus();
  shakeInputs();
}

function shakeInputs() {
  [usernameInput, passwordInput].forEach(el => {
    el.style.borderColor = '#c0392b';
    el.style.animation = 'shake 0.35s ease';
    el.addEventListener('animationend', () => {
      el.style.animation = '';
      el.style.borderColor = '';
    }, { once: true });
  });
}

function resetLoginForm() {
  usernameInput.value = '';
  passwordInput.value = '';
  loginError.classList.add('hidden');
  btnLogin.classList.remove('loading');
  btnLogin.querySelector('.btn-text').textContent = 'Ingresar al Sistema';
}

/* Allow Enter key in form */
[usernameInput, passwordInput].forEach(input => {
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') attemptLogin();
  });
});

/* ──────────────────────────────────────────
   TOGGLE PASSWORD VISIBILITY
────────────────────────────────────────── */
function togglePassword() {
  const isHidden = passwordInput.type === 'password';
  passwordInput.type = isHidden ? 'text' : 'password';
  document.getElementById('pw-eye').className =
    isHidden ? 'fa-regular fa-eye-slash' : 'fa-regular fa-eye';
}

/* ──────────────────────────────────────────
   SHOW DASHBOARD
────────────────────────────────────────── */
function showDashboard(animate) {
  dashboardScreen.classList.remove('hidden');

  if (animate) {
    dashboardScreen.style.opacity = '0';
    requestAnimationFrame(() => {
      dashboardScreen.style.transition = 'opacity 0.45s ease';
      dashboardScreen.style.opacity = '1';
      setTimeout(() => { dashboardScreen.style.transition = ''; }, 460);
    });
  }

  updateTopbarDate();
  updateLastSync();
  startCounters();
  setInterval(updateTopbarDate, 60000);
}

/* ──────────────────────────────────────────
   LOGOUT
────────────────────────────────────────── */
function logout() {
  sessionStorage.removeItem('inddaLoggedIn');

  dashboardScreen.style.transition = 'opacity 0.4s ease';
  dashboardScreen.style.opacity = '0';

  setTimeout(() => {
    dashboardScreen.classList.add('hidden');
    dashboardScreen.style.opacity = '';
    loginScreen.classList.remove('hidden');
    loginScreen.style.opacity = '0';
    setTimeout(() => {
      loginScreen.style.transition = 'opacity 0.4s ease';
      loginScreen.style.opacity = '1';
      setTimeout(() => { loginScreen.style.transition = ''; }, 410);
    }, 10);
  }, 400);
}

/* ──────────────────────────────────────────
   SIDEBAR TOGGLE
────────────────────────────────────────── */
let sidebarCollapsed = false;

function toggleSidebar() {
  sidebarCollapsed = !sidebarCollapsed;
  sidebarEl.classList.toggle('collapsed', sidebarCollapsed);

  const icon = document.querySelector('#sidebar-toggle i');
  icon.className = sidebarCollapsed
    ? 'fa-solid fa-bars-staggered'
    : 'fa-solid fa-bars';
}

/* ──────────────────────────────────────────
   NAV ACTIVE STATE
────────────────────────────────────────── */
function setActive(el) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');

  // Update breadcrumb & title
  const label = el.querySelector('span')?.textContent || 'Dashboard';
  const icon  = el.querySelector('i')?.className || 'fa-solid fa-chart-pie';

  document.querySelector('.page-breadcrumb').innerHTML =
    `<i class="${icon}"></i><span>${label}</span>`;
  document.querySelector('.page-title').textContent =
    NAV_TITLES[label] || label;
}

const NAV_TITLES = {
  'Dashboard':    'Panel de Control General',
  'Producción':   'Gestión de Producción',
  'Inventario':   'Control de Inventario',
  'Calidad':      'Control de Calidad',
  'Maquila':      'Servicios de Maquila',
  'Órdenes':      'Órdenes de Trabajo',
  'Personal':     'Gestión de Personal',
  'Reportes':     'Reportes y Análisis',
  'Configuración':'Configuración del Sistema',
};

/* ──────────────────────────────────────────
   DATE & TIME UTILITIES
────────────────────────────────────────── */
function updateTopbarDate() {
  const now = new Date();
  const opts = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  if (topbarDate) {
    topbarDate.textContent = now.toLocaleDateString('es-PE', opts);
  }
}

function updateLastSync() {
  if (!lastSync) return;
  const now = new Date();
  const hh  = String(now.getHours()).padStart(2, '0');
  const mm  = String(now.getMinutes()).padStart(2, '0');
  const ss  = String(now.getSeconds()).padStart(2, '0');
  lastSync.textContent = `${hh}:${mm}:${ss}`;
}

/* ──────────────────────────────────────────
   KPI COUNTER ANIMATION
────────────────────────────────────────── */
function startCounters() {
  const kpiValues = document.querySelectorAll('.kpi-value[data-target]');

  kpiValues.forEach((el, idx) => {
    const target   = parseInt(el.dataset.target, 10);
    const card     = el.closest('.kpi-card');
    const delay    = parseInt(card?.dataset.delay || 0, 10);
    const duration = 1200;
    const steps    = 60;
    const interval = duration / steps;

    setTimeout(() => {
      let current = 0;
      const step  = target / steps;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current).toLocaleString('es-PE');
      }, interval);
    }, delay);
  });
}

/* ──────────────────────────────────────────
   PROGRESS BAR ANIMATION
   Animate on IntersectionObserver
────────────────────────────────────────── */
(function initProgressBars() {
  const fills = document.querySelectorAll('.prog-fill');

  // Store the target widths, reset to 0 initially
  fills.forEach(fill => {
    fill._targetWidth = fill.style.width;
    fill.style.width = '0';
  });

  if ('IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fill = entry.target;
          setTimeout(() => {
            fill.style.width = fill._targetWidth;
          }, 300);
          obs.unobserve(fill);
        }
      });
    }, { threshold: 0.5 });

    fills.forEach(fill => obs.observe(fill));
  } else {
    // Fallback: just show them
    fills.forEach(fill => { fill.style.width = fill._targetWidth; });
  }
})();

/* ──────────────────────────────────────────
   KEYBOARD SHORTCUTS
────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  // Escape in dashboard → noop (reserved for modals)
  // Ctrl/Cmd + B → toggle sidebar
  if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
    if (!dashboardScreen.classList.contains('hidden')) {
      e.preventDefault();
      toggleSidebar();
    }
  }
  // Ctrl/Cmd + L → logout
  if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
    if (!dashboardScreen.classList.contains('hidden')) {
      e.preventDefault();
      logout();
    }
  }
});

/* ──────────────────────────────────────────
   NOTIF BELL — demo ripple
────────────────────────────────────────── */
document.querySelector('.topbar-notif')?.addEventListener('click', function() {
  this.style.transform = 'scale(0.88)';
  setTimeout(() => { this.style.transform = ''; }, 150);
  // In a real system: open notification panel
});

/* ──────────────────────────────────────────
   PLACEHOLDER BUTTONS — feedback
────────────────────────────────────────── */
document.querySelectorAll('.btn-ph-primary, .btn-ph-secondary').forEach(btn => {
  btn.addEventListener('click', () => {
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Próximamente...';
    btn.disabled = true;
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled = false;
    }, 2000);
  });
});
