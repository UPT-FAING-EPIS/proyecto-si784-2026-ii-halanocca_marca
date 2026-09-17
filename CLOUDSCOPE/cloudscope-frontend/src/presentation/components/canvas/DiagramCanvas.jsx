/**
 * DiagramCanvas – Sprint 2: Soporte de Blast Radius (resaltado de nodos afectados).
 * Los nodos y aristas afectadas por el blast radius se resaltan con colores especiales.
 */

import React, { useMemo } from 'react';
import { StopIcon } from '../icons/CloudIcons.jsx';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';

import CloudNodeComponent from './CloudNode.jsx';
import { getNodeMeta } from '../../../domain/models/CloudNode.js';
import { useEditorTheme } from '../../context/EditorThemeContext.jsx';

const NODE_TYPES = { cloudNode: CloudNodeComponent };

/**
 * Aplica estilos de blast radius a nodos y aristas.
 */
function applyBlastStyles(nodes, edges, blastResult) {
  if (!blastResult || !blastResult.sourceNodeId) return { nodes, edges };

  const { sourceNodeId, affectedNodeIds, affectedEdgeIds } = blastResult;
  const affectedSet = new Set(affectedNodeIds);
  const edgeSet = new Set(affectedEdgeIds);

  const styledNodes = nodes.map(n => {
    if (n.id === sourceNodeId) {
      return { ...n, style: { ...n.style, filter: 'drop-shadow(0 0 12px #ef4444) drop-shadow(0 0 6px #ef4444)' } };
    }
    if (affectedSet.has(n.id)) {
      return { ...n, style: { ...n.style, filter: 'drop-shadow(0 0 8px #f97316) opacity(0.9)' } };
    }
    return { ...n, style: { ...n.style, filter: 'opacity(0.25)', transition: 'filter 0.3s ease' } };
  });

  const styledEdges = edges.map(e => {
    if (e.source === sourceNodeId || e.target === sourceNodeId || edgeSet.has(e.id)) {
      return {
        ...e,
        animated: true,
        style: { stroke: e.source === sourceNodeId ? '#ef4444' : '#f97316', strokeWidth: 2.5 },
        markerEnd: { type: 'arrowclosed', color: e.source === sourceNodeId ? '#ef4444' : '#f97316' },
      };
    }
    return { ...e, style: { ...e.style, opacity: 0.15 } };
  });

  return { nodes: styledNodes, edges: styledEdges };
}

export default function DiagramCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  onDragOver,
  blastResult,
  onClearBlast,
}) {
  const { theme, isDark, isLight } = useEditorTheme();

  const defaultEdgeOptions = useMemo(() => ({
    style: { stroke: isLight ? '#94a3b8' : '#475569', strokeWidth: 1.5 },
    markerEnd: { type: 'arrowclosed', color: isLight ? '#94a3b8' : '#475569' },
  }), [isLight]);

  const { nodes: displayNodes, edges: displayEdges } = useMemo(
    () => applyBlastStyles(nodes, edges, blastResult),
    [nodes, edges, blastResult]
  );

  const sourceNode = blastResult?.sourceNodeId
    ? nodes.find(n => n.id === blastResult.sourceNodeId)
    : null;

  return (
    <div className="w-full h-full relative">
      <ReactFlow
        nodes={displayNodes}
        edges={displayEdges}
        nodeTypes={NODE_TYPES}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onDragOver={onDragOver}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.25}
        maxZoom={2.5}
        deleteKeyCode="Delete"
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant="dots"
          gap={20}
          size={isLight ? 1.2 : 1}
          color={isLight ? '#cbd5e1' : '#1e3a5f'}
          style={{ backgroundColor: isLight ? '#f8fafc' : '#0b1120' }}
        />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(n) => {
            const meta = n.data?.cloudType ? getNodeMeta(n.data.cloudType) : null;
            return meta?.color ?? '#64748b';
          }}
          maskColor={isLight ? 'rgba(241,245,249,0.75)' : 'rgba(11,17,32,0.75)'}
          style={{
            background: isLight ? '#ffffff' : '#0f172a',
            border: `1px solid ${isLight ? '#cbd5e1' : '#1e293b'}`,
            borderRadius: 10,
            boxShadow: isLight ? '0 4px 12px rgba(0,0,0,0.06)' : undefined,
          }}
        />
      </ReactFlow>

      {/* Floating HUD: Parar Simulación en Vivo */}
      {blastResult?.sourceNodeId && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 px-4 py-2 rounded-2xl shadow-2xl transition-all"
          style={{
            background: isLight ? 'rgba(255,255,255,0.95)' : 'rgba(15,23,42,0.94)',
            border: '1px solid rgba(239,68,68,0.5)',
            backdropFilter: 'blur(16px)',
            boxShadow: isLight ? '0 10px 25px rgba(239,68,68,0.15)' : '0 0 25px rgba(239,68,68,0.25)',
          }}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping shrink-0" />
          <div className="text-xs">
            <span className={isLight ? 'text-slate-500' : 'text-slate-400'}>Simulación: </span>
            <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-slate-100'}`}>
              {sourceNode?.data?.label ?? 'Componente'}
            </span>
            <span className="text-red-500 font-semibold ml-1.5">
              ({blastResult.affectedNodeIds?.length ?? 0} nodos afectados)
            </span>
          </div>
          <button
            onClick={onClearBlast}
            className="px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-md"
            style={{
              background: 'rgba(239,68,68,0.15)',
              color: '#ef4444',
              border: '1px solid rgba(239,68,68,0.4)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
            title="Detener y limpiar la simulación de impacto"
          >
            <StopIcon className="w-3.5 h-3.5" /> Parar Simulación
          </button>
        </div>
      )}
    </div>
  );
}
