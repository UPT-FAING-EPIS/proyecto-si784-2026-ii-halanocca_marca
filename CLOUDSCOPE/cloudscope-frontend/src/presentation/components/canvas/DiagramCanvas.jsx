/**
 * DiagramCanvas – Lienzo interactivo principal de CloudScope.
 * Basado en ReactFlow con nodos personalizados AWS y soporte de conexiones.
 * El Drag & Drop se maneja en Editor.jsx (necesita acceso al contexto de ReactFlow).
 */

import React from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';

import CloudNodeComponent from './CloudNode.jsx';
import { getNodeMeta } from '../../../domain/models/CloudNode.js';

/** Tipos de nodos personalizados registrados en ReactFlow */
const NODE_TYPES = {
  cloudNode: CloudNodeComponent,
};

/** Opciones de estilo para las aristas por defecto */
const DEFAULT_EDGE_OPTIONS = {
  style: { stroke: '#475569', strokeWidth: 1.5 },
  markerEnd: { type: 'arrowclosed', color: '#475569' },
};

/**
 * @param {Object} props
 * @param {import('reactflow').Node[]} props.nodes
 * @param {import('reactflow').Edge[]} props.edges
 * @param {Function} props.onNodesChange
 * @param {Function} props.onEdgesChange
 * @param {Function} props.onConnect
 * @param {Function} props.onNodeClick
 * @param {Function} props.onPaneClick
 * @param {Function} props.onDragOver
 */
export default function DiagramCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  onDragOver,
}) {
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={NODE_TYPES}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onPaneClick={onPaneClick}
      onDragOver={onDragOver}
      defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
      fitView
      fitViewOptions={{ padding: 0.2 }}
      minZoom={0.25}
      maxZoom={2.5}
      deleteKeyCode="Delete"
      proOptions={{ hideAttribution: true }}
    >
      {/* Grid de puntos oscuro */}
      <Background
        variant="dots"
        gap={20}
        size={1}
        color="#1e3a5f"
        style={{ backgroundColor: '#0b1120' }}
      />

      {/* Controles de zoom */}
      <Controls
        showInteractive={false}
      />

      {/* Mini mapa */}
      <MiniMap
        nodeColor={(n) => {
          const meta = n.data?.cloudType ? getNodeMeta(n.data.cloudType) : null;
          return meta?.color ?? '#64748b';
        }}
        maskColor="rgba(11,17,32,0.75)"
        style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10 }}
      />
    </ReactFlow>
  );
}
