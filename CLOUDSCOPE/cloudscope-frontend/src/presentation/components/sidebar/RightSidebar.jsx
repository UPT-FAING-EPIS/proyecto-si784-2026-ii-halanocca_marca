/**
 * RightSidebar – Sprint 3: What-If analysis + PDF export + Blast Radius + Audit + FinOps.
 */

import React, { useState } from 'react';
import { BlastIcon, StopIcon, TrashIcon, PDFIcon, ShieldIcon, LightbulbIcon, DollarIcon, BeakerIcon, XIcon, CheckIcon, ArrowLeftIcon, ArrowRightIcon } from '../icons/CloudIcons.jsx';
import { getNodeMeta } from '../../../domain/models/CloudNode.js';
import { severityColor } from '../../../domain/models/SecurityRule.js';
import { formatUSD } from '../../../application/use-cases/calculateCost.js';
import { impactColor } from '../../../application/use-cases/runBlastRadius.js';
import { generateAutoWhatIf, formatDelta } from '../../../application/use-cases/computeWhatIf.js';
import { getServiceIcon, AwsLogo, AzureLogo, GcpLogo } from '../icons/CloudIcons.jsx';

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function Tab({ label, badge, active, onClick, color }) {
  return (
    <button onClick={onClick}
      className="flex-1 py-2 text-[11px] font-semibold flex items-center justify-center gap-1 transition-all"
      style={{
        borderBottom: active ? `2px solid ${color}` : '2px solid transparent',
        color: active ? color : '#64748b',
      }}>
      {label}
      {badge != null && badge > 0 && (
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
          style={{ background: `${color}22`, color }}>{badge}</span>
      )}
    </button>
  );
}

