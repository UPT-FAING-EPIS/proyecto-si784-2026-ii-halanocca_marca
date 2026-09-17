/**
 * RightSidebar – Sprint 3: What-If analysis + PDF export + Blast Radius + Audit + FinOps.
 * Soporta modo Claro (Visual Blanco) y modo Oscuro (Visual Oscuro) dinámicamente.
 */

import React, { useState } from 'react';
import { useEditorTheme } from '../../context/EditorThemeContext.jsx';
import {
  BlastIcon,
  StopIcon,
  TrashIcon,
  PDFIcon,
  ShieldIcon,
  LightbulbIcon,
  DollarIcon,
  BeakerIcon,
  XIcon,
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  getServiceIcon,
  AwsLogo,
  AzureLogo,
  OracleLogo,
  GcpLogo,
} from '../icons/CloudIcons.jsx';
import { getNodeMeta } from '../../../domain/models/CloudNode.js';
import { severityColor } from '../../../domain/models/SecurityRule.js';
import { formatUSD } from '../../../application/use-cases/calculateCost.js';
import { impactColor } from '../../../application/use-cases/runBlastRadius.js';
import { generateAutoWhatIf, formatDelta } from '../../../application/use-cases/computeWhatIf.js';

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function Tab({ label, badge, active, onClick, color }) {
  const { isLight } = useEditorTheme();
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
        active
          ? ''
          : isLight
          ? 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/60'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
      }`}
      style={{
        borderBottom: active ? `2px solid ${color}` : '2px solid transparent',
        color: active ? color : undefined,
      }}
    >
      {label}
      {badge != null && badge > 0 && (
        <span
          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ background: `${color}22`, color }}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

// ─── Campos de formulario adaptables ──────────────────────────────────────────
function TextField({ label, value, onChange }) {
  const { isLight } = useEditorTheme();
  return (
    <div className="space-y-1">
      <label
        className={`text-[10px] font-semibold uppercase tracking-wider ${
          isLight ? 'text-slate-600' : 'text-slate-400'
        }`}
      >
        {label}
      </label>
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-2.5 py-1.5 rounded-lg text-[12px] outline-none transition-all ${
          isLight
            ? 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-200'
            : 'bg-[#1e293b] border border-[#334155] text-slate-100 focus:border-amber-400'
        }`}
      />
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  const { isLight } = useEditorTheme();
  return (
    <div className="space-y-1">
      <label
        className={`text-[10px] font-semibold uppercase tracking-wider ${
          isLight ? 'text-slate-600' : 'text-slate-400'
        }`}
      >
        {label}
      </label>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-2.5 py-1.5 rounded-lg text-[12px] outline-none cursor-pointer transition-all ${
          isLight
            ? 'bg-slate-50 border border-slate-300 text-slate-900 focus:bg-white focus:border-sky-500'
            : 'bg-[#1e293b] border border-[#334155] text-slate-100 focus:border-amber-400'
        }`}
      >
        {options.map((opt) => (
          <option
            key={opt}
            value={opt}
            className={isLight ? 'bg-white text-slate-900' : 'bg-slate-900 text-slate-100'}
          >
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function BoolField({ label, value, onChange }) {
  const { isLight } = useEditorTheme();
  return (
    <div className="flex items-center justify-between py-1">
      <label className={`text-[11px] ${isLight ? 'text-slate-700' : 'text-slate-300'}`}>
        {label}
      </label>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`relative w-10 h-5 rounded-full transition-all duration-200 border ${
          value
            ? 'bg-amber-500 border-amber-500'
            : isLight
            ? 'bg-slate-200 border-slate-300'
            : 'bg-[#1e293b] border-[#334155]'
        }`}
      >
        <span
          className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200 ${
            value
              ? 'left-[20px] bg-white shadow-sm'
              : `left-[2px] ${isLight ? 'bg-white shadow-sm' : 'bg-slate-500'}`
          }`}
        />
      </button>
    </div>
  );
}

