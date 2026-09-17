import React, { useState } from 'react';
import { useReactFlow } from 'reactflow';
import { getNodesByCategory } from '../../../domain/models/CloudNode.js';
import { useEditorTheme } from '../../context/EditorThemeContext.jsx';
import {
  AwsLogo,
  AzureLogo,
  OracleLogo,
  GcpLogo,
  ChevronDownIcon,
  ChevronUpIcon,
  ZoomInIcon,
  ZoomOutIcon,
  FitViewIcon,
} from '../icons/CloudIcons.jsx';

/** Configuración visual de los proveedores cloud principales */
const PROVIDERS = [
  {
    id: 'aws',
    name: 'AWS',
    fullName: 'AWS Components',
    bg: '#ff9900',
    color: '#ffffff',
    char: 'a',
    icon: <AwsLogo className="w-4 h-4" />,
  },
  {
    id: 'azure',
    name: 'Azure',
    fullName: 'Azure Components',
    bg: '#0078d4',
    color: '#ffffff',
    char: 'A',
    icon: <AzureLogo className="w-4 h-4" />,
  },
  {
    id: 'oracle',
    name: 'Oracle',
    fullName: 'Oracle Components',
    bg: '#f80000',
    color: '#ffffff',
    char: 'O',
    icon: <OracleLogo className="w-4 h-4" />,
  },
  {
    id: 'gcp',
    name: 'Google Cloud',
    fullName: 'Google Cloud Components',
    bg: '#4285f4',
    color: '#ffffff',
    char: 'G',
    icon: <GcpLogo className="w-4 h-4" />,
  },
];

/** Ítem individual de la paleta estilo Brainboard */
function BrainboardPaletteItem({ meta }) {
  const { isLight } = useEditorTheme();

  const onDragStart = (event) => {
    event.dataTransfer.setData('application/cloudscope/nodetype', meta.type);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className={`px-3.5 py-2.5 border-b cursor-grab active:cursor-grabbing transition-colors duration-150 select-none group ${
        isLight
          ? 'bg-white hover:bg-slate-50 border-slate-100'
          : 'bg-slate-900 hover:bg-slate-800/90 border-slate-800'
      }`}
      title={`Arrastrar al lienzo: ${meta.description}`}
    >
      <div className="flex items-center justify-between">
        <span className={`text-[12px] font-bold tracking-wide group-hover:text-sky-500 transition-colors uppercase ${
          isLight ? 'text-slate-800' : 'text-slate-200'
        }`}>
          {meta.label}
        </span>
        {meta.baseCostPerMonth > 0 ? (
          <span className="text-[10px] font-mono text-emerald-500 font-semibold">
            ${meta.baseCostPerMonth}/mo
          </span>
        ) : (
          <span className="text-[10px] font-mono text-slate-400">Free</span>
        )}
      </div>
      <div className={`text-[10.5px] line-clamp-1 mt-0.5 font-normal ${
        isLight ? 'text-slate-500' : 'text-slate-400'
      }`}>
        {meta.description}
      </div>
    </div>
  );
}