// ─── Campo de formulario ──────────────────────────────────────────────────────
function TextField({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#475569' }}>{label}</label>
      <input type="text" value={value ?? ''} onChange={(e) => onChange(e.target.value)}
        className="w-full px-2.5 py-1.5 rounded-lg text-[12px] outline-none"
        style={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }}
        onFocus={(e) => e.target.style.borderColor = '#f59e0b'}
        onBlur={(e) => e.target.style.borderColor = '#334155'} />
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: '#475569' }}>{label}</label>
      <select value={value ?? ''} onChange={(e) => onChange(e.target.value)}
        className="w-full px-2.5 py-1.5 rounded-lg text-[12px] outline-none cursor-pointer"
        style={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }}>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function BoolField({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-1">
      <label className="text-[11px]" style={{ color: '#94a3b8' }}>{label}</label>
      <button onClick={() => onChange(!value)}
        className="relative w-10 h-5 rounded-full transition-all duration-200"
        style={{ background: value ? '#f59e0b' : '#1e293b', border: '1px solid #334155' }}>
        <span className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
          style={{ left: value ? '20px' : '2px', background: value ? '#0f172a' : '#475569' }} />
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
  if (!selectedNode) return (
    <div className="h-48 flex flex-col items-center justify-center text-center px-4 opacity-40">
      <div className="text-3xl mb-2">⬡</div>
      <p className="text-[11px]" style={{ color: '#475569' }}>Click en un componente para configurarlo</p>
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
          className="flex items-center justify-between px-2.5 py-1.5 rounded-xl text-[11px]"
          style={{ background: '#0b1120', border: '1px solid #1e293b' }}
        >
          <button
            onClick={handlePrevNode}
            className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-0.5 rounded transition-colors"
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
            className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-0.5 rounded transition-colors"
            title="Ir al nodo siguiente"
          >
            <span>Siguiente</span>
            <ArrowRightIcon className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Header del nodo con iconos vectoriales oficiales */}
      <div className="rounded-xl p-3 flex items-center gap-3"
        style={{ background: meta.bgColor, border: `1px solid ${meta.borderColor}` }}>
        <div className="w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-sm shrink-0 shadow-sm"
          style={{ background: `${meta.color}18`, borderColor: `${meta.color}40`, color: meta.color }}>
          {getServiceIcon(selectedNode.data?.cloudType, "w-5 h-5", meta.color)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[12px] font-bold text-slate-100 truncate">{meta.label}</div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {meta.provider === 'aws' && <AwsLogo className="w-3 h-3 shrink-0" />}
            {meta.provider === 'azure' && <AzureLogo className="w-3 h-3 shrink-0" />}
            {meta.provider === 'gcp' && <GcpLogo className="w-3 h-3 shrink-0" />}
            <span className="text-[10px] text-slate-400 uppercase font-semibold">{meta.provider} • {meta.category}</span>
          </div>
        </div>
      </div>

      <TextField label="Name / Label" value={selectedNode.data?.label}
        onChange={(v) => updateNodeLabel(selectedNode.id, v)} />

      {Object.entries(schema).map(([key, fs]) => {
        const val = config[key] ?? fs.default;
        if (fs.type === 'boolean') return <BoolField key={key} label={fs.label} value={!!val} onChange={v => updateNodeConfig(selectedNode.id, { [key]: v })} />;
        if (fs.type === 'select') return <SelectField key={key} label={fs.label} value={val} options={fs.options} onChange={v => updateNodeConfig(selectedNode.id, { [key]: v })} />;
        return <TextField key={key} label={fs.label} value={val} onChange={v => updateNodeConfig(selectedNode.id, { [key]: v })} />;
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
              color: '#fca5a5',
              boxShadow: '0 0 14px rgba(239,68,68,0.3)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
            title="Detener la simulación de impacto de este componente"
          >
            <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
            <StopIcon className="w-3 h-3" /> Parar Simulación (Activa)
          </button>
        ) : (
          <button
            onClick={() => onSimulateBlast(selectedNode.id)}
            className="w-full py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5"
            style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
            title="Simular radio de impacto (Blast Radius)"
          >
            <BlastIcon className="w-3.5 h-3.5" /> Iniciar Simulación (Blast Radius)
          </button>
        )}

        {isSimulationActive && !isSimulatingThisNode && (
          <button
            onClick={onClearBlast}
            className="w-full py-1.5 rounded-lg text-[10px] font-semibold transition-all flex items-center justify-center gap-1"
            style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = '#334155'; }}
          >
            <XIcon className="w-3 h-3" /> Parar simulación activa
          </button>
        )}

        <button
          onClick={() => deleteNode(selectedNode.id)}
          className="w-full py-1.5 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5"
          style={{ background: 'rgba(71,85,105,0.1)', border: '1px solid #1e293b', color: '#475569' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.25)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#1e293b'; }}
        >
          <TrashIcon className="w-3.5 h-3.5" /> Eliminar nodo
        </button>
      </div>
    </div>
  );
}

// ─── Panel Blast Radius ───────────────────────────────────────────────────────
function BlastPanel({ blastResult, nodes, onSimulateBlast, onClearBlast }) {
  if (!blastResult?.sourceNodeId) return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl text-center" style={{ background: '#0b1120', border: '1px solid #1e293b' }}>
        <div className="mb-2" style={{ color: '#ef4444' }}><BlastIcon className="w-8 h-8 mx-auto" /></div>
        <p className="text-xs" style={{ color: '#475569' }}>
          Selecciona un componente en el canvas y haz click en "Simular Blast Radius" para ver los nodos afectados.
        </p>
      </div>
      <div className="space-y-1">
        {nodes.filter(n => n.data?.cloudType).map(n => {
          const meta = getNodeMeta(n.data.cloudType);
          return (
            <button key={n.id} onClick={() => onSimulateBlast(n.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all"
              style={{ background: '#0f172a', border: '1px solid #1e293b' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ef444440'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1e293b'}>
              <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: meta?.bgColor, color: meta?.color }}>{meta?.icon ?? '?'}</span>
              <span className="text-[11px]" style={{ color: '#94a3b8' }}>{n.data.label}</span>
              <span className="ml-auto" style={{ color: '#334155' }}><BlastIcon className="w-3 h-3" /></span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const { sourceNodeId, affectedNodeIds, directNodeIds, impactScore } = blastResult;
  const sourceNode = nodes.find(n => n.id === sourceNodeId);
  const impact = impactColor(impactScore);

  return (
    <div className="space-y-3">
      {/* Score de impacto */}
      <div className="rounded-xl p-4" style={{ background: '#0b1120', border: `1px solid ${impact.glow}30` }}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-0.5" style={{ color: '#475569' }}>
              Blast Radius Score
            </div>
            <div className="text-[11px]" style={{ color: '#64748b' }}>
              Nodo origen: <span style={{ color: '#e2e8f0' }}>{sourceNode?.data?.label}</span>
            </div>
          </div>
          <div className="text-3xl font-black font-mono" style={{ color: impact.glow }}>
            {impactScore}%
          </div>
        </div>
        <div className="flex gap-3 text-[11px]">
          <div className="flex-1 text-center p-2 rounded-lg" style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
            <div className="font-black text-lg" style={{ color: '#ef4444' }}>{directNodeIds.length}</div>
            <div style={{ color: '#475569' }}>Directos</div>
          </div>
          <div className="flex-1 text-center p-2 rounded-lg" style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
            <div className="font-black text-lg" style={{ color: '#f97316' }}>{affectedNodeIds.length}</div>
            <div style={{ color: '#475569' }}>Afectados</div>
          </div>
          <div className="flex-1 text-center p-2 rounded-lg" style={{ background: '#0f172a', border: '1px solid #1e293b' }}>
            <div className="font-black text-lg" style={{ color: impact.glow }}>{impact.label}</div>
            <div style={{ color: '#475569' }}>Impacto</div>
          </div>
        </div>
      </div>

      {/* Lista de nodos afectados */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: '#475569' }}>
          Nodos afectados
        </div>
        <div className="space-y-1">
          {affectedNodeIds.map(id => {
            const n = nodes.find(x => x.id === id);
            if (!n) return null;
            const meta = getNodeMeta(n.data?.cloudType);
            const isDirect = directNodeIds.includes(id);
            return (
              <div key={id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                style={{ background: '#0f172a', border: `1px solid ${isDirect ? '#ef444430' : '#1e293b'}` }}>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: meta?.bgColor ?? '#1e293b', color: meta?.color ?? '#64748b' }}>
                  {meta?.icon ?? '?'}
                </span>
                <span className="text-[11px] flex-1" style={{ color: '#94a3b8' }}>{n.data?.label}</span>
                <span className="text-[9px]" style={{ color: isDirect ? '#ef4444' : '#f97316' }}>
                  {isDirect ? '● Directo' : '○ Transitivo'}
                </span>
              </div>
            );
          })}
          {affectedNodeIds.length === 0 && (
            <div className="text-center text-[11px] py-4" style={{ color: '#334155' }}>
              No hay nodos downstream. Este componente es un nodo hoja (sin dependientes).
            </div>
          )}
        </div>
      </div>

      <button onClick={onClearBlast}
        className="w-full py-1.5 rounded-lg text-[11px] font-semibold transition-all"
        style={{ background: '#1e293b', color: '#64748b', border: '1px solid #334155' }}
        onMouseEnter={(e) => e.currentTarget.style.color = '#f8fafc'}
        onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}>
        <span className="flex items-center justify-center gap-1"><XIcon className="w-3 h-3" /> Limpiar simulación</span>
      </button>
    </div>
  );
}

// ─── Panel Audit ──────────────────────────────────────────────────────────────
function AuditPanel({ auditResult, onExportPDF }) {
  const { findings = [], score = 100, critical = 0, high = 0, medium = 0, total = 0 } = auditResult ?? {};
  const scoreColor = score >= 80 ? '#34d399' : score >= 60 ? '#f59e0b' : score >= 40 ? '#f97316' : '#ef4444';

  return (
    <div className="space-y-3">
      {/* Botón de exportación PDF (RF-11) */}
      <button
        onClick={onExportPDF}
        className="w-full py-2 px-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90"
        style={{
          background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
          color: '#ffffff',
          boxShadow: '0 2px 8px rgba(37,99,235,0.3)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <PDFIcon className="w-3.5 h-3.5" /> Exportar Reporte PDF (CIS & FinOps)
      </button>

      <div className="rounded-xl p-3.5 flex items-center justify-between"
        style={{ background: '#0b1120', border: '1px solid #1e293b' }}>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#475569' }}>Audit Score</div>
          <div className="text-[11px] mt-0.5" style={{ color: '#64748b' }}>
            {total === 0 ? <span className="flex items-center gap-1" style={{ color: '#34d399' }}><CheckIcon className="w-3.5 h-3.5" /> No issues</span> : `${total} issue${total !== 1 ? 's' : ''} found`}
          </div>
        </div>
        <div className="text-3xl font-black font-mono" style={{ color: scoreColor }}>{score}</div>
      </div>

      {total > 0 && (
        <div className="grid grid-cols-3 gap-1">
          {[['Critical', critical, 'CRITICAL'], ['High', high, 'HIGH'], ['Medium', medium, 'MEDIUM']].map(([l, c, s]) => {
            const col = severityColor(s);
            return (
              <div key={s} className="rounded-lg p-2 text-center" style={{ background: '#0b1120', border: `1px solid ${col.dot}30` }}>
                <div className="text-lg font-black font-mono" style={{ color: col.dot }}>{c}</div>
                <div className="text-[9px] font-semibold" style={{ color: col.dot }}>{l}</div>
              </div>
            );
          })}
        </div>
      )}

      <div className="space-y-2">
        {findings.length === 0 ? (
          <div className="text-center py-6 text-[11px]" style={{ color: '#334155' }}>
            <div className="mb-1" style={{ color: '#34d399' }}><ShieldIcon className="w-8 h-8 mx-auto" /></div>
            All security rules passed.
          </div>
        ) : findings.map((f, i) => {
          const c = severityColor(f.severity);
          return (
            <div key={i} className="rounded-xl p-3 space-y-1.5"
              style={{ background: '#0b1120', border: `1px solid ${c.dot}30` }}>
              <div className="flex items-start gap-2">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                  style={{ background: `${c.dot}20`, color: c.dot }}>{f.severity}</span>
                <div className="text-[11px] font-semibold leading-tight" style={{ color: '#e2e8f0' }}>{f.title}</div>
              </div>
              <p className="text-[10px] leading-relaxed" style={{ color: '#64748b' }}>{f.description}</p>
              <div className="text-[10px] px-2 py-1 rounded leading-relaxed"
                style={{ background: '#0f172a', color: '#34d399', border: '1px solid #0d3226' }}
              >
                <span className="flex items-start gap-1"><LightbulbIcon className="w-3 h-3 shrink-0 mt-0.5" /> {f.recommendation}</span>
              </div>
              <div className="text-[9px]" style={{ color: '#334155' }}>{f.framework} · {f.ruleId}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Panel FinOps ─────────────────────────────────────────────────────────────
function FinOpsPanel({ costBreakdown }) {
  const { total = 0, lineItems = [] } = costBreakdown ?? {};
  return (
    <div className="space-y-3">
      <div className="rounded-xl p-4 flex items-center justify-between"
        style={{ background: '#0b1120', border: '1px solid #1e293b' }}>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#475569' }}>Monthly Estimate</div>
          <div className="text-[11px] mt-0.5" style={{ color: '#64748b' }}>AWS us-east-1</div>
        </div>
        <div className="text-2xl font-black font-mono" style={{ color: '#34d399' }}>{formatUSD(total)}</div>
      </div>
      {total > 0 && (
        <div className="rounded-lg p-2.5 flex items-center justify-between text-[11px]"
          style={{ background: '#0f1f12', border: '1px solid #166534' }}>
          <span style={{ color: '#64748b' }}>Annual estimate</span>
          <span className="font-mono font-bold" style={{ color: '#34d399' }}>{formatUSD(total * 12)}/yr</span>
        </div>
      )}
      {lineItems.length === 0 ? (
        <div className="text-center py-6 text-[11px]" style={{ color: '#334155' }}>
          <div className="mb-1" style={{ color: '#34d399' }}><DollarIcon className="w-8 h-8 mx-auto" /></div>
          <div>Add billable components to see breakdown.</div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#475569' }}>Breakdown</div>
          {lineItems.sort((a, b) => b.cost - a.cost).map(item => {
            const pct = total > 0 ? (item.cost / total) * 100 : 0;
            const meta = getNodeMeta(item.type);
            return (
              <div key={item.nodeId} className="space-y-0.5">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] truncate max-w-[130px]" style={{ color: '#94a3b8' }}>{item.label}</span>
                  <span className="text-[11px] font-mono" style={{ color: '#34d399' }}>{formatUSD(item.cost)}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: '#1e293b' }}>
                  <div className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: meta?.color ?? '#34d399' }} />
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
  const scenarios = generateAutoWhatIf(nodes ?? []);
  const totalCurrent = costBreakdown?.total ?? 0;

  if (scenarios.length === 0) {
    return (
      <div className="text-center py-10 px-4" style={{ color: '#334155' }}>
        <div className="mb-2" style={{ color: '#a78bfa' }}><BeakerIcon className="w-8 h-8 mx-auto" /></div>
        <p className="text-[11px]">Agrega componentes EC2, RDS o S3 para ver escenarios de What-If automáticos.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="rounded-xl p-3 text-[11px]" style={{ background: '#0b1120', border: '1px solid #1e293b' }}>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: '#475569' }}>Costo actual</div>
        <div className="text-xl font-black font-mono" style={{ color: '#34d399' }}>{formatUSD(totalCurrent)}/mo</div>
        <div className="text-[10px] mt-0.5" style={{ color: '#334155' }}>AWS us-east-1</div>
      </div>

      <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#475569' }}>Escenarios alternativos</div>

      {scenarios.map((s, i) => {
        const { formatted, color } = formatDelta(s.delta);
        const newTotal = totalCurrent + s.delta;
        const isUpgrade = s.delta > 0;
        return (
          <div key={i} className="rounded-xl p-3 space-y-2"
            style={{ background: '#0b1120', border: `1px solid ${color}30` }}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold truncate" style={{ color: '#e2e8f0' }}>
                  {isUpgrade ? '↑' : '↓'} {s.label ?? `${s.nodeLabel} alternativo`}
                </div>
                <div className="text-[10px]" style={{ color: '#475569' }}>
                  {formatUSD(s.currentCost)} → {formatUSD(s.alternativeCost)}/mo
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-[13px] font-black font-mono" style={{ color }}>{formatted}</div>
                <div className="text-[10px]" style={{ color: '#334155' }}>${Math.abs(s.annualDelta).toFixed(0)}/año</div>
              </div>
            </div>
            <div className="flex justify-between text-[10px]" style={{ color: '#475569' }}>
              <span>Nuevo total:</span>
              <span className="font-mono font-bold" style={{ color: '#94a3b8' }}>{formatUSD(newTotal)}/mo</span>
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
  const [activeTab, setActiveTab] = useState('properties');

  const tabs = [
    { id: 'properties', label: 'Props', badge: null, color: '#f59e0b' },
    { id: 'blast', label: 'Blast', badge: blastResult?.affectedNodeIds?.length ?? null, color: '#ef4444' },
    { id: 'audit', label: 'Audit', badge: auditResult?.total ?? 0, color: auditResult?.critical > 0 ? '#ef4444' : auditResult?.high > 0 ? '#f97316' : '#34d399' },
    { id: 'finops', label: 'Cost', badge: null, color: '#34d399' },
    { id: 'whatif', label: 'What-If', badge: null, color: '#a78bfa' },
  ];

  const currentTabIndex = tabs.findIndex(t => t.id === activeTab);

  const handlePrevTab = () => {
    const prevIdx = (currentTabIndex - 1 + tabs.length) % tabs.length;
    setActiveTab(tabs[prevIdx].id);
  };

  const handleNextTab = () => {
    const nextIdx = (currentTabIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIdx].id);
  };

  return (
    <aside className="w-72 flex flex-col shrink-0 z-20 overflow-hidden"
      style={{ background: '#0f172a', borderLeft: '1px solid #1e293b' }}>
      <div className="flex overflow-x-auto" style={{ borderBottom: '1px solid #1e293b' }}>
        {tabs.map(tab => (
          <Tab key={tab.id} {...tab} active={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />
        ))}
      </div>
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {activeTab === 'properties' && (
          <PropertiesPanel selectedNode={selectedNode} updateNodeConfig={updateNodeConfig}
            updateNodeLabel={updateNodeLabel} deleteNode={deleteNode} onSimulateBlast={onSimulateBlast}
            blastResult={blastResult} onClearBlast={onClearBlast} nodes={nodes ?? []} onSelectNode={onSelectNode} />
        )}
        {activeTab === 'blast' && (
          <BlastPanel blastResult={blastResult} nodes={nodes ?? []}
            onSimulateBlast={onSimulateBlast} onClearBlast={onClearBlast} />
        )}
        {activeTab === 'audit' && (
          <AuditPanel auditResult={auditResult} onExportPDF={onExportPDF} />
        )}
        {activeTab === 'finops' && (
          <FinOpsPanel costBreakdown={costBreakdown} />
        )}
        {activeTab === 'whatif' && (
          <WhatIfPanel nodes={nodes} costBreakdown={costBreakdown} />
        )}
      </div>

      {/* ── Barra de Navegación Atrás / Adelante entre Pestañas ──────────── */}
      <div
        className="px-3 py-2 flex items-center justify-between text-[11px] shrink-0"
        style={{ background: '#0b1120', borderTop: '1px solid #1e293b' }}
      >
        <button
          onClick={handlePrevTab}
          className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded-lg transition-colors hover:bg-slate-800"
          title={`Pestaña anterior (${tabs[(currentTabIndex - 1 + tabs.length) % tabs.length].label})`}
        >
          <ArrowLeftIcon className="w-3 h-3" />
          <span>Anterior</span>
        </button>

        <span className="text-[10px] font-semibold text-slate-500">
          {currentTabIndex + 1} / {tabs.length}
        </span>

        <button
          onClick={handleNextTab}
          className="flex items-center gap-1 text-slate-400 hover:text-white px-2 py-1 rounded-lg transition-colors hover:bg-slate-800"
          title={`Pestaña siguiente (${tabs[(currentTabIndex + 1) % tabs.length].label})`}
        >
          <span>Siguiente</span>
          <ArrowRightIcon className="w-3 h-3" />
        </button>
      </div>
    </aside>
  );
}
