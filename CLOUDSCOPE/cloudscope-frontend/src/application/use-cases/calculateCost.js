/**
 * calculateCost – Use case de dominio.
 * Calcula el costo mensual total estimado de la arquitectura
 * a partir de los nodos presentes en el canvas.
 */

import { getNodeCost, getNodeMeta } from '../../domain/models/CloudNode.js';

/**
 * @typedef {Object} CostBreakdown
 * @property {number} total                  - Costo total en USD/mes
 * @property {CostLineItem[]} lineItems      - Desglose por nodo
 */

/**
 * @typedef {Object} CostLineItem
 * @property {string} nodeId
 * @property {string} label
 * @property {string} type
 * @property {number} cost
 */

/**
 * Calcula el costo mensual estimado total de la arquitectura.
 * @param {import('reactflow').Node[]} nodes
 * @returns {CostBreakdown}
 */
export function calculateCost(nodes) {
  const lineItems = [];
  let total = 0;

  for (const node of nodes) {
    const type = node.data?.cloudType;
    if (!type) continue;

    const meta = getNodeMeta(type);
    if (!meta) continue;

    const cost = getNodeCost(type, node.data?.config ?? {});
    total += cost;

    lineItems.push({
      nodeId: node.id,
      label: node.data.label ?? meta.label,
      type,
      cost,
    });
  }

  return {
    total: Math.round(total * 100) / 100,
    lineItems,
  };
}

/**
 * Formatea un número en USD con 2 decimales.
 * @param {number} amount
 * @returns {string}
 */
export function formatUSD(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
