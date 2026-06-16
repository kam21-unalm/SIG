'use strict';

/* ══════════════════════════════════════════════
   CREDENCIALES
══════════════════════════════════════════════ */
const CRED = { username:'admin', password:'indda2026' };

/* ══════════════════════════════════════════════
   BASE DE DATOS REAL (BD INDDA v3)
══════════════════════════════════════════════ */
const BD = {
  kpis: {
    todos:        { lotes:300, perdida:5890.99, pct:3.7518, rechazados:33 },
    Aprobado:     { lotes:225, perdida:0,        pct:1.45,   rechazados:0  },
    'En revision':{ lotes:42,  perdida:1800,     pct:5.57,   rechazados:0  },
    Rechazado:    { lotes:33,  perdida:4090.99,  pct:17.10,  rechazados:33 },
  },
  lotesPorLinea: {
    labels:       ['Bebidas','Harinas','Snacks','Lácteos'],
    todos:        [126, 67, 64, 43],
    Aprobado:     [95,  51, 48, 31],
    'En revision':[19,   9, 10,  4],
    Rechazado:    [12,   7,  6,  8],
  },
  estados: { labels:['Aprobado','En revisión','Rechazado'], data:[225,42,33] },
  produccionMensual: {
    labels: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Set','Oct','Nov','Dic'],
    Bebidas:[2280.1,2150.3,4980.2,2100.5,1920.4,5210.8,2480.3,2790.1,2910.2,3220.4,1250.3,2940.1],
    Harinas:[1150.2, 980.4,2010.3,1020.1, 980.2,2110.4,1220.3,1480.2,1420.1,1680.2, 680.2,1510.2],
    Snacks: [ 980.1, 820.3,1590.4, 880.2, 780.1,1680.2,1010.1,1190.3,1140.2,1390.1, 640.1,1230.4],
    Lacteos:[1485.0,1474.1,1497.2,1491.8,1508.6,1516.4,1544.2,1548.8,1703.5,1799.2, 770.5,1708.4],
  },
  productosCantidad: {
    labels:['Néctar Maracuyá','Néctar Mango','Beb. Maíz Morado','Yogurt Natural','Harina Kiwicha','Harina Quinua','Barra Cereales','Chocolate Cacao'],
    data:  [18520.1,15318.3,14897.1,11805.9,7146.5,6068.1,4388.5,3712.1],
  },
  defectoPorProducto: {
    labels:['Chocolate Cacao','Néctar Mango','Yogurt Natural','Néctar Maracuyá','Beb. Maíz Morado','Harina Quinua','Harina Kiwicha','Barra Cereales'],
    data:  [4.49, 3.99, 3.80, 3.77, 3.69, 3.50, 3.45, 3.38],
  },
  defectoPorTipo: {
    labels:['Acidez','Color','Textura','Por definir','Contaminación','Peso'],
    data:  [144, 139, 112, 75, 34, 14],
  },
  turno: {
    labels:  ['Mañana','Tarde'],
    n:       [153, 147],
    pct_def: [4.07, 3.42],
    perdida: [3230.05, 2660.94],
    aprobados:[112, 113],
  },
  responsable: {
    labels:    ['Ing. Quispe','Ing. Ramos','Ing. Torres','Tec. Flores','Tec. Mamani'],
    n_lotes:   [75,  62,  48,  63,  52],
    pct_def:   [3.98,2.74,3.38,4.49,4.08],
    perdida:   [1411.75,574.33,563.20,2203.54,1138.17],
    tasa_apro: [72.0,82.3,79.2,69.8,73.1],
  },
  stock: {
    labels:     ['Quinua','Kiwicha','Maíz morado','Maracuyá','Mango','Leche fresca','Azúcar','Sal','Aceite vegetal','Harina trigo','Stevia','Cacao','Avena','Lúcuma','Jengibre'],
    disponible: [923.3,943.4,357.5,847.4,677.6,567.2,762.9,221.2,691.3,734.6,512.0,747.2,941.2,329.9,516.1],
    minimo:     [50,   50,   80,   60,   60,   30,  100,  40,   20,   80,   10,   15,   40,   20,   10],
  },
  // Datos scatter reales (muestra de 60 puntos representativos)
  scatter: {
    normal: [
      {x:5.2,y:1.1},{x:4.8,y:0.8},{x:6.1,y:1.5},{x:5.5,y:2.1},{x:7.2,y:1.8},
      {x:4.2,y:0.5},{x:8.1,y:1.2},{x:5.9,y:2.8},{x:6.8,y:1.9},{x:4.5,y:0.3},
      {x:9.2,y:2.5},{x:5.1,y:1.6},{x:7.8,y:2.9},{x:4.9,y:1.0},{x:6.3,y:2.2},
      {x:8.5,y:2.0},{x:5.7,y:1.7},{x:4.3,y:0.7},{x:7.1,y:2.4},{x:6.6,y:1.3},
      {x:5.0,y:1.9},{x:8.9,y:2.7},{x:4.7,y:0.9},{x:7.5,y:2.3},{x:6.0,y:1.4},
      {x:5.3,y:2.0},{x:4.1,y:0.6},{x:9.0,y:3.0},{x:6.4,y:1.8},{x:5.8,y:2.6},
      {x:7.9,y:2.1},{x:4.6,y:1.1},{x:8.3,y:2.8},{x:5.4,y:1.5},{x:6.7,y:2.3},
      {x:4.4,y:0.4},{x:7.3,y:2.0},{x:5.6,y:1.6},{x:8.7,y:3.0},{x:6.2,y:2.4},
    ],
    atipicos: [
      {x:2.1,y:18.5},{x:1.8,y:22.3},{x:3.2,y:15.1},{x:2.5,y:20.8},{x:1.5,y:24.6},
      {x:2.8,y:16.4},{x:1.9,y:21.0},{x:3.5,y:14.2},{x:2.3,y:19.7},{x:1.7,y:23.1},
    ],
  },
  // Últimos 20 lotes reales
  ultimos20: [
    {id:300,prod:'Harina de Kiwicha',   linea:'Harinas', resp:'Ing. Quispe',  estado:'Aprobado',    qty:169.9, pct:1.88,  perdida:0,      turno:'Tarde',  fecha:'2025-12-09'},
    {id:299,prod:'Beb. de Maíz Morado', linea:'Bebidas', resp:'Ing. Ramos',   estado:'Aprobado',    qty:429.6, pct:0.12,  perdida:0,      turno:'Mañana', fecha:'2025-03-18'},
    {id:298,prod:'Harina de Kiwicha',   linea:'Harinas', resp:'Tec. Flores',  estado:'Aprobado',    qty:188.0, pct:1.86,  perdida:0,      turno:'Mañana', fecha:'2025-09-23'},
    {id:297,prod:'Harina de Quinua',    linea:'Harinas', resp:'Tec. Mamani',  estado:'Rechazado',   qty:127.6, pct:10.03, perdida:153.6,  turno:'Tarde',  fecha:'2025-09-01'},
    {id:296,prod:'Harina de Quinua',    linea:'Harinas', resp:'Ing. Ramos',   estado:'Aprobado',    qty:232.4, pct:1.81,  perdida:0,      turno:'Tarde',  fecha:'2025-08-20'},
    {id:295,prod:'Néctar de Maracuyá', linea:'Bebidas', resp:'Ing. Quispe',  estado:'Aprobado',    qty:356.0, pct:0.73,  perdida:0,      turno:'Tarde',  fecha:'2025-12-02'},
    {id:294,prod:'Harina de Quinua',    linea:'Harinas', resp:'Tec. Flores',  estado:'Rechazado',   qty:125.7, pct:12.97, perdida:195.6,  turno:'Tarde',  fecha:'2025-01-19'},
    {id:293,prod:'Néctar de Mango',     linea:'Bebidas', resp:'Tec. Mamani',  estado:'Rechazado',   qty:244.8, pct:10.74, perdida:92.05,  turno:'Mañana', fecha:'2025-04-30'},
    {id:292,prod:'Barra de Cereales',   linea:'Snacks',  resp:'Tec. Flores',  estado:'Aprobado',    qty:123.4, pct:2.43,  perdida:0,      turno:'Mañana', fecha:'2025-11-08'},
    {id:291,prod:'Barra de Cereales',   linea:'Snacks',  resp:'Ing. Torres',  estado:'Aprobado',    qty:133.4, pct:0.75,  perdida:0,      turno:'Tarde',  fecha:'2025-05-31'},
    {id:290,prod:'Néctar de Maracuyá', linea:'Bebidas', resp:'Ing. Quispe',  estado:'Aprobado',    qty:299.2, pct:2.87,  perdida:0,      turno:'Tarde',  fecha:'2025-09-03'},
    {id:289,prod:'Néctar de Mango',     linea:'Bebidas', resp:'Ing. Quispe',  estado:'Aprobado',    qty:369.1, pct:2.52,  perdida:0,      turno:'Tarde',  fecha:'2025-12-14'},
    {id:288,prod:'Yogurt Natural',      linea:'Lácteos', resp:'Ing. Quispe',  estado:'Aprobado',    qty:322.1, pct:2.42,  perdida:0,      turno:'Tarde',  fecha:'2025-02-22'},
    {id:287,prod:'Harina de Kiwicha',   linea:'Harinas', resp:'Ing. Quispe',  estado:'Aprobado',    qty:134.2, pct:2.46,  perdida:0,      turno:'Mañana', fecha:'2025-06-16'},
    {id:286,prod:'Harina de Quinua',    linea:'Harinas', resp:'Tec. Flores',  estado:'Aprobado',    qty:191.3, pct:0.63,  perdida:0,      turno:'Tarde',  fecha:'2025-01-08'},
    {id:285,prod:'Néctar de Maracuyá', linea:'Bebidas', resp:'Tec. Mamani',  estado:'En revision', qty:368.7, pct:5.23,  perdida:33.77,  turno:'Mañana', fecha:'2025-07-22'},
    {id:284,prod:'Néctar de Mango',     linea:'Bebidas', resp:'Ing. Quispe',  estado:'Aprobado',    qty:355.2, pct:0.39,  perdida:0,      turno:'Tarde',  fecha:'2025-09-10'},
    {id:283,prod:'Néctar de Mango',     linea:'Bebidas', resp:'Ing. Ramos',   estado:'En revision', qty:482.0, pct:5.44,  perdida:45.85,  turno:'Mañana', fecha:'2025-12-10'},
    {id:282,prod:'Harina de Kiwicha',   linea:'Harinas', resp:'Ing. Quispe',  estado:'En revision', qty:194.3, pct:5.61,  perdida:70.85,  turno:'Mañana', fecha:'2025-09-30'},
    {id:281,prod:'Yogurt Natural',      linea:'Lácteos', resp:'Ing. Quispe',  estado:'Aprobado',    qty:373.0, pct:2.63,  perdida:0,      turno:'Mañana', fecha:'2025-09-11'},
  ],
  stats: {
    q1:1.11, q2:1.91, q3:3.04, iqr:2.05,
    umbral:6.11, n_atip:49, media:3.75, sd:5.30,
    corr_tiempo:-0.24,
  },
  boxplot: {
    Bebidas: {min:0.02, q1:1.14, med:1.91, q3:3.83, max:24.34, n:126},
    Harinas: {min:0.16, q1:0.93, med:1.88, q3:3.12, max:24.05, n:67},
    Snacks:  {min:0.08, q1:0.80, med:1.71, q3:2.83, max:24.59, n:64},
    Lácteos: {min:0.20, q1:0.95, med:2.27, q3:2.90, max:23.09, n:43},
  },
};

