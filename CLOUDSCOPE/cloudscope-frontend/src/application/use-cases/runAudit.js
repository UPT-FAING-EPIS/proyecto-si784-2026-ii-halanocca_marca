/**
 * runAudit – Use case de auditoría de seguridad.
 * Ejecuta todas las reglas de seguridad contra el grafo actual
 * y devuelve los hallazgos ordenados por severidad.
 */

import { SECURITY_RULES } from '../../domain/models/SecurityRule.js';

const SEVERITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3, INFO: 4 };

/**
 * @typedef {import('../../domain/models/SecurityRule.js').SecurityFinding} SecurityFinding
 */

/**
 * @typedef {Object} AuditResult
 * @property {SecurityFinding[]} findings  - Lista de hallazgos, ordenados por severidad
 * @property {number} score                - Puntuación de seguridad 0-100
 * @property {number} critical             - Cantidad de hallazgos CRITICAL
 * @property {number} high                 - Cantidad de hallazgos HIGH
 * @property {number} medium               - Cantidad de hallazgos MEDIUM
 * @property {number} total                - Total de hallazgos
 */

/**
 * Ejecuta el motor de auditoría de seguridad contra el grafo.
 * @param {import('reactflow').Node[]} nodes
 * @param {import('reactflow').Edge[]} edges
 * @returns {AuditResult}
 */
export function runAudit(nodes, edges) {
  const allFindings = [];

  for (const rule of SECURITY_RULES) {
    try {
      const findings = rule.evaluate(nodes, edges);
      allFindings.push(...findings);
    } catch (err) {
      console.warn(`[Audit] Error evaluating rule ${rule.id}:`, err);
    }
  }

  // Ordenar por severidad
  allFindings.sort((a, b) => {
    const orderA = SEVERITY_ORDER[a.severity] ?? 99;
    const orderB = SEVERITY_ORDER[b.severity] ?? 99;
    return orderA - orderB;
  });

  const critical = allFindings.filter(f => f.severity === 'CRITICAL').length;
  const high = allFindings.filter(f => f.severity === 'HIGH').length;
  const medium = allFindings.filter(f => f.severity === 'MEDIUM').length;

  // Score: penaliza CRITICAL -20, HIGH -10, MEDIUM -5
  const penalty = critical * 20 + high * 10 + medium * 5;
  const score = Math.max(0, 100 - penalty);

  return {
    findings: allFindings,
    score,
    critical,
    high,
    medium,
    total: allFindings.length,
  };
}

/**
 * Obtiene los findings que corresponden a un nodo específico.
 * @param {SecurityFinding[]} findings
 * @param {string} nodeId
 * @returns {SecurityFinding[]}
 */
export function findingsForNode(findings, nodeId) {
  return findings.filter(f => f.nodeId === nodeId);
}
