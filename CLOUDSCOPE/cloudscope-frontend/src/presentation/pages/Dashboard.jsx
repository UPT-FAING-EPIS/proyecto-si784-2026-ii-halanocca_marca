import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { listProjects, deleteProject, exportProjectJSON, importProjectJSON, saveProject, loadProject } from '../../infrastructure/api/projectStorage.js';
import { calculateCost, formatUSD } from '../../application/use-cases/calculateCost.js';
import { runAudit } from '../../application/use-cases/runAudit.js';
import { ARCHITECTURE_PRESETS } from '../../domain/models/ArchitecturePresets.js';
import {
  CloudScopeLogo, AwsLogo, AzureLogo, OracleLogo, GcpLogo,
  TerraformLogo, DockerLogo, KubernetesLogo, FolderIcon, DollarIcon,
  ShieldIcon, WarningIcon, TrashIcon, HexagonIcon, BlastIcon,
  ArrowRightIcon, LockIcon, UserIcon, CreditCardIcon, UsersIcon,
  KeyIcon, SparkleIcon, PlayCircleIcon, HelpCircleIcon, PowerIcon,
  ChevronDownIcon, BlockIcon
} from '../components/icons/CloudIcons.jsx';

// ─── Clasificador de Categoría de Proyecto (Multi-Cloud vs Mono-Nube) ─────────
export function getProjectCategory(project) {
  const nodes = project.nodes ?? [];
  if (nodes.length === 0) {
    return {
      type: 'empty',
      label: 'Sin Nodos',
      isMulti: false,
      providers: [],
    };
  }

  const cloudSet = new Set();
  for (const n of nodes) {
    const t = n.data?.cloudType ?? '';
    if (t.startsWith('azure_')) cloudSet.add('azure');
    else if (t.startsWith('oci_')) cloudSet.add('oracle');
    else if (t.startsWith('gcp_')) cloudSet.add('gcp');
    else if (t.startsWith('block') || t.startsWith('text_') || t.startsWith('icon') || t.startsWith('image') || t.startsWith('area')) {
      // formas comunes, no se computan como proveedor exclusivo
    } else {
      cloudSet.add('aws');
    }
  }

  const providers = Array.from(cloudSet);
  if (providers.length > 1) {
    return {
      type: 'multi',
      label: 'Multi-Cloud',
      isMulti: true,
      providers,
    };
  } else if (providers.length === 1) {
    const p = providers[0];
    const labels = {
      aws: 'Solo AWS',
      azure: 'Solo Azure',
      oracle: 'Solo Oracle',
      gcp: 'Solo Google Cloud',
    };
    return {
      type: p,
      label: labels[p] || 'Solo ' + p.toUpperCase(),
      isMulti: false,
      providers: [p],
    };
  }

  return {
    type: 'aws',
    label: 'Solo AWS',
    isMulti: false,
    providers: ['aws'],
  };
}

// ─── Tarjeta de KPI ────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color = '#f59e0b', icon }) {
  return (
    <div
      className="rounded-2xl p-4 md:p-5 flex flex-col gap-1.5 transition-all shadow-sm bg-white border border-slate-200 hover:shadow-md hover:border-slate-300"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500">{label}</span>
        <span className="opacity-90" style={{ color }}>{icon}</span>
      </div>
      <div className="text-2xl md:text-3xl font-black font-mono tracking-tight" style={{ color }}>
        {value}
      </div>
      {sub && <div className="text-[11px] text-slate-400 font-medium">{sub}</div>}
    </div>
  );
}

