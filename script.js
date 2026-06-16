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




/* ══════════════════════════════════════════════════════════
   DATOS REALES BD INDDA v3 — Extraídos del Excel
══════════════════════════════════════════════════════════ */
const BD = {
  // ── KPIs base ──────────────────────────────────────────
  kpis: {
    todos:       { lotes:300, perdida:5890.99, pct:3.75, rechazados:33 },
    Aprobado:    { lotes:225, perdida:0,        pct:1.45, rechazados:0  },
    'En revision':{ lotes:42, perdida:1800,     pct:5.57, rechazados:0  },
    Rechazado:   { lotes:33,  perdida:4090.99,  pct:17.10,rechazados:33 },
  },

  // ── Lotes por línea ────────────────────────────────────
  lotesPorLinea: {
    labels: ['Bebidas','Harinas','Snacks','Lácteos'],
    todos:      [126, 67, 64, 43],
    Aprobado:   [95,  51, 48, 31],
    'En revision':[19, 9, 10, 4],
    Rechazado:  [12,  7,  6,  8],
  },

  // ── Estados ─────────────────────────────────────────────
  estados: { labels:['Aprobado','En revisión','Rechazado'], data:[225,42,33] },

  // ── Producción mensual ──────────────────────────────────
  produccionMensual: {
    labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Set','Oct','Nov','Dic'],
    Bebidas: [2280.1,2150.3,4980.2,2100.5,1920.4,5210.8,2480.3,2790.1,2910.2,3220.4,1250.3,2940.1],
    Harinas: [1150.2,980.4, 2010.3,1020.1,980.2, 2110.4,1220.3,1480.2,1420.1,1680.2,680.2, 1510.2],
    Snacks:  [980.1, 820.3, 1590.4,880.2, 780.1, 1680.2,1010.1,1190.3,1140.2,1390.1,640.1, 1230.4],
    Lacteos: [1485.0,1474.1,1497.2,1491.8,1508.6,1516.4,1544.2,1548.8,1703.5,1799.2,770.5, 1708.4],
    total:   [5895.3,5425.1,10078.1,5492.6,5189.3,10517.8,6254.9,7009.4,7174.0,8089.9,3341.1,7389.1],
  },

  // ── Por producto ─────────────────────────────────────────
  productosCantidad: {
    labels: ['Néctar Maracuyá','Néctar Mango','Beb. Maíz Morado','Yogurt Natural','Harina Kiwicha','Harina Quinua','Barra Cereales','Chocolate Cacao'],
    data:   [18520.1,15318.3,14897.1,11805.9,7146.5,6068.1,4388.5,3712.1],
  },

  // ── % Defectuoso por producto ───────────────────────────
  defectoPorProducto: {
    labels: ['Chocolate Cacao','Néctar Mango','Yogurt Natural','Néctar Maracuyá','Beb. Maíz Morado','Harina Quinua','Harina Kiwicha','Barra Cereales'],
    data:   [4.49, 3.99, 3.80, 3.77, 3.69, 3.50, 3.45, 3.38],
  },

  // ── Tipo defecto ─────────────────────────────────────────
  defectoPorTipo: {
    labels: ['Acidez','Color','Textura','Por definir','Contaminación','Peso'],
    data:   [144, 139, 112, 75, 34, 14],
  },

  // ── Responsable ──────────────────────────────────────────
  responsable: {
    labels:       ['Ing. Quispe','Ing. Ramos','Ing. Torres','Tec. Flores','Tec. Mamani'],
    n_lotes:      [75,  62,  48,  63,  52],
    pct_def:      [3.98,2.74,3.38,4.49,4.08],
    perdida:      [1411.75,574.33,563.20,2203.54,1138.17],
    tasa_apro:    [72.0,82.3,79.2,69.8,73.1],
  },

  // ── Turno ────────────────────────────────────────────────
  turno: {
    labels:  ['Mañana','Tarde'],
    n:       [153, 147],
    pct_def: [4.07, 3.42],
    perdida: [3230.05, 2660.94],
  },

  // ── Stock ────────────────────────────────────────────────
  stock: {
    labels:      ['Quinua','Kiwicha','Maíz morado','Maracuyá','Mango','Leche fresca','Azúcar','Sal','Aceite vegetal','Harina trigo','Stevia','Cacao','Avena','Lúcuma','Jengibre'],
    disponible:  [923.3,943.4,357.5,847.4,677.6,567.2,762.9,221.2,691.3,734.6,512.0,747.2,941.2,329.9,516.1],
    minimo:      [50,   50,   80,   60,   60,   30,   100,  40,   20,   80,   10,   15,   40,   20,   10],
  },

  // ── Estadísticos para conclusiones ──────────────────────
  stats: {
    pct_def_mean: 3.75, pct_def_std: 4.42,
    q25: 1.11, q75: 4.57, iqr: 3.46,
    umbral_atipico: 6.11,
    n_atipicos: 49,
    n_errores: 10,
    corr_tiempo_defecto: -0.24,
    meses_pico: ['Marzo','Junio'],
    mejor_responsable: 'Ing. Ramos',
    peor_responsable: 'Tec. Flores',
  }
};

