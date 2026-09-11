/**
 * What-If Analysis – Use case de comparación de costos.
 * Calcula cuánto costaría cambiar la configuración de un nodo
 * (e.g. cambiar de t3.micro a t3.large en EC2) y muestra el delta.
 */

import { getNodeCost, getNodeMeta, NODE_CATALOG } from '../../domain/models/CloudNode.js';

/**
 * @typedef {Object} WhatIfScenario
 * @property {string} nodeId
 * @property {string} nodeLabel
 * @property {string} cloudType
 * @property {number} currentCost
 * @property {Object} currentConfig
 * @property {Object} alternativeConfig
 * @property {number} alternativeCost
 * @property {number} delta           - alternativeCost - currentCost (positivo = más caro)
 * @property {number} annualDelta     - delta * 12
 */

/**
 * Calcula el what-if para un nodo cambiando parte de su configuración.
 * @param {import('reactflow').Node} node
 * @param {Object} alternativeConfig   - Config alternativa a comparar
 * @returns {WhatIfScenario}
 */
export function computeWhatIf(node, alternativeConfig) {
  const type = node.data?.cloudType;
  const currentConfig = node.data?.config ?? {};
  const currentCost = getNodeCost(type, currentConfig);
  const mergedAlt = { ...currentConfig, ...alternativeConfig };
  const alternativeCost = getNodeCost(type, mergedAlt);
  const delta = alternativeCost - currentCost;

  return {
    nodeId: node.id,
    nodeLabel: node.data?.label ?? type,
    cloudType: type,
    currentCost,
    currentConfig,
    alternativeConfig: mergedAlt,
    alternativeCost,
    delta,
    annualDelta: delta * 12,
  };
}

/**
 * Genera escenarios what-if automáticos para todos los nodos del diagrama.
 * Para cada nodo propone la configuración alternativa más común (upgrade o downgrade).
 * @param {import('reactflow').Node[]} nodes
 * @returns {WhatIfScenario[]}
 */
export function generateAutoWhatIf(nodes) {
  const scenarios = [];

  const EC2_TIERS = ['t3.micro', 't3.small', 't3.medium', 't3.large', 't3.xlarge', 't3.2xlarge', 'm5.large', 'm5.xlarge'];
  const RDS_TIERS = ['db.t3.micro', 'db.t3.small', 'db.t3.medium', 'db.t3.large', 'db.r5.large'];

  for (const node of nodes) {
    const type = node.data?.cloudType;
    const config = node.data?.config ?? {};

    if (type === 'ec2') {
      const currentIdx = EC2_TIERS.indexOf(config.instanceType ?? 't3.micro');
      // Proponer el siguiente nivel (upgrade)
      const upgradeIdx = Math.min(currentIdx + 1, EC2_TIERS.length - 1);
      // Proponer el nivel anterior (downgrade)
      const downgradeIdx = Math.max(currentIdx - 1, 0);

      if (upgradeIdx !== currentIdx) {
        scenarios.push({
          ...computeWhatIf(node, { instanceType: EC2_TIERS[upgradeIdx] }),
          label: `Upgrade EC2 → ${EC2_TIERS[upgradeIdx]}`,
        });
      }
      if (downgradeIdx !== currentIdx) {
        scenarios.push({
          ...computeWhatIf(node, { instanceType: EC2_TIERS[downgradeIdx] }),
          label: `Downgrade EC2 → ${EC2_TIERS[downgradeIdx]}`,
        });
      }
    }

    if (type === 'rds') {
      const currentIdx = RDS_TIERS.indexOf(config.instanceClass ?? 'db.t3.micro');
      const upgradeIdx = Math.min(currentIdx + 1, RDS_TIERS.length - 1);

      if (upgradeIdx !== currentIdx) {
        scenarios.push({
          ...computeWhatIf(node, { instanceClass: RDS_TIERS[upgradeIdx] }),
          label: `Upgrade RDS → ${RDS_TIERS[upgradeIdx]}`,
        });
      }

      // Multi-AZ what-if
      if (!config.multiAz) {
        scenarios.push({
          ...computeWhatIf(node, { multiAz: true }),
          label: `Habilitar Multi-AZ en ${node.data?.label ?? 'RDS'}`,
        });
      }
    }

    if (type === 's3') {
      if (!config.versioning) {
        scenarios.push({
          ...computeWhatIf(node, { versioning: true }),
          label: `Habilitar S3 Versioning en ${node.data?.label ?? 'S3'}`,
        });
      }
    }
  }

  return scenarios;
}

/**
 * Formatea la diferencia de costo con signo y color.
 * @param {number} delta
 */
export function formatDelta(delta) {
  const sign = delta > 0 ? '+' : '';
  const color = delta > 0 ? '#f87171' : delta < 0 ? '#34d399' : '#94a3b8';
  const formatted = `${sign}$${Math.abs(delta).toFixed(2)}/mo`;
  return { formatted, color };
}
