/**
 * useDiagram – Hook centralizado para el estado del diagrama CloudScope.
 * Gestiona nodos, aristas, nodo seleccionado, costo y auditoría de seguridad.
 */

import { useState, useCallback, useMemo } from 'react';
import {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';

import { calculateCost } from '../../application/use-cases/calculateCost.js';
import { runAudit } from '../../application/use-cases/runAudit.js';
import { generateTerraform, downloadTerraform } from '../../application/use-cases/generateTerraform.js';
import { getCurrentProject } from '../../infrastructure/api/projectStorage.js';

/** Contador global para generar IDs únicos de nodos */
let nodeCounter = 0;

function generateNodeId() {
  return `node_${Date.now()}_${++nodeCounter}`;
}

/** Nodos de ejemplo para el canvas inicial */
const INITIAL_NODES = [
  {
    id: 'demo_vpc',
    type: 'cloudNode',
    position: { x: 250, y: 80 },
    data: {
      cloudType: 'vpc',
      label: 'Production VPC',
      config: { cidr: '10.0.0.0/16', enableDnsHostnames: true },
    },
  },
  {
    id: 'demo_subnet_pub',
    type: 'cloudNode',
    position: { x: 80, y: 230 },
    data: {
      cloudType: 'subnet',
      label: 'Public Subnet',
      config: { cidr: '10.0.1.0/24', isPublic: true, availabilityZone: 'us-east-1a' },
    },
  },
  {
    id: 'demo_subnet_priv',
    type: 'cloudNode',
    position: { x: 420, y: 230 },
    data: {
      cloudType: 'subnet',
      label: 'Private Subnet',
      config: { cidr: '10.0.2.0/24', isPublic: false, availabilityZone: 'us-east-1b' },
    },
  },
  {
    id: 'demo_ec2',
    type: 'cloudNode',
    position: { x: 80, y: 380 },
    data: {
      cloudType: 'ec2',
      label: 'App Server',
      config: { instanceType: 't3.medium', os: 'Amazon Linux 2' },
    },
  },
  {
    id: 'demo_rds',
    type: 'cloudNode',
    position: { x: 420, y: 380 },
    data: {
      cloudType: 'rds',
      label: 'Primary DB',
      config: { engine: 'postgres', instanceClass: 'db.t3.micro', multiAz: false, publiclyAccessible: false },
    },
  },
];

const INITIAL_EDGES = [
  { id: 'e_vpc_pub', source: 'demo_vpc', target: 'demo_subnet_pub', animated: false, style: { stroke: '#8b5cf6', strokeWidth: 1.5 } },
  { id: 'e_vpc_priv', source: 'demo_vpc', target: 'demo_subnet_priv', animated: false, style: { stroke: '#8b5cf6', strokeWidth: 1.5 } },
  { id: 'e_pub_ec2', source: 'demo_subnet_pub', target: 'demo_ec2', animated: true, style: { stroke: '#f97316', strokeWidth: 1.5 } },
  { id: 'e_priv_rds', source: 'demo_subnet_priv', target: 'demo_rds', animated: false, style: { stroke: '#3b82f6', strokeWidth: 1.5 } },
  { id: 'e_ec2_rds', source: 'demo_ec2', target: 'demo_rds', animated: false, style: { stroke: '#64748b', strokeWidth: 1.5, strokeDasharray: '5,3' } },
];

export function useDiagram() {
  const activeProj = useMemo(() => getCurrentProject(), []);
  const [nodes, setNodes] = useState(() => activeProj?.nodes ?? INITIAL_NODES);
  const [edges, setEdges] = useState(() => activeProj?.edges ?? INITIAL_EDGES);
  const [selectedNode, setSelectedNode] = useState(null);

  // ─── Historial para Deshacer / Rehacer (Atrás / Adelante) ──────────────────
  const [historyPast, setHistoryPast] = useState([]);
  const [historyFuture, setHistoryFuture] = useState([]);

  const pushToHistory = useCallback((currentNodes, currentEdges) => {
    setHistoryPast((prev) => {
      const next = [...prev, { nodes: currentNodes, edges: currentEdges }];
      if (next.length > 30) next.shift(); // límite de 30 pasos
      return next;
    });
    setHistoryFuture([]); // limpiar futuro al haber nueva acción
  }, []);

  const undo = useCallback(() => {
    setHistoryPast((prevPast) => {
      if (prevPast.length === 0) return prevPast;
      const previous = prevPast[prevPast.length - 1];
      const newPast = prevPast.slice(0, prevPast.length - 1);

      setHistoryFuture((prevFuture) => [{ nodes, edges }, ...prevFuture]);
      setNodes(previous.nodes);
      setEdges(previous.edges);
      setSelectedNode((curr) => {
        if (!curr) return null;
        return previous.nodes.find((n) => n.id === curr.id) ?? null;
      });
      return newPast;
    });
  }, [nodes, edges]);

  const redo = useCallback(() => {
    setHistoryFuture((prevFuture) => {
      if (prevFuture.length === 0) return prevFuture;
      const next = prevFuture[0];
      const newFuture = prevFuture.slice(1);

      setHistoryPast((prevPast) => [...prevPast, { nodes, edges }]);
      setNodes(next.nodes);
      setEdges(next.edges);
      setSelectedNode((curr) => {
        if (!curr) return null;
        return next.nodes.find((n) => n.id === curr.id) ?? null;
      });
      return newFuture;
    });
  }, [nodes, edges]);

  const canUndo = historyPast.length > 0;
  const canRedo = historyFuture.length > 0;

  // ─── ReactFlow handlers ────────────────────────────────────────────────────
  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params) => {
      setNodes((currNodes) => {
        setEdges((currEdges) => {
          pushToHistory(currNodes, currEdges);
          return addEdge({
            ...params,
            animated: false,
            style: { stroke: '#475569', strokeWidth: 1.5 },
          }, currEdges);
        });
        return currNodes;
      });
    },
    [pushToHistory]
  );

  const onNodeClick = useCallback((_event, node) => {
    setSelectedNode(node);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // ─── Drag & Drop: solo exponer addNode para que Editor.jsx lo llame ─────────
  const addNode = useCallback((newNode) => {
    setNodes((currNodes) => {
      setEdges((currEdges) => {
        pushToHistory(currNodes, currEdges);
        return currEdges;
      });
      return currNodes.concat(newNode);
    });
  }, [pushToHistory]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  // ─── Actualizar config de un nodo ─────────────────────────────────────────
  const updateNodeConfig = useCallback((nodeId, newConfig) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== nodeId) return n;
        return {
          ...n,
          data: {
            ...n.data,
            config: { ...n.data.config, ...newConfig },
          },
        };
      })
    );
    // Actualizar también el nodo seleccionado
    setSelectedNode((prev) => {
      if (!prev || prev.id !== nodeId) return prev;
      return {
        ...prev,
        data: {
          ...prev.data,
          config: { ...prev.data.config, ...newConfig },
        },
      };
    });
  }, []);

  const updateNodeLabel = useCallback((nodeId, label) => {
    setNodes((nds) =>
      nds.map((n) => n.id !== nodeId ? n : { ...n, data: { ...n.data, label } })
    );
    setSelectedNode((prev) => {
      if (!prev || prev.id !== nodeId) return prev;
      return { ...prev, data: { ...prev.data, label } };
    });
  }, []);

  const deleteNode = useCallback((nodeId) => {
    setNodes((currNodes) => {
      setEdges((currEdges) => {
        pushToHistory(currNodes, currEdges);
        return currEdges.filter((e) => e.source !== nodeId && e.target !== nodeId);
      });
      return currNodes.filter((n) => n.id !== nodeId);
    });
    setSelectedNode((prev) => prev?.id === nodeId ? null : prev);
  }, [pushToHistory]);

  // ─── Costo y auditoría (calculados en tiempo real) ────────────────────────
  const costBreakdown = useMemo(() => calculateCost(nodes), [nodes]);
  const auditResult = useMemo(() => runAudit(nodes, edges), [nodes, edges]);

  // ─── Export IaC ──────────────────────────────────────────────────────────
  const exportTerraform = useCallback(() => {
    const curProj = getCurrentProject();
    const projectName = curProj?.name ?? 'CloudScope Architecture';
    const filename = `${projectName.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}_main.tf`;
    const hcl = generateTerraform(nodes, edges, projectName);
    downloadTerraform(hcl, filename);
  }, [nodes, edges]);

  // ─── Cargar o limpiar diagrama ───────────────────────────────────────────
  const loadDiagram = useCallback((newNodes, newEdges) => {
    setNodes((currNodes) => {
      setEdges((currEdges) => {
        pushToHistory(currNodes, currEdges);
        return newEdges ?? [];
      });
      return newNodes ?? [];
    });
    setSelectedNode(null);
  }, [pushToHistory]);

  const clearDiagram = useCallback(() => {
    setNodes((currNodes) => {
      setEdges((currEdges) => {
        pushToHistory(currNodes, currEdges);
        return [];
      });
      return [];
    });
    setSelectedNode(null);
  }, [pushToHistory]);

  return {
    // Estado del grafo
    nodes,
    edges,
    selectedNode,
    // Handlers de ReactFlow
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onPaneClick,
    addNode,
    onDragOver,
    // Acciones de nodos
    updateNodeConfig,
    updateNodeLabel,
    deleteNode,
    loadDiagram,
    clearDiagram,
    // Deshacer / Rehacer (Atrás / Adelante)
    undo,
    redo,
    canUndo,
    canRedo,
    // Datos derivados
    costBreakdown,
    auditResult,
    // Acciones de exportación
    exportTerraform,
  };
}
