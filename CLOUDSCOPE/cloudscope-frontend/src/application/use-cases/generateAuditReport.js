/**
 * generateAuditReport – Use case de exportación de reporte de auditoría a PDF.
 * Genera un HTML bien formateado y usa window.print() para exportar a PDF.
 * No requiere dependencias externas (funciona con el PDF nativo del browser).
 */

import { getNodeMeta } from '../../domain/models/CloudNode.js';
import { formatUSD } from './calculateCost.js';

const SEVERITY_CONFIG = {
  CRITICAL: { color: '#ef4444', bg: '#450a0a', label: 'Critical' },
  HIGH:     { color: '#f97316', bg: '#431407', label: 'High' },
  MEDIUM:   { color: '#f59e0b', bg: '#451a03', label: 'Medium' },
  LOW:      { color: '#22d3ee', bg: '#083344', label: 'Low' },
  INFO:     { color: '#94a3b8', bg: '#0f172a', label: 'Info' },
};

/**
 * Genera el contenido HTML del reporte de auditoría.
 */
function buildReportHTML(projectName, nodes, edges, auditResult, costBreakdown) {
  const now = new Date().toLocaleString('es-PE', {
    dateStyle: 'long', timeStyle: 'short',
  });

  const scoreColor =
    auditResult.score >= 80 ? '#22c55e' :
    auditResult.score >= 60 ? '#f59e0b' :
    auditResult.score >= 40 ? '#f97316' : '#ef4444';

  // KPI cards HTML
  const kpiCards = [
    { label: 'Security Score', value: `${auditResult.score}/100`, color: scoreColor },
    { label: 'Total Issues', value: auditResult.total, color: '#f59e0b' },
    { label: 'Critical', value: auditResult.critical, color: '#ef4444' },
    { label: 'High', value: auditResult.high, color: '#f97316' },
    { label: 'Monthly Cost', value: formatUSD(costBreakdown.total), color: '#22c55e' },
    { label: 'Components', value: nodes.length, color: '#94a3b8' },
  ].map(k => `
    <div style="background:#1e293b;border:1px solid #334155;border-radius:12px;padding:16px;text-align:center;">
      <div style="font-size:11px;color:#64748b;font-weight:600;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">${k.label}</div>
      <div style="font-size:24px;font-weight:900;color:${k.color};font-family:monospace;">${k.value}</div>
    </div>
  `).join('');

  // Findings HTML
  const findingsHTML = auditResult.findings.length === 0
    ? `<div style="text-align:center;padding:32px;color:#22c55e;font-weight:600;">No security issues found — architecture is compliant.</div>`
    : auditResult.findings.map(f => {
        const cfg = SEVERITY_CONFIG[f.severity] ?? SEVERITY_CONFIG.INFO;
        return `
          <div style="border:1px solid ${cfg.color}40;border-radius:12px;padding:16px;margin-bottom:12px;background:${cfg.bg};">
            <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px;">
              <span style="background:${cfg.color}25;color:${cfg.color};font-size:10px;font-weight:700;padding:3px 8px;border-radius:6px;white-space:nowrap;">${f.severity}</span>
              <strong style="color:#f1f5f9;font-size:14px;">${f.title}</strong>
            </div>
            <p style="color:#94a3b8;font-size:12px;margin:0 0 8px;">${f.description}</p>
            <div style="background:#0f172a;border:1px solid #22c55e40;border-radius:8px;padding:10px;font-size:12px;color:#22c55e;">
              <strong>Recomendación:</strong> ${f.recommendation}
            </div>
            <div style="margin-top:6px;font-size:10px;color:#475569;">${f.framework} · ${f.ruleId}</div>
          </div>
        `;
      }).join('');

  // Cost breakdown HTML
  const costHTML = costBreakdown.lineItems.length === 0
    ? `<div style="text-align:center;padding:24px;color:#334155;">No billable components added yet.</div>`
    : costBreakdown.lineItems
        .sort((a, b) => b.cost - a.cost)
        .map(item => {
          const meta = getNodeMeta(item.type);
          const pct = costBreakdown.total > 0 ? (item.cost / costBreakdown.total * 100).toFixed(1) : 0;
          return `
            <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #1e293b;">
              <span style="background:${meta?.bgColor ?? '#1e293b'};color:${meta?.color ?? '#94a3b8'};font-size:10px;font-weight:700;padding:4px 8px;border-radius:6px;min-width:36px;text-align:center;">${meta?.icon ?? '?'}</span>
              <span style="flex:1;color:#e2e8f0;font-size:13px;">${item.label}</span>
              <span style="color:#64748b;font-size:12px;">${pct}%</span>
              <span style="color:#22c55e;font-weight:700;font-family:monospace;font-size:13px;min-width:80px;text-align:right;">${formatUSD(item.cost)}/mo</span>
            </div>
          `;
        }).join('');

  // Components inventory
  const componentsHTML = nodes.map(n => {
    const meta = getNodeMeta(n.data?.cloudType);
    return `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #1e293b;">
          <span style="background:${meta?.bgColor ?? '#1e293b'};color:${meta?.color ?? '#94a3b8'};font-size:10px;font-weight:700;padding:3px 7px;border-radius:5px;">${meta?.icon ?? '?'}</span>
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #1e293b;color:#e2e8f0;font-size:13px;">${n.data?.label ?? 'Unnamed'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #1e293b;color:#64748b;font-size:12px;">${meta?.label ?? n.data?.cloudType ?? '-'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #1e293b;color:#94a3b8;font-size:11px;text-transform:uppercase;font-weight:600;">${meta?.provider ?? 'aws'}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #1e293b;color:#64748b;font-size:12px;">${meta?.category ?? '-'}</td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>CloudScope Audit Report – ${projectName}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=JetBrains+Mono&display=swap');
  * { margin:0; padding:0; box-sizing:border-box; }
  body { font-family:'Inter',sans-serif; background:#0b1120; color:#f8fafc; padding:40px; line-height:1.6; }
  h1,h2,h3 { font-weight:900; }
  .section { margin-bottom:40px; }
  .section-title { font-size:13px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:#475569; margin-bottom:16px; padding-bottom:8px; border-bottom:1px solid #1e293b; }
  table { width:100%; border-collapse:collapse; background:#0f172a; border-radius:12px; overflow:hidden; border:1px solid #1e293b; }
  th { background:#1e293b; color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:1px; padding:10px 12px; text-align:left; }
  @media print {
    body { background:#0b1120 !important; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .no-print { display:none; }
  }
</style>
</head>
<body>

<!-- Header del reporte -->
<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:40px;padding-bottom:24px;border-bottom:2px solid #1e293b;">
  <div>
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:8px;">
      <div style="width:40px;height:40px;background:linear-gradient(135deg,#f59e0b,#f97316);border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:14px;color:#0b1120;">CS</div>
      <div>
        <div style="font-size:20px;font-weight:900;color:#f8fafc;">Cloud<span style="color:#f59e0b;">Scope</span> Audit Report</div>
        <div style="font-size:13px;color:#475569;">${projectName}</div>
      </div>
    </div>
  </div>
  <div style="text-align:right;">
    <div style="font-size:11px;color:#475569;margin-bottom:4px;">Generado el</div>
    <div style="font-size:13px;font-weight:600;color:#94a3b8;">${now}</div>
    <div style="font-size:11px;color:#334155;margin-top:4px;">CloudScope Studio MVP · UPT SI-784</div>
  </div>
</div>

<!-- KPIs -->
<div class="section">
  <div class="section-title">Resumen ejecutivo</div>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">${kpiCards}</div>
</div>

<!-- Hallazgos de seguridad -->
<div class="section">
  <div class="section-title">Hallazgos de Seguridad (${auditResult.findings.length})</div>
  ${findingsHTML}
</div>

<!-- Desglose de costos -->
<div class="section">
  <div class="section-title">Estimación de Costos FinOps</div>
  <div style="background:#0f172a;border:1px solid #1e293b;border-radius:12px;padding:16px;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #1e293b;">
      <span style="color:#64748b;font-size:13px;">Total mensual estimado</span>
      <span style="color:#22c55e;font-weight:900;font-family:monospace;font-size:22px;">${formatUSD(costBreakdown.total)}/mo</span>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;padding-bottom:12px;border-bottom:1px solid #1e293b;">
      <span style="color:#64748b;font-size:13px;">Estimado anual</span>
      <span style="color:#22c55e;font-weight:700;font-family:monospace;font-size:14px;">${formatUSD(costBreakdown.total * 12)}/año</span>
    </div>
    ${costHTML}
  </div>
</div>

<!-- Inventario de componentes -->
<div class="section">
  <div class="section-title">Inventario de Componentes (${nodes.length})</div>
  <table>
    <thead><tr><th>Tipo</th><th>Nombre</th><th>Servicio Cloud</th><th>Proveedor</th><th>Categoría</th></tr></thead>
    <tbody>${componentsHTML || '<tr><td colspan="5" style="padding:16px;text-align:center;color:#334155;">Sin componentes</td></tr>'}</tbody>
  </table>
</div>

<!-- Footer -->
<div style="margin-top:40px;padding-top:16px;border-top:1px solid #1e293b;text-align:center;">
  <p style="font-size:11px;color:#334155;">
    Generado por CloudScope Studio MVP · Universidad Privada de Tacna · Escuela de Ingeniería de Sistemas
    <br>Este reporte es una estimación. Valida todos los costos en la consola oficial del proveedor (AWS, Azure, Oracle o Google Cloud) antes de desplegar.
  </p>
</div>

<script>
  // Auto-print when opened in a new tab
  window.addEventListener('load', () => setTimeout(() => window.print(), 500));
</script>
</body>
</html>`;
}

/**
 * Abre el reporte de auditoría en una nueva pestaña y lanza el diálogo de impresión/PDF.
 * @param {string} projectName
 * @param {import('reactflow').Node[]} nodes
 * @param {import('reactflow').Edge[]} edges
 * @param {import('./runAudit.js').AuditResult} auditResult
 * @param {import('./calculateCost.js').CostBreakdown} costBreakdown
 */
export function generateAuditReport(projectName, nodes, edges, auditResult, costBreakdown) {
  const html = buildReportHTML(projectName, nodes, edges, auditResult, costBreakdown);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (!win) {
    alert('Atención: Permite ventanas emergentes para generar el reporte PDF.');
  }
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
