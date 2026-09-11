/**
 * runBlastRadius – Use case de simulación de Blast Radius.
 * Dado un nodo objetivo, identifica todos los nodos que dependen de él
 * directa o indirectamente (propagación en grafo).
 */

/**
 * @typedef {Object} BlastRadiusResult
 * @property {string} sourceNodeId        - Nodo que falla/cambia
 * @property {string[]} affectedNodeIds   - Nodos impactados (directos + transitivos)
 * @property {string[]} directNodeIds     - Solo los directamente conectados
 * @property {string[]} affectedEdgeIds   - Aristas involucradas en la propagación
 * @property {number} impactScore         - 0-100: qué tan crítica es la afectación
 */

/**
 * Construye un grafo de adyacencia bidireccional.
 * @param {import('reactflow').Edge[]} edges
 * @returns {Map<string, string[]>}
 */
function buildAdjacency(edges) {
  const adj = new Map();
  for (const edge of edges) {
    if (!adj.has(edge.source)) adj.set(edge.source, []);
    if (!adj.has(edge.target)) adj.set(edge.target, []);
    // Propagación: hacia los nodos que DEPENDEN del source (downstream)
    adj.get(edge.source).push(edge.target);
  }
  return adj;
}

/**
 * BFS desde el nodo fuente, siguiendo las aristas downstream.
 * @param {string} sourceId
 * @param {Map<string, string[]>} adj
 * @returns {{ visited: Set<string>, levels: Map<string, number> }}
 */
function bfs(sourceId, adj) {
  const visited = new Set();
  const levels = new Map(); // nodeId → distancia desde source
  const queue = [sourceId];
  visited.add(sourceId);
  levels.set(sourceId, 0);

  while (queue.length > 0) {
    const current = queue.shift();
    const level = levels.get(current);
    const neighbors = adj.get(current) ?? [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        levels.set(neighbor, level + 1);
        queue.push(neighbor);
      }
    }
  }

  return { visited, levels };
}

/**
 * Calcula el blast radius de un nodo en el grafo.
 * @param {string} sourceNodeId
 * @param {import('reactflow').Node[]} nodes
 * @param {import('reactflow').Edge[]} edges
 * @returns {BlastRadiusResult}
 */
export function runBlastRadius(sourceNodeId, nodes, edges) {
  if (!sourceNodeId) {
    return { sourceNodeId: null, affectedNodeIds: [], directNodeIds: [], affectedEdgeIds: [], impactScore: 0 };
  }

  const adj = buildAdjacency(edges);
  const { visited, levels } = bfs(sourceNodeId, adj);

  // Excluir el nodo fuente de los "afectados"
  const affectedNodeIds = [...visited].filter(id => id !== sourceNodeId);

  // Nodos directamente conectados (nivel 1)
  const directNodeIds = [...levels.entries()]
    .filter(([id, level]) => level === 1)
    .map(([id]) => id);

  // Aristas involucradas en la propagación
  const affectedEdgeIds = edges
    .filter(e => visited.has(e.source) && visited.has(e.target))
    .map(e => e.id);

  // Score de impacto: porcentaje de nodos afectados sobre el total
  const totalNodes = nodes.length;
  const impactScore = totalNodes > 1
    ? Math.round((affectedNodeIds.length / (totalNodes - 1)) * 100)
    : 0;

  return {
    sourceNodeId,
    affectedNodeIds,
    directNodeIds,
    affectedEdgeIds,
    impactScore,
  };
}

/**
 * Color del nivel de impacto.
 * @param {number} score 0-100
 */
export function impactColor(score) {
  if (score >= 70) return { text: 'text-red-400', glow: '#ef4444', label: 'Critical' };
  if (score >= 40) return { text: 'text-orange-400', glow: '#f97316', label: 'High' };
  if (score >= 20) return { text: 'text-amber-400', glow: '#f59e0b', label: 'Medium' };
  return { text: 'text-sky-400', glow: '#38bdf8', label: 'Low' };
}
