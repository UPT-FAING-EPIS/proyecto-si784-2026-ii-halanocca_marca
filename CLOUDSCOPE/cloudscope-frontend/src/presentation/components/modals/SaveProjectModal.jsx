/**
 * SaveProjectModal – Modal de guardado de proyectos en CloudScope.
 * Permite guardar con nombre y descripción, o actualizar el proyecto activo.
 */

import React, { useState, useEffect } from 'react';
import { saveProject, getCurrentProjectId, listProjects } from '../../../infrastructure/api/projectStorage.js';

export default function SaveProjectModal({ nodes, edges, onClose, onSaved }) {
  const currentId = getCurrentProjectId();
  const existing = currentId ? listProjects().find(p => p.id === currentId) : null;

  const [name, setName] = useState(existing?.name ?? '');
  const [desc, setDesc] = useState(existing?.description ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await new Promise(r => setTimeout(r, 300)); // micro-delay UX
    const project = saveProject(existing?.id ?? null, name, desc, nodes, edges);
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      onSaved?.(project);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md rounded-2xl overflow-hidden"
        style={{ background: '#0f172a', border: '1px solid #334155', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: '1px solid #1e293b' }}>
          <div>
            <h3 className="font-bold text-base" style={{ color: '#f8fafc' }}>
              {existing ? 'Guardar cambios' : 'Guardar proyecto'}
            </h3>
            <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
              {nodes.length} nodo{nodes.length !== 1 ? 's' : ''} · {edges.length} conexión{edges.length !== 1 ? 'es' : ''}
            </p>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg"
            style={{ color: '#475569', background: '#1e293b' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#f8fafc'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#475569'}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#64748b' }}>
              Nombre *
            </label>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              placeholder="Mi arquitectura AWS"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }}
              onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
              onBlur={(e) => e.target.style.borderColor = '#334155'} />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#64748b' }}>
              Descripción (opcional)
            </label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)}
              placeholder="Arquitectura de producción para..."
              rows={2}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }}
              onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
              onBlur={(e) => e.target.style.borderColor = '#334155'} />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 flex gap-3" style={{ borderTop: '1px solid #1e293b' }}>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: '#1e293b', color: '#64748b' }}>
            Cancelar
          </button>
          <button onClick={handleSave} disabled={!name.trim() || saving || saved}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
            style={{
              background: saved
                ? 'rgba(52,211,153,0.15)'
                : !name.trim()
                  ? '#1e293b'
                  : 'linear-gradient(135deg, #f59e0b, #f97316)',
              color: saved ? '#34d399' : !name.trim() ? '#334155' : '#080d18',
              border: saved ? '1px solid rgba(52,211,153,0.3)' : 'none',
            }}>
            {saved ? '✓ Guardado!' : saving ? (
              <><span className="w-4 h-4 border-2 border-amber-700 border-t-amber-300 rounded-full animate-spin" /> Guardando...</>
            ) : '💾 Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