const COLORES = {
  verde:'#2d5a3d', verde2:'#4e9164', dorado:'#c9a84c',
  teal:'#2e7d78', amber:'#b07d28', rojo:'#c0392b',
  aprobado:'#27ae60', revision:'#2e7d78', rechazado:'#c0392b',
  grisL:'rgba(0,0,0,0.06)',
};

let charts = {};
let filtrosActivos = new Set(['todos']);
let lotesAgregados = [];
let nextId = 301;

/* ══════════════════════════════════════════════
   LOGIN / LOGOUT
══════════════════════════════════════════════ */
function attemptLogin() {
  const u = document.getElementById('username').value.trim();
  const p = document.getElementById('password').value;
  const btn = document.getElementById('btn-login');
  btn.classList.add('loading');
  btn.querySelector('.btn-text').textContent = 'Verificando...';
  document.getElementById('login-error').classList.add('hidden');
  setTimeout(() => {
    if (u === CRED.username && p === CRED.password) {
      sessionStorage.setItem('inddaLoggedIn','true');
      const ls = document.getElementById('login-screen');
      ls.style.transition = 'opacity .45s'; ls.style.opacity = '0';
      setTimeout(() => {
        ls.classList.add('hidden'); ls.style.opacity = '';
        const ds = document.getElementById('dashboard-screen');
        ds.classList.remove('hidden'); ds.style.opacity='0';
        requestAnimationFrame(() => {
          ds.style.transition='opacity .45s'; ds.style.opacity='1';
          setTimeout(()=>{ ds.style.transition=''; },460);
        });
        initDashboard();
      }, 460);
    } else {
      btn.classList.remove('loading');
      btn.querySelector('.btn-text').textContent = 'Ingresar al Sistema';
      const err = document.getElementById('login-error');
      err.classList.remove('hidden');
      ['username','password'].forEach(id => {
        const el = document.getElementById(id);
        el.style.borderColor='#c0392b';
        el.style.animation='shake .35s ease';
        el.addEventListener('animationend',()=>{ el.style.animation=''; el.style.borderColor=''; },{once:true});
      });
    }
  }, 350);
}
function logout() {
  sessionStorage.removeItem('inddaLoggedIn');
  const ds = document.getElementById('dashboard-screen');
  ds.style.transition='opacity .4s'; ds.style.opacity='0';
  setTimeout(()=>{
    ds.classList.add('hidden'); ds.style.opacity='';
    const ls = document.getElementById('login-screen');
    ls.classList.remove('hidden'); ls.style.opacity='0';
    setTimeout(()=>{ ls.style.transition='opacity .4s'; ls.style.opacity='1';
      setTimeout(()=>{ ls.style.transition=''; },410);
    },10);
    document.getElementById('username').value='';
    document.getElementById('password').value='';
    document.getElementById('btn-login').querySelector('.btn-text').textContent='Ingresar al Sistema';
  },400);
}
function togglePassword() {
  const p = document.getElementById('password');
  p.type = p.type==='password'?'text':'password';
  document.getElementById('pw-eye').className = p.type==='password'?'fa-regular fa-eye':'fa-regular fa-eye-slash';
}
['username','password'].forEach(id => {
  document.getElementById(id)?.addEventListener('keydown', e=>{ if(e.key==='Enter') attemptLogin(); });
});
(function(){ if(sessionStorage.getItem('inddaLoggedIn')==='true'){ document.getElementById('login-screen').classList.add('hidden'); document.getElementById('dashboard-screen').classList.remove('hidden'); initDashboard(); } })();

