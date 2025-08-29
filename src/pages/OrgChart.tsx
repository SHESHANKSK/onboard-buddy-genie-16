import React, { useState, useEffect } from 'react';
import CytoscapeComponent from 'react-cytoscapejs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Node {
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

interface Edge {
  source: string;
  target: string;
  relation: string;
}

interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

const OrgChart = () => {
  const [graphData, setGraphData] = useState<GraphData>({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [cy, setCy] = useState<any>(null);

  useEffect(() => {
    fetch('/data/graph.json')
      .then(response => response.json())
      .then((data: GraphData) => setGraphData(data))
      .catch(error => console.error('Error loading graph data:', error));
  }, []);

  const cytoscapeStylesheet = [
    {
      selector: 'node',
      style: {
        'background-color': '#3b82f6',
        'label': 'data(label)',
        'color': '#ffffff',
        'text-valign': 'center',
        'text-halign': 'center',
        'font-size': '12px',
        'width': '60px',
        'height': '60px',
        'border-width': '2px',
        'border-color': '#1d4ed8'
      }
    },
    {
      selector: 'node[type="Person"]',
      style: {
        'background-color': '#3b82f6',
        'border-color': '#1d4ed8'
      }
    },
    {
      selector: 'node[type="Tool"]',
      style: {
        'background-color': '#10b981',
        'border-color': '#059669'
      }
    },
    {
      selector: 'node[type="Doc"]',
      style: {
        'background-color': '#f59e0b',
        'border-color': '#d97706'
      }
    },
    {
      selector: 'edge',
      style: {
        'width': 2,
        'line-color': '#e5e7eb',
        'target-arrow-color': '#e5e7eb',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier'
      }
    },
    {
      selector: ':selected',
      style: {
        'border-width': '4px',
        'border-color': '#ec4899'
      }
    }
  ];

  const cytoscapeElements = [
    ...graphData.nodes.map(node => ({
      data: { id: node.id, label: node.label, type: node.type, ...node }
    })),
    ...graphData.edges.map(edge => ({
      data: { source: edge.source, target: edge.target }
    }))
  ];

  const layout = {
    name: 'cose',
    fit: true,
    padding: 50,
    nodeRepulsion: 400000,
    nodeOverlap: 10,
    idealEdgeLength: 100,
    edgeElasticity: 100,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0
  };

  const handleNodeTap = (event: any) => {
    const node = event.target;
    const nodeData = node.data();
    const nodeInfo = graphData.nodes.find(n => n.id === nodeData.id);
    if (nodeInfo) {
      setSelectedNode(nodeInfo);
    }
  };

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
            <Card className="h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Interactive Org Chart
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[500px] p-0">
                <CytoscapeComponent
                  elements={cytoscapeElements}
                  style={{ width: '100%', height: '100%' }}
                  stylesheet={cytoscapeStylesheet}
                  layout={layout}
                  cy={(cy) => {
                    setCy(cy);
                    cy.on('tap', 'node', handleNodeTap);
                  }}
                />
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