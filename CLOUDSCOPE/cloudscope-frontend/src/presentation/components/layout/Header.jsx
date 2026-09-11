/**
 * Header – Sprint 2: Agrega botones de Save, Dashboard y blast radius status.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatUSD } from '../../../application/use-cases/calculateCost.js';

export default function Header({
  costBreakdown,
  auditResult,
  onExportIaC,
  onExportPDF,
  onSave,
  blastActive,
  onClearBlast,
}) {
  const navigate = useNavigate();
  const [exported, setExported] = useState(false);

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
      className="flex items-center justify-between px-4 z-40 shrink-0 gap-3"
      style={{
        height: '52px',
        background: '#0a0f1e',
        borderBottom: '1px solid #1e293b',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* Logo + nav */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          title="Ir al Dashboard"
        >
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shadow-lg shrink-0"
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #f97316)',
              boxShadow: '0 0 10px rgba(245,158,11,0.3)',
            }}
          >
            <span style={{ color: '#0a0f1e' }}>CS</span>
          </div>
          <span className="font-black text-base tracking-tight hidden sm:block" style={{ color: '#f8fafc' }}>
            Cloud<span style={{ color: '#f59e0b' }}>Scope</span>
          </span>
        </button>

        <span className="text-slate-700">›</span>
        <span className="text-xs font-semibold" style={{ color: '#475569' }}>Editor</span>

        {/* Indicador de Blast Radius activo */}
        {blastActive && (
          <div className="flex items-center gap-2 ml-2 px-2.5 py-1 rounded-lg text-[11px] font-semibold"
            style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            Blast Radius activo
            <button onClick={onClearBlast} className="ml-1 font-bold opacity-60 hover:opacity-100">✕</button>
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
