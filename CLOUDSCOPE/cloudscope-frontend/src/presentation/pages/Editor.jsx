/**
 * Editor – Sprint 2: Blast Radius + Save modal + keyboard shortcut Ctrl+S.
 */

import React, { useState, useCallback, useEffect } from 'react';
import { ReactFlowProvider, useReactFlow } from 'reactflow';
import { useNavigate } from 'react-router-dom';

import Header from '../components/layout/Header.jsx';
import LeftSidebar from '../components/sidebar/LeftSidebar.jsx';
import RightSidebar from '../components/sidebar/RightSidebar.jsx';
import DiagramCanvas from '../components/canvas/DiagramCanvas.jsx';
import SaveProjectModal from '../components/modals/SaveProjectModal.jsx';

import { useDiagram } from '../hooks/useDiagram.js';
import { getNodeMeta } from '../../domain/models/CloudNode.js';
import { runBlastRadius } from '../../application/use-cases/runBlastRadius.js';

function EditorInner() {
  const rfInstance = useReactFlow();
  const navigate = useNavigate();

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

  // ─── Estado de Blast Radius ───────────────────────────────────────────────
  const [blastResult, setBlastResult] = useState(null);

  const handleSimulateBlast = useCallback((nodeId) => {
    const result = runBlastRadius(nodeId, nodes, edges);
    setBlastResult(result);
  }, [nodes, edges]);

  const handleClearBlast = useCallback(() => setBlastResult(null), []);

  // ─── Estado del modal de guardado ─────────────────────────────────────────
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Ctrl+S → abrir modal
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setShowSaveModal(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // ─── Drop handler ─────────────────────────────────────────────────────────
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

      // Limpiar blast cuando se agrega un nodo
      setBlastResult(null);
    },
    [rfInstance, addNode]
  );

  // Limpiar blast cuando cambia la topología
  useEffect(() => {
    if (blastResult) setBlastResult(null);
  }, [nodes.length, edges.length]);

  return (
    <div className="flex flex-col overflow-hidden select-none"
      style={{ height: '100vh', background: '#0b1120', color: '#f8fafc' }}>

      <Header
        costBreakdown={costBreakdown}
        auditResult={auditResult}
        onExportIaC={exportTerraform}
        onSave={() => setShowSaveModal(true)}
        blastActive={!!blastResult}
        onClearBlast={handleClearBlast}
      />

      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />

        <main className="flex-1 relative overflow-hidden"
          onDrop={handleDrop}
          onDragOver={onDragOver}>
          <DiagramCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDragOver={onDragOver}
            blastResult={blastResult}
          />

          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center opacity-25">
                <div className="text-5xl mb-3">⬡</div>
                <p className="text-sm" style={{ color: '#64748b' }}>Arrastra servicios desde el panel izquierdo</p>
              </div>
            </div>
          )}
        </main>

        <RightSidebar
          selectedNode={selectedNode}
          updateNodeConfig={updateNodeConfig}
          updateNodeLabel={updateNodeLabel}
          deleteNode={deleteNode}
          auditResult={auditResult}
          costBreakdown={costBreakdown}
          blastResult={blastResult}
          nodes={nodes}
          onSimulateBlast={handleSimulateBlast}
          onClearBlast={handleClearBlast}
        />
      </div>

      {/* Modal de guardado */}
      {showSaveModal && (
        <SaveProjectModal
          nodes={nodes}
          edges={edges}
          onClose={() => setShowSaveModal(false)}
          onSaved={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
}

export default function Editor() {
  return (
    <ReactFlowProvider>
      <EditorInner />
    </ReactFlowProvider>
  );
}
