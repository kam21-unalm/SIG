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
   DATOS REALES BD INDDA v3
══════════════════════════════════════════════════════════ */
const BD = {
  lotesPorLinea: {
    labels: ['Bebidas', 'Harinas', 'Snacks', 'Lácteos'],
    data:   [128, 68, 64, 40]
  },
  estados: {
    labels: ['Aprobado', 'En revisión', 'Rechazado'],
    data:   [225, 42, 33]
  },
  produccionMensual: {
    labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
    data:   [5800,5200,10100,5100,4900,10400,6200,6600,7100,8700,3200,7800]
  },
  productosCantidad: {
    labels: ['Néctar Maracuyá','Néctar Mango','Beb. Maíz Morado','Yogurt Natural','Harina Kiwicha','Harina Quinua','Barra Cereales','Chocolate Cacao'],
    data:   [18900,15300,14800,11200,7800,6900,4200,3900]
  },
  defectoPorProducto: {
    labels: ['Chocolate Cacao','Néctar Mango','Yogurt Natural','Néctar Maracuyá','Beb. Maíz Morado','Harina Quinua','Harina Kiwicha','Barra Cereales'],
    data:   [4.5, 4.0, 3.9, 3.85, 3.75, 3.55, 3.50, 3.40]
  },
  defectoPorTipo: {
    labels: ['Acidez','Color','Textura','Por definir','Contaminación','Peso'],
    data:   [144, 139, 112, 75, 35, 14]
  },
  stock: {
    labels: ['Kiwicha','Avena','Quinua','Maracuyá','Azúcar','Cacao','Harina trigo','Aceite veg.','Mango','Leche fresca','Jengibre','Stevia','Maíz morado','Lúcuma','Sal'],
    disponible: [943,941,923,847,763,747,735,691,678,567,516,512,358,329,196],
    minimo:     [50,  40,  50,  60,  100, 15,  80,  20,  60,  30,  10,  10,  80,  20,  40]
  }
};

// Datos editables (se pueden agregar nuevos)
let datosEditables = {
  lotesPorLinea: [...BD.lotesPorLinea.data],
  estados: [...BD.estados.data],
  produccionMensual: [...BD.produccionMensual.data],
  atipicos: []
};

// Colores institucionales
const COLORES = {
  verde:  '#2d5a3d',
  verde2: '#4e9164',
  dorado: '#c9a84c',
  teal:   '#2e7d78',
  amber:  '#b07d28',
  rojo:   '#c0392b',
  gris:   '#e8ebe6'
};

let charts = {};

/* ──────────────────────────────────────────
   INICIALIZAR TODOS LOS GRÁFICOS
────────────────────────────────────────── */
function initCharts() {
  initResumen();
  initProduccion();
  initCalidad();
  initInventario();
}

