import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { getNodeMeta } from '../../../domain/models/CloudNode.js';
import { getNodeCost } from '../../../domain/models/CloudNode.js';
import { getServiceIcon, AwsLogo, AzureLogo, GcpLogo } from '../icons/CloudIcons.jsx';

const CloudNodeComponent = memo(({ data, selected }) => {
  const meta = getNodeMeta(data.cloudType);
  if (!meta) return null;

  const cost = getNodeCost(data.cloudType, data.config ?? {});
  const hasFinOps = cost > 0;

  return (
    <div
      style={{
        borderColor: selected ? meta.color : meta.borderColor,
        boxShadow: selected
          ? `0 0 0 2px ${meta.color}55, 0 4px 20px ${meta.color}22`
          : `0 2px 8px rgba(0,0,0,0.3)`,
        transition: 'all 0.15s ease',
      }}
      className="min-w-[145px] rounded-xl border-2 bg-slate-900 overflow-hidden"
    >
      {/* Header del nodo */}
      <div
        style={{ backgroundColor: meta.bgColor, borderBottom: `1px solid ${meta.borderColor}` }}
        className="px-3 py-2 flex items-center gap-2.5"
      >
        {/* Icono Vectorial Oficial del Servicio */}
        <div
          style={{
            backgroundColor: `${meta.color}18`,
            borderColor: `${meta.color}40`,
            color: meta.color,
          }}
          className="w-8 h-8 rounded-lg border flex items-center justify-center font-bold shrink-0 select-none shadow-sm"
          title={`${meta.label} (${meta.provider.toUpperCase()})`}
        >
          {getServiceIcon(data.cloudType, "w-4 h-4", meta.color)}
        </div>

        {/* Nombre y tipo con Logo Oficial del Proveedor */}
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold text-slate-100 truncate leading-tight">
            {data.label}
          </div>
          <div className="flex items-center gap-1 mt-0.5">
            {meta.provider === 'aws' ? (
              <AwsLogo className="w-2.5 h-2.5 shrink-0 opacity-90" />
            ) : meta.provider === 'azure' ? (
              <AzureLogo className="w-2.5 h-2.5 shrink-0 opacity-90" />
            ) : meta.provider === 'gcp' ? (
              <GcpLogo className="w-2.5 h-2.5 shrink-0 opacity-90" />
            ) : null}
            <span className="text-[8px] text-slate-400 truncate leading-tight uppercase font-medium">
              {meta.provider} • {meta.category}
            </span>
          </div>
        </div>
      </div>

      {/* Footer con costo */}
      {hasFinOps && (
        <div className="px-3 py-1.5 flex items-center justify-between bg-slate-950/60">
          <span className="text-[9px] text-slate-500 uppercase tracking-wider">FinOps</span>
          <span
            style={{ color: '#34d399' }}
            className="text-[10px] font-mono font-semibold"
          >
            ${cost.toFixed(2)}/mo
          </span>
        </div>
      )}

      {/* Handles de conexión */}
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: meta.color,
          border: `2px solid #1e293b`,
          width: 10,
          height: 10,
        }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: meta.color,
          border: `2px solid #1e293b`,
          width: 10,
          height: 10,
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        style={{
          background: meta.color,
          border: `2px solid #1e293b`,
          width: 10,
          height: 10,
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        style={{
          background: meta.color,
          border: `2px solid #1e293b`,
          width: 10,
          height: 10,
        }}
      />
    </div>
  );
});

CloudNodeComponent.displayName = 'CloudNode';

export default CloudNodeComponent;
