/**
 * LeftSidebar – Paleta de componentes AWS para CloudScope.
 * Muestra los 8 servicios MVP agrupados por categoría.
 * Los ítems son arrastrables al canvas con Drag & Drop.
 */

import React, { useState } from 'react';
import { getNodesByCategory } from '../../../domain/models/CloudNode.js';

/** Icono de búsqueda simple */
function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
    </svg>
  );
}

/** Ítem individual de la paleta */
function PaletteItem({ meta }) {
  const onDragStart = (event) => {
    event.dataTransfer.setData('application/cloudscope/nodetype', meta.type);
    event.dataTransfer.effectAllowed = 'move';
  };

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
      title={`Drag to canvas: ${meta.description}`}
    >
      {/* Badge de icono */}
      <div
        style={{
          backgroundColor: meta.bgColor,
          borderColor: meta.borderColor,
          color: meta.color,
        }}
        className="w-8 h-8 rounded-lg border flex items-center justify-center font-bold text-[10px] shrink-0"
      >
        {meta.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div
          style={{ color: '#e2e8f0' }}
          className="text-[11px] font-semibold truncate group-hover:text-white transition-colors"
        >
          {meta.label}
        </div>
        <div className="text-[9px] text-slate-500 truncate">{meta.description}</div>
      </div>

      {/* Precio */}
      {meta.baseCostPerMonth > 0 && (
        <span className="text-[9px] font-mono text-emerald-400 shrink-0">
          ${meta.baseCostPerMonth}/mo
        </span>
      )}
      {meta.baseCostPerMonth === 0 && (
        <span className="text-[9px] font-mono text-slate-600 shrink-0">Free</span>
      )}
    </div>
  );
}

export default function LeftSidebar() {
  const [search, setSearch] = useState('');
  const categoryGroups = getNodesByCategory();

  // Filtrar por búsqueda
  const filtered = Object.entries(categoryGroups).reduce((acc, [cat, items]) => {
    const q = search.toLowerCase();
    const matching = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q)
    );
    if (matching.length > 0) acc[cat] = matching;
    return acc;
  }, {});

  return (
    <aside className="w-60 flex flex-col shrink-0 z-20 overflow-hidden"
      style={{ background: '#0f172a', borderRight: '1px solid #1e293b' }}>

      {/* Header */}
      <div className="px-3 pt-3 pb-2" style={{ borderBottom: '1px solid #1e293b' }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            AWS Palette
          </span>
          <span
            className="text-[9px] px-1.5 py-0.5 rounded font-semibold"
            style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.25)' }}
          >
            MVP
          </span>
        </div>

        {/* Búsqueda */}
        <div className="relative">
          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            <SearchIcon />
          </div>
          <input
            type="text"
            placeholder="Search services..."
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
            No services found
          </div>
        )}

        {Object.entries(filtered).map(([category, items]) => (
          <div key={category}>
            <h4 className="text-[9px] font-bold uppercase tracking-widest mb-2 px-0.5"
              style={{ color: '#64748b' }}>
              {category}
            </h4>
            <div className="space-y-1">
              {items.map((meta) => (
                <PaletteItem key={meta.type} meta={meta} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-3 py-2 text-[9px] text-slate-600 text-center"
        style={{ borderTop: '1px solid #1e293b' }}>
        Drag items to the canvas ↗
      </div>
    </aside>
  );
}