// ─── Tarjeta de Proyecto ───────────────────────────────────────────────────────
function ProjectCard({ project, onOpen, onDelete, onExport }) {
  const cost = calculateCost(project.nodes ?? []);
  const audit = runAudit(project.nodes ?? [], project.edges ?? []);
  const scoreColor = audit.score >= 80 ? '#10b981' : audit.score >= 60 ? '#f59e0b' : '#ef4444';
  const updatedAt = new Date(project.updatedAt).toLocaleDateString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  const [confirmDelete, setConfirmDelete] = useState(false);
  const cat = getProjectCategory(project);

  return (
    <div
      className="rounded-2xl overflow-hidden group transition-all duration-200 cursor-pointer flex flex-col justify-between border border-slate-200 bg-white hover:shadow-md shadow-sm"
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = cat.isMulti ? '#a855f7' : '#94a3b8';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Header del proyecto */}
      <div className="p-5 pb-3 flex-1" onClick={() => onOpen(project)}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-slate-800 group-hover:text-blue-600 truncate" title={project.name}>
              {project.name}
            </h3>
            {project.description ? (
              <p className="text-xs text-slate-500 truncate mt-0.5" title={project.description}>
                {project.description}
              </p>
            ) : (
              <p className="text-xs text-slate-400 italic mt-0.5">Sin descripción</p>
            )}
          </div>

          {/* Badge de Categoría (Multi-Cloud vs Mono-Nube) */}
          {cat.isMulti ? (
            <span
              className="text-[10px] ml-2 px-2.5 py-0.5 rounded-full font-black shrink-0 flex items-center gap-1.5 uppercase tracking-wider"
              style={{
                background: 'linear-gradient(135deg, rgba(0,132,255,0.1), rgba(168,85,247,0.15))',
                color: '#7c3aed',
                border: '1px solid rgba(168,85,247,0.3)',
                boxShadow: '0 0 12px rgba(168,85,247,0.1)',
              }}
            >
              <div className="flex items-center -space-x-1">
                {cat.providers.includes('aws') && <AwsLogo className="w-3 h-3" />}
                {cat.providers.includes('azure') && <AzureLogo className="w-3 h-3" />}
                {cat.providers.includes('oracle') && <OracleLogo className="w-3 h-3" />}
                {cat.providers.includes('gcp') && <GcpLogo className="w-3 h-3" />}
              </div>
              <span>Multi-Cloud</span>
            </span>
          ) : (
            <span
              className="text-[10px] ml-2 px-2 py-0.5 rounded font-bold shrink-0 flex items-center gap-1 uppercase tracking-wider"
              style={{
                background:
                  cat.type === 'azure' ? 'rgba(56,189,248,0.1)' :
                  cat.type === 'oracle' ? 'rgba(248,0,0,0.08)' :
                  cat.type === 'gcp' ? 'rgba(59,130,246,0.08)' : 'rgba(245,158,11,0.1)',
                color:
                  cat.type === 'azure' ? '#0284c7' :
                  cat.type === 'oracle' ? '#dc2626' :
                  cat.type === 'gcp' ? '#2563eb' : '#d97706',
                border: `1px solid ${
                  cat.type === 'azure' ? 'rgba(56,189,248,0.3)' :
                  cat.type === 'oracle' ? 'rgba(248,0,0,0.2)' :
                  cat.type === 'gcp' ? 'rgba(59,130,246,0.2)' : 'rgba(245,158,11,0.3)'
                }`,
              }}
            >
              {cat.type === 'azure' && <AzureLogo className="w-2.5 h-2.5 shrink-0" />}
              {cat.type === 'oracle' && <OracleLogo className="w-2.5 h-2.5 shrink-0" />}
              {cat.type === 'gcp' && <GcpLogo className="w-2.5 h-2.5 shrink-0" />}
              {cat.type === 'aws' && <AwsLogo className="w-2.5 h-2.5 shrink-0" />}
              <span>{cat.label}</span>
            </span>
          )}
        </div>

        {/* Métricas inline */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100">
          <div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">FinOps</div>
            <div className="text-sm font-mono font-bold text-emerald-600">{formatUSD(cost.total)}/mo</div>
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Score</div>
            <div className="text-sm font-mono font-bold" style={{ color: scoreColor }}>{audit.score}/100</div>
          </div>
          <div>
            <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Nodos</div>
            <div className="text-sm font-mono font-bold text-slate-700">{project.nodes?.length ?? 0}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div
        className="px-5 py-3 flex items-center justify-between border-t border-slate-100 bg-slate-50/80"
      >
        <span className="text-[10px] text-slate-400 font-medium">
          {updatedAt}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onExport(project); }}
            className="text-[11px] px-2.5 py-1 rounded font-medium transition-colors text-slate-600 hover:text-slate-900 bg-slate-200/70 hover:bg-slate-300"
            title="Exportar archivo JSON"
          >
            JSON
          </button>
          {confirmDelete ? (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(project.id); setConfirmDelete(false); }}
              className="text-[11px] px-2.5 py-1 rounded font-bold text-red-700 bg-red-100 border border-red-300"
            >
              ¿Confirmar?
            </button>
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); }}
              className="p-1.5 rounded transition-colors text-slate-400 hover:text-red-600 hover:bg-red-50"
              title="Eliminar proyecto"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Tarjeta de Plantilla (Preset) ─────────────────────────────────────────────