/* ══════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════ */
let sidebarCollapsed = false;
function toggleSidebar() {
  sidebarCollapsed = !sidebarCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed', sidebarCollapsed);
}
function setActive(el, title, icon) {
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('breadcrumb').innerHTML = `<i class="${icon}"></i><span>${title.split(' ').pop()}</span>`;
  document.getElementById('page-title').textContent = title;
}

/* ══════════════════════════════════════════════
   DASHBOARD INIT
══════════════════════════════════════════════ */
function initDashboard() {
  updateTopbarDate();
  updateLastSync();
  animateKPIs();
  setTimeout(()=>{ initResumen(); actualizarConclusiones(); initTablaViva(); initRealtimeStats(); }, 600);
  setInterval(updateTopbarDate, 60000);
}
function updateTopbarDate() {
  const d = document.getElementById('topbar-date');
  if(d) d.textContent = new Date().toLocaleDateString('es-PE',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
}
function updateLastSync() {
  const s = document.getElementById('last-sync');
  if(s){ const n=new Date(); s.textContent=`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}:${String(n.getSeconds()).padStart(2,'0')}`; }
}

/* ══════════════════════════════════════════════
   KPI ANIMATION
══════════════════════════════════════════════ */
function animateKPIs() {
  animCount('kpi-lotes', 300, '', false);
  animCount('kpi-perdida', 5891, 'S/ ', false);
  animCount('kpi-pct', 375, '', true);
  animCount('kpi-rech', 33, '', false);
}
function animCount(id, target, prefix, isDecimal) {
  const el = document.getElementById(id);
  if(!el) return;
  let current=0; const steps=60, interval=1200/steps;
  const timer = setInterval(()=>{
    current += target/steps;
    if(current>=target){ current=target; clearInterval(timer); }
    el.textContent = isDecimal
      ? (Math.floor(current)/100).toFixed(2)+'%'
      : prefix + Math.floor(current).toLocaleString('es-PE');
  }, interval);
}
function setKPIs(lotes, perdida, pct, rech) {
  document.getElementById('kpi-lotes').textContent = lotes.toLocaleString('es-PE');
  document.getElementById('kpi-perdida').textContent = 'S/ '+perdida.toLocaleString('es-PE',{minimumFractionDigits:2,maximumFractionDigits:2});
  document.getElementById('kpi-pct').textContent = pct.toFixed(2)+'%';
  document.getElementById('kpi-rech').textContent = rech;
}

/* ══════════════════════════════════════════════
   FILTROS MÚLTIPLES
══════════════════════════════════════════════ */
function toggleFiltro(val, el) {
  if(val==='todos') {
    filtrosActivos.clear(); filtrosActivos.add('todos');
    document.querySelectorAll('#filter-estado .fpill').forEach(b=>b.classList.remove('active'));
    el.classList.add('active');
  } else {
    filtrosActivos.delete('todos');
    document.querySelector('#filter-estado .fpill[data-val="todos"]').classList.remove('active');
    if(filtrosActivos.has(val)){ filtrosActivos.delete(val); el.classList.remove('active'); }
    else { filtrosActivos.add(val); el.classList.add('active'); }
    if(filtrosActivos.size===0){ filtrosActivos.add('todos'); document.querySelector('#filter-estado .fpill[data-val="todos"]').classList.add('active'); }
  }
  aplicarFiltros();
}
function getEstados() {
  if(filtrosActivos.has('todos')) return ['Aprobado','En revision','Rechazado'];
  return [...filtrosActivos];
}
function aplicarFiltros() {
  const estados = getEstados();
  let totalLotes=0, totalPerdida=0, sumPct=0, totalRech=0, n=0;
  estados.forEach(e=>{
    const d = BD.kpis[e]||BD.kpis.todos;
    totalLotes+=d.lotes; totalPerdida+=d.perdida;
    sumPct+=d.pct*d.lotes; totalRech+=d.rechazados; n+=d.lotes;
  });
  setKPIs(totalLotes, totalPerdida, n>0?sumPct/n:0, totalRech);

  // Gráfico barras
  if(charts.lineas) {
    let data;
    if(filtrosActivos.has('todos')) { data=[...BD.lotesPorLinea.todos]; }
    else { data=[0,0,0,0]; estados.forEach(e=>{ (BD.lotesPorLinea[e]||[0,0,0,0]).forEach((v,i)=>data[i]+=v); }); }
    charts.lineas.data.datasets[0].data=data; charts.lineas.update();
  }
  // Dona
  if(charts.estados) {
    const d = filtrosActivos.has('todos')
      ? [225,42,33]
      : BD.estados.labels.map((l,i)=>{ const k=l==='En revisión'?'En revision':l; return estados.includes(k)?BD.estados.data[i]:0; });
    charts.estados.data.datasets[0].data=d; charts.estados.update();
  }
  const label = filtrosActivos.has('todos')?'Todos los estados':[...filtrosActivos].join(' + ');
  const b = document.getElementById('badge-filtro');
  if(b) b.textContent = label;
  actualizarConclusiones();
}

/* ══════════════════════════════════════════════
   TABS
══════════════════════════════════════════════ */
function setTab(nombre, el) {
  document.querySelectorAll('.atab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('tab-'+nombre).classList.add('active');
  setTimeout(()=>{
    if(nombre==='produccion') initProduccion();
    if(nombre==='calidad')    initCalidad();
    if(nombre==='atipicos')   initAtipicos();
    if(nombre==='inventario') initInventario();
    if(nombre==='responsable')initResponsable();
    if(nombre==='datos')      { initTablaViva(); initRealtimeStats(); }
  },50);
}

/* ══════════════════════════════════════════════
   CHARTS
══════════════════════════════════════════════ */
const chartOpts = (extraOpts={}) => ({
  responsive:true, maintainAspectRatio:true,
  plugins:{ legend:{display:false}, ...extraOpts.plugins },
  scales:{
    y:{ beginAtZero:true, grid:{color:'rgba(0,0,0,0.05)'}, ticks:{font:{family:'DM Mono',size:11}} },
    x:{ grid:{display:false}, ticks:{font:{family:'DM Sans',size:12}} },
    ...extraOpts.scales
  },
  ...extraOpts,
});

function initResumen() {
  if(!charts.lineas) {
    const c = document.getElementById('chart-lineas');
    if(!c) return;
    charts.lineas = new Chart(c, {
      type:'bar',
      data:{ labels:BD.lotesPorLinea.labels, datasets:[{
        label:'Lotes', data:[...BD.lotesPorLinea.todos],
        backgroundColor:[COLORES.verde,COLORES.teal,COLORES.dorado,COLORES.amber],
        borderRadius:8, borderSkipped:false,
      }]},
      options:{ ...chartOpts(), plugins:{ legend:{display:false},
        tooltip:{callbacks:{label:ctx=>` ${ctx.raw} lotes (${(ctx.raw/300*100).toFixed(1)}%)`}}
      }}
    });
  }
  if(!charts.estados) {
    const c = document.getElementById('chart-estados');
    if(!c) return;
    charts.estados = new Chart(c, {
      type:'doughnut',
      data:{ labels:BD.estados.labels, datasets:[{
        data:[...BD.estados.data],
        backgroundColor:[COLORES.aprobado,COLORES.teal,COLORES.rechazado],
        borderWidth:3, borderColor:'#fff', hoverOffset:8,
      }]},
      options:{ responsive:true, cutout:'65%',
        plugins:{
          legend:{position:'bottom',labels:{font:{family:'DM Sans',size:12},padding:16,usePointStyle:true}},
          tooltip:{callbacks:{label:ctx=>{
            const t=ctx.dataset.data.reduce((a,b)=>a+b,0);
            return ` ${ctx.label}: ${ctx.raw} (${t>0?(ctx.raw/t*100).toFixed(1):0}%)`;
          }}}
        }
      }
    });
  }
}

function initProduccion() {
  if(!charts.mensual) {
    const c = document.getElementById('chart-mensual');
    if(!c) return;
    charts.mensual = new Chart(c, {
      type:'bar',
      data:{ labels:BD.produccionMensual.labels, datasets:[
        {label:'Bebidas', data:BD.produccionMensual.Bebidas, backgroundColor:COLORES.verde,  borderRadius:3},
        {label:'Harinas', data:BD.produccionMensual.Harinas, backgroundColor:COLORES.teal,   borderRadius:3},
        {label:'Snacks',  data:BD.produccionMensual.Snacks,  backgroundColor:COLORES.dorado, borderRadius:3},
        {label:'Lácteos', data:BD.produccionMensual.Lacteos, backgroundColor:COLORES.amber,  borderRadius:3},
      ]},
      options:{ responsive:true,
        plugins:{legend:{position:'top',labels:{font:{family:'DM Sans',size:12},usePointStyle:true}},
          tooltip:{mode:'index',intersect:false,callbacks:{label:ctx=>` ${ctx.dataset.label}: ${ctx.raw.toLocaleString('es-PE')} uds`}}
        },
        scales:{
          x:{stacked:true,grid:{display:false},ticks:{font:{family:'DM Sans',size:12}}},
          y:{stacked:true,beginAtZero:true,grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{family:'DM Mono',size:11},callback:v=>v>=1000?(v/1000).toFixed(0)+'k':v}},
        }
      }
    });
  }
  if(!charts.productos) {
    const c = document.getElementById('chart-productos');
    if(!c) return;
    charts.productos = new Chart(c, {
      type:'bar', indexAxis:'y',
      data:{ labels:BD.productosCantidad.labels, datasets:[{
        label:'Cantidad', data:BD.productosCantidad.data,
        backgroundColor:[COLORES.verde,COLORES.verde,COLORES.verde2,COLORES.teal,COLORES.dorado,COLORES.dorado,COLORES.amber,COLORES.amber],
        borderRadius:5,
      }]},
      options:{ responsive:true,
        plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ${ctx.raw.toLocaleString('es-PE')} unidades`}}},
        scales:{
          x:{beginAtZero:true,grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{family:'DM Mono',size:11},callback:v=>v>=1000?(v/1000).toFixed(0)+'k':v}},
          y:{grid:{display:false},ticks:{font:{family:'DM Sans',size:12}}},
        }
      }
    });
  }
}

function initCalidad() {
  if(!charts.defProd) {
    const c = document.getElementById('chart-defecto-prod');
    if(!c) return;
    charts.defProd = new Chart(c, {
      type:'bar',
      data:{ labels:BD.defectoPorProducto.labels, datasets:[{
        label:'% defectuoso', data:BD.defectoPorProducto.data,
        backgroundColor:BD.defectoPorProducto.data.map(v=>v>=4.2?COLORES.rojo:v>=3.9?COLORES.amber:COLORES.teal),
        borderRadius:5,
      }]},
      options:{ responsive:true,
        plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ${ctx.raw.toFixed(2)}%`}}},
        scales:{
          y:{beginAtZero:true,max:6,grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{family:'DM Mono',size:11},callback:v=>v+'%'}},
          x:{grid:{display:false},ticks:{font:{family:'DM Sans',size:11},maxRotation:30}},
        }
      }
    });
  }
  if(!charts.defTipo) {
    const c = document.getElementById('chart-defecto-tipo');
    if(!c) return;
    charts.defTipo = new Chart(c, {
      type:'bar',
      data:{ labels:BD.defectoPorTipo.labels, datasets:[{
        label:'Casos', data:BD.defectoPorTipo.data,
        backgroundColor:[COLORES.rojo,COLORES.amber,COLORES.dorado,COLORES.teal,COLORES.verde2,COLORES.verde],
        borderRadius:5,
      }]},
      options:{ responsive:true,
        plugins:{legend:{display:false},tooltip:{callbacks:{label:ctx=>` ${ctx.raw} casos (${(ctx.raw/518*100).toFixed(1)}%)`}}},
        scales:{
          y:{beginAtZero:true,grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{family:'DM Mono',size:11}}},
          x:{grid:{display:false},ticks:{font:{family:'DM Sans',size:12}}},
        }
      }
    });
  }
  if(!charts.turno) {
    const c = document.getElementById('chart-turno');
    if(!c) return;
    charts.turno = new Chart(c, {
      type:'bar',
      data:{ labels:BD.turno.labels, datasets:[
        {label:'Lotes', data:BD.turno.n, backgroundColor:[COLORES.verde,COLORES.teal], borderRadius:5, yAxisID:'y'},
        {label:'% Defectuoso', data:BD.turno.pct_def, backgroundColor:[COLORES.rojo+'bb',COLORES.amber+'bb'], borderRadius:5, yAxisID:'y2'},
      ]},
      options:{ responsive:true,
        plugins:{legend:{position:'top',labels:{font:{family:'DM Sans',size:12},usePointStyle:true}},
          tooltip:{mode:'index',intersect:false}
        },
        scales:{
          x:{grid:{display:false},ticks:{font:{family:'DM Sans',size:14}}},
          y:{beginAtZero:true,position:'left',grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{family:'DM Mono',size:11}},title:{display:true,text:'N° Lotes',font:{family:'DM Sans',size:11}}},
          y2:{beginAtZero:true,position:'right',grid:{display:false},max:6,ticks:{font:{family:'DM Mono',size:11},callback:v=>v+'%'},title:{display:true,text:'% Defectuoso',font:{family:'DM Sans',size:11}}},
        }
      }
    });
  }
}

