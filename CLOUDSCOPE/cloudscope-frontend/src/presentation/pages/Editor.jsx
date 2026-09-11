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
import { generateAuditReport } from '../../application/use-cases/generateAuditReport.js';
import { ARCHITECTURE_PRESETS } from '../../domain/models/ArchitecturePresets.js';

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
    loadDiagram, clearDiagram,
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

  // Exportar reporte de auditoría a PDF (RF-11)
  const handleExportPDF = useCallback(() => {
    const curProjRaw = localStorage.getItem('cs_current_project');
    const curProj = curProjRaw ? JSON.parse(curProjRaw) : null;
    const projectName = curProj?.name ?? 'Arquitectura CloudScope';
    generateAuditReport(projectName, nodes, edges, auditResult, costBreakdown);
  }, [nodes, edges, auditResult, costBreakdown]);

  return (
    <div className="flex flex-col overflow-hidden select-none"
      style={{ height: '100vh', background: '#0b1120', color: '#f8fafc' }}>

      <Header
        costBreakdown={costBreakdown}
        auditResult={auditResult}
        onExportIaC={exportTerraform}
        onExportPDF={handleExportPDF}
        onSave={() => setShowSaveModal(true)}
        blastActive={!!blastResult}
        onClearBlast={handleClearBlast}
        onLoadPreset={(preset) => loadDiagram(preset.nodes, preset.edges)}
        onClearCanvas={clearDiagram}
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
            onClearBlast={handleClearBlast}
          />

          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center p-6 pointer-events-none z-10">
              <div
                className="max-w-xl w-full p-6 rounded-2xl text-center pointer-events-auto shadow-2xl"
                style={{
                  background: 'rgba(15,23,42,0.92)',
                  border: '1px solid #1e293b',
                  backdropFilter: 'blur(16px)',
                }}
              >
                <div
                  className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center font-black text-xl shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', color: '#0b1120' }}
                >
                  CS
                </div>
                <h2 className="text-base font-bold text-white mb-1">Diseña tu Arquitectura Cloud</h2>
                <p className="text-xs text-slate-400 mb-5 max-w-md mx-auto leading-relaxed">
                  Arrastra servicios desde el panel izquierdo o carga una plantilla empresarial para explorar costos y auditoría en tiempo real:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-left">
                  {ARCHITECTURE_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => loadDiagram(p.nodes, p.edges)}
                      className="p-3 rounded-xl text-left transition-all border group"
                      style={{ background: '#0b1120', borderColor: '#1e293b' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = p.color;
                        e.currentTarget.style.background = '#1e293b';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#1e293b';
                        e.currentTarget.style.background = '#0b1120';
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-200 group-hover:text-white truncate">
                          {p.name}
                        </span>
                        <span
                          className="text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0"
                          style={{ color: p.color, background: `${p.color}20` }}
                        >
                          {p.badge ?? p.provider}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                        {p.description}
                      </p>
                    </button>
                  ))}
                </div>
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
          onExportPDF={handleExportPDF}
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