function TemplateCard({ preset, onSelect }) {
  const cost = calculateCost(preset.nodes ?? []);

  return (
    <div
      className="rounded-2xl p-4 flex flex-col justify-between transition-all group border border-slate-200 bg-white hover:shadow-md cursor-pointer shadow-sm"
      onClick={() => onSelect(preset)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = preset.color;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e2e8f0';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1"
            style={{ color: preset.color, background: `${preset.color}15`, border: `1px solid ${preset.color}40` }}
          >
            {preset.provider === 'aws' && <AwsLogo className="w-2.5 h-2.5 shrink-0" />}
            {preset.provider === 'azure' && <AzureLogo className="w-2.5 h-2.5 shrink-0" />}
            {preset.provider === 'oracle' && <OracleLogo className="w-2.5 h-2.5 shrink-0" />}
            {preset.provider === 'gcp' && <GcpLogo className="w-2.5 h-2.5 shrink-0" />}
            <span>{preset.badge ?? preset.provider}</span>
          </span>
          <span className="text-xs text-slate-400 font-mono font-medium">{preset.nodes.length} nodos</span>
        </div>

        <h3 className="text-sm font-bold text-slate-800 group-hover:text-blue-600 mb-1.5 transition-colors line-clamp-1">
          {preset.name}
        </h3>
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
          {preset.description}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-[11px]">
        <div>
          <span className="text-[10px] text-slate-400">FinOps: </span>
          <span className="font-bold font-mono text-emerald-600">{formatUSD(cost.total)}</span>
        </div>
        <span className="font-bold flex items-center gap-1 transition-transform group-hover:translate-x-0.5" style={{ color: preset.color }}>
          <span>Crear y editar</span>
          <ArrowRightIcon className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
}

// ─── Modal de Nuevo Proyecto ──────────────────────────────────────────────────
function NewProjectModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in"
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-2xl space-y-4 bg-white border border-slate-200"
      >
        <h3 className="text-xl font-black text-slate-900">Nuevo Proyecto</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-600">
              Nombre del proyecto *
            </label>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Mi Arquitectura Multi-Cloud"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-600">
              Descripción (opcional)
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Topología empresarial de alta disponibilidad, FinOps y CIS benchmarks..."
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm outline-none resize-none text-slate-900 placeholder:text-slate-400 bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
          >
            Cancelar
          </button>
          <button
            onClick={() => name.trim() && onCreate(name, desc)}
            disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all shadow-md"
            style={{
              background: name.trim() ? '#0084ff' : '#e2e8f0',
              color: name.trim() ? '#ffffff' : '#94a3b8',
            }}
          >
            <span className="flex items-center justify-center gap-1.5">
              <span>Crear proyecto</span>
              <ArrowRightIcon className="w-4 h-4" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Principal ───────────────────────────────────────────────────────
export default function Dashboard() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [showNewModal, setShowNewModal] = useState(false);

  // Estados de navegación y filtros
  const [activeNavTab, setActiveNavTab] = useState('overview'); // 'overview' | 'projects' | 'templates'
  const [projectSearch, setProjectSearch] = useState('');
  const [templateSearch, setTemplateSearch] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('all'); // 'all' | 'aws' | 'azure' | 'oracle' | 'gcp'
  const [projectCategoryFilter, setProjectCategoryFilter] = useState('all'); // 'all' | 'multi' | 'azure' | 'aws' | 'oracle' | 'gcp'
  const [sortBy, setSortBy] = useState('recent'); // 'recent' | 'cost-desc' | 'cost-asc' | 'score-desc' | 'name-asc'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [templateCategory, setTemplateCategory] = useState('all');

  // Sesión de usuario
  const userRaw = localStorage.getItem('cs_user');
  const user = userRaw ? JSON.parse(userRaw) : { name: 'Stevie Marca', email: 'raziel@gmail.com' };
  const displayName = (user?.name || user?.username || 'STEVIE MARCA').toUpperCase();
  const userInitials = displayName.split(' ').map(n => n[0]).filter(Boolean).join('').slice(0, 2) || 'SM';

  const loadProjects = () => setProjects(listProjects());

  useEffect(() => {
    loadProjects();
  }, []);

  // KPIs globales
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

  // Conteo de proyectos por categoría
  const categoryCounts = useMemo(() => {
    const counts = { all: projects.length, multi: 0, azure: 0, aws: 0, oracle: 0, gcp: 0 };
    for (const p of projects) {
      const cat = getProjectCategory(p);
      if (cat.isMulti) {
        counts.multi++;
      } else if (counts[cat.type] !== undefined) {
        counts[cat.type]++;
      }
    }
    return counts;
  }, [projects]);

  // Filtrado y Ordenamiento dinámico de Proyectos
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      // Búsqueda por texto (nombre, descripción, o nombres de nodos)
      const q = projectSearch.toLowerCase().trim();
      if (q) {
        const nameMatches = p.name.toLowerCase().includes(q);
        const descMatches = (p.description ?? '').toLowerCase().includes(q);
        const nodeMatches = (p.nodes ?? []).some(n =>
          (n.data?.label ?? '').toLowerCase().includes(q) ||
          (n.data?.cloudType ?? '').toLowerCase().includes(q)
        );
        if (!nameMatches && !descMatches && !nodeMatches) return false;
      }

      // Filtro por Proveedor en la barra lateral (aplica si no hay filtro de categoría específico que lo sobreescriba)
      if (selectedProvider !== 'all' && projectCategoryFilter === 'all') {
        const cat = getProjectCategory(p);
        if (!cat.providers.includes(selectedProvider)) return false;
      }

      // Filtro por Categoría de Arquitectura (Solo Azure vs Multi-Cloud vs Solo AWS...)
      if (projectCategoryFilter !== 'all') {
        const cat = getProjectCategory(p);
        if (projectCategoryFilter === 'multi' && !cat.isMulti) return false;
        if (projectCategoryFilter !== 'multi' && (cat.isMulti || cat.type !== projectCategoryFilter)) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.updatedAt) - new Date(a.updatedAt);
      if (sortBy === 'cost-desc') return calculateCost(b.nodes ?? []).total - calculateCost(a.nodes ?? []).total;
      if (sortBy === 'cost-asc') return calculateCost(a.nodes ?? []).total - calculateCost(b.nodes ?? []).total;
      if (sortBy === 'score-desc') return runAudit(b.nodes ?? [], b.edges ?? []).score - runAudit(a.nodes ?? [], a.edges ?? []).score;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [projects, projectSearch, selectedProvider, projectCategoryFilter, sortBy]);

  // Filtrado dinámico de Plantillas (Buscar plantillas)
  const filteredTemplates = useMemo(() => {
    return ARCHITECTURE_PRESETS.filter(preset => {
      const q = templateSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        preset.name.toLowerCase().includes(q) ||
        preset.description.toLowerCase().includes(q) ||
        preset.provider.toLowerCase().includes(q) ||
        (preset.badge ?? '').toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (selectedProvider !== 'all' && preset.provider !== selectedProvider) {
        return false;
      }

      if (templateCategory !== 'all') {
        if (templateCategory === 'web' && !preset.name.toLowerCase().includes('web') && !preset.name.toLowerCase().includes('tier')) return false;
        if (templateCategory === 'serverless' && !preset.name.toLowerCase().includes('serverless')) return false;
        if (templateCategory === 'database' && !preset.name.toLowerCase().includes('sql') && !preset.name.toLowerCase().includes('database') && !preset.name.toLowerCase().includes('stack')) return false;
      }

      return true;
    });
  }, [templateSearch, selectedProvider, templateCategory]);

  const handleOpenProject = (project) => {
    loadProject(project.id);
    navigate('/editor');
  };

  const handleCreateProject = (name, desc) => {
    const saved = saveProject(null, name, desc, [], []);
    setShowNewModal(false);
    loadProject(saved.id);
    navigate('/editor');
  };

  const handleDelete = (id) => {
    deleteProject(id);
    loadProjects();
  };

  const handleCreateFromPreset = (preset) => {
    const saved = saveProject(
      null,
      preset.name,
      preset.description,
      preset.nodes,
      preset.edges
    );
    loadProjects();
    loadProject(saved.id);
    navigate('/editor');
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
    sessionStorage.setItem('cs_logout', '1');
    localStorage.removeItem('cs_token');
    localStorage.removeItem('cs_user');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800 font-sans">

      {/* ══════════════════════════════════════════════════════════════════════
          1. BARRA LATERAL IZQUIERDA (PANEL BLANCO - ESTILO BRAINBOARD)
         ══════════════════════════════════════════════════════════════════════ */}
      <aside
        className="w-64 lg:w-72 shrink-0 bg-white text-slate-800 border-r border-slate-200 flex flex-col justify-between shadow-xl z-20 sticky top-0 h-screen"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        {/* Cabecera superior del Sidebar */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => setActiveNavTab('overview')}
              className="flex items-center gap-2 hover:opacity-90 transition-opacity text-left"
            >
              <CloudScopeLogo className="w-6 h-6 shrink-0" />
              <div className="flex flex-col">
                <span className="font-black text-sm tracking-tight text-slate-900 leading-none">
                  Cloud<span style={{ color: '#0084ff' }}>Scope</span>
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
                  Dashboard Studio
                </span>
              </div>
            </button>
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded text-white shadow-sm"
              style={{ background: '#0084ff' }}
            >
              PRO
            </span>
          </div>

          {/* Selector rápido de Nubes Multi-Cloud */}
          <div className="pt-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Filtrar por Nube</span>
              {selectedProvider !== 'all' && (
                <button
                  onClick={() => setSelectedProvider('all')}
                  className="text-[9px] text-blue-600 hover:underline capitalize font-bold"
                >
                  Limpiar
                </button>
              )}
            </div>
            <div className="grid grid-cols-5 gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setSelectedProvider('all')}
                className={`py-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center ${
                  selectedProvider === 'all'
                    ? 'bg-white text-slate-900 shadow-sm font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Todas las nubes"
              >
                All
              </button>
              <button
                onClick={() => setSelectedProvider('aws')}
                className={`py-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center ${
                  selectedProvider === 'aws'
                    ? 'bg-white text-amber-600 shadow-sm font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Amazon Web Services"
              >
                <AwsLogo className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSelectedProvider('azure')}
                className={`py-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center ${
                  selectedProvider === 'azure'
                    ? 'bg-white text-blue-600 shadow-sm font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Microsoft Azure"
              >
                <AzureLogo className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSelectedProvider('oracle')}
                className={`py-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center ${
                  selectedProvider === 'oracle'
                    ? 'bg-white text-red-600 shadow-sm font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Oracle Cloud Infrastructure"
              >
                <OracleLogo className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSelectedProvider('gcp')}
                className={`py-1 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center ${
                  selectedProvider === 'gcp'
                    ? 'bg-white text-blue-500 shadow-sm font-black'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Google Cloud Platform"
              >
                <GcpLogo className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Navegación y Menú Central */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Bloque: Vistas Principales */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 mb-1.5">
              Vistas del Workspace
            </div>

            {/* Vista General */}
            <button
              onClick={() => setActiveNavTab('overview')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeNavTab === 'overview'
                  ? 'bg-[#0084ff] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <SparkleIcon className="w-4 h-4" />
                <span>Vista General</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${activeNavTab === 'overview' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                Inicio
              </span>
            </button>

            {/* Mis Proyectos (Lugar dedicado para ver todos los proyectos) */}
            <button
              onClick={() => setActiveNavTab('projects')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeNavTab === 'projects'
                  ? 'bg-[#0084ff] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FolderIcon className="w-4 h-4" />
                <span>Mis Proyectos</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${activeNavTab === 'projects' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {projects.length}
              </span>
            </button>

            {/* Buscar Plantillas (Galería dedicada) */}
            <button
              onClick={() => setActiveNavTab('templates')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                activeNavTab === 'templates'
                  ? 'bg-[#0084ff] text-white shadow-sm'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BlastIcon className="w-4 h-4" />
                <span>Buscar Plantillas</span>
              </div>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${activeNavTab === 'templates' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {ARCHITECTURE_PRESETS.length}
              </span>
            </button>
          </div>

          {/* Bloque: Categoría de Proyectos (Multi-Cloud vs Solo Azure / AWS / OCI) */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 mb-1.5 flex items-center justify-between">
              <span>Categoría Cloud</span>
              {projectCategoryFilter !== 'all' && (
                <button
                  onClick={() => setProjectCategoryFilter('all')}
                  className="text-[9px] text-blue-600 hover:underline font-bold"
                >
                  Todas
                </button>
              )}
            </div>

            <button
              onClick={() => {
                setActiveNavTab('projects');
                setProjectCategoryFilter('all');
                setSelectedProvider('all');
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeNavTab === 'projects' && projectCategoryFilter === 'all'
                  ? 'text-blue-600 font-bold bg-blue-50'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>• Todos los proyectos</span>
              <span className="text-[10px] text-slate-400 font-mono">{categoryCounts.all}</span>
            </button>

            <button
              onClick={() => {
                setActiveNavTab('projects');
                setProjectCategoryFilter('multi');
                setSelectedProvider('all');
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeNavTab === 'projects' && projectCategoryFilter === 'multi'
                  ? 'text-purple-600 font-bold bg-purple-50'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1">
                <span>🌐</span>
                <span className="font-bold">Multi-Cloud</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-100 text-purple-700 font-mono font-bold">
                {categoryCounts.multi}
              </span>
            </button>

            <button
              onClick={() => {
                setActiveNavTab('projects');
                setProjectCategoryFilter('azure');
                setSelectedProvider('all');
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeNavTab === 'projects' && projectCategoryFilter === 'azure'
                  ? 'text-blue-600 font-bold bg-blue-50'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <AzureLogo className="w-3 h-3" />
                <span>Solo Azure</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{categoryCounts.azure}</span>
            </button>

            <button
              onClick={() => {
                setActiveNavTab('projects');
                setProjectCategoryFilter('aws');
                setSelectedProvider('all');
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeNavTab === 'projects' && projectCategoryFilter === 'aws'
                  ? 'text-amber-600 font-bold bg-amber-50'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <AwsLogo className="w-3 h-3" />
                <span>Solo AWS</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{categoryCounts.aws}</span>
            </button>

            <button
              onClick={() => {
                setActiveNavTab('projects');
                setProjectCategoryFilter('oracle');
                setSelectedProvider('all');
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeNavTab === 'projects' && projectCategoryFilter === 'oracle'
                  ? 'text-red-600 font-bold bg-red-50'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <OracleLogo className="w-3 h-3" />
                <span>Solo Oracle</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{categoryCounts.oracle}</span>
            </button>

            <button
              onClick={() => {
                setActiveNavTab('projects');
                setProjectCategoryFilter('gcp');
                setSelectedProvider('all');
              }}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeNavTab === 'projects' && projectCategoryFilter === 'gcp'
                  ? 'text-blue-500 font-bold bg-blue-50'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-1.5">
                <GcpLogo className="w-3 h-3" />
                <span>Solo Google Cloud</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">{categoryCounts.gcp}</span>
            </button>
          </div>

          {/* Bloque: Acciones de Creación */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2.5 mb-1">
              Acciones Rápidas
            </div>
            <button
              onClick={() => setShowNewModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-white shadow-md transition-all"
              style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
            >
              <span>+ Nuevo Proyecto</span>
            </button>

            <button
              onClick={() => navigate('/editor')}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all bg-slate-100 hover:bg-slate-200 text-slate-800"
            >
              <BlockIcon className="w-3.5 h-3.5 text-slate-600" />
              <span>Lienzo en blanco</span>
            </button>

            <button
              onClick={handleImport}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <span>Importar archivo JSON</span>
            </button>
          </div>
        </div>

        {/* Pie del Sidebar: Perfil de Usuario y Logout */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs text-white shadow-sm shrink-0"
              style={{ background: '#ef4444' }}
            >
              {userInitials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-xs text-slate-800 truncate" title={displayName}>
                {displayName}
              </span>
              <span className="text-[10px] text-slate-400 truncate" title={user.email}>
                {user.email}
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Cerrar sesión"
          >
            <PowerIcon className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════════
          2. ÁREA DERECHA PRINCIPAL: VISTA GENERAL / PROYECTOS / PLANTILLAS
         ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen overflow-y-auto">

        {/* ── Top Bar del Dashboard ──────────────────────────────────────── */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 md:px-8 py-3.5 shrink-0 bg-white/90 border-b border-slate-200 backdrop-blur-md shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500">Workspace:</span>
              <span className="text-xs font-bold text-slate-800 px-2.5 py-0.5 rounded-lg bg-slate-100 border border-slate-200">
                Multi-Cloud Architecture
              </span>
            </div>

            {/* Píldora de estado de vista activa */}
            <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
              <span className="text-xs text-slate-400 font-mono text-[11px]">VISTA:</span>
              <span className="text-xs font-bold text-amber-600">
                {activeNavTab === 'overview' && 'Vista General'}
                {activeNavTab === 'projects' && 'Directorio de Proyectos'}
                {activeNavTab === 'templates' && 'Buscador de Plantillas'}
              </span>
            </div>

            {selectedProvider !== 'all' && (
              <span
                className="text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 bg-sky-50 text-sky-700 border border-sky-200"
              >
                Nube: {selectedProvider}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Ir al Editor */}
            <button
              onClick={() => navigate('/editor')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm text-white"
              style={{
                background: 'linear-gradient(135deg, #f59e0b, #f97316)',
                boxShadow: '0 2px 10px rgba(245,158,11,0.25)',
              }}
              title="Abrir editor de topologías"
            >
              <span>Ir al Editor</span>
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* ── CONTENIDO PRINCIPAL SEGÚN LA VISTA SELECCIONADA ────────────── */}
        <main className="max-w-7xl w-full mx-auto px-6 md:px-8 py-8 space-y-8 flex-1">

          {/* ────────────────────────────────────────────────────────────────
              A. VISTA DEDICADA: MIS PROYECTOS (activeNavTab === 'projects')
             ──────────────────────────────────────────────────────────────── */}
          {activeNavTab === 'projects' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Cabecera de la Sección de Proyectos */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                      <FolderIcon className="w-5 h-5" />
                    </span>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                      Mis Proyectos de Arquitectura
                    </h1>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500">
                    Directorio completo de arquitecturas. Filtra por nombre, categoría mono-nube (Azure, AWS, Oracle, GCP) o Multi-Cloud.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleImport}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold transition-all bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm"
                  >
                    Importar JSON
                  </button>
                  <button
                    onClick={() => setShowNewModal(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 text-white shadow-md"
                    style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
                  >
                    <span>+ Nuevo Proyecto</span>
                  </button>
                </div>
              </div>

              {/* Barra de Filtros: Buscador por Nombre + Filtros de Categoría Multi-Cloud/Azure/AWS + Orden */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                {/* 1. Buscador por Nombre o Descripción */}
                <div className="relative flex-1 min-w-[260px]">
                  <input
                    type="text"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    placeholder="Buscar por nombre de proyecto o descripción..."
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl text-xs outline-none bg-slate-50 hover:bg-white focus:bg-white text-slate-900 border border-slate-200 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  {projectSearch && (
                    <button
                      onClick={() => setProjectSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-slate-600"
                      title="Limpiar búsqueda"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* 2. Píldoras de Filtro por Categoría (Multi-Cloud / Solo Azure / Solo AWS / etc.) */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-bold text-slate-500 mr-1 hidden sm:inline">
                    Categoría:
                  </span>

                  <button
                    onClick={() => { setProjectCategoryFilter('all'); setSelectedProvider('all'); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      projectCategoryFilter === 'all'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200/80'
                    }`}
                  >
                    Todos ({categoryCounts.all})
                  </button>

                  <button
                    onClick={() => { setProjectCategoryFilter('multi'); setSelectedProvider('all'); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      projectCategoryFilter === 'multi'
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200/80'
                    }`}
                  >
                    <span>🌐 Multi-Cloud</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${projectCategoryFilter === 'multi' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {categoryCounts.multi}
                    </span>
                  </button>

                  <button
                    onClick={() => { setProjectCategoryFilter('azure'); setSelectedProvider('all'); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      projectCategoryFilter === 'azure'
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200/80'
                    }`}
                  >
                    <AzureLogo className="w-3 h-3" />
                    <span>Solo Azure</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${projectCategoryFilter === 'azure' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {categoryCounts.azure}
                    </span>
                  </button>

                  <button
                    onClick={() => { setProjectCategoryFilter('aws'); setSelectedProvider('all'); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      projectCategoryFilter === 'aws'
                        ? 'bg-amber-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200/80'
                    }`}
                  >
                    <AwsLogo className="w-3 h-3" />
                    <span>Solo AWS</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${projectCategoryFilter === 'aws' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {categoryCounts.aws}
                    </span>
                  </button>

                  <button
                    onClick={() => { setProjectCategoryFilter('oracle'); setSelectedProvider('all'); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      projectCategoryFilter === 'oracle'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200/80'
                    }`}
                  >
                    <OracleLogo className="w-3 h-3" />
                    <span>Solo Oracle</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${projectCategoryFilter === 'oracle' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {categoryCounts.oracle}
                    </span>
                  </button>

                  <button
                    onClick={() => { setProjectCategoryFilter('gcp'); setSelectedProvider('all'); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      projectCategoryFilter === 'gcp'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200 border border-slate-200/80'
                    }`}
                  >
                    <GcpLogo className="w-3 h-3" />
                    <span>Solo GCP</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${projectCategoryFilter === 'gcp' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {categoryCounts.gcp}
                    </span>
                  </button>
                </div>

                {/* 3. Ordenamiento */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[11px] font-bold text-slate-500">Orden:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl text-xs outline-none bg-slate-50 text-slate-800 border border-slate-200 focus:border-blue-500"
                  >
                    <option value="recent">Más Recientes</option>
                    <option value="cost-desc">Mayor Costo FinOps</option>
                    <option value="cost-asc">Menor Costo FinOps</option>
                    <option value="score-desc">Mayor Score Seguridad</option>
                    <option value="name-asc">Nombre (A-Z)</option>
                  </select>
                </div>
              </div>

              {/* Contador de resultados */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>
                  Mostrando <strong className="text-slate-800">{filteredProjects.length}</strong> de {projects.length} proyectos
                  {projectCategoryFilter !== 'all' && (
                    <span> en categoría <strong className="text-amber-600">{projectCategoryFilter.toUpperCase()}</strong></span>
                  )}
                  {projectSearch && (
                    <span> para "<strong className="text-amber-600">{projectSearch}</strong>"</span>
                  )}
                </span>
                {(projectSearch || projectCategoryFilter !== 'all' || selectedProvider !== 'all') && (
                  <button
                    onClick={() => { setProjectSearch(''); setProjectCategoryFilter('all'); setSelectedProvider('all'); }}
                    className="text-xs text-blue-600 hover:underline font-bold"
                  >
                    Restablecer filtros
                  </button>
                )}
              </div>

              {/* Grid de Proyectos */}
              {filteredProjects.length === 0 ? (
                <div className="text-center py-20 rounded-2xl border-2 border-dashed border-slate-200 bg-white/60 p-8 space-y-4 shadow-sm">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                    <HexagonIcon className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-800">
                      No se encontraron proyectos con estos criterios
                    </h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">
                      Intenta buscando con otro nombre o cambiando el filtro de categoría (ej. Multi-Cloud, Solo Azure, Solo AWS).
                    </p>
                  </div>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => { setProjectSearch(''); setProjectCategoryFilter('all'); setSelectedProvider('all'); }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm"
                    >
                      Ver todos los proyectos
                    </button>
                    <button
                      onClick={() => setShowNewModal(true)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md"
                      style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)' }}
                    >
                      + Crear Nuevo Proyecto
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredProjects.map(p => (
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
            </div>
          )}

          {/* ────────────────────────────────────────────────────────────────
              B. VISTA DEDICADA: BUSCAR PLANTILLAS (activeNavTab === 'templates')
             ──────────────────────────────────────────────────────────────── */}
          {activeNavTab === 'templates' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Cabecera de la Galería de Plantillas */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                      <BlastIcon className="w-5 h-5" />
                    </span>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                      Galería y Buscador de Plantillas
                    </h1>
                  </div>
                  <p className="text-xs md:text-sm text-slate-500">
                    Topologías empresariales de referencia probadas para AWS, Azure, Oracle y Google Cloud.
                  </p>
                </div>
              </div>

              {/* Barra de Búsqueda de Plantillas */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    placeholder="Buscar plantillas por nombre, servicio o nube (ej. 3-tier, serverless, oracle, sql, kubernetes)..."
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl text-xs outline-none bg-slate-50 hover:bg-white focus:bg-white text-slate-900 border border-slate-200 focus:border-blue-500 transition-all placeholder:text-slate-400"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                  {templateSearch && (
                    <button
                      onClick={() => setTemplateSearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-slate-600"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-500 shrink-0">
                  Mostrando <strong className="text-slate-800">{filteredTemplates.length}</strong> de {ARCHITECTURE_PRESETS.length} plantillas
                </div>
              </div>

              {/* Grid de Plantillas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTemplates.map(preset => (
                  <TemplateCard
                    key={preset.id}
                    preset={preset}
                    onSelect={handleCreateFromPreset}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ────────────────────────────────────────────────────────────────
              C. VISTA GENERAL (activeNavTab === 'overview')
             ──────────────────────────────────────────────────────────────── */}
          {activeNavTab === 'overview' && (
            <div className="space-y-10 animate-in fade-in duration-200">
              {/* Bienvenida y Resumen */}
              <div>
                <h1 className="text-3xl md:text-4xl font-black mb-1 tracking-tight text-slate-900">
                  Hola, <span style={{ color: '#d97706' }}>{displayName.split(' ')[0]}</span>
                </h1>
                <p className="text-xs md:text-sm text-slate-500">
                  Panel de control general de topologías cloud, presupuestos FinOps y auditorías de seguridad.
                </p>
              </div>

              {/* KPIs Globales */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard
                  label="Proyectos"
                  value={projects.length}
                  icon={<FolderIcon className="w-5 h-5" />}
                  sub="guardados en PostgreSQL"
                />
                <KpiCard
                  label="Costo FinOps Total"
                  value={formatUSD(totalCost)}
                  icon={<DollarIcon className="w-5 h-5" />}
                  color="#10b981"
                  sub="estimado mensual"
                />
                <KpiCard
                  label="Score de Auditoría"
                  value={`${avgScore}/100`}
                  icon={<ShieldIcon className="w-5 h-5" />}
                  color={avgScore >= 80 ? '#10b981' : avgScore >= 60 ? '#d97706' : '#ef4444'}
                  sub="promedio de seguridad"
                />
                <KpiCard
                  label="Issues de Seguridad"
                  value={totalIssues}
                  icon={<WarningIcon className="w-5 h-5" />}
                  color={totalIssues > 0 ? '#ef4444' : '#10b981'}
                  sub="reglas CIS detectadas"
                />
              </div>

              {/* Plantillas de Arquitectura Destacadas */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <BlastIcon className="w-4 h-4 text-amber-500" />
                      <span>Plantillas de Arquitectura de Referencia</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Topologías preconfiguradas y optimizadas
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveNavTab('templates')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Ver y buscar todas ({ARCHITECTURE_PRESETS.length})</span>
                    <ArrowRightIcon className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {ARCHITECTURE_PRESETS.slice(0, 4).map(preset => (
                    <TemplateCard
                      key={preset.id}
                      preset={preset}
                      onSelect={handleCreateFromPreset}
                    />
                  ))}
                </div>
              </div>

              {/* Proyectos Recientes */}
              <div className="space-y-4 pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                      <FolderIcon className="w-4 h-4 text-blue-600" />
                      <span>Proyectos Recientes</span>
                    </h2>
                    <p className="text-xs text-slate-500">
                      Últimos proyectos guardados o editados
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveNavTab('projects')}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <span>Ver directorio de proyectos ({projects.length})</span>
                    <ArrowRightIcon className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.slice(0, 6).map(p => (
                    <ProjectCard
                      key={p.id}
                      project={p}
                      onOpen={handleOpenProject}
                      onDelete={handleDelete}
                      onExport={handleExport}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ── Modal Nuevo Proyecto ──────────────────────────────────────── */}
      {showNewModal && (
        <NewProjectModal
          onClose={() => setShowNewModal(false)}
          onCreate={handleCreateProject}
        />
      )}
    </div>
  );
}


