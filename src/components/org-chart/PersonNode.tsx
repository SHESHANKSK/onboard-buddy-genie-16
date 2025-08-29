import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, Mail } from 'lucide-react';

interface PersonNodeProps {
  data: {
    label: string;
    role: string;
    team: string;
    email: string;
    department: string;
  };
}

const PersonNode: React.FC<PersonNodeProps> = ({ data }) => {
  const initials = data.label
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase();

  return (
    <div className="bg-card border border-border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow min-w-[200px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-center gap-3 mb-3">
        <Avatar className="w-12 h-12">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-foreground truncate">
            {data.label}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {data.role}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Badge variant="secondary" className="text-xs">
          {data.team}
        </Badge>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <User className="w-3 h-3" />
          <span className="truncate">{data.department}</span>
        </div>
        
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Mail className="w-3 h-3" />
          <span className="truncate">{data.email}</span>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default memo(PersonNode);