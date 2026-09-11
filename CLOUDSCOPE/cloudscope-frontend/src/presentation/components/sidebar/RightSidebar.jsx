/**
 * RightSidebar – Panel lateral derecho de CloudScope.
 * Contiene tres pestañas:
 *  - Properties: Inspector y configurador del nodo seleccionado
 *  - Audit: Lista de hallazgos de seguridad del motor de reglas
 *  - FinOps: Desglose de costos mensuales
 */

import React, { useState } from 'react';
import { getNodeMeta } from '../../../domain/models/CloudNode.js';
import { severityColor } from '../../../domain/models/SecurityRule.js';
import { formatUSD } from '../../../application/use-cases/calculateCost.js';

// ─── Sub-componentes ───────────────────────────────────────────────────────────

/** Pestaña individual del header */
function Tab({ label, badge, active, onClick, color }) {
  return (
    <button
      onClick={onClick}
      className="flex-1 py-2.5 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all"
      style={{
        borderBottom: active ? `2px solid ${color}` : '2px solid transparent',
        color: active ? color : '#64748b',
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

/** Campo de formulario de texto */
function TextField({ label, value, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</label>
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2.5 py-1.5 rounded-lg text-[12px] outline-none transition"
        style={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }}
        onFocus={(e) => e.target.style.borderColor = '#f59e0b80'}
        onBlur={(e) => e.target.style.borderColor = '#334155'}
      />
    </div>
  );
}

/** Campo de formulario de select */
function SelectField({ label, value, options, onChange }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</label>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-2.5 py-1.5 rounded-lg text-[12px] outline-none transition cursor-pointer"
        style={{ background: '#1e293b', border: '1px solid #334155', color: '#e2e8f0' }}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

/** Toggle booleano */
function BoolField({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-1">
      <label className="text-[11px] text-slate-400">{label}</label>
      <button
        onClick={() => onChange(!value)}
        className="relative w-10 h-5 rounded-full transition-all duration-200"
        style={{
          background: value ? '#f59e0b' : '#1e293b',
          border: '1px solid #334155',
        }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full transition-all duration-200"
          style={{
            left: value ? '20px' : '2px',
            background: value ? '#0f172a' : '#475569',
          }}
        />
      </button>
    </div>
  );
}

// ─── Panels ────────────────────────────────────────────────────────────────────

/** Panel de propiedades del nodo seleccionado */
function PropertiesPanel({ selectedNode, updateNodeConfig, updateNodeLabel, deleteNode }) {
  if (!selectedNode) {
    return (
      <div className="h-48 flex flex-col items-center justify-center text-center px-4 opacity-50">
        <div className="text-3xl mb-2">⬡</div>
        <p className="text-[11px] text-slate-500">
          Click on a component to inspect and configure its settings
        </p>
      </div>
    );
  }

  const meta = getNodeMeta(selectedNode.data?.cloudType);
  if (!meta) return null;

  const config = selectedNode.data?.config ?? {};
  const schema = meta.configSchema ?? {};

  const handleConfigChange = (key, value) => {
    updateNodeConfig(selectedNode.id, { [key]: value });
  };

  return (
    <div className="space-y-4">
      {/* Identificación del nodo */}
      <div
        className="rounded-xl p-3 flex items-center gap-3"
        style={{ background: meta.bgColor, border: `1px solid ${meta.borderColor}` }}
      >
        <div
          style={{ background: `${meta.color}18`, borderColor: `${meta.color}40`, color: meta.color }}
          className="w-10 h-10 rounded-xl border-2 flex items-center justify-center font-bold text-sm shrink-0"
        >
          {meta.icon}
        </div>
        <div>
          <div className="text-[12px] font-bold text-slate-100">{meta.label}</div>
          <div className="text-[10px] text-slate-400">{meta.category}</div>
          <div className="text-[10px] font-mono text-slate-500">{meta.framework}</div>
        </div>
      </div>

      {/* Label editable */}
      <TextField
        label="Name / Label"
        value={selectedNode.data?.label}
        onChange={(v) => updateNodeLabel(selectedNode.id, v)}
      />

      {/* Config dinámica según schema */}
      {Object.entries(schema).map(([key, fieldSchema]) => {
        const val = config[key] ?? fieldSchema.default;
        if (fieldSchema.type === 'boolean') {
          return (
            <BoolField
              key={key}
              label={fieldSchema.label}
              value={!!val}
              onChange={(v) => handleConfigChange(key, v)}
            />
          );
        }
        if (fieldSchema.type === 'select') {
          return (
            <SelectField
              key={key}
              label={fieldSchema.label}
              value={val}
              options={fieldSchema.options}
              onChange={(v) => handleConfigChange(key, v)}
            />
          );
        }
        return (
          <TextField
            key={key}
            label={fieldSchema.label}
            value={val}
            onChange={(v) => handleConfigChange(key, v)}
          />
        );
      })}

      {/* Acción de eliminar */}
      <button
        onClick={() => deleteNode(selectedNode.id)}
        className="w-full mt-2 py-1.5 rounded-lg text-[11px] font-semibold transition-all"
        style={{
          background: 'rgba(239,68,68,0.08)',
          border: '1px solid rgba(239,68,68,0.25)',
          color: '#f87171',
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.18)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
      >
        🗑 Delete Node
      </button>
    </div>
  );
}

/** Panel de auditoría de seguridad */
function AuditPanel({ auditResult }) {
  const { findings, score, critical, high, medium, total } = auditResult;

  const scoreColor =
    score >= 80 ? '#34d399' :
    score >= 60 ? '#f59e0b' :
    score >= 40 ? '#f97316' : '#ef4444';

  return (
    <div className="space-y-4">
      {/* Score */}
      <div
        className="rounded-xl p-3.5 flex items-center justify-between"
        style={{ background: '#0b1120', border: '1px solid #1e293b' }}
      >
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Audit Score</div>
          <div className="text-[11px] text-slate-400">
            {total === 0 ? 'No issues found ✅' : `${total} issue${total !== 1 ? 's' : ''} detected`}
          </div>
        </div>
        <div className="text-3xl font-black font-mono" style={{ color: scoreColor }}>
          {score}
        </div>
      </div>

      {/* Conteo por severidad */}
      {total > 0 && (
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: 'Critical', count: critical, sev: 'CRITICAL' },
            { label: 'High', count: high, sev: 'HIGH' },
            { label: 'Medium', count: medium, sev: 'MEDIUM' },
          ].map(({ label, count, sev }) => {
            const c = severityColor(sev);
            return (
              <div key={sev} className="rounded-lg p-2 text-center" style={{ background: '#0b1120', border: `1px solid ${c.dot}30` }}>
                <div className="text-lg font-black font-mono" style={{ color: c.dot }}>{count}</div>
                <div className="text-[9px] font-semibold" style={{ color: c.dot }}>{label}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lista de hallazgos */}
      {findings.length === 0 ? (
        <div className="text-center py-6 text-slate-600 text-[11px]">
          <div className="text-2xl mb-1">🛡️</div>
          All security rules passed.<br />Add components to evaluate the architecture.
        </div>
      ) : (
        <div className="space-y-2">
          {findings.map((f, i) => {
            const c = severityColor(f.severity);
            return (
              <div
                key={`${f.ruleId}-${i}`}
                className="rounded-xl p-3 space-y-1.5"
                style={{ background: '#0b1120', border: `1px solid ${c.dot}30` }}
              >
                <div className="flex items-start gap-2">
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5"
                    style={{ background: `${c.dot}20`, color: c.dot }}
                  >
                    {f.severity}
                  </span>
                  <div className="text-[11px] font-semibold text-slate-200 leading-tight">{f.title}</div>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed">{f.description}</p>
                <div
                  className="text-[10px] px-2 py-1 rounded leading-relaxed"
                  style={{ background: '#0f172a', color: '#34d399', border: '1px solid #0d3226' }}
                >
                  💡 {f.recommendation}
                </div>
                <div className="text-[9px] text-slate-600">{f.framework} · {f.ruleId}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Panel de FinOps */
function FinOpsPanel({ costBreakdown }) {
  const { total, lineItems } = costBreakdown;

  return (
    <div className="space-y-4">
      {/* Total */}
      <div
        className="rounded-xl p-4 flex items-center justify-between"
        style={{ background: '#0b1120', border: '1px solid #1e293b' }}
      >
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-0.5">Monthly Estimate</div>
          <div className="text-[11px] text-slate-400">AWS us-east-1 pricing</div>
        </div>
        <div className="text-2xl font-black font-mono text-emerald-400">
          {formatUSD(total)}
        </div>
      </div>

      {/* Anual estimado */}
      {total > 0 && (
        <div
          className="rounded-lg p-2.5 flex items-center justify-between text-[11px]"
          style={{ background: '#0f1f12', border: '1px solid #166534' }}
        >
          <span className="text-slate-400">Annual estimate</span>
          <span className="font-mono font-bold text-emerald-300">{formatUSD(total * 12)}/yr</span>
        </div>
      )}

      {/* Desglose */}
      {lineItems.length === 0 ? (
        <div className="text-center py-6 text-slate-600 text-[11px]">
          <div className="text-2xl mb-1">💰</div>
          Add billable components to see the cost breakdown.
        </div>
      ) : (
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
            Cost Breakdown
          </div>
          <div className="space-y-1.5">
            {lineItems
              .sort((a, b) => b.cost - a.cost)
              .map((item) => {
                const pct = total > 0 ? (item.cost / total) * 100 : 0;
                const meta = getNodeMeta(item.type);
                return (
                  <div key={item.nodeId} className="space-y-0.5">
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] text-slate-300 truncate max-w-[130px]">{item.label}</span>
                      <span className="text-[11px] font-mono text-emerald-400">{formatUSD(item.cost)}</span>
                    </div>
                    <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: meta?.color ?? '#34d399' }}
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function RightSidebar({
  selectedNode,
  updateNodeConfig,
  updateNodeLabel,
  deleteNode,
  auditResult,
  costBreakdown,
}) {
  const [activeTab, setActiveTab] = useState('properties');

  const tabs = [
    { id: 'properties', label: 'Properties', badge: null, color: '#f59e0b' },
    { id: 'audit', label: 'Security', badge: auditResult?.total ?? 0, color: auditResult?.critical > 0 ? '#ef4444' : auditResult?.high > 0 ? '#f97316' : '#34d399' },
    { id: 'finops', label: 'FinOps', badge: null, color: '#34d399' },
  ];

  return (
    <aside
      className="w-72 flex flex-col shrink-0 z-20 overflow-hidden"
      style={{ background: '#0f172a', borderLeft: '1px solid #1e293b' }}
    >
      {/* Header con pestañas */}
      <div className="flex" style={{ borderBottom: '1px solid #1e293b' }}>
        {tabs.map((tab) => (
          <Tab
            key={tab.id}
            label={tab.label}
            badge={tab.badge}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            color={tab.color}
          />
        ))}
      </div>

      {/* Contenido de la pestaña activa */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {activeTab === 'properties' && (
          <PropertiesPanel
            selectedNode={selectedNode}
            updateNodeConfig={updateNodeConfig}
            updateNodeLabel={updateNodeLabel}
            deleteNode={deleteNode}
          />
        )}
        {activeTab === 'audit' && (
          <AuditPanel auditResult={auditResult ?? { findings: [], score: 100, critical: 0, high: 0, medium: 0, total: 0 }} />
        )}
        {activeTab === 'finops' && (
          <FinOpsPanel costBreakdown={costBreakdown ?? { total: 0, lineItems: [] }} />
        )}
      </div>
    </aside>
  );
}