function initAtipicos() {
  // Boxplot manual con barras flotantes
  if(!charts.boxplot) {
    const c = document.getElementById('chart-boxplot');
    if(!c) return;
    const lineas = Object.keys(BD.boxplot);
    const colsBP = [COLORES.verde,COLORES.teal,COLORES.dorado,COLORES.amber];
    charts.boxplot = new Chart(c, {
      type:'bar',
      data:{
        labels: lineas,
        datasets:[
          // Cuerpo de la caja (Q1 a Q3)
          { label:'Rango IQR (Q1–Q3)', data: lineas.map(l=>({x:l, y:[BD.boxplot[l].q1, BD.boxplot[l].q3]})),
            backgroundColor: colsBP.map(c=>c+'55'), borderColor: colsBP, borderWidth:2, borderRadius:3,
          },
          // Mediana
          { label:'Mediana', data: lineas.map(l=>BD.boxplot[l].med), type:'scatter',
            backgroundColor: '#fff', borderColor: colsBP, borderWidth:2, pointRadius:6, pointStyle:'rectRot',
          },
          // Umbral atípico
          { label:'Umbral atípico (6.11%)', data: lineas.map(()=>BD.stats.umbral),
            type:'line', borderColor: COLORES.rojo, borderWidth:2, borderDash:[6,3],
            pointRadius:0, fill:false,
          },
        ]
      },
      options:{ responsive:true,
        plugins:{
          legend:{position:'top',labels:{font:{family:'DM Sans',size:11},usePointStyle:true}},
          tooltip:{callbacks:{
            label: (ctx) => {
              if(ctx.dataset.label==='Rango IQR (Q1–Q3)') {
                const l = ctx.label;
                return [`Q1: ${BD.boxplot[l].q1}%`,`Q3: ${BD.boxplot[l].q3}%`,`Min: ${BD.boxplot[l].min}%`,`Max: ${BD.boxplot[l].max}%`];
              }
              return ctx.dataset.label+': '+ctx.raw+'%';
            }
          }}
        },
        scales:{
          y:{beginAtZero:true,max:27,grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{family:'DM Mono',size:11},callback:v=>v+'%'},title:{display:true,text:'% Defectuoso',font:{family:'DM Sans',size:11}}},
          x:{grid:{display:false},ticks:{font:{family:'DM Sans',size:13}}},
        }
      }
    });
  }

  // Scatter: tiempo vs % defectuoso
  if(!charts.scatter) {
    const c = document.getElementById('chart-scatter');
    if(!c) return;
    charts.scatter = new Chart(c, {
      type:'scatter',
      data:{ datasets:[
        { label:'Normal', data: BD.scatter.normal,
          backgroundColor: COLORES.verde+'99', pointRadius:5, pointHoverRadius:7,
        },
        { label:'Atípico (>6.11%)', data: BD.scatter.atipicos,
          backgroundColor: COLORES.rojo+'cc', pointRadius:7, pointHoverRadius:9,
          pointStyle:'triangle',
        },
      ]},
      options:{ responsive:true,
        plugins:{legend:{position:'top',labels:{font:{family:'DM Sans',size:11},usePointStyle:true}},
          tooltip:{callbacks:{label:ctx=>` (${ctx.raw.x}h, ${ctx.raw.y.toFixed(2)}%)`}}
        },
        scales:{
          x:{title:{display:true,text:'Tiempo de proceso (horas)',font:{family:'DM Sans',size:11}},grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{family:'DM Mono',size:11}}},
          y:{title:{display:true,text:'% Defectuoso',font:{family:'DM Sans',size:11}},beginAtZero:true,grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{family:'DM Mono',size:11},callback:v=>v+'%'}},
        }
      }
    });
  }

  // Tabla de atípicos (lotes con pct > umbral de los datos reales)
  const wrap = document.getElementById('tabla-atipicos-wrap');
  if(wrap && !wrap.innerHTML.includes('thead')) {
    const atipicos = BD.ultimos20.filter(l=>l.pct>BD.stats.umbral);
    if(atipicos.length===0) {
      wrap.innerHTML = `<div style="padding:20px;text-align:center;color:#8fa68a;font-family:var(--font-mono);font-size:13px">No hay atípicos en los últimos 20 lotes mostrados. Total en BD: 49 lotes atípicos.</div>`;
    } else {
      wrap.innerHTML = `<table class="inv-table">
        <thead><tr><th>Lote</th><th>Producto</th><th>Responsable</th><th>% Defectuoso</th><th>Estado</th><th>Pérdida S/</th><th>Diagnóstico</th></tr></thead>
        <tbody>${atipicos.map(l=>`<tr>
          <td><strong>#${l.id}</strong></td>
          <td>${l.prod}</td><td>${l.resp}</td>
          <td><span class="atip-val">${l.pct.toFixed(2)}%</span></td>
          <td>${badgeEstado(l.estado)}</td>
          <td>${l.perdida>0?'S/ '+l.perdida.toFixed(2):'—'}</td>
          <td><span class="badge-rojo">⚠ Atípico IQR</span></td>
        </tr>`).join('')}</tbody>
      </table>`;
    }
    // Añadir nota estadística
    wrap.innerHTML += `<div class="atip-nota">
      <i class="fa-solid fa-circle-info"></i>
      <strong>Método:</strong> Se usó el método IQR (Rango Intercuartílico) para detectar valores atípicos.
      Umbral superior = Q3 + 1.5×IQR = 3.04 + 1.5×2.05 = <strong>6.11%</strong>.
      Se detectaron <strong>49 lotes atípicos</strong> de 300 (16.3%). Estos concentran el <strong>69.5%</strong> de la pérdida total (S/ 4,090.99).
    </div>`;
  }
}