export default function LeftSidebar() {
  const { isLight, isDark } = useEditorTheme();
  const [provider, setProvider] = useState('aws');
  const [activeSubtab, setActiveSubtab] = useState('DESIGN'); // LIVE, DESIGN, BUDGET
  const [search, setSearch] = useState('');

  // Estado para acordeones abiertos
  const [openSections, setOpenSections] = useState({
    Common: true,
    Compute: true,
    Containers: true,
    Networking: true,
    'Storage & Databases': true,
  });

  const toggleSection = (category) => {
    setOpenSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Zoom controls conectados a ReactFlow
  let rfInstance = null;
  try {
    rfInstance = useReactFlow();
  } catch {
    rfInstance = null;
  }

  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomChange = (e) => {
    const newZoom = parseFloat(e.target.value);
    setZoomLevel(newZoom);
    if (rfInstance?.zoomTo) {
      rfInstance.zoomTo(newZoom, { duration: 100 });
    }
  };

  const handleZoomIn = () => {
    if (rfInstance?.zoomIn) {
      rfInstance.zoomIn({ duration: 200 });
      setZoomLevel((z) => Math.min(z + 0.2, 2));
    }
  };

  const handleZoomOut = () => {
    if (rfInstance?.zoomOut) {
      rfInstance.zoomOut({ duration: 200 });
      setZoomLevel((z) => Math.max(z - 0.2, 0.2));
    }
  };

  const handleFitView = () => {
    if (rfInstance?.fitView) {
      rfInstance.fitView({ duration: 250 });
      setZoomLevel(1);
    }
  };

  // Obtener categorías filtradas por proveedor
  const categoryGroups = getNodesByCategory(provider);

  // Filtrar según el término de búsqueda
  const filtered = Object.entries(categoryGroups).reduce((acc, [cat, items]) => {
    const q = search.toLowerCase().trim();
    if (!q) {
      acc[cat] = items;
      return acc;
    }
    const matching = items.filter(
      (m) =>
        m.label.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q)
    );
    if (matching.length > 0) acc[cat] = matching;
    return acc;
  }, {});

  const currentProviderObj = PROVIDERS.find((p) => p.id === provider) || PROVIDERS[0];

  return (
    <aside
      className={`w-72 flex flex-col shrink-0 z-20 overflow-hidden font-sans border-r transition-colors duration-200 ${
        isLight
          ? 'bg-white border-slate-200 shadow-sm text-slate-800'
          : 'bg-[#0f172a] border-slate-800 shadow-lg text-slate-100'
      }`}
    >
      {/* ── 1. Selector superior de Proveedores Cloud (Tabs oficiales con logos y letras) ── */}
      <div className={`flex items-center h-11 border-b transition-colors ${
        isLight ? 'border-slate-200 bg-slate-100/80' : 'border-slate-800 bg-slate-900/80'
      }`}>
        {PROVIDERS.map((p) => {
          const isActive = provider === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setProvider(p.id)}
              className="flex-1 h-full flex items-center justify-center font-bold text-sm transition-all duration-150 relative"
              style={{
                background: isActive ? p.bg : 'transparent',
                color: isActive ? '#ffffff' : isLight ? '#64748b' : '#94a3b8',
                boxShadow: isActive ? 'inset 0 -2px 0 rgba(0,0,0,0.15)' : 'none',
              }}
              title={`Ver componentes de ${p.name}`}
            >
              <span className="flex items-center gap-1">
                {isActive ? (
                  <span className="font-extrabold text-base tracking-tighter">{p.char}</span>
                ) : (
                  <span className="opacity-70 group-hover:opacity-100">{p.icon}</span>
                )}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── 2. Subpestañas: LIVE | DESIGN | BUDGET ── */}
      <div className={`grid grid-cols-3 border-b text-[11px] font-bold transition-colors ${
        isLight ? 'border-slate-200 bg-slate-50' : 'border-slate-800 bg-slate-900/50'
      }`}>
        {['LIVE', 'DESIGN', 'BUDGET'].map((tab) => {
          const isActive = activeSubtab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveSubtab(tab)}
              className="py-2.5 transition-all text-center tracking-wider font-extrabold"
              style={{
                background: isActive ? '#0084ff' : 'transparent',
                color: isActive ? '#ffffff' : isLight ? '#64748b' : '#94a3b8',
                borderBottom: isActive ? '2px solid #0070e0' : 'none',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ── 3. Título de componentes y Buscador ── */}
      <div className={`p-3 border-b space-y-2.5 transition-colors ${
        isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-[#0f172a]'
      }`}>
        <div className="flex items-center justify-between">
          <span className={`text-[12px] font-extrabold tracking-tight ${
            isLight ? 'text-slate-800' : 'text-slate-100'
          }`}>
            {currentProviderObj.fullName}
          </span>
          <span className={`text-[10px] font-semibold ${
            isLight ? 'text-slate-400' : 'text-slate-500'
          }`}>
            {Object.values(filtered).flat().length} items
          </span>
        </div>

        {/* Campo de búsqueda estilo Brainboard */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search components & icons. Q"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-3 pr-8 py-1.5 rounded-lg text-xs outline-none transition-all ${
              isLight
                ? 'bg-white border border-slate-300 text-slate-800 placeholder:text-slate-400 focus:border-sky-500 focus:ring-1 focus:ring-sky-200 shadow-inner'
                : 'bg-slate-950 border border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-sky-500 focus:ring-1 focus:ring-sky-900/50'
            }`}
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs">
            🔍
          </div>
        </div>
      </div>

      {/* ── 4. Lista de categorías y componentes estilo Brainboard ── */}
      <div className={`flex-1 overflow-y-auto scrollbar-thin transition-colors ${
        isLight ? 'bg-white' : 'bg-[#0f172a]'
      }`}>
        {activeSubtab === 'LIVE' ? (
          <div className="p-5 text-center text-slate-500 space-y-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-lg font-bold border border-emerald-200">
              ●
            </div>
            <h4 className={`font-bold text-xs uppercase ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>Modo Live Sincronizado</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              El estado de la arquitectura refleja tu entorno de nube activo y sincroniza parámetros en tiempo real.
            </p>
          </div>
        ) : activeSubtab === 'BUDGET' ? (
          <div className="p-5 text-center text-slate-500 space-y-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-lg font-bold border border-amber-200">
              $
            </div>
            <h4 className={`font-bold text-xs uppercase ${isLight ? 'text-slate-800' : 'text-slate-200'}`}>FinOps & Budget Planner</h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Planifica tus presupuestos mensuales por servicio y proveedor antes del despliegue en producción.
            </p>
          </div>
        ) : (
          <div>
            {Object.entries(filtered).length === 0 ? (
              <div className="text-center text-slate-400 text-xs py-10">
                No se encontraron componentes
              </div>
            ) : (
              Object.entries(filtered).map(([category, items]) => {
                const isOpen = openSections[category] ?? true;
                return (
                  <div key={category} className={`border-b ${isLight ? 'border-slate-100' : 'border-slate-800/80'}`}>
                    {/* Cabecera del acordeón azul intenso estilo Brainboard */}
                    <button
                      type="button"
                      onClick={() => toggleSection(category)}
                      className="w-full px-3.5 py-2 flex items-center justify-between text-white font-bold text-[12px] tracking-wide transition-colors"
                      style={{
                        background: '#0084ff',
                      }}
                    >
                      <span className="uppercase">{category}</span>
                      <span className="text-white/90">
                        {isOpen ? (
                          <ChevronUpIcon className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDownIcon className="w-3.5 h-3.5" />
                        )}
                      </span>
                    </button>

                    {/* Contenido desplegable */}
                    {isOpen && (
                      <div className={`divide-y ${isLight ? 'divide-slate-100 bg-white' : 'divide-slate-800/80 bg-[#0f172a]'}`}>
                        {items.map((meta) => (
                          <BrainboardPaletteItem key={meta.type} meta={meta} />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* ── 5. Barra de Zoom inferior estilo Brainboard ── */}
      <div className={`px-3 py-2 border-t flex items-center justify-between gap-2 shrink-0 transition-colors ${
        isLight ? 'border-slate-200 bg-white' : 'border-slate-800 bg-[#0f172a]'
      }`}>
        <button
          onClick={handleZoomOut}
          className={`p-1 rounded transition-colors ${
            isLight ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
          }`}
          title="Alejar (-)"
        >
          <ZoomOutIcon className="w-3.5 h-3.5" />
        </button>

        <input
          type="range"
          min="0.2"
          max="2"
          step="0.05"
          value={zoomLevel}
          onChange={handleZoomChange}
          className={`w-24 h-1.5 rounded-lg appearance-none cursor-pointer accent-[#0084ff] ${
            isLight ? 'bg-slate-200' : 'bg-slate-800'
          }`}
          title={`Zoom: ${Math.round(zoomLevel * 100)}%`}
        />

        <button
          onClick={handleZoomIn}
          className={`p-1 rounded transition-colors ${
            isLight ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
          }`}
          title="Acercar (+)"
        >
          <ZoomInIcon className="w-3.5 h-3.5" />
        </button>

        <div className={`w-px h-4 ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />

        <button
          onClick={handleFitView}
          className={`p-1 rounded transition-colors ${
            isLight ? 'text-slate-500 hover:text-slate-800 hover:bg-slate-100' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
          }`}
          title="Ajustar vista al lienzo"
        >
          <FitViewIcon className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
