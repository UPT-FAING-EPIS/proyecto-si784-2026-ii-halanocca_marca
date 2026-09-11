import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatUSD } from '../../../application/use-cases/calculateCost.js';
import { ARCHITECTURE_PRESETS } from '../../../domain/models/ArchitecturePresets.js';
import { CloudScopeLogo, AwsLogo, AzureLogo, GcpLogo } from '../icons/CloudIcons.jsx';

export default function Header({
  costBreakdown,
  auditResult,
  onExportIaC,
  onExportPDF,
  onSave,
  blastActive,
  onClearBlast,
  onLoadPreset,
  onClearCanvas,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}) {
  const navigate = useNavigate();
  const [exported, setExported] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const presetsRef = useRef(null);

  // Cerrar presets al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (presetsRef.current && !presetsRef.current.contains(e.target)) {
        setShowPresets(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Sesión de usuario
  const userRaw = localStorage.getItem('cs_user');
  const user = userRaw ? JSON.parse(userRaw) : { name: 'Dev User', email: 'dev@cloudscope.io' };

  const handleLogout = () => {
    sessionStorage.setItem('cs_logout', '1');
    localStorage.removeItem('cs_token');
    localStorage.removeItem('cs_user');
    navigate('/login');
  };

  const total = costBreakdown?.total ?? 0;
  const score = auditResult?.score ?? 100;
  const issueCount = auditResult?.total ?? 0;
  const critical = auditResult?.critical ?? 0;

  const scoreColor =
    score >= 80 ? '#34d399' :
    score >= 60 ? '#f59e0b' :
    score >= 40 ? '#f97316' : '#ef4444';

  const issueColor =
    critical > 0 ? '#ef4444' :
    issueCount > 0 ? '#f97316' : '#475569';

  const handleExport = () => {
    onExportIaC?.();
    setExported(true);
    setTimeout(() => setExported(false), 2500);
  };

  return (
    <header
      className="flex items-center justify-between px-3 md:px-4 z-40 shrink-0 gap-2"
      style={{
        height: '52px',
        background: '#0a0f1e',
        borderBottom: '1px solid #1e293b',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* ── Izquierda: Botón Atrás + Logo + Breadcrumb + Deshacer/Rehacer ── */}
      <div className="flex items-center gap-2">
        {/* Botón Navegación Atrás (Volver a Proyectos) */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-300 hover:text-white transition-all"
          style={{ background: '#1e293b', border: '1px solid #334155' }}
          title="Volver a lista de proyectos (Atrás)"
        >
          <span>←</span>
          <span className="hidden sm:inline">Proyectos</span>
        </button>

        {/* Botones de Historial del Navegador (Atrás / Adelante) */}
        <div className="hidden lg:flex items-center rounded-lg p-0.5" style={{ background: '#111827', border: '1px solid #1e293b' }}>
          <button
            onClick={() => navigate(-1)}
            className="w-6 h-6 flex items-center justify-center rounded text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Página anterior (Atrás en navegador)"
          >
            ‹
          </button>
          <button
            onClick={() => navigate(1)}
            className="w-6 h-6 flex items-center justify-center rounded text-[11px] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Página siguiente (Adelante en navegador)"
          >
            ›
          </button>
        </div>

        {/* Separador */}
        <div className="w-px h-4 bg-slate-800 hidden sm:block" />

        {/* Logo oficial CloudScope */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          title="Ir al Dashboard"
        >
          <CloudScopeLogo className="w-6 h-6 shrink-0" />
          <span className="font-black text-sm tracking-tight hidden md:block" style={{ color: '#f8fafc' }}>
            Cloud<span style={{ color: '#f59e0b' }}>Scope</span>
          </span>
        </button>

        {/* Controles de Historial del Lienzo: Atrás (Deshacer) / Adelante (Rehacer) */}
        <div className="flex items-center gap-1 ml-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all"
            style={{
              background: canUndo ? '#1e293b' : 'rgba(30,41,59,0.4)',
              color: canUndo ? '#cbd5e1' : '#475569',
              border: '1px solid #334155',
              cursor: canUndo ? 'pointer' : 'not-allowed',
            }}
            title="Atrás en cambios / Deshacer (Ctrl+Z)"
          >
            <span>↩</span>
            <span className="hidden xl:inline text-[10px]">Atrás</span>
          </button>

          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold transition-all"
            style={{
              background: canRedo ? '#1e293b' : 'rgba(30,41,59,0.4)',
              color: canRedo ? '#cbd5e1' : '#475569',
              border: '1px solid #334155',
              cursor: canRedo ? 'pointer' : 'not-allowed',
            }}
            title="Adelante en cambios / Rehacer (Ctrl+Y)"
          >
            <span className="hidden xl:inline text-[10px]">Adelante</span>
            <span>↪</span>
          </button>
        </div>

        {/* Indicador de Blast Radius activo */}
        {blastActive && (
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[10px] font-semibold"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="hidden sm:inline">Blast Radius activo</span>
            <button onClick={onClearBlast} className="ml-0.5 font-bold opacity-70 hover:opacity-100" title="Detener simulación">✕</button>
          </div>
        )}
      </div>

      {/* Status bar central */}
      <div
        className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-xl text-[11px]"
        style={{ background: '#0f172a', border: '1px solid #1e293b' }}
      >
        <div className="flex items-center gap-1.5">
          <span style={{ color: '#475569' }}>FinOps</span>
          <span className="font-black font-mono" style={{ color: '#34d399' }}>
            {formatUSD(total)}<span className="text-[9px] font-normal" style={{ color: '#475569' }}>/mo</span>
          </span>
        </div>
        <div className="w-px h-4" style={{ background: '#1e293b' }} />
        <div className="flex items-center gap-1.5">
          <span style={{ color: '#475569' }}>Score</span>
          <span className="font-black font-mono" style={{ color: scoreColor }}>
            {score}<span className="text-[9px] font-normal" style={{ color: '#475569' }}>/100</span>
          </span>
        </div>
        <div className="w-px h-4" style={{ background: '#1e293b' }} />
        <span
          className="font-bold px-2 py-0.5 rounded-full text-[10px]"
          style={{
            background: critical > 0 ? 'rgba(239,68,68,0.12)' : issueCount > 0 ? 'rgba(249,115,22,0.12)' : 'rgba(71,85,105,0.12)',
            color: issueColor,
            border: `1px solid ${issueColor}40`,
          }}
        >
          {issueCount === 0 ? '✓ Clean' : `${issueCount} Issue${issueCount !== 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2">
        {/* Plantillas de Arquitectura (Presets) */}
        <div className="relative" ref={presetsRef}>
          <button
            onClick={() => setShowPresets(!showPresets)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
            style={{
              background: '#1e293b',
              color: '#c084fc',
              border: '1px solid rgba(192,132,252,0.35)',
              boxShadow: '0 2px 6px rgba(192,132,252,0.1)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#c084fc'; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(192,132,252,0.35)'; }}
            title="Cargar arquitecturas empresariales de referencia"
          >
            <span>⚡</span>
            <span className="hidden sm:inline">Plantillas</span>
            <span className="text-[9px] opacity-70">▼</span>
          </button>

          {showPresets && (
            <div
              className="absolute right-0 sm:left-0 mt-2 w-72 rounded-2xl p-2 z-50 shadow-2xl space-y-1"
              style={{ background: '#0b1120', border: '1px solid #1e293b', backdropFilter: 'blur(16px)' }}
            >
              <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Arquitecturas de Referencia
              </div>
              {ARCHITECTURE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onLoadPreset?.(p);
                    setShowPresets(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl transition-colors hover:bg-slate-800/80 border border-transparent hover:border-slate-700/50 flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {p.provider === 'aws' ? <AwsLogo className="w-3.5 h-3.5 shrink-0" /> : p.provider === 'azure' ? <AzureLogo className="w-3.5 h-3.5 shrink-0" /> : <GcpLogo className="w-3.5 h-3.5 shrink-0" />}
                      <span className="text-[11px] font-bold text-slate-200 truncate">{p.name}</span>
                    </div>
                    <span
                      className="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0"
                      style={{ color: p.color, background: `${p.color}20` }}
                    >
                      {p.badge ?? p.provider}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                    {p.description}
                  </p>
                </button>
              ))}
              <div className="pt-1 border-t border-slate-800/80">
                <button
                  onClick={() => {
                    onClearCanvas?.();
                    setShowPresets(false);
                  }}
                  className="w-full text-center py-1 text-[10px] font-semibold text-slate-500 hover:text-red-400 transition-colors"
                >
                  ✕ Limpiar lienzo (lienzo vacío)
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Guardar */}
        <button
          onClick={onSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
          style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#f8fafc'; e.currentTarget.style.borderColor = '#475569'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#334155'; }}
          title="Guardar proyecto (Ctrl+S)"
        >
          💾 <span className="hidden sm:inline">Guardar</span>
        </button>

        {/* Reporte PDF (RF-11) */}
        <button
          onClick={onExportPDF}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all"
          style={{ background: '#1e293b', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.3)' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#bfdbfe'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; e.currentTarget.style.color = '#93c5fd'; }}
          title="Descargar reporte de auditoría y costos en PDF (RF-11)"
        >
          📄 <span className="hidden sm:inline">Reporte PDF</span>
        </button>

        {/* Export IaC */}
        <button
          onClick={handleExport}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all duration-200"
          style={{
            background: exported
              ? 'rgba(52,211,153,0.15)'
              : 'linear-gradient(135deg, #f59e0b, #f97316)',
            color: exported ? '#34d399' : '#0a0f1e',
            border: exported ? '1px solid rgba(52,211,153,0.4)' : 'none',
            boxShadow: exported ? 'none' : '0 3px 10px rgba(245,158,11,0.25)',
          }}
        >
          {exported ? '✓ OK' : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span className="hidden sm:inline">Export IaC</span>
            </>
          )}
        </button>

        {/* Separador */}
        <div className="w-px h-5 mx-1 hidden sm:block" style={{ background: '#1e293b' }} />

        {/* Ir al Dashboard & Cerrar sesión */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
            style={{ background: '#1e293b', border: '1px solid #334155' }}
            title="Ir a Dashboard de proyectos"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
            style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
            title={`Cerrar sesión (${user.name})`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden md:inline">Salir</span>
          </button>
        </div>
      </div>
    </header>
  );
}