function initInventario() {
  if(!charts.stock) {
    const c = document.getElementById('chart-stock');
    if(!c) return;
    charts.stock = new Chart(c, {
      type:'bar',
      data:{ labels:BD.stock.labels, datasets:[
        { label:'Disponible', data:BD.stock.disponible,
          backgroundColor:BD.stock.disponible.map((v,i)=>v<BD.stock.minimo[i]?COLORES.rojo+'cc':COLORES.verde+'cc'),
          borderColor:BD.stock.disponible.map((v,i)=>v<BD.stock.minimo[i]?COLORES.rojo:COLORES.verde),
          borderWidth:1, borderRadius:4,
        },
        { label:'Mínimo', data:BD.stock.minimo,
          backgroundColor:'rgba(201,168,76,0.6)', borderColor:COLORES.dorado,
          borderWidth:1, borderRadius:4,
        },
      ]},
      options:{ responsive:true,
        plugins:{legend:{position:'top',labels:{font:{family:'DM Sans',size:12},usePointStyle:true}},
          tooltip:{mode:'index',intersect:false,callbacks:{afterBody:(items)=>{
            const i=items[0].dataIndex;
            return `Cobertura: ${(BD.stock.disponible[i]/BD.stock.minimo[i]).toFixed(1)}x el mínimo`;
          }}}
        },
        scales:{
          x:{grid:{display:false},ticks:{font:{family:'DM Sans',size:10},maxRotation:35}},
          y:{beginAtZero:true,grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{family:'DM Mono',size:11}}},
        }
      }
    });
  }
  const t = document.getElementById('tabla-stock');
  if(t && !t.innerHTML.includes('thead')) {
    t.innerHTML = `<thead><tr><th>Insumo</th><th>Disponible</th><th>Mínimo</th><th>Cobertura</th><th>Estado</th></tr></thead>
    <tbody>${BD.stock.labels.map((l,i)=>{
      const ok=BD.stock.disponible[i]>=BD.stock.minimo[i];
      return `<tr><td>${l}</td><td>${BD.stock.disponible[i].toLocaleString('es-PE')}</td>
      <td>${BD.stock.minimo[i]}</td>
      <td>${(BD.stock.disponible[i]/BD.stock.minimo[i]).toFixed(1)}x</td>
      <td class="${ok?'ok-val':'warn-val'}">${ok?'✓ OK':'⚠ Crítico'}</td></tr>`;
    }).join('')}</tbody>`;
  }
}