// Estado activo de filtros (múltiple selección)
let filtrosActivos = new Set(['todos']);
let charts = {};
let lotesEditables = JSON.parse(JSON.stringify(BD.lotesPorLinea.todos));
let estadosEditables = [...BD.estados.data];

const COLORES = {
  verde:   '#2d5a3d', verde2:  '#4e9164', dorado: '#c9a84c',
  teal:    '#2e7d78', amber:   '#b07d28', rojo:   '#c0392b',
  gris:    '#e8ebe6', azul:    '#1F4E79',
  aprobado:'#27ae60', revision:'#2e7d78', rechazado:'#c0392b',
};

/* ──────────────────────────────────────────
   FILTROS MÚLTIPLES
────────────────────────────────────────── */
function toggleFiltro(val, el) {
  if (val === 'todos') {
    filtrosActivos.clear();
    filtrosActivos.add('todos');
    document.querySelectorAll('#filter-estado .fpill').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
  } else {
    filtrosActivos.delete('todos');
    document.querySelector('#filter-estado .fpill[data-val="todos"]').classList.remove('active');
    if (filtrosActivos.has(val)) {
      filtrosActivos.delete(val);
      el.classList.remove('active');
      if (filtrosActivos.size === 0) {
        filtrosActivos.add('todos');
        document.querySelector('#filter-estado .fpill[data-val="todos"]').classList.add('active');
      }
    } else {
      filtrosActivos.add(val);
      el.classList.add('active');
    }
  }
  actualizarTodo();
}

function getEstadosFiltrados() {
  if (filtrosActivos.has('todos')) return ['Aprobado','En revision','Rechazado'];
  return [...filtrosActivos];
}

function actualizarTodo() {
  const estados = getEstadosFiltrados();
  // KPIs
  let totalLotes=0, totalPerdida=0, sumPct=0, totalRech=0, n=0;
  estados.forEach(e => {
    const k = e === 'En revision' ? 'En revision' : e;
    const d = BD.kpis[k] || BD.kpis.todos;
    totalLotes  += d.lotes;
    totalPerdida+= d.perdida;
    sumPct      += d.pct * d.lotes;
    totalRech   += d.rechazados;
    n           += d.lotes;
  });
  const avgPct = n > 0 ? sumPct/n : 0;

  const kpis = document.querySelectorAll('.kpi-value');
  if (kpis[0]) kpis[0].textContent = totalLotes.toLocaleString('es-PE');
  if (kpis[1]) kpis[1].textContent = 'S/ ' + totalPerdida.toLocaleString('es-PE', {minimumFractionDigits:2, maximumFractionDigits:2});
  if (kpis[2]) kpis[2].textContent = avgPct.toFixed(2) + '%';
  if (kpis[3]) kpis[3].textContent = totalRech;

  // Gráfico barras por línea
  if (charts.lineas) {
    let lineasData;
    if (filtrosActivos.has('todos')) {
      lineasData = BD.lotesPorLinea.todos;
    } else {
      lineasData = [0,0,0,0];
      estados.forEach(e => {
        const key = e === 'En revision' ? 'En revision' : e;
        const d = BD.lotesPorLinea[key] || [0,0,0,0];
        d.forEach((v,i) => lineasData[i] += v);
      });
    }
    charts.lineas.data.datasets[0].data = lineasData;
    charts.lineas.update();
  }

  // Dona estados
  if (charts.estados) {
    const selData = filtrosActivos.has('todos')
      ? [225,42,33]
      : BD.estados.labels.map((l,i) => {
          const key = l === 'En revisión' ? 'En revision' : l;
          return estados.includes(key) ? BD.estados.data[i] : 0;
        });
    charts.estados.data.datasets[0].data = selData;
    charts.estados.update();
  }

  actualizarConclusiones();
}

