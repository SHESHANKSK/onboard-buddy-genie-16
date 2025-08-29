import React, { useState, useEffect, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Mail, Users, FileText, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import PersonNode from '@/components/org-chart/PersonNode';
import ToolNode from '@/components/org-chart/ToolNode';
import DocNode from '@/components/org-chart/DocNode';
import CustomEdge from '@/components/org-chart/CustomEdge';

interface GraphNode {
  id: string;
  label: string;
  type: string;
  team?: string;
  role?: string;
  email?: string;
  department?: string;
  description?: string;
  url?: string;
}

interface GraphEdge {
  source: string;
  target: string;
  relation: string;
}

interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const nodeTypes = {
  Person: PersonNode,
  Tool: ToolNode,
  Doc: DocNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const OrgChart = () => {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    fetch('/data/graph.json')
      .then(response => response.json())
      .then((data: GraphData) => {
        setGraphData(data);
        
        // Convert graph data to React Flow format
        const flowNodes: Node[] = data.nodes.map((node, index) => ({
          id: node.id,
          type: node.type,
          position: { 
            x: (index % 4) * 300 + 100, 
            y: Math.floor(index / 4) * 200 + 100 
          },
          data: {
            label: node.label,
            role: node.role,
            team: node.team,
            email: node.email,
            department: node.department,
            description: node.description,
            url: node.url,
          },
        }));

        const flowEdges: Edge[] = data.edges.map((edge, index) => ({
          id: `e${index}`,
          source: edge.source,
          target: edge.target,
          type: 'custom',
          data: { relation: edge.relation },
          animated: edge.relation === 'manages',
        }));

        setNodes(flowNodes);
        setEdges(flowEdges);
      })
      .catch(error => console.error('Error loading graph data:', error));
  }, [setNodes, setEdges]);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    const nodeInfo = graphData.nodes.find(n => n.id === node.id);
    if (nodeInfo) {
      setSelectedNode(nodeInfo);
    }
  }, [graphData.nodes]);

  const onNodeDoubleClick = useCallback((event: React.MouseEvent, node: Node) => {
    const nodeInfo = graphData.nodes.find(n => n.id === node.id);
    if (nodeInfo?.email) {
      window.open(`mailto:${nodeInfo.email}`, '_blank');
    } else if (nodeInfo?.url) {
      window.open(nodeInfo.url, '_blank');
    }
  }, [graphData.nodes]);

  const filteredNodes = nodes.filter(node => 
    !searchTerm || 
    node.data.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.data.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.data.team?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEdges = edges.filter(edge =>
    filteredNodes.some(node => node.id === edge.source) &&
    filteredNodes.some(node => node.id === edge.target)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Organization Navigator</h1>
            <p className="text-muted-foreground">Explore your team, tools, and resources</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="h-[700px]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Interactive Org Chart
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search people, roles, teams..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[600px] p-4">
                <ReactFlow
                  nodes={filteredNodes}
                  edges={filteredEdges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onNodeClick={onNodeClick}
                  onNodeDoubleClick={onNodeDoubleClick}
                  nodeTypes={nodeTypes}
                  edgeTypes={edgeTypes}
                  connectionMode={ConnectionMode.Loose}
                  fitView
                  className="bg-gradient-to-br from-background to-secondary/20"
                >
                  <Controls />
                  <MiniMap 
                    className="bg-card border border-border" 
                    maskColor="hsl(var(--muted) / 0.1)"
                    nodeColor={(node) => {
                      switch (node.type) {
                        case 'Person': return 'hsl(var(--primary))';
                        case 'Tool': return 'hsl(var(--accent))';
                        case 'Doc': return 'hsl(var(--warning))';
                        default: return 'hsl(var(--muted-foreground))';
                      }
                    }}
                  />
                  <Background color="hsl(var(--border))" gap={20} />
                </ReactFlow>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <AnimatePresence>
              {selectedNode ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{selectedNode.label}</CardTitle>
                      <Badge variant={selectedNode.type === 'Person' ? 'default' : selectedNode.type === 'Tool' ? 'secondary' : 'outline'}>
                        {selectedNode.type}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {selectedNode.role && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Role</p>
                          <p className="text-sm">{selectedNode.role}</p>
                        </div>
                      )}
                      
                      {selectedNode.team && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Team</p>
                          <p className="text-sm">{selectedNode.team}</p>
                        </div>
                      )}

                      {selectedNode.department && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Department</p>
                          <p className="text-sm">{selectedNode.department}</p>
                        </div>
                      )}

                      {selectedNode.description && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Description</p>
                          <p className="text-sm">{selectedNode.description}</p>
                        </div>
                      )}

                      {selectedNode.email && (
                        <Button variant="outline" size="sm" className="w-full">
                          <Mail className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                      )}

                      {selectedNode.url && (
                        <Button variant="outline" size="sm" className="w-full">
                          <FileText className="w-4 h-4 mr-2" />
                          View Resource
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <Users className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Click on any node to see details</p>
                  </CardContent>
                </Card>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgChart;