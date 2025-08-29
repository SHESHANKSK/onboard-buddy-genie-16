import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  EdgeProps,
} from '@xyflow/react';

interface CustomEdgeProps extends EdgeProps {
  data?: {
    relation: string;
  };
}

const CustomEdge: React.FC<CustomEdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const getRelationColor = (relation: string) => {
    switch (relation) {
      case 'manages':
        return 'hsl(var(--primary))';
      case 'uses':
        return 'hsl(var(--accent))';
      case 'collaborates_with':
        return 'hsl(var(--warning))';
      case 'references':
      case 'maintains':
      case 'links_to':
        return 'hsl(var(--info))';
      default:
        return 'hsl(var(--muted-foreground))';
    }
  };

  const edgeColor = data?.relation ? getRelationColor(data.relation) : 'hsl(var(--muted-foreground))';

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{ 
          ...style, 
          stroke: edgeColor,
          strokeWidth: 2,
        }} 
      />
      {data?.relation && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 10,
              pointerEvents: 'all',
            }}
            className="bg-background border border-border rounded px-2 py-1 text-xs text-muted-foreground shadow-sm"
          >
            {data.relation.replace(/_/g, ' ')}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

export default CustomEdge;