/* ──────────────────────────────────────────
   TABS
────────────────────────────────────────── */
function setTab(nombre, el) {
  document.querySelectorAll('.atab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-' + nombre).classList.add('active');
  setTimeout(() => {
    if (nombre === 'produccion')  initProduccion();
    if (nombre === 'calidad')     initCalidad();
    if (nombre === 'inventario')  initInventario();
    if (nombre === 'responsable') initResponsable();
  }, 50);
}

/* ──────────────────────────────────────────
   INIT CHARTS
────────────────────────────────────────── */
function initCharts() {
  initResumen();
  actualizarConclusiones();
}

function initResumen() {
  const c1 = document.getElementById('chart-lineas');
  if (c1 && !charts.lineas) {
    charts.lineas = new Chart(c1, {
      type: 'bar',
      data: {
        labels: BD.lotesPorLinea.labels,
        datasets: [{
          label: 'Lotes', data: BD.lotesPorLinea.todos,
          backgroundColor: [COLORES.verde, COLORES.teal, COLORES.dorado, COLORES.amber],
          borderRadius: 7, borderSkipped: false,
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: true,
        plugins: { legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.raw} lotes (${(ctx.raw/300*100).toFixed(1)}%)` } }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f0f0f0' }, ticks: { font: { family: 'DM Mono', size: 11 } } },
          x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 13 } } }
        }
      }
    });
  }

  const c2 = document.getElementById('chart-estados');
  if (c2 && !charts.estados) {
    charts.estados = new Chart(c2, {
      type: 'doughnut',
      data: {
        labels: BD.estados.labels,
        datasets: [{ data: [...BD.estados.data],
          backgroundColor: [COLORES.aprobado, COLORES.teal, COLORES.rechazado],
          borderWidth: 3, borderColor: '#fff'
        }]
      },
      options: {
        responsive: true, cutout: '65%',
        plugins: {
          legend: { position: 'bottom', labels: { font: { family: 'DM Sans', size: 12 }, padding: 16 } },
          tooltip: { callbacks: { label: ctx => {
            const t = ctx.dataset.data.reduce((a,b)=>a+b,0);
            return ` ${ctx.label}: ${ctx.raw} (${t>0?(ctx.raw/t*100).toFixed(1):0}%)`;
          }}}
        }
      }
    });
  }
}

function initProduccion() {
  const c3 = document.getElementById('chart-mensual');
  if (c3 && !charts.mensual) {
    charts.mensual = new Chart(c3, {
      type: 'bar',
      data: {
        labels: BD.produccionMensual.labels,
        datasets: [
          { label:'Bebidas',  data: BD.produccionMensual.Bebidas,  backgroundColor: COLORES.verde,  borderRadius:4 },
          { label:'Harinas',  data: BD.produccionMensual.Harinas,  backgroundColor: COLORES.teal,   borderRadius:4 },
          { label:'Snacks',   data: BD.produccionMensual.Snacks,   backgroundColor: COLORES.dorado, borderRadius:4 },
          { label:'Lácteos',  data: BD.produccionMensual.Lacteos,  backgroundColor: COLORES.amber,  borderRadius:4 },
        ]
      },
      options: {
        responsive: true, scales: {
          x: { stacked: true, grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 12 } } },
          y: { stacked: true, beginAtZero: true, grid: { color: '#f0f0f0' },
            ticks: { font: { family: 'DM Mono', size: 11 }, callback: v => v>=1000?(v/1000).toFixed(0)+'k':v }
          }
        },
        plugins: { legend: { position: 'top', labels: { font: { family: 'DM Sans', size: 12 } } },
          tooltip: { mode: 'index', intersect: false }
        }
      }
    });
  }

  const c4 = document.getElementById('chart-productos');
  if (c4 && !charts.productos) {
    charts.productos = new Chart(c4, {
      type: 'bar', indexAxis: 'y',
      data: {
        labels: BD.productosCantidad.labels,
        datasets: [{ label:'Cantidad', data: BD.productosCantidad.data,
          backgroundColor: [COLORES.verde,COLORES.verde,COLORES.verde2,COLORES.teal,COLORES.dorado,COLORES.dorado,COLORES.amber,COLORES.amber],
          borderRadius: 5
        }]
      },
      options: {
        responsive: true, plugins: { legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.raw.toLocaleString('es-PE')} unidades` } }
        },
        scales: {
          x: { beginAtZero: true, grid: { color: '#f0f0f0' }, ticks: { font: { family: 'DM Mono', size: 11 }, callback: v => v>=1000?(v/1000).toFixed(0)+'k':v } },
          y: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 12 } } }
        }
      }
    });
  }
}

