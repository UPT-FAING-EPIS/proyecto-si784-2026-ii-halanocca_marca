import React, { useState } from 'react';
import { getNodesByCategory } from '../../../domain/models/CloudNode.js';
import { getServiceIcon, AwsLogo, AzureLogo, GcpLogo } from '../icons/CloudIcons.jsx';

/** Icono de búsqueda */
function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  );
}

const PROVIDER_CONFIG = {
  all:   { label: 'Todos', color: '#94a3b8', bg: '#1e293b' },
  aws:   { label: 'AWS',   color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  azure: { label: 'Azure', color: '#38bdf8', bg: 'rgba(56,189,248,0.15)' },
  gcp:   { label: 'GCP',   color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
};

/** Ítem individual de la paleta */
function PaletteItem({ meta }) {
  const onDragStart = (event) => {
    event.dataTransfer.setData('application/cloudscope/nodetype', meta.type);
    event.dataTransfer.effectAllowed = 'move';
  };

  const pConfig = PROVIDER_CONFIG[meta.provider] ?? PROVIDER_CONFIG.all;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="group flex items-center gap-2.5 p-2 rounded-lg cursor-grab active:cursor-grabbing
                 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/50
                 hover:border-opacity-80 transition-all duration-150 select-none"
      style={{ '--hover-border': meta.borderColor }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = meta.borderColor}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = ''}
      title={`Arrastrar al lienzo: ${meta.description}`}
    >
      {/* Badge de icono oficial */}
      <div
        style={{
          backgroundColor: meta.bgColor,
          borderColor: meta.borderColor,
          color: meta.color,
        }}
        className="w-8 h-8 rounded-lg border flex items-center justify-center font-black text-[10px] shrink-0 shadow-sm"
      >
        {getServiceIcon(meta.type, "w-4 h-4", meta.color)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            style={{ color: '#e2e8f0' }}
            className="text-[11px] font-semibold truncate group-hover:text-white transition-colors"
          >
            {meta.label}
          </span>
          <span
            className="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 flex items-center gap-0.5"
            style={{ color: pConfig.color, background: pConfig.bg }}
          >
            {meta.provider === 'aws' && <AwsLogo className="w-2 h-2 shrink-0" />}
            {meta.provider === 'azure' && <AzureLogo className="w-2 h-2 shrink-0" />}
            {meta.provider === 'gcp' && <GcpLogo className="w-2 h-2 shrink-0" />}
            <span>{meta.provider}</span>
          </span>
        </div>
        <div className="text-[9px] text-slate-500 truncate">{meta.description}</div>
      </div>

      {/* Precio */}
      {meta.baseCostPerMonth > 0 ? (
        <span className="text-[9px] font-mono text-emerald-400 shrink-0 font-medium">
          ${meta.baseCostPerMonth}/mo
        </span>
      ) : (
        <span className="text-[9px] font-mono text-slate-600 shrink-0">Free</span>
      )}
    </div>
  );
}

export default function LeftSidebar() {
  const [provider, setProvider] = useState('all');
  const [search, setSearch] = useState('');

  const categoryGroups = getNodesByCategory(provider);

  // Filtrar por búsqueda
  const filtered = Object.entries(categoryGroups).reduce((acc, [cat, items]) => {
    const q = search.toLowerCase();
    const matching = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q)
    );
    if (matching.length > 0) acc[cat] = matching;
    return acc;
  }, {});

  return (
    <aside className="w-64 flex flex-col shrink-0 z-20 overflow-hidden"
      style={{ background: '#0f172a', borderRight: '1px solid #1e293b' }}>

      {/* Header */}
      <div className="px-3 pt-3 pb-2.5" style={{ borderBottom: '1px solid #1e293b' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Catálogo Cloud
          </span>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded font-bold"
            style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}
          >
            Multi-Cloud
          </span>
        </div>

        {/* Selector de Proveedor Cloud (RF-02) */}
        <div className="grid grid-cols-4 gap-1 p-0.5 rounded-lg mb-2.5"
          style={{ background: '#0b1120', border: '1px solid #1e293b' }}>
          {['all', 'aws', 'azure', 'gcp'].map((p) => {
            const active = provider === p;
            const cfg = PROVIDER_CONFIG[p];
            return (
              <button
                key={p}
                onClick={() => setProvider(p)}
                className="py-1 text-[10px] font-bold rounded transition-all capitalize flex items-center justify-center gap-1"
                style={{
                  background: active ? '#1e293b' : 'transparent',
                  color: active ? cfg.color : '#64748b',
                  boxShadow: active ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
                }}
              >
                {p === 'aws' && <AwsLogo className="w-2.5 h-2.5 shrink-0" />}
                {p === 'azure' && <AzureLogo className="w-2.5 h-2.5 shrink-0" />}
                {p === 'gcp' && <GcpLogo className="w-2.5 h-2.5 shrink-0" />}
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Buscar servicio (ej. ec2, sql)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-2 py-1.5 rounded-lg text-[11px] outline-none transition"
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#e2e8f0',
            }}
            onFocus={(e) => e.target.style.borderColor = '#f59e0b80'}
            onBlur={(e) => e.target.style.borderColor = '#334155'}
          />
        </div>
      </div>

      {/* Lista de servicios */}
      <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 scrollbar-thin">
        {Object.entries(filtered).length === 0 && (
          <div className="text-center text-slate-600 text-[11px] py-8">
            No se encontraron servicios
          </div>
        )}

        {Object.entries(filtered).map(([category, items]) => (
          <div key={category}>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1.5 px-1 flex items-center justify-between">
              <span>{category}</span>
              <span className="text-[9px] font-mono text-slate-600">{items.length}</span>
            </div>
            <div className="space-y-1.5">
              {items.map((meta) => (
                <PaletteItem key={meta.type} meta={meta} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer info */}
      <div className="px-3 py-2 text-[10px] text-slate-600 text-center"
        style={{ borderTop: '1px solid #1e293b', background: '#0b1120' }}>
        Arrastra un servicio al lienzo
      </div>
    </aside>
  );
}
