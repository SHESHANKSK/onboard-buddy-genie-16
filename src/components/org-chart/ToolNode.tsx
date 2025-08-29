import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Badge } from '@/components/ui/badge';
import { Settings, ExternalLink } from 'lucide-react';

interface ToolNodeProps {
  data: {
    label: string;
    description: string;
    url?: string;
  };
}

const ToolNode: React.FC<ToolNodeProps> = ({ data }) => {
  return (
    <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow min-w-[180px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
          <Settings className="w-5 h-5 text-accent" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground truncate">
            {data.label}
          </h3>
          <Badge variant="outline" className="text-xs mt-1">
            Tool
          </Badge>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
        {data.description}
      </p>
      
      {data.url && (
        <div className="flex items-center gap-1 text-xs text-accent">
          <ExternalLink className="w-3 h-3" />
          <span className="truncate">Access Tool</span>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default memo(ToolNode);