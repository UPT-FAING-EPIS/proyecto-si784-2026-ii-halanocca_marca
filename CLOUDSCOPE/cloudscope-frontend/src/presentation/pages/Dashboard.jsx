/**
 * Dashboard – Página de inicio con KPIs de todos los proyectos.
 * Muestra resumen de proyectos guardados, estadísticas y accesos rápidos.
 * RF-12: Panel resumen con indicadores clave de seguridad y costo.
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listProjects, deleteProject, exportProjectJSON, importProjectJSON, saveProject } from '../../infrastructure/api/projectStorage.js';
import { calculateCost, formatUSD } from '../../application/use-cases/calculateCost.js';
import { runAudit } from '../../application/use-cases/runAudit.js';

// ─── Tarjeta de KPI ────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color = '#f59e0b', icon }) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-2"
      style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
      <div className="flex items-center justify-between">
        <span className="text-sm" style={{ color: '#64748b' }}>{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <div className="text-3xl font-black font-mono" style={{ color }}>{value}</div>
      {sub && <div className="text-xs" style={{ color: '#475569' }}>{sub}</div>}
    </div>
  );
}

// ─── Tarjeta de proyecto ───────────────────────────────────────────────────────
function ProjectCard({ project, onOpen, onDelete, onExport }) {
  const cost = calculateCost(project.nodes ?? []);
  const audit = runAudit(project.nodes ?? [], project.edges ?? []);
  const scoreColor = audit.score >= 80 ? '#34d399' : audit.score >= 60 ? '#f59e0b' : '#ef4444';
  const updatedAt = new Date(project.updatedAt).toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="rounded-2xl overflow-hidden group transition-all duration-200 cursor-pointer"
      style={{ background: '#0f172a', border: '1px solid #1e293b' }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = '#334155'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1e293b'}
    >
      {/* Header del proyecto */}
      <div className="p-5 pb-3" onClick={() => onOpen(project)}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base truncate" style={{ color: '#f8fafc' }}>{project.name}</h3>
            {project.description && (
              <p className="text-xs truncate mt-0.5" style={{ color: '#475569' }}>{project.description}</p>
            )}
          </div>
          <span className="text-[10px] ml-2 px-2 py-0.5 rounded font-semibold shrink-0"
            style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
            AWS
          </span>
        </div>

        {/* Métricas inline */}
        <div className="flex items-center gap-4 mt-3">
          <div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: '#475569' }}>FinOps</div>
            <div className="text-sm font-mono font-bold" style={{ color: '#34d399' }}>{formatUSD(cost.total)}/mo</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: '#475569' }}>Score</div>
            <div className="text-sm font-mono font-bold" style={{ color: scoreColor }}>{audit.score}/100</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: '#475569' }}>Nodos</div>
            <div className="text-sm font-mono font-bold" style={{ color: '#94a3b8' }}>{project.nodes?.length ?? 0}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between"
        style={{ borderTop: '1px solid #1e293b', background: '#0b1120' }}>
        <span className="text-[10px]" style={{ color: '#334155' }}>
          {updatedAt}
        </span>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onExport(project); }}
            className="text-[10px] px-2 py-1 rounded transition-colors"
            style={{ color: '#64748b', background: '#1e293b' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#94a3b8'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
            title="Exportar JSON">
            ↓ JSON
          </button>
          {confirmDelete ? (
            <button onClick={(e) => { e.stopPropagation(); onDelete(project.id); setConfirmDelete(false); }}
              className="text-[10px] px-2 py-1 rounded font-bold"
              style={{ color: '#f87171', background: 'rgba(239,68,68,0.15)' }}>
              ¿Confirmar?
            </button>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); }}
              className="text-[10px] px-2 py-1 rounded transition-colors"
              style={{ color: '#64748b', background: '#1e293b' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
              title="Eliminar">
              🗑
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Modal de nuevo proyecto ──────────────────────────────────────────────────
function NewProjectModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-2xl p-6"
        style={{ background: '#0f172a', border: '1px solid #334155' }}>
        <h3 className="text-xl font-bold mb-6" style={{ color: '#f8fafc' }}>Nuevo Proyecto</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#64748b' }}>
              Nombre del proyecto *
            </label>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Mi Arquitectura AWS"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }}
              onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
              onBlur={(e) => e.target.style.borderColor = '#334155'}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#64748b' }}>
              Descripción (opcional)
            </label>
            <textarea value={desc} onChange={(e) => setDesc(e.target.value)}
              placeholder="Arquitectura de microservicios para producción..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
              style={{ background: '#1e293b', border: '1px solid #334155', color: '#f8fafc' }}
              onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
              onBlur={(e) => e.target.style.borderColor = '#334155'}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: '#1e293b', color: '#64748b', border: '1px solid #334155' }}>
            Cancelar
          </button>
          <button onClick={() => name.trim() && onCreate(name, desc)}
            disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: name.trim() ? 'linear-gradient(135deg, #f59e0b, #f97316)' : '#1e293b',
              color: name.trim() ? '#080d18' : '#334155',
            }}>
            Crear proyecto →
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard principal ───────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [search, setSearch] = useState('');

  // Datos del usuario (mock)
  const userRaw = localStorage.getItem('cs_user');
  const user = userRaw ? JSON.parse(userRaw) : { name: 'Usuario', email: '' };

  const loadProjects = () => setProjects(listProjects());

  useEffect(() => {
    loadProjects();
  }, []);

  // KPIs globales
  const allNodes = projects.flatMap(p => p.nodes ?? []);
  const allEdges = projects.flatMap(p => p.edges ?? []);
  const totalCost = projects.reduce((sum, p) => {
    const c = calculateCost(p.nodes ?? []);
    return sum + c.total;
  }, 0);
  const avgScore = projects.length > 0
    ? Math.round(projects.reduce((sum, p) => {
        const a = runAudit(p.nodes ?? [], p.edges ?? []);
        return sum + a.score;
      }, 0) / projects.length)
    : 100;
  const totalIssues = projects.reduce((sum, p) => {
    const a = runAudit(p.nodes ?? [], p.edges ?? []);
    return sum + a.total;
  }, 0);

  const handleOpenProject = (project) => {
    localStorage.setItem('cs_current_project', JSON.stringify(project));
    navigate('/editor');
  };

  const handleCreateProject = (name, desc) => {
    const saved = saveProject(null, name, desc, [], []);
    setShowNewModal(false);
    localStorage.setItem('cs_current_project', JSON.stringify(saved));
    navigate('/editor');
  };

  const handleDelete = (id) => {
    deleteProject(id);
    loadProjects();
  };

  const handleExport = (project) => exportProjectJSON(project);

  const handleImport = async () => {
    try {
      await importProjectJSON();
      loadProjects();
    } catch (err) {
      alert('Error al importar: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cs_token');
    localStorage.removeItem('cs_user');
    navigate('/login');
  };

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description ?? '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={{ background: '#080d18', fontFamily: "'Inter', sans-serif", color: '#f8fafc' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-4"
        style={{ background: 'rgba(8,13,24,0.9)', borderBottom: '1px solid #1e293b', backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', boxShadow: '0 0 12px rgba(245,158,11,0.3)' }}>
            <span style={{ color: '#080d18' }}>CS</span>
          </div>
          <span className="font-black text-lg">Cloud<span style={{ color: '#f59e0b' }}>Scope</span></span>
          <span className="text-xs px-1.5 py-0.5 rounded font-bold"
            style={{ background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
            Studio
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold" style={{ color: '#e2e8f0' }}>{user.name}</div>
            <div className="text-[10px]" style={{ color: '#475569' }}>{user.email}</div>
          </div>
          <button onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded-lg transition-colors"
            style={{ background: '#1e293b', color: '#64748b', border: '1px solid #334155' }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-10">

        {/* ── Bienvenida ─────────────────────────────────────────────────── */}
        <div className="mb-10">
          <h1 className="text-4xl font-black mb-2">
            Hola, <span style={{ color: '#f59e0b' }}>{user.name.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-sm" style={{ color: '#475569' }}>
            Aquí están tus proyectos de arquitectura cloud guardados en este dispositivo.
          </p>
        </div>

        {/* ── KPIs ──────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <KpiCard label="Proyectos" value={projects.length} icon="📁" sub="guardados localmente" />
          <KpiCard label="Costo Total" value={formatUSD(totalCost)} icon="💰" color="#34d399" sub="estimado /mes" />
          <KpiCard label="Audit Score" value={`${avgScore}/100`} icon="🛡️"
            color={avgScore >= 80 ? '#34d399' : avgScore >= 60 ? '#f59e0b' : '#ef4444'} sub="promedio" />
          <KpiCard label="Issues" value={totalIssues} icon="⚠" color={totalIssues > 0 ? '#f87171' : '#34d399'} sub="seguridad activos" />
        </div>

        {/* ── Acciones + búsqueda ───────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="relative">
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar proyectos..."
              className="pl-9 pr-4 py-2 rounded-xl text-sm outline-none w-64"
              style={{ background: '#0f172a', border: '1px solid #1e293b', color: '#f8fafc' }}
              onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
              onBlur={(e) => e.target.style.borderColor = '#1e293b'} />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: '#475569' }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </div>

          <div className="flex gap-2">
            <button onClick={handleImport}
              className="px-3 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
              ↑ Importar JSON
            </button>
            <button onClick={() => navigate('/editor')}
              className="px-3 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{ background: '#1e293b', color: '#94a3b8', border: '1px solid #334155' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
              + Nuevo (vacío)
            </button>
            <button onClick={() => setShowNewModal(true)}
              className="px-4 py-2 rounded-xl text-sm font-bold"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#080d18', boxShadow: '0 4px 14px rgba(245,158,11,0.25)' }}>
              + Nuevo Proyecto
            </button>
          </div>
        </div>

        {/* ── Grid de proyectos ─────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 rounded-2xl" style={{ border: '2px dashed #1e293b' }}>
            <div className="text-5xl mb-4">⬡</div>
            <h3 className="text-lg font-bold mb-2" style={{ color: '#334155' }}>
              {projects.length === 0 ? 'No tienes proyectos aún' : 'Sin resultados'}
            </h3>
            <p className="text-sm mb-6" style={{ color: '#1e293b' }}>
              {projects.length === 0
                ? 'Crea tu primer proyecto de arquitectura cloud'
                : 'Prueba con otro término de búsqueda'}
            </p>
            {projects.length === 0 && (
              <button onClick={() => setShowNewModal(true)}
                className="px-6 py-2.5 rounded-xl font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#080d18' }}>
                Crear primer proyecto
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered
              .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
              .map(p => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onOpen={handleOpenProject}
                  onDelete={handleDelete}
                  onExport={handleExport}
                />
              ))}
          </div>
        )}
      </main>

      {/* ── Modal nuevo proyecto ──────────────────────────────────────── */}
      {showNewModal && (
        <NewProjectModal onClose={() => setShowNewModal(false)} onCreate={handleCreateProject} />
      )}
    </div>
  );
}
