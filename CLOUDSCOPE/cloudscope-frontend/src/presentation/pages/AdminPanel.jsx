/**
 * AdminPanel – Panel de administración exclusivo para usuarios con role='admin'.
 * Incluye: monitoreo en tiempo real del sistema, gestión de usuarios,
 * logs del sistema con filtros, y métricas de uso de CloudScope.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CloudScopeLogo } from '../components/icons/CloudIcons.jsx';
import { listProjects } from '../../infrastructure/api/projectStorage.js';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(date) {
  return date.toLocaleTimeString('es-PE', { hour12: false });
}

function formatDate(date) {
  return date.toLocaleString('es-PE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  });
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── Generador de métricas de sistema simuladas ───────────────────────────────
function generateSystemMetrics(prev) {
  return {
    cpu: Math.min(100, Math.max(5, (prev?.cpu ?? 30) + randomBetween(-8, 8))),
    memory: Math.min(95, Math.max(20, (prev?.memory ?? 55) + randomBetween(-5, 5))),
    network: Math.min(100, Math.max(0, randomBetween(10, 70))),
    requests: (prev?.requests ?? 0) + randomBetween(0, 12),
    errors: (prev?.errors ?? 0) + (Math.random() < 0.08 ? 1 : 0),
    uptime: (prev?.uptime ?? 0) + 1,
    activeUsers: Math.max(0, (prev?.activeUsers ?? 3) + randomBetween(-1, 2)),
    dbConnections: Math.max(1, (prev?.dbConnections ?? 5) + randomBetween(-1, 2)),
  };
}

// ─── Tipos de logs ─────────────────────────────────────────────────────────────
const LOG_TYPES = ['INFO', 'WARN', 'ERROR', 'DEBUG', 'SUCCESS'];
const LOG_SOURCES = ['Auth', 'API', 'Database', 'Storage', 'Editor', 'Audit', 'FinOps', 'Export'];
const LOG_MESSAGES = {
  INFO: [
    'Usuario autenticado correctamente en el sistema',
    'Proyecto guardado en localStorage con éxito',
    'Solicitud GET /api/projects procesada',
    'Sesión de usuario iniciada desde nueva IP',
    'Plantilla de arquitectura cargada correctamente',
    'Exportación Terraform completada para proyecto',
    'Conexión a base de datos establecida',
    'Configuración de CORS actualizada',
    'Health check del backend respondido: OK',
  ],
  WARN: [
    'Intento de acceso a ruta protegida sin token',
    'Uso de memoria RAM superó el 75%',
    'Tiempo de respuesta de API mayor a 500ms',
    'Usuario sin rol asignado intentó acceder',
    'Token JWT próximo a expirar en 5 minutos',
    'Límite de proyectos por usuario cercano al máximo',
  ],
  ERROR: [
    'Error de conexión al backend: ECONNREFUSED',
    'Fallo al parsear JSON de importación de proyecto',
    'Error de validación en formulario de registro',
    'Excepción no controlada en DiagramCanvas',
    'Base de datos no disponible temporalmente',
  ],
  DEBUG: [
    'ReactFlow re-render por cambio de nodos (count=12)',
    'calculateCost ejecutado: total=$342.50/mes',
    'runAudit completado: score=87/100, issues=3',
    'localStorage.setItem(cs_projects) → 48KB',
    'Vite HMR actualizado: DiagramCanvas.jsx',
    'useMemo recalculado: filteredProjects=[5 items]',
  ],
  SUCCESS: [
    'Proyecto creado y guardado exitosamente',
    'Auditoría CIS Benchmarks completada sin errores críticos',
    'Terraform HCL exportado: 3 archivos generados',
    'Usuario registrado y verificado correctamente',
    'Backup de proyectos completado',
    'Deploy completado en entorno de producción',
  ],
};

function generateLog(id) {
  const type = LOG_TYPES[Math.floor(Math.random() * LOG_TYPES.length)];
  const source = LOG_SOURCES[Math.floor(Math.random() * LOG_SOURCES.length)];
  const messages = LOG_MESSAGES[type];
  const message = messages[Math.floor(Math.random() * messages.length)];
  return {
    id,
    timestamp: new Date(),
    type,
    source,
    message,
    userId: Math.random() < 0.5 ? 'admin@cloudscope.io' : (Math.random() < 0.5 ? 'demo@cloudscope.io' : null),
    requestId: `req-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
  };
}

// ─── Iconos SVG inline ─────────────────────────────────────────────────────────
function Icon({ path, className = 'w-4 h-4', style = {} }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={style}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

const ICONS = {
  cpu:      'M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18',
  memory:   'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
  network:  'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
  users:    'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
  db:       'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4',
  requests: 'M13 10V3L4 14h7v7l9-11h-7z',
  errors:   'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
  logs:     'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  settings: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
  trash:    'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16',
  refresh:  'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
  download: 'M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4',
  uptime:   'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  power:    'M5.636 5.636a9 9 0 1012.728 0M12 3v9',
  back:     'M10 19l-7-7m0 0l7-7m-7 7h18',
  search:   'M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z',
};

// ─── Gauge circular SVG ────────────────────────────────────────────────────────
function CircularGauge({ value, color, label }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ position: 'relative', width: 80, height: 80 }}>
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={r} fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle
            cx="40" cy="40" r={r}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 40 40)"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 900, color }}>{value}%</span>
        </div>
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#64748b' }}>{label}</span>
    </div>
  );
}

// ─── Sparkline mini-chart ──────────────────────────────────────────────────────
function Sparkline({ data, color }) {
  const W = 240, H = 40;
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - ((v - min) / range) * H;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Log badge ────────────────────────────────────────────────────────────────
const LOG_COLORS = {
  INFO:    { bg: 'rgba(56,189,248,0.12)',  color: '#38bdf8', border: 'rgba(56,189,248,0.3)' },
  WARN:    { bg: 'rgba(250,204,21,0.12)',  color: '#facc15', border: 'rgba(250,204,21,0.3)' },
  ERROR:   { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444', border: 'rgba(239,68,68,0.3)' },
  DEBUG:   { bg: 'rgba(148,163,184,0.10)', color: '#94a3b8', border: 'rgba(148,163,184,0.2)' },
  SUCCESS: { bg: 'rgba(52,211,153,0.12)',  color: '#34d399', border: 'rgba(52,211,153,0.3)' },
};

function LogBadge({ type }) {
  const c = LOG_COLORS[type] ?? LOG_COLORS.DEBUG;
  return (
    <span style={{
      fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 4,
      textTransform: 'uppercase', letterSpacing: 1, flexShrink: 0,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>
      {type}
    </span>
  );
}

// ─── Barra de progreso ────────────────────────────────────────────────────────
function MetricBar({ value, color }) {
  return (
    <div style={{ height: 6, borderRadius: 999, background: '#1e293b', overflow: 'hidden' }}>
      <div style={{ height: '100%', borderRadius: 999, width: `${value}%`, background: color, transition: 'width 0.5s ease' }} />
    </div>
  );
}

// ─── ADMIN PANEL PRINCIPAL ────────────────────────────────────────────────────
export default function AdminPanel() {
  const navigate = useNavigate();
  const userRaw = localStorage.getItem('cs_user');
  const user = userRaw ? JSON.parse(userRaw) : null;
  const isAdmin = user?.role === 'admin';

  const [activeTab, setActiveTab] = useState('monitor');
  const [metrics, setMetrics] = useState(() => generateSystemMetrics(null));
  const [cpuHistory, setCpuHistory] = useState([30]);
  const [memHistory, setMemHistory] = useState([55]);
  const [netHistory, setNetHistory] = useState([20]);
  const [logs, setLogs] = useState(() =>
    Array.from({ length: 40 }, (_, i) => {
      const log = generateLog(i + 1);
      log.timestamp = new Date(Date.now() - (40 - i) * 8000);
      return log;
    })
  );
  const [logFilter, setLogFilter] = useState('ALL');
  const [logSearch, setLogSearch] = useState('');
  const [autoScroll, setAutoScroll] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const logRef = useRef(null);
  const logIdRef = useRef(41);
  const [projects, setProjects] = useState(() => listProjects());

  const registeredRaw = localStorage.getItem('cs_registered_users');
  const registered = registeredRaw ? JSON.parse(registeredRaw) : [];
  const allUsers = [
    { email: 'admin@cloudscope.io', name: 'Admin User', role: 'admin',   lastLogin: new Date(Date.now() - 60000) },
    { email: 'demo@cloudscope.io',  name: 'Demo User',  role: 'viewer',  lastLogin: new Date(Date.now() - 3600000) },
    ...registered.map((u, i) => ({ ...u, role: u.role ?? 'user', lastLogin: new Date(Date.now() - randomBetween(0, 86400000)) })),
  ];

  // Métricas en tiempo real
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setMetrics(prev => {
        const next = generateSystemMetrics(prev);
        setCpuHistory(h => [...h.slice(-29), next.cpu]);
        setMemHistory(h => [...h.slice(-29), next.memory]);
        setNetHistory(h => [...h.slice(-29), next.network]);
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Generación de logs
  useEffect(() => {
    if (isPaused) return;
    const delay = randomBetween(1500, 3500);
    const timeout = setTimeout(() => {
      setLogs(prev => [...prev.slice(-199), generateLog(logIdRef.current++)]);
    }, delay);
    return () => clearTimeout(timeout);
  }, [logs, isPaused]);

  // Auto-scroll
  useEffect(() => {
    if (autoScroll && logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs, autoScroll]);

  const filteredLogs = logs.filter(log => {
    if (logFilter !== 'ALL' && log.type !== logFilter) return false;
    if (logSearch) {
      const q = logSearch.toLowerCase();
      return log.message.toLowerCase().includes(q) ||
        log.source.toLowerCase().includes(q) ||
        (log.userId ?? '').toLowerCase().includes(q);
    }
    return true;
  });

  const logCounts = logs.reduce((acc, l) => { acc[l.type] = (acc[l.type] ?? 0) + 1; return acc; }, {});

  const handleExportLogs = () => {
    const text = filteredLogs.map(l =>
      `[${formatDate(l.timestamp)}] [${l.type}] [${l.source}] ${l.message}${l.userId ? ` | user=${l.userId}` : ''} | ${l.requestId}`
    ).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cloudscope-logs-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const uptimeStr = (() => {
    const s = metrics.uptime;
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  })();

  const BG = '#080d18', CARD = '#0f172a', BORDER = '#1e293b';
  const textPrimary = '#f8fafc', textMuted = '#64748b', textDim = '#334155';

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: BG, fontFamily: "'Inter', sans-serif" }}>
        <div style={{ textAlign: 'center', padding: 32, borderRadius: 20, background: CARD, border: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h1 style={{ color: textPrimary, fontWeight: 900, fontSize: 22, marginBottom: 8 }}>Acceso Denegado</h1>
          <p style={{ color: textMuted, marginBottom: 20, fontSize: 13 }}>Solo los administradores pueden acceder a este panel.</p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ padding: '10px 24px', borderRadius: 12, fontWeight: 700, fontSize: 13, background: '#0084ff', color: '#fff', border: 'none', cursor: 'pointer' }}
          >
            Volver al Dashboard
          </button>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'monitor', label: 'Monitoreo', icon: ICONS.cpu },
    { id: 'logs',    label: 'Logs del Sistema', icon: ICONS.logs },
    { id: 'users',   label: 'Usuarios', icon: ICONS.users },
    { id: 'system',  label: 'Sistema', icon: ICONS.settings },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: BG, fontFamily: "'Inter', sans-serif" }}>

      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px', background: '#0a0f1e', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <CloudScopeLogo className="w-5 h-5" />
            <span style={{ fontWeight: 900, fontSize: 14, color: textPrimary }}>
              Cloud<span style={{ color: '#f59e0b' }}>Scope</span>
            </span>
            <span style={{ fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 6, background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', letterSpacing: 1 }}>
              ADMIN
            </span>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(148,163,184,0.06)', border: '1px solid #1e293b', borderRadius: 7, color: '#475569', fontSize: 11, fontWeight: 600, cursor: 'pointer', padding: '4px 10px' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#334155'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#1e293b'; }}
          >
            Volver al Dashboard
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: isPaused ? '#475569' : '#34d399',
              boxShadow: isPaused ? 'none' : '0 0 8px #34d399',
              animation: isPaused ? 'none' : 'pulse 2s infinite',
            }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: isPaused ? '#475569' : '#34d399' }}>
              {isPaused ? 'PAUSADO' : 'EN VIVO'}
            </span>
          </div>
          <button
            onClick={() => setIsPaused(p => !p)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer',
              background: isPaused ? 'rgba(52,211,153,0.1)' : 'rgba(239,68,68,0.1)',
              color: isPaused ? '#34d399' : '#ef4444',
              border: `1px solid ${isPaused ? 'rgba(52,211,153,0.3)' : 'rgba(239,68,68,0.3)'}`,
            }}
          >
            <Icon path={isPaused ? ICONS.refresh : ICONS.power} className="w-3.5 h-3.5" />
            {isPaused ? 'Reanudar' : 'Pausar'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: CARD, border: `1px solid ${BORDER}`, fontSize: 11, fontWeight: 700, fontFamily: 'monospace', color: '#94a3b8' }}>
            <Icon path={ICONS.uptime} className="w-3.5 h-3.5" />
            UPTIME: {uptimeStr}
          </div>
        </div>
      </header>

      {/* ── Tabs ─────────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '0 24px', background: '#0a0f1e', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '12px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              background: 'transparent', border: 'none',
              borderBottom: `2px solid ${activeTab === tab.id ? '#f59e0b' : 'transparent'}`,
              color: activeTab === tab.id ? '#f59e0b' : '#475569',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.color = '#94a3b8'; }}
            onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.color = '#475569'; }}
          >
            <Icon path={tab.icon} className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Contenido ────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 24 }}>

        {/* ═══════════════════════ MONITOR ═══════════════════════ */}
        {activeTab === 'monitor' && (
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {[
                { label: 'Solicitudes Totales', value: metrics.requests.toLocaleString(), icon: ICONS.requests, color: '#38bdf8', sub: 'Total acumulado' },
                { label: 'Errores 5xx/4xx',     value: metrics.errors,                   icon: ICONS.errors,   color: '#ef4444', sub: `${((metrics.errors / Math.max(metrics.requests, 1)) * 100).toFixed(2)}% tasa de error` },
                { label: 'Usuarios Activos',    value: metrics.activeUsers,              icon: ICONS.users,    color: '#34d399', sub: `${allUsers.length} registrados en total` },
                { label: 'Conexiones DB',       value: metrics.dbConnections,            icon: ICONS.db,       color: '#a78bfa', sub: 'PostgreSQL / H2' },
              ].map(kpi => (
                <div key={kpi.label} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#475569' }}>{kpi.label}</span>
                    <Icon path={kpi.icon} className="w-4 h-4" style={{ color: kpi.color }} />
                  </div>
                  <div style={{ fontSize: 32, fontWeight: 900, fontFamily: 'monospace', color: kpi.color }}>{kpi.value}</div>
                  <div style={{ fontSize: 11, color: textDim }}>{kpi.sub}</div>
                </div>
              ))}
            </div>

            {/* Gauges + Sparklines */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { title: 'CPU', sub: 'Spring Boot / Vite Process', val: metrics.cpu, hist: cpuHistory, color: metrics.cpu > 80 ? '#ef4444' : metrics.cpu > 60 ? '#f59e0b' : '#34d399', barColor: metrics.cpu > 80 ? 'linear-gradient(90deg,#ef4444,#dc2626)' : metrics.cpu > 60 ? 'linear-gradient(90deg,#f59e0b,#f97316)' : 'linear-gradient(90deg,#34d399,#10b981)' },
                { title: 'Memoria RAM', sub: 'Heap JVM + Node.js', val: metrics.memory, hist: memHistory, color: metrics.memory > 85 ? '#ef4444' : '#a78bfa', barColor: metrics.memory > 85 ? 'linear-gradient(90deg,#ef4444,#dc2626)' : 'linear-gradient(90deg,#a78bfa,#7c3aed)' },
                { title: 'Red / API', sub: 'Ancho de banda activo', val: metrics.network, hist: netHistory, color: '#38bdf8', barColor: 'linear-gradient(90deg,#38bdf8,#0284c7)' },
              ].map(m => (
                <div key={m.title} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, color: '#94a3b8' }}>{m.title}</div>
                      <div style={{ fontSize: 11, color: textDim, marginTop: 2 }}>{m.sub}</div>
                    </div>
                    <CircularGauge value={m.val} color={m.color} label={m.title.split(' ')[0]} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: textDim, marginBottom: 6 }}>
                      <span>Historial (30s)</span>
                      <span style={{ color: m.color, fontWeight: 700 }}>{m.val}%</span>
                    </div>
                    <Sparkline data={m.hist} color={m.color} />
                  </div>
                  <MetricBar value={m.val} color={m.barColor} />
                </div>
              ))}
            </div>

            {/* Estado de servicios */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: textPrimary, fontWeight: 900, fontSize: 14, marginBottom: 16 }}>Estado de Servicios</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
                {[
                  { name: 'Frontend (Vite)', port: 5173, up: true, lat: randomBetween(2, 8) },
                  { name: 'Backend Spring',  port: 8080, up: true, lat: randomBetween(15, 45) },
                  { name: 'Base de Datos',   port: 5432, up: metrics.dbConnections > 0, lat: randomBetween(1, 5) },
                  { name: 'Auth Service',    port: 8080, up: true, lat: randomBetween(10, 30) },
                ].map(svc => (
                  <div key={svc.name} style={{ background: BG, border: `1px solid ${svc.up ? 'rgba(52,211,153,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>{svc.name}</span>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: svc.up ? '#34d399' : '#ef4444', boxShadow: `0 0 6px ${svc.up ? '#34d399' : '#ef4444'}` }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', color: svc.up ? '#34d399' : '#ef4444' }}>{svc.up ? 'ACTIVO' : 'CAÍDO'}</span>
                      <span style={{ fontSize: 10, fontFamily: 'monospace', color: textDim }}>:{svc.port}</span>
                    </div>
                    <div style={{ fontSize: 10, color: textDim }}>
                      Latencia: <span style={{ color: svc.lat > 30 ? '#f59e0b' : '#34d399', fontWeight: 700 }}>{svc.lat}ms</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Proyectos */}
            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, padding: 20 }}>
              <h3 style={{ color: textPrimary, fontWeight: 900, fontSize: 14, marginBottom: 16 }}>Proyectos en el Sistema ({projects.length})</h3>
              {projects.length === 0 ? (
                <p style={{ color: textDim, fontSize: 12, textAlign: 'center', padding: '16px 0' }}>No hay proyectos registrados aún.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  {projects.slice(0, 6).map(p => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, background: BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 10, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 12, color: '#fff', background: 'linear-gradient(135deg,#0084ff,#7c3aed)' }}>
                        {(p.name?.[0] ?? '?').toUpperCase()}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                        <div style={{ fontSize: 10, color: '#475569' }}>{p.nodes?.length ?? 0} nodos</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════ LOGS ═══════════════════════ */}
        {activeTab === 'logs' && (
          <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* ── Ventana estilo macOS Terminal ── */}
            <div style={{ borderRadius: 12, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 180px)', minHeight: 520 }}>

              {/* ── Fila 1: Title bar macOS ── */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '10px 16px', background: '#1c1c1e', borderBottom: '1px solid #2c2c2e', flexShrink: 0, position: 'relative' }}>

                {/* Traffic lights */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#ff5f57', boxShadow: '0 0 4px rgba(255,95,87,0.5)' }} />
                  <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#febc2e', boxShadow: '0 0 4px rgba(254,188,46,0.5)' }} />
                  <div style={{ width: 13, height: 13, borderRadius: '50%', background: '#28c840', boxShadow: '0 0 4px rgba(40,200,64,0.5)' }} />
                </div>

                {/* Título centrado — usa flex: 1 + texto centrado para no solapar */}
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', letterSpacing: 0.2 }}>cloudscope — system logs — zsh</span>
                </div>

                {/* Indicador EN VIVO alineado a la derecha */}
                <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', borderRadius: 6, background: isPaused ? 'rgba(107,114,128,0.15)' : 'rgba(40,200,64,0.1)', border: `1px solid ${isPaused ? 'rgba(107,114,128,0.2)' : 'rgba(40,200,64,0.25)'}` }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: isPaused ? '#6b7280' : '#28c840', boxShadow: isPaused ? 'none' : '0 0 6px #28c840' }} />
                  <span style={{ fontSize: 10, fontWeight: 700, fontFamily: 'monospace', color: isPaused ? '#6b7280' : '#28c840', letterSpacing: 0.5 }}>{isPaused ? 'PAUSED' : 'LIVE'}</span>
                </div>
              </div>

              {/* ── Fila 2: Toolbar de controles ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: '#161618', borderBottom: '1px solid #2c2c2e', flexShrink: 0, flexWrap: 'nowrap', overflowX: 'auto' }}>

                {/* Buscador grep */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <input
                    type="text"
                    value={logSearch}
                    onChange={e => setLogSearch(e.target.value)}
                    placeholder="grep..."
                    style={{ width: 130, padding: '4px 8px 4px 26px', borderRadius: 6, fontSize: 11, outline: 'none', background: '#2c2c2e', border: '1px solid #3a3a3c', color: '#e5e5ea', fontFamily: 'monospace', boxSizing: 'border-box' }}
                  />
                  <Icon path={ICONS.search} className="w-3 h-3" style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                </div>

                {/* Separador */}
                <div style={{ width: 1, height: 16, background: '#2c2c2e', flexShrink: 0 }} />

                {/* Filtros */}
                {['ALL', 'INFO', 'WARN', 'ERROR', 'DEBUG', 'SUCCESS'].map(type => {
                  const c = type === 'ALL' ? { color: '#9ca3af', bg: 'rgba(156,163,175,0.12)', border: 'rgba(156,163,175,0.25)' } : (LOG_COLORS[type] ?? LOG_COLORS.DEBUG);
                  const active = logFilter === type;
                  const count = type === 'ALL' ? logs.length : (logCounts[type] ?? 0);
                  return (
                    <button
                      key={type}
                      onClick={() => setLogFilter(type)}
                      style={{ padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace', background: active ? c.bg : 'transparent', color: active ? c.color : '#4b5563', border: `1px solid ${active ? c.border : 'transparent'}`, transition: 'all 0.15s', flexShrink: 0, whiteSpace: 'nowrap' }}
                    >
                      {type}<span style={{ marginLeft: 4, opacity: 0.7 }}>{count}</span>
                    </button>
                  );
                })}

                {/* Separador */}
                <div style={{ flex: 1 }} />

                {/* Acciones */}
                <button
                  onClick={() => setIsPaused(p => !p)}
                  style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer', background: isPaused ? 'rgba(40,200,64,0.12)' : 'rgba(255,95,87,0.12)', color: isPaused ? '#28c840' : '#ff5f57', border: `1px solid ${isPaused ? 'rgba(40,200,64,0.25)' : 'rgba(255,95,87,0.25)'}`, fontFamily: 'monospace', flexShrink: 0 }}
                >
                  {isPaused ? 'resume' : 'pause'}
                </button>

                <button
                  onClick={() => setLogs([])}
                  style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer', background: 'rgba(107,114,128,0.1)', color: '#6b7280', border: '1px solid rgba(107,114,128,0.2)', fontFamily: 'monospace', flexShrink: 0 }}
                >
                  clear
                </button>

                <button
                  onClick={handleExportLogs}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer', background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)', fontFamily: 'monospace', flexShrink: 0 }}
                >
                  <Icon path={ICONS.download} className="w-3 h-3" />
                  export
                </button>

                <button
                  onClick={() => setAutoScroll(a => !a)}
                  style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: 'pointer', background: autoScroll ? 'rgba(40,200,64,0.1)' : 'rgba(107,114,128,0.08)', color: autoScroll ? '#28c840' : '#4b5563', border: `1px solid ${autoScroll ? 'rgba(40,200,64,0.25)' : 'rgba(107,114,128,0.15)'}`, fontFamily: 'monospace', flexShrink: 0 }}
                >
                  {autoScroll ? 'tail -f' : 'scroll off'}
                </button>
              </div>

              {/* Área de logs estilo terminal */}
              <div
                ref={logRef}
                onScroll={e => {
                  const el = e.currentTarget;
                  setAutoScroll(el.scrollHeight - el.scrollTop <= el.clientHeight + 20);
                }}
                style={{
                  flex: 1, overflowY: 'auto', background: '#0d0d0d',
                  fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', 'JetBrains Mono', 'Consolas', monospace",
                  fontSize: 12, lineHeight: 1.7, padding: '12px 0',
                }}
              >
                {/* Prompt de bienvenida */}
                <div style={{ padding: '0 16px 8px', borderBottom: '1px solid #1a1a1a', marginBottom: 4 }}>
                  <span style={{ color: '#28c840' }}>admin@cloudscope</span>
                  <span style={{ color: '#6b7280' }}>:</span>
                  <span style={{ color: '#38bdf8' }}>~/system/logs</span>
                  <span style={{ color: '#6b7280' }}> $ </span>
                  <span style={{ color: '#e5e5ea' }}>tail -f cloudscope.log | grep --color=always .</span>
                </div>

                {filteredLogs.length === 0 ? (
                  <div style={{ padding: '32px 16px', color: '#4b5563', textAlign: 'center' }}>
                    <span style={{ color: '#28c840' }}>cloudscope@system</span><span style={{ color: '#6b7280' }}>:~$ </span>
                    <span>No entries match filter "{logFilter !== 'ALL' ? logFilter : logSearch}"</span>
                  </div>
                ) : filteredLogs.map((log, idx) => {
                  const TYPE_STYLE = {
                    INFO:    { color: '#38bdf8', prefix: 'INFO ' },
                    WARN:    { color: '#facc15', prefix: 'WARN ' },
                    ERROR:   { color: '#f87171', prefix: 'ERR! ' },
                    DEBUG:   { color: '#94a3b8', prefix: 'DEBG ' },
                    SUCCESS: { color: '#4ade80', prefix: 'SUCC ' },
                  };
                  const ts = TYPE_STYLE[log.type] ?? TYPE_STYLE.DEBUG;
                  const isError = log.type === 'ERROR';
                  return (
                    <div
                      key={log.id}
                      style={{
                        display: 'flex', alignItems: 'baseline', gap: 0,
                        padding: '1px 16px',
                        background: isError ? 'rgba(248,113,113,0.04)' : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)',
                        borderLeft: isError ? '2px solid rgba(248,113,113,0.4)' : '2px solid transparent',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = isError ? 'rgba(248,113,113,0.04)' : idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.012)'}
                    >
                      {/* Timestamp */}
                      <span style={{ color: '#374151', flexShrink: 0, minWidth: 76, fontSize: 11 }}>{formatTime(log.timestamp)}</span>
                      {/* Tipo */}
                      <span style={{ color: ts.color, flexShrink: 0, minWidth: 48, fontWeight: 700, fontSize: 11 }}>[{ts.prefix.trim()}]</span>
                      {/* Source */}
                      <span style={{ color: '#6366f1', flexShrink: 0, minWidth: 70, fontSize: 11 }}>[{log.source.padEnd(8)}]</span>
                      {/* Separador */}
                      <span style={{ color: '#374151', flexShrink: 0, marginRight: 8, fontSize: 11 }}>--</span>
                      {/* Mensaje principal */}
                      <span style={{ color: isError ? '#fca5a5' : log.type === 'WARN' ? '#fde68a' : log.type === 'SUCCESS' ? '#86efac' : log.type === 'DEBUG' ? '#94a3b8' : '#e5e5ea', flex: 1, fontSize: 12 }}>{log.message}</span>
                      {/* User */}
                      {log.userId && <span style={{ color: '#374151', fontSize: 10, flexShrink: 0, marginLeft: 12 }}>{log.userId}</span>}
                      {/* Request ID */}
                      <span style={{ color: '#1f2937', fontSize: 10, flexShrink: 0, marginLeft: 8, fontFamily: 'monospace' }}>{log.requestId}</span>
                    </div>
                  );
                })}

                {/* Cursor parpadeante al final */}
                {!isPaused && (
                  <div style={{ padding: '4px 16px', display: 'flex', alignItems: 'center', gap: 0 }}>
                    <span style={{ color: '#28c840' }}>admin@cloudscope</span>
                    <span style={{ color: '#6b7280' }}>:</span>
                    <span style={{ color: '#38bdf8' }}>~/system/logs</span>
                    <span style={{ color: '#6b7280' }}> $ </span>
                    <span style={{ display: 'inline-block', width: 8, height: 14, background: '#e5e5ea', animation: 'blink 1.2s step-end infinite', marginLeft: 2, verticalAlign: 'middle' }} />
                  </div>
                )}
              </div>

              {/* Status bar inferior estilo terminal */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 16px', background: '#1c1c1e', borderTop: '1px solid #2c2c2e', flexShrink: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#4b5563' }}>UTF-8</span>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#4b5563' }}>zsh</span>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#4b5563' }}>{filteredLogs.length} lines</span>
                  {logFilter !== 'ALL' && <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#6366f1' }}>filter: {logFilter}</span>}
                  {logSearch && <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#38bdf8' }}>grep: "{logSearch}"</span>}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: logCounts['ERROR'] > 0 ? '#f87171' : '#4b5563' }}>{logCounts['ERROR'] ?? 0} errors</span>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: logCounts['WARN'] > 0 ? '#facc15' : '#4b5563' }}>{logCounts['WARN'] ?? 0} warnings</span>
                  <span style={{ fontSize: 10, fontFamily: 'monospace', color: '#4b5563' }}>total: {logs.length}</span>
                </div>
              </div>
            </div>

            {/* CSS para el cursor parpadeante */}
            <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
          </div>
        )}

        {/* ═══════════════════════ USUARIOS ═══════════════════════ */}
        {activeTab === 'users' && (
          <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h2 style={{ color: textPrimary, fontWeight: 900, fontSize: 18 }}>Usuarios Registrados ({allUsers.length})</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', fontSize: 11, fontWeight: 700 }}>
                <Icon path={ICONS.users} className="w-3.5 h-3.5" />
                {metrics.activeUsers} activos ahora
              </div>
            </div>

            <div style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
              {/* Cabecera */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 2fr 1fr', gap: 16, padding: '12px 20px', background: BG, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, color: textDim, borderBottom: `1px solid ${BORDER}` }}>
                <span>Usuario</span><span>Email</span><span>Rol</span><span>Último acceso</span><span>Estado</span>
              </div>
              {allUsers.map((u, idx) => {
                const roleColor = u.role === 'admin' ? '#ef4444' : u.role === 'viewer' ? '#38bdf8' : '#a78bfa';
                const roleBg   = u.role === 'admin' ? 'rgba(239,68,68,0.1)' : u.role === 'viewer' ? 'rgba(56,189,248,0.1)' : 'rgba(167,139,250,0.1)';
                const initials = (u.name ?? u.email).split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                const avatarBg = ['#0084ff', '#ef4444', '#f59e0b', '#34d399', '#a78bfa'][idx % 5];
                return (
                  <div
                    key={u.email}
                    style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 2fr 1fr', gap: 16, padding: '14px 20px', alignItems: 'center', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', borderBottom: idx < allUsers.length - 1 ? `1px solid #0f172a` : 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: avatarBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 10, color: '#fff', flexShrink: 0 }}>{initials}</div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#e2e8f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name ?? '—'}</span>
                    </div>
                    <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</span>
                    <span style={{ fontSize: 10, fontWeight: 900, padding: '2px 8px', borderRadius: 6, width: 'fit-content', textTransform: 'uppercase', letterSpacing: 0.5, background: roleBg, color: roleColor, border: `1px solid ${roleColor}40` }}>{u.role}</span>
                    <span style={{ fontSize: 10, color: '#475569' }}>{u.lastLogin ? formatDate(u.lastLogin) : '—'}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
                      <span style={{ fontSize: 10, fontWeight: 600, color: '#34d399' }}>Activo</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ═══════════════════════ SISTEMA ═══════════════════════ */}
        {activeTab === 'system' && (
          <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <h2 style={{ color: textPrimary, fontWeight: 900, fontSize: 18 }}>Información del Sistema</h2>

            {[
              { title: 'Stack Tecnológico', items: [
                { key: 'Frontend',      val: 'React 18 + Vite 5 + ReactFlow 11', color: '#38bdf8' },
                { key: 'Backend',       val: 'Spring Boot 3.3.3 (Java 21)',        color: '#34d399' },
                { key: 'Base de Datos', val: 'PostgreSQL 16 / H2 (dev mode)',      color: '#a78bfa' },
                { key: 'Auth',          val: 'JWT (mock local) + Spring Security', color: '#f59e0b' },
                { key: 'IaC Export',    val: 'Terraform HCL Multi-provider',       color: '#f97316' },
                { key: 'Estilo',        val: 'TailwindCSS 4 + CSS-in-JS',          color: '#fb7185' },
              ]},
              { title: 'Configuración de Entorno', items: [
                { key: 'SPRING_PROFILES_ACTIVE', val: 'dev / prod', color: '#94a3b8' },
                { key: 'DB_HOST',                val: 'localhost / cloudscope-db (Docker)', color: '#94a3b8' },
                { key: 'DB_PORT',                val: '5432', color: '#94a3b8' },
                { key: 'API_BASE_URL',           val: 'http://localhost:8080/api', color: '#94a3b8' },
                { key: 'FRONTEND_PORT',          val: '5173 (dev) / 80 (prod)', color: '#94a3b8' },
              ]},
              { title: 'Versión y Metadatos', items: [
                { key: 'Versión',       val: 'CloudScope v1.0.0-SNAPSHOT', color: '#f59e0b' },
                { key: 'Proyecto',      val: 'SI-784 · UPT EPIS 2026-II', color: '#f59e0b' },
                { key: 'Desarrollador', val: 'Halanocca & Marca',           color: '#f59e0b' },
                { key: 'Licencia',      val: 'Académica — UPT',             color: '#f59e0b' },
              ]},
            ].map(section => (
              <div key={section.title} style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden' }}>
                <div style={{ padding: '10px 20px', background: BG, fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, color: textDim, borderBottom: `1px solid ${BORDER}` }}>
                  {section.title}
                </div>
                {section.items.map((item, i) => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', background: i % 2 !== 0 ? 'rgba(255,255,255,0.01)' : 'transparent', borderBottom: i < section.items.length - 1 ? `1px solid ${BG}` : 'none' }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#64748b' }}>{item.key}</span>
                    <span style={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: item.color }}>{item.val}</span>
                  </div>
                ))}
              </div>
            ))}

            {/* Zona de peligro */}
            <div style={{ background: CARD, border: '1px solid rgba(239,68,68,0.3)', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 1, color: '#ef4444', marginBottom: 16 }}>⚠ Zona de Peligro — Acciones Administrativas</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <button
                  onClick={() => { if (window.confirm('¿Limpiar todos los proyectos del sistema?')) { localStorage.removeItem('cs_projects'); setProjects([]); alert('Proyectos eliminados.'); } }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
                >
                  <Icon path={ICONS.trash} className="w-3.5 h-3.5" />
                  Limpiar todos los proyectos
                </button>
                <button
                  onClick={() => { if (window.confirm('¿Eliminar todos los usuarios registrados?')) { localStorage.removeItem('cs_registered_users'); alert('Usuarios eliminados.'); } }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: 'pointer', background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                >
                  <Icon path={ICONS.users} className="w-3.5 h-3.5" />
                  Limpiar usuarios registrados
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
