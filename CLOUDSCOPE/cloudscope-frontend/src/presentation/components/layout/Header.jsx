/**
 * Header – Barra superior de CloudScope.
 * Muestra el logo, indicadores en tiempo real de FinOps y Audit Score,
 * y el botón de exportación a Terraform.
 */

import React, { useState } from 'react';
import { formatUSD } from '../../../application/use-cases/calculateCost.js';

export default function Header({ costBreakdown, auditResult, onExportIaC }) {
  const [exported, setExported] = useState(false);

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
      className="h-13 flex items-center justify-between px-4 z-40 shrink-0"
      style={{
        height: '52px',
        background: '#0a0f1e',
        borderBottom: '1px solid #1e293b',
        boxShadow: '0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #f59e0b, #f97316)',
            boxShadow: '0 0 12px rgba(245,158,11,0.3)',
          }}
        >
          <span style={{ color: '#0a0f1e' }}>CS</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-black text-base tracking-tight" style={{ color: '#f8fafc' }}>
              Cloud<span style={{ color: '#f59e0b' }}>Scope</span>
            </span>
            <span
              className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
              style={{
                background: 'rgba(245,158,11,0.12)',
                color: '#f59e0b',
                border: '1px solid rgba(245,158,11,0.25)',
              }}
            >
              Studio MVP
            </span>
          </div>
        </div>
      </div>

      {/* Status bar en tiempo real */}
      <div
        className="hidden md:flex items-center gap-4 px-4 py-2 rounded-xl text-[11px]"
        style={{ background: '#0f172a', border: '1px solid #1e293b' }}
      >
        {/* FinOps */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">FinOps</span>
          <span className="font-black font-mono" style={{ color: '#34d399' }}>
            {formatUSD(total)}<span className="text-[9px] text-slate-500 font-normal">/mo</span>
          </span>
        </div>

        <div className="w-px h-4 bg-slate-800" />

        {/* Audit Score */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500">Score</span>
          <span className="font-black font-mono" style={{ color: scoreColor }}>
            {score}
            <span className="text-[9px] text-slate-500 font-normal">/100</span>
          </span>
        </div>

        <div className="w-px h-4 bg-slate-800" />

        {/* Issues */}
        <div className="flex items-center gap-1.5">
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
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2">
        {/* Botón Export IaC */}
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all duration-200"
          style={{
            background: exported
              ? 'rgba(52,211,153,0.15)'
              : 'linear-gradient(135deg, #f59e0b, #f97316)',
            color: exported ? '#34d399' : '#0a0f1e',
            border: exported ? '1px solid rgba(52,211,153,0.4)' : 'none',
            boxShadow: exported ? 'none' : '0 4px 14px rgba(245,158,11,0.3)',
            transform: exported ? 'scale(0.97)' : 'scale(1)',
          }}
        >
          {exported ? (
            <>✓ Downloaded!</>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export IaC
            </>
          )}
        </button>
      </div>
    </header>
  );
}