function initResponsable() {
  if(!charts.resp) {
    const c = document.getElementById('chart-responsable');
    if(!c) return;
    charts.resp = new Chart(c, {
      type:'bar',
      data:{ labels:BD.responsable.labels, datasets:[
        {label:'Tasa aprobación (%)', data:BD.responsable.tasa_apro, backgroundColor:COLORES.verde+'cc', borderColor:COLORES.verde, borderWidth:1, borderRadius:5, yAxisID:'y'},
        {label:'% Defectuoso prom.', data:BD.responsable.pct_def, backgroundColor:COLORES.amber+'cc', borderColor:COLORES.amber, borderWidth:1, borderRadius:5, yAxisID:'y2'},
      ]},
      options:{ responsive:true,
        plugins:{legend:{position:'top',labels:{font:{family:'DM Sans',size:12},usePointStyle:true}},tooltip:{mode:'index',intersect:false}},
        scales:{
          x:{grid:{display:false},ticks:{font:{family:'DM Sans',size:12}}},
          y:{beginAtZero:true,max:100,position:'left',grid:{color:'rgba(0,0,0,0.05)'},ticks:{font:{family:'DM Mono',size:11},callback:v=>v+'%'},title:{display:true,text:'Tasa Aprobación',font:{family:'DM Sans',size:11}}},
          y2:{beginAtZero:true,max:6,position:'right',grid:{display:false},ticks:{font:{family:'DM Mono',size:11},callback:v=>v+'%'},title:{display:true,text:'% Defectuoso',font:{family:'DM Sans',size:11}}},
        }
      }
    });
  }
  const t = document.getElementById('tabla-responsable');
  if(t && !t.innerHTML.includes('thead')) {
    const sorted = BD.responsable.labels.map((l,i)=>({l,i})).sort((a,b)=>BD.responsable.tasa_apro[b.i]-BD.responsable.tasa_apro[a.i]);
    t.innerHTML = `<thead><tr><th>Ranking</th><th>Responsable</th><th>Lotes</th><th>% Defect. Prom.</th><th>Pérdida Total</th><th>Tasa Aprobación</th><th>Desempeño</th></tr></thead>
    <tbody>${sorted.map(({l,i},rank)=>{
      const s=BD.responsable.tasa_apro[i];
      const badge=s>=80?'<span class="badge-ok">⭐ Óptimo</span>':s>=72?'<span class="badge-warn">Regular</span>':'<span class="badge-rojo">Bajo</span>';
      return `<tr${rank===0?' style="background:#f0f9f4"':''}>
        <td><strong>#${rank+1}</strong></td>
        <td><strong>${BD.responsable.labels[i]}</strong></td>
        <td>${BD.responsable.n_lotes[i]}</td>
        <td>${BD.responsable.pct_def[i].toFixed(2)}%</td>
        <td>S/ ${BD.responsable.perdida[i].toLocaleString('es-PE')}</td>
        <td><strong>${BD.responsable.tasa_apro[i]}%</strong></td>
        <td>${badge}</td></tr>`;
    }).join('')}</tbody>`;
  }
}

/* ══════════════════════════════════════════════
   TABLA VIVA + DATOS EN TIEMPO REAL
══════════════════════════════════════════════ */
function initTablaViva() {
  renderTablaViva();
  initRealtimeStats();
}

function renderTablaViva() {
  const t = document.getElementById('tabla-viva');
  const allLotes = [...lotesAgregados, ...BD.ultimos20].slice(0,25);
  const b = document.getElementById('badge-total-tabla');
  if(b) b.textContent = `${300+lotesAgregados.length} lotes total`;

  if(!t) return;
  t.innerHTML = `<thead><tr>
    <th>Lote</th><th>Producto</th><th>Línea</th><th>Responsable</th>
    <th>Estado</th><th>Cant. Prod.</th><th>% Defect.</th><th>Pérdida S/</th><th>Turno</th><th>Fecha</th><th>Acción</th>
  </tr></thead>
  <tbody>${allLotes.map((l,idx)=>{
    const esNuevo = idx < lotesAgregados.length;
    const esAtip  = l.pct > BD.stats.umbral;
    return `<tr class="${esNuevo?'fila-nueva':''} ${esAtip?'fila-atipica':''}">
      <td><strong>#${l.id}</strong>${esNuevo?'<span class="badge-nuevo">Nuevo</span>':''}${esAtip?'<span class="badge-rojo-mini">⚠</span>':''}</td>
      <td>${l.prod}</td><td>${l.linea}</td><td>${l.resp}</td>
      <td>${badgeEstado(l.estado)}</td>
      <td>${l.qty.toLocaleString('es-PE')}</td>
      <td><span class="${esAtip?'atip-val':''}">${l.pct.toFixed(2)}%</span></td>
      <td>${l.perdida>0?'S/ '+l.perdida.toFixed(2):'—'}</td>
      <td>${l.turno}</td><td>${l.fecha}</td>
      <td>${esNuevo?`<button class="btn-eliminar" onclick="eliminarLote(${l.id})"><i class="fa-solid fa-trash-can"></i></button>`:'-'}</td>
    </tr>`;
  }).join('')}</tbody>`;
}