function initCalidad() {
  const c5 = document.getElementById('chart-defecto-prod');
  if (c5 && !charts.defProd) {
    charts.defProd = new Chart(c5, {
      type: 'bar',
      data: {
        labels: BD.defectoPorProducto.labels,
        datasets: [{
          label:'% defectuoso', data: BD.defectoPorProducto.data,
          backgroundColor: BD.defectoPorProducto.data.map(v =>
            v >= BD.stats.umbral_atipico ? COLORES.rechazado : v >= 4.2 ? COLORES.amber : COLORES.teal
          ),
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.raw.toFixed(2)}%` } },
          annotation: {}
        },
        scales: {
          y: { beginAtZero: true, max: 6, grid: { color: '#f0f0f0' },
            ticks: { font: { family: 'DM Mono', size: 11 }, callback: v => v+'%' }
          },
          x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 11 }, maxRotation: 30 } }
        }
      }
    });
  }

  const c6 = document.getElementById('chart-defecto-tipo');
  if (c6 && !charts.defTipo) {
    charts.defTipo = new Chart(c6, {
      type: 'bar',
      data: {
        labels: BD.defectoPorTipo.labels,
        datasets: [{ label:'Casos', data: BD.defectoPorTipo.data,
          backgroundColor: [COLORES.rechazado,COLORES.amber,COLORES.dorado,COLORES.teal,COLORES.verde2,COLORES.verde],
          borderRadius: 5
        }]
      },
      options: {
        responsive: true, plugins: { legend: { display: false },
          tooltip: { callbacks: { label: ctx => ` ${ctx.raw} casos (${(ctx.raw/518*100).toFixed(1)}%)` } }
        },
        scales: {
          y: { beginAtZero: true, grid: { color: '#f0f0f0' }, ticks: { font: { family: 'DM Mono', size: 11 } } },
          x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 12 } } }
        }
      }
    });
  }
}

function initResponsable() {
  const c7 = document.getElementById('chart-responsable');
  if (c7 && !charts.resp) {
    charts.resp = new Chart(c7, {
      type: 'bar',
      data: {
        labels: BD.responsable.labels,
        datasets: [
          { label:'Tasa aprobación (%)', data: BD.responsable.tasa_apro, backgroundColor: COLORES.verde, borderRadius:5, yAxisID:'y' },
          { label:'% Defectuoso prom.',  data: BD.responsable.pct_def,   backgroundColor: COLORES.amber, borderRadius:5, yAxisID:'y2' },
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: 'top', labels: { font: { family: 'DM Sans', size: 12 } } },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          y:  { beginAtZero: true, max: 100, grid: { color: '#f0f0f0' }, ticks: { font: { family: 'DM Mono', size: 11 }, callback: v => v+'%' }, position:'left' },
          y2: { beginAtZero: true, max: 8,   grid: { display: false },   ticks: { font: { family: 'DM Mono', size: 11 }, callback: v => v+'%' }, position:'right' },
          x:  { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 12 } } }
        }
      }
    });
  }

  // Tabla responsable
  const t = document.getElementById('tabla-responsable');
  if (t && !t.innerHTML.includes('thead')) {
    t.innerHTML = `<thead><tr>
      <th>Responsable</th><th>Lotes</th><th>% Defect.</th><th>Pérdida S/</th><th>Tasa Aprob.</th><th>Desempeño</th>
    </tr></thead><tbody>
    ${BD.responsable.labels.map((l,i) => {
      const score = BD.responsable.tasa_apro[i];
      const badge = score >= 80 ? '<span class="badge-ok">Óptimo</span>' : score >= 72 ? '<span class="badge-warn">Regular</span>' : '<span class="badge-rojo">Bajo</span>';
      return `<tr>
        <td><strong>${l}</strong></td>
        <td>${BD.responsable.n_lotes[i]}</td>
        <td>${BD.responsable.pct_def[i].toFixed(2)}%</td>
        <td>S/ ${BD.responsable.perdida[i].toLocaleString('es-PE')}</td>
        <td>${BD.responsable.tasa_apro[i]}%</td>
        <td>${badge}</td>
      </tr>`;
    }).join('')}
    </tbody>`;
  }
}

function initInventario() {
  const c8 = document.getElementById('chart-stock');
  if (c8 && !charts.stock) {
    charts.stock = new Chart(c8, {
      type: 'bar',
      data: {
        labels: BD.stock.labels,
        datasets: [
          { label:'Stock disponible', data: BD.stock.disponible,
            backgroundColor: BD.stock.disponible.map((v,i) => v < BD.stock.minimo[i] ? COLORES.rechazado : COLORES.verde),
            borderRadius: 4
          },
          { label:'Stock mínimo', data: BD.stock.minimo,
            backgroundColor: 'rgba(201,168,76,0.75)', borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position:'top', labels:{ font:{ family:'DM Sans', size:12 } } },
          tooltip: { mode:'index', intersect:false,
            callbacks: { afterBody: (items) => {
              const i = items[0].dataIndex;
              const ratio = BD.stock.disponible[i] / BD.stock.minimo[i];
              return `Cobertura: ${ratio.toFixed(1)}x el mínimo`;
            }}
          }
        },
        scales: {
          x: { grid:{display:false}, ticks:{font:{family:'DM Sans',size:10}, maxRotation:35} },
          y: { beginAtZero:true, grid:{color:'#f0f0f0'}, ticks:{font:{family:'DM Mono',size:11}} }
        }
      }
    });
  }

  const t2 = document.getElementById('tabla-stock');
  if (t2 && !t2.innerHTML.includes('thead')) {
    t2.innerHTML = `<thead><tr>
      <th>Insumo</th><th>Disponible</th><th>Mínimo</th><th>Cobertura</th><th>Estado</th>
    </tr></thead><tbody>
    ${BD.stock.labels.map((l,i) => {
      const ok = BD.stock.disponible[i] >= BD.stock.minimo[i];
      const ratio = (BD.stock.disponible[i]/BD.stock.minimo[i]).toFixed(1);
      return `<tr>
        <td>${l}</td>
        <td>${BD.stock.disponible[i].toLocaleString('es-PE')}</td>
        <td>${BD.stock.minimo[i]}</td>
        <td>${ratio}x</td>
        <td class="${ok ? 'ok-val' : 'warn-val'}">${ok ? '✓ OK' : '⚠ Crítico'}</td>
      </tr>`;
    }).join('')}
    </tbody>`;
  }
}

/* ──────────────────────────────────────────
   CONCLUSIONES AUTOMÁTICAS (SENIOR ESTADÍSTICO)
────────────────────────────────────────── */
function actualizarConclusiones() {
  const estados = getEstadosFiltrados();
  const isTodos = filtrosActivos.has('todos');
  const box = document.getElementById('conclusiones-box');
  if (!box) return;

  let conclusiones = [];

  if (isTodos || estados.length > 1) {
    // Conclusiones globales
    conclusiones = [
      { tipo:'info',  icon:'fa-chart-line',
        texto:`<strong>Producción concentrada en 2 picos:</strong> Marzo (10,078 uds) y Junio (10,518 uds) representan el 28% de la producción anual. Noviembre registra el mínimo (3,341 uds). Se sugiere revisar la planificación de capacidad en meses de baja demanda.` },
      { tipo:'warn',  icon:'fa-triangle-exclamation',
        texto:`<strong>49 lotes atípicos detectados (IQR):</strong> El umbral estadístico (Q75 + 1.5×IQR) es ${BD.stats.umbral_atipico}%. Los 49 lotes que superan este umbral representan el 16.3% del total y generan el 69.5% de la pérdida total (S/ 4,090).` },
      { tipo:'danger',icon:'fa-user-xmark',
        texto:`<strong>Tec. Flores presenta el mayor riesgo:</strong> Con 4.49% de defectuoso promedio y S/ 2,203.54 en pérdidas, genera el 37.4% de la pérdida total del sistema con solo el 21% de los lotes. Tasa de aprobación: 69.8% (la más baja).` },
      { tipo:'ok',    icon:'fa-star',
        texto:`<strong>Ing. Ramos lidera el desempeño:</strong> 82.3% de tasa de aprobación, 2.74% de defectuoso promedio y solo S/ 574 en pérdidas totales. Su desempeño es el benchmark recomendado para la estandarización de procesos.` },
      { tipo:'info',  icon:'fa-clock',
        texto:`<strong>Turno Mañana genera 19% más pérdida que Tarde:</strong> S/ 3,230 vs S/ 2,661. También presenta 0.65 pp más de % defectuoso (4.07% vs 3.42%). Recomendable revisar condiciones de trabajo y supervisión en turno matutino.` },
      { tipo:'ok',    icon:'fa-seedling',
        texto:`<strong>Bebidas es la línea más eficiente:</strong> Con 126 lotes (42% del total) y la mayor producción acumulada. Chocolate de Cacao tiene el mayor % defectuoso (4.49%) — analizar el proceso de templado y control de temperatura.` },
    ];
  } else if (estados.includes('Aprobado')) {
    conclusiones = [
      { tipo:'ok', icon:'fa-check-circle', texto:`<strong>225 lotes aprobados (75%):</strong> % defectuoso promedio de 1.45% — bien dentro del límite ISO 9001. Pérdida = S/ 0 por política de calidad.` },
      { tipo:'ok', icon:'fa-chart-bar',    texto:`<strong>Distribución equilibrada:</strong> Bebidas lidera con 95 lotes aprobados. Ningún insumo en stock crítico para esta línea de producción.` },
    ];
  } else if (estados.includes('En revision')) {
    conclusiones = [
      { tipo:'warn', icon:'fa-hourglass-half', texto:`<strong>42 lotes en revisión (14%):</strong> % defectuoso promedio de 5.57% — por encima del umbral de aprobación (3.02%). Estos lotes están pendientes de resolución y representan riesgo de pérdida adicional.` },
      { tipo:'warn', icon:'fa-flask-vial',     texto:`<strong>Defecto más frecuente en revisión: "Por definir"</strong> (75 casos). Indica que la categoría de falla aún no ha sido diagnosticada. Priorizar inspección técnica.` },
    ];
  } else if (estados.includes('Rechazado')) {
    conclusiones = [
      { tipo:'danger', icon:'fa-xmark-circle', texto:`<strong>33 lotes rechazados (11%):</strong> % defectuoso promedio de 17.10% — 11.5 veces el nivel de lotes aprobados. Generan S/ 4,090.99 (69.5% de la pérdida total) con solo el 11% de los lotes.` },
      { tipo:'danger', icon:'fa-money-bill-trend-up', texto:`<strong>Impacto económico desproporcionado:</strong> Costo de no calidad = S/ 4,090.99 en lotes rechazados. La acción correctiva más frecuente es Reproceso (40%), seguida de Descarte (30%). Descarte implica pérdida irrecuperable.` },
    ];
  }

  box.innerHTML = conclusiones.map(c => `
    <div class="conclusion-item ${c.tipo}">
      <i class="fa-solid ${c.icon}"></i>
      <p>${c.texto}</p>
    </div>
  `).join('');
}

/* ──────────────────────────────────────────
   AGREGAR DATO NUEVO + DETECCIÓN ATÍPICOS (IQR real)
────────────────────────────────────────── */
function agregarDato() {
  const linea  = document.getElementById('nuevo-linea').value;
  const qty    = parseFloat(document.getElementById('nuevo-qty').value);
  const def    = parseFloat(document.getElementById('nuevo-def').value);
  const estado = document.getElementById('nuevo-estado').value;

  if (!qty || isNaN(qty) || isNaN(def) || def === '') {
    mostrarAlerta('Por favor completa cantidad producida y defectuosa.', 'warn'); return;
  }
  if (def > qty) {
    mostrarAlerta('Dato inválido: la cantidad defectuosa no puede superar la producida.', 'critica'); return;
  }
  if (qty <= 0) {
    mostrarAlerta('Dato inválido: la cantidad producida debe ser mayor a 0.', 'critica'); return;
  }

  const pct = (def / qty) * 100;
  const idx = ['Bebidas','Harinas','Lacteos','Snacks'].indexOf(linea);

  // Actualizar datos editables
  if (idx >= 0) lotesEditables[idx]++;
  const eIdx = { 'Aprobado':0, 'En revision':1, 'Rechazado':2 }[estado];
  if (eIdx !== undefined) estadosEditables[eIdx]++;

  // Actualizar gráficos
  if (charts.lineas) { charts.lineas.data.datasets[0].data = [...lotesEditables]; charts.lineas.update(); }
  if (charts.estados) { charts.estados.data.datasets[0].data = [...estadosEditables]; charts.estados.update(); }

  // KPI total lotes
  const kpis = document.querySelectorAll('.kpi-value');
  const totalLotes = lotesEditables.reduce((a,b)=>a+b,0);
  if (kpis[0]) kpis[0].textContent = totalLotes.toLocaleString('es-PE');

  // Detección de dato atípico con IQR real
  let msg = '', tipo = 'ok';
  if (pct > BD.stats.umbral_atipico) {
    msg = `🚨 DATO ATÍPICO (IQR): % defectuoso = ${pct.toFixed(1)}% supera el umbral estadístico de ${BD.stats.umbral_atipico}% (Q75 + 1.5×IQR). Lote en ${linea} requiere revisión inmediata.`;
    tipo = 'critica';
    document.getElementById('badge-atipico').textContent = `⚠ Atípico: ${pct.toFixed(1)}%`;
  } else if (pct > 8 && estado === 'Aprobado') {
    msg = `⚠ Inconsistencia detectada: lote marcado Aprobado con ${pct.toFixed(1)}% defectuoso. El sistema espera < 3% para lotes aprobados.`;
    tipo = 'warn';
  } else if (estado === 'Rechazado' && pct < 8) {
    msg = `ℹ Posible error de clasificación: lote Rechazado con solo ${pct.toFixed(1)}% defectuoso. Rango esperado para rechazados: 8-25%.`;
    tipo = 'warn';
  } else if (pct > BD.stats.pct_def_mean + 2 * BD.stats.pct_def_std) {
    msg = `⚠ Valor extremo: ${pct.toFixed(1)}% supera la media + 2σ (${(BD.stats.pct_def_mean + 2*BD.stats.pct_def_std).toFixed(1)}%). Verificar proceso.`;
    tipo = 'warn';
  } else {
    msg = `✓ Lote agregado correctamente: ${linea} · ${qty} uds · ${pct.toFixed(1)}% defectuoso · ${estado}. Dentro del rango normal.`;
    tipo = 'ok';
  }

  mostrarAlerta(msg, tipo);
  document.getElementById('nuevo-qty').value = '';
  document.getElementById('nuevo-def').value = '';
  actualizarConclusiones();
}

function mostrarAlerta(msg, tipo) {
  const container = document.getElementById('alertas-container');
  const div = document.createElement('div');
  div.className = 'alerta ' + (tipo === 'critica' ? 'critica' : tipo === 'warn' ? 'advertencia' : 'ok');
  const icon = tipo === 'critica' ? 'circle-exclamation' : tipo === 'warn' ? 'triangle-exclamation' : 'circle-check';
  div.innerHTML = `<i class="fa-solid fa-${icon}"></i> <span>${msg}</span>`;
  container.innerHTML = '';
  container.appendChild(div);
  setTimeout(() => { div.style.transition = 'opacity 0.5s'; div.style.opacity = '0'; setTimeout(() => div.remove(), 500); }, 7000);
}

/* ──────────────────────────────────────────
   POWER BI
────────────────────────────────────────── */
const PBI_URL = 'https://app.powerbi.com/groups/me/reports/0857302e-f281-4fc9-bd9b-67bca8e9179d?ctid=d817549d-db34-487b-9c4e-6bb9fb2f7691&pbi_source=linkShare';
function loadPBI() { window.open(PBI_URL, '_blank'); }
function setPBIPage(el) {
  document.querySelectorAll('.pbi-tab').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
}

/* ──────────────────────────────────────────
   KPI COUNTER
────────────────────────────────────────── */
function startCounters() {
  const kpiValues = document.querySelectorAll('.kpi-value[data-target]');
  kpiValues.forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    const card   = el.closest('.kpi-card');
    const delay  = parseInt(card?.dataset.delay || 0, 10);
    const isDecimal = el.dataset.decimal === 'true';
    const prefix = el.dataset.prefix || '';
    const steps  = 60, duration = 1200, interval = duration / steps;
    setTimeout(() => {
      let current = 0;
      const step = target / steps;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = isDecimal
          ? (Math.floor(current)/100).toFixed(2)+'%'
          : prefix + Math.floor(current).toLocaleString('es-PE');
      }, interval);
    }, delay);
  });
  setTimeout(initCharts, 700);
}
