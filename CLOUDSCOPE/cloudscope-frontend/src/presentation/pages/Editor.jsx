/**
 * Editor – Página principal de CloudScope Studio.
 * Monta el layout completo: Header + LeftSidebar + Canvas + RightSidebar.
 * Gestiona el estado centralizado del diagrama a través de useDiagram.
 */

import React, { useRef, useCallback } from 'react';
import { ReactFlowProvider, useReactFlow } from 'reactflow';

import Header from '../components/layout/Header.jsx';
import LeftSidebar from '../components/sidebar/LeftSidebar.jsx';
import RightSidebar from '../components/sidebar/RightSidebar.jsx';
import DiagramCanvas from '../components/canvas/DiagramCanvas.jsx';

import { useDiagram } from '../hooks/useDiagram.js';
import { getNodeMeta } from '../../domain/models/CloudNode.js';

/**
 * Inner component that has access to the ReactFlow context.
 * Needed so that onDrop can use useReactFlow().
 */
function EditorInner() {
  const rfInstance = useReactFlow();

  const {
    nodes, edges,
    selectedNode,
    onNodesChange, onEdgesChange, onConnect,
    onNodeClick, onPaneClick,
    addNode, onDragOver,
    updateNodeConfig, updateNodeLabel, deleteNode,
    costBreakdown, auditResult,
    exportTerraform,
  } = useDiagram();

  /** Drop handler – necesita rfInstance para convertir coordenadas */
  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      const cloudType = event.dataTransfer.getData('application/cloudscope/nodetype');
      if (!cloudType) return;

      const meta = getNodeMeta(cloudType);
      if (!meta) return;

      const position = rfInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const defaultConfig = {};
      for (const [key, schema] of Object.entries(meta.configSchema ?? {})) {
        defaultConfig[key] = schema.default;
      }

      addNode({
        id: `node_${Date.now()}`,
        type: 'cloudNode',
        position,
        data: { cloudType, label: meta.label, config: defaultConfig },
      });
    },
    [rfInstance, addNode]
  );

  return (
    <div
      className="flex flex-col overflow-hidden select-none"
      style={{ height: '100vh', background: '#0b1120', color: '#f8fafc' }}
    >
      {/* ── Header ── */}
      <Header
        costBreakdown={costBreakdown}
        auditResult={auditResult}
        onExportIaC={exportTerraform}
      />

      {/* ── Workspace ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Paleta izquierda */}
        <LeftSidebar />

        {/* Canvas central */}
        <main
          className="flex-1 relative overflow-hidden"
          onDrop={handleDrop}
          onDragOver={onDragOver}
        >
          <DiagramCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDragOver={onDragOver}
          />

          {/* Hint flotante cuando el canvas está vacío */}
          {nodes.length === 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="text-center opacity-30">
                <div className="text-5xl mb-3">⬡</div>
                <p className="text-sm text-slate-400">Drag services from the left panel</p>
              </div>
            </div>
          )}
        </main>

        {/* Panel derecho */}
        <RightSidebar
          selectedNode={selectedNode}
          updateNodeConfig={updateNodeConfig}
          updateNodeLabel={updateNodeLabel}
          deleteNode={deleteNode}
          auditResult={auditResult}
          costBreakdown={costBreakdown}
        />
      </div>
    </div>
  );
}

/**
 * Editor – envuelto en ReactFlowProvider para proveer el contexto.
 */
export default function Editor() {
  return (
    <ReactFlowProvider>
      <EditorInner />
    </ReactFlowProvider>
  );
}