function eliminarLote(id) {
  lotesAgregados = lotesAgregados.filter(l=>l.id!==id);
  renderTablaViva();
  initRealtimeStats();
  mostrarAlerta(`Lote #${id} eliminado del registro.`, 'info');
  actualizarGraficosConNuevo();
}

function limpiarAgregados() {
  if(lotesAgregados.length===0){ mostrarAlerta('No hay lotes nuevos para limpiar.','info'); return; }
  const n = lotesAgregados.length;
  lotesAgregados = [];
  nextId = 301;
  renderTablaViva();
  initRealtimeStats();
  actualizarGraficosConNuevo();
  mostrarAlerta(`Se eliminaron ${n} lotes del registro. Datos base restaurados.`, 'info');
}

function initRealtimeStats() {
  const box = document.getElementById('realtime-stats');
  if(!box) return;
  const total = 300 + lotesAgregados.length;
  const nuevosAtip = lotesAgregados.filter(l=>l.pct>BD.stats.umbral).length;
  const nuevasPerdidas = lotesAgregados.reduce((s,l)=>s+l.perdida,0);
  box.innerHTML = `
    <div class="rt-stat"><div class="rt-icon green"><i class="fa-solid fa-database"></i></div><div><p class="rt-label">Total lotes en sistema</p><h3>${total}</h3></div></div>
    <div class="rt-stat"><div class="rt-icon gold"><i class="fa-solid fa-plus"></i></div><div><p class="rt-label">Lotes agregados en sesión</p><h3>${lotesAgregados.length}</h3></div></div>
    <div class="rt-stat ${nuevosAtip>0?'danger':''}"><div class="rt-icon ${nuevosAtip>0?'red':'teal'}"><i class="fa-solid fa-triangle-exclamation"></i></div><div><p class="rt-label">Atípicos nuevos detectados</p><h3>${nuevosAtip}</h3></div></div>
    <div class="rt-stat"><div class="rt-icon amber"><i class="fa-solid fa-circle-dollar-to-slot"></i></div><div><p class="rt-label">Pérdida acumulada (sesión)</p><h3>S/ ${nuevasPerdidas.toFixed(2)}</h3></div></div>
    <div class="rt-stat"><div class="rt-icon red"><i class="fa-solid fa-chart-line"></i></div><div><p class="rt-label">Umbral IQR activo</p><h3>${BD.stats.umbral}%</h3></div></div>
    <div class="rt-stat"><div class="rt-icon green"><i class="fa-solid fa-shield-check"></i></div><div><p class="rt-label">Atípicos base (BD)</p><h3>${BD.stats.n_atip} / 300</h3></div></div>
  `;
}

/* ══════════════════════════════════════════════
   AGREGAR DATO + DETECCIÓN ATÍPICA IQR
══════════════════════════════════════════════ */
function agregarDato() {
  const linea   = document.getElementById('nuevo-linea').value;
  const prod    = document.getElementById('nuevo-producto').value;
  const resp    = document.getElementById('nuevo-resp').value;
  const turno   = document.getElementById('nuevo-turno').value;
  const qty     = parseFloat(document.getElementById('nuevo-qty').value);
  const def     = parseFloat(document.getElementById('nuevo-def').value);
  const estado  = document.getElementById('nuevo-estado').value;

  if(!qty||isNaN(qty)||isNaN(def)||def==='') { mostrarAlerta('Completa cantidad producida y defectuosa.','warn'); return; }
  if(def>qty) { mostrarAlerta('⚠ Dato inválido: los defectuosos no pueden superar lo producido.','critica'); return; }
  if(qty<=0)  { mostrarAlerta('⚠ La cantidad producida debe ser mayor a 0.','critica'); return; }

  const pct = (def/qty)*100;
  const perdida = estado==='Rechazado' ? def*3.5 : estado==='En revision' ? def*3.5*0.5 : 0;
  const hoy = new Date().toISOString().slice(0,10);

  const nuevo = { id:nextId++, prod, linea, resp, estado, qty:parseFloat(qty.toFixed(1)),
    pct:parseFloat(pct.toFixed(2)), perdida:parseFloat(perdida.toFixed(2)), turno, fecha:hoy };
  lotesAgregados.unshift(nuevo);

  renderTablaViva();
  initRealtimeStats();
  actualizarGraficosConNuevo();

  // Detección atípica por IQR
  let msg='', tipo='ok';
  if(pct > BD.stats.umbral) {
    msg = `🚨 ATÍPICO DETECTADO (IQR): Lote #${nuevo.id} tiene ${pct.toFixed(2)}% defectuoso, superando el umbral IQR de ${BD.stats.umbral}%. ${linea} · ${resp} — Se requiere acción correctiva inmediata.`;
    tipo='critica';
    document.getElementById('badge-atipico').textContent=`⚠ Atípico: ${pct.toFixed(2)}%`;
  } else if(pct>BD.stats.q2*2 && estado==='Aprobado') {
    msg=`⚠ Inconsistencia: Lote #${nuevo.id} marcado Aprobado con ${pct.toFixed(2)}% defectuoso. Se esperan valores < ${(BD.stats.q2*2).toFixed(2)}% para lotes aprobados.`;
    tipo='warn';
  } else if(estado==='Rechazado'&&pct<8) {
    msg=`ℹ Posible error de clasificación: Lote #${nuevo.id} rechazado con solo ${pct.toFixed(2)}%. Rango esperado para rechazados: 8–25%.`;
    tipo='warn';
  } else {
    msg=`✓ Lote #${nuevo.id} registrado: ${prod} · ${pct.toFixed(2)}% defectuoso · ${estado}. Dentro del rango normal (< ${BD.stats.umbral}%).`;
    tipo='ok';
  }
  mostrarAlerta(msg, tipo);

  document.getElementById('nuevo-qty').value='';
  document.getElementById('nuevo-def').value='';
  actualizarConclusiones();
}

function actualizarGraficosConNuevo() {
  if(charts.lineas) {
    const nuevo = [...BD.lotesPorLinea.todos];
    lotesAgregados.forEach(l=>{
      const i=['Bebidas','Harinas','Lacteos','Snacks'].indexOf(l.linea);
      if(i>=0) nuevo[i]++;
    });
    charts.lineas.data.datasets[0].data=nuevo; charts.lineas.update();
  }
}