function initResumen() {
  // Gráfico barras - lotes por línea
  const c1 = document.getElementById('chart-lineas');
  if (!c1 || charts.lineas) return;
  charts.lineas = new Chart(c1, {
    type: 'bar',
    data: {
      labels: BD.lotesPorLinea.labels,
      datasets: [{
        label: 'Lotes',
        data: datosEditables.lotesPorLinea,
        backgroundColor: [COLORES.verde, COLORES.teal, COLORES.dorado, COLORES.amber],
        borderRadius: 6,
        borderSkipped: false,
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.raw} lotes` } }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: '#f0f0f0' },
          ticks: { font: { family: 'DM Mono', size: 11 } }
        },
        x: { grid: { display: false },
          ticks: { font: { family: 'DM Sans', size: 12 } }
        }
      }
    }
  });

  // Gráfico dona - estados
  const c2 = document.getElementById('chart-estados');
  if (!c2 || charts.estados) return;
  charts.estados = new Chart(c2, {
    type: 'doughnut',
    data: {
      labels: BD.estados.labels,
      datasets: [{
        data: datosEditables.estados,
        backgroundColor: [COLORES.verde, COLORES.teal, '#c0392b'],
        borderWidth: 3,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      cutout: '62%',
      plugins: {
        legend: { position: 'bottom', labels: { font: { family: 'DM Sans', size: 12 }, padding: 16 } },
        tooltip: { callbacks: {
          label: ctx => {
            const total = ctx.dataset.data.reduce((a,b)=>a+b,0);
            return ` ${ctx.label}: ${ctx.raw} (${Math.round(ctx.raw/total*100)}%)`;
          }
        }}
      }
    }
  });
}

function initProduccion() {
  const c3 = document.getElementById('chart-mensual');
  if (!c3 || charts.mensual) return;
  charts.mensual = new Chart(c3, {
    type: 'line',
    data: {
      labels: BD.produccionMensual.labels,
      datasets: [{
        label: 'Cantidad producida',
        data: datosEditables.produccionMensual,
        borderColor: COLORES.verde,
        backgroundColor: 'rgba(45,90,61,0.08)',
        borderWidth: 2.5,
        pointBackgroundColor: COLORES.verde,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.35,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.raw.toLocaleString('es-PE')} unidades` } }
      },
      scales: {
        y: { beginAtZero: false, grid: { color: '#f0f0f0' },
          ticks: { font: { family: 'DM Mono', size: 11 },
            callback: v => v >= 1000 ? (v/1000).toFixed(0)+'k' : v
          }
        },
        x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 12 } } }
      }
    }
  });

  const c4 = document.getElementById('chart-productos');
  if (!c4 || charts.productos) return;
  charts.productos = new Chart(c4, {
    type: 'bar',
    indexAxis: 'y',
    data: {
      labels: BD.productosCantidad.labels,
      datasets: [{
        label: 'Cantidad producida',
        data: BD.productosCantidad.data,
        backgroundColor: [
          COLORES.verde, COLORES.verde, COLORES.verde2, COLORES.teal,
          COLORES.dorado, COLORES.dorado, COLORES.amber, COLORES.amber
        ],
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.raw.toLocaleString('es-PE')} unidades` } }
      },
      scales: {
        x: { beginAtZero: true, grid: { color: '#f0f0f0' },
          ticks: { font: { family: 'DM Mono', size: 11 },
            callback: v => v >= 1000 ? (v/1000).toFixed(0)+'k' : v
          }
        },
        y: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 12 } } }
      }
    }
  });
}

function initCalidad() {
  const c5 = document.getElementById('chart-defecto-prod');
  if (!c5 || charts.defProd) return;
  charts.defProd = new Chart(c5, {
    type: 'bar',
    data: {
      labels: BD.defectoPorProducto.labels,
      datasets: [{
        label: '% defectuoso',
        data: BD.defectoPorProducto.data,
        backgroundColor: BD.defectoPorProducto.data.map(v =>
          v >= 4.2 ? '#c0392b' : v >= 3.9 ? COLORES.amber : COLORES.teal
        ),
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.raw.toFixed(2)}%` } }
      },
      scales: {
        y: { beginAtZero: true, max: 6,
          ticks: { font: { family: 'DM Mono', size: 11 }, callback: v => v+'%' },
          grid: { color: '#f0f0f0' }
        },
        x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 11 }, maxRotation: 30 } }
      }
    }
  });

  const c6 = document.getElementById('chart-defecto-tipo');
  if (!c6 || charts.defTipo) return;
  charts.defTipo = new Chart(c6, {
    type: 'bar',
    data: {
      labels: BD.defectoPorTipo.labels,
      datasets: [{
        label: 'Casos',
        data: BD.defectoPorTipo.data,
        backgroundColor: [COLORES.rojo, COLORES.amber, COLORES.dorado, COLORES.teal, COLORES.verde2, COLORES.verde],
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${ctx.raw} casos` } }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: '#f0f0f0' },
          ticks: { font: { family: 'DM Mono', size: 11 } }
        },
        x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 12 } } }
      }
    }
  });
}

function initInventario() {
  const c7 = document.getElementById('chart-stock');
  if (!c7 || charts.stock) return;
  charts.stock = new Chart(c7, {
    type: 'bar',
    data: {
      labels: BD.stock.labels,
      datasets: [
        {
          label: 'Stock disponible',
          data: BD.stock.disponible,
          backgroundColor: BD.stock.disponible.map((v,i) =>
            v < BD.stock.minimo[i] ? '#c0392b' : COLORES.verde
          ),
          borderRadius: 4
        },
        {
          label: 'Stock mínimo',
          data: BD.stock.minimo,
          backgroundColor: 'rgba(201,168,76,0.7)',
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'top', labels: { font: { family: 'DM Sans', size: 12 } } },
        tooltip: { callbacks: { label: ctx => ` ${ctx.dataset.label}: ${ctx.raw}` } }
      },
      scales: {
        y: { beginAtZero: true, grid: { color: '#f0f0f0' },
          ticks: { font: { family: 'DM Mono', size: 11 } }
        },
        x: { grid: { display: false }, ticks: { font: { family: 'DM Sans', size: 10 }, maxRotation: 35 } }
      }
    }
  });

  // Tabla inventario
  const tabla = document.getElementById('tabla-stock');
  if (!tabla) return;
  tabla.innerHTML = `
    <thead><tr>
      <th>Insumo</th>
      <th>Stock disponible</th>
      <th>Stock mínimo</th>
      <th>Estado</th>
    </tr></thead>
    <tbody>
      ${BD.stock.labels.map((l,i) => {
        const ok = BD.stock.disponible[i] >= BD.stock.minimo[i];
        return `<tr>
          <td>${l}</td>
          <td>${BD.stock.disponible[i].toLocaleString('es-PE')}</td>
          <td>${BD.stock.minimo[i]}</td>
          <td class="${ok ? 'ok-val' : 'warn-val'}">${ok ? '✓ OK' : '⚠ Crítico'}</td>
        </tr>`;
      }).join('')}
    </tbody>`;
}

/* ──────────────────────────────────────────
   TABS
────────────────────────────────────────── */
function setTab(nombre, el) {
  document.querySelectorAll('.atab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-' + nombre).classList.add('active');

  // Inicializar gráficos del tab cuando se activa
  setTimeout(() => {
    if (nombre === 'produccion') initProduccion();
    if (nombre === 'calidad')    initCalidad();
    if (nombre === 'inventario') initInventario();
  }, 50);
}

/* ──────────────────────────────────────────
   FILTRO ESTADO
────────────────────────────────────────── */
function setFiltro(tipo, val, el) {
  document.querySelectorAll('#filter-estado .fpill').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  // En implementación real filtrarías los datos — aquí actualizamos visualmente
  actualizarKPIs(val);
}

function actualizarKPIs(filtro) {
  const totales = { todos: [300,5890,3.75,33], Aprobado: [225,0,1.5,0], 'En revision': [42,1800,5.5,0], Rechazado: [33,4090,16,33] };
  const vals = totales[filtro] || totales.todos;
  // Actualizar KPI cards
  const kpis = document.querySelectorAll('.kpi-value');
  if (kpis[0]) kpis[0].textContent = vals[0].toLocaleString('es-PE');
  if (kpis[1]) kpis[1].textContent = 'S/ ' + vals[1].toLocaleString('es-PE');
  if (kpis[2]) kpis[2].textContent = vals[2].toFixed(2) + '%';
  if (kpis[3]) kpis[3].textContent = vals[3];
}

/* ──────────────────────────────────────────
   AGREGAR DATO NUEVO + DETECCIÓN ATÍPICOS
────────────────────────────────────────── */
function agregarDato() {
  const linea   = document.getElementById('nuevo-linea').value;
  const qty     = parseFloat(document.getElementById('nuevo-qty').value);
  const def     = parseFloat(document.getElementById('nuevo-def').value);
  const estado  = document.getElementById('nuevo-estado').value;

  if (!qty || isNaN(qty) || !def || isNaN(def)) {
    mostrarAlerta('Por favor ingresa cantidad producida y defectuosa.', false);
    return;
  }

  if (def > qty) {
    mostrarAlerta('⚠ Dato inválido: la cantidad defectuosa no puede superar la cantidad producida.', true);
    return;
  }

  const pct = (def / qty) * 100;
  const idx = ['Bebidas','Harinas','Lacteos','Snacks'].indexOf(linea);

  // Actualizar datos
  datosEditables.lotesPorLinea[idx]++;
  if (estado === 'Aprobado')    datosEditables.estados[0]++;
  if (estado === 'En revision') datosEditables.estados[1]++;
  if (estado === 'Rechazado')   datosEditables.estados[2]++;

  // Actualizar gráficos
  if (charts.lineas) {
    charts.lineas.data.datasets[0].data = datosEditables.lotesPorLinea;
    charts.lineas.update();
  }
  if (charts.estados) {
    charts.estados.data.datasets[0].data = datosEditables.estados;
    charts.estados.update();
  }

  // Actualizar KPI total
  const total = datosEditables.lotesPorLinea.reduce((a,b)=>a+b,0);
  const kpis = document.querySelectorAll('.kpi-value');
  if (kpis[0]) kpis[0].textContent = total.toLocaleString('es-PE');

  // Detección de dato atípico
  let msg = '';
  let critica = false;
  if (pct > 20) {
    msg = `🚨 Dato atípico detectado: % defectuoso = ${pct.toFixed(1)}% (umbral: 20%). Lote en línea ${linea} requiere revisión inmediata.`;
    critica = true;
    document.getElementById('badge-atipico').textContent = '⚠ Atípico detectado';
  } else if (pct > 8 && estado === 'Aprobado') {
    msg = `⚠ Inconsistencia: lote marcado como Aprobado con ${pct.toFixed(1)}% defectuoso. Revisar estado.`;
    critica = false;
  } else if (estado === 'Rechazado' && pct < 8) {
    msg = `ℹ Lote rechazado con solo ${pct.toFixed(1)}% defectuoso. ¿Correcto?`;
    critica = false;
  } else {
    msg = `✓ Lote agregado: ${linea} · ${qty} uds · ${pct.toFixed(1)}% defectuoso · ${estado}`;
  }

  mostrarAlerta(msg, critica);

  // Limpiar campos
  document.getElementById('nuevo-qty').value = '';
  document.getElementById('nuevo-def').value = '';
}

function mostrarAlerta(msg, critica) {
  const container = document.getElementById('alertas-container');
  const div = document.createElement('div');
  div.className = 'alerta' + (critica ? ' critica' : '');
  div.innerHTML = `<i class="fa-solid fa-${critica ? 'circle-exclamation' : 'circle-info'}"></i> ${msg}`;
  container.innerHTML = '';
  container.appendChild(div);
  setTimeout(() => { div.style.opacity = '0'; div.style.transition = 'opacity 0.5s'; setTimeout(() => div.remove(), 500); }, 6000);
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
   KPI COUNTER ANIMADO
────────────────────────────────────────── */
function startCounters() {
  const kpiValues = document.querySelectorAll('.kpi-value[data-target]');
  kpiValues.forEach(el => {
    const target    = parseInt(el.dataset.target, 10);
    const card      = el.closest('.kpi-card');
    const delay     = parseInt(card?.dataset.delay || 0, 10);
    const isDecimal = el.dataset.decimal === 'true';
    const prefix    = el.dataset.prefix || '';
    const duration  = 1200;
    const steps     = 60;
    const interval  = duration / steps;

    setTimeout(() => {
      let current = 0;
      const step  = target / steps;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = isDecimal
          ? (Math.floor(current) / 100).toFixed(2) + '%'
          : prefix + Math.floor(current).toLocaleString('es-PE');
      }, interval);
    }, delay);
  });

  // Init charts after counters
  setTimeout(initCharts, 600);
}