// ─── Panel Properties ─────────────────────────────────────────────────────────
function PropertiesPanel({
  selectedNode,
  updateNodeConfig,
  updateNodeLabel,
  deleteNode,
  onSimulateBlast,
  blastResult,
  onClearBlast,
  nodes = [],
  onSelectNode,
}) {
  const { isLight } = useEditorTheme();
  if (!selectedNode)
    return (
      <div className="h-48 flex flex-col items-center justify-center text-center px-4 opacity-50">
        <div className="text-3xl mb-2">⬡</div>
        <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          Click en un componente para configurarlo
        </p>
      </div>
    );

  const meta = getNodeMeta(selectedNode.data?.cloudType);
  if (!meta) return null;
  const config = selectedNode.data?.config ?? {};
  const schema = meta.configSchema ?? {};

  const isSimulatingThisNode = blastResult?.sourceNodeId === selectedNode.id;
  const isSimulationActive = !!blastResult?.sourceNodeId;

  // Navegación entre nodos (Atrás / Adelante en selección de componentes)
  const nodeIndex = nodes.findIndex((n) => n.id === selectedNode.id);
  const hasMultipleNodes = nodes.length > 1;

  const handlePrevNode = () => {
    if (!hasMultipleNodes) return;
    const prevIdx = (nodeIndex - 1 + nodes.length) % nodes.length;
    onSelectNode?.(nodes[prevIdx]);
  };

  const handleNextNode = () => {
    if (!hasMultipleNodes) return;
    const nextIdx = (nodeIndex + 1) % nodes.length;
    onSelectNode?.(nodes[nextIdx]);
  };

  return (
    <div className="space-y-4">
      {/* Barra de navegación Atrás / Adelante entre Nodos */}
      {hasMultipleNodes && (
        <div
          className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px] border transition-colors ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0b1120] border-[#1e293b]'
          }`}
        >
          <button
            onClick={handlePrevNode}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
              isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Ir al nodo anterior"
          >
            <ArrowLeftIcon className="w-3 h-3" />
            <span>Anterior</span>
          </button>
          <span className="text-[10px] font-mono text-slate-500 font-semibold">
            Nodo {nodeIndex >= 0 ? nodeIndex + 1 : 1} de {nodes.length}
          </span>
          <button
            onClick={handleNextNode}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
              isLight
                ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
            title="Ir al nodo siguiente"
          >
            <span>Siguiente</span>
            <ArrowRightIcon className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Header del nodo con iconos vectoriales oficiales */}
      <div
        className={`rounded-xl p-3 flex items-center gap-3 border shadow-sm ${
          isLight ? 'bg-slate-50 border-slate-200' : 'border-slate-800'
        }`}
        style={{
          background: isLight ? '#f8fafc' : meta.bgColor,
          borderColor: isLight ? '#e2e8f0' : meta.borderColor,
        }}
      >
        <div
          className="w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm"
          style={{ background: `${meta.color}18`, borderColor: `${meta.color}40`, color: meta.color }}
        >
          {getServiceIcon(selectedNode.data?.cloudType, 'w-5 h-5', meta.color)}
        </div>
        <div className="flex-1 min-w-0">
          <div className={`text-[12px] font-bold truncate ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
            {meta.label}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {meta.provider === 'aws' && <AwsLogo className="w-3 h-3 shrink-0" />}
            {meta.provider === 'azure' && <AzureLogo className="w-3 h-3 shrink-0" />}
            {meta.provider === 'oracle' && <OracleLogo className="w-3 h-3 shrink-0" />}
            {meta.provider === 'gcp' && <GcpLogo className="w-3 h-3 shrink-0" />}
            <span
              className={`text-[10px] uppercase font-semibold ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              {meta.provider} • {meta.category}
            </span>
          </div>
        </div>
      </div>

      <TextField
        label="Name / Label"
        value={selectedNode.data?.label}
        onChange={(v) => updateNodeLabel(selectedNode.id, v)}
      />

      {Object.entries(schema).map(([key, fs]) => {
        const val = config[key] ?? fs.default;
        if (fs.type === 'boolean')
          return (
            <BoolField
              key={key}
              label={fs.label}
              value={!!val}
              onChange={(v) => updateNodeConfig(selectedNode.id, { [key]: v })}
            />
          );
        if (fs.type === 'select')
          return (
            <SelectField
              key={key}
              label={fs.label}
              value={val}
              options={fs.options}
              onChange={(v) => updateNodeConfig(selectedNode.id, { [key]: v })}
            />
          );
        return (
          <TextField
            key={key}
            label={fs.label}
            value={val}
            onChange={(v) => updateNodeConfig(selectedNode.id, { [key]: v })}
          />
        );
      })}

      {/* Botón Blast Radius: Iniciar / Parar Simulación */}
      <div className="space-y-1.5 pt-1">
        {isSimulatingThisNode ? (
          <button
            onClick={onClearBlast}
            className="w-full py-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-2 shadow-lg"
            style={{
              background: 'rgba(239,68,68,0.2)',
              border: '1px solid rgba(239,68,68,0.6)',
              color: isLight ? '#dc2626' : '#fca5a5',
              boxShadow: '0 0 14px rgba(239,68,68,0.3)',
            }}
            title="Detener la simulación de impacto de este componente"
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <StopIcon className="w-3 h-3" /> Parar Simulación (Activa)
          </button>
        ) : (
          <button
            onClick={() => onSimulateBlast(selectedNode.id)}
            className="w-full py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5"
            style={{
              background: isLight ? '#fef2f2' : 'rgba(239,68,68,0.08)',
              border: `1px solid ${isLight ? '#fecaca' : 'rgba(239,68,68,0.25)'}`,
              color: isLight ? '#ef4444' : '#f87171',
            }}
            title="Simular radio de impacto (Blast Radius)"
          >
            <BlastIcon className="w-3.5 h-3.5" /> Iniciar Simulación (Blast Radius)
          </button>
        )}

        {isSimulationActive && !isSimulatingThisNode && (
          <button
            onClick={onClearBlast}
            className={`w-full py-1.5 rounded-lg text-[10px] font-semibold transition-all flex items-center justify-center gap-1 border ${
              isLight
                ? 'bg-slate-100 border-slate-200 text-slate-600 hover:text-red-600 hover:border-red-200'
                : 'bg-[#1e293b] border-[#334155] text-[#94a3b8] hover:text-[#f87171]'
            }`}
          >
            <XIcon className="w-3 h-3" /> Parar simulación activa
          </button>
        )}

        <button
          onClick={() => deleteNode(selectedNode.id)}
          className={`w-full py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5 border ${
            isLight
              ? 'bg-red-50/50 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-300'
              : 'bg-slate-800/40 border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/30'
          }`}
        >
          <TrashIcon className="w-3.5 h-3.5" /> Eliminar nodo
        </button>
      </div>
    </div>
  );
}

// ─── Panel Blast Radius ───────────────────────────────────────────────────────
function BlastPanel({ blastResult, nodes, onSimulateBlast, onClearBlast }) {
  const { isLight } = useEditorTheme();
  if (!blastResult?.sourceNodeId)
    return (
      <div className="space-y-4">
        <div
          className={`p-4 rounded-xl text-center border ${
            isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0b1120] border-[#1e293b]'
          }`}
        >
          <div className="mb-2 text-red-500">
            <BlastIcon className="w-8 h-8 mx-auto" />
          </div>
          <p className={`text-xs ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            Selecciona un componente en el canvas y haz click en "Simular Blast Radius" para ver los nodos afectados.
          </p>
        </div>
        <div className="space-y-1">
          {nodes
            .filter((n) => n.data?.cloudType)
            .map((n) => {
              const meta = getNodeMeta(n.data.cloudType);
              return (
                <button
                  key={n.id}
                  onClick={() => onSimulateBlast(n.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all border ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-red-300 shadow-sm'
                      : 'bg-[#0f172a] border-[#1e293b] hover:border-red-500/40'
                  }`}
                >
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded"
                    style={{ background: meta?.bgColor, color: meta?.color }}
                  >
                    {meta?.icon ?? '?'}
                  </span>
                  <span className={`text-[11px] ${isLight ? 'text-slate-800 font-medium' : 'text-slate-300'}`}>
                    {n.data.label}
                  </span>
                  <span className={`ml-auto ${isLight ? 'text-slate-400' : 'text-slate-600'}`}>
                    <BlastIcon className="w-3 h-3" />
                  </span>
                </button>
              );
            })}
        </div>
      </div>
    );

  const { sourceNodeId, affectedNodeIds, directNodeIds, impactScore } = blastResult;
  const sourceNode = nodes.find((n) => n.id === sourceNodeId);
  const impact = impactColor(impactScore);

  return (
    <div className="space-y-3">
      {/* Score de impacto */}
      <div
        className={`rounded-xl p-4 border shadow-sm ${
          isLight ? 'bg-slate-50 border-red-200/80' : 'bg-[#0b1120]'
        }`}
        style={{ borderColor: isLight ? undefined : `${impact.glow}30` }}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <div
              className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${
                isLight ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Blast Radius Score
            </div>
            <div className={`text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
              Nodo origen:{' '}
              <span className={`font-semibold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
                {sourceNode?.data?.label}
              </span>
            </div>
          </div>
          <div className="text-3xl font-black font-mono" style={{ color: impact.glow }}>
            {impactScore}%
          </div>
        </div>
        <div className="flex gap-3 text-[11px]">
          <div
            className={`flex-1 text-center p-2 rounded-lg border ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0f172a] border-[#1e293b]'
            }`}
          >
            <div className="font-black text-lg text-red-500">{directNodeIds.length}</div>
            <div className={isLight ? 'text-slate-500' : 'text-slate-400'}>Directos</div>
          </div>
          <div
            className={`flex-1 text-center p-2 rounded-lg border ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0f172a] border-[#1e293b]'
            }`}
          >
            <div className="font-black text-lg text-orange-500">{affectedNodeIds.length}</div>
            <div className={isLight ? 'text-slate-500' : 'text-slate-400'}>Afectados</div>
          </div>
          <div
            className={`flex-1 text-center p-2 rounded-lg border ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0f172a] border-[#1e293b]'
            }`}
          >
            <div className="font-black text-lg" style={{ color: impact.glow }}>
              {impact.label}
            </div>
            <div className={isLight ? 'text-slate-500' : 'text-slate-400'}>Impacto</div>
          </div>
        </div>
      </div>

      {/* Lista de nodos afectados */}
      <div>
        <div
          className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          Nodos afectados
        </div>
        <div className="space-y-1">
          {affectedNodeIds.map((id) => {
            const n = nodes.find((x) => x.id === id);
            if (!n) return null;
            const meta = getNodeMeta(n.data?.cloudType);
            const isDirect = directNodeIds.includes(id);
            return (
              <div
                key={id}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border ${
                  isLight
                    ? isDirect
                      ? 'bg-red-50/60 border-red-200 text-slate-800'
                      : 'bg-white border-slate-200 text-slate-800'
                    : isDirect
                    ? 'bg-[#0f172a] border-red-500/30 text-slate-300'
                    : 'bg-[#0f172a] border-[#1e293b] text-slate-300'
                }`}
              >
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{
                    background: meta?.bgColor ?? (isLight ? '#f1f5f9' : '#1e293b'),
                    color: meta?.color ?? '#64748b',
                  }}
                >
                  {meta?.icon ?? '?'}
                </span>
                <span
                  className={`text-[11px] flex-1 truncate font-medium ${
                    isLight ? 'text-slate-800' : 'text-slate-300'
                  }`}
                >
                  {n.data?.label}
                </span>
                <span className="text-[9px] font-semibold" style={{ color: isDirect ? '#ef4444' : '#f97316' }}>
                  {isDirect ? '● Directo' : '○ Transitivo'}
                </span>
              </div>
            );
          })}
          {affectedNodeIds.length === 0 && (
            <div className={`text-center text-[11px] py-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
              No hay nodos downstream. Este componente es un nodo hoja (sin dependientes).
            </div>
          )}
        </div>
      </div>

      <button
        onClick={onClearBlast}
        className={`w-full py-1.5 rounded-lg text-[11px] font-semibold transition-all border ${
          isLight
            ? 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border-slate-200'
            : 'bg-[#1e293b] text-slate-400 hover:text-slate-100 border-[#334155]'
        }`}
      >
        <span className="flex items-center justify-center gap-1">
          <XIcon className="w-3 h-3" /> Limpiar simulación
        </span>
      </button>
    </div>
  );
}

// ─── Panel Audit ──────────────────────────────────────────────────────────────
function AuditPanel({ auditResult, onExportPDF }) {
  const { isLight } = useEditorTheme();
  const { findings = [], score = 100, critical = 0, high = 0, medium = 0, total = 0 } = auditResult ?? {};
  const scoreColor = score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444';

  return (
    <div className="space-y-3">
      {/* Botón de exportación PDF (RF-11) */}
      <button
        onClick={onExportPDF}
        className="w-full py-2 px-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 shadow-md"
        style={{
          background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
          color: '#ffffff',
          boxShadow: '0 2px 8px rgba(37,99,235,0.25)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <PDFIcon className="w-3.5 h-3.5" /> Exportar Reporte PDF (CIS & FinOps)
      </button>

      <div
        className={`rounded-xl p-3.5 flex items-center justify-between border ${
          isLight ? 'bg-slate-50 border-slate-200 shadow-sm' : 'bg-[#0b1120] border-[#1e293b]'
        }`}
      >
        <div>
          <div
            className={`text-[10px] font-bold uppercase tracking-widest ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Audit Score
          </div>
          <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
            {total === 0 ? (
              <span className="flex items-center gap-1 text-emerald-500 font-semibold">
                <CheckIcon className="w-3.5 h-3.5" /> No issues
              </span>
            ) : (
              `${total} issue${total !== 1 ? 's' : ''} found`
            )}
          </div>
        </div>
        <div className="text-3xl font-black font-mono" style={{ color: scoreColor }}>
          {score}
        </div>
      </div>

      {total > 0 && (
        <div className="grid grid-cols-3 gap-1">
          {[['Critical', critical, 'CRITICAL'], ['High', high, 'HIGH'], ['Medium', medium, 'MEDIUM']].map(
            ([l, c, s]) => {
              const col = severityColor(s);
              return (
                <div
                  key={s}
                  className={`rounded-lg p-2 text-center border ${
                    isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#0b1120]'
                  }`}
                  style={{ borderColor: isLight ? undefined : `${col.dot}30` }}
                >
                  <div className="text-lg font-black font-mono" style={{ color: col.dot }}>
                    {c}
                  </div>
                  <div className="text-[9px] font-semibold" style={{ color: col.dot }}>
                    {l}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      <div className="space-y-2">
        {findings.length === 0 ? (
          <div className={`text-center py-6 text-[11px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            <div className="mb-1 text-emerald-500">
              <ShieldIcon className="w-8 h-8 mx-auto" />
            </div>
            All security rules passed.
          </div>
        ) : (
          findings.map((f, i) => {
            const c = severityColor(f.severity);
            return (
              <div
                key={i}
                className={`rounded-xl p-3 space-y-1.5 border shadow-sm ${
                  isLight ? 'bg-white border-slate-200' : 'bg-[#0b1120]'
                }`}
                style={{ borderColor: isLight ? undefined : `${c.dot}30` }}
              >
                <div className="flex items-start gap-2">
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                    style={{ background: `${c.dot}20`, color: c.dot }}
                  >
                    {f.severity}
                  </span>
                  <div
                    className={`text-[11px] font-semibold leading-tight ${
                      isLight ? 'text-slate-800' : 'text-slate-200'
                    }`}
                  >
                    {f.title}
                  </div>
                </div>
                <p className={`text-[10px] leading-relaxed ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                  {f.description}
                </p>
                <div
                  className={`text-[10px] px-2 py-1 rounded leading-relaxed border ${
                    isLight
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : 'bg-[#0f172a] text-emerald-400 border-emerald-900/50'
                  }`}
                >
                  <span className="flex items-start gap-1">
                    <LightbulbIcon className="w-3 h-3 shrink-0 mt-0.5" /> {f.recommendation}
                  </span>
                </div>
                <div className={`text-[9px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  {f.framework} · {f.ruleId}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ─── Panel FinOps ─────────────────────────────────────────────────────────────
function FinOpsPanel({ costBreakdown }) {
  const { isLight } = useEditorTheme();
  const { total = 0, lineItems = [] } = costBreakdown ?? {};
  return (
    <div className="space-y-3">
      <div
        className={`rounded-xl p-4 flex items-center justify-between border ${
          isLight ? 'bg-slate-50 border-slate-200 shadow-sm' : 'bg-[#0b1120] border-[#1e293b]'
        }`}
      >
        <div>
          <div
            className={`text-[10px] font-bold uppercase tracking-widest ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Monthly Estimate
          </div>
          <div className={`text-[11px] mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
            AWS us-east-1
          </div>
        </div>
        <div className="text-2xl font-black font-mono text-emerald-500">{formatUSD(total)}</div>
      </div>
      {total > 0 && (
        <div
          className={`rounded-lg p-2.5 flex items-center justify-between text-[11px] border ${
            isLight
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-[#0f1f12] border-[#166534] text-emerald-300'
          }`}
        >
          <span className={isLight ? 'text-slate-600' : 'text-slate-400'}>Annual estimate</span>
          <span className="font-mono font-bold text-emerald-500">{formatUSD(total * 12)}/yr</span>
        </div>
      )}
      {lineItems.length === 0 ? (
        <div className={`text-center py-6 text-[11px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
          <div className="mb-1 text-emerald-500">
            <DollarIcon className="w-8 h-8 mx-auto" />
          </div>
          <div>Add billable components to see breakdown.</div>
        </div>
      ) : (
        <div className="space-y-2">
          <div
            className={`text-[10px] font-bold uppercase tracking-widest ${
              isLight ? 'text-slate-500' : 'text-slate-400'
            }`}
          >
            Breakdown
          </div>
          {lineItems
            .sort((a, b) => b.cost - a.cost)
            .map((item) => {
              const pct = total > 0 ? (item.cost / total) * 100 : 0;
              const meta = getNodeMeta(item.type);
              return (
                <div key={item.nodeId} className="space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-[11px] truncate max-w-[130px] ${
                        isLight ? 'text-slate-700' : 'text-slate-300'
                      }`}
                    >
                      {item.label}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-500 font-semibold">
                      {formatUSD(item.cost)}
                    </span>
                  </div>
                  <div
                    className={`h-1 rounded-full overflow-hidden ${
                      isLight ? 'bg-slate-200' : 'bg-[#1e293b]'
                    }`}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, background: meta?.color ?? '#10b981' }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}

// ─── Panel What-If ────────────────────────────────────────────────────────────
function WhatIfPanel({ nodes, costBreakdown }) {
  const { isLight } = useEditorTheme();
  const scenarios = generateAutoWhatIf(nodes ?? []);
  const totalCurrent = costBreakdown?.total ?? 0;

  if (scenarios.length === 0) {
    return (
      <div className={`text-center py-10 px-4 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
        <div className="mb-2 text-purple-400">
          <BeakerIcon className="w-8 h-8 mx-auto" />
        </div>
        <p className="text-[11px]">Agrega componentes EC2, RDS o S3 para ver escenarios de What-If automáticos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        className={`rounded-xl p-3 text-[11px] border ${
          isLight ? 'bg-slate-50 border-slate-200 shadow-sm' : 'bg-[#0b1120] border-[#1e293b]'
        }`}
      >
        <div
          className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${
            isLight ? 'text-slate-500' : 'text-slate-400'
          }`}
        >
          Costo actual
        </div>
        <div className="text-xl font-black font-mono text-emerald-500">{formatUSD(totalCurrent)}/mo</div>
        <div className={`text-[10px] mt-0.5 ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>AWS us-east-1</div>
      </div>

      <div
        className={`text-[10px] font-bold uppercase tracking-widest ${
          isLight ? 'text-slate-500' : 'text-slate-400'
        }`}
      >
        Escenarios alternativos
      </div>

      {scenarios.map((s, i) => {
        const { formatted, color } = formatDelta(s.delta);
        const newTotal = totalCurrent + s.delta;
        const isUpgrade = s.delta > 0;
        return (
          <div
            key={i}
            className={`rounded-xl p-3 space-y-2 border shadow-sm ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#0b1120]'
            }`}
            style={{ borderColor: isLight ? undefined : `${color}30` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div
                  className={`text-[11px] font-semibold truncate ${
                    isLight ? 'text-slate-800' : 'text-slate-200'
                  }`}
                >
                  {isUpgrade ? '↑' : '↓'} {s.label ?? `${s.nodeLabel} alternativo`}
                </div>
                <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
                  {formatUSD(s.currentCost)} → {formatUSD(s.alternativeCost)}/mo
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[13px] font-black font-mono" style={{ color }}>
                  {formatted}
                </div>
                <div className={`text-[10px] ${isLight ? 'text-slate-400' : 'text-slate-500'}`}>
                  ${Math.abs(s.annualDelta).toFixed(0)}/año
                </div>
              </div>
            </div>
            <div className={`flex justify-between text-[10px] ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
              <span>Nuevo total:</span>
              <span className={`font-mono font-bold ${isLight ? 'text-slate-800' : 'text-slate-300'}`}>
                {formatUSD(newTotal)}/mo
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────
export default function RightSidebar({
  selectedNode,
  onSelectNode,
  updateNodeConfig,
  updateNodeLabel,
  deleteNode,
  auditResult,
  costBreakdown,
  blastResult,
  nodes,
  onSimulateBlast,
  onClearBlast,
  onExportPDF,
}) {
  const { isLight, isDark } = useEditorTheme();
  const [activeTab, setActiveTab] = useState('properties');

  const tabs = [
    { id: 'properties', label: 'Props', badge: null, color: '#f59e0b' },
    { id: 'blast', label: 'Blast', badge: blastResult?.affectedNodeIds?.length ?? null, color: '#ef4444' },
    {
      id: 'audit',
      label: 'Audit',
      badge: auditResult?.total ?? 0,
      color: auditResult?.critical > 0 ? '#ef4444' : auditResult?.high > 0 ? '#f97316' : '#10b981',
    },
    { id: 'finops', label: 'Cost', badge: null, color: '#10b981' },
    { id: 'whatif', label: 'What-If', badge: null, color: '#8b5cf6' },
  ];

  const currentTabIndex = tabs.findIndex((t) => t.id === activeTab);

  const handlePrevTab = () => {
    const prevIdx = (currentTabIndex - 1 + tabs.length) % tabs.length;
    setActiveTab(tabs[prevIdx].id);
  };

  const handleNextTab = () => {
    const nextIdx = (currentTabIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIdx].id);
  };

  return (
    <aside
      className={`w-72 flex flex-col shrink-0 z-20 overflow-hidden font-sans border-l transition-colors duration-200 ${
        isLight
          ? 'bg-white border-slate-200 shadow-sm text-slate-800'
          : 'bg-[#0f172a] border-slate-800 shadow-lg text-slate-100'
      }`}
    >
      <div
        className={`flex overflow-x-auto border-b transition-colors ${
          isLight ? 'border-slate-200 bg-slate-50/70' : 'border-slate-800 bg-[#0f172a]'
        }`}
      >
        {tabs.map((tab) => (
          <Tab key={tab.id} {...tab} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {activeTab === 'properties' && (
          <PropertiesPanel
            selectedNode={selectedNode}
            updateNodeConfig={updateNodeConfig}
            updateNodeLabel={updateNodeLabel}
            deleteNode={deleteNode}
            onSimulateBlast={onSimulateBlast}
            blastResult={blastResult}
            onClearBlast={onClearBlast}
            nodes={nodes ?? []}
            onSelectNode={onSelectNode}
          />
        )}
        {activeTab === 'blast' && (
          <BlastPanel
            blastResult={blastResult}
            nodes={nodes ?? []}
            onSimulateBlast={onSimulateBlast}
            onClearBlast={onClearBlast}
          />
        )}
        {activeTab === 'audit' && <AuditPanel auditResult={auditResult} onExportPDF={onExportPDF} />}
        {activeTab === 'finops' && <FinOpsPanel costBreakdown={costBreakdown} />}
        {activeTab === 'whatif' && <WhatIfPanel nodes={nodes} costBreakdown={costBreakdown} />}
      </div>

      {/* ── Barra de Navegación Atrás / Adelante entre Pestañas ──────────── */}
      <div
        className={`px-3 py-2 flex items-center justify-between text-[11px] shrink-0 border-t transition-colors ${
          isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#0b1120] border-[#1e293b]'
        }`}
      >
        <button
          onClick={handlePrevTab}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
            isLight
              ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title={`Pestaña anterior (${tabs[(currentTabIndex - 1 + tabs.length) % tabs.length].label})`}
        >
          <ArrowLeftIcon className="w-3 h-3" />
          <span>Anterior</span>
        </button>

        <span className={`text-[10px] font-semibold ${isLight ? 'text-slate-500' : 'text-slate-400'}`}>
          {currentTabIndex + 1} / {tabs.length}
        </span>

        <button
          onClick={handleNextTab}
          className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
            isLight
              ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title={`Pestaña siguiente (${tabs[(currentTabIndex + 1) % tabs.length].label})`}
        >
          <span>Siguiente</span>
          <ArrowRightIcon className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
}