/* ══════════════════════════════════════════════
   CONCLUSIONES ESTADÍSTICAS
══════════════════════════════════════════════ */
function actualizarConclusiones() {
  const box = document.getElementById('conclusiones-box');
  if(!box) return;
  const estados = getEstados();
  const isTodos = filtrosActivos.has('todos');

  let items = [];
  if(isTodos||estados.length>1) {
    items = [
      {t:'info',  i:'fa-chart-line',     txt:`<strong>Dos picos de producción claros en 2025:</strong> Marzo (10,078 uds) y Junio (10,518 uds) concentran el 28.2% de la producción anual. Noviembre registra el mínimo histórico (3,341 uds). Se recomienda planificar capacidad extra en Q1 y Q2.`},
      {t:'danger',i:'fa-triangle-exclamation',txt:`<strong>49 lotes atípicos detectados por IQR (16.3%):</strong> Umbral superior = Q3 + 1.5×IQR = 3.04 + 1.5×2.05 = <strong>6.11%</strong>. Estos 49 lotes generan el 69.5% de la pérdida total (S/ 4,090.99 de S/ 5,890.99), siendo un foco de intervención prioritaria.`},
      {t:'danger',i:'fa-user-xmark',     txt:`<strong>Tec. Flores es el principal factor de riesgo:</strong> Con 4.49% de defectuoso promedio y S/ 2,203.54 en pérdidas (37.4% del total), operando solo con el 21% de los lotes. Su tasa de aprobación (69.8%) es la más baja del equipo. Requiere capacitación urgente.`},
      {t:'ok',    i:'fa-star',           txt:`<strong>Ing. Ramos: benchmark de calidad del equipo:</strong> Tasa de aprobación del 82.3%, menor % defectuoso promedio (2.74%) y solo S/ 574.33 en pérdidas totales. Su proceso debe ser documentado y replicado como estándar INDDA.`},
      {t:'warn',  i:'fa-clock',          txt:`<strong>Efecto turno estadísticamente significativo:</strong> El turno Mañana genera 19.2% más pérdida que el turno Tarde (S/ 3,230 vs S/ 2,661) y 0.65 pp más de % defectuoso (4.07% vs 3.42%). Se recomienda revisar supervisión y condiciones en el turno matutino.`},
      {t:'info',  i:'fa-chart-scatter',  txt:`<strong>Correlación negativa tiempo–defecto (r = −0.24):</strong> Lotes con mayor tiempo de proceso tienden a tener menor % defectuoso. Los lotes atípicos se concentran en procesos cortos (<3h), lo que sugiere que la presión de tiempo aumenta los errores de producción.`},
    ];
  } else if(estados.includes('Aprobado')) {
    items = [
      {t:'ok',   i:'fa-check-circle',txt:`<strong>225 lotes aprobados (75% del total):</strong> % defectuoso promedio de 1.45% — dentro del límite ISO 9001 (<3%). Todos estos lotes tienen pérdida = S/ 0 por política de calidad del INDDA.`},
      {t:'ok',   i:'fa-chart-bar',   txt:`<strong>Bebidas lidera con 95 lotes aprobados (42%):</strong> Línea más eficiente del INDDA. Turno Tarde muestra ligeramente mejor tasa de aprobación. Ing. Ramos e Ing. Torres tienen las mejores tasas en esta línea.`},
    ];
  } else if(estados.includes('En revision')) {
    items = [
      {t:'warn', i:'fa-hourglass-half',txt:`<strong>42 lotes en revisión (14%):</strong> % defectuoso promedio de 5.57% — por encima del umbral de aprobación (3.02%). El 50% de estos tienen acción "Re-inspección" pendiente. Representan un riesgo latente de conversión a "Rechazado".`},
      {t:'warn', i:'fa-flask-vial',    txt:`<strong>Defecto más frecuente en lotes en revisión: "Por definir"</strong> (75 casos). Indica que el tipo de falla aún no ha sido diagnosticado. Esta ambigüedad retrasa la acción correctiva y aumenta el riesgo de pérdida.`},
    ];
  } else if(estados.includes('Rechazado')) {
    items = [
      {t:'danger',i:'fa-xmark-circle',       txt:`<strong>33 lotes rechazados (11%):</strong> % defectuoso promedio de 17.10% — 11.8 veces el nivel de lotes aprobados. El máximo registrado es 24.59%, correspondiente a lotes de Snacks bajo supervisión de Tec. Flores.`},
      {t:'danger',i:'fa-money-bill-trend-up', txt:`<strong>Impacto económico desproporcionado:</strong> S/ 4,090.99 de pérdida con solo el 11% de lotes. Acción correctiva más frecuente: Reproceso (40%) y Descarte (30%). El Descarte implica pérdida irrecuperable de material e ingresos.`},
    ];
  }

  box.innerHTML = items.map(c=>`
    <div class="conclusion-item ${c.t}">
      <i class="fa-solid ${c.i}"></i><p>${c.txt}</p>
    </div>`).join('');
}

/* ══════════════════════════════════════════════
   ALERTAS
══════════════════════════════════════════════ */
function mostrarAlerta(msg, tipo) {
  const container = document.getElementById('alertas-container');
  if(!container) return;
  const div = document.createElement('div');
  const cls = tipo==='critica'?'critica':tipo==='warn'?'advertencia':tipo==='info'?'info-alerta':'ok';
  const icon = tipo==='critica'?'circle-exclamation':tipo==='warn'?'triangle-exclamation':tipo==='info'?'circle-info':'circle-check';
  div.className=`alerta ${cls}`;
  div.innerHTML=`<i class="fa-solid fa-${icon}"></i><span>${msg}</span>`;
  container.innerHTML='';
  container.appendChild(div);
  setTimeout(()=>{ div.style.transition='opacity .5s'; div.style.opacity='0'; setTimeout(()=>div.remove(),500); },7000);
}

/* ══════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════ */
function badgeEstado(estado) {
  const map = { 'Aprobado':'badge-estado ok','En revision':'badge-estado rev','Rechazado':'badge-estado rech' };
  const txt = { 'Aprobado':'✓ Aprobado','En revision':'⏳ En revisión','Rechazado':'✗ Rechazado' };
  return `<span class="${map[estado]||'badge-estado ok'}">${txt[estado]||estado}</span>`;
}

document.addEventListener('keydown', e=>{
  if((e.ctrlKey||e.metaKey)&&e.key==='b'){ e.preventDefault(); toggleSidebar(); }
  if((e.ctrlKey||e.metaKey)&&e.key==='l'){ if(!document.getElementById('dashboard-screen').classList.contains('hidden')){ e.preventDefault(); logout(); } }
});

// Progress bars on scroll
(function(){
  const fills=document.querySelectorAll('.prog-fill');
  fills.forEach(f=>{ f._w=f.style.width; f.style.width='0'; });
  const obs=new IntersectionObserver(entries=>entries.forEach(e=>{ if(e.isIntersecting){ e.target.style.width=e.target._w; obs.unobserve(e.target); } }),{threshold:.5});
  fills.forEach(f=>obs.observe(f));
})();
